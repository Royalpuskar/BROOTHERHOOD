# Pocket 3D Lab

### Big discoveries. Small screen.

**Interactive high-school biology · Lesson 01: How the Human Heart Works**

[**Explore Pocket 3D Lab**](https://royalpuskar.github.io/BROOTHERHOOD/pocket-3d-lab/)

Pocket 3D Lab is a self-contained, responsive educational website with three experiences: **Home**, **The Human Heart**, and **For Teachers**. It is a separate learning project, hosted alongside the BROOTHERHOOD digital universe.

## Inside the heart lesson

- An original **procedurally modeled 3D heart** using version-pinned Three.js geometry. Learners can drag to rotate, scroll or pinch to zoom, reset the camera, and select labeled anatomy regions.
- **Thirteen interactive structures:** four chambers, four valves, and the superior vena cava, inferior vena cava, pulmonary artery, pulmonary veins and aorta.
- Moving, color-coded blood-flow particles explain the pathway through the body, right heart, lungs and left heart. Every route is also available as a **plain-language interactive text sequence**.
- A five-question quiz provides immediate feedback, an accurate final score, and unlimited retries.
- Exploration progress is saved **locally on the learner's device** using browser storage. No accounts, student data uploads, analytics beacons or external database are required.
- Accessibility includes text explanations for every part, keyboard-accessible label and quiz controls, an explicit motion toggle, reduced-motion preference support, and a functioning text-first alternative when WebGL or the external 3D library cannot load.
- A dedicated teachers' page explains learning goals, use in the classroom and the schematic model's limits.

## Science and illustration notes

The 3D illustration is a **schematic learning model**, not a precision medical reconstruction or diagnostic resource. In its initial front view, the heart's anatomical right side appears on the viewer's left. Blue is used as a standard diagram convention for oxygen-poor blood; **all human blood is red**, and real oxygen-poor blood is darker red.

Blood-flow routes and valve functions were checked against:

- [NIH National Heart, Lung, and Blood Institute — How Blood Flows through the Heart](https://www.nhlbi.nih.gov/health/heart/blood-flow)
- [American Heart Association — Heart Valves and Circulation](https://www.heart.org/en/health-topics/heart-valve-problems-and-disease/about-heart-valves)
- [CDC — How the Heart Works](https://www.cdc.gov/heart-defects/how-the-heart-works/index.html)

The site's original visual identity, SVG assets and 3D geometry have no AI generator watermark or platform branding.

## Technical foundation

Semantic HTML5, modern CSS3, modular vanilla JavaScript, and procedurally created Three.js meshes for the 3D model. The pinned Three.js ES module is retrieved from jsDelivr when WebGL is enabled; content, controls and assessments continue to work if the 3D renderer is unavailable. Interactive data and quiz rules live in `content.js`, with automated test coverage in `tests/pocket-3d-lab.test.js` at the repository root.

© 2026 Pocket 3D Lab — Educational illustration and code.
