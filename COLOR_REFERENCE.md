# Quick Reference: New Color Scheme

## 🎨 Color Palette

### Core Colors
```
Black:       #000000  (Background)
White:       #FFFFFF  (Primary Text)
Gray:        #808080  (Accents)
```

### Social Media Platform Colors
```
Facebook:            #1877F2  🔵
Instagram:           #E4405F  📷
X (Twitter):         #000000  🐦
LinkedIn:            #0A66C2  💼
YouTube:             #FF0000  🎥
TikTok:              #000000  📱
Pinterest:           #E60B0B  📌
Snapchat:            #FFFC00  👻
WhatsApp:            #25D366  💬
Telegram:            #0088CC  📲
Reddit:              #FF4500  🔗
Discord:             #5865F2  💜
Twitch:              #9146FF  🎮
Threads:             #000000  📝
Mastodon:            #6364FF  🟣
BeReal:              #000000  😁
Google Business:     #4285F4  🏢
```

---

## 🎯 Where Colors Are Used

### Black & White Theme
- **Page backgrounds**: Black
- **Text content**: White
- **UI borders**: Gray (white with opacity)
- **Glass effects**: White overlay with opacity
- **Scrollbars**: Gray

### Platform Colors
- **Platform cards**: Left border colored
- **Platform indicators**: Status dots
- **Optional highlights**: Can be used in charts/stats
- **Never**: Main navigation or primary buttons

---

## 🖥️ Accessing the Website

### Current Status
✅ Development server running at `http://localhost:3000`

### View the Theme
1. Navigate to http://localhost:3000
2. Go to **Dashboard → Platforms**
3. See platform cards with colored left borders
4. Each platform shows its official brand color

---

## 💻 Using Colors in Code

### In Tailwind CSS
```html
<!-- Using utility classes -->
<div class="bg-black text-white border-white/10"></div>

<!-- Using gray variants -->
<div class="text-gray-400"></div>
```

### Using Platform Colors
```typescript
import { getPlatformColor } from "@/lib/constants";

const color = getPlatformColor("instagram");
// Returns: "#E4405F"
```

### In Inline Styles
```jsx
<div style={{ borderLeftColor: getPlatformColor("facebook") }}>
  Facebook Card
</div>
```

---

## 🎨 Styling Guidelines

### Do's ✅
- Use white for main text
- Use black for backgrounds
- Apply platform colors to platform-specific areas
- Use gray for secondary text and borders
- Maintain good contrast for accessibility

### Don'ts ❌
- Don't use platform colors for primary buttons
- Don't mix multiple platform colors in one component
- Don't use colored text on colored backgrounds
- Don't apply platform colors outside platform contexts

---

## 📱 Component Updates

### Components Using New Colors
- ✅ Button
- ✅ Card
- ✅ PlatformConnector
- ✅ All dashboard components
- ✅ Global styles

### Color Configuration
- **Tailwind Config**: `tailwind.config.ts`
- **Global Styles**: `src/styles/globals.css`
- **Constants**: `src/lib/constants.ts`
- **Utilities**: `src/lib/utils.ts`

---

## 🚀 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Check code quality
npm run lint
```

---

## 📸 Screenshot Locations

To see the new color scheme:
1. Home page: Black background with white text
2. Dashboard: Clean interface with white borders
3. Platform Connectors: Colored left borders matching platform brands
4. Composer: White text input areas
5. Analytics: Platform color indicators

---

## ❓ FAQ

**Q: Why pure black and white?**  
A: Provides a clean, modern, professional look with excellent contrast and readability.

**Q: Why platform colors only on platform cards?**  
A: Makes platform selection intuitive while keeping the interface clean and focused.

**Q: Can I customize colors?**  
A: Yes! Edit `tailwind.config.ts` and `src/lib/constants.ts` to modify colors.

**Q: Is this theme mobile-friendly?**  
A: Yes! All components are fully responsive with the new color scheme.

**Q: Performance impact?**  
A: None. Color changes are purely CSS-based with no JavaScript overhead.

---

## 🔗 Related Files

- [COLOR_SCHEME_UPDATE.md](COLOR_SCHEME_UPDATE.md) - Detailed update documentation
- [PERFORMANCE_OPTIMIZATIONS.md](PERFORMANCE_OPTIMIZATIONS.md) - Performance features
- [GETTING_STARTED.md](GETTING_STARTED.md) - Setup guide
- [RUN_COMMANDS.md](RUN_COMMANDS.md) - Command reference

---

**Ready to use!** 🚀  
Visit http://localhost:3000 to see the new black and white theme with platform colors.
