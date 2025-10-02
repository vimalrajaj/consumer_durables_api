// 🧪 Load Mock Data - Technicians, Regions, and Sample Data
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function loadMockData() {
    console.log('🧪 Loading mock data for testing...');

    try {
        // 1. Insert mock technicians
        console.log('👨‍🔧 Inserting mock technicians...');
        const technicians = [
            {
                name: 'Asha Kumar',
                phone: '+91-9876543210',
                email: 'asha@service.com',
                skills: ['wm_motor', 'wm_vibration', 'ac_cooling', 'ac_leak'],
                appliances_supported: ['washing_machine', 'ac'],
                regions: ['bengaluru_urban', 'bengaluru_rural']
            },
            {
                name: 'Raj Patel',
                phone: '+91-9876543211',
                email: 'raj@service.com',
                skills: ['ref_cooling', 'ref_noise', 'tv_display', 'tv_remote', 'wp_filter'],
                appliances_supported: ['refrigerator', 'tv', 'water_purifier'],
                regions: ['pune_city', 'pune_rural']
            },
            {
                name: 'Priya Singh',
                phone: '+91-9876543212',
                email: 'priya@service.com',
                skills: ['ac_leak', 'ac_noise', 'wm_drainage', 'ref_frost'],
                appliances_supported: ['ac', 'washing_machine', 'refrigerator'],
                regions: ['delhi', 'gurgaon']
            },
            {
                name: 'Muthu Krishnan',
                phone: '+91-9876543213',
                email: 'muthu@service.com',
                skills: ['tv_power', 'tv_input', 'wp_pressure', 'wp_taste'],
                appliances_supported: ['tv', 'water_purifier'],
                regions: ['chennai_city', 'chennai_suburban']
            },
            {
                name: 'Rohit Sharma',
                phone: '+91-9876543214',
                email: 'rohit@service.com',
                skills: ['wm_motor', 'wm_spinning', 'ac_cooling', 'ref_cooling'],
                appliances_supported: ['washing_machine', 'ac', 'refrigerator'],
                regions: ['mumbai_suburban', 'mumbai_city']
            },
            {
                name: 'Anita Desai',
                phone: '+91-9876543215',
                email: 'anita@service.com',
                skills: ['ac_installation', 'wm_installation', 'ref_installation'],
                appliances_supported: ['ac', 'washing_machine', 'refrigerator'],
                regions: ['hyderabad_city', 'hyderabad_suburban']
            }
        ];

        const { data: insertedTechs, error: techError } = await supabase
            .from('technicians')
            .insert(technicians)
            .select();

        if (techError) {
            console.log('⚠️ Technicians might already exist:', techError.message);
        } else {
            console.log(`✅ Inserted ${insertedTechs.length} technicians`);
        }

        // 2. Insert region mappings
        console.log('🗺️ Inserting region mappings...');
        const regions = [
            { pincode: '560034', region_label: 'bengaluru_urban', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '560001', region_label: 'bengaluru_urban', state: 'Karnataka', city: 'Bangalore' },
            { pincode: '411001', region_label: 'pune_city', state: 'Maharashtra', city: 'Pune' },
            { pincode: '411014', region_label: 'pune_city', state: 'Maharashtra', city: 'Pune' },
            { pincode: '110001', region_label: 'delhi', state: 'Delhi', city: 'New Delhi' },
            { pincode: '110016', region_label: 'delhi', state: 'Delhi', city: 'New Delhi' },
            { pincode: '600001', region_label: 'chennai_city', state: 'Tamil Nadu', city: 'Chennai' },
            { pincode: '600020', region_label: 'chennai_city', state: 'Tamil Nadu', city: 'Chennai' },
            { pincode: '400001', region_label: 'mumbai_city', state: 'Maharashtra', city: 'Mumbai' },
            { pincode: '400070', region_label: 'mumbai_suburban', state: 'Maharashtra', city: 'Mumbai' },
            { pincode: '500001', region_label: 'hyderabad_city', state: 'Telangana', city: 'Hyderabad' },
            { pincode: '500032', region_label: 'hyderabad_suburban', state: 'Telangana', city: 'Hyderabad' }
        ];

        const { data: insertedRegions, error: regionError } = await supabase
            .from('regions_mapping')
            .insert(regions)
            .select();

        if (regionError) {
            console.log('⚠️ Regions might already exist:', regionError.message);
        } else {
            console.log(`✅ Inserted ${insertedRegions.length} region mappings`);
        }

        console.log('🎉 Mock data loaded successfully!');
        console.log('📊 Database is ready for testing!');

        // 3. Test data retrieval
        console.log('\n🧪 Testing data retrieval...');
        const { data: techList } = await supabase
            .from('technicians')
            .select('name, skills, appliances_supported, regions')
            .limit(3);

        console.log('👨‍🔧 Sample technicians:', techList);

        return true;

    } catch (error) {
        console.error('❌ Mock data loading failed:', error);
        return false;
    }
}

if (require.main === module) {
    loadMockData();
}

module.exports = { loadMockData };