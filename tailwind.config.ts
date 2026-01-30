import type { Config } from "tailwindcss";

// ============================================================
// CUSTOMIZATION GUIDE FOR TAILWIND CONFIGURATION
// ============================================================
// This file defines all the colors, spacing, and styles used
// throughout the SocialPulse application. Modify values below
// to customize the entire website's appearance.
// ============================================================

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // CUSTOMIZE: Main theme colors
        // These colors are used throughout the entire application
        pulse: {
          // CUSTOMIZE: primary - Main accent color (buttons, highlights, hover states)
          // Default: "#00D9FF" (Cyan)
          // Examples: "#6366F1" (Indigo), "#FF006E" (Pink), "#0EA5E9" (Sky Blue)
          primary: "#00D9FF",

          // CUSTOMIZE: secondary - Secondary accent (gradients, secondary UI elements)
          // Default: "#A78BFA" (Purple)
          // Examples: "#EC4899" (Pink), "#8338EC" (Purple), "#06B6D4" (Cyan)
          secondary: "#A78BFA",

          // CUSTOMIZE: accent - Tertiary color (badges, highlights, emphasis)
          // Default: "#EC4899" (Pink/Magenta)
          // Examples: "#F59E0B" (Amber), "#3A86FF" (Blue), "#FF006E" (Pink)
          accent: "#EC4899",

          // CUSTOMIZE: bg - Main background color
          // Default: "#0F172A" (Navy Blue)
          // Examples: "#000000" (Black), "#1F2937" (Dark Gray), "#1A1A2E" (Very Dark)
          bg: "#0F172A",

          // CUSTOMIZE: text - Main text color
          // Default: "#F8FAFC" (Light Gray/White)
          // Should contrast well with bg color
          // Examples: "#FFFFFF" (Pure White), "#F3F4F6" (Off White)
          text: "#F8FAFC",

          // CUSTOMIZE: muted - Secondary text color (captions, labels, disabled)
          // Default: "#94A3B8" (Slate)
          // Examples: "#9CA3AF" (Gray), "#6B7280" (Medium Gray)
          muted: "#94A3B8",

          // KEEP THESE: System colors (use for status indicators)
          success: "#10B981",  // Green - success states
          warning: "#F59E0B",  // Amber - warning states
          error: "#EF4444"     // Red - error states
        },

        // CUSTOMIZE: Glass effect colors (used in Card components)
        glass: {
          surface: "rgba(255, 255, 255, 0.05)",  // Background opacity
          border: "rgba(255, 255, 255, 0.1)"     // Border opacity
        },

        // CUSTOMIZE: Social media platform colors
        // These colors ONLY appear on platform-specific elements (icons, badges, cards)
        // Use official brand colors for recognition
        platforms: {
          facebook: "#1877F2",      // Official Facebook Blue
          instagram: "#E4405F",     // Official Instagram Pink
          x: "#000000",             // X/Twitter Black
          linkedin: "#0A66C2",      // Official LinkedIn Blue
          youtube: "#FF0000",       // Official YouTube Red
          tiktok: "#000000",        // TikTok Black
          pinterest: "#E60B0B",     // Official Pinterest Red
          snapchat: "#FFFC00",      // Official Snapchat Yellow
          whatsapp: "#25D366",      // Official WhatsApp Green
          telegram: "#0088CC",      // Official Telegram Blue
          reddit: "#FF4500",        // Official Reddit Orange
          discord: "#5865F2",       // Official Discord Purple
          twitch: "#9146FF",        // Official Twitch Purple
          threads: "#000000",       // Threads Black
          mastodon: "#6364FF",      // Mastodon Purple
          bereal: "#000000",        // BeReal Black
          google_business: "#4285F4" // Google Blue
        }
      },
      // CUSTOMIZE: Shadow effects (used on Card, Modal, and other elevated elements)
      // Adjust opacity and blur for different depth effects
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)"  // Shadow for glassmorphism cards
      },
      // CUSTOMIZE: Backdrop blur amount (used in modal overlays)
      // Increase value for stronger blur: 8px, 12px, 16px
      backdropBlur: {
        glass: "20px"  // Blur amount for overlay backgrounds
      },
      // CUSTOMIZE: Animation definitions (used throughout components)
      // Define custom animations here, then use in the animation section below
      keyframes: {
        // Float animation: used for floating elements
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        // Shimmer animation: used for loading states
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        // Ripple animation: used for button click effects
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.35" },
          "100%": { transform: "scale(1)", opacity: "0" }
        }
      },
      // CUSTOMIZE: Animation speeds and timing
      // Adjust these values to speed up or slow down animations
      // Example: "float 3s ease-in-out infinite" for faster float
      animation: {
        float: "float 6s ease-in-out infinite",      // Floating elements
        shimmer: "shimmer 10s ease infinite"         // Loading shimmer
      }
    }
  },
  plugins: []
};

export default config;

