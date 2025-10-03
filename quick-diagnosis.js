// Quick Database Diagnostic
const axios = require('axios');

async function quickDiagnosis() {
    console.log('🔍 Quick Database Diagnostic\n');
    
    // Test with the most recent ticket
    const ticketNumber = 'TKT300572';
    
    console.log(`🎫 Checking what's actually stored for ${ticketNumber}...\n`);
    
    try {
        const response = await axios.post(
            'https://consumer-durabales-tracker.onrender.com/api/check-ticket-status',
            { ticket_number: ticketNumber },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            }
        );
        
        console.log('📊 Raw Database Response:');
        console.log(JSON.stringify(response.data, null, 2));
        
        console.log('\n🔍 Analysis:');
        if (response.data.success) {
            const data = response.data.data;
            console.log(`- Ticket ID: ${data.ticket_id}`);
            console.log(`- Customer: ${data.customer ? 'EXISTS' : 'MISSING'}`);
            console.log(`- Appointment: ${data.appointment ? 'EXISTS' : 'MISSING'}`);
            
            if (data.appointment) {
                console.log('  Appointment details:');
                console.log('  - Has slot_start:', !!data.appointment.slot_start);
                console.log('  - Has slot_end:', !!data.appointment.slot_end);
                console.log('  - Has status:', !!data.appointment.status);
                console.log('  - Has technician:', !!data.appointment.technician);
            }
        }
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

quickDiagnosis();