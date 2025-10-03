// Add More Technicians - Enhanced Coverage
// This script adds additional technicians to improve assignment success rates

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL || 'https://kxmkxlvfehmwyvbistgz.supabase.co',
    process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bWt4bHZmZWhtd3l2YmlzdGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODUwOTUsImV4cCI6MjA3NDk2MTA5NX0.JBSWmyLI-y84Khp_IUP12RVGzlcXDw-Lm4dHeMFwypQ'
);

const additionalTechnicians = [
    // 🏙️ BANGALORE - Additional Coverage
    {
        name: 'Deepak Reddy',
        phone: '+91-9876543219',
        email: 'deepak@techservice.com',
        skills: ['ac_repair', 'ac_installation', 'refrigerator_repair'],
        appliances_supported: ['ac', 'refrigerator'],
        regions: ['bengaluru_urban', 'bengaluru_rural'],
        is_active: true
    },
    {        name: 'Kavya Nair',
        phone: '+91-9876543220',
        email: 'kavya@techservice.com',
        skills: ['washing_machine_repair', 'water_purifier_maintenance'],
        appliances_supported: ['washing_machine', 'water_purifier'],
        regions: ['bengaluru_urban'],
        is_active: true
    },
    {        name: 'Suresh Kumar',
        phone: '+91-9876543221',
        email: 'suresh@techservice.com',
        skills: ['tv_repair', 'electronics_repair', 'ac_repair'],
        appliances_supported: ['tv', 'ac'],
        regions: ['bengaluru_urban', 'bengaluru_rural'],
        is_active: true
    },

    // 🏙️ MUMBAI - Additional Coverage
    {        name: 'Rohit Sharma',
        phone: '+91-9876543222',
        email: 'rohit@techservice.com',
        skills: ['ac_repair', 'ac_installation', 'cooling_systems'],
        appliances_supported: ['ac', 'refrigerator'],
        regions: ['mumbai_suburban', 'mumbai_city'],
        is_active: true
    },
    {        name: 'Sneha Patil',
        phone: '+91-9876543223',
        email: 'sneha@techservice.com',
        skills: ['washing_machine_repair', 'appliance_installation'],
        appliances_supported: ['washing_machine', 'water_purifier'],
        regions: ['mumbai_suburban'],
        is_active: true
    },
    {        name: 'Vikram Singh',
        phone: '+91-9876543224',
        email: 'vikram@techservice.com',
        skills: ['tv_repair', 'electronics_repair', 'display_technology'],
        appliances_supported: ['tv'],
        regions: ['mumbai_city', 'mumbai_suburban'],
        is_active: true
    },

    // 🏙️ DELHI - Additional Coverage
    {        name: 'Manish Agarwal',
        phone: '+91-9876543225',
        email: 'manish@techservice.com',
        skills: ['ac_repair', 'refrigerator_repair', 'cooling_systems'],
        appliances_supported: ['ac', 'refrigerator'],
        regions: ['central_delhi', 'south_delhi', 'north_delhi'],
        is_active: true
    },
    {        name: 'Pooja Gupta',
        phone: '+91-9876543226',
        email: 'pooja@techservice.com',
        skills: ['washing_machine_repair', 'water_purifier_maintenance'],
        appliances_supported: ['washing_machine', 'water_purifier'],
        regions: ['central_delhi', 'gurgaon'],
        is_active: true
    },

    // 🏙️ CHENNAI - Additional Coverage
    {        name: 'Karthik Raman',
        phone: '+91-9876543227',
        email: 'karthik@techservice.com',
        skills: ['ac_repair', 'ac_installation', 'electrical_systems'],
        appliances_supported: ['ac', 'tv'],
        regions: ['chennai_central', 'chennai_south'],
        is_active: true
    },
    {        name: 'Lakshmi Devi',
        phone: '+91-9876543228',
        email: 'lakshmi@techservice.com',
        skills: ['washing_machine_repair', 'refrigerator_repair'],
        appliances_supported: ['washing_machine', 'refrigerator'],
        regions: ['chennai_central'],
        is_active: true
    },

    // 🏙️ PUNE - Additional Coverage
    {        name: 'Nikhil Joshi',
        phone: '+91-9876543229',
        email: 'nikhil@techservice.com',
        skills: ['ac_repair', 'ac_installation'],
        appliances_supported: ['ac'],
        regions: ['pune_city', 'pune_suburban'],
        is_active: true
    },
    {        name: 'Shruti Kulkarni',
        phone: '+91-9876543230',
        email: 'shruti@techservice.com',
        skills: ['water_purifier_maintenance', 'washing_machine_repair'],
        appliances_supported: ['water_purifier', 'washing_machine'],
        regions: ['pune_city'],
        is_active: true
    },

    // 🏙️ HYDERABAD - Additional Coverage
    {        name: 'Rajesh Reddy',
        phone: '+91-9876543231',
        email: 'rajesh@techservice.com',
        skills: ['tv_repair', 'electronics_repair', 'ac_repair'],
        appliances_supported: ['tv', 'ac'],
        regions: ['hyderabad_central', 'secunderabad'],
        is_active: true
    },
    {        name: 'Sita Devi',
        phone: '+91-9876543232',
        email: 'sita@techservice.com',
        skills: ['refrigerator_repair', 'washing_machine_repair'],
        appliances_supported: ['refrigerator', 'washing_machine'],
        regions: ['hyderabad_central'],
        is_active: true
    },

    // 🏙️ NEW REGIONS - KOLKATA
    {        name: 'Debashish Roy',
        phone: '+91-9876543233',
        email: 'debashish@techservice.com',
        skills: ['ac_repair', 'refrigerator_repair', 'cooling_systems'],
        appliances_supported: ['ac', 'refrigerator'],
        regions: ['kolkata_central', 'kolkata_south'],
        is_active: true
    },
    {        name: 'Madhuri Sen',
        phone: '+91-9876543234',
        email: 'madhuri@techservice.com',
        skills: ['washing_machine_repair', 'water_purifier_maintenance'],
        appliances_supported: ['washing_machine', 'water_purifier'],
        regions: ['kolkata_central'],
        is_active: true
    },

    // 🏙️ NEW REGIONS - AHMEDABAD
    {        name: 'Arjun Patel',
        phone: '+91-9876543235',
        email: 'arjun@techservice.com',
        skills: ['ac_repair', 'ac_installation', 'tv_repair'],
        appliances_supported: ['ac', 'tv'],
        regions: ['ahmedabad_central', 'ahmedabad_west'],
        is_active: true
    },
    {        name: 'Nisha Shah',
        phone: '+91-9876543236',
        email: 'nisha@techservice.com',
        skills: ['washing_machine_repair', 'refrigerator_repair'],
        appliances_supported: ['washing_machine', 'refrigerator'],
        regions: ['ahmedabad_central'],
        is_active: true
    },

    // 🏙️ MULTI-SKILLED SPECIALISTS (Available across regions)
    {        name: 'Ramesh Vishwakarma',
        phone: '+91-9876543237',
        email: 'ramesh@techservice.com',
        skills: ['ac_repair', 'refrigerator_repair', 'washing_machine_repair', 'tv_repair', 'water_purifier_maintenance'],
        appliances_supported: ['ac', 'refrigerator', 'washing_machine', 'tv', 'water_purifier'],
        regions: ['bengaluru_urban', 'mumbai_suburban', 'central_delhi'],
        is_active: true
    },
    {        name: 'Sunita Krishnan',
        phone: '+91-9876543238',
        email: 'sunita@techservice.com',
        skills: ['ac_installation', 'appliance_installation', 'electrical_systems'],
        appliances_supported: ['ac', 'washing_machine', 'water_purifier', 'refrigerator'],
        regions: ['chennai_central', 'pune_city', 'hyderabad_central'],
        is_active: true
    }
];

async function addMoreTechnicians() {
    try {
        console.log('🚀 Adding more technicians to improve coverage...');
        
        // Insert all additional technicians
        const { data, error } = await supabase
            .from('technicians')
            .upsert(additionalTechnicians, { 
                onConflict: 'id',
                ignoreDuplicates: false 
            });

        if (error) {
            console.error('❌ Error adding technicians:', error);
            throw error;
        }

        console.log('✅ Successfully added technicians to database');
        
        // Verify total count
        const { data: allTechnicians, error: countError } = await supabase
            .from('technicians')
            .select('id, name, regions, appliances_supported')
            .eq('is_active', true);

        if (countError) {
            console.error('❌ Error counting technicians:', countError);
        } else {
            console.log(`\n📊 TECHNICIAN DATABASE SUMMARY:`);
            console.log(`Total Active Technicians: ${allTechnicians.length}`);
            
            // Group by region
            const regionCounts = {};
            allTechnicians.forEach(tech => {
                tech.regions.forEach(region => {
                    regionCounts[region] = (regionCounts[region] || 0) + 1;
                });
            });
            
            console.log('\n🗺️ Regional Coverage:');
            Object.entries(regionCounts).forEach(([region, count]) => {
                console.log(`   ${region}: ${count} technicians`);
            });
            
            // Group by appliance
            const applianceCounts = {};
            allTechnicians.forEach(tech => {
                tech.appliances_supported.forEach(appliance => {
                    applianceCounts[appliance] = (applianceCounts[appliance] || 0) + 1;
                });
            });
            
            console.log('\n🔧 Appliance Coverage:');
            Object.entries(applianceCounts).forEach(([appliance, count]) => {
                console.log(`   ${appliance}: ${count} technicians`);
            });
        }
        
        console.log('\n🎯 Enhanced Coverage Benefits:');
        console.log('   ✅ Better regional coverage across India');
        console.log('   ✅ Higher technician assignment success rate');
        console.log('   ✅ Reduced fallback to mock technicians');
        console.log('   ✅ Specialized skills for each appliance type');
        console.log('   ✅ Multi-skilled specialists for complex issues');
        
    } catch (error) {
        console.error('❌ Failed to add technicians:', error.message);
        process.exit(1);
    }
}

// Run the function
addMoreTechnicians();