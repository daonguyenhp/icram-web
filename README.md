# ICRAM - Focus & Productivity Companion

<div align="center">

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success.svg?style=flat-square)

**"Don't stop when you're tired. Stop when you're done."**

<h3>
  <a href="https://icram-web.onrender.com/">🌐 View Live Demo</a>
</h3>

</div>

---

## 📖 Introduction

**ICRAM** is a modern, distraction-free productivity web application designed to help users maintain focus and manage their time effectively. Built with a stunning **Glassmorphism** UI, it combines essential productivity tools—Pomodoro timers, stopwatches, task tracking, and an integrated background music player—into a single, aesthetic interface.

Whether you are coding, studying for exams, or working on creative projects, ICRAM provides the perfect environment to get into the "flow" state.

## ✨ Key Features

### 🎯 Focus Mode (Pomodoro)
- **Smart Timer:** Standard Pomodoro technique implementation with customizable intervals.
  - **Focus Time:** 25 minutes.
  - **Short Break:** 5 minutes.
  - **Long Break:** 15 minutes.
- **Visual Progress:** An elegant SVG-based circular progress ring that visualizes time passing.
- **Contextual UI:** The interface adapts based on the active mode.

### ⏱️ Timer Mode
- **Precision Stopwatch:** A digital timer for tracking open-ended tasks.
- **Lap Functionality:** Record specific milestones or splits without stopping the timer.
- **Persistent Tracking:** Keep track of your sub-tasks (Current vs Total time).

### 🎧 Immersive Music Hub
- **Integrated Player:** Built-in YouTube player overlay.
- **No Distractions:** Play music directly within the app without opening new tabs.
- **Smart Link Parsing:** Supports both single video links and YouTube Playlists.
- **Auto-Play:** Instant playback upon link submission.

### 🎨 Modern UI/UX
- **Glassmorphism Design:** Uses backdrop-filter blur, translucent layers, and soft gradients for a premium look.
- **Responsive Dashboard:** A centralized hub to manage settings, view stats, and navigate modes.
- **Task Pill:** Quick-access task input bar to remind you "What are you working on?".

## 🛠️ Tech Stack

This project is built using pure web technologies, focusing on performance and modularity without heavy framework dependencies.

* **HTML5**: Semantic structure.
* **CSS3**: 
    * Flexbox & Grid Layouts.
    * CSS Variables (`:root`) for theming.
    * Advanced Animations & Keyframes.
    * **Glassmorphism effects** (`backdrop-filter`).
* **JavaScript (ES6+)**: 
    * Modular architecture (`shared-ui.js` for reusable components).
    * DOM Manipulation.
    * Asynchronous fetching for loading HTML partials (`dashboard.html`, `music.html`).
* **FontAwesome**: For vector icons.
* **Fonts**: *Inter* and *Poppins* from Google Fonts.

## 📂 Project Structure

```text
ICRAM/
├── index.html                  # Landing Page (Home Entry Point)
├── style.css                   # Styles specifically for the Landing Page
├── material/                   # Static Assets (Images, Icons, SVGs)
│
└── client/                     # Main Client-side Application
    ├── auth/                   # Authentication Module
    │   ├── login.html          # Login Interface
    │   └── signup.html         # Registration Interface
    │
    └── data/                   # Core Application Modules & Components
        ├── shared-ui.js        # Shared Logic (Navigation, Music, TaskBar)
        ├── style-global.css    # Global Design System (Variables, Fonts)
        │
        ├── focus.html          # Focus Mode (Pomodoro) View
        ├── focus.js            # Focus Mode Logic
        ├── style-focus.css     # Focus Mode Styles
        │
        ├── timer.html          # Timer/Stopwatch View
        ├── timer.js            # Timer Logic
        ├── style-timer.css     # Timer Styles
        │
        ├── dashboard.html      # Dashboard Overlay Component
        ├── style-dashboard.css # Dashboard Styles
        └── music.html          # Music Player Component
