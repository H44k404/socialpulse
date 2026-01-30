"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Flame, Star, Target, Award, Crown, Zap, TrendingUp, Users, Calendar } from "lucide-react";

export function ProgressTracker() {
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly">("weekly");

  const goals = [
    { label: "Posts Target", current: 50, total: 100, unit: "posts", icon: Target },
    { label: "Engagement Target", current: 5000, total: 10000, unit: "engagements", icon: TrendingUp },
    { label: "Follower Growth", current: 500, total: 1000, unit: "followers", icon: Users },
    { label: "Response Rate", current: 85, total: 90, unit: "%", icon: Zap }
  ];

  const weeklyStreak = 12;
  const currentPoints = 2847;
  const nextRewardPoints = 3000;

  const teamLeaderboard = [
    { name: "You", points: 2847, rank: 1, avatar: "👤", change: "+150" },
    { name: "Sarah Chen", points: 2650, rank: 2, avatar: "👩", change: "+89" },
    { name: "Mike Johnson", points: 2430, rank: 3, avatar: "👨", change: "+67" },
    { name: "Emma Davis", points: 2280, rank: 4, avatar: "👩", change: "+45" },
    { name: "Alex Kim", points: 2150, rank: 5, avatar: "🧑", change: "+32" }
  ];

  const personalBests = [
    { title: "Longest Streak", value: "47 days", icon: Flame, color: "text-orange-400" },
    { title: "Best Week", value: "89 posts", icon: Star, color: "text-yellow-400" },
    { title: "Highest Engagement", value: "12.5K", icon: TrendingUp, color: "text-green-400" },
    { title: "Fastest Growth", value: "+500 followers", icon: Crown, color: "text-purple-400" }
  ];

  const monthlyChallenges = [
    {
      title: "Consistency Champion",
      description: "Post every day for 30 days",
      progress: 23,
      total: 30,
      reward: "🏆 Gold Badge",
      points: 500
    },
    {
      title: "Engagement Master",
      description: "Reach 10K total engagements",
      progress: 8750,
      total: 10000,
      reward: "💎 Diamond Badge",
      points: 750
    },
    {
      title: "Content Creator",
      description: "Create 50 pieces of content",
      progress: 37,
      total: 50,
      reward: "🎨 Creator Badge",
      points: 300
    }
  ];

  const achievements = [
    { name: "Consistency King 👑", earned: true, rarity: "legendary" },
    { name: "Engagement Master 🌟", earned: true, rarity: "epic" },
    { name: "30-Day Streak 🔥", earned: true, rarity: "rare" },
    { name: "Early Bird 🐦", earned: false, rarity: "common" },
    { name: "Night Owl 🦉", earned: false, rarity: "common" },
    { name: "Trendsetter 📈", earned: true, rarity: "epic" }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "from-yellow-400 to-orange-500";
      case "epic": return "from-purple-400 to-pink-500";
      case "rare": return "from-blue-400 to-cyan-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card gradientBorder padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progress Tracker</CardTitle>
              <CardDescription>Monthly goals, weekly performance, and achievement badges.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" dot>
                On track
              </Badge>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedPeriod("weekly")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    selectedPeriod === "weekly"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setSelectedPeriod("monthly")}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    selectedPeriod === "monthly"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Weekly Streak Counter */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl border border-white/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Flame className="w-8 h-8 text-orange-400" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{weeklyStreak} Week Streak</h3>
                  <p className="text-sm text-gray-400">Keep it up! 🔥</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">{currentPoints.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Points earned</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress to next reward</span>
                <span>{nextRewardPoints - currentPoints} points left</span>
              </div>
              <Progress
                value={(currentPoints / nextRewardPoints) * 100}
                className="h-2"
                gradient
              />
            </div>
          </motion.div>

          {/* Goals Progress */}
          <div className="space-y-4">
            {goals.map((g, index) => (
              <motion.div
                key={g.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Progress
                  value={(g.current / g.total) * 100}
                  label={`${g.label} (${g.current.toLocaleString()}/${g.total.toLocaleString()} ${g.unit})`}
                  showPercent
                  gradient
                  glowOnComplete
                />
              </motion.div>
            ))}
          </div>

          {/* Achievement Badges */}
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="text-pulse-muted font-medium">Achievement Badges</p>
              <Badge variant="info" size="sm">{achievements.filter(a => a.earned).length}/{achievements.length}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05, type: "spring" }}
                >
                  <Badge
                    variant={achievement.earned ? "success" : "info"}
                    pill
                    className={`transition-all duration-300 ${
                      achievement.earned
                        ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white shadow-lg`
                        : "opacity-50"
                    }`}
                  >
                    {achievement.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Team Leaderboard */}
      <Card gradientBorder padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Team Leaderboard
          </CardTitle>
          <CardDescription>See how you stack up against your team this {selectedPeriod === "weekly" ? "week" : "month"}.</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {teamLeaderboard.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                  member.rank === 1
                    ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-400/30"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    member.rank === 1 ? "bg-yellow-400/20 text-yellow-400" :
                    member.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                    member.rank === 3 ? "bg-orange-400/20 text-orange-400" :
                    "bg-white/10 text-gray-400"
                  } font-bold text-sm`}>
                    {member.rank === 1 ? "👑" : member.rank}
                  </div>
                  <div className="text-2xl">{member.avatar}</div>
                  <div>
                    <div className="font-medium text-white">{member.name}</div>
                    <div className="text-xs text-gray-400">{member.points.toLocaleString()} points</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    member.change.startsWith("+") ? "text-green-400" : "text-red-400"
                  }`}>
                    {member.change}
                  </div>
                  <div className="text-xs text-gray-400">this {selectedPeriod.slice(0, -2)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Personal Bests */}
      <Card gradientBorder padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Personal Bests
          </CardTitle>
          <CardDescription>Your all-time achievements and records.</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2">
            {personalBests.map((best, index) => (
              <motion.div
                key={best.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl border border-white/10 p-4 hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/10`}>
                    <best.icon className={`w-5 h-5 ${best.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{best.title}</div>
                    <div className="text-lg font-bold text-white">{best.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Monthly Challenges */}
      <Card gradientBorder padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Monthly Challenges
          </CardTitle>
          <CardDescription>Complete challenges to earn rewards and unlock achievements.</CardDescription>
        </CardHeader>
        <CardBody className="space-y-4">
          {monthlyChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl border border-white/10 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white">{challenge.title}</h4>
                  <p className="text-sm text-gray-400">{challenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-400">{challenge.reward}</div>
                  <div className="text-xs text-gray-400">+{challenge.points} pts</div>
                </div>
              </div>
              <Progress
                value={(challenge.progress / challenge.total) * 100}
                label={`${challenge.progress}/${challenge.total}`}
                showPercent
                gradient
                className="mb-2"
              />
            </motion.div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

