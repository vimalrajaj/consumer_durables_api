-- 🗄️ Consumer Durables Service Platform - Database Setup SQL
-- Run this SQL in your Supabase SQL editor

-- 1. Create customers table
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

-- 2. Create technicians table
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

-- 3. Create tickets table
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

-- 4. Create appointments table
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

-- 5. Create regions mapping table
CREATE TABLE IF NOT EXISTS regions_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pincode VARCHAR(6) NOT NULL UNIQUE,
    region_label VARCHAR(50) NOT NULL,
    state VARCHAR(50),
    city VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create notifications table
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

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_appointments_technician_id ON appointments(technician_id);
CREATE INDEX IF NOT EXISTS idx_regions_pincode ON regions_mapping(pincode);

-- 8. Insert sample technicians
INSERT INTO technicians (name, phone, email, skills, appliances_supported, regions) VALUES
('Asha Kumar', '+91-9876543210', 'asha@service.com', '["wm_motor", "wm_vibration", "ac_cooling", "ac_leak"]', '["washing_machine", "ac"]', '["bengaluru_urban", "bengaluru_rural"]'),
('Raj Patel', '+91-9876543211', 'raj@service.com', '["ref_cooling", "ref_noise", "tv_display", "tv_remote", "wp_filter"]', '["refrigerator", "tv", "water_purifier"]', '["pune_city", "pune_rural"]'),
('Priya Singh', '+91-9876543212', 'priya@service.com', '["ac_leak", "ac_noise", "wm_drainage", "ref_frost"]', '["ac", "washing_machine", "refrigerator"]', '["delhi", "gurgaon"]'),
('Muthu Krishnan', '+91-9876543213', 'muthu@service.com', '["tv_power", "tv_input", "wp_pressure", "wp_taste"]', '["tv", "water_purifier"]', '["chennai_city", "chennai_suburban"]'),
('Rohit Sharma', '+91-9876543214', 'rohit@service.com', '["wm_motor", "wm_spinning", "ac_cooling", "ref_cooling"]', '["washing_machine", "ac", "refrigerator"]', '["mumbai_suburban", "mumbai_city"]'),
('Anita Desai', '+91-9876543215', 'anita@service.com', '["ac_installation", "wm_installation", "ref_installation"]', '["ac", "washing_machine", "refrigerator"]', '["hyderabad_city", "hyderabad_suburban"]')
ON CONFLICT (phone) DO NOTHING;

-- 9. Insert sample regions
INSERT INTO regions_mapping (pincode, region_label, state, city) VALUES
('560034', 'bengaluru_urban', 'Karnataka', 'Bangalore'),
('560001', 'bengaluru_urban', 'Karnataka', 'Bangalore'),
('411001', 'pune_city', 'Maharashtra', 'Pune'),
('411014', 'pune_city', 'Maharashtra', 'Pune'),
('110001', 'delhi', 'Delhi', 'New Delhi'),
('110016', 'delhi', 'Delhi', 'New Delhi'),
('600001', 'chennai_city', 'Tamil Nadu', 'Chennai'),
('600020', 'chennai_city', 'Tamil Nadu', 'Chennai'),
('400001', 'mumbai_city', 'Maharashtra', 'Mumbai'),
('400070', 'mumbai_suburban', 'Maharashtra', 'Mumbai'),
('500001', 'hyderabad_city', 'Telangana', 'Hyderabad'),
('500032', 'hyderabad_suburban', 'Telangana', 'Hyderabad')
ON CONFLICT (pincode) DO NOTHING;