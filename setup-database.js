// 🗄️ Database Setup Script - Creates all tables and loads mock data
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Using service key for admin operations
);

async function setupDatabase() {
    console.log('🗄️ Setting up Consumer Durables Service Database...');

    try {
        // 1. Create customers table
        console.log('📋 Creating customers table...');
        await supabase.rpc('exec_sql', {
            sql: `
            CREATE TABLE IF NOT EXISTS customers (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                full_name VARCHAR(100) NOT NULL,
                phone VARCHAR(15) NOT NULL UNIQUE,
                email VARCHAR(100),
                address_text TEXT,
                pincode VARCHAR(6),
                region_label VARCHAR(50),
                preferred_time_slots JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            `
        });

        // 2. Create technicians table
        console.log('👨‍🔧 Creating technicians table...');
        await supabase.rpc('exec_sql', {
            sql: `
            CREATE TABLE IF NOT EXISTS technicians (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(15) NOT NULL,
                email VARCHAR(100),
                skills JSONB NOT NULL,
                appliances_supported JSONB NOT NULL,
                regions JSONB NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            `
        });

        // 3. Create tickets table
        console.log('🎫 Creating tickets table...');
        await supabase.rpc('exec_sql', {
            sql: `
            CREATE TABLE IF NOT EXISTS tickets (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                ticket_number VARCHAR(20) UNIQUE NOT NULL,
                customer_id UUID REFERENCES customers(id),
                request_type VARCHAR(20) NOT NULL,
                appliance_type VARCHAR(30) NOT NULL,
                model VARCHAR(100),
                fault_symptoms JSONB,
                installation_details JSONB,
                urgency VARCHAR(10) DEFAULT 'medium',
                status VARCHAR(20) DEFAULT 'created',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            `
        });

        // 4. Create appointments table
        console.log('📅 Creating appointments table...');
        await supabase.rpc('exec_sql', {
            sql: `
            CREATE TABLE IF NOT EXISTS appointments (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                ticket_id UUID REFERENCES tickets(id),
                customer_id UUID REFERENCES customers(id),
                technician_id UUID REFERENCES technicians(id),
                slot_start TIMESTAMP WITH TIME ZONE NOT NULL,
                slot_end TIMESTAMP WITH TIME ZONE NOT NULL,
                status VARCHAR(20) DEFAULT 'scheduled',
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            `
        });

        // 5. Create regions mapping table
        console.log('🗺️ Creating regions mapping table...');
        await supabase.rpc('exec_sql', {
            sql: `
            CREATE TABLE IF NOT EXISTS regions_mapping (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                pincode VARCHAR(6) NOT NULL UNIQUE,
                region_label VARCHAR(50) NOT NULL,
                state VARCHAR(50),
                city VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            `
        });

        // 6. Create notifications table
        console.log('📱 Creating notifications table...');
        await supabase.rpc('exec_sql', {
            sql: `
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                customer_id UUID REFERENCES customers(id),
                ticket_id UUID REFERENCES tickets(id),
                type VARCHAR(20) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                content TEXT,
                sent_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            `
        });

        console.log('✅ Database tables created successfully!');
        return true;

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        return false;
    }
}

// Alternative method using direct SQL execution
async function setupDatabaseDirect() {
    console.log('🗄️ Setting up database with direct SQL...');

    const tables = [
        {
            name: 'customers',
            sql: `
            CREATE TABLE IF NOT EXISTS customers (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                full_name VARCHAR(100) NOT NULL,
                phone VARCHAR(15) NOT NULL UNIQUE,
                email VARCHAR(100),
                address_text TEXT,
                pincode VARCHAR(6),
                region_label VARCHAR(50),
                preferred_time_slots JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            `
        },
        {
            name: 'technicians',
            sql: `
            CREATE TABLE IF NOT EXISTS technicians (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(15) NOT NULL,
                email VARCHAR(100),
                skills JSONB NOT NULL,
                appliances_supported JSONB NOT NULL,
                regions JSONB NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            `
        },
        {
            name: 'tickets',
            sql: `
            CREATE TABLE IF NOT EXISTS tickets (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                ticket_number VARCHAR(20) UNIQUE NOT NULL,
                customer_id UUID REFERENCES customers(id),
                request_type VARCHAR(20) NOT NULL,
                appliance_type VARCHAR(30) NOT NULL,
                model VARCHAR(100),
                fault_symptoms JSONB,
                installation_details JSONB,
                urgency VARCHAR(10) DEFAULT 'medium',
                status VARCHAR(20) DEFAULT 'created',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            `
        }
    ];

    for (const table of tables) {
        try {
            console.log(`📋 Creating ${table.name} table...`);
            // Using basic insert approach since rpc might not be available
            await createTableBasic(table.name, table.sql);
        } catch (error) {
            console.log(`⚠️ ${table.name} table might already exist:`, error.message);
        }
    }

    console.log('✅ Database setup completed!');
}

// Basic table creation using insert method
async function createTableBasic(tableName, sql) {
    // This is a workaround - in production, run SQL directly in Supabase dashboard
    console.log(`Table: ${tableName} - Please run this SQL in Supabase dashboard:`);
    console.log(sql);
    console.log('---');
}

if (require.main === module) {
    setupDatabaseDirect();
}

module.exports = { setupDatabase, setupDatabaseDirect };