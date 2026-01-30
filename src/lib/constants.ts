// ============================================================
// CONSTANTS & CONFIGURATION FILE
// ============================================================
// This file contains all app constants, platform definitions,
// and color mappings. Customize here to change default values.
// ============================================================

// CUSTOMIZE: App name and tagline (shown in logo and UI)
export const APP_NAME = "SocialPulse";
export const APP_TAGLINE = "Command your social universe.";

// CUSTOMIZE: Keyboard shortcuts
// Format: ["Meta" or "Control", "key_character"]
// Change "k" to "p" for Cmd/Ctrl+P, "t" to "s" for Cmd/Ctrl+S, etc.
export const KEYBOARD_SHORTCUTS = {
  commandPalette: ["Meta", "k"] as const,  // Open command palette
  newPost: ["Meta", "n"] as const          // Create new post
};

export type PlatformKey =
  | "facebook"
  | "instagram"
  | "x"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "pinterest"
  | "snapchat"
  | "whatsapp_business"
  | "telegram"
  | "reddit"
  | "discord"
  | "twitch"
  | "threads"
  | "mastodon"
  | "bereal"
  | "google_business_profile";

export type PlatformDefinition = {
  key: PlatformKey;
  name: string;
  features: string[];
};

// CUSTOMIZE: Platform brand colors
// Use official brand colors for each platform
// These colors are used for platform icons and badges
// Find official hex codes at: brandcolors.net or official brand guidelines
export const PLATFORM_COLORS: Record<PlatformKey, string> = {
  facebook: "#1877F2",              // Official Facebook Blue
  instagram: "#E4405F",             // Official Instagram Pink
  x: "#000000",                     // X/Twitter Black
  linkedin: "#0A66C2",              // Official LinkedIn Blue
  youtube: "#FF0000",               // Official YouTube Red
  tiktok: "#000000",                // TikTok Black
  pinterest: "#E60B0B",             // Official Pinterest Red
  snapchat: "#FFFC00",              // Official Snapchat Yellow
  whatsapp_business: "#25D366",     // Official WhatsApp Green
  telegram: "#0088CC",              // Official Telegram Blue
  reddit: "#FF4500",                // Official Reddit Orange
  discord: "#5865F2",               // Official Discord Purple
  twitch: "#9146FF",                // Official Twitch Purple
  threads: "#000000",               // Threads Black
  mastodon: "#6364FF",              // Mastodon Purple
  bereal: "#000000",                // BeReal Black
  google_business_profile: "#4285F4" // Google Blue
};

// Helper function to get a platform's color
// Returns gray (#808080) if platform not found
export const getPlatformColor = (key: PlatformKey): string => {
  return PLATFORM_COLORS[key] || "#808080";
};

// CUSTOMIZE: Social media platforms supported by the app
// Add new platforms by creating a new entry with key, name, and features
// This list appears in the platform selector and settings
export const PLATFORMS: PlatformDefinition[] = [
  { key: "facebook", name: "Facebook", features: ["Posts", "Stories", "Reels"] },
  { key: "instagram", name: "Instagram", features: ["Feed", "Stories", "Reels"] },
  { key: "x", name: "Twitter / X", features: ["Posts", "Threads", "Analytics"] },
  { key: "linkedin", name: "LinkedIn", features: ["Posts", "Articles", "Company Pages"] },
  { key: "youtube", name: "YouTube", features: ["Videos", "Shorts", "Community"] },
  { key: "tiktok", name: "TikTok", features: ["Videos", "Shorts", "Trends"] },
  { key: "pinterest", name: "Pinterest", features: ["Pins", "Boards", "Idea Pins"] },
  { key: "snapchat", name: "Snapchat", features: ["Stories", "Spotlight", "Ads"] },
  {
    key: "whatsapp_business",
    name: "WhatsApp Business",
    features: ["Broadcasts", "Catalog", "Messaging"]
  },
  { key: "telegram", name: "Telegram", features: ["Channels", "Bots", "Broadcasts"] },
  { key: "reddit", name: "Reddit", features: ["Posts", "Comments", "Subreddits"] },
  { key: "discord", name: "Discord", features: ["Announcements", "Community", "Bots"] },
  { key: "twitch", name: "Twitch", features: ["Streams", "Clips", "Chat"] },
  { key: "threads", name: "Threads", features: ["Posts", "Threads", "Engagement"] },
  { key: "mastodon", name: "Mastodon", features: ["Toots", "Instances", "Federation"] },
  { key: "bereal", name: "BeReal", features: ["Posts", "Moments", "Friends"] },
  {
    key: "google_business_profile",
    name: "Google Business Profile",
    features: ["Updates", "Reviews", "Local Insights"]
  }
];

