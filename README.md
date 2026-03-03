# 🌌 Celestial Guide - Direct Vedic Intelligence

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Gemini](https://img.shields.io/badge/Gemini_2.0-8E75E9?style=for-the-badge&logo=google-gemini&logoColor=white)](https://aistudio.google.com/)

**Celestial Guide** is a premium, high-engagement astrological command center. It transforms complex Vedic calculations into a sleek, actionable "Cosmic Operating System" for your daily life.

---

## ✨ "Wow" Features

### 1. 🎨 Aura-Sync UI (Dynamic Theming)
The app's entire atmosphere—gradients, shadows, and button glows—automatically shifts every morning to match your **Luck Vector (Color)** of the day.

### 2. 🌡️ Cosmic Heatmap (24-Hour Intensity)
A horizontal, interactive timeline that visualizes the "Cosmic Temperature" of the day. See exactly when stress ends and lucky windows open.

### 3. 🎙️ Morning Mission (AI Audio Briefing)
A one-tap audio summary of your day. Hear your "Primary Directive" and "Hazards" in an authoritative voice while you get ready.

### 4. ⏱️ Real-Time Muhurta Badge
A live indicator showing the current Muhurta quality (Shubh/Ashubh/Neutral) based on your GPS location.

### 5. ❓ Ask Before You Act (Prashna Engine)
A dedicated horary engine that casts a chart for the exact moment of your question to give you a cosmic YES, NO, or WAIT.

---

## 🛠️ Tech Stack

- **Core:** React 18 + Vite
- **Styling:** Vanilla CSS (Glassmorphism + Dynamic Theming)
- **Intelligence:** Google Gemini 2.0 Flash (via AI Studio)
- **Mobile Bridge:** Capacitor (iOS/Android)
- **State:** React Hooks + LocalStorage Persistence

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Google Gemini API Key. Get it for free at [Google AI Studio](https://aistudio.google.com/).

### 2. Installation
```bash
git clone https://github.com/surajsalimath87/Celestial-Guide.git
cd Celestial-Guide
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```
*(Refer to `.env.example` for details)*

### 4. Run Locally
```bash
npm run dev
```

---

## 📱 Mobile Deployment (Android)

```bash
npm run build
npx cap sync android
```
Then open the `android` folder in **Android Studio** to run on a physical device.

---

## 🛡️ Security & Privacy
- **No API Keys in Git:** The `.env` file is ignored by Git to ensure your API keys remain private.
- **Local Persistence:** Your profile data and "Inner Circle" contacts are stored locally on your device via `LocalStorage`.

---

## 📝 Customization
To set your default birth data, edit the `DEFAULT_SUBJECT` object in `src/App.jsx`. Alternatively, use the **Settings** menu within the app to update your profile on the fly.

---

**CELESTIAL GUIDE - ALIGN YOUR WORLD WITH THE STARS.**
