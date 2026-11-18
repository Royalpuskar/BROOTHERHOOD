# BROOTHERHOOD — Every Mind Can Explore

**Horizon 2026 · Crack the Egg · Web Development · SDG 4: Quality Education**

An original, responsive, English-language learning experience: **three interactive simulations designed to make abstract ideas visible**. Built by the Brootherhood team for learners who benefit from experimenting instead of memorizing.

## Live website

**Hosting link:** Add the verified public URL after deployment. Suggested options: [Netlify](https://app.netlify.com/) or [Vercel](https://vercel.com/). Do not submit this project without a live, tested URL.

## The problem

Learners have different abilities, backgrounds, resources, and ways of understanding concepts. Passive, text-heavy explanations can exclude visual and exploratory learners. Interactive educational software can make foundational concepts approachable without logins, subscriptions, or expensive equipment.

## Our solution

Brootherhood is a lightweight, inclusive browser learning lab. Students can adjust variables, see a model respond, and complete a self-check challenge. It works in modern mobile and desktop browsers, with keyboard support and reduced-motion settings.

## Features

- **Fraction Playground:** 2–12 equal parts, interactive numerator and denominator, visual shading, percentage conversion, and a fraction equivalence challenge.
- **Electricity Studio:** Voltage and resistance sliders, a simple circuit visualization, current and power calculations based on Ohm's law, and a target-current challenge.
- **Eco Choices:** An illustrative transport-emissions model, car and bus trip controls, a visual emissions meter, and a weekly-goal challenge. **The model uses assumed values and does not claim to represent real-world emissions.**
- **Discovery Passport:** Local progress tracking, with no registration or personal data sent to a server.
- **Accessibility:** Semantic navigation, skip link, accessible sliders, keyboard-operable tabs, status announcements, mobile layout, and reduced-motion support.
- **Offline revisit:** An optional service worker caches the static site on HTTPS after the first successful visit.
- **Privacy and security:** No trackers, cookies, remote APIs, user accounts, or third-party scripts. Hosting-specific restrictive security headers are included.

## Tech stack

- Semantic **HTML5**, responsive **CSS3**, and modular **vanilla JavaScript**
- **Node.js** built-in test runner for domain logic
- **GitHub Actions** for continuous integration
- Ready for static deployment with **Netlify**, **Vercel**, or **GitHub Pages**

No off-the-shelf website builder, UI template, runtime dependency, or commercial asset is used.

## Run locally

1. Download or clone this repository.
2. Start any local HTTP server in this directory, for example `python -m http.server 4173` or `npm run serve`.
3. Open `http://localhost:4173` and use the **Interactive Lab** section.

**Note:** Open through an HTTP server, not a `file://` URL, because browser ES modules require appropriate origin rules.

## Run tests

```bash
npm test
```

The tests cover fraction calculations, Ohm's law, simplified ecology model, input bounds, and local progress validation.

## Deploy

### Netlify (recommended for simplicity)

1. Create a free Netlify site from your GitHub repository.
2. Set the **publish directory** to `.` (repository root), with **no build command**.
3. Deploy and open the public URL. Test on phone and desktop, including each mission.
4. Add the verified URL to the repository description, the **Live website** section above, and the Horizon submission form.

### Vercel

1. Import the repository into Vercel.
2. Choose **Other** or static site framework, leave **build command** unset, and set output to repository root if asked.
3. Deploy and verify all interactive cases.

### GitHub Pages

Pages can also serve this project because paths are relative. For production security headers use Netlify or Vercel, since GitHub Pages doesn't apply the included platform configs.

## Collaboration

- Repository owner: **[@Royalpuskar](https://github.com/Royalpuskar)**
- Additional team members: add registered teammates as GitHub collaborators through **Settings → Collaborators → Add people**. Each invited collaborator must accept the invitation.
- Suggested workflow: branch from `main`, open a pull request, run automated tests, and review before merge.
- Do not publish other participants' names or information without their permission.

## Contest compliance checklist

- [x] Original English-language responsive web project based on the approved *interactive visualizations and simulations* subtheme
- [x] Problem statement, purpose, features, technology, and usage documented here
- [x] Source code and automated tests included
- [x] No accounts, analytics, or third-party scripts
- [ ] Repository created on GitHub and team member(s) invited
- [ ] Public hosted website deployed and tested
- [ ] Each team member registered and eligible under the official competition rules
- [ ] GitHub repository and verified live-hosting URLs submitted before **November 25, 2026, 23:59 WIB**

The Horizon guidebook states a **1–3 member** team, one entry per team, active student eligibility, and a separate registration deadline of **November 18, 2026, 23:59 WIB**. The guidebook contains an inconsistent subtheme count on page 8; this project follows the interactive learning subtheme explicitly shown on page 5. Verify organizational updates with the competition staff.

## Responsible design and limitations

The electricity model is an idealized direct-current example; the animated bulb is symbolic, not a hardware simulator. The eco model uses fixed hypothetical units for classroom exploration; real CO₂ values vary with vehicle type, distance, passengers, and energy source. This project is educational and should not be used as scientific measurement software.

## Copyright

© 2026 Brootherhood · Puskar. All rights reserved. Individual contributors retain their existing rights to contributions, subject to written team agreements. Do not redistribute or reuse without permission.
