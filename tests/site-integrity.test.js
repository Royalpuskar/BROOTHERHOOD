import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const text = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('every committed website module has valid JavaScript syntax',()=>{
  for(const path of ['src/app.js','src/logic.js','src/discovery.js','src/discovery-ui.js','src/guide-scene.js','sw.js']){
    const result=spawnSync(process.execPath,['--check',new URL('../'+path,import.meta.url).pathname],{encoding:'utf8'});
    assert.equal(result.status,0,path+' failed syntax check: '+result.stderr);
  }
});
test('cinematic journey and discovery mission controls are present and accessible',()=>{
  const html=text('index.html');
  for(const id of ['journey','guide-canvas','guide-caption','guide-render-toggle','discovery-engine','discovery-world-buttons','discovery-difficulty','discovery-answer','discovery-check','discovery-hint-button','discovery-next','discovery-score','lab-guide-message']){
    if(id==='discovery-world-buttons') { assert.match(html,/class="discovery-world-buttons"/); continue; }
    assert.ok(html.includes('id="'+id+'"'),id+' must be present in the HTML');
  }
  assert.match(html,/Skip the journey/);
  assert.match(html,/aria-live="polite"/);
  assert.match(html,/href="\.\/styles-guide\.css"/);
});
test('deployment includes all required guide and discovery resources',()=>{
  const pages=text('.github/workflows/pages.yml');
  const sw=text('sw.js');
  for(const path of ['styles-guide.css','src/guide-scene.js','src/discovery.js','src/discovery-ui.js']){
    assert.ok(pages.includes(path),'Missing deployment asset '+path);
    assert.ok(sw.includes(path),'Missing offline cache asset '+path);
  }
});
