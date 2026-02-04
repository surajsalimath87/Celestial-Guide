import React, { useState, useEffect, Component } from 'react';
import { Geolocation } from '@capacitor/geolocation';

// ==========================================
// ASTRO-INTELLIGENCE UNIT (AIU) - CONFIG
// ==========================================

const DEFAULT_SUBJECT = {
    name: "Surajkumar Salimath",
    dob: "September 8, 1987",
    tob: "10:30 AM",
    pob: "Gadag, Karnataka, India",
    indicators: {
        ascendant: "Libra (Tula)",
        moonSign: "Aquarius (Kumbha)",
        sunSign: "Leo (Simha)",
        dayNumber: "8 (Saturn)"
    }
};

const CONTACT_TYPES = [
    { key: 'boss', label: 'Boss', icon: '👔' },
    { key: 'colleagues', label: 'Colleagues', icon: '👥' },
    { key: 'wife', label: 'Wife', icon: '💑' },
    { key: 'daughter', label: 'Daughter', icon: '👧' },
    { key: 'father', label: 'Father', icon: '👨' },
    { key: 'mother', label: 'Mother', icon: '👩' }
];

function generateSynastryPrompt(contacts) {
    if (!contacts || Object.keys(contacts).length === 0) return '';

    let synastrySection = `\n\n### **SYNASTRY ANALYSIS (Inner Circle)**\nThe subject has provided birth data for their Inner Circle. For EACH person below, calculate:\n1. Their approximate Sun sign and Moon sign based on DOB\n2. Key compatibility aspects with the subject's chart\n3. Today's transit impact on THEIR chart that affects interaction dynamics\n\n**Inner Circle Data:**\n`;

    Object.entries(contacts).forEach(([key, contact]) => {
        if (contact && contact.name && contact.dob) {
            synastrySection += `- **${key.toUpperCase()}**: ${contact.name}, Born: ${contact.dob}${contact.tob ? ', Time: ' + contact.tob : ''}${contact.pob ? ', Place: ' + contact.pob : ''}\n`;
        }
    });

    synastrySection += `\nFor family_protocol and office sections, provide SYNASTRY-BASED advice considering BOTH charts. Mention specific aspects (e.g., "Your Mars squares her Moon today - avoid confrontation").`;

    return synastrySection;
}

const ANALYSIS_RULES = `
### **CRITICAL INSTRUCTIONS FOR ANALYSIS**
You are a high-precision Vedic Astrologer (Sidereal System). Provide an extremely detailed, narrative-rich analysis.

**Subject's Natal Chart:**
- Ascendant (Lagna): Libra (Tula)
- Moon (Mind): Aquarius (Kumbha)
- Sun (Soul): Leo (Simha)
- Day Number: 8 (Saturn)

**Your Task:**
1. **Cosmic Weather:** Current transit positions of Moon, Saturn, Rahu, Mercury, Mars, Venus.
2. **Deep Calculations:** For each major transit, calculate house position FROM Ascendant and Moon. Explain effects.
3. **Nakshatra Analysis:** Moon's Nakshatra and its ruling planet.
4. **Today's Code:** Mental Energy, Luck Factor (%), Productivity, Best Activity.
5. **Remedies:** 2-3 actionable remedies.
6. **Synastry Interactions:** If Inner Circle data provided, give CHART-BASED interaction advice.
7. **Verdict:** One powerful summary sentence.
8. **TECHNICAL AUDIT:** You MUST provide the raw mathematical data used for this specific date and location. Include Ayanamsa (Lahiri), exact degrees and minutes (Sphuta) for transiting planets, and local sunrise time.
9. **HOURLY INTENSITY:** Generate a 24-hour intensity index (array of 24 numbers, 0-100). 0=calm, 100=high stress/activity. Base this on Moon's nakshatra transitions, planetary hora, and Rahu-Ketu axis proximity.
10. **MUHURTA SCHEDULE:** Divide the day into 3-5 key time windows. Mark each as Shubh (good), Ashubh (avoid), or Neutral. Suggest best activity for each window.

**Style:** BLUNT, DIRECT, TECHNICAL. If bad, say it. Never sugar-coat.
`;

const RESPONSE_JSON_STRUCTURE = `
{
  "meta": { "date": "[YYYY-MM-DD]", "score": [0-100], "verdict": "[Summary sentence]" },
  "cosmic_weather": {
    "moon_transit": { "sign": "[Sign]", "nakshatra": "[Nakshatra]", "nakshatra_lord": "[Lord]" },
    "saturn_transit": { "sign": "[Sign]" },
    "rahu_transit": { "sign": "[Sign]" },
    "mercury_transit": { "sign": "[Sign]" }
  },
  "deep_calculations": [
    { "sector_name": "[Name]", "calculation": "[Technical]", "effect": "[Effect]", "action": "[Action]" }
  ],
  "todays_code": {
    "mental_energy": { "status": "[Status]", "insight": "[Insight]" },
    "luck_factor": { "percentage": [0-100], "insight": "[Insight]" },
    "productivity": { "status": "[Status]", "insight": "[Insight]" },
    "best_activity": "[Activity]"
  },
  "remedies": [{ "name": "[Name]", "action": "[Action]" }],
  "intelligence": {
    "primary_directive": { "command": "[Command]", "justification": "[Reason]" },
    "hazards": { "alert": "[Alert]", "justification": "[Reason]" },
    "office": { 
      "boss": "[Advice]", "boss_reason": "[Synastry reason if data available, else transit reason]",
      "colleagues": "[Advice]", "colleagues_reason": "[Reason]"
    }
  },
  "family_protocol": {
    "wife": { "advice": "[Synastry-based if data available]", "reason": "[Chart interaction reason]" },
    "daughter": { "advice": "[Advice]", "reason": "[Reason]" },
    "father": { "advice": "[Advice]", "reason": "[Reason]" },
    "mother": { "advice": "[Advice]", "reason": "[Reason]" }
  },
  "schedules": {
    "meditation": { "time": "HH:MM", "reason": "[Reason]" },
    "physical_output": { "time": "HH:MM", "reason": "[Reason]" },
    "recovery": { "time": "HH:MM", "reason": "[Reason]" }
  },
  "luck_vectors": { "color": "[Color]", "number": [Number], "lucky_window": "[Time range]" },
  "technical_audit": {
    "ayanamsa": "Lahiri (Chitra Paksha)",
    "calculation_time": "[HH:MM for which audit is calculated]",
    "local_sunrise": "[HH:MM]",
    "planetary_sphuta": {
      "moon": "[Deg° Min']",
      "saturn": "[Deg° Min']",
      "rahu": "[Deg° Min']",
      "jupiter": "[Deg° Min']",
      "mercury": "[Deg° Min']"
    },
    "varga_notes": "[Brief note on any specific divisional strength used]"
  },
  "hourly_intensity": {
    "description": "24-hour stress/opportunity index (0=calm, 100=intense)",
    "hours": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },
  "muhurta_schedule": [
    { "start": "HH:MM", "end": "HH:MM", "quality": "Shubh|Ashubh|Neutral", "activity": "[Best activity for this window]" }
  ]
}
`;

function generateSystemPrompt(location, contacts) {
    const synastryPrompt = generateSynastryPrompt(contacts);

    return `You are "Astro-Intelligence Unit (AIU)". 
Mission: Comprehensive daily astro-technical report for ${DEFAULT_SUBJECT.name}.
Natal Data: Born ${DEFAULT_SUBJECT.dob}, ${DEFAULT_SUBJECT.tob}, at ${DEFAULT_SUBJECT.pob}.
Current Location: ${location || 'Mumbai, India'} (for local sunrise/muhurtas).
Natal Configuration: ${JSON.stringify(DEFAULT_SUBJECT.indicators)}

${ANALYSIS_RULES}
${synastryPrompt}

Output: STRICT JSON ONLY. No markdown.
Format: ${RESPONSE_JSON_STRUCTURE}`;
}

// ==========================================
// GEMINI API SERVICE
// ==========================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function fetchForecast(date, location, contacts) {
    const systemPrompt = generateSystemPrompt(location, contacts);
    const userMessage = `Date: ${date}. Analyze planetary transits for subject. Respond ONLY with JSON. No markdown backticks.`;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\n" + userMessage }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 8192 }
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error("API Error:", response.status, errData);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (err) {
        console.error("Fetch Error:", err);
        throw new Error("Link failure. Check connection.");
    }
}

// ==========================================
// ERROR BOUNDARY
// ==========================================

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', minHeight: '100vh', color: '#333' }}>
                    <h2>System Malfunction</h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>{this.state.error?.message}</p>
                    <button onClick={() => window.location.reload()} style={styles.button}>Reboot System</button>
                </div>
            );
        }
        return this.props.children;
    }
}

// ==========================================
// AURA-SYNC COLOR THEMES
// ==========================================

const COLOR_THEMES = {
    'red': { bg: 'linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%)', accent: '#ef4444', accentLight: '#fecaca' },
    'orange': { bg: 'linear-gradient(180deg, #fffbeb 0%, #fed7aa 100%)', accent: '#f97316', accentLight: '#fdba74' },
    'yellow': { bg: 'linear-gradient(180deg, #fefce8 0%, #fef08a 100%)', accent: '#eab308', accentLight: '#fde047' },
    'green': { bg: 'linear-gradient(180deg, #f0fdf4 0%, #bbf7d0 100%)', accent: '#22c55e', accentLight: '#86efac' },
    'blue': { bg: 'linear-gradient(180deg, #eff6ff 0%, #bfdbfe 100%)', accent: '#3b82f6', accentLight: '#93c5fd' },
    'navy blue': { bg: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', accent: '#60a5fa', accentLight: '#1e40af', text: '#f8fafc' },
    'indigo': { bg: 'linear-gradient(180deg, #eef2ff 0%, #c7d2fe 100%)', accent: '#6366f1', accentLight: '#a5b4fc' },
    'purple': { bg: 'linear-gradient(180deg, #faf5ff 0%, #e9d5ff 100%)', accent: '#a855f7', accentLight: '#d8b4fe' },
    'pink': { bg: 'linear-gradient(180deg, #fdf2f8 0%, #fbcfe8 100%)', accent: '#ec4899', accentLight: '#f9a8d4' },
    'white': { bg: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', accent: '#6366f1', accentLight: '#e0e7ff' },
    'black': { bg: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', accent: '#f8fafc', accentLight: '#475569', text: '#f8fafc' },
    'grey': { bg: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)', accent: '#64748b', accentLight: '#cbd5e1' },
    'brown': { bg: 'linear-gradient(180deg, #fef3c7 0%, #d6d3d1 100%)', accent: '#a16207', accentLight: '#ca8a04' },
    'default': { bg: '#f8fafc', accent: '#6366f1', accentLight: '#eef2ff' }
};

function getTheme(colorName) {
    if (!colorName) return COLOR_THEMES.default;
    const key = colorName.toLowerCase().trim();
    return COLOR_THEMES[key] || COLOR_THEMES.default;
}

// Default activities for each hour
function getDefaultActivity(hour) {
    const activities = {
        0: 'Deep rest phase',
        1: 'Sleep for recovery',
        2: 'Deep sleep ideal',
        3: 'REM sleep peak',
        4: 'Pre-dawn stillness',
        5: 'Brahma Muhurta begins',
        6: 'Meditation/prayer optimal',
        7: 'Light exercise/yoga',
        8: 'Breakfast & planning',
        9: 'Peak analytical work',
        10: 'Important meetings',
        11: 'Complex problem solving',
        12: 'Lunch break advised',
        13: 'Light creative work',
        14: 'Routine tasks',
        15: 'Tea break & review',
        16: 'Final push for tasks',
        17: 'Wrap up work',
        18: 'Family/personal time',
        19: 'Dinner preparations',
        20: 'Relaxation begins',
        21: 'Wind down activities',
        22: 'Prepare for sleep',
        23: 'Sleep recommended'
    };
    return activities[hour] || 'Standard activity';
}

// ==========================================
// UI COMPONENTS
// ==========================================

const App = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [location, setLocation] = useState(() => localStorage.getItem('aiu_location') || 'Mumbai, India');
    const [contacts, setContacts] = useState(() => {
        try { return JSON.parse(localStorage.getItem('aiu_contacts')) || {}; } catch { return {}; }
    });
    const [editingContact, setEditingContact] = useState(null);
    const [contactForm, setContactForm] = useState({ name: '', dob: '', tob: '', pob: '' });
    const [settingsTab, setSettingsTab] = useState('data'); // 'data' or 'audit' or 'retro'

    // Prashna Engine State
    const [showPrashna, setShowPrashna] = useState(false);
    const [prashnaQuestion, setPrashnaQuestion] = useState('');
    const [prashnaAnswer, setPrashnaAnswer] = useState(null);
    const [prashnaLoading, setPrashnaLoading] = useState(false);

    // Retro-Analysis State
    const [retroDate, setRetroDate] = useState('');
    const [retroEvent, setRetroEvent] = useState('');
    const [retroAnalysis, setRetroAnalysis] = useState(null);
    const [retroLoading, setRetroLoading] = useState(false);

    const rangeDates = [];
    const today = new Date();
    for (let i = -3; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        rangeDates.push(d);
    }

    useEffect(() => { loadForecast(); }, [selectedDate]);

    const loadForecast = async () => {
        setLoading(true);
        setError(null);
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const data = await fetchForecast(dateStr, location, contacts);
            setForecast(data);
        } catch (err) {
            setError(err.message || "Uplink Error");
        } finally {
            setLoading(false);
        }
    };

    const detectLocation = async () => {
        try {
            const perm = await Geolocation.requestPermissions();
            if (perm.location === 'granted') {
                const pos = await Geolocation.getCurrentPosition();
                const loc = `${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`;
                setLocation(loc);
                localStorage.setItem('aiu_location', loc);
            }
        } catch (err) {
            console.error('Location error:', err);
        }
    };

    const saveContact = (key) => {
        if (!contactForm.name || !contactForm.dob) return;
        const updated = { ...contacts, [key]: contactForm };
        setContacts(updated);
        localStorage.setItem('aiu_contacts', JSON.stringify(updated));
        setEditingContact(null);
        setContactForm({ name: '', dob: '', tob: '', pob: '' });
    };

    const clearContact = (key) => {
        const updated = { ...contacts };
        delete updated[key];
        setContacts(updated);
        localStorage.setItem('aiu_contacts', JSON.stringify(updated));
    };

    const startEdit = (key) => {
        setEditingContact(key);
        setContactForm(contacts[key] || { name: '', dob: '', tob: '', pob: '' });
    };

    // Morning Mission Audio Briefing
    const [isPlaying, setIsPlaying] = useState(false);
    const [showBriefingText, setShowBriefingText] = useState(false);
    const [briefingText, setBriefingText] = useState('');

    const playMorningMission = () => {
        if (!forecast) {
            alert('Load a forecast first');
            return;
        }

        // Build the script
        let script = `Good morning. This is your Astro Intelligence Briefing for ${forecast.meta?.date || 'today'}. `;

        // Primary Directive
        if (forecast.intelligence?.primary_directive?.command) {
            script += `Primary Directive: ${forecast.intelligence.primary_directive.command}. ${forecast.intelligence.primary_directive.justification || ''} `;
        }

        // Hazards
        if (forecast.intelligence?.hazards?.alert) {
            script += `Hazard Alert: ${forecast.intelligence.hazards.alert}. ${forecast.intelligence.hazards.justification || ''} `;
        }

        // Synastry Advice for contacts with data
        if (contacts.wife?.name && forecast.family_protocol?.wife?.advice) {
            script += `Regarding ${contacts.wife.name}: ${forecast.family_protocol.wife.advice}. `;
        }
        if (contacts.daughter?.name && forecast.family_protocol?.daughter?.advice) {
            script += `With ${contacts.daughter.name}: ${forecast.family_protocol.daughter.advice}. `;
        }
        if (contacts.boss?.name && forecast.intelligence?.office?.boss) {
            script += `With your boss ${contacts.boss.name}: ${forecast.intelligence.office.boss}. `;
        }
        if (contacts.father?.name && forecast.family_protocol?.father?.advice) {
            script += `With ${contacts.father.name}: ${forecast.family_protocol.father.advice}. `;
        }

        // Verdict
        script += `Final Verdict: ${forecast.meta?.verdict || 'Stay aligned.'} Mission briefing complete.`;

        setBriefingText(script);

        // Check for TTS support
        if (!window.speechSynthesis) {
            // Show text instead if TTS not available
            setShowBriefingText(true);
            alert('Audio not available on this device. Showing briefing text instead.');
            return;
        }

        // Stop if already playing
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        // Speak with TTS
        try {
            const utterance = new SpeechSynthesisUtterance(script);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.lang = 'en-IN';
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = (e) => {
                console.error('TTS Error:', e);
                setIsPlaying(false);
                setShowBriefingText(true);
            };

            setIsPlaying(true);
            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.error('TTS failed:', err);
            setShowBriefingText(true);
        }
    };

    // Prashna Engine - Ask Before You Act
    const askPrashna = async () => {
        if (!prashnaQuestion.trim()) return;
        setPrashnaLoading(true);
        setPrashnaAnswer(null);

        const prashnaPrompt = `You are a Vedic Prashna (Horary) Astrologer. 
The querent is ${DEFAULT_SUBJECT.name} (born ${DEFAULT_SUBJECT.dob}, ${DEFAULT_SUBJECT.tob}, ${DEFAULT_SUBJECT.pob}).
Current Location: ${location}
Question asked at: ${new Date().toISOString()}

The question is: "${prashnaQuestion}"

Cast a Prashna Kundli for this exact moment. Analyze:
1. The Lagna (Ascendant) and its lord
2. Moon's position and nakshatra
3. Relevant house lords for the question topic
4. Any immediate aspects or yogas

Provide a clear YES, NO, or WAIT answer with detailed astrological justification.

Respond in JSON only:
{
  "answer": "YES|NO|WAIT",
  "confidence": [0-100],
  "summary": "[One sentence answer]",
  "reasoning": "[Detailed astrological reasoning]",
  "timing": "[If YES/WAIT, when is favorable]",
  "caution": "[Any warnings or conditions]"
}`;

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prashnaPrompt }] }],
                    generationConfig: { temperature: 0.7 }
                })
            });
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const clean = text.replace(/```json\n?|\n?```/g, '').trim();
            setPrashnaAnswer(JSON.parse(clean));
        } catch (err) {
            setPrashnaAnswer({ answer: 'ERROR', summary: 'Unable to cast Prashna chart. Try again.' });
        } finally {
            setPrashnaLoading(false);
        }
    };

    // Retro-Analysis - Past Event Decoder
    const analyzeRetro = async () => {
        if (!retroDate || !retroEvent.trim()) return;
        setRetroLoading(true);
        setRetroAnalysis(null);

        const retroPrompt = `You are a Vedic Transit Analyst. 
The subject is ${DEFAULT_SUBJECT.name} (born ${DEFAULT_SUBJECT.dob}, ${DEFAULT_SUBJECT.tob}, ${DEFAULT_SUBJECT.pob}).
Natal Configuration: Ascendant Libra, Moon Aquarius, Sun Leo.

On ${retroDate}, the following event occurred: "${retroEvent}"

Analyze the transits on that date and explain WHY this event happened from an astrological perspective.
Consider:
1. Saturn's transit position relative to natal Moon
2. Jupiter's transit and any major aspects
3. Rahu-Ketu axis and any eclipses near that date
4. Dasha period the subject was running
5. Any significant planetary conjunctions or oppositions

Provide a retrospective cosmic explanation.

Respond in JSON only:
{
  "event_date": "${retroDate}",
  "primary_trigger": "[Main astrological reason]",
  "transits": [
    { "planet": "[Planet]", "position": "[Sign/House]", "effect": "[Effect on event]" }
  ],
  "dasha_context": "[Likely Mahadasha/Antardasha context]",
  "cosmic_lesson": "[What the universe was teaching through this event]",
  "pattern_note": "[Any recurring pattern this event is part of]"
}`;

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: retroPrompt }] }],
                    generationConfig: { temperature: 0.7 }
                })
            });
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const clean = text.replace(/```json\n?|\n?```/g, '').trim();
            setRetroAnalysis(JSON.parse(clean));
        } catch (err) {
            setRetroAnalysis({ primary_trigger: 'Analysis failed. Please try again.' });
        } finally {
            setRetroLoading(false);
        }
    };

    // Settings Page
    if (showSettings) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <div onClick={() => setShowSettings(false)} style={{ cursor: 'pointer', fontSize: '24px' }}>←</div>
                    <div style={{ marginLeft: '12px' }}>
                        <div style={styles.appTitle}>Settings</div>
                        <div style={styles.appSubtitle}>Configure Your Intel</div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <div onClick={() => setSettingsTab('data')} style={{ ...styles.tab, ...(settingsTab === 'data' ? styles.activeTab : {}) }}>Input</div>
                    <div onClick={() => setSettingsTab('audit')} style={{ ...styles.tab, ...(settingsTab === 'audit' ? styles.activeTab : {}) }}>Audit</div>
                    <div onClick={() => setSettingsTab('retro')} style={{ ...styles.tab, ...(settingsTab === 'retro' ? styles.activeTab : {}) }}>Retro</div>
                </div>


                {settingsTab === 'data' && (
                    <>
                        {/* Location Section */}
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>📍 Current Location</h3>
                            <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>{location}</div>
                            <button onClick={detectLocation} style={styles.button}>Detect GPS Location</button>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => { setLocation(e.target.value); localStorage.setItem('aiu_location', e.target.value); }}
                                placeholder="Or enter manually..."
                                style={styles.input}
                            />
                        </div>

                        {/* Inner Circle Section */}
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>👥 Inner Circle (Optional)</h3>
                            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '15px' }}>
                                Add birth data for personalized synastry-based interaction advice. All fields are optional.
                            </p>

                            {CONTACT_TYPES.map(ct => (
                                <div key={ct.key} style={styles.contactCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '20px' }}>{ct.icon}</span>
                                            <strong>{ct.label}</strong>
                                            {contacts[ct.key]?.name && <span style={styles.synastryBadge}>✨</span>}
                                        </div>
                                        {editingContact !== ct.key ? (
                                            <button onClick={() => startEdit(ct.key)} style={styles.smallButton}>
                                                {contacts[ct.key]?.name ? 'Edit' : 'Add'}
                                            </button>
                                        ) : null}
                                    </div>

                                    {contacts[ct.key]?.name && editingContact !== ct.key && (
                                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>
                                            {contacts[ct.key].name} • {contacts[ct.key].dob}
                                        </div>
                                    )}

                                    {editingContact === ct.key && (
                                        <div style={{ marginTop: '10px' }}>
                                            <input type="text" placeholder="Name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={styles.input} />
                                            <input type="text" placeholder="Date of Birth (e.g., Feb 28, 1988)" value={contactForm.dob} onChange={e => setContactForm({ ...contactForm, dob: e.target.value })} style={styles.input} />
                                            <input type="text" placeholder="Time of Birth (optional)" value={contactForm.tob} onChange={e => setContactForm({ ...contactForm, tob: e.target.value })} style={styles.input} />
                                            <input type="text" placeholder="Place of Birth (optional)" value={contactForm.pob} onChange={e => setContactForm({ ...contactForm, pob: e.target.value })} style={styles.input} />
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                <button onClick={() => saveContact(ct.key)} style={styles.button}>Save</button>
                                                <button onClick={() => setEditingContact(null)} style={{ ...styles.smallButton, background: '#f1f5f9' }}>Cancel</button>
                                                {contacts[ct.key]?.name && <button onClick={() => clearContact(ct.key)} style={{ ...styles.smallButton, color: '#ef4444' }}>Clear</button>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Technical Audit Tab */}
                {settingsTab === 'audit' && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>📐 Mathematical Audit Log</h3>
                        {forecast?.technical_audit ? (
                            <div style={{ fontSize: '12px', color: '#1e293b' }}>
                                <div style={styles.auditRow}><span>Ayanamsa:</span> <strong>{forecast.technical_audit.ayanamsa}</strong></div>
                                <div style={styles.auditRow}><span>Sunrise:</span> <strong>{forecast.technical_audit.local_sunrise}</strong></div>
                                <div style={styles.auditRow}><span>Calculated At:</span> <strong>{forecast.technical_audit.calculation_time}</strong></div>

                                <div style={{ ...styles.sectionTitle, marginTop: '20px', fontSize: '9px' }}>Planetary Sphuta (Degrees)</div>
                                {Object.entries(forecast.technical_audit.planetary_sphuta).map(([planet, degree]) => (
                                    <div key={planet} style={styles.auditRow}>
                                        <span style={{ textTransform: 'capitalize' }}>{planet}:</span>
                                        <strong>{degree}</strong>
                                    </div>
                                ))}

                                <div style={{ marginTop: '15px', padding: '10px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '11px', color: '#0369a1' }}>
                                    <strong>Engine Note:</strong> {forecast.technical_audit.varga_notes}
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                                No active forecast to audit.<br />Load a forecast first.
                            </div>
                        )}
                    </div>
                )}

                {/* Retro-Analysis Tab */}
                {settingsTab === 'retro' && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>🔙 Retro-Analysis</h3>
                        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '15px' }}>
                            Enter a past date and event to decode WHY it happened through the cosmic lens.
                        </p>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={styles.label}>Event Date</label>
                            <input
                                type="date"
                                value={retroDate}
                                onChange={(e) => setRetroDate(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={styles.label}>What Happened?</label>
                            <textarea
                                value={retroEvent}
                                onChange={(e) => setRetroEvent(e.target.value)}
                                placeholder="e.g., Got promoted, Had a major argument, Closed a big deal..."
                                style={{ ...styles.input, minHeight: '80px', resize: 'none' }}
                            />
                        </div>

                        <button
                            onClick={analyzeRetro}
                            disabled={retroLoading || !retroDate || !retroEvent.trim()}
                            style={{ ...styles.button, width: '100%', opacity: retroLoading ? 0.6 : 1 }}
                        >
                            {retroLoading ? 'Decoding...' : '🔮 Decode This Event'}
                        </button>

                        {retroAnalysis && (
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '15px', padding: '20px', color: '#fff', marginBottom: '15px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', opacity: 0.8 }}>EVENT DATE</div>
                                    <div style={{ fontSize: '24px', fontWeight: '900' }}>{retroAnalysis.event_date}</div>
                                    <div style={{ marginTop: '15px', fontSize: '14px', fontWeight: '700' }}>{retroAnalysis.primary_trigger}</div>
                                </div>

                                {retroAnalysis.transits?.map((t, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', paddingLeft: '15px', borderLeft: '3px solid #6366f1' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                                            {t.planet === 'Saturn' ? '🪐' : t.planet === 'Jupiter' ? '♃' : '⭐'}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: '800' }}>{t.planet} in {t.position}</div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{t.effect}</div>
                                        </div>
                                    </div>
                                ))}

                                {retroAnalysis.dasha_context && (
                                    <div style={{ ...styles.protocolBox, borderLeftColor: '#f59e0b' }}>
                                        <div style={{ ...styles.protocolLabel, color: '#f59e0b' }}>Dasha Context</div>
                                        <div style={{ fontSize: '12px', fontWeight: '700' }}>{retroAnalysis.dasha_context}</div>
                                    </div>
                                )}
                                {retroAnalysis.cosmic_lesson && (
                                    <div style={{ ...styles.protocolBox, borderLeftColor: '#8b5cf6' }}>
                                        <div style={{ ...styles.protocolLabel, color: '#8b5cf6' }}>Cosmic Lesson</div>
                                        <div style={{ fontSize: '12px', fontWeight: '700' }}>{retroAnalysis.cosmic_lesson}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <button onClick={() => { setShowSettings(false); loadForecast(); }} style={{ ...styles.button, width: '100%', marginTop: '10px' }}>
                    Apply & Refresh Forecast
                </button>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .no-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scroll::-webkit-scrollbar { display: none; }
      `}</style>
            <div style={{ ...styles.container, background: getTheme(forecast?.luck_vectors?.color).bg, color: getTheme(forecast?.luck_vectors?.color).text || '#1e293b' }}>
                {/* Branding */}
                <div style={{ ...styles.header, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={styles.logoBox}>🧭</div>
                        <div>
                            <div style={styles.appTitle}>Celestial Guide</div>
                            <div style={styles.appSubtitle}>Direct Vedic Intelligence</div>
                        </div>
                    </div>
                    <div onClick={() => setShowSettings(true)} style={{ cursor: 'pointer', fontSize: '24px', padding: '8px' }}>⚙️</div>
                </div>

                {/* Calendar */}
                <div style={{ ...styles.dateScroll, ...{ overflowX: 'auto' } }} className="no-scroll">
                    {rangeDates.map((date, idx) => {
                        const active = date.toDateString() === selectedDate.toDateString();
                        return (
                            <div key={idx} onClick={() => setSelectedDate(new Date(date))} style={{ ...styles.dateChip, ...(active ? styles.dateChipActive : {}) }}>
                                <div style={{ fontSize: '9px', fontWeight: '800', opacity: 0.6, color: active ? '#fff' : '#64748b' }}>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: '900', color: active ? '#fff' : '#1e293b' }}>
                                    {date.getDate()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Real-Time Muhurta Badge */}
                {forecast?.muhurta_schedule && forecast.muhurta_schedule.length > 0 && (() => {
                    const now = new Date();
                    const currentHour = now.getHours();
                    const currentMin = now.getMinutes();
                    const currentTime = currentHour * 60 + currentMin;

                    const currentMuhurta = forecast.muhurta_schedule.find(m => {
                        const [sh, sm] = m.start.split(':').map(Number);
                        const [eh, em] = m.end.split(':').map(Number);
                        const start = sh * 60 + sm;
                        const end = eh * 60 + em;
                        return currentTime >= start && currentTime < end;
                    }) || forecast.muhurta_schedule[0];

                    const isShubh = currentMuhurta?.quality?.toLowerCase().includes('shubh');
                    const badgeColor = isShubh ? '#22c55e' : (currentMuhurta?.quality?.toLowerCase().includes('ashubh') ? '#ef4444' : '#f59e0b');

                    return (
                        <div style={{ ...styles.card, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${badgeColor}` }}>
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: '800', color: badgeColor, textTransform: 'uppercase' }}>
                                    {isShubh ? '🟢 Shubh Muhurta' : (currentMuhurta?.quality?.toLowerCase().includes('ashubh') ? '🔴 Ashubh Period' : '🟡 Neutral Phase')}
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '4px' }}>{currentMuhurta?.activity}</div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'right' }}>
                                Until {currentMuhurta?.end}
                            </div>
                        </div>
                    );
                })()}

                {/* Cosmic Heatmap - 24 Hour Scrollable Timeline */}
                {forecast?.hourly_intensity?.hours && (
                    <div style={{ ...styles.card, padding: '15px' }}>
                        <div style={styles.sectionTitle}>🌡️ 24-Hour Cosmic Intensity</div>
                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '10px' }}>
                            Scroll → to view each hour. 🔵 Low stress | 🟢 Moderate | 🟡 Elevated | 🔴 High intensity
                        </div>
                        <div style={{ overflowX: 'auto', display: 'flex', gap: '8px', paddingBottom: '10px' }} className="no-scroll">
                            {forecast.hourly_intensity.hours.map((intensity, hour) => {
                                const isNow = new Date().getHours() === hour;
                                const hue = 240 - (intensity * 2.4);
                                const isPast = hour < new Date().getHours();
                                const activity = forecast.hourly_intensity.activities?.[hour] || getDefaultActivity(hour);

                                return (
                                    <div
                                        key={hour}
                                        style={{
                                            minWidth: '120px',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            background: isNow ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : (isPast ? '#f1f5f9' : '#fff'),
                                            border: isNow ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                                            color: isNow ? '#fff' : '#1e293b',
                                            opacity: isPast ? 0.6 : 1
                                        }}
                                    >
                                        <div style={{ fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
                                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                            {isNow && <span style={{ marginLeft: '5px' }}>◀ NOW</span>}
                                        </div>
                                        <div style={{
                                            height: '8px',
                                            borderRadius: '4px',
                                            background: `hsl(${hue}, 70%, ${isNow ? 80 : 50}%)`,
                                            marginBottom: '6px'
                                        }}></div>
                                        <div style={{ fontSize: '10px', fontWeight: '600', opacity: isNow ? 1 : 0.8 }}>
                                            {intensity}% intensity
                                        </div>
                                        <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.9, lineHeight: '1.3' }}>
                                            {activity}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                {loading ? (
                    <div style={styles.center}>
                        <div style={styles.spinner}></div>
                        <p style={styles.mutedText}>Analyzing planetary flux...</p>
                    </div>
                ) : error ? (
                    <div style={styles.card}>
                        <div style={styles.center}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
                            <p style={styles.mutedText}>{error}</p>
                            <button style={styles.button} onClick={loadForecast}>Retry Connection</button>
                        </div>
                    </div>
                ) : forecast ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {/* Verdict Banner */}
                        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '5px' }}>TODAY'S VERDICT</div>
                                    <div style={{ fontSize: '16px', fontWeight: '800', lineHeight: '1.4' }}>{forecast.meta?.verdict || 'Analyzing cosmic patterns...'}</div>
                                </div>
                                <button
                                    onClick={playMorningMission}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '50%',
                                        width: '44px',
                                        height: '44px',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {isPlaying ? '⏹️' : '🎙️'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', alignItems: 'center' }}>
                                <div style={{ fontSize: '11px', opacity: 0.7 }}>Vitality Score</div>
                                <div style={{ fontSize: '32px', fontWeight: '900' }}>{forecast.meta?.score || '--'}</div>
                            </div>
                        </div>

                        {/* Cosmic Weather */}
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>🌌 Cosmic Weather</h3>
                            <div style={styles.weatherGrid}>
                                <div style={styles.weatherItem}><span style={styles.weatherIcon}>🌙</span><strong>Moon</strong><div>{forecast.cosmic_weather?.moon_transit?.sign}</div><div style={styles.mutedText}>{forecast.cosmic_weather?.moon_transit?.nakshatra}</div></div>
                                <div style={styles.weatherItem}><span style={styles.weatherIcon}>🪐</span><strong>Saturn</strong><div>{forecast.cosmic_weather?.saturn_transit?.sign}</div></div>
                                <div style={styles.weatherItem}><span style={styles.weatherIcon}>☊</span><strong>Rahu</strong><div>{forecast.cosmic_weather?.rahu_transit?.sign}</div></div>
                                <div style={styles.weatherItem}><span style={styles.weatherIcon}>☿</span><strong>Mercury</strong><div>{forecast.cosmic_weather?.mercury_transit?.sign}</div></div>
                            </div>
                        </div>

                        {/* Deep Calculations */}
                        {forecast.deep_calculations?.map((calc, idx) => (
                            <div key={idx} style={styles.card}>
                                <h3 style={styles.sectionTitle}>{calc.sector_name}</h3>
                                <div style={styles.calcBox}>
                                    <div style={styles.calcLabel}>Calculation</div>
                                    <div style={{ fontSize: '12px', marginBottom: '10px' }}>{calc.calculation}</div>
                                    <div style={styles.calcLabel}>Effect</div>
                                    <div style={{ fontSize: '12px', marginBottom: '10px', fontWeight: '700' }}>{calc.effect}</div>
                                    <div style={{ ...styles.protocolBox, borderLeftColor: '#10b981', padding: '10px' }}>
                                        <div style={{ ...styles.protocolLabel, color: '#10b981' }}>Action</div>
                                        <div style={{ fontSize: '12px', fontWeight: '700' }}>{calc.action}</div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Today's Code (Metrics) */}
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>📊 Today's Code</h3>
                            <div style={styles.metricsGrid}>
                                <div style={styles.metricBox}><div style={styles.metricLabel}>Mental Energy</div><div style={styles.metricValue}>{forecast.todays_code?.mental_energy?.status}</div><div style={styles.mutedText}>{forecast.todays_code?.mental_energy?.insight}</div></div>
                                <div style={styles.metricBox}><div style={styles.metricLabel}>Luck Factor</div><div style={styles.metricValue}>{forecast.todays_code?.luck_factor?.percentage}%</div><div style={styles.mutedText}>{forecast.todays_code?.luck_factor?.insight}</div></div>
                                <div style={styles.metricBox}><div style={styles.metricLabel}>Productivity</div><div style={styles.metricValue}>{forecast.todays_code?.productivity?.status}</div><div style={styles.mutedText}>{forecast.todays_code?.productivity?.insight}</div></div>
                            </div>
                            <div style={{ ...styles.protocolBox, marginTop: '10px', borderLeftColor: '#f59e0b' }}>
                                <div style={{ ...styles.protocolLabel, color: '#f59e0b' }}>Best Activity</div>
                                <div style={{ fontSize: '13px', fontWeight: '700' }}>{forecast.todays_code?.best_activity}</div>
                            </div>
                        </div>

                        {/* Remedies */}
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>💎 Today's Remedies</h3>
                            {forecast.remedies?.map((remedy, idx) => (
                                <div key={idx} style={{ ...styles.protocolBox, borderLeftColor: '#8b5cf6' }}>
                                    <div style={{ ...styles.protocolLabel, color: '#8b5cf6' }}>{remedy.name}</div>
                                    <div style={{ fontSize: '12px', fontWeight: '700' }}>{remedy.action}</div>
                                </div>
                            ))}
                        </div>

                        {/* Directional Guidance */}
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>📍 Directional Guidance</h3>
                            <div style={styles.protocolBox}>
                                <div style={styles.protocolLabel}>Primary Directive</div>
                                <div style={styles.boldText}>{forecast.intelligence?.primary_directive?.command}</div>
                                <div style={styles.reasonNote}>{forecast.intelligence?.primary_directive?.justification}</div>
                            </div>
                            <div style={{ ...styles.protocolBox, borderLeftColor: '#ef4444' }}>
                                <div style={{ ...styles.protocolLabel, color: '#ef4444' }}>Hazard Alert</div>
                                <div style={styles.boldText}>{forecast.intelligence?.hazards?.alert}</div>
                                <div style={styles.reasonNote}>{forecast.intelligence?.hazards?.justification}</div>
                            </div>
                        </div>

                        {/* Human Relations */}
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>👥 Human Relations</h3>
                            <div style={styles.rowItem}><strong>Boss:</strong> {forecast.intelligence?.office?.boss}</div>
                            <div style={styles.rowItem}><strong>Social:</strong> {forecast.intelligence?.office?.colleagues}</div>
                            {['wife', 'daughter', 'father', 'mother'].map(m => (
                                <div key={m} style={styles.rowItem}>
                                    <strong>{m.toUpperCase()}:</strong> {forecast.family_protocol?.[m]?.advice}
                                </div>
                            ))}
                        </div>

                        {/* Operational Timing */}
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>⏰ Optimal Windows</h3>
                            <div style={styles.grid}>
                                <div style={styles.gridBox}><span>🧘</span><strong>{forecast.schedules?.meditation?.time}</strong><div style={styles.mutedText}>{forecast.schedules?.meditation?.reason}</div></div>
                                <div style={styles.gridBox}><span>⚡</span><strong>{forecast.schedules?.physical_output?.time}</strong><div style={styles.mutedText}>{forecast.schedules?.physical_output?.reason}</div></div>
                                <div style={styles.gridBox}><span>💤</span><strong>{forecast.schedules?.recovery?.time}</strong><div style={styles.mutedText}>{forecast.schedules?.recovery?.reason}</div></div>
                            </div>
                        </div>

                        {/* Luck Vectors */}
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>✨ Luck Vectors</h3>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: forecast.luck_vectors?.color || '#eee', border: '1px solid #ddd' }}></div>
                                    <span style={{ fontSize: '12px', fontWeight: '700' }}>{forecast.luck_vectors?.color}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px' }}>{forecast.luck_vectors?.number}</div>
                                    <span style={{ fontSize: '12px', fontWeight: '700' }}>Lucky Number</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px' }}>🕐</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700' }}>{forecast.luck_vectors?.lucky_window}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Prashna Floating Button */}
                <div
                    onClick={() => setShowPrashna(true)}
                    style={{
                        position: 'fixed',
                        bottom: '80px',
                        right: '20px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                        zIndex: 100
                    }}
                >
                    ❓
                </div>
            </div>

            {/* Prashna Modal */}
            {showPrashna && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 200,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '20px',
                        padding: '25px',
                        maxWidth: '400px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <div style={styles.appTitle}>Ask Before You Act</div>
                                <div style={styles.appSubtitle}>Prashna Kundli Engine</div>
                            </div>
                            <div onClick={() => { setShowPrashna(false); setPrashnaAnswer(null); setPrashnaQuestion(''); }} style={{ cursor: 'pointer', fontSize: '24px' }}>✕</div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={styles.label}>Your Question</label>
                            <textarea
                                value={prashnaQuestion}
                                onChange={(e) => setPrashnaQuestion(e.target.value)}
                                placeholder="Should I accept this job offer? Is this a good day to invest? Should I travel tomorrow?"
                                style={{ ...styles.input, minHeight: '80px', resize: 'none' }}
                            />
                        </div>

                        <button
                            onClick={askPrashna}
                            disabled={prashnaLoading || !prashnaQuestion.trim()}
                            style={{ ...styles.button, width: '100%', opacity: prashnaLoading ? 0.6 : 1 }}
                        >
                            {prashnaLoading ? 'Casting Chart...' : '🔮 Cast Prashna'}
                        </button>

                        {prashnaAnswer && (
                            <div style={{ marginTop: '20px' }}>
                                <div style={{
                                    padding: '20px',
                                    borderRadius: '15px',
                                    background: prashnaAnswer.answer === 'YES' ? '#dcfce7' : (prashnaAnswer.answer === 'NO' ? '#fee2e2' : '#fef3c7'),
                                    border: `2px solid ${prashnaAnswer.answer === 'YES' ? '#22c55e' : (prashnaAnswer.answer === 'NO' ? '#ef4444' : '#f59e0b')}`,
                                    textAlign: 'center',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>
                                        {prashnaAnswer.answer === 'YES' ? '✅' : (prashnaAnswer.answer === 'NO' ? '❌' : '⏳')}
                                    </div>
                                    <div style={{ fontSize: '24px', fontWeight: '900', color: prashnaAnswer.answer === 'YES' ? '#166534' : (prashnaAnswer.answer === 'NO' ? '#991b1b' : '#92400e') }}>
                                        {prashnaAnswer.answer}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}>
                                        Confidence: {prashnaAnswer.confidence}%
                                    </div>
                                </div>

                                <div style={styles.card}>
                                    <div style={{ ...styles.sectionTitle, marginBottom: '10px' }}>Summary</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '15px' }}>{prashnaAnswer.summary}</div>

                                    <div style={{ ...styles.sectionTitle, marginBottom: '10px' }}>Astrological Reasoning</div>
                                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '15px' }}>{prashnaAnswer.reasoning}</div>

                                    {prashnaAnswer.timing && (
                                        <>
                                            <div style={{ ...styles.sectionTitle, marginBottom: '10px' }}>Timing</div>
                                            <div style={{ fontSize: '12px', color: '#475569', marginBottom: '15px' }}>{prashnaAnswer.timing}</div>
                                        </>
                                    )}

                                    {prashnaAnswer.caution && (
                                        <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#92400e' }}>
                                            ⚠️ {prashnaAnswer.caution}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Briefing Text Modal (TTS Fallback) */}
            {showBriefingText && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 200,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '20px',
                        padding: '25px',
                        maxWidth: '400px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <div style={styles.appTitle}>🎙️ Morning Mission</div>
                                <div style={styles.appSubtitle}>Your Daily Briefing</div>
                            </div>
                            <div onClick={() => setShowBriefingText(false)} style={{ cursor: 'pointer', fontSize: '24px' }}>✕</div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: '15px',
                            padding: '20px',
                            color: '#fff',
                            fontSize: '14px',
                            lineHeight: '1.6'
                        }}>
                            {briefingText}
                        </div>
                    </div>
                </div>
            )}
        </ErrorBoundary>
    );
};

// ==========================================
// RESILIENT STYLES
// ==========================================

const styles = {
    container: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '30px 20px',
        paddingTop: 'max(30px, env(safe-area-inset-top, 30px))',
        paddingBottom: 'max(30px, env(safe-area-inset-bottom, 30px))',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'sans-serif',
        color: '#1e293b',
        boxSizing: 'border-box'
    },
    header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' },
    logoBox: { width: '44px', height: '44px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '20px', color: '#fff', textAlign: 'center', lineHeight: '44px' },
    appTitle: { fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' },
    appSubtitle: { fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' },
    dateScroll: { display: 'flex', gap: '10px', marginBottom: '25px' },
    dateChip: { minWidth: '55px', padding: '12px 10px', borderRadius: '14px', backgroundColor: '#fff', border: '1px solid #e2e8f0', textAlign: 'center', cursor: 'pointer' },
    dateChipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
    card: { backgroundColor: '#fff', borderRadius: '20px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '15px' },
    label: { fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '800' },
    badge: { backgroundColor: '#eef2ff', color: '#6366f1', padding: '6px 10px', borderRadius: '8px', fontSize: '9px', fontWeight: '800' },
    sectionTitle: { fontSize: '11px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' },
    protocolBox: { background: '#f8fafc', borderRadius: '12px', padding: '14px', borderLeft: '5px solid #6366f1', marginBottom: '10px' },
    protocolLabel: { fontSize: '9px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', marginBottom: '4px' },
    boldText: { fontSize: '14px', fontWeight: '800', marginBottom: '8px' },
    reasonNote: { fontSize: '11px', color: '#64748b', background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' },
    rowItem: { fontSize: '12px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
    gridBox: { background: '#f8fafc', padding: '15px 5px', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px' },
    button: { background: '#6366f1', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', marginTop: '15px' },
    center: { textAlign: 'center', padding: '60px 0' },
    spinner: { width: '30px', height: '30px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 15px auto', animation: 'spin 1s linear infinite' },
    mutedText: { fontSize: '10px', color: '#64748b', fontWeight: '500' },
    weatherGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
    weatherItem: { background: '#f8fafc', padding: '12px 8px', borderRadius: '10px', textAlign: 'center', fontSize: '11px' },
    weatherIcon: { fontSize: '18px', display: 'block', marginBottom: '4px' },
    calcBox: { background: '#f8fafc', borderRadius: '10px', padding: '12px' },
    calcLabel: { fontSize: '9px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', marginBottom: '4px' },
    metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' },
    metricBox: { background: '#f8fafc', padding: '12px 8px', borderRadius: '10px', textAlign: 'center' },
    metricLabel: { fontSize: '9px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' },
    metricValue: { fontSize: '14px', fontWeight: '900', color: '#1e293b', marginBottom: '4px' },
    input: { width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', marginTop: '8px', boxSizing: 'border-box' },
    contactCard: { background: '#f8fafc', borderRadius: '12px', padding: '15px', marginBottom: '10px' },
    synastryBadge: { fontSize: '12px', marginLeft: '5px' },
    smallButton: { background: '#eef2ff', color: '#6366f1', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '11px', cursor: 'pointer' },
    tab: { flex: 1, textAlign: 'center', padding: '10px', fontSize: '12px', fontWeight: '800', color: '#64748b', cursor: 'pointer', borderBottom: '2px solid #e2e8f0' },
    activeTab: { color: '#6366f1', borderBottomColor: '#6366f1' },
    auditRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }
};

export default App;
