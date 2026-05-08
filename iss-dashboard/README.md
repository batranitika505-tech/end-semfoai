# 🛰️ ISS Mission Control Dashboard

A production-ready, high-aesthetic orbital intelligence platform. Track the ISS, analyze telemetry, and explore space news with an integrated AI assistant.

## 📖 Project Overview
The **ISS Mission Control Dashboard** is a comprehensive real-time tracking system designed for space enthusiasts and researchers. It provides a "Mission Control" style interface that combines satellite telemetry, geographical intelligence, and AI-driven data analysis into a single, cohesive experience.

## ✨ Key Features
- **Live ISS Tracking**: High-precision coordinate tracking with orbital trajectory visualization.
- **Real-time Velocity Trends**: Dynamic speed monitoring using the Haversine formula and Chart.js.
- **Geographical Intel**: Automatic reverse geocoding to identify cities/countries or remote ocean areas.
- **Breaking News Dashboard**: Curated space news feed with search, sorting, and 15-minute smart caching.
- **Mission Personnel**: Live tracking of every human currently in space.
- **AI Mission Assistant**: A context-aware chatbot for data analysis and situational awareness.
- **Premium UI/UX**: Cinematic beige theme, glassmorphism, Framer Motion animations, and dark mode.

## 🛠️ Tech Stack
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Maps**: Leaflet.js, React Leaflet
- **Charts**: Chart.js, React ChartJS 2
- **State/Hooks**: Custom Hooks (`useISS`, `useNews`), React Context
- **Utilities**: Axios, Lucide React, React Hot Toast

## 🌐 APIs Used
- **ISS Position**: [Open Notify ISS API](http://api.open-notify.org/iss-now.json)
- **Astronaut Data**: [Open Notify Astros API](http://api.open-notify.org/astros.json)
- **Geocoding**: [BigDataCloud Reverse Geocoding](https://www.bigdatacloud.com/)
- **News**: [NewsAPI](https://newsapi.org/)
- **AI Model**: [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)

## 📁 Folder Structure
```text
iss-dashboard/
├── src/
│   ├── charts/       # Chart.js visualization components
│   ├── components/   # Modular UI components (News, Stats, AI, etc.)
│   ├── context/      # Theme and Global State providers
│   ├── hooks/        # Custom data fetching and logic hooks
│   ├── services/     # API communication layers
│   ├── utils/        # Mathematical and helper utilities
│   ├── pages/        # Main application layouts
│   └── App.jsx       # Root component
├── public/           # Static assets
└── .env.example      # Environment template
```

## 🤖 AI Model Explanation
**Model used:** `mistralai/Mistral-7B-Instruct-v0.2` via Hugging Face.

**Why this model?**
- **Lightweight & Fast**: Perfect for near-instant responses in a dashboard environment.
- **Superior Instruction Following**: Ensures the bot adheres strictly to the "only dashboard data" rule.
- **Contextual Awareness**: Excellent at processing the telemetry and news data provided in the system prompt for factual Q&A.

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iss-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`.
   - Add your `VITE_NEWS_API_KEY` from NewsAPI.
   - Add your `VITE_AI_TOKEN` from Hugging Face.

4. **Launch Application**
   ```bash
   npm run dev
   ```

## 📦 Deployment
This project is optimized for deployment on **Vercel** or **Netlify**:
1. Connect your GitHub repository.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add your Environment Variables in the platform's dashboard.

## 📸 Screenshots
*(Add your dashboard screenshots here after deployment)*

---
**Mission Control Online. All Systems Nominal.**
