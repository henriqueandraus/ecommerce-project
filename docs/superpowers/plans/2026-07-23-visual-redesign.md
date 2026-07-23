# Visual Redesign (White/#303030 Palette + Navbar) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `ecommerce-client`'s warm-beige/orange "blacktop" theme with a flat white (`#ffffff`) background and `#303030` ink color, remove the accent color and automatic dark mode, and restructure the navbar to `Home / Shop / Orders` (left) + user/cart icons (right).

**Architecture:** Pure CSS-variable and component-level change — no backend involvement, no routing changes, no new pages. `CartContext` gains a `user` field (it already fetches the current user internally) so `Navbar` can read auth state without a duplicate API call. All color changes flow through the existing CSS custom properties in `src/index.css`; `Home.css` and `Navbar.css` are edited to stop referencing the removed accent variables and to drop the dashed/tilted decorative motifs.

**Tech Stack:** React 19, Vite, plain CSS (custom properties, no CSS-in-JS), `lucide-react` (new dependency) for icons.

## Global Constraints

- `--bg`: `#ffffff`, `--ink`: `#303030` (exact values from spec) — every other palette variable derives from these.
- `--accent` / `--accent-2` / `--accent-ink` are removed entirely — no rule may reference them after this plan.
- The `@media (prefers-color-scheme: dark)` override block is deleted — the site is always light-themed.
- No cart item-count badge (explicitly out of scope).
- No font changes — `--display` / `--sans` / `--mono` stay as they are.
- Only new dependency: `lucide-react`.
- This repo (`ecommerce-client`) has no test framework configured — verification steps use `npm run build`, `npm run lint`, and targeted `grep` checks instead of unit tests.
- `ecommerce-client` is not yet a git repository — Task 1 initializes it before any other change.

---

### Task 1: Initialize git repository for `ecommerce-client`

**Files:**
- None created/modified — this task only sets up version control.

**Interfaces:**
- Produces: a git repository at `ecommerce-client/` with all current files committed, so every later task can commit its own changes.

- [ ] **Step 1: Initialize the repo**

Run (from `ecommerce-client/`):
```bash
git init
```
Expected: `Initialized empty Git repository in .../ecommerce-client/.git/`

- [ ] **Step 2: Stage everything respecting `.gitignore`**

```bash
git add -A
git status
```
Expected: `node_modules`, `dist`, and `.env` are **not** listed as staged (already covered by the existing `.gitignore`).

- [ ] **Step 3: Commit the baseline**

```bash
git commit -m "chore: initial commit of ecommerce-client before visual redesign"
```
Expected: commit succeeds, `git log --oneline -1` shows the new commit.

---

### Task 2: Global color palette reset (`src/index.css`)

**Files:**
- Modify: `src/index.css` (full file, 137 lines)

**Interfaces:**
- Produces: CSS custom properties `--bg`, `--bg-panel`, `--bg-raised`, `--ink`, `--ink-muted`, `--line`, `--shadow` with new flat values. `--accent`, `--accent-2`, `--accent-ink` no longer exist — later tasks (3 onward... actually Tasks 5 and 6) must not reference them.

- [ ] **Step 1: Replace the file contents**

Write `src/index.css`:

```css
:root {
  /* flat white / ink palette */
  --bg: #ffffff;
  --bg-panel: #f2f2f2;
  --bg-raised: #f7f7f7;
  --ink: #303030;
  --ink-muted: #6b6b6b;
  --line: #e2e2e2;
  --shadow: rgba(48, 48, 48, 0.18);

  --display: "Anton", "Arial Narrow", sans-serif;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;

  font: 17px/1.6 var(--sans);
  color-scheme: light;
  color: var(--ink);
  background: var(--bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100svh;
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}

h1,
h2,
h3 {
  font-family: var(--display);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  color: var(--ink);
  margin: 0;
}

p {
  margin: 0;
  color: var(--ink-muted);
}

a {
  color: inherit;
}

button {
  font-family: var(--sans);
}

:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
}

.eyebrow {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 14px 24px;
  border: 1px solid var(--ink);
  border-radius: 2px;
  background: var(--ink);
  color: var(--bg);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 3px 3px 0 var(--ink);
}

.btn:active {
  transform: translate(0, 0);
  box-shadow: none;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Note what changed vs. the original: the whole `@media (prefers-color-scheme: dark)` block is gone, `color-scheme` is now `light` (was `light dark`), `:focus-visible` outline uses `var(--ink)` (was `var(--accent)`), and `.btn` background/text are `var(--ink)`/`var(--bg)` (was `var(--accent)`/`var(--accent-ink)`) since the accent color no longer exists.

- [ ] **Step 2: Verify no accent references remain in this file**

```bash
grep -n "accent" src/index.css
```
Expected: no output (empty — zero matches).

- [ ] **Step 3: Verify the build still compiles**

```bash
npm run build
```
Expected: build succeeds (exit code 0). It's fine that `Home.css` and `Navbar.css` still reference `--accent` at this point in the plan — CSS custom property references to an undefined variable don't fail the build, they just resolve to nothing at runtime. Task 5 and 6 remove those references.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style: reset palette to white background and #303030 ink, remove dark mode"
```

---

### Task 3: `CartContext` exposes the current user

**Files:**
- Modify: `src/context/CartContext.jsx` (full file, 33 lines)

**Interfaces:**
- Consumes: `getCurrentUser()` from `src/services/authService.js` — already imported, returns the `/me` JSON body (an object with at least `id`) or `null` if unauthenticated.
- Produces: `useCart()` now returns `{ cartId, user, refreshCart }` (previously `{ cartId, refreshCart }`). `user` is `null` when logged out, otherwise the object from `getCurrentUser()`. Task 4 (`Navbar.jsx`) depends on this `user` field.

- [ ] **Step 1: Replace the file contents**

Write `src/context/CartContext.jsx`:

```jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/authService";
import { getOrCreateCart } from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(null);
  const [user, setUser] = useState(null);

  const refreshCart = useCallback(async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const cart = await getOrCreateCart(currentUser.id);
      setCartId(cart.id);
    } else {
      setCartId(null);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartId, user, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
```

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```
Expected: no errors reported for `src/context/CartContext.jsx`.

- [ ] **Step 3: Manual check**

Run `npm run dev`, open the app in a browser, open the React DevTools (or add a temporary `console.log`) and confirm `useCart()` returns a `user` key. Log in and confirm `user` becomes a non-null object with an `id`; log out and confirm it becomes `null` again. Remove any temporary `console.log` before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/context/CartContext.jsx
git commit -m "feat: expose current user from CartContext"
```

---

### Task 4: Restructure the Navbar component

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm install`)
- Modify: `src/components/Navbar.jsx` (full file, 37 lines)

**Interfaces:**
- Consumes: `useCart()` from Task 3, now returning `{ cartId, user, refreshCart }`. Consumes `logoutUser` from `src/services/authService.js` (unchanged, already used).
- Produces: the `<nav className="nav">` DOM structure that Task 5's CSS targets: `.nav-links`, `.nav-icons`, `.nav-user`, `.nav-icon-btn`, `.nav-menu`, `.nav-menu-item`.

- [ ] **Step 1: Install `lucide-react`**

Run (from `ecommerce-client/`):
```bash
npm install lucide-react
```
Expected: command succeeds; `package.json`'s `dependencies` now includes `"lucide-react"`.

- [ ] **Step 2: Verify the dependency was added**

```bash
grep -n "lucide-react" package.json
```
Expected: one match under `"dependencies"`.

- [ ] **Step 3: Replace `Navbar.jsx` contents**

Write `src/components/Navbar.jsx`:

```jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingCart } from "lucide-react";
import { logoutUser } from "../services/authService";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, refreshCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      await refreshCart();
      setMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Shop</Link>
        <Link to="/orders">Orders</Link>
      </div>
      <div className="nav-icons">
        {user ? (
          <div className="nav-user" ref={menuRef}>
            <button
              type="button"
              className="nav-icon-btn"
              aria-label="Account menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <User size={20} strokeWidth={2} />
            </button>
            {menuOpen && (
              <div className="nav-menu">
                <button type="button" className="nav-menu-item" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-icon-btn" aria-label="Log in">
            <User size={20} strokeWidth={2} />
          </Link>
        )}
        <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
          <ShoppingCart size={20} strokeWidth={2} />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
```

- [ ] **Step 4: Verify lint passes**

```bash
npm run lint
```
Expected: no errors. (Note: this component now uses `useState`/`useRef`/`useEffect` — all imported at the top; the react-hooks lint plugin will flag any missing dependency.)

- [ ] **Step 5: Verify the build still compiles**

```bash
npm run build
```
Expected: build succeeds. Note `Navbar.css` (Task 5) hasn't been updated yet, so the navbar will look visually broken (old CSS classes like `.nav-brand`/`.nav-logout` no longer exist in the markup) until Task 5 is done — that's expected at this checkpoint.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/components/Navbar.jsx
git commit -m "feat: restructure Navbar to Home/Shop/Orders + user/cart icons"
```

---

### Task 5: Restyle the Navbar (editorial-mono, flat palette)

**Files:**
- Modify: `src/components/Navbar.css` (full file, 66 lines)

**Interfaces:**
- Consumes: the DOM structure produced by Task 4 (`.nav-links`, `.nav-icons`, `.nav-user`, `.nav-icon-btn`, `.nav-menu`, `.nav-menu-item`), and the CSS variables from Task 2 (`--ink`, `--ink-muted`, `--bg`, `--bg-panel`, `--line`, `--shadow`, `--mono`).

- [ ] **Step 1: Replace `Navbar.css` contents**

Write `src/components/Navbar.css`:

```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 20px clamp(20px, 5vw, 56px);
  border-bottom: 2px solid var(--ink);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 3vw, 28px);
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-links a {
  text-decoration: none;
  color: var(--ink);
  transition: color 0.15s ease;
}

.nav-links a:hover {
  color: var(--ink-muted);
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  color: var(--ink);
  cursor: pointer;
  line-height: 0;
  transition: color 0.15s ease;
}

.nav-icon-btn:hover {
  color: var(--ink-muted);
}

.nav-user {
  position: relative;
  display: flex;
}

.nav-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 140px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 2px;
  box-shadow: 0 4px 10px var(--shadow);
  z-index: 10;
}

.nav-menu-item {
  display: block;
  width: 100%;
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: none;
  border: none;
  text-align: left;
  color: var(--ink);
  padding: 10px 14px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.nav-menu-item:hover {
  background: var(--bg-panel);
}

@media (max-width: 640px) {
  .nav {
    flex-wrap: wrap;
    row-gap: 12px;
  }
}
```

- [ ] **Step 2: Verify no leftover selectors for removed markup**

```bash
grep -n "nav-brand\|nav-logout" src/components/Navbar.css
```
Expected: no output (empty).

- [ ] **Step 3: Manual visual + interaction check**

Run `npm run dev`, open the app:
- Confirm the navbar shows a solid black bottom border, `Home / Shop / Orders` on the left, and two icons (no text labels) on the right.
- Logged out: clicking the user icon navigates to `/login`.
- Log in, then click the user icon: a dropdown opens showing "Log Out". Clicking it logs out and redirects to `/login`.
- Clicking the cart icon navigates to `/cart` in both auth states.
- Clicking outside an open dropdown closes it.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.css
git commit -m "style: restyle Navbar with flat palette and solid border"
```

---

### Task 6: Home page decorative cleanup

**Files:**
- Modify: `src/pages/Home.css` (full file, 364 lines)
- Modify: `src/pages/Home.jsx:53` (remove the now-inert `lane-divider` element)

**Interfaces:**
- Consumes: CSS variables from Task 2 (`--ink`, `--ink-muted`, `--bg`, `--bg-panel`, `--bg-raised`, `--line`, `--shadow`).
- No new interfaces produced — this is the last task in the plan.

- [ ] **Step 1: Remove the `lane-divider` element from `Home.jsx`**

In `src/pages/Home.jsx`, delete this line (currently line 53, between the `</section>` closing the hero and the `<section className="featured">` opening tag):

```jsx
      <div className="lane-divider" role="presentation" />
```

- [ ] **Step 2: Replace `Home.css` contents**

Write `src/pages/Home.css`:

```css
.home {
  display: flex;
  flex-direction: column;
}

/* ---------- hero ---------- */

.hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  align-items: center;
  padding: clamp(48px, 8vw, 96px) clamp(20px, 5vw, 56px);
}

.hero-copy-col {
  opacity: 0;
  transform: translateY(14px);
  animation: rise-in 0.6s ease forwards;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.hero-eyebrow::before {
  content: "";
  width: 8px;
  height: 8px;
  background: var(--ink);
  border-radius: 50%;
}

.hero-title {
  font-size: clamp(52px, 8vw, 104px);
  line-height: 0.92;
  letter-spacing: -0.01em;
  max-width: 14ch;
}

.hero-lede {
  margin-top: 24px;
  max-width: 42ch;
  font-size: 18px;
  line-height: 1.65;
}

.hero-actions {
  margin-top: 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-actions .btn-ghost {
  font-family: var(--mono);
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--ink-muted);
  border-bottom: 1px solid var(--line);
  padding-bottom: 2px;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.hero-actions .btn-ghost:hover {
  color: var(--ink);
  border-color: var(--ink);
}

.hero-stamp-col {
  display: flex;
  justify-content: center;
  opacity: 0;
  animation: stamp-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s forwards;
}

.hero-stamp {
  width: clamp(160px, 20vw, 220px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  text-align: center;
}

.hero-stamp span {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.5;
  color: var(--ink);
}

@keyframes rise-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes stamp-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .hero-stamp-col {
    order: -1;
  }
  .hero-stamp {
    width: 140px;
  }
}

/* ---------- featured ---------- */

.featured {
  padding: clamp(48px, 7vw, 80px) clamp(20px, 5vw, 56px);
  border-bottom: 1px solid var(--line);
}

.featured-head {
  margin-bottom: 40px;
}

.featured-head h2 {
  margin-top: 10px;
  font-size: clamp(26px, 3.4vw, 38px);
}

.ticket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 32px 24px;
}

.ticket {
  position: relative;
  padding: 0;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  opacity: 0;
  animation: stamp-flat-in 0.5s ease forwards;
  animation-delay: var(--delay, 0s);
}

.ticket:hover,
.ticket:focus-visible {
  transform: translateY(-6px);
  box-shadow: 6px 6px 0 var(--shadow);
}

.ticket-no {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--ink-muted);
  margin-bottom: 10px;
  display: block;
}

.ticket-media {
  aspect-ratio: 4 / 3;
  background: var(--bg-panel);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ticket-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ticket-media-fallback {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

.ticket h3 {
  font-size: 18px;
  margin-bottom: 6px;
}

.ticket-desc {
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.6em;
}

.ticket-foot {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.ticket-price {
  font-family: var(--mono);
  font-weight: 600;
  font-size: 16px;
  color: var(--ink);
}

.ticket-tag {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

@keyframes stamp-flat-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* skeleton */

.ticket.skeleton {
  animation: none;
  opacity: 1;
}

.skeleton-block {
  background: var(--bg-panel);
  border-radius: 2px;
  animation: pulse 1.4s ease-in-out infinite;
}

.skeleton .ticket-media {
  background: var(--bg-panel);
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* empty / error state */

.rack-message {
  grid-column: 1 / -1;
  border: 1px solid var(--line);
  border-radius: 3px;
  padding: 48px 24px;
  text-align: center;
}

.rack-message h3 {
  font-size: 20px;
  margin: 12px 0 8px;
}

.rack-message p {
  max-width: 42ch;
  margin: 0 auto;
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy-col,
  .hero-stamp-col,
  .ticket {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

Note what was removed vs. the original: `.ticket`'s dashed border, `background: var(--bg-raised)`, the `rotate(var(--tilt))` transform and its three `:nth-child` variants, and the `::before` perforation pseudo-element are all gone (flat "no border" card). `.hero-stamp`'s dashed circular border, `border-radius: 50%`, and `aspect-ratio: 1` are gone (plain centered text, no rotation). `.lane-divider` (the striped accent bar) is deleted entirely, matching the `Home.jsx` change in Step 1. `.featured`, `.ticket-foot`, and `.rack-message` borders changed from `2px`/`1px dashed var(--line)` to `1px solid var(--line)`.

- [ ] **Step 3: Verify no accent or dashed decorative references remain project-wide**

```bash
grep -rn "var(--accent\|dashed\|rotate(var(--tilt" src/
```
Expected: no output (empty). (This confirms Home.css, Navbar.css, and index.css are all clean — the last accent/dashed references in the whole codebase.)

- [ ] **Step 4: Verify the build compiles**

```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 5: Manual visual check**

Run `npm run dev`, open the Home page:
- Background is white, all text renders in `#303030` (or the muted gray derived from it).
- Product cards have no border, no tilt, no dashed perforation — just image, title, description, price row.
- The hero's circular stamp badge is gone — its text sits centered with no circle/border around it.
- There's no striped divider bar between the hero and the featured section.
- Resize the OS to dark mode (or toggle browser dev tools' emulated `prefers-color-scheme: dark`) and confirm the page stays white/light — it no longer switches.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.css src/pages/Home.jsx
git commit -m "style: strip decorative dashed/tilt/stamp motifs from Home page"
```
