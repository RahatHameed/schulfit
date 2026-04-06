# Changelog

All notable changes to SchulFit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Multi-language support (Turkish, Arabic, Urdu)
- Offline PWA support
- Print-friendly worksheets
- Parent progress reports
- Audio recording for pronunciation comparison

---

## [2.0.0] - 2026-04-06

### Added - Docker Environment
- **Dockerfile** - Multi-stage build (dev with node:20-slim, prod with nginx:alpine)
- **docker-compose.yml** - Service orchestration for dev (port 5173) and prod (port 80)
- **Makefile** - Standard commands with colored output (`make dev`, `make prod`, `make test`, etc.)
- **nginx.conf** - Production SPA routing with gzip compression and caching
- **.dockerignore** - Optimized Docker build context

### Changed - DDD/SOLID Architecture Refactoring
Refactored monolithic App.jsx (726 lines) into modular architecture (50 files):

- **Components** (7 files): Owl, Confetti, ShapeSVG, DotGrid, CmpCard, CmpAnswers, TutOverlay
- **Screens** (11 files): Loading, Setup, Welcome, Menu, Quiz, Flash, Voice, Stats, Settings, About, Results
- **Hooks** (4 files): useStorageData, useQuizSession, useAudio, useSpeechRecognition
- **Services** (5 files): StorageService, AudioService, DataGenerationService, QuizLogicService, ProgressService
- **Constants** (3 files): modes, styles, celebrations
- **Data** (5 files): categories, colors, gradients, groups, tutorial
- **Utils** (4 files): germanUtils, dateUtils, arrayUtils, linkUtils

### Technical
- All 18 tests passing
- App.jsx reduced from 726 to 506 lines
- Production build: 579 kB (173 kB gzipped)
- Docker dev server with hot reload
- Docker prod server with nginx

---

## [1.0.1] - 2026-04-06

### Fixed
- Fixed missing React import causing blank screen on "Start Practicing" click
- `React.Fragment` now properly imported in App.jsx

---

## [1.0.0] - 2026-04-06

### Added

#### Learning Categories
- **Farben (Colors)** - 11 colors with emoji visuals
- **Formen (Shapes)** - 10 geometric shapes
- **Korper (Body Parts)** - 15 body parts for medical exam prep
- **Dinge (Objects)** - 22 common household objects
- **Tiere (Animals)** - 19 animals from pets to wild animals
- **Essen (Food)** - 15 food items
- **Familie (Family)** - 9 family member terms
- **Zeit (Time)** - Days of week, seasons, times of day
- **Positionen (Positions)** - 10 spatial terms
- **Berufe (Jobs)** - 5 common professions
- **Dinosaurier (Dinosaurs)** - 8 dinosaur names (kids love them!)
- **Zahlen (Numbers)** - Numbers 1-100 with German words
- **Vergleichen (Comparison)** - Bigger/smaller/equal exercises
- **Rechnen (Math)** - Addition and subtraction up to 10
- **Gerade/Ungerade (Even/Odd)** - Number classification
- **Einzahl/Mehrzahl (Singular/Plural)** - German grammar basics
- **Fragen beim Arzt (Doctor Questions)** - Common exam questions
- **Farben Malen (Color Fill)** - Interactive coloring game

#### Practice Modes
- **Flash Cards** - Flip cards to learn vocabulary
- **Quiz Mode** - Multiple choice with instant feedback
- **Voice Mode** - Speech recognition for pronunciation

#### Features
- German text-to-speech with male/female voice options
- Progress tracking with localStorage persistence
- Statistics dashboard with 7-day activity chart
- Category-wise progress with star ratings (80%+ = star)
- Tutorial overlay for first-time users
- Celebration animations and sound effects
- Responsive mobile-first design
- Parent guide with exam preparation checklist

#### Technical
- React 18.3 with Vite 5.4
- Recharts for statistics visualization
- Web Speech API for TTS and speech recognition
- Zero external CSS frameworks (inline styles)
- No backend required (fully client-side)

### Developer Experience
- Single-file architecture for easy maintenance
- ESLint configuration included
- Production build optimization

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 2.0.0 | 2026-04-06 | Docker environment + DDD/SOLID refactoring |
| 1.0.1 | 2026-04-06 | Bug fix for React.Fragment import |
| 1.0.0 | 2026-04-06 | Initial release with 18 categories |

---

## Links

- [Live App](https://schulfit.vercel.app)
- [GitHub Repository](https://github.com/RahatHameed/schulfit)
- [Report Issues](https://github.com/RahatHameed/schulfit/issues)

---

<p align="center">
  <sub>Made with ❤️ for immigrant families in Germany</sub>
</p>
