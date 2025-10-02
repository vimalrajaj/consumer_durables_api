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
        if (assignment.success) {
            await sendCustomerNotifications({
                customer,
                ticket,
                appointment: assignment.appointment,
                technician: assignment.technician
            });
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

// Find and assign technician (simplified for now)
async function findAndAssignTechnician({ ticket_id, customer_id, appliance_type, fault_symptoms, region_label, preferred_time_slots }) {
    try {
        console.log(`🔍 Finding technician for ${appliance_type} in ${region_label}`);
        
        // For now, return success with mock data
        // TODO: Implement real matching algorithm
        
        return {
            success: true,
            appointment: {
                id: 'mock_appointment_id',
                slot_start: moment().add(1, 'day').format(),
                slot_end: moment().add(1, 'day').add(1, 'hour').format(),
                status: 'scheduled'
            },
            technician: {
                id: 'mock_tech_id',
                name: 'Raj Kumar',
                phone: '+91-9876543210'
            }
        };

    } catch (error) {
        console.error('❌ Technician assignment failed:', error);
        return {
            success: false,
            message: 'No technician available, will call back within 24 hours'
        };
    }
}

// Send notifications (simplified for now)
async function sendCustomerNotifications({ customer, ticket, appointment, technician }) {
    try {
        console.log(`📱 Sending notifications to ${customer.full_name}`);
        
        // TODO: Implement SMS and Email
        console.log(`SMS: Your service request ${ticket.ticket_number} is scheduled for ${appointment.slot_start}`);
        
        return true;
    } catch (error) {
        console.error('❌ Notification failed:', error);
        return false;
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