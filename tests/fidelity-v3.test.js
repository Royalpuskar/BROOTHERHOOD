import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('original physical-looking floating architecture uses layered procedural rock, texture, lights and clouds',()=>{
 const s=read('src/world-fidelity.js');
 for(const feature of [
  'BufferGeometry','computeVertexNormals','MeshStandardMaterial',
  'CanvasTexture','bumpMap','vertexColors','DodecahedronGeometry',
  'SpriteMaterial','AdditiveBlending','roughness','metalness',
  'Irregular Rock Strata','rockMap','hoverRing','glowTexture','setDetailMode'
 ])assert.ok(s.includes(feature),'Missing environmental detail '+feature);
 assert.match(s,/new T\.CylinderGeometry/);
 assert.match(s,/const highDetailRoots=/);
 assert.match(s,/detailGroup\.visible=/);
 assert.match(s,/highDetailRoots\.forEach/);
});
test('high fidelity uses actual 3D meshes and responsive low-power geometry budgets',()=>{
 const s=read('src/world-fidelity.js');
 assert.match(s,/lowPower\?12:22/);
 assert.match(s,/lowPower\?128:256/);
 assert.match(s,/lowPower\?6:15/);
 assert.match(s,/new T\.Sprite/);
 assert.match(s,/new T\.TubeGeometry|new T\.TorusGeometry/);
 assert.doesNotMatch(s,/images\.unsplash|\\.glb['"]|\\.png['"]|\\.jpg['"]/i);
});
test('experience camera supports drag-orbit, pinch and wheel zoom, reset, lighting, and render quality switching',()=>{
 const js=read('src/universe-v2.js');
 for(const t of [
  'enhanceFloatingWorld','activePointers','setPointerCapture','pinchDistance',
  'orbit.desiredYaw','orbit.desiredPitch','orbit.desiredZoom',
  'renderPausedOrbit','resetView','setQuality','setLighting',
  'fidelity.update','fidelity.setDetailMode','camera.lookAt',
  "addEventListener('wheel',onWheel"
 ])assert.ok(js.includes(t),'Missing 3D interaction: '+t);
 assert.match(js,/T\.ACESFilmicToneMapping/);
 assert.match(js,/setPixelRatio/);
 assert.match(js,/setLighting\(mode\)/);
 assert.match(js,/setQuality\(mode\)/);
});
test('all new visible scene buttons have handlers and stay disabled before WebGL is ready',()=>{
 const html=read('experience/index.html'),js=read('experience/experience.js');
 for(const id of ['xp-reset-view','xp-lighting','xp-quality']){
  assert.ok(html.includes('id="'+id+'"'));
  assert.ok(js.includes("$('"+id+"')"));
 }
 assert.match(js,/controller\.resetView\(\)/);
 assert.match(js,/controller\.setLighting\(lightMode\)/);
 assert.match(js,/controller\.setQuality\(qualityMode\)/);
 assert.match(js,/control\.disabled=true/);
 assert.match(js,/control\.disabled=false/);
 assert.match(js,/3D unavailable/);
 assert.doesNotMatch(js,/canvasHost\.addEventListener\('wheel',/);
});
test('every major BROOTHERHOOD site uses original orbit B monogram with no AI/tool watermark',()=>{
 const svg=read('assets/brand-mark.svg');
 assert.match(svg,/<svg/);
 assert.match(svg,/linearGradient/);
 assert.match(svg,/<ellipse/);
 assert.doesNotMatch(svg,/AI generated|watermark|Made with|OpenAI|Webflow/i);
 for(const page of ['index.html','experience/index.html','studio/index.html','horizon/index.html'])
  assert.ok(read(page).includes('brand-mark.svg'),'Missing shared branding on '+page);
});
test('new 3D code and fallback JS parse, CSS respects mobile and reduced motion, and Pages packages assets',()=>{
 for(const script of ['src/world-fidelity.js','src/universe-v2.js','experience/experience.js']){
  const result=spawnSync(process.execPath,['--check',new URL('../'+script,import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(result.status,0,script+': '+result.stderr);
 }
 const css=read('experience/experience.css');
 assert.match(css,/@media\(max-width:640px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/\.xp-scene-tools/);
 assert.match(css,/\.dawn-mode/);
 const pipeline=read('.github/workflows/pages.yml');
 assert.match(pipeline,/src\/world-fidelity\.js/);
 assert.match(pipeline,/assets\/brand-mark\.svg/);
 const sw=read('sw.js');
 assert.match(sw,/world-fidelity\.js/);
 assert.match(sw,/brand-mark\.svg/);
});
