import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Calendar,
  TrendingUp,
  Award,
  Target,
  Flame,
  Droplets,
  Star,
  Trophy,
  Crown,
  Zap,
  Heart,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Gem,
  Shield,
  Coffee,
  Moon,
  Sunrise,
  Mountain,
  Waves,
  Apple,
  Dumbbell,
  Wheat,
  Scale,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/src/i18n/context/LanguageContext";
import { useTheme } from "@/src/context/ThemeContext";
import { api } from "@/src/services/api";
import LoadingScreen from "@/components/LoadingScreen";

const { width } = Dimensions.get("window");

// Icon mapping for achievements
const ACHIEVEMENT_ICONS = {
  // Water achievements
  droplets: Droplets,
  waves: Waves,
  "mountain-snow": Mountain,
  
  // Meal achievements
  camera: Target,
  apple: Apple,
  dumbbell: Dumbbell,
  wheat: Wheat,
  
  // Time-based
  sunrise: Sunrise,
  moon: Moon,
  calendar: Calendar,
  
  // Progress
  "bar-chart-3": BarChart3,
  target: Target,
  gem: Gem,
  scale: Scale,
  
  // General
  trophy: Trophy,
  star: Star,
  flame: Flame,
  award: Award,
  crown: Crown,
  zap: Zap,
  heart: Heart,
  "check-circle": CheckCircle,
  clock: Clock,
  activity: Activity,
  shield: Shield,
  coffee: Coffee,
};

// Rarity colors
const RARITY_COLORS = {
  COMMON: "#CD7F32", // Bronze
  UNCOMMON: "#16A085", // Green
  RARE: "#3498DB", // Blue
  EPIC: "#9B59B6", // Purple
  LEGENDARY: "#F39C12", // Gold
};

interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  icon: string;
  rarity: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedDate?: string;
}

interface StatisticsData {
  level: number;
  currentXP: number;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  totalCompleteDays: number;
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFats: number;
  averageFiber: number;
  averageSugar: number;
  averageSodium: number;
  averageFluids: number;
  achievements: Achievement[];
  dailyBreakdown: any[];
  successfulDays: number;
  averageCompletion: number;
  perfectDays: number;
  weeklyStreak: number;
  happyDays: number;
  highEnergyDays: number;
  satisfiedDays: number;
  averageMealQuality: number;
}

export default function StatisticsScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { colors, isDark } = useTheme();
  
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("week");
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const periods = [
    { key: "today", label: t("statistics.today") || "Today" },
    { key: "week", label: t("statistics.week") || "Week" },
    { key: "month", label: t("statistics.month") || "Month" },
  ];

  useEffect(() => {
    loadStatistics();
  }, [selectedPeriod]);

  const loadStatistics = async () => {
    try {
      setError(null);
      console.log("📊 Loading statistics for period:", selectedPeriod);
      
      const response = await api.get(`/statistics?period=${selectedPeriod}`);
      
      if (response.data.success) {
        setStatisticsData(response.data.data);
        console.log("✅ Statistics loaded successfully");
      } else {
        throw new Error(response.data.error || "Failed to load statistics");
      }
    } catch (error: any) {
      console.error("💥 Error loading statistics:", error);
      setError(error.message || "Failed to load statistics");
      Alert.alert("Error", "Failed to load statistics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = ACHIEVEMENT_ICONS[iconName as keyof typeof ACHIEVEMENT_ICONS] || Trophy;
    return IconComponent;
  };

  const getRarityColor = (rarity: string) => {
    return RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.COMMON;
  };

  const renderAchievement = (achievement: Achievement) => {
    const IconComponent = getIconComponent(achievement.icon);
    const rarityColor = getRarityColor(achievement.rarity);
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
    
    return (
      <View key={achievement.id} style={[styles.achievementCard, { backgroundColor: colors.card }]}>
        <View style={styles.achievementHeader}>
          <View style={[styles.achievementIconContainer, { backgroundColor: colors.background }]}>
            <IconComponent 
              size={24} 
              color={achievement.unlocked ? rarityColor : colors.icon} 
              strokeWidth={2}
            />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, { color: colors.text }]}>
              {achievement.title}
            </Text>
            <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
              {achievement.description}
            </Text>
          </View>
          <View style={styles.achievementReward}>
            <Text style={[styles.xpReward, { color: rarityColor }]}>
              +{achievement.xpReward} XP
            </Text>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor + "20" }]}>
              <Text style={[styles.rarityText, { color: rarityColor }]}>
                {achievement.rarity}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {achievement.progress} / {achievement.maxProgress}
            </Text>
            <Text style={[styles.progressPercentage, { color: rarityColor }]}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: achievement.unlocked ? rarityColor : rarityColor + "60",
                  width: `${Math.min(progressPercentage, 100)}%` 
                }
              ]} 
            />
          </View>
        </View>
        
        {achievement.unlocked && achievement.unlockedDate && (
          <View style={styles.unlockedInfo}>
            <CheckCircle size={16} color={rarityColor} />
            <Text style={[styles.unlockedText, { color: colors.textSecondary }]}>
              Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderNutritionOverview = () => {
    if (!statisticsData) return null;

    const nutritionData = [
      {
        label: "Calories",
        value: statisticsData.averageCalories,
        unit: "kcal",
        icon: Flame,
        color: "#ef4444",
        target: 2000,
      },
      {
        label: "Protein",
        value: statisticsData.averageProtein,
        unit: "g",
        icon: Dumbbell,
        color: "#3b82f6",
        target: 120,
      },
      {
        label: "Carbs",
        value: statisticsData.averageCarbs,
        unit: "g",
        icon: Wheat,
        color: "#10b981",
        target: 250,
      },
      {
        label: "Fat",
        value: statisticsData.averageFats,
        unit: "g",
        icon: Droplets,
        color: "#f59e0b",
        target: 67,
      },
      {
        label: "Fiber",
        value: statisticsData.averageFiber,
        unit: "g",
        icon: Wheat,
        color: "#8b5cf6",
        target: 25,
      },
      {
        label: "Water",
        value: Math.round(statisticsData.averageFluids / 250), // Convert ml to cups
        unit: "cups",
        icon: Droplets,
        color: "#06b6d4",
        target: 8,
      },
    ];

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Nutrition Overview
        </Text>
        <View style={styles.nutritionGrid}>
          {nutritionData.map((item, index) => {
            const IconComponent = item.icon;
            const percentage = Math.min((item.value / item.target) * 100, 100);
            
            return (
              <View key={index} style={[styles.nutritionCard, { backgroundColor: colors.card }]}>
                <View style={styles.nutritionHeader}>
                  <View style={[styles.nutritionIcon, { backgroundColor: item.color + "20" }]}>
                    <IconComponent size={20} color={item.color} />
                  </View>
                  <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
                    {item.label}
                  </Text>
                </View>
                <Text style={[styles.nutritionValue, { color: colors.text }]}>
                  {Math.round(item.value)} {item.unit}
                </Text>
                <View style={styles.nutritionProgress}>
                  <View style={[styles.nutritionProgressTrack, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.nutritionProgressFill, 
                        { 
                          backgroundColor: item.color,
                          width: `${percentage}%` 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.nutritionPercentage, { color: item.color }]}>
                    {Math.round(percentage)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderUserLevel = () => {
    if (!statisticsData) return null;

    const xpToNextLevel = 100 - (statisticsData.currentXP % 100);
    const levelProgress = (statisticsData.currentXP % 100);

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Your Progress
        </Text>
        <View style={[styles.levelCard, { backgroundColor: colors.card }]}>
          <LinearGradient
            colors={[colors.primary + "15", colors.primary + "05"]}
            style={styles.levelGradient}
          >
            <View style={styles.levelHeader}>
              <View style={[styles.levelIcon, { backgroundColor: colors.primary + "20" }]}>
                <Crown size={32} color={colors.primary} />
              </View>
              <View style={styles.levelInfo}>
                <Text style={[styles.levelNumber, { color: colors.primary }]}>
                  Level {statisticsData.level}
                </Text>
                <Text style={[styles.totalPoints, { color: colors.textSecondary }]}>
                  {statisticsData.totalPoints.toLocaleString()} Total Points
                </Text>
              </View>
            </View>
            
            <View style={styles.xpProgress}>
              <View style={styles.xpInfo}>
                <Text style={[styles.xpText, { color: colors.textSecondary }]}>
                  {statisticsData.currentXP % 100} / 100 XP
                </Text>
                <Text style={[styles.xpToNext, { color: colors.textSecondary }]}>
                  {xpToNextLevel} XP to Level {statisticsData.level + 1}
                </Text>
              </View>
              <View style={[styles.xpProgressTrack, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.xpProgressFill, 
                    { 
                      backgroundColor: colors.primary,
                      width: `${levelProgress}%` 
                    }
                  ]} 
                />
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  };

  const renderStreakStats = () => {
    if (!statisticsData) return null;

    const streakData = [
      {
        label: "Current Streak",
        value: statisticsData.currentStreak,
        unit: "days",
        icon: Flame,
        color: "#ef4444",
      },
      {
        label: "Best Streak",
        value: statisticsData.bestStreak,
        unit: "days",
        icon: Trophy,
        color: "#f59e0b",
      },
      {
        label: "Perfect Days",
        value: statisticsData.perfectDays,
        unit: "days",
        icon: Star,
        color: "#8b5cf6",
      },
      {
        label: "Success Rate",
        value: Math.round(statisticsData.averageCompletion),
        unit: "%",
        icon: Target,
        color: "#10b981",
      },
    ];

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Streak & Performance
        </Text>
        <View style={styles.streakGrid}>
          {streakData.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <View key={index} style={[styles.streakCard, { backgroundColor: colors.card }]}>
                <View style={[styles.streakIcon, { backgroundColor: item.color + "20" }]}>
                  <IconComponent size={24} color={item.color} />
                </View>
                <Text style={[styles.streakValue, { color: colors.text }]}>
                  {item.value}
                </Text>
                <Text style={[styles.streakUnit, { color: colors.textSecondary }]}>
                  {item.unit}
                </Text>
                <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderAchievements = () => {
    if (!statisticsData?.achievements) return null;

    const unlockedAchievements = statisticsData.achievements.filter(a => a.unlocked);
    const lockedAchievements = statisticsData.achievements.filter(a => !a.unlocked);

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Achievements ({unlockedAchievements.length}/{statisticsData.achievements.length})
        </Text>
        
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <>
            <Text style={[styles.subsectionTitle, { color: colors.textSecondary }]}>
              Unlocked ({unlockedAchievements.length})
            </Text>
            {unlockedAchievements.map(renderAchievement)}
          </>
        )}
        
        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <>
            <Text style={[styles.subsectionTitle, { color: colors.textSecondary, marginTop: 24 }]}>
              In Progress ({lockedAchievements.length})
            </Text>
            {lockedAchievements.map(renderAchievement)}
          </>
        )}
      </View>
    );
  };

  if (isLoading) {
    return <LoadingScreen text={isRTL ? "טוען סטטיסטיקות..." : "Loading statistics..."} />;
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadStatistics}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("statistics.title") || "Statistics"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your nutrition journey
          </Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
                { 
                  backgroundColor: selectedPeriod === period.key 
                    ? colors.primary 
                    : colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  { 
                    color: selectedPeriod === period.key 
                      ? "#ffffff" 
                      : colors.text 
                  }
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* User Level */}
        {renderUserLevel()}

        {/* Nutrition Overview */}
        {renderNutritionOverview()}

        {/* Streak Stats */}
        {renderStreakStats()}

        {/* Achievements */}
        {renderAchievements()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  periodButtonActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  
  // Level Card
  levelCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  levelGradient: {
    padding: 20,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  levelIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  totalPoints: {
    fontSize: 14,
    marginTop: 2,
  },
  xpProgress: {
    gap: 8,
  },
  xpInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xpText: {
    fontSize: 14,
    fontWeight: "500",
  },
  xpToNext: {
    fontSize: 12,
  },
  xpProgressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  xpProgressFill: {
    height: "100%",
    borderRadius: 4,
  },

  // Nutrition Grid
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  nutritionCard: {
    width: (width - 64) / 2,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  nutritionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  nutritionLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  nutritionProgress: {
    gap: 4,
  },
  nutritionProgressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  nutritionProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  nutritionPercentage: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "right",
  },

  // Streak Grid
  streakGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  streakCard: {
    width: (width - 64) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  streakIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  streakUnit: {
    fontSize: 12,
    fontWeight: "500",
  },
  streakLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },

  // Achievement Card
  achievementCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  achievementReward: {
    alignItems: "flex-end",
  },
  xpReward: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  progressContainer: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: "bold",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  unlockedInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  unlockedText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  
  // Error states
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});