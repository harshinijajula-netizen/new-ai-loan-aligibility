---
Task ID: 1
Agent: Main Agent
Task: Fix Login/Register, Chatbot, and Language Selector - Make all features functional

Work Log:
- Explored full codebase, identified 4 broken features:
  1. Login/Register buttons: `toast.info("Coming soon!")` on lines 290-293, 318-319
  2. Chatbot: Error handling didn't display API errors (only checked data.reply, not res.ok)
  3. Language Selector: `setLang(l)` set state but `lang` was never used to translate any text
  4. No auth system existed (no User model, no JWT, no login/register)
- Installed bcryptjs and jsonwebtoken packages
- Added User model to Prisma schema (name, email, password, timestamps) and ran db:push
- Created auth API routes: /api/auth/register, /api/auth/login, /api/auth/me
- Created Zustand auth store (src/stores/auth-store.ts) with login, register, logout, checkAuth
- Created LocaleProvider context (src/contexts/locale-context.tsx) with localStorage persistence
- Expanded i18n.ts from 6 keys to 150+ translation keys covering all visible UI text in EN/HI/TE
- Rewrote page.tsx: replaced "Coming soon" buttons with Dialog-based Login/Register forms
- Added authentication state: shows "Welcome, {name}" + Logout when logged in
- Added welcome banner in hero section for authenticated users (dashboard feel)
- Wired language selector to LocaleContext - all nav, hero, benefits, loan types, tools, how-it-works, testimonials, rules, footer, auth dialogs now translate
- Updated chatbot.tsx to use LocaleContext and properly display API errors with warning icon
- Fixed all import paths (added @/ prefix)
- Fixed ESLint error (setState in effect)

Stage Summary:
- All 4 features are now functional
- Auth: Register → Login → Dashboard (hero greeting) → Logout flow works
- i18n: 150+ translation keys, language persists via localStorage
- Chatbot: Error display fixed, uses z-ai-web-dev-sdk for real AI responses
- Lint passes clean
