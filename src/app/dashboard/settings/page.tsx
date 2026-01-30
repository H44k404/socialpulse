"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Save
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const settingsSections = [
  {
    id: "profile",
    title: "Profile Settings",
    description: "Manage your personal information and preferences",
    icon: User,
    items: [
      { label: "Full Name", type: "text", value: "John Doe" },
      { label: "Email", type: "email", value: "john@example.com" },
      { label: "Bio", type: "textarea", value: "Social media manager passionate about digital marketing." }
    ]
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Configure how you receive notifications",
    icon: Bell,
    items: [
      { label: "Email notifications", type: "toggle", value: true },
      { label: "Push notifications", type: "toggle", value: false },
      { label: "Post performance alerts", type: "toggle", value: true },
      { label: "Weekly reports", type: "toggle", value: true }
    ]
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize the look and feel of your dashboard",
    icon: Palette,
    items: [
      { label: "Theme", type: "select", value: "dark", options: ["light", "dark", "system"] }
    ]
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    description: "Manage your privacy settings and security preferences",
    icon: Shield,
    items: [
      { label: "Two-factor authentication", type: "toggle", value: false },
      { label: "Profile visibility", type: "select", value: "private", options: ["public", "private"] },
      { label: "Data sharing", type: "toggle", value: false }
    ]
  }
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState({
    profile: {
      fullName: "John Doe",
      email: "john@example.com",
      bio: "Social media manager passionate about digital marketing."
    },
    notifications: {
      email: true,
      push: false,
      performance: true,
      reports: true
    },
    appearance: {
      theme: "dark"
    },
    privacy: {
      twoFactor: false,
      visibility: "private",
      dataSharing: false
    }
  });

  const handleSave = () => {
    // Handle save logic here
    console.log("Settings saved:", settings);
  };

  const updateSetting = (section: string, key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-pulse-text">Settings</h1>
          <p className="mt-1 text-sm text-pulse-muted">
            Manage your account settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card padding="md">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-purple-500/20 text-purple-300"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card padding="lg">
            {settingsSections.map((section) => {
              if (activeSection !== section.id) return null;

              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Icon className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                      <p className="text-sm text-gray-400">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {section.items.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          {item.label}
                        </label>

                        {item.type === "text" && (
                          <Input
                            type="text"
                            value={settings.profile[item.label.toLowerCase().replace(" ", "") as keyof typeof settings.profile]}
                            onChange={(e) => updateSetting("profile", item.label.toLowerCase().replace(" ", ""), e.target.value)}
                          />
                        )}

                        {item.type === "email" && (
                          <Input
                            type="email"
                            value={settings.profile.email}
                            onChange={(e) => updateSetting("profile", "email", e.target.value)}
                          />
                        )}

                        {item.type === "textarea" && (
                          <textarea
                            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:bg-white/10 transition-colors"
                            rows={3}
                            value={settings.profile.bio}
                            onChange={(e) => updateSetting("profile", "bio", e.target.value)}
                          />
                        )}

                        {item.type === "toggle" && (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                const key = item.label.toLowerCase().replace(/[^a-z]/g, "");
                                const sectionKey = section.id as keyof typeof settings;
                                updateSetting(section.id, key, !settings[sectionKey][key as keyof typeof settings[typeof sectionKey]]);
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                item.value ? "bg-purple-500" : "bg-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  item.value ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span className="text-sm text-gray-400">
                              {item.value ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        )}

                        {item.type === "select" && (
                          <select
                            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:border-purple-400 focus:bg-white/10 transition-colors"
                            value={String(item.value)}
                            onChange={(e) => {
                              const key = item.label.toLowerCase();
                              updateSetting(section.id, key, e.target.value);
                            }}
                          >
                            {item.type === "select" && 'options' in item && item.options?.map((option) => (
                              <option key={option} value={option} className="bg-gray-800">
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

