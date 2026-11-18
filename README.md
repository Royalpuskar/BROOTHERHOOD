<div align="center">

# BROOTHERHOOD

### GUIDED BY DISCOVERY

**A cinematic learning universe where curiosity leads the way.**

**HORIZON 2026 · CRACK THE EGG · SDG 4: QUALITY EDUCATION**

### [ENTER THE WEBSITE](https://royalpuskar.github.io/BROOTHERHOOD/)

[Explore the source code](https://github.com/Royalpuskar/BROOTHERHOOD) · [Quality checks](https://github.com/Royalpuskar/BROOTHERHOOD/actions/workflows/quality.yml)

</div>

---

## The vision

Every mind has the power to discover. But not every learner thrives through memorization, lectures, or static diagrams.

**Brootherhood** transforms foundational concepts into a personal exploration experience: a walking 3D human-style guide, three floating educational worlds, interactive experiments, and meaningful challenges that reward understanding rather than speed.

Designed for the **Horizon 2026 — Crack the Egg** responsive web development competition, the project addresses the official theme of **interactive digital learning through visualization and simulation**, supporting the ambitions of **SDG 4: Quality Education**.

## The 3D guided journey

A stylized, articulated, original 3D explorer walks through a floating learning environment. As visitors progress through the story, a responsive camera follows the experience and introduces three worlds:

| World | Discovery | Real experiment |
| --- | --- | --- |
| **01 · Fraction Playground** | Turn equal parts into a visual understanding of percentages | Adjust numerator and denominator; solve a half-of-a-whole challenge |
| **02 · Electricity Studio** | See how current responds to changes in voltage and resistance | Adjust an idealized circuit; reach a target current |
| **03 · Eco Choices** | Explore how hypothetical transport decisions change a scenario | Compare car and bus trips under explicitly assumed emissions values |

The 3D scene includes original geometric learning artifacts, illuminated floating platforms, atmospheric particles, lighting, articulated character movement, and responsive rendering. The 3D view is an enhancement: **the educational tools remain usable with 3D unavailable or disabled**.

## BROOTHERHOOD Discovery Engine

Nine educational challenges across the three worlds, at three difficulty levels:

- **Starter** — Introduce the core concept.
- **Explorer** — Apply the concept to a more challenging example.
- **Master** — Solve a multistep reasoning case.

Each challenge includes a learning objective, hint, validated answer, explanation, reflection prompt, and local achievement progress.

**Discovery titles:** New Explorer · First Spark · Curious Explorer · Trailblazer · Master of Discovery.

The guide responds with contextual captions and animated gestures when students explore, try again, or complete a challenge. This is a **deterministic, reviewed educational guide**, not an unimplemented conversational AI service.

## Designed for everyone

- Responsive layouts for mobile, tablet, laptop, and large displays.
- Real interactive laboratory controls, working navigation, and keyboard access.
- Reduced-motion preference support, accessible text alternatives, labels, and feedback.
- Rendering scaled to device capabilities rather than forcing 4K GPU resolution.
- Progress saved on the learner's own device, without registration or cloud accounts.
- No analytics, marketing trackers, or third-party advertisements.

## Engineering

| Layer | Implementation |
| --- | --- |
| Website | HTML5, responsive CSS3, modular JavaScript |
| Cinematic 3D | Three.js with original procedurally articulated character and environment |
| Core learning simulations | Pure and unit-tested JavaScript models |
| Discovery Engine | Deterministic challenge validation, hints, explanations, and private local achievements |
| Quality | Node.js built-in tests and GitHub Actions |
| Delivery | GitHub Pages static website |
| Accessibility | Semantic navigation, keyboard-operable interactions, reduced-motion fallbacks |

The 3D enhancement loads a version-pinned Three.js module from jsDelivr when WebGL and motion preferences allow. The 2D labs do not depend on this external resource. Original on-page graphics and the explorer geometry are authored for this project.

## Responsible educational design

The electrical experience demonstrates an idealized circuit using **Ohm's law**. The environmental experience uses **hypothetical coefficients**, not real-world measured transport emissions. These scenarios are designed for learning and should not be used as scientific measurement or engineering guidance.

No private data or identity information is requested. Progress and achievements are stored locally in the browser.

## Project

**Creator:** [Royalpuskar](https://github.com/Royalpuskar) and the Brootherhood team  
**Competition:** Horizon 2026 · Crack the Egg · Web Development  
**Subtheme:** Interactive Learning Through Visualization and Simulation  
**Mission:** More inclusive, practical, engaging learning

**Website:** https://royalpuskar.github.io/BROOTHERHOOD/  
**Repository:** https://github.com/Royalpuskar/BROOTHERHOOD  
**CI:** https://github.com/Royalpuskar/BROOTHERHOOD/actions/workflows/quality.yml

---

<div align="center">

### THE CHARACTER GUIDES. THE ENVIRONMENT TEACHES. THE STUDENT DISCOVERS.

**BROOTHERHOOD · GUIDED BY DISCOVERY**

© 2026 Puskar · Brootherhood. All rights reserved. Third-party software retains its respective licenses.

</div>
