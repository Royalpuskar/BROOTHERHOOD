<div align="center">

# BROOTHERHOOD

## ENTER THE DIGITAL UNIVERSE

**THINK. BUILD. SECURE. INNOVATE.**

**HORIZON 2026 · CRACK THE EGG · SDG 4: QUALITY EDUCATION**

### [EXPLORE THE LIVE DIGITAL UNIVERSE](https://royalpuskar.github.io/BROOTHERHOOD/)

[Source code](https://github.com/Royalpuskar/BROOTHERHOOD) · [Quality checks](https://github.com/Royalpuskar/BROOTHERHOOD/actions/workflows/quality.yml) · [Original discovery labs](https://royalpuskar.github.io/BROOTHERHOOD/legacy/)

</div>

---

## The experience

**Brootherhood** is an original, cinematic Informatics education experience that helps learners explore programming, cybersecurity, machine learning, networking and software engineering. It was designed for the **Horizon 2026 — Crack the Egg** responsive website competition under the theme of interactive digital learning through visualizations and simulations.

Instead of passive lessons, Brootherhood offers meaningful, interactive decisions with real calculations and immediate educational feedback, supporting the vision of **SDG 4: inclusive, quality education**.

An **original articulated 3D explorer** welcomes visitors to a futuristic environment of floating digital platforms, neon code holograms, network constellations and glowing architectural islands. The explorer uses a procedural joint hierarchy and responsive gestures in a live Three.js scene. It is a stylized 3D character, not a photorealistic imported rigged GLB model; its dialogue is context-aware and prewritten, not a falsely advertised conversational AI.

## Five interactive Informatics worlds

| World | Subject | Working educational interaction |
|:---|:---|:---|
| **Code Lab** | Programming and algorithms | Edit and run real beginner JavaScript in a disposable, time-limited browser worker. Solve variables, conditionals and loop challenges, see console output and get feedback. |
| **Cyber Defense Arena** | Cybersecurity and digital safety | Examine fictional phishing, password reuse, and unsolicited MFA scenarios. Choose a defensive response and receive reviewed explanations. No real accounts or targets. |
| **Artificial Intelligence Core** | Machine learning | Use a working k-nearest-neighbors (kNN) algorithm on tiny labeled synthetic data, adjust the feature and neighbor count, add training examples and inspect actual class votes. |
| **Network Nexus** | Networking and Internet basics | Follow a simulated browser → DNS → router → server packet journey, inspect each role and answer a networking question. Documentation-only addresses are used. |
| **Builders' Realm** | Software engineering | Assemble a frontend → API → database stack from interactive components and get architecture feedback. |

**Brootherhood Digital Missions** connect these activities with five locally stored achievements. Successful challenges are validated against deterministic learning objectives, and the explorer reacts to student progress. Completed worlds and a rank appear in the learner's private Discovery Passport.

## Digital world and accessibility

- Responsive, layered 3D visual style for phones, tablets, laptops and large 4K-class monitors.
- Real-time Three.js geometry, animated human-style guide, floating islands, neon holograms and a stylized cyber network environment.
- Adaptive WebGL resolution, pause motion control, automatic visibility-based animation pause and reduced-motion fallback.
- All core content remains usable **without** Three.js, JavaScript-powered 3D or high-end graphics.
- Semantic landmarks, screen-reader feedback, keyboard-operable controls, descriptive labels and clear navigation.
- Original visual geometry and CSS design rather than an instant website template.

**Quality note:** High-resolution layout support does not mean every device is forced to render 3D at native 4K resolution. Rendering is deliberately capped to protect mobile performance.

## Privacy, security and educational limits

No accounts, email collection, analytics, tracking scripts, ad networks or remote user databases are used. Mission achievements are stored locally in the visitor's own browser. The application does not send them to a server.

Code Lab evaluates student-supplied beginner JavaScript in a **separate, short-lived Web Worker** with a time limit and blocked network/system API patterns. This is suitable for small educational exercises, **not** a security-hardened sandbox for adversarial code or a general-purpose cloud code execution service.

Cybersecurity lessons are defensive and confined to simulated data. The kNN classifier uses explicitly synthetic examples and should not be mistaken for a production ML service. The network teaching model sends no real packet traffic. Builders' Realm illustrates application architecture rather than provisioning a real database.

The optional 3D renderer loads a version-pinned Three.js dependency from jsDelivr; licensing is acknowledged in [third-party notices](THIRD_PARTY_NOTICES.md). The original browser-based mathematics, electricity and sustainability learning labs remain preserved in the [Legacy Discovery Labs](legacy/) archive.

## Technology

| Layer | Technology |
|:---|:---|
| Interface | Semantic HTML5, responsive CSS3, native browser interactions |
| 3D environment | Three.js, procedural geometry, articulated character and WebGL |
| Code runner | Dedicated disposable JavaScript Web Worker |
| Informatics simulations | Dependency-free JavaScript models and validation |
| Learning progress | Browser localStorage |
| Quality assurance | Node.js built-in test runner and GitHub Actions |
| Hosting | GitHub Pages with automatic deployment workflow |

**Website:** https://royalpuskar.github.io/BROOTHERHOOD/  
**Repository:** https://github.com/Royalpuskar/BROOTHERHOOD  
**Automated test results:** https://github.com/Royalpuskar/BROOTHERHOOD/actions/workflows/quality.yml  
**Competition:** Horizon 2026, web development, SDG 4  
**Created by:** [Royalpuskar](https://github.com/Royalpuskar) and the Brootherhood team.

---

<div align="center">

### ENTER AS AN EXPLORER. LEAVE AS A BUILDER.

**BROOTHERHOOD · THINK. BUILD. SECURE. INNOVATE.**

© 2026 Puskar · Brootherhood. All rights reserved. Third-party software retains its respective licenses.

</div>
