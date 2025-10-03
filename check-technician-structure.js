// Check Current Technician Table Structure
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://kxmkxlvfehmwyvbistgz.supabase.co',
    process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bWt4bHZmZWhtd3l2YmlzdGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODUwOTUsImV4cCI6MjA3NDk2MTA5NX0.JBSWmyLI-y84Khp_IUP12RVGzlcXDw-Lm4dHeMFwypQ'
);

async function checkTechnicianStructure() {
    try {
        console.log('🔍 Checking current technician table structure...\n');
        
        // Get a sample technician to see the structure
        const { data: sampleTech, error } = await supabase
            .from('technicians')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Error querying technicians:', error);
            return;
        }

        if (sampleTech && sampleTech.length > 0) {
            console.log('📋 Current Technician Table Structure:');
            console.log('Columns found:');
            Object.keys(sampleTech[0]).forEach(column => {
                console.log(`   - ${column}: ${typeof sampleTech[0][column]} (${JSON.stringify(sampleTech[0][column])})`);
            });
            
            console.log('\n📊 Sample Technician Data:');
            console.log(JSON.stringify(sampleTech[0], null, 2));
        } else {
            console.log('❌ No technicians found in database');
        }
        
        // Get count of current technicians
        const { data: allTechs, error: countError } = await supabase
            .from('technicians')
            .select('id, name, phone')
            .eq('is_active', true);

        if (!countError && allTechs) {
            console.log(`\n📈 Current Active Technicians: ${allTechs.length}`);
            console.log('Current technicians:');
            allTechs.forEach((tech, index) => {
                console.log(`   ${index + 1}. ${tech.name} (${tech.phone})`);
            });
        }

    } catch (error) {
        console.error('❌ Failed to check structure:', error.message);
    }
}

checkTechnicianStructure();