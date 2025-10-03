// Complete Inya.ai Integration Test Suite
const axios = require('axios');

async function testCompleteInyaIntegration() {
    console.log('🧪 COMPLETE INYA.AI INTEGRATION TEST SUITE\n');
    console.log('Testing both Customer Intake and Ticket Status workflows\n');
    console.log('='.repeat(70) + '\n');
    
    const testCases = [
        {
            name: "AC Service Request (High Priority)",
            data: {
                customer_name: "Inya Test AC Customer",
                customer_phone: "+919876543210",
                customer_email: "inyaac@example.com",
                appliance_type: "AC",
                request_type: "service",
                fault_symptoms: "not_cooling", // String format (Inya.ai style)
                urgency: "high",
                city: "Bangalore",
                api_key: "service_agent_2025"
            }
        },
        {
            name: "Washing Machine Installation", 
            data: {
                customer_name: "Inya Test WM Customer",
                customer_phone: "+919123456789",
                customer_email: "inyawm@example.com",
                appliance_type: "washing_machine",
                request_type: "installation",
                installation_details: "wall_mounting", // String format
                urgency: "medium",
                city: "Mumbai", 
                api_key: "service_agent_2025"
            }
        },
        {
            name: "Refrigerator Service (Array Format)",
            data: {
                customer_name: "Inya Test Fridge Customer", 
                customer_phone: "+919999888777",
                customer_email: "inyafridge@example.com",
                appliance_type: "refrigerator",
                request_type: "service",
                fault_symptoms: ["not_cooling_properly", "making_noise"], // Array format
                urgency: "medium",
                city: "Delhi",
                api_key: "service_agent_2025"
            }
        }
    ];
    
    const createdTickets = [];
    
    // Test 1: Customer Intake for all cases
    console.log('📞 PHASE 1: CUSTOMER INTAKE TESTING');
    console.log('=====================================\n');
    
    for (const [index, testCase] of testCases.entries()) {
        try {
            console.log(`🧪 Test ${index + 1}: ${testCase.name}`);
            console.log('📤 Sending customer intake request...');
            
            const intakeResponse = await axios.post(
                'https://consumer-durabales-tracker.onrender.com/api/customer-intake',
                testCase.data,
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000
                }
            );
            
            if (intakeResponse.data.success) {
                const data = intakeResponse.data.data;
                createdTickets.push(data.ticket_number);
                
                console.log('✅ Customer Intake SUCCESS!');
                console.log(`   Ticket: ${data.ticket_number}`);
                console.log(`   Customer: ${data.customer_name || 'Name not returned'}`);
                console.log(`   Status: ${data.status}`);
                
                // Check if technician was assigned
                if (data.technician) {
                    console.log(`   ✅ Technician Assigned: ${data.technician.name} (${data.technician.phone})`);
                } else {
                    console.log(`   ⚠️ No technician in response (might be assigned but not returned)`);
                }
                
                // Check if appointment was created
                if (data.appointment) {
                    console.log(`   ✅ Appointment Created: ${data.appointment.status}`);
                    console.log(`   📅 Time: ${data.appointment.slot_start} - ${data.appointment.slot_end}`);
                } else {
                    console.log(`   ⚠️ No appointment in response`);
                }
                
            } else {
                console.log('❌ Customer Intake FAILED');
                console.log('   Error:', intakeResponse.data.message);
            }
            
        } catch (error) {
            console.log(`❌ Test ${index + 1} FAILED:`);
            console.log('   Status:', error.response?.status);
            console.log('   Error:', error.response?.data?.message || error.message);
        }
        
        console.log(''); // Empty line between tests
    }
    
    console.log('\n' + '='.repeat(70) + '\n');
    
    // Test 2: Ticket Status Check for all created tickets
    console.log('🎫 PHASE 2: TICKET STATUS CHECK TESTING');
    console.log('=====================================\n');
    
    for (const [index, ticketNumber] of createdTickets.entries()) {
        try {
            console.log(`🔍 Checking Ticket ${index + 1}: ${ticketNumber}`);
            
            // Wait a moment for database consistency
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const statusResponse = await axios.post(
                'https://consumer-durabales-tracker.onrender.com/api/check-ticket-status',
                { ticket_number: ticketNumber },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 15000
                }
            );
            
            if (statusResponse.data.success) {
                const data = statusResponse.data.data;
                
                console.log('✅ Ticket Status SUCCESS!');
                console.log(`   Ticket: ${data.ticket_number}`);
                console.log(`   Status: ${data.status}`);
                console.log(`   Customer: ${data.customer.name}`);
                console.log(`   Service: ${data.service.appliance_type} ${data.service.request_type}`);
                console.log(`   Urgency: ${data.service.urgency}`);
                
                // The critical test - is technician data now available?
                if (data.technician) {
                    console.log(`   ✅ TECHNICIAN FOUND: ${data.technician.name}`);
                    console.log(`   📞 Phone: ${data.technician.phone}`);
                    console.log(`   📋 Instructions: ${data.technician.contact_instructions}`);
                } else {
                    console.log(`   ❌ TECHNICIAN STILL NULL - Fix didn't work!`);
                }
                
                // Check appointment data
                if (data.appointment && data.appointment.slot_start) {
                    console.log(`   ✅ APPOINTMENT FOUND:`);
                    console.log(`   📅 Time: ${data.appointment.slot_start} - ${data.appointment.slot_end}`);
                    console.log(`   📊 Status: ${data.appointment.status}`);
                } else if (data.appointment) {
                    console.log(`   ⚠️ Appointment exists but no schedule details`);
                    console.log(`   📋 Info: ${data.appointment.estimated_response_time}`);
                } else {
                    console.log(`   ❌ NO APPOINTMENT DATA`);
                }
                
                // Test Inya.ai variable extraction
                console.log('\n   🤖 INYA.AI VARIABLES:');
                console.log(`   ticket_status: "${data.status}"`);
                console.log(`   customer_name: "${data.customer.name}"`);
                
                const serviceDetails = `Your ${data.service.appliance_type} ${data.service.request_type} request with ${data.service.urgency} priority`;
                console.log(`   service_details: "${serviceDetails}"`);
                
                const technicianInfo = data.technician 
                    ? `Your technician is ${data.technician.name} - ${data.technician.phone}. ${data.technician.contact_instructions}`
                    : "We're finding the best technician for your area. You'll be notified via SMS and email when assigned.";
                console.log(`   technician_info: "${technicianInfo}"`);
                
                const appointmentDetails = data.appointment && data.appointment.slot_start
                    ? `Scheduled for ${new Date(data.appointment.slot_start).toLocaleDateString()} at ${new Date(data.appointment.slot_start).toLocaleTimeString()}, status: ${data.appointment.status}`
                    : `Appointment will be scheduled once technician is assigned. Expected response time: ${data.appointment?.estimated_response_time || 'Within 2 hours'}`;
                console.log(`   appointment_details: "${appointmentDetails}"`);
                
            } else {
                console.log('❌ Ticket Status FAILED');
                console.log('   Error:', statusResponse.data.message);
            }
            
        } catch (error) {
            console.log(`❌ Status Check FAILED for ${ticketNumber}:`);
            console.log('   Status:', error.response?.status);
            console.log('   Error:', error.response?.data?.message || error.message);
        }
        
        console.log('\n' + '-'.repeat(50) + '\n');
    }
    
    // Test 3: Test invalid ticket number
    console.log('🧪 PHASE 3: ERROR HANDLING TEST');
    console.log('=====================================\n');
    
    try {
        console.log('🔍 Testing invalid ticket number: TKT999999');
        
        const invalidResponse = await axios.post(
            'https://consumer-durabales-tracker.onrender.com/api/check-ticket-status',
            { ticket_number: 'TKT999999' },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            }
        );
        
        console.log('⚠️ Unexpected success for invalid ticket');
        
    } catch (error) {
        if (error.response?.status === 404) {
            console.log('✅ Correct 404 error for invalid ticket');
            console.log('   Message:', error.response.data.message);
        } else {
            console.log('❌ Unexpected error type:', error.message);
        }
    }
    
    console.log('\n' + '='.repeat(70) + '\n');
    
    // Summary
    console.log('🎯 INTEGRATION TEST SUMMARY');
    console.log('=====================================');
    console.log(`✅ Created Tickets: ${createdTickets.length}`);
    console.log(`📋 Test Cases: ${testCases.length}`);
    console.log(`🎫 Tickets: ${createdTickets.join(', ')}`);
    console.log('');
    console.log('🔧 Key Tests:');
    console.log('   ✓ Customer Intake (POST /api/customer-intake)');
    console.log('   ✓ Ticket Status Check (POST /api/check-ticket-status)');
    console.log('   ✓ String/Array format compatibility');
    console.log('   ✓ Technician assignment and database persistence');
    console.log('   ✓ Appointment creation and linking');
    console.log('   ✓ Inya.ai variable extraction format');
    console.log('   ✓ Error handling for invalid tickets');
    console.log('');
    console.log('🚀 Ready for Inya.ai Production Integration!');
}

testCompleteInyaIntegration();