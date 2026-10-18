# StreakUp: Habit Tracker

StreakUp is a simple, accessible habit tracker designed for quick daily check-ins. A user can tick off their habits in a few taps, see their streaks grow, and review weekly progress.

This project is a working prototype of the app design submitted for the internship UX task. It runs in the browser and shows the app inside a phone-sized frame.

## Target user

**Dilini, 22**, a final-year university student and part-time intern. She wants to build 3 to 5 small daily habits (drink water, read, exercise, sleep on time) without spending time managing an app. She uses an Android phone, often one-handed, and has mild red-green color blindness, so the app never relies on color alone to show status.

**Problem statement:** People who want to build routines give up because most habit apps are crowded with features, so a quick daily check-in feels like a chore.

## Screens

| # | Screen | Purpose |
| --- | --- | --- |
| 1 | Welcome | Explains the app in one glance and gets the user started |
| 2 | Today (Home) | Check off today's habits and see streaks |
| 3 | Add / Edit Habit | Create a habit or change an existing one (name, icon, frequency, reminder time) |
| 4 | Habit Detail | Current and best streak, with a monthly calendar of completed and missed days |
| 5 | Progress | Weekly completion overview |
| 6 | Settings | Reminder time, text size, theme, and reset options |

## Navigation flow

```
Welcome -> Today (Home)
Today <-> Progress       (bottom tab bar)
Today <-> Settings       (bottom tab bar)
Today -> Add Habit -> Today   (Save or Cancel)
Today -> Habit Detail -> Edit Habit -> Today
Habit Detail -> Today    (back arrow)
```

The app uses a bottom tab bar with three tabs (Today, Progress, Settings). Today is the main hub, and every screen is within two taps of it.

## Accessibility features

- **Not color alone:** completed days show a checkmark and missed days show a dash, in addition to color.
- **Text size options:** normal, large, extra large, and accessible sizes in Settings.
- **Themes:** light, dark, and high-contrast.
- **Screen reader support:** buttons, tabs, and the calendar have descriptive labels.
- **One-handed use:** main actions sit in the lower part of the screen, with an optional one-handed reach guide.
- **Large touch targets** for checkboxes and buttons.

## Tech stack

- React 19 with TypeScript
- Vite
- Tailwind CSS
- Motion (animations) and Lucide (icons)
- Browser `localStorage` for saving data (no backend or account needed)

## Run locally

**Prerequisite:** [Node.js](https://nodejs.org) (LTS version)

1. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```
   The `--legacy-peer-deps` flag avoids a harmless version conflict between `vite` and `esbuild`.
2. Start the app:
   ```
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

No API key or `.env` file is needed.

### Other commands

| Command | What it does |
| --- | --- |
| `npm run build` | Creates a production build in the `dist` folder |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Checks the TypeScript code for errors |

## Project structure

```
src/
  App.tsx               App shell, navigation and state
  types.ts              Shared TypeScript types
  components/           One component per screen, plus the tab bar and About modal
  utils/                Habit calculations and localStorage helpers
  index.css             Global styles
```

## Notes

- Data is stored only in your browser. Clearing site data resets the app to its sample habits.
- Use **Settings > Reset Habits** to restore the sample data at any time.
- The app opens in a phone-sized frame by default. A toggle in the header switches to full width.