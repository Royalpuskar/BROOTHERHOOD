import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {PORTALS,CAMERA_STOPS} from '../src/universe-v2.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('The 3D journey has nine unique accessible learning gateways with valid in-repo destinations',()=>{
 assert.deepEqual(PORTALS.map(x=>x.id),['code','cyber','ai','biology','physics','maths','eco','horizon','build']);
 assert.equal(new Set(PORTALS.map(x=>x.href)).size,9);
 for(const portal of PORTALS){
  assert.ok(portal.title&&portal.subtitle);
  assert.ok(portal.href.startsWith('../'));
  assert.equal(typeof portal.color,'number');
 }
});
test('Each 3D portal has a camera stop with numeric coordinates',()=>{
 assert.equal(CAMERA_STOPS.length,PORTALS.length);
 for(const stop of CAMERA_STOPS){
  for(const key of ['position','target']){
   assert.equal(stop[key].length,3);
   assert.ok(stop[key].every(x=>typeof x==='number'&&Number.isFinite(x)));
  }
 }
});
test('Cinematic environment uses original procedural WebGL geometry, interactivity and render lifecycle controls',()=>{
 const js=read('src/universe-v2.js');
 for(const feature of ['WebGLRenderer','PerspectiveCamera','InstancedMesh','TubeGeometry','TorusGeometry','IcosahedronGeometry',
  'IntersectionObserver','ResizeObserver','Raycaster','pointermove','requestAnimationFrame','dispose','setPaused','selectPortal','devicePixelRatio']){
  assert.ok(js.includes(feature),'Missing real 3D feature: '+feature);
 }
 assert.match(js,/three@0\.180\.0/);
 assert.match(js,/prefers-reduced-motion: reduce/);
 assert.match(js,/T\.SRGBColorSpace/);
 assert.match(js,/adaptiveDpr/);
});
test('Full-screen experience provides all nine accessible navigation controls and direct links to real features',()=>{
 const html=read('experience/index.html');
 for(const id of ['experience-space','xp-motion','xp-prev','xp-next','xp-explore','xp-portal-list','xp-current-title','xp-enter','xp-render-status','xp-announcement']){
  assert.ok(html.includes('id="'+id+'"'),'Missing '+id);
 }
 for(const portal of PORTALS)assert.ok(html.includes('data-portal="'+portal.id+'"'));
 assert.match(html,/href="\.\.\/studio\/"/);
 assert.match(html,/href="\.\.\/horizon\/"/);
 assert.match(html,/aria-pressed/);
 assert.match(html,/aria-live="polite"/);
});
test('3D interaction keeps destinations accessible if graphics fail and supports reduced-motion visitors',()=>{
 const script=read('experience/experience.js');
 const css=read('experience/experience.css');
 assert.match(script,/3D unavailable/);
 assert.match(script,/controller\?\.setPaused/);
 assert.match(script,/ArrowRight/);
 assert.match(script,/touchend/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/@media\(max-width:640px\)/);
 assert.match(css,/@media\(min-width:2300px\)/);
});
test('Homepage links to 3D journey and retains current learning worlds, Horizon and coding studio',()=>{
 const html=read('index.html');
 assert.match(html,/href="\.\/experience\/"/);
 assert.match(html,/href="\.\/studio\/"/);
 assert.match(html,/href="\.\/horizon\/"/);
 assert.match(html,/id="code-lab"/);
 assert.match(html,/id="cyber-arena"/);
 assert.match(html,/id="ai-core"/);
 assert.match(html,/id="network-nexus"/);
 assert.match(html,/id="builders-realm"/);
 assert.match(html,/href="\.\/universe-v2\.css"/);
});
test('Homepage renderer and standalone experience compile as JavaScript modules',()=>{
 for(const path of ['src/universe-v2.js','src/digital-scene.js','experience/experience.js']){
  const run=spawnSync(process.execPath,['--check',new URL('../'+path,import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(run.status,0,path+' syntax issue: '+run.stderr);
 }
});
test('GitHub Pages publishes full 3D expedition and shared scene assets',()=>{
 const yml=read('.github/workflows/pages.yml');
 for(const file of ['experience/index.html','experience/experience.css','experience/experience.js','src/universe-v2.js','universe-v2.css']){
  assert.ok(yml.includes(file),'3D asset not packed: '+file);
 }
 const sw=read('sw.js');
 assert.match(sw,/experience\/experience\.js/);
});

test('WebGL mounting keeps fallback accessible during initialization and enables main-hero parallax',()=>{
 const code=read('src/universe-v2.js');
 assert.match(code,/host\.prepend\(canvas\)/);
 assert.doesNotMatch(code,/host\.replaceChildren\(canvas\)/);
 assert.match(code,/const inputSurface=interactive\?host:/);
 assert.match(code,/inputSurface\.addEventListener\('pointermove'/);
 const experience=read('experience/index.html');
 assert.match(experience,/id="space-fallback"/);
});

test('Nine subject destinations preserve biology, physics, mathematics, ecology and cybersecurity content',()=>{
 assert.equal(PORTALS.length,9);
 assert.equal(PORTALS.filter(x=>x.category==='Science').length,4);
 assert.equal(PORTALS.filter(x=>x.category==='Technology').length,4);
 assert.equal(PORTALS.filter(x=>x.category==='Community').length,1);
 const routes=Object.fromEntries(PORTALS.map(x=>[x.id,x.href]));
 assert.equal(routes.biology,'../pocket-3d-lab/');
 assert.equal(routes.physics,'../legacy/#circuit');
 assert.equal(routes.maths,'../legacy/#fractions');
 assert.equal(routes.eco,'../legacy/#eco');
 assert.equal(routes.cyber,'../#cyber-arena');
 assert.equal(routes.code,'../studio/');
 assert.equal(routes.horizon,'../horizon/');
 const html=read('legacy/index.html');
 for(const id of ['fractions','circuit','eco'])assert.ok(html.includes('data-tab="'+id+'"'),'Missing real lab '+id);
 const app=read('src/app.js');
 assert.match(app,/openLinkedLab/);
 assert.match(app,/ROUTED_LABS/);
});
test('Each subject is represented by its own procedural 3D sculpture and clickable island',()=>{
 const scene=read('src/universe-v2.js');
 for(const item of ["case 'biology'","case 'physics'","case 'maths'","case 'eco'","case 'cyber'","case 'ai'","case 'code'","case 'horizon'","case 'build'"])
  assert.ok(scene.includes(item),'Missing real 3D sculpture '+item);
 assert.match(scene,/waterfall/);
 assert.match(scene,/decorateIsland\(def,group,lightMat,crystalMat\)/);
 assert.match(scene,/const islandCoords=\[/);
 assert.match(scene,/intersectObjects\(portals/);
 assert.match(scene,/if\(paused\)\{/);
});
