import { fractionModel, circuitModel, ecoModel, progressCount, safeProgress } from './logic.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const STORAGE_KEY = 'brootherhood.progress.v1';
let progress = safeProgress(readStorage());
function readStorage() { try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; } }
function saveProgress() { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* Storage may be disabled. */ } }
const setText = (selector, text) => { const node = $(selector); if (node) node.textContent = text; };

function updatePassport() {
  const complete = progressCount(progress);
  setText('#progress-count', `${complete} / 3 cases solved`);
  $('#progress-fill').style.width = `${(complete / 3) * 100}%`;
  $('#progress-fill').setAttribute('aria-label', `${complete} out of 3 missions solved`);
}
function renderFractions() {
  const denominator = Number($('#denominator').value);
  $('#numerator').max = String(denominator);
  if (Number($('#numerator').value) > denominator) $('#numerator').value = String(denominator);
  const m = fractionModel($('#numerator').value, denominator);
  setText('#numerator-output', m.numerator); setText('#denominator-output', m.denominator);
  setText('#fraction-value', m.fraction); setText('#fraction-percent', `${m.percent}% filled`);
  setText('#fraction-insight', `${m.numerator} of ${m.denominator} equal pieces are shaded. That's about ${m.percent}% of the whole.`);
  setText('#lab-guide-message', `Great observation! ${m.numerator} of ${m.denominator} equal pieces represents ${m.percent}% of one whole.`);
  const visual = $('#fraction-visual');
  visual.replaceChildren();
  visual.setAttribute('aria-label', `${m.numerator} of ${m.denominator} equal parts shaded`);
  for (let i = 0; i < m.denominator; i++) {
    const part = document.createElement('span');
    part.className = 'fraction-piece' + (i < m.numerator ? ' shaded' : '');
    part.style.setProperty('--piece-index', i);
    visual.append(part);
  }
}
function renderCircuit() {
  const m = circuitModel($('#voltage').value, $('#resistance').value);
  setText('#voltage-output', `${m.voltage} V`); setText('#resistance-output', `${m.resistance} Ω`);
  setText('#current-value', m.currentLabel);
  setText('#circuit-insight', `Ohm's law: current = voltage ÷ resistance. ${m.voltage} V ÷ ${m.resistance} Ω = ${m.currentLabel}. This is a simplified ideal circuit.`);
  setText('#lab-guide-message', `The circuit shows ${m.currentLabel}. More voltage increases current; more resistance lowers it.`);
  const brightness = Math.min(1, m.current / 3);
  $('#simulation-bulb').style.setProperty('--brightness', String(brightness));
  $('.circuit-simulation').style.setProperty('--electron-speed', `${Math.max(.7, 5 - m.current)}s`);
}
function renderEco() {
  const m = ecoModel($('#car-trips').value, $('#bus-trips').value);
  setText('#car-output', m.carTrips); setText('#bus-output', m.busTrips); setText('#eco-value', m.kgLabel);
  $('#eco-meter-fill').style.width = `${Math.min(100, (m.kg / 25) * 100)}%`;
  $('#eco-meter').setAttribute('aria-valuenow', String(Math.min(m.kg, 25)));
  $('#eco-meter').setAttribute('aria-valuetext', `${m.kg} kilograms of illustrative weekly CO2`);
  setText('#eco-insight', `${m.carTrips} car trips × 3 kg + ${m.busTrips} bus trips × 1 kg = ${m.kgLabel} CO₂. These are illustrative assumptions, not measured travel emissions.`);
  setText('#lab-guide-message', `In our hypothetical model, these choices add up to ${m.kgLabel} CO₂. Try comparing different trips.`);
}
const renderers = { fractions: renderFractions, circuit: renderCircuit, eco: renderEco };
function selectLab(id, focus = false) {
  $$('.lab-tab').forEach(tab => {
    const active = tab.dataset.tab === id;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  $$('.experiment-panel').forEach(panel => panel.hidden = panel.id !== `panel-${id}`);
  renderers[id]();
  document.dispatchEvent(new CustomEvent('brootherhood:labchange',{detail:{id}}));
}
$$('.lab-tab').forEach(tab => {
  tab.addEventListener('click', () => selectLab(tab.dataset.tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = $$('.lab-tab'); const index = tabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    selectLab(tabs[next].dataset.tab, true);
  });
});
for (const id of ['numerator','denominator']) $(`#${id}`).addEventListener('input', renderFractions);
for (const id of ['voltage','resistance']) $(`#${id}`).addEventListener('input', renderCircuit);
for (const id of ['car-trips','bus-trips']) $(`#${id}`).addEventListener('input', renderEco);
$$('[data-check]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.check;
  const passed = id === 'fractions' ? fractionModel($('#numerator').value, $('#denominator').value).isHalf : id === 'circuit' ? circuitModel($('#voltage').value, $('#resistance').value).isOneAmp : ecoModel($('#car-trips').value, $('#bus-trips').value).reachedGoal;
  const feedback = $(`#feedback-${id}`);
  if (passed) {
    progress[id] = true; saveProgress(); updatePassport();
    feedback.textContent = 'Mission solved! Excellent reasoning. You unlocked this discovery.';
    feedback.className = 'feedback feedback-success';
    setText('#lab-guide-message', 'Wonderful work! You discovered the key relationship. Your passport has been updated.');
  } else {
    feedback.textContent = id === 'fractions' ? 'Not quite. Hint: the filled pieces must be half of the total.' : id === 'circuit' ? 'Keep experimenting. Hint: current is voltage divided by resistance.' : 'Almost there. Try reducing car trips or replacing them with bus trips.';
    feedback.className = 'feedback feedback-hint';
    setText('#lab-guide-message', 'Good attempt. Use the hint, then adjust the experiment and try again.');
  }
  document.dispatchEvent(new CustomEvent('brootherhood:mission',{detail:{id,passed}}));
}));
$$('[data-open]').forEach(card => card.addEventListener('click', () => selectLab(card.dataset.open)));
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  menu.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  $('#mobile-nav').hidden = expanded;
});
$$('#mobile-nav a').forEach(link => link.addEventListener('click', () => {
  $('#mobile-nav').hidden = true; menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation');
}));
renderFractions(); renderCircuit(); renderEco(); updatePassport();

/** Deep links from the floating 3D universe select the correct real science lab. */
const ROUTED_LABS = new Set(['fractions','circuit','eco']);
function openLinkedLab(){
 const requested=window.location.hash.slice(1);
 if(!ROUTED_LABS.has(requested))return;
 selectLab(requested);
 const section=document.querySelector('#lab');
 if(section){
  requestAnimationFrame(()=>section.scrollIntoView({
   behavior:'instant',block:'start'
  }));
 }
}
window.addEventListener('hashchange',openLinkedLab);
openLinkedLab();

if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => navigator.serviceWorker.register(new URL('../sw.js', import.meta.url)).catch(() => {}));
}

// A subtle depth effect is available for pointer devices. Keyboard and reduced-motion users
// receive exactly the same content without movement or visual dependencies.
const depthStage = document.querySelector('.hero-art');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (depthStage && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion.matches) {
  let frame = 0;
  depthStage.addEventListener('pointermove', (event) => {
    if (frame) return;
    const rect = depthStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    frame = window.requestAnimationFrame(() => {
      depthStage.style.setProperty('--depth-x', String(Math.max(-1, Math.min(1, x))));
      depthStage.style.setProperty('--depth-y', String(Math.max(-1, Math.min(1, y))));
      frame = 0;
    });
  }, { passive: true });
  depthStage.addEventListener('pointerleave', () => {
    depthStage.style.setProperty('--depth-x', '0');
    depthStage.style.setProperty('--depth-y', '0');
  });
}

// Learning challenges remain fully functional when optional 3D is unavailable.
import './discovery-ui.js';
if(document.querySelector('#guide-canvas')) {
  import('./guide-scene.js').then(module=>module.launchJourney()).catch(()=>{
    const caption=document.querySelector('#guide-caption');
    if(caption)caption.textContent='The 3D world could not load, but every learning lab remains available.';
  });
}
