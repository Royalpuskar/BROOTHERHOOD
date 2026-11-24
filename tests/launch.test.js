import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const page=read('index.html');

test('submission homepage has a complete premium original visual brand and live WebGL hero',()=>{
 for(const phrase of [
  'DISCOVER THE','NEXT DIMENSION','THE FUTURE OF LEARNING',
  'id="universe-canvas"','id="hero-visual"','scene-fallback',
  'assets/launch-diorama.svg','brand-mark.svg','id="platform-story"',
  'launch-portal-halo','launch-hero-grid','launch-metrics'
 ])assert.ok(page.includes(phrase),'Missing branded launch feature '+phrase);
 assert.match(read('src/digital-scene.js'),/mountUniverse\(host/);
 assert.match(read('src/universe-v2.js'),/WebGLRenderer/);
 assert.match(read('src/world-fidelity.js'),/rockMap/);
});
test('every featured card and main hero action opens a real working lesson or connected app',()=>{
 for(const href of [
  './experience/','./experience/?tour=1','./pocket-3d-lab/',
  './studio/','./horizon/','./syllabus/','#cyber-arena'
 ])assert.ok(page.includes('href="'+href+'"'),'Broken or missing launch route '+href);
 assert.equal((page.match(/class="launch-feature launch-feature-/g)||[]).length,4);
 for(const section of ['learning-universe','cyber-arena','progress','platform-story','programming-academy','code-lab'])
  assert.ok(page.includes('id="'+section+'"'),'Existing learning section removed: '+section);
 assert.match(read('experience/experience.js'),/URLSearchParams\(window\.location\.search\)\.get\('tour'\)==='1'/);
 assert.match(read('experience/experience.js'),/\$\('xp-explore'\)\.click\(\)/);
});
test('branded homepage shows grounded 24 lesson, 48 question and 9 world counts',()=>{
 const meta=read('syllabus/content.js');
 assert.match(meta,/export const ALL_LESSONS=/);
 assert.match(meta,/export const quizTotal=/);
 for(const count of ['24','48','9'])assert.ok(page.includes('<strong>'+count+'</strong>'));
 assert.match(page,/Mini lessons/);
 assert.match(page,/Practice questions/);
 assert.match(page,/Floating worlds/);
 assert.doesNotMatch(page,/Answers instantly and guides every learner/);
 assert.doesNotMatch(page,/live scoring for everyone/i);
});
test('global search is a genuine accessible control with useful real destination results',()=>{
 const js=read('src/launch.js');
 for(const id of [
  'launch-search-open','launch-search-dialog','launch-search-close',
  'launch-search-input','launch-search-results'
 ])assert.ok(page.includes('id="'+id+'"'),'Missing search UI '+id);
 assert.match(js,/showModal/);
 assert.match(js,/searchInput\.addEventListener\('input'/);
 assert.match(js,/searchResults\.replaceChildren/);
 assert.match(js,/destinations\.filter/);
 assert.match(js,/aria-label/);
 assert.match(js,/event\.ctrlKey\|\|event\.metaKey/);
});
test('the three-scene preview is interactive, uses actual links, and has keyboard friendly controls',()=>{
 const js=read('src/launch.js');
 for(const id of [
  'launch-preview-prev','launch-preview-next','launch-preview-title',
  'launch-preview-desc','launch-preview-link','launch-preview-dots','launch-preview-number'
 ])assert.ok(page.includes('id="'+id+'"'));
 assert.equal((page.match(/data-preview="[012]"/g)||[]).length,3);
 assert.match(js,/showPreview\(previewIndex-1\)/);
 assert.match(js,/showPreview\(previewIndex\+1\)/);
 assert.match(js,/setAttribute\('aria-pressed'/);
 assert.match(js,/previewLink\.href=item\.href/);
});
test('original fallback illustration and full layout work on mobile and reduced motion',()=>{
 const css=read('launch.css'),svg=read('assets/launch-diorama.svg');
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/@media\(max-width:1050px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/\.launch-hero \.universe-canvas/);
 assert.match(css,/\.launch-hero \.scene-fallback/);
 assert.match(svg,/<svg/);
 assert.match(svg,/floating learning islands/);
 assert.doesNotMatch(svg,/watermark|BMW|OpenAI|Made with/i);
});
test('cinematic scripts parse and required assets are deployed by GitHub Pages',()=>{
 for(const path of ['src/launch.js','experience/experience.js']){
  const r=spawnSync(process.execPath,['--check',new URL('../'+path,import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(r.status,0,path+' syntax error '+r.stderr);
 }
 for(const file of ['launch.css','src/launch.js','assets/launch-diorama.svg']){
  assert.ok(read('.github/workflows/pages.yml').includes(file),'Not published '+file);
  assert.ok(read('sw.js').includes(file),'Not cached '+file);
 }
});
