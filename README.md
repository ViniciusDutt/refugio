# Refúgio 🕯️

**Refúgio** is a highly experimental, non-conventional web experience designed to feel more like a **game UI** rather than a traditional website.

It was created as a **personal project for my girlfriend**, blending emotional design, narrative, and interactivity. Inspired by shared moments and the *Hunter x Hunter* universe, the project combines a personal story with modern web technologies.

---

## 🧠 Concept

Refúgio explores the idea of a **digital safe space** — something intimate, symbolic, and meaningful.

Instead of traditional navigation and authentication flows, the experience is built around **rituals**:
- entering,
- unlocking,
- and discovering.

Every interaction is designed to feel intentional, almost ceremonial.

---

## 🔐 Authentication Experience

Authentication is handled via **Supabase**, using **OAuth 2.0**, **JWT**, and session-based access — but presented through a **fully custom UI**.

### Login Flow

- A constantly animated **central ring**, designed to feel like a puzzle or enigma
- Fragmented, meaningless words rotating and intersecting the interface
- Small glowing indicators guiding where the user should interact
- Clicking the correct area reveals a hidden input
- The password is symbolic (a shared date), and when entered correctly:
  - The fragmented words rotate
  - They align and form a cohesive shape
  - The interface transitions into the main dashboard

This flow intentionally avoids standard login patterns to reinforce immersion and mystery.

---

## 📜 First Access Ritual (Contract)

On the first visit, before accessing the dashboard, the user is presented with a **fictional contract**.

- The text is written in a narrative, symbolic tone
- It references the idea that the world may “fade” if abandoned for too long  
  (inspired by Supabase’s inactivity limitations)
- The user must **accept and sign** the contract
- Signing triggers an animation simulating the user writing their own name

Only after this ritual is completed does the main experience unlock.

---

## ✨ Main Features

- 🎮 **Game-style interface**  
  A single interactive table replaces traditional navigation.

- 📻 **Radio player**  
  - Playable audio tracks  
  - Audio content unlocked via an in-app shop  

- 🗺️ **Map (non-functional, atmospheric)**  
  Used purely for world-building and ambience.

- 🛒 **In-app shop**
  - Audio tracks for the radio  
  - Real-world items (gifts / physical items)
  - Virtual currency system

- 🪙 **Coins & Tasks system**
  - Tasks submitted through a clipboard on the table  
  - Tasks reviewed via an **admin panel**
  - Rewards granted after approval

- 📋 **Admin dashboard**
  - Task approval
  - Audio management
  - Shop and reward management

- 📸 **Virtual photo album (core feature)**
  - Personal photo collection
  - Daily sticker packs (3 per day)
  - Drag & drop sticker placement
  - Fully responsive layout

---

## 🧩 Tech Stack

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Framer Motion** (animations)
- **Zustand** (state management)
- **Supabase**  
  - OAuth 2.0  
  - JWT-based authentication  
  - Database (currently inactive)
- **@dnd-kit** (drag and drop)

---

## 🎨 UI & UX Philosophy

- No traditional forms or menus
- Constant ambient animations
- Object-based discovery instead of navigation
- Symbolic interactions over explicit instructions
- Fully responsive across devices

---

## ⚠️ Notes

- The Supabase database is no longer active, so some features are currently non-functional.
- This project was built as a **personal, emotional, and experimental experience**, not a commercial product.
- Some visual and narrative elements are inspired by *Hunter x Hunter* within a private context.

---

## 🚀 Getting Started

```bash
pnpm install
pnpm dev
