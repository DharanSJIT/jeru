---
name: Makkal Thunai Trust-First Blue
description: A white-dominant, near-black and vibrant-blue professional design system with Poppins display type, flat colors, sharp structure and generous motion.
colors:
  primary: "#0F172A"       # Near-Black Slate - headings, main text
  brand: "#0052CC"         # Vibrant Blue - primary actions, links, accents
  brand-dark: "#003D99"    # Deeper Blue - hover / pressed states
  brand-light: "#E8F0FE"   # Tinted Blue - icon chips, soft fills
  accent: "#2563EB"        # Blue Accent - highlights, focus rings
  surface: "#FFFFFF"       # Pure White - primary canvas
  background: "#F8FAFC"    # Light Slate - subtle off-white sections
  navy: "#0A101D"          # Deep Navy - dark bands (stats band, footer)
  navy-light: "#131C2E"    # Slightly lighter navy for footer bottom bar
  on-primary: "#FFFFFF"
typography:
  display: { fontFamily: Poppins, weights: [500, 600, 700, 800], h1: 64px/700, h2: 42px/700, h3: 20px/700, letterSpacing: -0.01em }
  body: { fontFamily: Inter, weights: [400, 500, 600, 700], base: 16px, leading: 1.5, large: 18-20px }
rounded:
  pill: 9999px        # Buttons, chips, inputs
  card: 16px          # Cards (rounded-2xl)
  panel: 28px         # Hero / About imagery frames
spacing:
  section: 96px       # py-24 sections
  section-lg: 128px   # py-32 featured sections
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    hover: { backgroundColor: "{colors.brand-dark}", translateY: -2px, shadow: brand-glow }
    active: { scale: 0.98 }
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    border: 2px solid #E2E8F0
    rounded: "{rounded.pill}"
    hover: { borderColor: "{colors.accent}", textColor: "{colors.accent}" }
  nav-link: { underlineGrow: 2px, hoverColor: "{colors.brand}" }
motion:
  duration-fast: 200ms
  duration-base: 300ms
  duration-slow: 500ms
  duration-reveal: 800ms
  ease: cubic-bezier(0.16, 1, 0.3, 1)
  reduced-motion: all animation and transition durations forced to ~0
---

# Makkal Thunai Trust-First Blue

## Overview

Makkal Thunai ("People's Support") is a government schemes portal for Indian citizens. The design reads as **trust-first public sector with modern polish**: a stark white canvas, near-black slate text, and one vibrant blue accent used exclusively for actions, links and highlights. Modeled on the clean, structured feel of a modern institutional landing page (reference: prompt-ten-mu.vercel.app).

## Colors

- **Surface (#FFFFFF):** Dominant canvas. Sections alternate white / `#F8FAFC` / deep navy for rhythm.
- **Primary (#0F172A):** Near-black slate for headings and body emphasis.
- **Brand (#0052CC):** The single blue accent - buttons, links, focus rings, icon tiles.
- **Navy (#0A101D):** Dark bands for the stats section and footer; the "black" in the white-black-blue theme.
- **NO GRADIENTS:** Strictly flat colors everywhere. The old green accent (#74B83E) is removed app-wide.

## Typography

- **Display (Poppins):** Heavy, tight-tracked headlines (`tracking-tight`, `leading-[1.08..1.15]`).
- **Body (Inter):** Highly legible, professional. `text-base` base, 18-20px for section leads.

## Layout & Spacing

- Asymmetric split hero; alternating section backgrounds; generous 96-128px section padding.
- Max-width containers (1200-1280px). Cards only where elevation communicates hierarchy.

## Elevation & Depth

- **Zero glassmorphism as decoration** (backdrop-blur used only on the navbar for readability while scrolled).
- **Zero gradients.** Depth via 1px borders, tinted shadows (`shadow-card`, `shadow-lift`), and offset flat deco frames (2px solid borders).

## Motion & Animation

- **Staggered reveals:** sections reveal on scroll (IntersectionObserver) with translate + opacity, staggered per card.
- **Count-up stats** on the navy band when it enters the viewport.
- **Marquee ticker** (one per page) under the hero on a flat blue band.
- **Rotating hero keyword** with a fade/slide swap every 2.6s.
- **Floating chips** over hero/about imagery (slow translate loop).
- **Micro-interactions:** buttons lift + glow on hover, press down on active, underline-grow nav links, icon tiles fill blue, chevron rotation and 0fr->1fr accordion body while `prefers-reduced-motion` collapses everything to ~0ms.

## Do's and Don'ts

- **DO** use white space aggressively and keep one blue accent locked across the whole page.
- **DON'T** use gradients, glows, or rainbow effects (footer shiny-text gradient removed).
- **DON'T** introduce any second accent color.
- **DO** keep pill buttons, 16px cards, 28px hero frames - a single documented radius system.