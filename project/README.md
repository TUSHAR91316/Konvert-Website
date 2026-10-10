# Konvert Website — Official Web Portal & Client Studio

> **Privacy-First File Conversion & Compression Engine**  
> Run 100% locally on your device or connect your private self-hosted Docker microservice.

[![GitHub license](https://img.shields.io/github/license/TUSHAR91316/Konvert?color=10b981)](https://github.com/TUSHAR91316/Konvert/blob/main/LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/TUSHAR91316/Konvert?color=06b6d4)](https://github.com/TUSHAR91316/Konvert/releases)
[![Build Status](https://img.shields.io/badge/Build-Passing-10b981)](https://github.com/TUSHAR91316/Konvert)

---

## 🚀 Key Features

- **In-Browser Client Studio (`/studio`)**: Compress PNG, JPG, and WEBP photos directly in browser RAM with HTML5 Canvas and compile multi-page standardized A4 PDFs.
- **Dynamic Roadmap & Releases (`/roadmap`)**: Live synchronization with GitHub Releases API, categorizing major versions (`1.x`) and incremental bugfix patches (`1.x.x`).
- **Self-Hosting Guide (`/self-hosting`)**: Step-by-step tutorial on deploying a private Docker conversion container with Ngrok and configuring client-side SHA-256 VirusTotal pre-flight inspection.
- **Feedback & Bug Hub (`/feedback`)**: In-app feedback storage, 5-star rating matrix, client diagnostics, and GitHub Issue prefill generation.
- **Progressive Web App (PWA)**: Offline-first service worker precaching and installable web application shell.
- **SEO & Google Rich Snippets**: Integrated JSON-LD structured schemas (`SoftwareApplication`, `WebSite`, `FAQPage`, `HowTo`, `WebApplication`).

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS (Obsidian Titanium & Alabaster Pearl themes with Aurora multi-stop gradients)
- **Icons**: Lucide React
- **Linter**: Oxlint
- **PWA**: Service Worker (`sw.js`) + Web App Manifest (`manifest.json`)
- **Hosting**: Vercel

---

## 💻 Local Development

```bash
# Navigate to project directory
cd project

# Install dependencies
npm install

# Start development server
npm run dev

# Run Oxlint validation
npm run lint

# Compile production build
npm run build
```

---

## 📄 License

This project is open-source and released under the MIT License.
