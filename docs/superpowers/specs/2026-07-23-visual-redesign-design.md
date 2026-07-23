# Visual Redesign: White/#303030 Palette + Navbar Restructure

## Context

The client (`ecommerce-client`) currently uses a "retro/blacktop" theme: warm beige background, orange accent color, dashed borders, tilted "ticket" product cards, a circular dashed "stamp" badge on the hero, and an automatic dark mode driven by `prefers-color-scheme`. All of this lives in CSS custom properties in `src/index.css`, plus page-specific styles in `src/pages/Home.css` and `src/components/Navbar.css`.

Only the Navbar and Home page are actually styled with this theme — every other page (`Login`, `Register`, `Products`, `Cart`, `Checkout`, `Orders`, `OrderDetails`) renders bare unstyled HTML that just inherits the global body/typography rules from `index.css`. So the color reset touches those pages too (via the inherited variables), even though they have no dedicated CSS files today.

This spec covers a full flat black/white palette reset and a navbar restructure, validated interactively with mockups.

## Goals

- Replace the warm beige/orange palette with a flat white background (`#ffffff`) and near-black text (`#303030`).
- Remove the accent color, the automatic dark mode, and the decorative dashed/tilted/"stamp" motifs.
- Restructure the navbar: `Home / Shop / Orders` on the left (no brand/logo, no "Cart" text link), user + cart icons on the right (icon-only, no labels).
- Keep scope to visual/layout changes only — no cart item-count badge, no new pages.

## Non-goals

- No cart quantity badge (would require extending `CartContext` to track item counts — explicitly deferred).
- No change to fonts (Anton / IBM Plex Sans / IBM Plex Mono stay as-is).
- No change to any other page's markup or behavior beyond what the palette reset implies.

## 1. Color system (`src/index.css`)

Replace the `:root` variable block:

| Variable | Current | New |
|---|---|---|
| `--bg` | `#e4dfd0` | `#ffffff` |
| `--bg-panel` | `#dad3be` | `#f2f2f2` |
| `--bg-raised` | `#ede8da` | `#f7f7f7` |
| `--ink` | `#1b1b16` | `#303030` |
| `--ink-muted` | `#625d4e` | `#6b6b6b` |
| `--line` | `#b6ad91` | `#e2e2e2` |
| `--accent` | `#ff4b1f` | removed |
| `--accent-2` | `#c98a00` | removed |
| `--shadow` | `rgba(27, 27, 22, 0.18)` | `rgba(48, 48, 48, 0.18)` |

The entire `@media (prefers-color-scheme: dark)` override block is deleted — the site stays on this fixed light theme regardless of OS preference.

Any rule referencing `--accent` / `--accent-2` is updated to use `--ink` or `--ink-muted` instead (see section 3), since those variables no longer exist.

Font stack (`--display`, `--sans`, `--mono`) is unchanged.

## 2. Navbar (`src/components/Navbar.jsx`, `Navbar.css`)

Validated style: **editorial mono** — keeps the site's existing mono/uppercase/letter-spaced typographic voice, recolored to black/white, solid border instead of dashed.

**Layout:**
- Left: text links `Home` (`/`), `Shop` (`/products`), `Orders` (`/orders`) — no brand/logo, no "Cart" text link.
- Right: two icons only, no text labels — user icon, cart icon.
- `border-bottom` changes from `2px dashed var(--line)` to `2px solid var(--ink)`.

**Icons:** new dependency `lucide-react` (`User` and `ShoppingCart` icons). Icon-only, no adjacent text.

**Cart icon:** always links to `/cart`. No item-count badge (non-goal).

**User icon behavior (depends on auth state):**
- Not authenticated → clicking navigates directly to `/login`.
- Authenticated → clicking opens a small dropdown menu containing "Log Out" (calls the existing `handleLogout`).

**Auth state source:** `CartContext` already calls `getCurrentUser()` inside `refreshCart()` to resolve the cart. It's extended to also store that result in state and expose it as `user` (alongside the existing `cartId` and `refreshCart`), so `Navbar` can read auth state from context without an extra API call.

## 3. Home page decorative cleanup (`src/pages/Home.css`)

Validated style: **no border** — strip decorative chrome down to image + text, no rotation, no dashed/perforated edges.

- **`.ticket` (product cards):** remove `border: 2px dashed var(--line)`, remove `transform: rotate(var(--tilt))` and the three `:nth-child` tilt variants, remove the `::before` perforation pseudo-element. Cards become plain flex/grid items: image, title, description, price/tag row — no border, no rotation.
- **`.ticket-price`:** color changes from `var(--ink)` (unchanged, already ink) — no change needed.
- **`.ticket-no`:** color changes from `var(--accent-2)` → `var(--ink-muted)` (accent no longer exists).
- **`.hero-stamp`:** remove the `border: 3px dashed var(--accent)` circle, remove `border-radius: 50%`, remove the `rotate(-9deg)` transform. What remains is the centered text (`.hero-stamp span`), no circle/border around it. Text color changes from `var(--accent)` → `var(--ink)`.
- **`.hero-eyebrow::before`** (small dot before the eyebrow text): color changes from `var(--accent)` → `var(--ink)`.
- **`.lane-divider`** (striped accent bar between hero and featured section): removed entirely — no accent color left to build the stripe from, and it was a purely decorative divider.
- **Section dividers** (`.featured` border-bottom, `.ticket-foot` border-top, `.rack-message` border) that were `dashed var(--line)`: become `solid var(--line)` — thin solid light-gray lines, keeping the visual separation without reintroducing the dashed motif.

Skeleton loading states (`.skeleton-block`, `.ticket.skeleton .ticket-media`) keep their current structure, just inherit the new `--bg-panel` / `--line` values automatically.

## Testing

- Manual visual check: run the Vite dev server, verify Home, Navbar (logged in and logged out), and one other page (e.g. Products) render with the new white/#303030 palette and no leftover orange/dashed/tilt styling.
- Manual interaction check: user icon navigates to `/login` when logged out; opens dropdown with working "Log Out" when logged in; cart icon navigates to `/cart` in both states.
- No automated tests exist in this project today (`ecommerce-client` has no test setup) — this is out of scope to add here.

## Open notes

- `ecommerce-client` is not currently a git repository (only `ecommerce-api` is), so this spec is not committed to version control — it's saved to disk only.
