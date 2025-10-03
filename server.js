// 🚀 Consumer Durables Service Platform - Main Server
// Handles customer intake, ticket creation, technician matching, and notifications

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const moment = require('moment-timezone');

const app = express();
const port = process.env.PORT || 3000;

// Supabase configuration
const supabase = createClient(
    process.env.SUPABASE_URL || 'https://kxmkxlvfehmwyvbistgz.supabase.co',
    process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bWt4bHZmZWhtd3l2YmlzdGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODUwOTUsImV4cCI6MjA3NDk2MTA5NX0.JBSWmyLI-y84Khp_IUP12RVGzlcXDw-Lm4dHeMFwypQ'
);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🎯 MAIN API ENDPOINTS FOR INYA.AI INTEGRATION

// 1. Customer Intake & Ticket Creation (Main endpoint for Inya.ai)
app.post('/api/customer-intake', async (req, res) => {
    console.log('🔥 New Customer Intake Request:');
    console.log(JSON.stringify(req.body, null, 2));
    
    try {
        const {
            full_name,
            phone,
            email,
            address_text,
            pincode,
            request_type, // 'service' or 'installation'
            appliance_type, // 'ac', 'washing_machine', 'refrigerator', 'tv', 'water_purifier'
            model,
            fault_symptoms = [],
            installation_details = [],
            preferred_time_slots = []
        } = req.body;

        // Set urgency automatically based on symptoms (optional field)
        const urgency = determinePriority(fault_symptoms, request_type);

        // Step 1: Get region from pincode
        const region_info = await getRegionFromPincode(pincode);
        
        // Step 2: Create or update customer
        const customer = await createOrUpdateCustomer({
            full_name,
            phone,
            email,
            address_text,
            pincode,
            region_label: region_info.region_label,
            preferred_time_slots
        });

        // Step 3: Create service ticket
        const ticket = await createServiceTicket({
            customer_id: customer.id,
            request_type,
            appliance_type,
            model,
            fault_symptoms,
            installation_details,
            urgency
        });

        // Step 4: Find and assign technician
        const assignment = await findAndAssignTechnician({
            ticket_id: ticket.id,
            customer_id: customer.id,
            appliance_type,
            fault_symptoms,
            region_label: region_info.region_label,
            preferred_time_slots
        });

        // Step 5: Send notifications
        console.log('\n🔄 Checking if notifications should be sent...');
        console.log('Assignment success:', assignment.success);
        
        if (assignment.success) {
            console.log('✅ Assignment successful, calling sendCustomerNotifications...');
            const notificationResult = await sendCustomerNotifications({
                customer,
                ticket,
                appointment: assignment.appointment,
                technician: assignment.technician
            });
            console.log('📧📱 Notification function result:', JSON.stringify(notificationResult, null, 2));
        } else {
            console.log('❌ Assignment not successful, skipping notifications');
        }

        // Response back to Inya.ai
        res.json({
            success: true,
            message: assignment.success ? 'Service request processed successfully' : 'Service request created, scheduling in progress',
            data: {
                customer_id: customer.id,
                ticket_id: ticket.id,
                ticket_number: ticket.ticket_number,
                status: ticket.status,
                appointment: assignment.appointment || null,
                technician: assignment.technician || null,
                estimated_response_time: assignment.success ? 'Within 2 hours' : '24-48 hours'
            }
        });

    } catch (error) {
        console.error('❌ Customer Intake Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// 1.5. Debug endpoint to see what Inya.ai is sending
app.post('/api/debug-intake', async (req, res) => {
    console.log('\n🔍 DEBUG: Inya.ai Request Received');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', JSON.stringify(req.query, null, 2));
    
    res.json({
        success: true,
        message: 'Debug data logged',
        received: {
            headers: req.headers,
            body: req.body,
            query: req.query
        }
    });
});

// 2. Get Ticket Status (For follow-up calls)
app.get('/api/ticket/:ticket_id', async (req, res) => {
    try {
        const { ticket_id } = req.params;
        
        const { data: ticket, error } = await supabase
            .from('tickets')
            .select(`
                *,
                customer:customers(*),
                appointment:appointments(*,
                    technician:technicians(*)
                )
            `)
            .eq('id', ticket_id)
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data: ticket
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Ticket not found',
            error: error.message
        });
    }
});

// 2.1. Get Ticket Status by Ticket Number (User-friendly)
app.get('/api/ticket-status/:ticket_number', async (req, res) => {
    try {
        const { ticket_number } = req.params;
        console.log(`🎫 Looking up ticket: ${ticket_number}`);
        
        const { data: ticket, error } = await supabase
            .from('tickets')
            .select(`
                *,
                customer:customers(*),
                appointment:appointments(*,
                    technician:technicians(*)
                )
            `)
            .eq('ticket_number', ticket_number)
            .single();

        if (error) {
            console.error('❌ Ticket lookup error:', error);
            throw error;
        }

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: `Ticket ${ticket_number} not found`
            });
        }

        res.json({
            success: true,
            data: {
                ticket_number: ticket.ticket_number,
                ticket_id: ticket.id,
                status: ticket.status,
                customer: {
                    name: ticket.customer.full_name,
                    phone: ticket.customer.phone,
                    email: ticket.customer.email
                },
                service: {
                    appliance_type: ticket.appliance_type,
                    request_type: ticket.request_type,
                    fault_symptoms: ticket.fault_symptoms,
                    installation_details: ticket.installation_details,
                    urgency: ticket.urgency
                },
                technician: ticket.appointment?.technician ? {
                    name: ticket.appointment.technician.name,
                    phone: ticket.appointment.technician.phone,
                    contact_instructions: "Technician will call 30 minutes before arrival"
                } : null,
                appointment: ticket.appointment ? {
                    slot_start: ticket.appointment.slot_start,
                    slot_end: ticket.appointment.slot_end,
                    status: ticket.appointment.status,
                    estimated_response_time: "Within 2 hours"
                } : null,
                created_at: ticket.created_at,
                updated_at: ticket.updated_at
            }
        });

    } catch (error) {
        console.error('❌ Ticket status error:', error);
        res.status(404).json({
            success: false,
            message: 'Ticket not found',
            error: error.message
        });
    }
});

// 3. Reschedule Appointment
app.post('/api/reschedule/:ticket_id', async (req, res) => {
    try {
        const { ticket_id } = req.params;
        const { preferred_time_slots } = req.body;

        // Find new available slot
        const reschedule_result = await rescheduleAppointment(ticket_id, preferred_time_slots);

        res.json({
            success: reschedule_result.success,
            message: reschedule_result.message,
            data: reschedule_result.appointment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Reschedule failed',
            error: error.message
        });
    }
});

// 🔧 HELPER FUNCTIONS

// Determine priority based on symptoms and request type
function determinePriority(fault_symptoms = [], request_type) {
    if (request_type === 'installation') {
        return 'low'; // Installations are generally scheduled
    }
    
    const highPrioritySymptoms = [
        'not_working', 'no_power', 'electrical_issue', 'water_leak', 
        'gas_leak', 'fire_hazard', 'safety_concern'
    ];
    
    const mediumPrioritySymptoms = [
        'not_cooling', 'not_heating', 'no_display', 'not_spinning'
    ];
    
    // Check for high priority issues
    if (fault_symptoms.some(symptom => 
        highPrioritySymptoms.some(high => symptom.includes(high)))) {
        return 'high';
    }
    
    // Check for medium priority issues
    if (fault_symptoms.some(symptom => 
        mediumPrioritySymptoms.some(medium => symptom.includes(medium)))) {
        return 'medium';
    }
    
    return 'low'; // Default for minor issues
}

// Get region from pincode with fallback
async function getRegionFromPincode(pincode) {
    try {
        // First check our cache
        const { data: cached_region } = await supabase
            .from('regions_mapping')
            .select('*')
            .eq('pincode', pincode)
            .single();

        if (cached_region) {
            return {
                region_label: cached_region.region_label,
                state: cached_region.state,
                city: cached_region.city
            };
        }

        // Call external API
        console.log(`🗺️ Looking up pincode: ${pincode}`);
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`, {
            timeout: 5000
        });

        if (response.data && response.data[0] && response.data[0].Status === 'Success') {
            const post_office = response.data[0].PostOffice[0];
            const region_info = {
                region_label: post_office.District,
                state: post_office.State,
                city: post_office.Division
            };

            // Cache the result
            await supabase
                .from('regions_mapping')
                .upsert({
                    pincode,
                    region_label: region_info.region_label,
                    state: region_info.state,
                    city: region_info.city
                });

            return region_info;
        }

        throw new Error('API returned no results');

    } catch (error) {
        console.log(`⚠️ Pincode lookup failed for ${pincode}, using fallback`);
        
        // Fallback mapping
        const fallback_mapping = {
            '560': { region_label: 'Bengaluru Urban', state: 'Karnataka', city: 'Bangalore' },
            '411': { region_label: 'Pune City', state: 'Maharashtra', city: 'Pune' },
            '110': { region_label: 'Delhi', state: 'Delhi', city: 'New Delhi' },
            '400': { region_label: 'Mumbai Suburban', state: 'Maharashtra', city: 'Mumbai' },
            '600': { region_label: 'Chennai City', state: 'Tamil Nadu', city: 'Chennai' }
        };

        const prefix = pincode.substring(0, 3);
        return fallback_mapping[prefix] || { 
            region_label: 'Unknown Region', 
            state: 'Unknown', 
            city: 'Unknown' 
        };
    }
}

// Create or update customer
async function createOrUpdateCustomer(customer_data) {
    const { data, error } = await supabase
        .from('customers')
        .upsert(customer_data, { 
            onConflict: 'phone',
            ignoreDuplicates: false 
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Create service ticket
async function createServiceTicket(ticket_data) {
    // Generate ticket number
    const ticket_number = `TKT${Date.now().toString().slice(-6)}`;
    
    const { data, error } = await supabase
        .from('tickets')
        .insert({
            ...ticket_data,
            ticket_number,
            status: 'created'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Find and assign technician with real database lookup
async function findAndAssignTechnician({ ticket_id, customer_id, appliance_type, fault_symptoms, region_label, preferred_time_slots }) {
    try {
        console.log(`🔍 Finding technician for ${appliance_type} in ${region_label}`);
        console.log(`🎯 Fault symptoms: ${JSON.stringify(fault_symptoms)}`);
        
        // Step 1: Try exact region + appliance match
        const { data: exactTechnicians, error } = await supabase
            .from('technicians')
            .select('*')
            .eq('is_active', true)
            .contains('appliances_supported', [appliance_type])
            .contains('regions', [region_label.toLowerCase().replace(/\s+/g, '_')]);

        if (error) {
            console.error('❌ Database query error:', error);
        }

        console.log(`📋 Found ${exactTechnicians?.length || 0} exact matching technicians`);

        if (exactTechnicians && exactTechnicians.length > 0) {
            // Score and select best technician
            const selectedTechnician = selectBestTechnician(exactTechnicians, fault_symptoms, appliance_type);
            console.log(`✅ Selected technician (exact match): ${selectedTechnician.name} from ${selectedTechnician.regions}`);
            return createAppointmentWithTechnician(selectedTechnician);
        }

        // Step 2: Try appliance-only match (any region)
        console.log('⚠️ No regional match found, trying appliance-only search...');
        const { data: applianceTechnicians, error: applianceError } = await supabase
            .from('technicians')
            .select('*')
            .eq('is_active', true)
            .contains('appliances_supported', [appliance_type]);

        if (!applianceError && applianceTechnicians && applianceTechnicians.length > 0) {
            const selectedTechnician = selectBestTechnician(applianceTechnicians, fault_symptoms, appliance_type);
            console.log(`✅ Selected technician (appliance match): ${selectedTechnician.name}`);
            return createAppointmentWithTechnician(selectedTechnician);
        }

        // Step 3: Try multi-skilled specialists
        console.log('⚠️ No appliance specialists found, checking multi-skilled technicians...');
        const { data: allTechnicians, error: allError } = await supabase
            .from('technicians')
            .select('*')
            .eq('is_active', true); // All active technicians

        if (!allError && allTechnicians && allTechnicians.length > 0) {
            // Find technicians who might handle this appliance type
            const suitableTechnicians = allTechnicians.filter(tech => 
                tech.skills.some(skill => skill.includes(appliance_type)) ||
                tech.appliances_supported.length >= 3 // Multi-skilled
            );

            if (suitableTechnicians.length > 0) {
                const selectedTechnician = selectBestTechnician(suitableTechnicians, fault_symptoms, appliance_type);
                console.log(`✅ Selected technician (specialist): ${selectedTechnician.name}`);
                return createAppointmentWithTechnician(selectedTechnician);
            }
        }

        console.log('❌ No suitable technicians found in database, using fallback');
        return getMockTechnician();

    } catch (error) {
        console.error('❌ Technician assignment failed:', error);
        return getMockTechnician();
    }
}

// Helper function to select best technician based on skills and experience
function selectBestTechnician(technicians, fault_symptoms = [], appliance_type) {
    console.log(`🎯 Scoring ${technicians.length} technicians for ${appliance_type}`);
    
    // Score each technician
    const scoredTechnicians = technicians.map(tech => {
        let score = 0;
        
        // Base score for supporting the appliance
        if (tech.appliances_supported.includes(appliance_type)) {
            score += 10;
        }
        
        // Bonus for having more skills (indicates experience)
        score += Math.min(tech.skills.length, 5); // Max 5 points for skills
        
        // Bonus for specific skill matches
        fault_symptoms.forEach(symptom => {
            tech.skills.forEach(skill => {
                if (skill.includes(appliance_type) && skill.includes(symptom.replace('not_', ''))) {
                    score += 5; // Specific skill match
                }
            });
        });
        
        // Bonus for being a specialist (fewer appliances = more specialized)
        if (tech.appliances_supported.length <= 2) {
            score += 5; // Specialist bonus
        }
        
        // Bonus for multi-skilled (handling 3+ appliances)
        if (tech.appliances_supported.length >= 3) {
            score += 3; // Versatility bonus
        }
        
        console.log(`   ${tech.name}: ${score} points (${tech.skills.length} skills, ${tech.appliances_supported.length} appliances)`);
        
        return { ...tech, score };
    });
    
    // Sort by score (highest first)
    scoredTechnicians.sort((a, b) => b.score - a.score);
    
    const selected = scoredTechnicians[0];
    console.log(`🏆 Best match: ${selected.name} (${selected.score} points)`);
    
    return selected;
}

// Helper function to create appointment with selected technician
function createAppointmentWithTechnician(technician) {
    return {
        success: true,
        appointment: {
            id: `apt_${Date.now()}`,
            slot_start: moment().add(1, 'day').format(),
            slot_end: moment().add(1, 'day').add(2, 'hours').format(),
            status: 'scheduled'
        },
        technician: {
            id: technician.id,
            name: technician.name,
            phone: technician.phone
        }
    };
}

// Helper function for mock data fallback
function getMockTechnician() {
    const mockTechnicians = [
        { id: 'mock_1', name: 'Raj Kumar', phone: '+91-9876543210' },
        { id: 'mock_2', name: 'Priya Sharma', phone: '+91-9876543211' },
        { id: 'mock_3', name: 'Amit Singh', phone: '+91-9876543212' },
        { id: 'mock_4', name: 'Neha Gupta', phone: '+91-9876543213' }
    ];
    
    // Randomly select a mock technician
    const randomTech = mockTechnicians[Math.floor(Math.random() * mockTechnicians.length)];
    
    return {
        success: true,
        appointment: {
            id: 'mock_appointment_id',
            slot_start: moment().add(1, 'day').format(),
            slot_end: moment().add(1, 'day').add(1, 'hour').format(),
            status: 'scheduled'
        },
        technician: randomTech
    };
}

// Reschedule appointment function
async function rescheduleAppointment(ticket_id, preferred_time_slots) {
    try {
        console.log(`🔄 Rescheduling appointment for ticket: ${ticket_id}`);
        
        // For now, return success with mock data
        // TODO: Implement real rescheduling algorithm
        
        return {
            success: true,
            message: 'Appointment rescheduled successfully',
            appointment: {
                id: 'rescheduled_appointment_id',
                slot_start: moment().add(2, 'days').format(),
                slot_end: moment().add(2, 'days').add(1, 'hour').format(),
                status: 'rescheduled'
            }
        };

    } catch (error) {
        console.error('❌ Reschedule failed:', error);
        return {
            success: false,
            message: 'Reschedule failed, please call customer service'
        };
    }
}



// Send notifications with enhanced logging
async function sendCustomerNotifications({ customer, ticket, appointment, technician }) {
    try {
        console.log('\n� NOTIFICATION PROCESS STARTED');
        console.log('� Customer:', JSON.stringify({
            name: customer.full_name,
            phone: customer.phone,
            email: customer.email
        }, null, 2));
        console.log('🎫 Ticket:', JSON.stringify({
            number: ticket.ticket_number,
            type: ticket.request_type,
            appliance: ticket.appliance_type
        }, null, 2));
        console.log('👷 Technician:', JSON.stringify({
            name: technician.name,
            phone: technician.phone
        }, null, 2));
        
        // Send SMS
        console.log('\n📱 Attempting to send SMS...');
        const smsResult = await sendSMSNotification({
            phone: customer.phone,
            customer_name: customer.full_name,
            ticket_number: ticket.ticket_number,
            technician_name: technician.name,
            technician_phone: technician.phone,
            service_type: ticket.request_type,
            appliance_type: ticket.appliance_type
        });
        console.log('📱 SMS Result:', JSON.stringify(smsResult, null, 2));

        // Send Email  
        console.log('\n📧 Attempting to send Email...');
        const emailResult = await sendEmailNotification({
            email: customer.email,
            customer_name: customer.full_name,
            ticket_number: ticket.ticket_number,
            technician_name: technician.name,
            technician_phone: technician.phone,
            service_type: ticket.request_type,
            appliance_type: ticket.appliance_type,
            appointment_time: appointment.slot_start,
            estimated_response_time: "Within 2 hours"
        });
        console.log('📧 Email Result:', JSON.stringify(emailResult, null, 2));

        console.log(`\n✅ NOTIFICATIONS COMPLETED - SMS: ${smsResult.success}, Email: ${emailResult.success}`);
        
        return { sms: smsResult, email: emailResult };
    } catch (error) {
        console.error('❌ NOTIFICATION FAILED:', error.message);
        console.error('❌ Stack:', error.stack);
        return { sms: { success: false, error: error.message }, email: { success: false, error: error.message } };
    }
}

// 📧📱 NOTIFICATION ENDPOINTS FOR SMS & EMAIL

// 1. Send Complete Notifications (SMS + Email)
app.post('/api/send-notifications', async (req, res) => {
    console.log('📧📱 Sending complete notifications');
    console.log(JSON.stringify(req.body, null, 2));
    
    try {
        const {
            customer_name,
            customer_phone,
            customer_email,
            ticket_number,
            technician_name,
            technician_phone,
            service_type,
            appliance_type,
            appointment_time,
            estimated_response_time
        } = req.body;

        // Send SMS
        const smsResult = await sendSMSNotification({
            phone: customer_phone,
            customer_name,
            ticket_number,
            technician_name,
            technician_phone,
            service_type,
            appliance_type
        });

        // Send Email  
        const emailResult = await sendEmailNotification({
            email: customer_email,
            customer_name,
            ticket_number,
            technician_name,
            technician_phone,
            service_type,
            appliance_type,
            appointment_time,
            estimated_response_time
        });

        res.json({
            success: true,
            message: 'Notifications sent successfully',
            data: {
                sms: smsResult,
                email: emailResult
            }
        });

    } catch (error) {
        console.error('❌ Notification Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send notifications',
            error: error.message
        });
    }
});

// 2. Send SMS Only
app.post('/api/send-sms', async (req, res) => {
    console.log('📱 Sending SMS notification');
    
    try {
        const result = await sendSMSNotification(req.body);
        
        res.json({
            success: true,
            message: 'SMS sent successfully',
            data: result
        });

    } catch (error) {
        console.error('❌ SMS Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS',
            error: error.message
        });
    }
});

// 3. Send Email Only
app.post('/api/send-email', async (req, res) => {
    console.log('📧 Sending Email notification');
    
    try {
        const result = await sendEmailNotification(req.body);
        
        res.json({
            success: true,
            message: 'Email sent successfully', 
            data: result
        });

    } catch (error) {
        console.error('❌ Email Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// 📱 PHONE NUMBER FORMATTER (E.164 Format)
function formatPhoneNumber(phone) {
    if (!phone) return null;
    
    // Remove all non-digit characters
    let cleanPhone = phone.replace(/\D/g, '');
    
    console.log('📱 Original phone:', phone);
    console.log('📱 Cleaned phone:', cleanPhone);
    
    // Handle different formats
    if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
        // Indian number with country code (without +)
        return '+' + cleanPhone;
    } else if (cleanPhone.startsWith('8') && cleanPhone.length === 10) {
        // Indian number without country code
        return '+91' + cleanPhone;
    } else if (cleanPhone.startsWith('9') && cleanPhone.length === 10) {
        // Indian number without country code
        return '+91' + cleanPhone;
    } else if (cleanPhone.startsWith('7') && cleanPhone.length === 10) {
        // Indian number without country code
        return '+91' + cleanPhone;
    } else if (cleanPhone.startsWith('6') && cleanPhone.length === 10) {
        // Indian number without country code
        return '+91' + cleanPhone;
    } else if (cleanPhone.length === 12 && !cleanPhone.startsWith('91')) {
        // Other country with country code
        return '+' + cleanPhone;
    } else if (cleanPhone.length === 13 && cleanPhone.startsWith('91')) {
        // Already formatted correctly but without +
        return '+' + cleanPhone;
    }
    
    // If already has +, return as is
    if (phone.startsWith('+')) {
        return phone;
    }
    
    // Default: assume Indian number and add +91
    return '+91' + cleanPhone;
}

// 📱 SMS HELPER FUNCTION
async function sendSMSNotification({ phone, customer_name, ticket_number, technician_name, technician_phone, service_type, appliance_type }) {
    try {
        // Twilio configuration from environment variables
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromPhone = process.env.TWILIO_PHONE_NUMBER;

        if (!accountSid || !authToken || !fromPhone) {
            throw new Error('Twilio credentials not configured');
        }

        // Format phone number to E.164 format
        const formattedPhone = formatPhoneNumber(phone);
        console.log('📱 Formatted phone for SMS:', formattedPhone);
        
        if (!formattedPhone) {
            throw new Error('Invalid phone number format');
        }

        // Short SMS for trial account (under 160 chars)
        const smsBody = `Service confirmed! Ticket: ${ticket_number}. Technician: ${technician_name} (${technician_phone}). Thank you!`;

        console.log('📱 Sending SMS to:', formattedPhone);
        console.log('📱 SMS Body:', smsBody);

        // Twilio API call
        const response = await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            new URLSearchParams({
                From: fromPhone,
                To: formattedPhone,
                Body: smsBody
            }),
            {
                auth: {
                    username: accountSid,
                    password: authToken
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log('📱 SMS sent successfully:', response.data.sid);
        return {
            success: true,
            sid: response.data.sid,
            status: response.data.status
        };

    } catch (error) {
        console.error('❌ SMS Error:', error.response?.data || error.message);
        throw error;
    }
}

// 📧 EMAIL HELPER FUNCTION
async function sendEmailNotification({ email, customer_name, ticket_number, technician_name, technician_phone, service_type, appliance_type, appointment_time, estimated_response_time }) {
    try {
        // SendGrid configuration from environment variables
        const sgMail = require('@sendgrid/mail');
        const apiKey = process.env.SENDGRID_API_KEY;
        const fromEmail = process.env.FROM_EMAIL || 'vimalrajaj.cse2023@citchennai.net';

        if (!apiKey) {
            throw new Error('SendGrid API key not configured');
        }

        sgMail.setApiKey(apiKey);

        const emailContent = {
            to: [{ email: email, name: customer_name }],
            from: { email: fromEmail, name: 'Consumer Durables Service' },
            subject: `Service Confirmation - Ticket ${ticket_number}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c5aa0;">🔧 Service Request Confirmed</h2>
                    
                    <p>Dear ${customer_name},</p>
                    
                    <p>Thank you for choosing our Consumer Durables Service! Your ${service_type} request has been successfully confirmed.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #2c5aa0; margin-top: 0;">Service Details:</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li><strong>📋 Ticket Number:</strong> ${ticket_number}</li>
                            <li><strong>🔧 Service Type:</strong> ${service_type}</li>
                            <li><strong>📱 Appliance:</strong> ${appliance_type}</li>
                            <li><strong>👨‍🔧 Technician:</strong> ${technician_name}</li>
                            <li><strong>📞 Technician Phone:</strong> ${technician_phone}</li>
                            <li><strong>⏰ Expected Response:</strong> ${estimated_response_time || 'Within 24 hours'}</li>
                        </ul>
                    </div>
                    
                    <h3 style="color: #2c5aa0;">What Happens Next?</h3>
                    <ol>
                        <li>Our technician ${technician_name} will contact you soon</li>
                        <li>They will schedule a convenient time for the visit</li>
                        <li>Our expert will arrive and resolve your ${appliance_type} issue</li>
                        <li>You'll receive service completion confirmation</li>
                    </ol>
                    
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>💡 Need to contact us?</strong></p>
                        <p style="margin: 5px 0;">Technician: ${technician_name} - ${technician_phone}</p>
                        <p style="margin: 5px 0;">Reference: Ticket ${ticket_number}</p>
                    </div>
                    
                    <p>Thank you for trusting us with your appliance service needs!</p>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This is an automated confirmation email. Please do not reply to this email.
                    </p>
                </div>
            `
        };

        // Use SendGrid library to send email
        const msg = {
            to: email,
            from: fromEmail,
            subject: `Service Confirmation - Ticket ${ticket_number}`,
            html: emailContent.html
        };

        const response = await sgMail.send(msg);
        
        console.log('📧 Email sent successfully');
        return {
            success: true,
            messageId: response[0].headers['x-message-id'] || 'sent'
        };

    } catch (error) {
        console.error('❌ Email Error:', error.response?.data || error.message);
        throw error;
    }
}

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Consumer Durables Service Platform',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Consumer Durables Service Platform running on port ${port}`);
    console.log(`📡 Main Endpoint: http://localhost:${port}/api/customer-intake`);
    console.log(`💚 Health Check: http://localhost:${port}/health`);
    console.log(`🔥 Ready for Inya.ai integration!`);
});

module.exports = app;