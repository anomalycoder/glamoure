-- ============================================================================
-- GLAMOURÉ ENTERPRISE SALON MANAGEMENT PLATFORM
-- Multi-Tenant PostgreSQL / Supabase Schema (Phase 1 Foundation)
-- Tables: 24 Core Entities + Multi-Tenant Row Level Security (RLS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    avatar_url TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- 2. CUSTOMER PROFILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    allergies TEXT,
    preferred_notes TEXT,
    loyalty_points INT DEFAULT 0 CHECK (loyalty_points >= 0),
    emergency_contact VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. SALONS (TENANTS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    phone VARCHAR(30) NOT NULL,
    email CITEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    currency VARCHAR(10) DEFAULT 'INR',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    onboarding_completed BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{
      "allowOnlineBooking": true,
      "requireDeposit": false,
      "depositPercentage": 20,
      "cancellationNoticeHours": 24,
      "bufferMinutesBetweenAppointments": 10,
      "autoConfirmAppointments": true
    }'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_salons_slug ON salons(slug);
CREATE INDEX IF NOT EXISTS idx_salons_owner ON salons(owner_id);

-- ============================================================================
-- 4. SALON BRANCHES
-- ============================================================================
CREATE TABLE IF NOT EXISTS salon_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email CITEXT,
    is_main_branch BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id, code)
);

CREATE INDEX IF NOT EXISTS idx_branches_salon ON salon_branches(salon_id);

-- ============================================================================
-- 5. ROLES & PERMISSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

INSERT INTO roles (id, name, description) VALUES
('customer', 'Customer', 'Can discover salons, book appointments, and manage profile'),
('salon_owner', 'Salon Owner', 'Full operational, financial, and administrative control over salon'),
('salon_member', 'Salon Member / Staff', 'Stylist or artisan managing assigned services and schedule'),
('system_admin', 'System Administrator', 'Global platform administrator')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(50) PRIMARY KEY,
    description TEXT
);

INSERT INTO permissions (id, description) VALUES
('appointments:read', 'View appointments'),
('appointments:write', 'Create and modify appointments'),
('appointments:status', 'Transition appointment lifecycle status'),
('appointments:cancel', 'Cancel appointments'),
('services:read', 'View catalog services'),
('services:write', 'Create and edit services'),
('staff:read', 'View staff profiles'),
('staff:write', 'Manage staff and commissions'),
('staff:schedule', 'Manage staff availability and working hours'),
('customers:read', 'View customer details'),
('customers:write', 'Manage customer notes and records'),
('inventory:read', 'View inventory levels'),
('inventory:write', 'Manage stock and purchase orders'),
('billing:read', 'View invoices and payments'),
('billing:write', 'Create invoices and process refunds'),
('analytics:read', 'View business and revenue analytics'),
('settings:manage', 'Configure salon policies and details'),
('branches:manage', 'Create and manage branches')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. SALON MEMBERSHIPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS salon_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES salon_branches(id) ON DELETE SET NULL,
    role VARCHAR(50) NOT NULL REFERENCES roles(id),
    permissions TEXT[] DEFAULT '{}',
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
    invited_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, salon_id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON salon_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_salon ON salon_memberships(salon_id);

-- ============================================================================
-- 7. INVITATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES salon_branches(id) ON DELETE SET NULL,
    email CITEXT NOT NULL,
    role VARCHAR(50) NOT NULL REFERENCES roles(id),
    permissions TEXT[] DEFAULT '{}',
    invited_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(120) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_salon ON invitations(salon_id);

-- ============================================================================
-- 8. SERVICE CATEGORIES & SERVICES
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(salon_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_salon ON service_categories(salon_id);

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    buffer_minutes INT DEFAULT 5 CHECK (buffer_minutes >= 0),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_services_salon ON services(salon_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);

-- ============================================================================
-- 9. STAFF PROFILES & SERVICES OFFERED
-- ============================================================================
CREATE TABLE IF NOT EXISTS staff_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES salon_branches(id) ON DELETE SET NULL,
    display_name VARCHAR(150) NOT NULL,
    title VARCHAR(100) NOT NULL,
    bio TEXT,
    photo_url TEXT,
    phone VARCHAR(30),
    commission_percentage NUMERIC(5, 2) DEFAULT 0 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    review_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_staff_salon ON staff_profiles(salon_id);
CREATE INDEX IF NOT EXISTS idx_staff_user ON staff_profiles(user_id);

CREATE TABLE IF NOT EXISTS staff_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_profile_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    custom_price NUMERIC(10, 2),
    custom_duration_minutes INT,
    UNIQUE(staff_profile_id, service_id)
);

-- ============================================================================
-- 10. WORKING HOURS & LEAVE REQUESTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_profile_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_working BOOLEAN DEFAULT TRUE,
    UNIQUE(staff_profile_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    staff_profile_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. SALON CUSTOMER RECORDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS salon_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_appointments INT DEFAULT 0,
    total_spent NUMERIC(12, 2) DEFAULT 0,
    last_visit_date DATE,
    loyalty_points INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_salon_customers_salon ON salon_customers(salon_id);

-- ============================================================================
-- 12. APPOINTMENTS & STATUS HISTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES salon_branches(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    customer_name VARCHAR(150) NOT NULL,
    customer_email CITEXT NOT NULL,
    customer_phone VARCHAR(30),
    staff_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE RESTRICT,
    staff_name VARCHAR(150) NOT NULL,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    service_name VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show')
    ),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    deposit_amount NUMERIC(10, 2) DEFAULT 0 CHECK (deposit_amount >= 0),
    payment_status VARCHAR(30) DEFAULT 'unpaid' CHECK (
        payment_status IN ('unpaid', 'deposit_paid', 'paid', 'refunded')
    ),
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_salon ON appointments(salon_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

CREATE TABLE IF NOT EXISTS appointment_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    changed_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    changed_by_name VARCHAR(150) NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_appointment ON appointment_status_history(appointment_id);

-- ============================================================================
-- 13. INVOICES & PAYMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(50) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(10, 2) DEFAULT 0 CHECK (tax_amount >= 0),
    discount_amount NUMERIC(10, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'void')),
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(salon_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    method VARCHAR(30) NOT NULL CHECK (method IN ('card', 'upi', 'cash', 'membership')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('successful', 'pending', 'failed', 'refunded')),
    transaction_reference VARCHAR(120) UNIQUE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 14. OFFERS & PROMOTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    discount_percent NUMERIC(5, 2) CHECK (discount_percent >= 0 AND discount_percent <= 100),
    discount_amount NUMERIC(10, 2) CHECK (discount_amount >= 0),
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    min_spend NUMERIC(10, 2) DEFAULT 0,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(salon_id, code)
);

-- ============================================================================
-- 15. INVENTORY MANAGEMENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES salon_branches(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(60) NOT NULL,
    category VARCHAR(80) NOT NULL,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    min_threshold INT NOT NULL DEFAULT 5 CHECK (min_threshold >= 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    cost_price NUMERIC(10, 2) NOT NULL CHECK (cost_price >= 0),
    supplier VARCHAR(150),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id, sku)
);

-- ============================================================================
-- 16. REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_name VARCHAR(150) NOT NULL,
    staff_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
    staff_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    reply TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 17. NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('appointment', 'system', 'reminder', 'payment', 'invitation')),
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- ============================================================================
-- 18. AUDIT LOGS (IMMUTABLE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    user_email CITEXT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(80) NOT NULL,
    entity_id VARCHAR(80) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_salon ON audit_logs(salon_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity, entity_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Salons: Public can view active salons; Owner and active members can manage
CREATE POLICY salons_public_read ON salons FOR SELECT USING (is_active = TRUE);
CREATE POLICY salons_owner_all ON salons FOR ALL USING (auth.uid() = owner_id);

-- 2. Services: Public can read active services; Staff and Owner can manage
CREATE POLICY services_public_read ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY services_tenant_manage ON services FOR ALL USING (
    EXISTS (
        SELECT 1 FROM salon_memberships 
        WHERE salon_memberships.salon_id = services.salon_id 
        AND salon_memberships.user_id = auth.uid() 
        AND salon_memberships.role IN ('salon_owner', 'salon_member')
    )
);

-- 3. Appointments: Customer can read their own; Salon staff/owner can read/update their salon appointments
CREATE POLICY appointments_customer_read ON appointments FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY appointments_customer_insert ON appointments FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY appointments_tenant_all ON appointments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM salon_memberships 
        WHERE salon_memberships.salon_id = appointments.salon_id 
        AND salon_memberships.user_id = auth.uid()
    )
);

-- 4. Status History: Visible to participants; Only backend/authenticated users can insert
CREATE POLICY status_history_read ON appointment_status_history FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM appointments 
        WHERE appointments.id = appointment_status_history.appointment_id
        AND (appointments.customer_id = auth.uid() OR EXISTS (
            SELECT 1 FROM salon_memberships 
            WHERE salon_memberships.salon_id = appointment_status_history.salon_id 
            AND salon_memberships.user_id = auth.uid()
        ))
    )
);

-- 5. Audit Logs: Append-only by authorized users; Readable by salon owners
CREATE POLICY audit_owner_read ON audit_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM salon_memberships 
        WHERE salon_memberships.salon_id = audit_logs.salon_id 
        AND salon_memberships.user_id = auth.uid() 
        AND salon_memberships.role = 'salon_owner'
    )
);
