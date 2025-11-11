# health-ecommerce-production-uiux

> **Production-Ready E-Commerce dengan Responsive Design, Accessibility & Automated Testing**

[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5.12-cyan)](https://ant.design/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-blue)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-1.41-green)](https://playwright.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

Complete production-ready e-commerce dengan responsive design, accessibility features, dark mode, error boundaries, dan automated E2E testing.

---

## Apa yang Ada di Repository Ini?

Module ini berisi **2 versi project** untuk belajar UI/UX best practices:

```
health-ecommerce-production-uiux/
├── README.md (Ini file yang kamu baca)
├── starter-project/     #  Untuk practice (dengan TODO)
│   ├── README.md
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx (with TODOs)
│   │   │   ├── ProductSkeleton.jsx (with TODOs)
│   │   │   └── ResponsiveNavbar.jsx (with TODOs)
│   │   ├── pages/
│   │   │   ├── CheckoutPage.jsx (with TODOs)
│   │   │   └── ... (dari Modul 2)
│   │   ├── context/
│   │   │   └── ThemeContext.jsx (with TODOs)
│   │   └── utils/
│   ├── tests/
│   │   └── e2e/ (Playwright tests)
│   └── ... config files
└── finished-project/    #  Production-ready complete!
    ├── README.md
    ├── package.json
    ├── src/
    │   ├── components/
    │   │   ├── ErrorBoundary.jsx (complete!)
    │   │   ├── ProductSkeleton.jsx (complete!)
    │   │   ├── AIChatbot.jsx (Google Gemini!)
    │   │   ├── Navbar.jsx (responsive + dark mode!)
    │   │   └── Footer.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx (multi-step + Midtrans!)
    │   │   ├── OrderSuccessPage.jsx
    │   │   └── LoginPage.jsx
    │   ├── context/
    │   │   ├── CartContext.jsx (with localStorage)
    │   │   └── ThemeContext.jsx (dark mode!)
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── aiService.js (Gemini integration)
    │   │   └── paymentService.js (Midtrans)
    │   └── App.jsx (7 routes!)
    ├── tests/e2e/
    │   └── checkout.flow.spec.js (Playwright E2E)
    └── ... config files
```

**Pilih mana?**

- **Starter** - Untuk **practice UI/UX patterns** (RECOMMENDED!)
- **Finished** - Untuk **reference** production implementation

---

## Quick Start (Untuk Newbie)

### Prerequisites

Sebelum mulai, pastikan:

- **Backend running** di `http://localhost:5000`
- Repository: `health-ecommerce-ai-integration` (Backend Modul 5)
- Folder: `finished-project/`
- Setup: See Backend Modul 5 README
- **Node.js v20+** installed
- **Sudah selesai** Frontend Modul 1 & 2

** Setup Backend (jika belum):**

```bash
# Navigate ke Backend Modul 5
cd ../../Backend/Modul_5-External_API_Integration/finished-project

# Install dependencies
npm install

# Setup .env dengan API keys:
# GEMINI_API_KEY=your_google_api_key
# MIDTRANS_SERVER_KEY=your_midtrans_key

# Seed database
npm run seed

# Start server (keep running!)
npm run dev
# → Backend ready di http://localhost:5000
```

---

### Option 1: Practice dengan Starter Project

```bash
# 1. Clone repository ini
git clone https://github.com/your-username/health-ecommerce-production-uiux.git

# 2. Masuk ke folder repository
cd health-ecommerce-production-uiux

# 3. Masuk ke starter-project
cd starter-project

# 4. Install dependencies
npm install
# Tunggu ~2-3 menit

# 5. Start development server
npm run dev

# Opens http://localhost:3000
```

**Note:** Port 3000 (consistent dengan Modul 2)

---

### Option 2: Lihat Complete Production Implementation

```bash
# 1. Clone repository (jika belum)
git clone https://github.com/your-username/health-ecommerce-production-uiux.git

# 2. Masuk ke folder repository
cd health-ecommerce-production-uiux

# 3. Masuk ke finished-project
cd finished-project

# 4. Install dependencies
npm install

# 5. Install Playwright browsers (untuk E2E tests)
npx playwright install chromium

# 6. Start development server
npm run dev

# Complete production app with AI chatbot & payment ready!
```

---

## Apa yang Akan Kamu Pelajari?

**Modul 3** melanjutkan dari Modul 2 (React Advanced) dengan **production polish**!

### Konsep yang Dipelajari:

- **Responsive Design** - Mobile-first dengan Tailwind breakpoints
- **Accessibility (a11y)** - WCAG compliant, semantic HTML, ARIA
- **Error Boundaries** - Graceful error handling di React
- **Skeleton Screens** - Professional loading UX
- **Dark Mode** - Theme switching dengan Context API
- **Performance** - React.memo, lazy loading
- **Playwright Testing** - Automated UI testing

### Apa yang Dibangun:

- **7 Complete Pages** - Home, Products, Detail, Cart, Checkout, Success, Login
- **AI Chatbot** - Google Gemini product recommendations
- **Payment Integration** - Midtrans checkout flow
- **Dark Mode** - Theme toggle with persistence
- **Error Handling** - Error boundaries + fallback UI
- **E2E Tests** - 10+ Playwright automation tests

**Output:** Production-ready e-commerce siap deploy!

---

## Struktur Starter Project

```
starter-project/
├── README.md              # Setup guide
├── package.json           # Dependencies
├── vite.config.js         #  Vite config (ready!)
├── tailwind.config.js     #  Tailwind + dark mode (ready!)
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx    #  TODO: Catch errors
│   │   ├── ProductSkeleton.jsx  #  TODO: Loading skeleton
│   │   └── ... (dari Modul 2)
│   ├── pages/
│   │   ├── CheckoutPage.jsx     #  TODO: Multi-step form
│   │   └── ... (dari Modul 2)
│   ├── context/
│   │   ├── ThemeContext.jsx     #  TODO: Dark mode
│   │   └── CartContext.jsx      #  From Modul 2
│   ├── utils/
│   │   └── accessibility.js     #  TODO: A11y helpers
│   ├── App.jsx                  #  TODO: Add ErrorBoundary wrapper
│   ├── main.jsx                 #  TODO: Add ThemeProvider
│   └── index.css                #  TODO: Dark mode CSS variables
├── tests/e2e/
│   └── shopping.spec.js         #  TODO: Playwright tests
└── playwright.config.js          #  Config ready!
```

**TODOs:**

- [ ] Implement ErrorBoundary component
- [ ] Create ProductSkeleton loading component
- [ ] Build ThemeContext untuk dark mode
- [ ] Make CheckoutPage dengan multi-step form
- [ ] Add Playwright E2E tests
- [ ] Ensure responsive breakpoints working

---

## Struktur Finished Project

```
finished-project/
├── README.md              # Complete guide
├── package.json           # All dependencies
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx    #  Complete error catcher!
│   │   ├── ProductSkeleton.jsx  #  Professional loading!
│   │   ├── AIChatbot.jsx        #  Google Gemini chatbot!
│   │   ├── Navbar.jsx           #  Responsive + dark toggle!
│   │   ├── Footer.jsx           #  Footer dengan info
│   │   └── ProductCard.jsx      #  Accessible card
│   ├── pages/
│   │   ├── HomePage.jsx          #  Hero + features
│   │   ├── ProductsPage.jsx      #  Catalog + filters
│   │   ├── ProductDetailPage.jsx #  Detail + AI suggest
│   │   ├── CartPage.jsx          #  Cart table
│   │   ├── CheckoutPage.jsx      #  Multi-step + Midtrans!
│   │   ├── OrderSuccessPage.jsx  #  Confirmation
│   │   └── LoginPage.jsx         #  Auth form
│   ├── context/
│   │   ├── CartContext.jsx       #  Cart + localStorage
│   │   └── ThemeContext.jsx      #  Dark mode system!
│   ├── services/
│   │   ├── api.js                #  Axios config
│   │   ├── aiService.js          #  Gemini integration!
│   │   └── paymentService.js     #  Midtrans integration!
│   ├── App.jsx                   #  7 routes + ErrorBoundary
│   ├── main.jsx                  #  All providers nested
│   └── index.css                 #  Dark mode CSS variables
├── tests/e2e/
│   └── checkout.flow.spec.js     #  10+ E2E tests!
└── playwright.config.js          #  Full config
```

**All features working:**

- Fully responsive (mobile, tablet, desktop)
- Accessible (WCAG compliant)
- Dark mode toggle
- Error boundaries
- Skeleton loading
- AI chatbot (Google Gemini)
- Payment (Midtrans)
- Playwright E2E tests

---

## Features dalam Finished Project

### **1. Responsive Design**

**Tailwind breakpoints:**

```jsx
<div className="
  grid-cols-1       // Mobile (375px)
  md:grid-cols-2    // Tablet (768px)
  lg:grid-cols-3    // Desktop (1024px)
  xl:grid-cols-4    // Large (1280px+)
">
```

**Test responsive:**

- Resize browser 375px → 1920px
- All layouts adapt smoothly
- No horizontal scroll
- Touch-friendly buttons mobile

---

### **2. Dark Mode** 🌙

**Features:**

- Toggle button di navbar
- Persists di localStorage
- Smooth transition
- All colors adapt

**CSS Variables:**

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
}

[data-theme="dark"] {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
}
```

---

### **3. AI Chatbot**

**Integration:**

```
User → AIChatbot.jsx
     → POST /api/external/ai/chat
     → Google Gemini AI
     → Product recommendations
     → Display in modal
```

**Try it:**

- Click AI button (bottom-right)
- Type: "Vitamin untuk daya tahan tubuh"
- Get AI recommendations!

---

### **4. Payment Integration**

**Midtrans Checkout:**

```
Cart → CheckoutPage
     → Fill shipping info
     → Click "Bayar Sekarang"
     → POST /api/external/payment/create
     → Midtrans Snap page opens
     → Complete payment
     → Return to success page
```

**Test cards (Sandbox):**

```
Card: 4811 1111 1111 1114
CVV: 123
Exp: 01/25
```

---

### **5. Error Boundaries**

**Graceful Error Handling:**

```jsx
<ErrorBoundary>
  <ProductsPage />
</ErrorBoundary>

// If error occurs:
// → Fallback UI shows
// → App doesn't crash!
// → User can reload
```

---

### **6. Playwright E2E Tests**

**Automated Testing:**

```bash
npm run test:e2e        # Run tests
npm run test:e2e:ui     # Visual mode

# Tests:
✓ Homepage loads correctly
✓ Product browsing works
✓ Add to cart flow
✓ Complete checkout
✓ Responsive behavior
```

---

## Testing Your Implementation

### Manual Testing Checklist

**Responsive:**

```
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test sizes:
   - Mobile (375px) → 1-column grid
   - Tablet (768px) → 2-column grid
   - Desktop (1920px) → 4-column grid
4. Verify hamburger menu (mobile)
```

**Accessibility:**

```
1. Close mouse, use keyboard
2. Tab through elements
3. Enter activates buttons
4. Esc closes modals
5. All interactive elements focusable!
```

**Dark Mode:**

```
1. Click moon icon → Dark theme
2. Reload page → Theme persists
3. Click sun icon → Light theme
4. All colors adapt smoothly
```

**AI Chatbot:**

```
1. Click AI button
2. Type: "Rekomendasi supplement"
3. Send message
4. Wait 2-3 seconds
5. AI responds dengan recommendations
```

**Payment:**

```
1. Add products to cart
2. Checkout
3. Fill form
4. Click "Bayar"
5. Midtrans page opens
6. Use test card
7. Success page!
```

---

### Automated Testing (Playwright)

```bash
# Install Playwright browsers
npx playwright install chromium

# Run E2E tests
npm run test:e2e

# Expected output:
# ✓ Homepage loads correctly (1.2s)
# ✓ Browse and filter products (3.5s)
# ✓ Complete checkout flow (8.7s)
# ✓ Responsive navigation (1.8s)
# ✓ AI chatbot modal (2.4s)
#
# 5 passed (17.6s)
```

---

## Hubungan dengan Modul Lain

**Dari Modul 1 (React Fundamentals):**

- Component basics
- Props & state
- Backend integration

**Dari Modul 2 (React Advanced):**

- React Router (7 pages!)
- React Query (smart caching)
- Ant Design components
- Context API (cart)

**Modul 3 (This!)** → Production Polish

- Responsive design mastery
- Accessibility features
- Error boundaries
- Skeleton loading screens
- Dark mode support
- Performance optimization
- AI chatbot integration
- Payment integration (Midtrans)
- Playwright E2E tests

**Ke Common Modul 1 (Testing):**

- → Automated tests expand
- → Coverage tracking
- → Integration testing

**Complete e-commerce, production-ready!**

---

## Troubleshooting

### "AI Chatbot tidak respond"

**Solusi:**

```bash
# 1. Check backend running
curl http://localhost:5000/health

# 2. Check GEMINI_API_KEY di backend .env
cat ../../Backend/Modul_5.../finished-project/.env | grep GEMINI

# 3. Test endpoint langsung
curl -X POST http://localhost:5000/api/external/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","context":"health_product_recommendation"}'

# 4. Check console logs untuk error
```

---

### "Payment redirect tidak muncul"

**Solusi:**

```bash
# 1. Verify Midtrans keys configured (backend .env)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx

# 2. Test payment endpoint
curl -X POST http://localhost:5000/api/external/payment/create \
  -H "Content-Type: application/json" \
  -d '{"orderId":"TEST","amount":100000,"items":[],"customerDetails":{}}'

# Should return paymentUrl
```

---

### "Dark mode tidak persist"

**Solusi:**

```jsx
// Check ThemeContext.jsx
useEffect(() => {
  localStorage.setItem("theme", theme); // Should save
}, [theme]);

// Check localStorage di browser DevTools
// Application tab → Local Storage
```

---

### "Playwright tests fail"

**Solusi:**

```bash
# 1. Ensure backend & frontend running
curl http://localhost:5000/health  # Backend
curl http://localhost:3000          # Frontend

# 2. Increase timeout
# playwright.config.js
use: {
  actionTimeout: 15000,  // From 10000
}

# 3. Run with UI mode untuk debug
npm run test:e2e:ui
```

---

### "Responsive breakpoints tidak work"

**Solusi:**

```js
// tailwind.config.js - verify content paths
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",  // Must include all files!
],
```

---

## Tips Sukses

1. **Mobile-First** - Design mobile dulu, scale up
2. **Test Accessibility** - Use keyboard & screen reader
3. **Use Lighthouse** - Aim for 90+ scores
4. **Check DevTools** - Accessibility tab helpful
5. **Compare when stuck** - Check finished-project
6. **Test Real Devices** - Mobile phone jika ada
7. **Learn from Errors** - Error boundaries teach patterns

---

## Resources

**Documentation:**

- [TailwindCSS Responsive](https://tailwindcss.com/docs/responsive-design)
- [React Accessibility](https://react.dev/learn/accessibility)
- [Playwright Testing](https://playwright.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Ant Design Dark Mode](https://ant.design/docs/react/customize-theme)

**Tools:**

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit performance & a11y
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing
- [Playwright Codegen](https://playwright.dev/docs/codegen) - Generate tests

---

## Next Steps

After completing this module:

1.  **Test di multiple devices** - Mobile, tablet, desktop
2.  **Run Lighthouse audit** - Target 90+ all metrics
3.  **Test accessibility** - Keyboard nav, screen reader
4.  **Try AI chatbot** - Get product recommendations
5.  **Test payment** - Complete Midtrans flow
6.  **Common Modul 1** - Testing Suite (expand tests)
7.  **Common Modul 2** - GitHub Workflow (automate deployment)

---

**Build production-quality UI! **

_Modul 3 - UI/UX Best Practices & Automation Testing_  
_Part of Health E-Commerce Frontend Series_

---

** Repository Info:**

- **Name:** `health-ecommerce-production-uiux`
- **Type:** Production-Ready Frontend
- **Backend:** Requires `localhost:5000` (ULTIMATE Backend)
- **Structure:** 1 Repo, 2 Folders (starter + finished)
