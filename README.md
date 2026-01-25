# FinBoard — Your Personal Finance Command Center

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Zustand-5-764ABC?style=for-the-badge" alt="Zustand 5" />
</div>

<br/>

<div align="center">
  <strong>Build. Connect. Monitor. — All your financial data in one customizable workspace.</strong>
  <br/>
  <sub>A sleek, Groww-inspired dashboard that puts you in control of your financial tracking</sub>
</div>

<br/>

---

## 🆕 Latest Updates

| Feature | Description |
|---------|-------------|
| 🏠 **Stunning Landing Page** | A polished, conversion-focused landing page with micro-interactions |
| ⚡ **Smooth Transitions** | Elegant preloader animation bridging landing → dashboard |
| 🎨 **Refined Dark Mode** | Premium navy/slate palette replacing standard grays |
| ☀️ **Light-First Design** | Clean, airy light theme set as the default experience |
| ✨ **Polished Interactions** | Enhanced hover states, transitions, and visual cues |

---

## 🎯 What is FinBoard?

FinBoard transforms how you monitor financial data. Instead of juggling multiple tabs and apps, create a **single unified dashboard** that pulls live data from any API you choose. Whether you're tracking Bitcoin prices, stock portfolios, or currency exchange rates — FinBoard adapts to your needs.

**Zero backend required.** Everything runs in your browser with data persisted locally.

---

## 🧩 Core Capabilities

### 📊 Widget System
Create unlimited widgets, each connected to a different data source:

| Widget Type | Best For | Example Use Case |
|-------------|----------|------------------|
| **Card** | Single metrics, KPIs | Current BTC price, portfolio value |
| **Table** | Multi-row data, lists | Top 10 cryptos, currency rates |
| **Chart** | Trends, time-series | Price history, market trends |

Every widget supports:
- ✏️ Custom naming
- 🔄 Configurable refresh intervals (5s minimum)
- 🎨 Field-level formatting (currency, %, numbers)
- 🗑️ One-click removal with confirmation
- 📋 Duplicate widget functionality

### 🔌 API Integration Engine
Connect to virtually any REST API that returns JSON:

- **Smart Response Parsing** — Navigate nested JSON with an interactive field picker
- **Auto-Refresh** — Set intervals from 5 seconds to hours
- **Caching Layer** — Intelligent caching minimizes redundant network calls
- **Error Recovery** — Graceful error states with manual retry options
- **Rate Limit Handling** — Built-in awareness to prevent quota exhaustion

### 🔐 API Key Vault
Securely manage credentials for premium data providers:

- Keys stored **exclusively in your browser** (never transmitted)
- Pre-configured support for Alpha Vantage, Finnhub, Twelve Data
- Add custom providers with your own naming
- Visual rate limit tracking per provider

### 🎨 Theming & Personalization
- **One-click theme toggle** — Switch between light and dark instantly
- **Persistent preferences** — Your choice survives page refreshes
- **Navy dark theme** — A refined slate palette, not boring gray

### 💾 Data Portability
Your dashboard configuration is fully portable:
- **Export** — Download your entire setup as a JSON file
- **Import** — Restore configurations on any device
- **Templates** — Quick-start with pre-built dashboard layouts

---

## 🚀 Quick Start

### Requirements
- Node.js **18.x** or newer
- Package manager: npm, yarn, or pnpm

### Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd finboard

# 2. Install dependencies
npm install

# 3. Fire up the dev server
npm run dev
```

Visit **http://localhost:3000** — you'll land on the welcome page. Hit "Get Started" to enter your dashboard.

### Production Build

```bash
npm run build   # Creates optimized production bundle
npm start       # Serves the production build
```

---

## 📂 Architecture

```
finboard/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── globals.css             # Global styles + custom animations
│   │   ├── layout.tsx              # Root layout with SEO metadata
│   │   ├── page.tsx                # Landing page (marketing)
│   │   └── dashboard/
│   │       └── page.tsx            # Main dashboard application
│   │
│   ├── components/
│   │   ├── landing/                # Landing page UI
│   │   │   ├── HeroSection.tsx     # Above-the-fold content
│   │   │   ├── FeaturesSection.tsx # Feature showcase grid
│   │   │   ├── CTASection.tsx      # Final call-to-action
│   │   │   ├── Navbar.tsx          # Top navigation bar
│   │   │   ├── Footer.tsx          # Page footer
│   │   │   ├── Preloader.tsx       # Transition animation
│   │   │   └── index.ts            # Barrel exports
│   │   │
│   │   ├── widgets/                # Data display components
│   │   │   ├── CardWidget.tsx      # Metric card display
│   │   │   ├── TableWidget.tsx     # Tabular data display
│   │   │   ├── ChartWidget.tsx     # Line/area chart display
│   │   │   └── index.ts
│   │   │
│   │   ├── Header.tsx              # Dashboard header
│   │   ├── DashboardGrid.tsx       # Drag-and-drop layout
│   │   ├── AddWidgetModal.tsx      # Widget creation wizard
│   │   ├── EditWidgetModal.tsx     # Widget configuration
│   │   ├── ApiKeyModal.tsx         # API key management
│   │   ├── TemplateSelector.tsx    # Template browser
│   │   ├── FloatingActions.tsx     # FAB menu
│   │   ├── QuickStats.tsx          # Dashboard summary
│   │   ├── Toast.tsx               # Notification system
│   │   ├── ConnectionStatus.tsx    # Network indicator
│   │   ├── EmptyState.tsx          # Zero-widget state
│   │   └── AddWidgetCard.tsx       # Add widget CTA card
│   │
│   ├── hooks/
│   │   ├── useWidgetData.ts        # Data fetching logic
│   │   └── useKeyboardShortcuts.ts # Hotkey management
│   │
│   ├── lib/
│   │   ├── api.ts                  # Fetch utilities + cache
│   │   ├── templates.ts            # Pre-built configurations
│   │   └── theme.ts                # Color palette definitions
│   │
│   ├── store/
│   │   └── dashboardStore.ts       # Zustand state container
│   │
│   └── types/
│       └── index.ts                # TypeScript interfaces
│
├── public/                         # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | Next.js 16 (App Router + Turbopack) | Blazing fast builds, excellent DX |
| **Language** | TypeScript 5 | Type safety across the codebase |
| **Styling** | Tailwind CSS 4 | Utility-first, zero runtime overhead |
| **State** | Zustand + persist middleware | Simple, performant, auto-persisted |
| **Charts** | Recharts | Composable React chart library |
| **Drag & Drop** | @dnd-kit | Accessible, performant DnD |
| **Icons** | Heroicons | Consistent, SVG-based iconography |
| **Dates** | date-fns | Lightweight date manipulation |
| **IDs** | uuid | RFC-compliant unique identifiers |

---

## 🌐 Connecting to APIs

### Free APIs (No Authentication)
Start immediately with these public endpoints:

| Provider | What It Offers | Sample Endpoint |
|----------|----------------|-----------------|
| **Coinbase** | Crypto exchange rates | `https://api.coinbase.com/v2/exchange-rates?currency=BTC` |
| **CoinGecko** | Crypto market data | `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd` |
| **Open Exchange** | Fiat currency rates | `https://open.er-api.com/v6/latest/USD` |

### Premium APIs (Key Required)
Unlock real-time stock data and more:

| Provider | Free Tier Limits | Ideal For |
|----------|------------------|-----------|
| **Alpha Vantage** | 5 calls/min, 500/day | Stocks, forex, crypto |
| **Finnhub** | 60 calls/min | Real-time quotes, news |
| **Twelve Data** | 8 calls/min, 800/day | Technical indicators |

### Configuring API Keys
1. Click the **🔑 Key icon** in the header
2. Choose your provider from the dropdown
3. Follow the link to get your free API key
4. Paste & save — keys are stored locally only

### Adding Your First Widget
1. Click **"Add Widget"**
2. Give it a memorable name
3. Paste your API endpoint → Click **"Test"**
4. Pick your display format (Card / Table / Chart)
5. Select which fields to show
6. Set your refresh interval
7. Done! Widget appears on your grid

---

## 🎨 Theming

| Mode | Palette | When to Use |
|------|---------|-------------|
| ☀️ **Light** (Default) | White + slate accents | Daytime, bright environments |
| 🌙 **Dark** | Navy/slate tones | Night mode, reduced eye strain |

Toggle anytime via the sun/moon button. Your preference auto-saves.

---

## 💾 Backup & Restore

### Exporting Your Dashboard
Click the **download icon** → Saves a `.json` file containing:
- All widget configurations
- Layout positions
- Theme preference

### Importing a Dashboard
Click the **upload icon** → Select your `.json` backup → Dashboard restored instantly.

---

## 📱 Responsive Breakpoints

| Device | Grid Columns | Experience |
|--------|--------------|------------|
| 🖥️ Desktop | 12 columns | Full dashboard view |
| 📱 Tablet | 6 columns | Condensed layout |
| 📱 Mobile | 2 columns | Stack-friendly view |

---

## ⚡ Performance Notes

- **Conditional Rendering** — Modals only mount when opened
- **Memoization** — Expensive calculations cached with `useMemo`
- **Selective Re-renders** — Zustand selectors prevent unnecessary updates
- **Request Deduplication** — Caching layer avoids redundant fetches
- **Automatic Code Splitting** — Next.js handles route-based chunking

---

## ⌨️ Keyboard Shortcuts

| Keys | Action |
|------|--------|
| `Ctrl + N` | Open "Add Widget" modal |
| `Ctrl + T` | Browse templates |
| `Ctrl + Shift + D` | Toggle light/dark theme |
| `Ctrl + R` | Refresh all widgets |

---

## 🤝 Contributing

Found a bug? Have an idea? PRs and issues are welcome!

---

## 📜 License

Released under the **MIT License** — use it however you'd like.

---

<div align="center">
  <br/>
  <strong>Crafted by Aditya Gupta</strong>
  <br/>
  <sub>Groww SDE Internship Assignment • 2026</sub>
</div>
