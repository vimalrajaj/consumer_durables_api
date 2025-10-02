// 🧪 Enhanced Mock Data - Comprehensive Technician Database
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function loadComprehensiveMockData() {
    console.log('🧪 Loading comprehensive mock data for Consumer Durables Service...');

    try {
        // 1. Extensive Technician Database (30+ technicians)
        console.log('👨‍🔧 Inserting comprehensive technician database...');
        const technicians = [
            // Bangalore Technicians
            {
                name: 'Asha Kumar',
                phone: '+91-9876543210',
                email: 'asha@service.com',
                skills: ['wm_motor', 'wm_vibration', 'ac_cooling', 'ac_leak', 'wm_drainage'],
                appliances_supported: ['washing_machine', 'ac'],
                regions: ['bengaluru_urban', 'bengaluru_rural']
            },
            {
                name: 'Suresh Babu',
                phone: '+91-9876543220',
                email: 'suresh@service.com',
                skills: ['ac_installation', 'ac_gas_refill', 'ac_compressor', 'ac_cooling'],
                appliances_supported: ['ac'],
                regions: ['bengaluru_urban', 'bengaluru_east']
            },
            {
                name: 'Ravi Krishnan',
                phone: '+91-9876543221',
                email: 'ravi@service.com',
                skills: ['ref_cooling', 'ref_ice_maker', 'ref_door_seal', 'ref_thermostat'],
                appliances_supported: ['refrigerator'],
                regions: ['bengaluru_urban', 'bengaluru_south']
            },
            {
                name: 'Manjunath S',
                phone: '+91-9876543222',
                email: 'manju@service.com',
                skills: ['wm_motor', 'wm_spinning', 'wm_water_inlet', 'wm_control_panel'],
                appliances_supported: ['washing_machine'],
                regions: ['bengaluru_urban', 'bengaluru_north']
            },
            {
                name: 'Deepak Kumar',
                phone: '+91-9876543223',
                email: 'deepak@service.com',
                skills: ['tv_display', 'tv_audio', 'tv_remote', 'tv_power', 'tv_smart_features'],
                appliances_supported: ['tv'],
                regions: ['bengaluru_urban', 'bengaluru_west']
            },
            {
                name: 'Lakshmi Devi',
                phone: '+91-9876543224',
                email: 'lakshmi@service.com',
                skills: ['wp_filter', 'wp_pump', 'wp_uv_lamp', 'wp_ro_membrane'],
                appliances_supported: ['water_purifier'],
                regions: ['bengaluru_urban', 'bengaluru_rural']
            },

            // Pune Technicians
            {
                name: 'Raj Patel',
                phone: '+91-9876543211',
                email: 'raj@service.com',
                skills: ['ref_cooling', 'ref_noise', 'tv_display', 'tv_remote', 'wp_filter'],
                appliances_supported: ['refrigerator', 'tv', 'water_purifier'],
                regions: ['pune_city', 'pune_rural']
            },
            {
                name: 'Sachin Jadhav',
                phone: '+91-9876543230',
                email: 'sachin@service.com',
                skills: ['ac_cooling', 'ac_installation', 'ac_maintenance', 'ac_remote'],
                appliances_supported: ['ac'],
                regions: ['pune_city', 'pune_east']
            },
            {
                name: 'Pradeep Kulkarni',
                phone: '+91-9876543231',
                email: 'pradeep@service.com',
                skills: ['wm_motor', 'wm_belt', 'wm_pump', 'wm_electronic'],
                appliances_supported: ['washing_machine'],
                regions: ['pune_city', 'pune_west']
            },
            {
                name: 'Mangesh Patil',
                phone: '+91-9876543232',
                email: 'mangesh@service.com',
                skills: ['ref_compressor', 'ref_gas_leak', 'ref_door_problem', 'ref_lighting'],
                appliances_supported: ['refrigerator'],
                regions: ['pune_city', 'pune_south']
            },
            {
                name: 'Vaishali Sharma',
                phone: '+91-9876543233',
                email: 'vaishali@service.com',
                skills: ['tv_led_backlight', 'tv_motherboard', 'tv_hdmi_port', 'tv_software'],
                appliances_supported: ['tv'],
                regions: ['pune_city', 'pune_north']
            },

            // Delhi Technicians  
            {
                name: 'Priya Singh',
                phone: '+91-9876543212',
                email: 'priya@service.com',
                skills: ['ac_leak', 'ac_noise', 'wm_drainage', 'ref_frost'],
                appliances_supported: ['ac', 'washing_machine', 'refrigerator'],
                regions: ['delhi', 'gurgaon']
            },
            {
                name: 'Ramesh Gupta',
                phone: '+91-9876543240',
                email: 'ramesh@service.com',
                skills: ['ac_duct_cleaning', 'ac_inverter', 'ac_sensor', 'ac_filter'],
                appliances_supported: ['ac'],
                regions: ['delhi', 'noida']
            },
            {
                name: 'Sunita Devi',
                phone: '+91-9876543241',
                email: 'sunita@service.com',
                skills: ['wm_timer', 'wm_sensor', 'wm_door_lock', 'wm_heating_element'],
                appliances_supported: ['washing_machine'],
                regions: ['delhi', 'faridabad']
            },
            {
                name: 'Vikash Kumar',
                phone: '+91-9876543242',
                email: 'vikash@service.com',
                skills: ['ref_defrost', 'ref_water_dispenser', 'ref_ice_maker', 'ref_temperature'],
                appliances_supported: ['refrigerator'],
                regions: ['delhi', 'ghaziabad']
            },
            {
                name: 'Anjali Verma',
                phone: '+91-9876543243',
                email: 'anjali@service.com',
                skills: ['wp_installation', 'wp_maintenance', 'wp_cartridge', 'wp_electrical'],
                appliances_supported: ['water_purifier'],
                regions: ['delhi', 'gurgaon']
            },

            // Chennai Technicians
            {
                name: 'Muthu Krishnan',
                phone: '+91-9876543213',
                email: 'muthu@service.com',
                skills: ['tv_power', 'tv_input', 'wp_pressure', 'wp_taste'],
                appliances_supported: ['tv', 'water_purifier'],
                regions: ['chennai_city', 'chennai_suburban']
            },
            {
                name: 'Kumaran S',
                phone: '+91-9876543250',
                email: 'kumaran@service.com',
                skills: ['ac_copper_coil', 'ac_outdoor_unit', 'ac_drainage', 'ac_electrical'],
                appliances_supported: ['ac'],
                regions: ['chennai_city', 'chennai_south']
            },
            {
                name: 'Selvam Raja',
                phone: '+91-9876543251',
                email: 'selvam@service.com',
                skills: ['wm_agitator', 'wm_transmission', 'wm_lid_switch', 'wm_control_board'],
                appliances_supported: ['washing_machine'],
                regions: ['chennai_city', 'chennai_north']
            },
            {
                name: 'Kavitha M',
                phone: '+91-9876543252',
                email: 'kavitha@service.com',
                skills: ['ref_evaporator', 'ref_condenser', 'ref_fan_motor', 'ref_control'],
                appliances_supported: ['refrigerator'],
                regions: ['chennai_city', 'chennai_west']
            },
            {
                name: 'Arjun Pillai',
                phone: '+91-9876543253',
                email: 'arjun@service.com',
                skills: ['tv_antenna', 'tv_cable', 'tv_streaming', 'tv_connectivity'],
                appliances_supported: ['tv'],
                regions: ['chennai_city', 'chennai_east']
            },

            // Mumbai Technicians
            {
                name: 'Rohit Sharma',
                phone: '+91-9876543214',
                email: 'rohit@service.com',
                skills: ['wm_motor', 'wm_spinning', 'ac_cooling', 'ref_cooling'],
                appliances_supported: ['washing_machine', 'ac', 'refrigerator'],
                regions: ['mumbai_suburban', 'mumbai_city']
            },
            {
                name: 'Mahesh Yadav',
                phone: '+91-9876543260',
                email: 'mahesh@service.com',
                skills: ['ac_split_unit', 'ac_window_unit', 'ac_central_unit', 'ac_maintenance'],
                appliances_supported: ['ac'],
                regions: ['mumbai_city', 'mumbai_west']
            },
            {
                name: 'Santosh Patil',
                phone: '+91-9876543261',
                email: 'santosh@service.com',
                skills: ['wm_front_load', 'wm_top_load', 'wm_semi_auto', 'wm_fully_auto'],
                appliances_supported: ['washing_machine'],
                regions: ['mumbai_city', 'mumbai_east']
            },
            {
                name: 'Pooja Jain',
                phone: '+91-9876543262',
                email: 'pooja@service.com',
                skills: ['ref_single_door', 'ref_double_door', 'ref_side_by_side', 'ref_french_door'],
                appliances_supported: ['refrigerator'],
                regions: ['mumbai_suburban', 'mumbai_south']
            },
            {
                name: 'Aditya Shah',
                phone: '+91-9876543263',
                email: 'aditya@service.com',
                skills: ['tv_led', 'tv_oled', 'tv_qled', 'tv_smart_tv'],
                appliances_supported: ['tv'],
                regions: ['mumbai_city', 'mumbai_north']
            },

            // Hyderabad Technicians
            {
                name: 'Anita Desai',
                phone: '+91-9876543215',
                email: 'anita@service.com',
                skills: ['ac_installation', 'wm_installation', 'ref_installation'],
                appliances_supported: ['ac', 'washing_machine', 'refrigerator'],
                regions: ['hyderabad_city', 'hyderabad_suburban']
            },
            {
                name: 'Venkat Reddy',
                phone: '+91-9876543270',
                email: 'venkat@service.com',
                skills: ['ac_inverter_tech', 'ac_energy_saving', 'ac_smart_features', 'ac_wifi'],
                appliances_supported: ['ac'],
                regions: ['hyderabad_city', 'hyderabad_east']
            },
            {
                name: 'Srinivas K',
                phone: '+91-9876543271',
                email: 'srinivas@service.com',
                skills: ['wm_steam_wash', 'wm_quick_wash', 'wm_eco_mode', 'wm_child_lock'],
                appliances_supported: ['washing_machine'],
                regions: ['hyderabad_city', 'hyderabad_west']
            },
            {
                name: 'Madhavi P',
                phone: '+91-9876543272',
                email: 'madhavi@service.com',
                skills: ['ref_frost_free', 'ref_direct_cool', 'ref_inverter', 'ref_smart_connect'],
                appliances_supported: ['refrigerator'],
                regions: ['hyderabad_suburban', 'hyderabad_south']
            },
            {
                name: 'Kiran Kumar',
                phone: '+91-9876543273',
                email: 'kiran@service.com',
                skills: ['wp_ro_system', 'wp_uv_system', 'wp_uf_system', 'wp_tds_controller'],
                appliances_supported: ['water_purifier'],
                regions: ['hyderabad_city', 'hyderabad_north']
            },

            // Multi-skilled Senior Technicians
            {
                name: 'Rajesh Master',
                phone: '+91-9876543280',
                email: 'rajesh.master@service.com',
                skills: ['ac_expert', 'wm_expert', 'ref_expert', 'tv_expert', 'wp_expert'],
                appliances_supported: ['ac', 'washing_machine', 'refrigerator', 'tv', 'water_purifier'],
                regions: ['bengaluru_urban', 'bengaluru_rural', 'mysore']
            },
            {
                name: 'Sunil Engineer',
                phone: '+91-9876543281',
                email: 'sunil.engineer@service.com',
                skills: ['electrical_work', 'plumbing_work', 'ac_ducting', 'wm_plumbing', 'installation_expert'],
                appliances_supported: ['ac', 'washing_machine', 'refrigerator', 'water_purifier'],
                regions: ['pune_city', 'pune_rural', 'satara']
            },
            {
                name: 'Amit Technician',
                phone: '+91-9876543282',
                email: 'amit.tech@service.com',
                skills: ['smart_home', 'iot_devices', 'wifi_connectivity', 'app_setup', 'automation'],
                appliances_supported: ['ac', 'tv', 'water_purifier', 'washing_machine'],
                regions: ['delhi', 'gurgaon', 'noida']
            }
        ];

        console.log(`📊 Attempting to insert ${technicians.length} technicians...`);
        
        const { data: insertedTechs, error: techError } = await supabase
            .from('technicians')
            .insert(technicians)
            .select();

        if (techError) {
            console.log('⚠️ Technicians insert error:', techError.message);
            // Try individual inserts for better error handling
            let successCount = 0;
            for (const tech of technicians) {
                try {
                    await supabase.from('technicians').insert(tech);
                    successCount++;
                } catch (err) {
                    console.log(`❌ Failed to insert ${tech.name}: ${err.message}`);
                }
            }
            console.log(`✅ Successfully inserted ${successCount} technicians`);
        } else {
            console.log(`✅ Inserted ${insertedTechs.length} technicians successfully`);
        }

        // 2. Extended Region Mappings
        console.log('🗺️ Inserting extended region mappings...');
        const regions = [
            // Bangalore Extended
            { pincode: '560001', region_label: 'bengaluru_urban', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '560002', region_label: 'bengaluru_urban', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '560003', region_label: 'bengaluru_urban', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '560004', region_label: 'bengaluru_east', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '560005', region_label: 'bengaluru_south', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '560034', region_label: 'bengaluru_urban', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '560037', region_label: 'bengaluru_north', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '560040', region_label: 'bengaluru_west', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '560068', region_label: 'bengaluru_rural', state: 'Karnataka', city: 'Bangalore' },
            
            // Pune Extended
            { pincode: '411001', region_label: 'pune_city', state: 'Maharashtra', city: 'Pune' },
            { pincode: '411002', region_label: 'pune_city', state: 'Maharashtra', city: 'Pune' },
            { pincode: '411003', region_label: 'pune_east', state: 'Maharashtra', city: 'Pune' },
            { pincode: '411004', region_label: 'pune_west', state: 'Maharashtra', city: 'Pune' },
            { pincode: '411005', region_label: 'pune_south', state: 'Maharashtra', city: 'Pune' },
            { pincode: '411006', region_label: 'pune_north', state: 'Maharashtra', city: 'Pune' },
            { pincode: '411014', region_label: 'pune_city', state: 'Maharashtra', city: 'Pune' },
            { pincode: '411028', region_label: 'pune_rural', state: 'Maharashtra', city: 'Pune' },
            
            // Delhi Extended
            { pincode: '110001', region_label: 'delhi', state: 'Delhi', city: 'New Delhi' },
            { pincode: '110002', region_label: 'delhi', state: 'Delhi', city: 'New Delhi' },
            { pincode: '110016', region_label: 'delhi', state: 'Delhi', city: 'New Delhi' },
            { pincode: '121001', region_label: 'faridabad', state: 'Haryana', city: 'Faridabad' },
            { pincode: '122001', region_label: 'gurgaon', state: 'Haryana', city: 'Gurgaon' },
            { pincode: '201301', region_label: 'noida', state: 'Uttar Pradesh', city: 'Noida' },
            { pincode: '201001', region_label: 'ghaziabad', state: 'Uttar Pradesh', city: 'Ghaziabad' },
            
            // Chennai Extended
            { pincode: '600001', region_label: 'chennai_city', state: 'Tamil Nadu', city: 'Chennai' },
            { pincode: '600002', region_label: 'chennai_south', state: 'Tamil Nadu', city: 'Chennai' },
            { pincode: '600003', region_label: 'chennai_north', state: 'Tamil Nadu', city: 'Chennai' },
            { pincode: '600004', region_label: 'chennai_west', state: 'Tamil Nadu', city: 'Chennai' },
            { pincode: '600005', region_label: 'chennai_east', state: 'Tamil Nadu', city: 'Chennai' },
            { pincode: '600020', region_label: 'chennai_city', state: 'Tamil Nadu', city: 'Chennai' },
            { pincode: '600028', region_label: 'chennai_suburban', state: 'Tamil Nadu', city: 'Chennai' },
            
            // Mumbai Extended
            { pincode: '400001', region_label: 'mumbai_city', state: 'Maharashtra', city: 'Mumbai' },
            { pincode: '400002', region_label: 'mumbai_west', state: 'Maharashtra', city: 'Mumbai' },
            { pincode: '400003', region_label: 'mumbai_east', state: 'Maharashtra', city: 'Mumbai' },
            { pincode: '400004', region_label: 'mumbai_south', state: 'Maharashtra', city: 'Mumbai' },
            { pincode: '400005', region_label: 'mumbai_north', state: 'Maharashtra', city: 'Mumbai' },
            { pincode: '400070', region_label: 'mumbai_suburban', state: 'Maharashtra', city: 'Mumbai' },
            { pincode: '400080', region_label: 'mumbai_city', state: 'Maharashtra', city: 'Mumbai' },
            
            // Hyderabad Extended
            { pincode: '500001', region_label: 'hyderabad_city', state: 'Telangana', city: 'Hyderabad' },
            { pincode: '500002', region_label: 'hyderabad_east', state: 'Telangana', city: 'Hyderabad' },
            { pincode: '500003', region_label: 'hyderabad_west', state: 'Telangana', city: 'Hyderabad' },
            { pincode: '500004', region_label: 'hyderabad_south', state: 'Telangana', city: 'Hyderabad' },
            { pincode: '500005', region_label: 'hyderabad_north', state: 'Telangana', city: 'Hyderabad' },
            { pincode: '500032', region_label: 'hyderabad_suburban', state: 'Telangana', city: 'Hyderabad' },
            { pincode: '500038', region_label: 'hyderabad_city', state: 'Telangana', city: 'Hyderabad' }
        ];

        const { data: insertedRegions, error: regionError } = await supabase
            .from('regions_mapping')
            .insert(regions)
            .select();

        if (regionError) {
            console.log('⚠️ Regions insert error:', regionError.message);
        } else {
            console.log(`✅ Inserted ${insertedRegions.length} region mappings`);
        }

        console.log('\n🎉 Comprehensive mock data loaded successfully!');
        console.log('📊 Database statistics:');
        console.log(`👨‍🔧 Total technicians: ${technicians.length}`);
        console.log(`🗺️ Total region mappings: ${regions.length}`);
        console.log('🚀 Consumer Durables Service Platform is ready for heavy testing!');

        // Test data retrieval
        console.log('\n🧪 Testing comprehensive data retrieval...');
        const { data: techList } = await supabase
            .from('technicians')
            .select('name, skills, appliances_supported, regions')
            .limit(5);

        console.log('👨‍🔧 Sample technicians from database:', techList);

        return true;

    } catch (error) {
        console.error('❌ Comprehensive mock data loading failed:', error);
        return false;
    }
}

if (require.main === module) {
    loadComprehensiveMockData();
}

module.exports = { loadComprehensiveMockData };