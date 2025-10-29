-- OPTIONAL: Sample Data for Testing
-- Run this AFTER the main schema setup to populate your database with test data

-- Sample test user (you'll need to register through your app first)
-- This will be auto-created when you sign up through the website

-- Sample daily rewards schedule (30-day cycle)
-- This creates a monthly reward schedule that players can claim
INSERT INTO daily_rewards (id, user_id, day_number, reward_data, available_date, is_claimed) 
SELECT 
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000000', -- Placeholder user ID
  generate_series(1, 30),
  CASE 
    WHEN generate_series(1, 30) % 7 = 0 THEN '{"coins": 2000, "gems": 10}' -- Weekly bonus
    WHEN generate_series(1, 30) % 5 = 0 THEN '{"coins": 1000, "gems": 5}'  -- Every 5th day
    ELSE '{"coins": 500, "gems": 2}'                                         -- Daily reward
  END::jsonb,
  CURRENT_DATE + (generate_series(1, 30) - 1),
  false
ON CONFLICT DO NOTHING;

-- Sample inventory items (these will be added when users make purchases)
-- No need to pre-populate - items are added when purchased

-- Sample leaderboard categories
-- These will be populated as users play and gain stats

-- Success message
SELECT 'Sample data setup complete! Register a user through your app to see it in action.' as message;