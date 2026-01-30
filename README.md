# Fajne Prompty Web

Komunitní web pro Fajne Prompty - setkání AI nadšenců v Moravskoslezském kraji.

## 🚀 Technologie
- **HTML5** (Sémantická struktura)
- **Tailwind CSS** (Styling a design system)
- **Vanilla JavaScript** (Logika a vykreslování)
- **Vite** (Build tool)
- **GitHub Pages** (Hosting)

## 📂 Struktura Projektu
```
fajne-prompty/
├── .github/workflows/  # CI/CD konfigurace
├── content/           # JSON data (texty, eventy, partneři)
├── public/            # Statické soubory (obrázky)
├── src/               # Zdrojový kód (JS, CSS)
├── index.html         # Hlavní šablona
└── vite.config.js     # Konfigurace buildu
```

## 🛠 Instalace a Spuštění

1. **Instalace závislostí**
   ```bash
   npm install
   ```

2. **Spuštění lokálního serveru**
   ```bash
   npm run dev
   ```

3. **Build pro produkci**
   ```bash
   npm run build
   ```

## 📝 Správa Obsahu
Veškerý textový obsah je v `content/*.json`.
- `texts.json`: Globální texty, navigace, footer.
- `events/`: Složky pro jednotlivé události.
- `organizers.json`: Seznam organizátorů.
- `partners.json`: Seznam partnerů.

## 🎨 Design
Využívá `Inter` font a vlastní barevnou paletu definovanou v `tailwind.config.js`.

## 🌐 Deployment
Web se automaticky deployuje na GitHub Pages po pushnutí do `main` větve.
URL: [https://katerina-svi.github.io/Fajne-prompty-web/](https://katerina-svi.github.io/Fajne-prompty-web/) (Příklad)
