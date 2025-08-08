-- Update achievements with proper icons and ensure all achievements exist
-- This script ensures all achievements have proper icons and are properly configured

-- Update existing achievements with proper icons
UPDATE "Achievement" SET 
  "icon" = 'camera',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'first_scan';

UPDATE "Achievement" SET 
  "icon" = 'droplets',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'first_water_goal';

UPDATE "Achievement" SET 
  "icon" = 'check-circle',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'first_complete_day';

UPDATE "Achievement" SET 
  "icon" = 'flame',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" LIKE 'streak_%';

UPDATE "Achievement" SET 
  "icon" = 'waves',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'water_warrior';

UPDATE "Achievement" SET 
  "icon" = 'droplets',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'hydration_habit';

UPDATE "Achievement" SET 
  "icon" = 'mountain-snow',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'aqua_master';

UPDATE "Achievement" SET 
  "icon" = 'apple',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'calorie_champion';

UPDATE "Achievement" SET 
  "icon" = 'dumbbell',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'protein_power';

UPDATE "Achievement" SET 
  "icon" = 'wheat',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'fiber_friend';

UPDATE "Achievement" SET 
  "icon" = 'sunrise',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'early_bird';

UPDATE "Achievement" SET 
  "icon" = 'moon',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'night_owl';

UPDATE "Achievement" SET 
  "icon" = 'calendar',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'weekend_warrior';

UPDATE "Achievement" SET 
  "icon" = 'bar-chart-3',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'consistency_king';

UPDATE "Achievement" SET 
  "icon" = 'target',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'macro_master';

UPDATE "Achievement" SET 
  "icon" = 'gem',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'iron_will';

UPDATE "Achievement" SET 
  "icon" = 'scale',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" = 'balanced_week';

UPDATE "Achievement" SET 
  "icon" = 'star',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" LIKE 'level_%';

UPDATE "Achievement" SET 
  "icon" = 'trophy',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" LIKE 'total_%';

-- Ensure all achievements have proper rarity values
UPDATE "Achievement" SET 
  "rarity" = 'COMMON',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "rarity" NOT IN ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- Fix any achievements that might have incorrect rarity
UPDATE "Achievement" SET 
  "rarity" = 'UNCOMMON',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" IN ('water_warrior', 'protein_power', 'fiber_friend', 'early_bird', 'night_owl', 'total_10_days');

UPDATE "Achievement" SET 
  "rarity" = 'RARE',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" IN ('hydration_habit', 'calorie_champion', 'weekend_warrior', 'total_25_days', 'streak_14_days', 'level_25');

UPDATE "Achievement" SET 
  "rarity" = 'EPIC',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" IN ('aqua_master', 'balanced_week', 'consistency_king', 'total_50_days', 'streak_30_days', 'level_50');

UPDATE "Achievement" SET 
  "rarity" = 'LEGENDARY',
  "updated_at" = CURRENT_TIMESTAMP
WHERE "key" IN ('iron_will', 'total_100_days', 'streak_100_days');

-- Verify all achievements have proper data
SELECT 
  "key", 
  "title", 
  "icon", 
  "rarity", 
  "max_progress", 
  "points_awarded",
  "is_active"
FROM "Achievement" 
WHERE "is_active" = true 
ORDER BY "points_awarded" ASC;