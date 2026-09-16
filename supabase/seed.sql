-- SSS Reset Kit — Development Seed Data
-- Realistic fictional data for development / design review
-- ================================================

-- ─── Organisations ──────────────────────────────────────

INSERT INTO organisations (id, name) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Wellspring Community Services'),
  ('a1000000-0000-0000-0000-000000000002', 'Harbour Youth Support');

-- ─── Groups ─────────────────────────────────────────────

INSERT INTO groups (id, organisation_id, name) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Residential Program A'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Outreach Team B'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Crisis Support Unit');

-- ─── Users (linked to Supabase Auth — IDs match auth.users) ──

-- User 1: Has complete plan and contacts, completed sessions
-- User 2: No plan, no contacts — empty state
-- User 3: Has plan but no contacts
-- User 4: Has crisis history
-- User 5: Has interrupted session
-- User 6: Has rising history
-- User 7: Has calm history

-- Note: In production these users are created via Supabase Auth.
-- For the dev adapter, we use static IDs.

INSERT INTO users (id, email, display_name, organisation_id, group_id, status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'alex@example.dev', 'Alex', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000002', 'jordan@example.dev', 'Jordan', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000003', 'sam@example.dev', 'Sam', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000004', 'riley@example.dev', 'Riley', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000005', 'casey@example.dev', 'Casey', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000006', 'morgan@example.dev', 'Morgan', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000007', 'taylor@example.dev', 'Taylor', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'ACTIVE');

-- ─── User Profiles ──────────────────────────────────────

INSERT INTO user_profiles (user_id, pin_configured) VALUES
  ('c1000000-0000-0000-0000-000000000001', true),
  ('c1000000-0000-0000-0000-000000000002', true),
  ('c1000000-0000-0000-0000-000000000003', true),
  ('c1000000-0000-0000-0000-000000000004', true),
  ('c1000000-0000-0000-0000-000000000005', true),
  ('c1000000-0000-0000-0000-000000000006', true),
  ('c1000000-0000-0000-0000-000000000007', true);

-- ─── Reset Plans ────────────────────────────────────────

-- Alex: complete plan
INSERT INTO reset_plans (id, user_id, early_warning_signs, triggers, things_that_make_it_worse, helpful_words, preferred_supports) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001',
    'Going quiet, racing thoughts, tight shoulders',
    'Loud environments, unexpected changes to routine',
    'Being asked lots of questions, bright lights, feeling rushed',
    'Take your time. You are safe here.',
    'Noise-cancelling headphones, walking outside, talking to Mum');

-- Sam: has plan but no contacts
INSERT INTO reset_plans (id, user_id, early_warning_signs, triggers, things_that_make_it_worse, helpful_words, preferred_supports) VALUES
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003',
    'Clenching jaw, pacing',
    'Conflict with housemates',
    'Being told to calm down',
    'I hear you. What do you need right now?',
    'Cold water, music, quiet room');

-- ─── Support Contacts ──────────────────────────────────

-- Alex: has both contacts
INSERT INTO support_contacts (id, user_id, type, name, phone) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'TRUSTED_PERSON', 'Mum', '0400000001'),
  ('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'WORKER', 'Sam (On-call team)', '0200000001');

-- ─── Completed Reset Sessions for Alex ──────────────────

INSERT INTO reset_sessions (id, user_id, status, started_at, completed_at, selected_next_step) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'COMPLETED',
    '2026-09-10T09:00:00Z', '2026-09-10T09:35:00Z', 'Have a drink or snack');

INSERT INTO check_ins (id, session_id, user_id, type, sequence, suds_rating, suds_category, sensations, submitted_at) VALUES
  ('g1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001',
    'INITIAL', 1, 5.0, 'RISING', '["tight chest", "restless legs"]', '2026-09-10T09:02:00Z'),
  ('g1000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001',
    'FOLLOW_UP', 2, 3.0, 'RISING', '["slight tension"]', '2026-09-10T09:28:00Z');

-- ─── Riley: Crisis history ──────────────────────────────

INSERT INTO reset_sessions (id, user_id, status, started_at, completed_at, selected_next_step) VALUES
  ('f1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'COMPLETED',
    '2026-09-12T14:00:00Z', '2026-09-12T14:45:00Z', 'Message someone I trust');

INSERT INTO check_ins (id, session_id, user_id, type, sequence, suds_rating, suds_category, sensations, submitted_at) VALUES
  ('g1000000-0000-0000-0000-000000000004', 'f1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004',
    'INITIAL', 1, 8.5, 'CRISIS', '["shaking", "nausea", "racing heart"]', '2026-09-12T14:03:00Z'),
  ('g1000000-0000-0000-0000-000000000005', 'f1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004',
    'FOLLOW_UP', 2, 5.5, 'RISING', '["calmer breathing"]', '2026-09-12T14:38:00Z');

INSERT INTO distress_alerts (id, organisation_id, group_id, user_id, check_in_id, session_id, suds_rating, suds_category, check_in_type, status) VALUES
  ('h1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000004', 'g1000000-0000-0000-0000-000000000004', 'f1000000-0000-0000-0000-000000000004',
    8.5, 'CRISIS', 'INITIAL', 'NEW');

-- ─── Casey: Interrupted session ─────────────────────────

INSERT INTO reset_sessions (id, user_id, status, started_at) VALUES
  ('f1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005', 'STABILISE',
    '2026-09-14T11:00:00Z');

INSERT INTO check_ins (id, session_id, user_id, type, sequence, suds_rating, suds_category, sensations, submitted_at) VALUES
  ('g1000000-0000-0000-0000-000000000006', 'f1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005',
    'INITIAL', 1, 6.5, 'HIGH', '["tense shoulders"]', '2026-09-14T11:05:00Z');

INSERT INTO distress_alerts (id, organisation_id, group_id, user_id, check_in_id, session_id, suds_rating, suds_category, check_in_type, status) VALUES
  ('h1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000005', 'g1000000-0000-0000-0000-000000000006', 'f1000000-0000-0000-0000-000000000005',
    6.5, 'HIGH', 'INITIAL', 'NEW');

-- ─── Taylor: Calm session history ───────────────────────

INSERT INTO reset_sessions (id, user_id, status, started_at, completed_at, selected_next_step) VALUES
  ('f1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000007', 'COMPLETED',
    '2026-09-13T08:00:00Z', '2026-09-13T08:15:00Z', 'Return gently to what I was doing');

INSERT INTO check_ins (id, session_id, user_id, type, sequence, suds_rating, suds_category, sensations, submitted_at) VALUES
  ('g1000000-0000-0000-0000-000000000007', 'f1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000007',
    'INITIAL', 1, 2.0, 'CALM', '[]', '2026-09-13T08:02:00Z');
