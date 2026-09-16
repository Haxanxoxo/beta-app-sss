-- SSS Reset Kit — Database Schema
-- PostgreSQL / Supabase Migration
-- ================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Organisations ──────────────────────────────────────

CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Groups ─────────────────────────────────────────────

CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_groups_org ON groups(organisation_id);

-- ─── Users ──────────────────────────────────────────────

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE','SUSPENDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_org ON users(organisation_id);
CREATE INDEX idx_users_group ON users(group_id);

-- ─── User Profiles ─────────────────────────────────────

CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  pin_configured BOOLEAN NOT NULL DEFAULT false,
  pin_hash TEXT,
  preferences JSONB NOT NULL DEFAULT '{}',
  accessibility_preferences JSONB NOT NULL DEFAULT '{}'
);

-- ─── Reset Plans ────────────────────────────────────────

CREATE TABLE reset_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  early_warning_signs TEXT NOT NULL DEFAULT '',
  triggers TEXT NOT NULL DEFAULT '',
  things_that_make_it_worse TEXT NOT NULL DEFAULT '',
  helpful_words TEXT NOT NULL DEFAULT '',
  preferred_supports TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reset_plans_user ON reset_plans(user_id);

-- ─── Support Contacts ──────────────────────────────────

CREATE TABLE support_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('TRUSTED_PERSON','WORKER')),
  name TEXT NOT NULL DEFAULT '',
  service_name TEXT,
  phone TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_support_contacts_user ON support_contacts(user_id);

-- ─── Reset Sessions ────────────────────────────────────

CREATE TABLE reset_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'IDLE' CHECK (status IN (
    'IDLE','INITIAL_CHECK_IN','SOFTEN','STABILISE',
    'FOLLOW_UP_CHECK_IN','STEP_FORWARD','COMPLETED','SUPPORT_INTERRUPTION'
  )),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  selected_next_step TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reset_sessions_user ON reset_sessions(user_id);
CREATE INDEX idx_reset_sessions_status ON reset_sessions(user_id, status);

-- ─── Check Ins ──────────────────────────────────────────

CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES reset_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('INITIAL','FOLLOW_UP')),
  sequence INTEGER NOT NULL DEFAULT 1,
  suds_rating NUMERIC(3,1) NOT NULL CHECK (suds_rating >= 0 AND suds_rating <= 10),
  suds_category TEXT NOT NULL CHECK (suds_category IN ('CALM','RISING','HIGH','CRISIS')),
  sensations JSONB NOT NULL DEFAULT '[]',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_check_ins_session ON check_ins(session_id);
CREATE INDEX idx_check_ins_user ON check_ins(user_id);
CREATE UNIQUE INDEX idx_check_ins_idempotent ON check_ins(session_id, type, sequence);

-- ─── Soften Selections ─────────────────────────────────

CREATE TABLE soften_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES reset_sessions(id) ON DELETE CASCADE,
  option TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_soften_selections_session ON soften_selections(session_id);

-- ─── Stabilise Attempts ────────────────────────────────

CREATE TABLE stabilise_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES reset_sessions(id) ON DELETE CASCADE,
  strategy TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  selected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_stabilise_attempts_session ON stabilise_attempts(session_id);

-- ─── Next Steps ─────────────────────────────────────────

CREATE TABLE next_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES reset_sessions(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_next_steps_session ON next_steps(session_id);

-- ─── Distress Alerts ────────────────────────────────────

CREATE TABLE distress_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  group_id UUID NOT NULL REFERENCES groups(id),
  user_id UUID NOT NULL REFERENCES users(id),
  check_in_id UUID NOT NULL UNIQUE REFERENCES check_ins(id),
  session_id UUID NOT NULL REFERENCES reset_sessions(id),
  suds_rating NUMERIC(3,1) NOT NULL,
  suds_category TEXT NOT NULL CHECK (suds_category IN ('CALM','RISING','HIGH','CRISIS')),
  check_in_type TEXT NOT NULL CHECK (check_in_type IN ('INITIAL','FOLLOW_UP')),
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','ACKNOWLEDGED','RESOLVED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID
);

CREATE INDEX idx_distress_alerts_user ON distress_alerts(user_id);
CREATE INDEX idx_distress_alerts_org ON distress_alerts(organisation_id);
CREATE INDEX idx_distress_alerts_group ON distress_alerts(group_id);
CREATE INDEX idx_distress_alerts_status ON distress_alerts(status);
CREATE INDEX idx_distress_alerts_session ON distress_alerts(session_id);

-- ─── Audit Events ───────────────────────────────────────

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('USER','STAFF','SYSTEM')),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);

-- ─── Future Staff Tables (prepared, not used by mobile) ─

CREATE TABLE staff_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'CLINICIAN' CHECK (role IN ('CLINICIAN','TEAM_LEAD','ADMIN')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE staff_group_access (
  staff_user_id UUID NOT NULL REFERENCES staff_users(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  PRIMARY KEY (staff_user_id, group_id)
);

-- ─── Row Level Security ─────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reset_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reset_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE soften_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE stabilise_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE distress_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own user record
CREATE POLICY "users_own_read" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_own_update" ON users FOR UPDATE USING (auth.uid() = id);

-- Profiles
CREATE POLICY "profiles_own" ON user_profiles FOR ALL USING (auth.uid() = user_id);

-- Reset plans
CREATE POLICY "reset_plans_own" ON reset_plans FOR ALL USING (auth.uid() = user_id);

-- Support contacts
CREATE POLICY "support_contacts_own" ON support_contacts FOR ALL USING (auth.uid() = user_id);

-- Reset sessions
CREATE POLICY "reset_sessions_own" ON reset_sessions FOR ALL USING (auth.uid() = user_id);

-- Check ins
CREATE POLICY "check_ins_own" ON check_ins FOR ALL USING (auth.uid() = user_id);

-- Soften selections (via session ownership)
CREATE POLICY "soften_own" ON soften_selections FOR ALL
  USING (session_id IN (SELECT id FROM reset_sessions WHERE user_id = auth.uid()));

-- Stabilise attempts (via session ownership)
CREATE POLICY "stabilise_own" ON stabilise_attempts FOR ALL
  USING (session_id IN (SELECT id FROM reset_sessions WHERE user_id = auth.uid()));

-- Next steps (via session ownership)
CREATE POLICY "next_steps_own" ON next_steps FOR ALL
  USING (session_id IN (SELECT id FROM reset_sessions WHERE user_id = auth.uid()));

-- Distress alerts — user can INSERT and read their own
CREATE POLICY "alerts_own_read" ON distress_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "alerts_own_insert" ON distress_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Audit events — user can insert their own
CREATE POLICY "audit_own_insert" ON audit_events FOR INSERT WITH CHECK (auth.uid() = actor_id);
CREATE POLICY "audit_own_read" ON audit_events FOR SELECT USING (auth.uid() = actor_id);

-- Organisations and groups — read-only for authenticated users
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orgs_read" ON organisations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "groups_read" ON groups FOR SELECT USING (auth.role() = 'authenticated');

-- ─── Updated At Trigger ─────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reset_plans_updated_at BEFORE UPDATE ON reset_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER support_contacts_updated_at BEFORE UPDATE ON support_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reset_sessions_updated_at BEFORE UPDATE ON reset_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER organisations_updated_at BEFORE UPDATE ON organisations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at();
