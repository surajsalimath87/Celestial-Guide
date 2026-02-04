# Celestial Guide - Vedic Daily Intelligence

### Purpose
Providing daily serene guidance based on Vedic Sidereal Astrology for **Surajkumar Salimath**.

### System Features
- **Celestial Harmony UI:** Serene, card-based interface with a 7-day guidance window.
- **Deep Relationships:** Detailed insights for interacting with family and office superiors.
- **Optimal Flow:** Suggested timings for meditation, workout, and rest.
- **Secure Link:** Gemini API integration with environment variable support.

### Setup Instructions
1. **Environment Configuration:**
   - Open `.env` in the root directory.
   - Enter your Gemini API key: `VITE_GEMINI_API_KEY=your_key_here`.
2. **Local Development:**
   - Run `npm install`
   - Run `npm run dev`
   - Access at `http://localhost:3000`

### Building for Android (APK)
This project uses **Capacitor** to bridge the web application to a native Android environment.

#### Prerequisites
- **Android Studio** installed and configured.
- **Java JDK 17+** installed.
- **Android SDK** and Build Tools installed via Android Studio.

#### Build Workflow
1. **Build the Web Asset Bundle:**
   ```bash
   npm run build
   ```
2. **Initialize Capacitor (First time only):**
   ```bash
   npx cap init "Celestial Guide" com.celestial.guide --web-dir dist
   ```
3. **Add Android Platform:**
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```
4. **Sync Project:**
   ```bash
   npx cap sync
   ```
5. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```
6. **Generate APK:**
   - In Android Studio: `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`.

---
**CELESTIAL GUIDE - HARMONY IN EVERY MOMENT.**
