# ICRAM - Focus & Productivity Companion

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success.svg?style=flat-square)

**"Don't stop when you're tired. Stop when you're done."**

<h3>
  <a href="https://daonguyenhp.github.io/icram-web/">🌐 View Live Demo</a>
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
icram-web/
├── index.html          # Entry point (Landing/Home)
├── focus.html          # Focus Mode (Pomodoro) page
├── timer.html          # Timer/Stopwatch page
├── dashboard.html      # Dashboard overlay component
├── music.html          # Music player overlay component
│
├── css/
│   ├── style-global.css    # Core variables, resets, and layout
│   ├── style-focus.css     # Styles specific to Focus Mode
│   ├── style-timer.css     # Styles specific to Timer Mode
│   └── style-dashboard.css # Dashboard & Overlay styles
│
├── js/
│   ├── shared-ui.js    # Logic for shared components (Menu, Music, TaskBar)
│   ├── focus.js        # Logic for Pomodoro timer & SVG ring
│   └── timer.js        # Logic for Stopwatch & Laps
│
└── material/           # SVGs and image assets
