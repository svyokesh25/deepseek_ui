# UI DeepSeek - Trading Platform Interface

A modern, high-performance web trading interface built with **Vue 3**, **Vite**, **Tailwind CSS**, and **TradingView Lightweight Charts**.

---

## 🛠 Tech Stack

* **Frontend Framework:** [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
* **Build Tool & Bundler:** [Vite 5](https://vitejs.dev/)
* **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) with PostCSS & Autoprefixer
* **Financial Charting:** [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) (`lightweight-charts` v4)
* **Runtime / Package Manager:** Node.js (v18+ recommended) & npm

---

## 📋 Prerequisites

Ensure you have the following installed on your system before proceeding:

* **Node.js**: Version 18.x or higher (Download from [nodejs.org](https://nodejs.org/))
* **npm**: Installed automatically with Node.js (version 9.x or higher)

Check your installed versions by running:
```bash
node -v
npm -v
```

---

## 🚀 Getting Started

### 1. Clone or Open the Repository
Open a terminal in the project root directory:
```bash
cd "ui_deepseek"
```

### 2. Install Dependencies
Install all required packages from `package.json`:
```bash
npm install
```

This installs:
- `vue` (^3.4.21)
- `lightweight-charts` (^4.1.3)
- `vite` (^5.2.0)
- `@vitejs/plugin-vue` (^5.0.4)
- `tailwindcss`, `postcss`, `autoprefixer`

---

### 3. Generate Source Components (If Missing / Resetting)
The project components and configurations can be generated or updated using the included modular scripts:

```bash
node theme.mjs
node theme2.mjs
node theme3.mjs
node theme4.mjs
```

> **Note:** If you encounter an error like `Failed to resolve import "./App.vue"`, running the four scripts above will populate all required files in `src/`.

---

### 4. Run the Development Server
To start the local development server:
```bash
npm run dev
```

Once started, open your browser and navigate to:
```
http://localhost:5173
```

---

## 📦 Available Scripts

In the project root, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) at port `5173` |
| `npm run build` | Compiles and bundles production-ready assets into the `dist/` directory |
| `npm run preview` | Locally serves the production build created in `dist/` for testing |

---

## 📁 Project Structure

```
ui_deepseek/
├── index.html                 # Main HTML entry file
├── package.json               # Project metadata, scripts, and dependencies
├── vite.config.js             # Vite configuration with Vue plugin
├── tailwind.config.js         # Custom theme colors and layout definitions
├── postcss.config.js          # PostCSS configuration for Tailwind
├── theme.mjs - theme4.mjs     # Component code generators
├── src/
│   ├── main.js                # App entrypoint (mounts App.vue and loads styles)
│   ├── style.css              # Custom styling and Tailwind utility classes
│   ├── App.vue                # Root application layout
│   ├── composables/
│   │   └── useChart.js        # Lightweight Charts initialization and data reactive binding
│   ├── data/
│   │   └── marketData.js      # Mock market data, symbols, and bar generator
│   └── components/
│       ├── TopToolbar.vue     # Top bar with tickers, search, timeframes
│       ├── SymbolHeader.vue   # OHLC display and current symbol info
│       ├── LeftToolbar.vue    # Left drawing tools rail
│       ├── ChartPanel.vue     # Interactive candlestick/bar/line chart canvas
│       ├── Watchlist.vue      # Symbol watchlist with Bid/Ask and search
│       ├── BottomPanel.vue    # Positions, pending orders, and history panel
│       └── BuySellBar.vue     # Quick trade execution bar
```

---

## ❓ Troubleshooting

### Error: `Failed to resolve import "./App.vue"`
This happens when `src/App.vue` or component files have not been generated yet. Run the theme generation scripts:
```bash
node theme.mjs
node theme2.mjs
node theme3.mjs
node theme4.mjs
```
Then rerun `npm run dev`.

### Port 5173 Already in Use
Vite will automatically pick the next available port (e.g. `5174`), or you can specify a port:
```bash
npx vite --port 3000
```
