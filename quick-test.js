// 🚀 Quick Test - Simple API Verification
const axios = require('axios');

async function quickTest() {
    try {
        console.log('🧪 Quick API Test...');
        
        // Simple test payload
        const testData = {
            full_name: 'Test Customer',
            phone: '+91-9999999999',
            email: 'test@email.com',
            address_text: 'Test Address',
            pincode: '560034',
            request_type: 'service',
            appliance_type: 'washing_machine',
            fault_symptoms: ['not_working']
        };

        console.log('📡 Sending request to API...');
        const response = await axios.post('http://localhost:3000/api/customer-intake', testData);
        
        console.log('✅ SUCCESS! API Response:');
        console.log(JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.log('❌ Error details:', error.message);
        if (error.response && error.response.data) {
            console.log('Response data:', error.response.data);
        }
    }
}

quickTest();