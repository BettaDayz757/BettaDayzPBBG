-- Seed data for Enhanced BettaDayz PBBG
-- Initial data for development and testing

-- Insert default achievements
INSERT INTO achievements (id, name, description, category, type, difficulty, requirements, rewards, points, rarity, icon) VALUES
('ach_001', 'Welcome to BettaDayz', 'Complete your first login', 'progression', 'milestone', 'easy', 
 '[{"type": "action", "target": 1, "description": "Log in to the game"}]',
 '[{"type": "bettaBuckZ", "amount": 100}, {"type": "experience", "amount": 50}]',
 10, 'common', '🎉'),

('ach_002', 'First Purchase', 'Make your first purchase', 'business', 'milestone', 'easy',
 '[{"type": "purchases", "target": 1, "description": "Complete any purchase"}]',
 '[{"type": "bettaBuckZ", "amount": 250}, {"type": "title", "itemId": "Big Spender"}]',
 25, 'common', '💰'),

('ach_003', 'Level 10', 'Reach level 10', 'progression', 'milestone', 'medium',
 '[{"type": "level", "target": 10, "description": "Reach level 10"}]',
 '[{"type": "bettaBuckZ", "amount": 500}, {"type": "experience", "amount": 200}]',
 50, 'rare', '⭐'),

('ach_004', 'Guild Founder', 'Create a guild', 'social', 'milestone', 'medium',
 '[{"type": "guild_created", "target": 1, "description": "Create a guild"}]',
 '[{"type": "bettaBuckZ", "amount": 1000}, {"type": "title", "itemId": "Guild Master"}]',
 75, 'rare', '🏛️'),

('ach_005', 'Tournament Champion', 'Win a tournament', 'gaming', 'milestone', 'hard',
 '[{"type": "tournament_wins", "target": 1, "description": "Win any tournament"}]',
 '[{"type": "bettaBuckZ", "amount": 2000}, {"type": "title", "itemId": "Champion"}]',
 150, 'epic', '🏆'),

('ach_006', 'BettaBuckZ Millionaire', 'Accumulate 1,000,000 BettaBuckZ', 'business', 'milestone', 'legendary',
 '[{"type": "total_bettabuckz", "target": 100000000, "description": "Earn 1,000,000 BettaBuckZ total"}]',
 '[{"type": "bettaBuckZ", "amount": 50000}, {"type": "title", "itemId": "Millionaire"}]',
 500, 'legendary', '💎');

-- Insert default purchase packages
INSERT INTO purchase_packages (id, name, description, type, category, price_usd_cents, price_eur_cents, value, bonus_percentage, is_popular, is_best_value, tags) VALUES
('pkg_starter_bb', 'Starter BettaBuckZ Pack', 'Perfect for getting started in BettaDayz', 'one_time', 'currency', 99, 99, 
 '{"bettaBuckZ": 120}', 20, false, false, ARRAY['starter', 'currency', 'bonus']),

('pkg_basic_bb', 'Basic BettaBuckZ Pack', 'Great value for casual players', 'one_time', 'currency', 499, 499,
 '{"bettaBuckZ": 650}', 30, true, false, ARRAY['basic', 'currency', 'popular']),

('pkg_mega_bb', 'Mega BettaBuckZ Pack', 'Maximum value for serious players', 'one_time', 'currency', 1999, 1999,
 '{"bettaBuckZ": 3000}', 50, false, true, ARRAY['mega', 'currency', 'best-value']),

('pkg_entrepreneur', 'Entrepreneur Starter Pack', 'Everything you need to start your business empire', 'one_time', 'starter', 999, 999,
 '{"bettaBuckZ": 500, "gameMoney": 50000, "items": [{"itemId": "experience_boost_1h", "quantity": 5, "type": "boost"}, {"itemId": "money_boost_2h", "quantity": 3, "type": "boost"}]}',
 null, true, false, ARRAY['starter', 'business', 'bundle']);

-- Insert subscription plans
INSERT INTO subscription_plans (id, name, description, tier, price_monthly_cents, price_quarterly_cents, price_yearly_cents, benefits, savings, is_popular) VALUES
('sub_basic', 'Basic Premium', 'Essential premium features for casual players', 'basic', 499, 1299, 4799,
 '[{"id": "daily_bonus", "name": "Daily BettaBuckZ Bonus", "description": "+50 BettaBuckZ daily login bonus", "type": "multiplier", "value": 50}, {"id": "exp_boost", "name": "Experience Boost", "description": "+25% experience gain", "type": "multiplier", "value": 1.25}]',
 '{"quarterly": 13, "yearly": 20}', false),

('sub_premium', 'Premium Plus', 'Enhanced features for dedicated players', 'premium', 999, 2599, 9599,
 '[{"id": "daily_bonus_plus", "name": "Daily BettaBuckZ Bonus+", "description": "+100 BettaBuckZ daily login bonus", "type": "multiplier", "value": 100}, {"id": "exp_boost_plus", "name": "Experience Boost+", "description": "+50% experience gain", "type": "multiplier", "value": 1.5}, {"id": "money_boost", "name": "Money Boost", "description": "+30% money gain", "type": "multiplier", "value": 1.3}]',
 '{"quarterly": 13, "yearly": 20}', true),

('sub_ultimate', 'Ultimate VIP', 'Maximum benefits for the most dedicated players', 'ultimate', 1999, 5199, 19199,
 '[{"id": "daily_bonus_ultimate", "name": "Ultimate Daily Bonus", "description": "+200 BettaBuckZ daily login bonus", "type": "multiplier", "value": 200}, {"id": "exp_boost_ultimate", "name": "Ultimate Experience Boost", "description": "+100% experience gain", "type": "multiplier", "value": 2.0}, {"id": "money_boost_ultimate", "name": "Ultimate Money Boost", "description": "+50% money gain", "type": "multiplier", "value": 1.5}, {"id": "exclusive_vip_access", "name": "Exclusive VIP Access", "description": "Access to VIP-only content and features", "type": "exclusive"}]',
 '{"quarterly": 13, "yearly": 20}', false);

-- Insert store items
INSERT INTO store_items (id, name, description, category, type, rarity, price_bettabuckz, price_game_money, effects, is_tradeable, image_url) VALUES
('item_exp_boost_1h', 'Experience Boost (1 Hour)', 'Increases experience gain by 50% for 1 hour', 'boosts', 'boost', 'common', 100, null, 
 '{"type": "experience_multiplier", "value": 1.5, "duration": 3600}', true, '/images/items/exp-boost.png'),

('item_money_boost_2h', 'Money Boost (2 Hours)', 'Increases money gain by 30% for 2 hours', 'boosts', 'boost', 'uncommon', 250, null,
 '{"type": "money_multiplier", "value": 1.3, "duration": 7200}', true, '/images/items/money-boost.png'),

('item_business_suit_basic', 'Basic Business Suit', 'A professional looking suit for business meetings', 'cosmetics', 'cosmetic', 'common', 500, null,
 '{"type": "cosmetic", "slot": "outfit", "appearance": "business_suit_basic"}', true, '/images/items/business-suit.png'),

('item_luxury_car', 'Luxury Sports Car', 'A high-end sports car that increases your status', 'vehicles', 'cosmetic', 'epic', 5000, null,
 '{"type": "cosmetic", "category": "vehicle", "appearance": "luxury_sports_car", "status_bonus": 10}', true, '/images/items/luxury-car.png'),

('item_golden_watch', 'Golden Watch', 'An exclusive golden watch that shows your wealth', 'accessories', 'cosmetic', 'legendary', 10000, null,
 '{"type": "cosmetic", "slot": "accessory", "appearance": "golden_watch", "prestige_bonus": 5}', true, '/images/items/golden-watch.png');

-- Insert leaderboards
INSERT INTO leaderboards (id, name, description, type, category, entries) VALUES
('lb_global_level', 'Global Level Leaderboard', 'Top players by level globally', 'global', 'level', '[]'),
('lb_weekly_bettabuckz', 'Weekly BettaBuckZ Earners', 'Top BettaBuckZ earners this week', 'weekly', 'bettaBuckZ', '[]'),
('lb_monthly_achievements', 'Monthly Achievement Hunters', 'Players with most achievements this month', 'monthly', 'achievements', '[]'),
('lb_all_time_money', 'All-Time Money Makers', 'Richest players of all time', 'all_time', 'money', '[]'),
('lb_guild_power', 'Guild Power Rankings', 'Most powerful guilds', 'global', 'business', '[]');

-- Insert seasonal events
INSERT INTO seasonal_events (id, name, description, theme, type, status, start_date, end_date, activities, rewards) VALUES
('event_halloween_2025', 'Spooky Business Halloween 2025', 'A frightfully fun Halloween event with exclusive rewards!', 'halloween', 'holiday', 'upcoming',
 '2025-10-25 00:00:00+00', '2025-11-02 23:59:59+00',
 '[{"id": "collect_candy", "name": "Candy Collection", "description": "Collect 100 Halloween candies", "type": "collect", "target": 100, "rewards": [{"type": "bettaBuckZ", "amount": 500}]}, {"id": "spooky_purchases", "name": "Spooky Shopping", "description": "Make 5 purchases during the event", "type": "complete", "target": 5, "rewards": [{"type": "item", "itemId": "item_halloween_costume", "amount": 1}]}]',
 '[{"type": "bettaBuckZ", "amount": 1000, "isExclusive": true}, {"type": "title", "amount": 1, "itemId": "Halloween Master", "isExclusive": true}]'),

('event_christmas_2025', 'Winter Wonderland 2025', 'Celebrate the holiday season with festive activities!', 'christmas', 'holiday', 'upcoming',
 '2025-12-15 00:00:00+00', '2025-01-02 23:59:59+00',
 '[{"id": "gift_giving", "name": "Gift Exchange", "description": "Send 10 gifts to friends", "type": "socialize", "target": 10, "rewards": [{"type": "bettaBuckZ", "amount": 750}]}, {"id": "winter_challenges", "name": "Winter Challenges", "description": "Complete 15 daily challenges", "type": "complete", "target": 15, "rewards": [{"type": "item", "itemId": "item_santa_hat", "amount": 1}]}]',
 '[{"type": "bettaBuckZ", "amount": 2000, "isExclusive": true}, {"type": "title", "amount": 1, "itemId": "Holiday Hero", "isExclusive": true}]');

-- Insert tournaments
INSERT INTO tournaments (id, name, description, type, status, registration_start, registration_end, start_date, end_date, requirements, prizes, rules, max_participants) VALUES
('tour_business_battle_nov', 'November Business Battle', 'Compete to build the most profitable business empire!', 'business', 'upcoming',
 '2025-11-01 00:00:00+00', '2025-11-07 23:59:59+00', '2025-11-08 00:00:00+00', '2025-11-15 23:59:59+00',
 '{"minimumLevel": 5, "entryFee": {"bettaBuckZ": 1000}}',
 '[{"rank": 1, "rewards": {"bettaBuckZ": 10000, "title": "Business Tycoon", "badge": "gold_trophy"}}, {"rank": 2, "rewards": {"bettaBuckZ": 5000, "title": "Enterprise Leader", "badge": "silver_trophy"}}, {"rank": 3, "rewards": {"bettaBuckZ": 2500, "title": "Rising Star", "badge": "bronze_trophy"}}]',
 ARRAY['No cheating or exploiting game mechanics', 'Fair play and sportsmanship required', 'Tournament earnings count towards final score', 'Participants must remain active throughout the event'],
 100),

('tour_guild_war_winter', 'Winter Guild Wars', 'Epic guild vs guild competition for ultimate supremacy!', 'guild_war', 'upcoming',
 '2025-12-01 00:00:00+00', '2025-12-07 23:59:59+00', '2025-12-08 00:00:00+00', '2025-12-22 23:59:59+00',
 '{"guildRequired": true, "minimumLevel": 10}',
 '[{"rank": 1, "rewards": {"bettaBuckZ": 50000, "title": "Guild Champion", "badge": "guild_master"}}, {"rank": 2, "rewards": {"bettaBuckZ": 25000, "title": "Guild Warrior", "badge": "guild_hero"}}, {"rank": 3, "rewards": {"bettaBuckZ": 12500, "title": "Guild Defender", "badge": "guild_guardian"}}]',
 ARRAY['Guild cooperation is essential', 'All guild members contribute to score', 'Guild treasury contributions count', 'Guild activities and achievements matter'],
 50);

-- Function to create a user profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Player')
  );
  
  -- Create BettaBuckZ wallet
  INSERT INTO public.bettabuckz_wallets (user_id)
  VALUES (NEW.id);
  
  -- Create cross-domain integration
  INSERT INTO public.cross_domain_integrations (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to award achievement progress
CREATE OR REPLACE FUNCTION public.award_achievement_progress(
  p_user_id UUID,
  p_achievement_id UUID,
  p_progress_increment INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_progress INTEGER := 0;
  v_target_progress INTEGER;
  v_user_profile_id UUID;
BEGIN
  -- Get user profile ID
  SELECT id INTO v_user_profile_id FROM user_profiles WHERE user_id = p_user_id;
  
  IF v_user_profile_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get current progress and target
  SELECT 
    COALESCE(ua.progress, 0),
    (a.requirements->0->>'target')::INTEGER
  INTO v_current_progress, v_target_progress
  FROM achievements a
  LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = v_user_profile_id
  WHERE a.id = p_achievement_id;
  
  -- Insert or update progress
  INSERT INTO user_achievements (user_id, achievement_id, progress, is_completed, completed_at)
  VALUES (
    v_user_profile_id, 
    p_achievement_id, 
    LEAST(v_current_progress + p_progress_increment, v_target_progress),
    v_current_progress + p_progress_increment >= v_target_progress,
    CASE WHEN v_current_progress + p_progress_increment >= v_target_progress THEN NOW() ELSE NULL END
  )
  ON CONFLICT (user_id, achievement_id) DO UPDATE SET
    progress = LEAST(user_achievements.progress + p_progress_increment, v_target_progress),
    is_completed = user_achievements.progress + p_progress_increment >= v_target_progress,
    completed_at = CASE WHEN user_achievements.progress + p_progress_increment >= v_target_progress AND user_achievements.completed_at IS NULL THEN NOW() ELSE user_achievements.completed_at END,
    updated_at = NOW();
    
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process BettaBuckZ transaction
CREATE OR REPLACE FUNCTION public.process_bettabuckz_transaction(
  p_user_id UUID,
  p_type TEXT,
  p_amount BIGINT,
  p_source TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance BIGINT;
  v_user_profile_id UUID;
BEGIN
  -- Get user profile ID
  SELECT id INTO v_user_profile_id FROM user_profiles WHERE user_id = p_user_id;
  
  IF v_user_profile_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get wallet
  SELECT id, balance INTO v_wallet_id, v_current_balance
  FROM bettabuckz_wallets 
  WHERE user_id = v_user_profile_id;
  
  -- Check for sufficient balance on spend operations
  IF p_type IN ('spend', 'transfer_out') AND v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Update wallet balance
  UPDATE bettabuckz_wallets 
  SET 
    balance = CASE 
      WHEN p_type IN ('earn', 'transfer_in', 'purchase', 'refund') THEN balance + p_amount
      WHEN p_type IN ('spend', 'transfer_out') THEN balance - p_amount
      ELSE balance
    END,
    total_earned = CASE 
      WHEN p_type IN ('earn', 'purchase') THEN total_earned + p_amount
      ELSE total_earned
    END,
    total_spent = CASE 
      WHEN p_type IN ('spend', 'transfer_out') THEN total_spent + p_amount
      ELSE total_spent
    END,
    updated_at = NOW()
  WHERE id = v_wallet_id;
  
  -- Record transaction
  INSERT INTO bettabuckz_transactions (
    user_id, wallet_id, type, amount, source, description, reference_id
  ) VALUES (
    v_user_profile_id, v_wallet_id, p_type, p_amount, p_source, p_description, p_reference_id
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;