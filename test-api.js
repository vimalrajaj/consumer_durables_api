// 🧪 Test Consumer Durables API - Complete Flow Testing
require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testCustomerIntake() {
    console.log('🧪 Testing Consumer Durables API...');

    try {
        // Test 1: Health Check
        console.log('\n1️⃣ Testing Health Check...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health Status:', healthResponse.data);

        // Test 2: Customer Intake - Service Request
        console.log('\n2️⃣ Testing Service Request Flow...');
        const serviceRequest = {
            full_name: 'Rajesh Kumar',
            phone: '+91-9876543200',
            email: 'rajesh.kumar@email.com',
            address_text: '123 MG Road, Koramangala',
            pincode: '560034',
            request_type: 'service',
            appliance_type: 'washing_machine',
            model: 'Samsung WF700',
            fault_symptoms: ['not_spinning', 'making_noise', 'water_not_draining'],
            preferred_time_slots: ['morning', 'evening']
        };

        const serviceResponse = await axios.post(`${BASE_URL}/api/customer-intake`, serviceRequest);
        console.log('🎫 Service Request Response:', JSON.stringify(serviceResponse.data, null, 2));

        // Test 3: Customer Intake - Installation Request
        console.log('\n3️⃣ Testing Installation Request Flow...');
        const installRequest = {
            full_name: 'Priya Sharma',
            phone: '+91-9876543201',
            email: 'priya.sharma@email.com',
            address_text: '456 Brigade Road, Bangalore',
            pincode: '560001',
            request_type: 'installation',
            appliance_type: 'ac',
            model: 'LG Dual Inverter 1.5 Ton',
            preferred_time_slots: ['afternoon']
        };

        const installResponse = await axios.post(`${BASE_URL}/api/customer-intake`, installRequest);
        console.log('🔧 Installation Request Response:', JSON.stringify(installResponse.data, null, 2));

        // Test 4: Different Regions
        console.log('\n4️⃣ Testing Different Region (Pune)...');
        const puneRequest = {
            full_name: 'Amit Patil',
            phone: '+91-9876543202',
            email: 'amit.patil@email.com',
            address_text: 'FC Road, Pune',
            pincode: '411001',
            request_type: 'service',
            appliance_type: 'refrigerator',
            model: 'Whirlpool 240L',
            fault_symptoms: ['not_cooling', 'noise'],
            preferred_time_slots: ['morning']
        };

        const puneResponse = await axios.post(`${BASE_URL}/api/customer-intake`, puneRequest);
        console.log('🏢 Pune Request Response:', JSON.stringify(puneResponse.data, null, 2));

        // Test 5: TV Service Request
        console.log('\n5️⃣ Testing TV Service Request...');
        const tvRequest = {
            full_name: 'Sunita Reddy',
            phone: '+91-9876543203',
            email: 'sunita.reddy@email.com',
            address_text: 'Banjara Hills, Hyderabad',
            pincode: '500032',
            request_type: 'service',
            appliance_type: 'tv',
            model: 'Sony Bravia 55 inch',
            fault_symptoms: ['no_display', 'power_issue'],
            preferred_time_slots: ['evening']
        };

        const tvResponse = await axios.post(`${BASE_URL}/api/customer-intake`, tvRequest);
        console.log('📺 TV Service Response:', JSON.stringify(tvResponse.data, null, 2));

        console.log('\n🎉 All API tests completed successfully!');
        console.log('🚀 Consumer Durables Service Platform is ready for Inya.ai integration!');

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

// Test individual endpoints
async function testGetTicket(ticketId) {
    try {
        console.log(`\n🎫 Testing Get Ticket: ${ticketId}`);
        const response = await axios.get(`${BASE_URL}/api/ticket/${ticketId}`);
        console.log('Ticket Details:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Get Ticket Failed:', error.message);
    }
}

if (require.main === module) {
    testCustomerIntake();
}

module.exports = { testCustomerIntake, testGetTicket };