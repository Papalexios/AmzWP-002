# AmzWP-Automator

## Overview
AmzPilot is an Autonomous WordPress Monetization Engine that helps automate affiliate marketing tasks. It scans content, identifies opportunities, and deploys high-conversion assets.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (CDN)
- **API**: Google Generative AI (@google/genai)

## Project Structure
```
/
├── App.tsx           # Main application component
├── index.tsx         # React entry point
├── index.html        # HTML template with global CSS enhancements
├── types.ts          # TypeScript type definitions
├── utils.ts          # Utility functions & encryption
├── constants.ts      # Application constants
├── components/       # React components
│   ├── BatchProcessor.tsx  # Enterprise batch processing engine
│   ├── DropZone.tsx        # Drag-and-drop visual indicators
│   ├── PostEditor.tsx      # Visual editor with undo/redo
│   ├── SitemapScanner.tsx  # Sitemap discovery with batch processing
│   └── ...
├── hooks/            # Custom React hooks
│   ├── useHistory.ts       # Undo/redo state management
│   ├── useKeyboardShortcuts.ts  # Keyboard shortcut handling
│   ├── useDragAndDrop.ts   # Drag-and-drop functionality
│   ├── useReducedMotion.ts # Accessibility motion detection
│   └── index.ts            # Hook exports
├── utils/            # Additional utilities
│   └── aiCopywriter.ts     # AI-powered copy enhancement
├── vite.config.ts    # Vite configuration
└── tsconfig.json     # TypeScript configuration
```

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build` (outputs to `dist/`)

## Deployment
Configured for static deployment via Vite build.

## Environment Variables
- `API_KEY`: Google Generative AI API key (optional fallback)

## AI Provider Support
The app supports multiple AI providers with secure API key storage:
- **Google Gemini**: Default provider, models include gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro
- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic Claude**: Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus
- **Groq**: Supports custom model input (e.g., llama-3.3-70b-versatile, mixtral-8x7b-32768)
- **OpenRouter**: Supports custom model input (e.g., anthropic/claude-3.5-sonnet, google/gemini-pro)

All API keys are encrypted before storage using SecureStorage.

## Features

### Core Features
- **Deep Intelligence Scan**: AI-powered content analysis to automatically detect monetization opportunities
- **Complete Sitemap Discovery**: Fetches ALL URLs from sitemaps (no limits), including sitemap indexes with multiple sub-sitemaps
- **Manual Product Add**: Add any Amazon product by entering ASIN or full Amazon URL
- **Smart Auto-Deploy**: Automatically place products in optimal positions based on content relevance
- **Visual Editor**: Drag-and-drop content blocks with product placement
- **Multi-Provider AI**: Support for Google Gemini, OpenAI, Anthropic, Groq, and OpenRouter
- **Dual Product Box Styles**: Toggle between Classic and Premium (Luxe Aurora) designs

### Enterprise Features (v80.1)
- **Undo/Redo System**: Full history management with Ctrl+Z/Ctrl+Shift+Z keyboard shortcuts
- **Batch Processing Engine**: Process multiple posts simultaneously with configurable concurrency (1-10 workers)
- **Keyboard Shortcuts**: Global keyboard shortcuts for productivity (Ctrl+Z, Ctrl+Shift+Z, Escape)
- **Accessibility**: Reduced motion detection respecting user preferences
- **AI Copy Enhancement**: AI-powered copy optimization for maximum conversions
- **Drag-and-Drop Editor**: Visual drop zones with position indicators

## Ultra-Premium Product Box (SOTA 2026)
Next-generation product boxes with 100% product-specific content:
- **Product-Specific FAQs**: Dynamic FAQs generated from actual product data (brand, rating, reviews, price)
- **Pros/Cons Section**: Auto-generated based on rating, Prime status, and pricing tier
- **Best-For Tags**: Targeted audience suggestions (enthusiasts, brand loyalists, quality buyers)
- **Expandable Specs**: Collapsible specification panel with product details
- **Interactive Elements**: Hover effects, 3D tilt, expandable FAQ accordion
- **Trust Signals**: A-to-Z Guarantee, Prime shipping, Easy returns, Secure checkout
- **Glass Morphism**: Frosted glass with backdrop blur and animated gradients
- **Floating Stats Orbs**: Rating and review count displayed in floating elements

## SOTA Comparison Table
When multiple products are detected, automatically generates comparison tables:
- **Automatic Winner Detection**: Best product identified by rating
- **Crown Badge**: Winner gets golden "BEST CHOICE" badge
- **Per-Spec Winner Indicators**: Green "Best" labels for leading specs
- **Visual Comparison**: Rating, reviews, price, Prime status, brand
- **Expert Recommendation**: AI-generated verdict with winner justification
- **Responsive Design**: Works on all device sizes

## Smart API Optimization
SerpAPI usage is optimized to minimize costs:
- **Session Caching**: Products cached in memory and sessionStorage
- **24-Hour TTL**: Cached products valid for 24 hours
- **Cache Hit Logging**: Console logs show cache hits vs API calls
- **Fallback Images**: Amazon image widgets used when API unavailable

## Enterprise-Grade Reliability
- Paginated WordPress API fetching (no 100-post limit)
- Full sitemap index traversal (fetches ALL sub-sitemaps)
- Batched concurrent requests with rate limiting
- Duplicate URL detection and deduplication
- Automatic retry with fallback strategies
- Web Crypto API encryption (PBKDF2 + AES-GCM, 100k iterations)
- Request deduplication layer for API optimization
- Progressive proxy strategy with latency tracking
- Auto-save system (30s intervals, 24h recovery window)
- Component error boundaries for graceful degradation

## Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl+Z / Cmd+Z | Undo last action |
| Ctrl+Shift+Z / Cmd+Shift+Z | Redo action |
| Ctrl+Y | Redo action (alternative) |
| Escape | Go back / Close modal |

## Batch Processing
The batch processor allows processing multiple posts at once:
- **Configurable Concurrency**: 1-10 parallel workers
- **Real-time Progress**: Per-job progress tracking
- **Auto-Publish Option**: Automatically push to WordPress
- **Abort Capability**: Stop processing at any time
- **Statistics Dashboard**: Completed, failed, products found

## Ultra-Precise Product Detection
The Deep Intelligence Scan uses a 6-strategy extraction pipeline:
1. **Amazon URLs (100% confidence)**: Extracts ASINs from all Amazon link formats
2. **Amazon Anchor Text (95%)**: Product names from Amazon link text
3. **Schema.org Data (92%)**: JSON-LD structured product data
4. **Review Box Widgets (88%)**: Product names from affiliate box markup
5. **Brand+Model Patterns (85%)**: Strict brand matching with model indicators
6. **Listicle Headings (65% fallback)**: Only when <3 products found

AI validation ensures products are actually mentioned in content:
- Exact match verification
- Word overlap analysis (50-70% threshold)
- Brand mention validation
- Quote verification from AI response
