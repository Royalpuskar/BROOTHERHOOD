import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {PORTALS} from '../src/universe-v2.js';
const src=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('homepage renders nine distinctive, linked floating educational islands',()=>{
 const html=src('index.html');
 assert.match(html,/id="learning-universe"/);
 assert.equal((html.match(/class="atlas-card atlas-/g)||[]).length,9);
 for(const id of PORTALS.map(p=>p.id))assert.ok(html.includes('atlas-card atlas-'+id));
 assert.match(html,/href="\.\/pocket-3d-lab\/"/);
 assert.match(html,/href="\.\/legacy\/#circuit"/);
 assert.match(html,/href="\.\/legacy\/#fractions"/);
 assert.match(html,/href="\.\/legacy\/#eco"/);
 assert.match(html,/href="#cyber-arena"/);
 assert.match(html,/href="\.\/horizon\/"/);
 assert.match(html,/href="\.\/studio\/"/);
});
test('category filters are real controls with correct 4+4+1 subject breakdown',()=>{
 const html=src('index.html'),script=src('src/atlas.js');
 for(const filter of ['All','Science','Technology','Community'])assert.ok(html.includes('data-atlas-filter="'+filter+'"'));
 assert.equal((html.match(/data-atlas-category="Science"/g)||[]).length,4);
 assert.equal((html.match(/data-atlas-category="Technology"/g)||[]).length,4);
 assert.equal((html.match(/data-atlas-category="Community"/g)||[]).length,1);
 assert.match(script,/card\.hidden=!visible/);
 assert.match(script,/setAttribute\('aria-pressed'/);
 assert.match(script,/matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
 assert.match(html,/id="atlas-filter-status" role="status" aria-live="polite"/);
});
test('floating styles are responsive and respect reduced-motion preferences',()=>{
 const css=src('atlas.css'),experience=src('experience/experience.css');
 assert.match(css,/@media\(max-width:720px\)/);
 assert.match(css,/@media\(min-width:2200px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/@keyframes atlas-float/);
 assert.match(experience, /\.xp-world-filters/);
 assert.match(experience, /\.xp-portal-list/);
});
test('explorer has nine working worlds, category filters and keyboard navigation',()=>{
 const html=src('experience/index.html'),js=src('experience/experience.js');
 assert.equal((html.match(/data-portal="/g)||[]).length,9);
 for(const id of PORTALS.map(x=>x.id))assert.ok(html.includes('data-portal="'+id+'"'));
 for(const group of ['All','Science','Technology','Community'])assert.ok(html.includes('data-world-filter="'+group+'"'));
 assert.match(js,/showCategory/);
 assert.match(js,/visibleIndexes/);
 assert.match(js,/stepSelection/);
 assert.match(js,/\^\[1-9\]\$/);
 assert.match(js,/\.href=portal\.href/);
 assert.match(js,/tourStep/);
 assert.match(js,/3D unavailable/);
});
test('all new frontend scripts validate as JavaScript and Pages packages assets',()=>{
 for(const file of ['src/atlas.js','src/app.js','src/universe-v2.js','experience/experience.js']){
  const test=spawnSync(process.execPath,['--check',new URL('../'+file,import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(test.status,0,file+' syntax failed: '+test.stderr);
 }
 const yml=src('.github/workflows/pages.yml');
 assert.match(yml,/atlas\.css/);
 assert.match(yml,/src\/atlas\.js/);
 assert.match(src('sw.js'),/atlas\.css/);
 assert.match(src('README.md'),/floating learning/);
});
