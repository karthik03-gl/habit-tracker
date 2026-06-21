# Habit Tracker

A modern, offline-first habit tracker built with Next.js, React, Tailwind CSS, and Zustand.

## Features

- **Daily & Specific Day Habits**: Schedule habits for every day or specific days of the week.
- **Multiple completions**: Set a target count for each habit (e.g., drink 8 glasses of water).
- **Statistics & Streaks**: View your current and longest streaks, overall completion percentage, and top habits.
- **Heatmap**: GitHub-style consistency heatmap for each habit spanning the last 90 days.
- **Dark Mode**: Fully supports light and dark themes.
- **Local Storage**: All data is securely persisted locally on your device in your browser.
- **Export/Import**: Easily backup and restore your habit data via JSON.

## Technology Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Date Utilities**: date-fns
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: canvas-confetti

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Static Deployment

This project is configured for a fully static export (`output: 'export'`), which means it can be hosted anywhere that serves static HTML/JS/CSS files without a Node.js server (e.g., Vercel, Netlify, GitHub Pages).

To generate the static bundle, run:

```bash
npm run build
```

The exported files will be located in the `out/` directory.

Enjoy building your habits!
