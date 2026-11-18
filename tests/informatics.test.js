import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import {
 WORLD_META,WORLD_IDS,CODE_TASKS,CYBER_CASES,evaluateCyber,STARTER_SAMPLES,classifyKNN,
 PACKET_HOPS,packetStep,validateArchitecture,normalizeProgress,missionRank,safeCodeResult
} from '../src/informatics-core.js';

test('five Informatics worlds have distinct identities and badges',()=>{
 assert.deepEqual(WORLD_IDS,['code','cyber','ai','network','build']);
 for(const id of WORLD_IDS)assert.ok(WORLD_META[id].title&&WORLD_META[id].badge);
});
test('all three Code Lab starter programs actually execute and print their expected output',()=>{
 for(const item of Object.values(CODE_TASKS)){
  const logs=[];
  runInNewContext(item.starter,{console:{log:(...args)=>logs.push(args.join(' '))}},{timeout:400});
  assert.ok(safeCodeResult(logs.join('\n'),item.expected));
  assert.ok(item.hint&&item.description);
 }
 assert.equal(safeCodeResult('14','15'),false);
});
test('three safe cybersecurity scenarios provide feedback without real targets',()=>{
 for(const [id,item] of Object.entries(CYBER_CASES)){
  assert.equal(evaluateCyber(id,item.correct).correct,true);
  const wrong=item.options.find(x=>x.id!==item.correct).id;
  assert.equal(evaluateCyber(id,wrong).correct,false);
  assert.ok(item.explanation.length>30&&item.hint.length>20);
 }
 assert.equal(evaluateCyber('unknown','report').valid,false);
 assert.equal(evaluateCyber('phishing',undefined).valid,false);
});
test('kNN calculations use real neighbor distances and majority votes',()=>{
 assert.deepEqual(classifyKNN(STARTER_SAMPLES,8,3).votes,{Blue:0,Green:3});
 assert.equal(classifyKNN(STARTER_SAMPLES,8,3).label,'Green');
 assert.equal(classifyKNN(STARTER_SAMPLES,1,3).label,'Blue');
 assert.equal(classifyKNN(STARTER_SAMPLES,5,3).neighbors.length,3);
 assert.throws(()=>classifyKNN([],5,3));
 assert.throws(()=>classifyKNN(STARTER_SAMPLES,8,2));
});
test('packet route includes DNS resolver, router and web server',()=>{
 assert.equal(PACKET_HOPS.length,4);
 assert.equal(packetStep(1).name,'DNS resolver');
 assert.equal(packetStep(3).name,'Web server');
 assert.equal(packetStep(4),null);
});
test('architecture validation enforces frontend to API to database order',()=>{
 assert.equal(validateArchitecture(['frontend','api','database']).success,true);
 assert.equal(validateArchitecture(['database','api','frontend']).success,false);
 assert.equal(validateArchitecture(['frontend']).success,false);
 assert.equal(validateArchitecture(['frontend','malicious','database']).valid,false);
});
test('only valid saved achievements count and progress ranking is grounded',()=>{
 assert.deepEqual(normalizeProgress('not-json'),[]);
 assert.deepEqual(normalizeProgress('["code","code","ai","invalid"]'),['code','ai']);
 assert.equal(missionRank([]),'Digital Explorer');
 assert.equal(missionRank(['code','cyber','ai','network','build']),'Digital Universe Master');
});
test('new website provides all five interactive experiments, archive, navigation and reduced-motion CSS',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 for(const id of ['home','worlds','cinematic','missions','code-lab','cyber-arena','ai-core','network-nexus','builders-realm','progress','about',
  'code-editor','run-code','cyber-scenario','cyber-check','ai-classify','ai-train','network-send','network-step','network-check','builder-check','progress-count','guide-dialogue']){
  assert.ok(html.includes('id="'+id+'"'),'Missing interactive control '+id);
 }
 assert.match(html,/href="\.\/legacy\//);
 const css=readFileSync(new URL('../digital.css',import.meta.url),'utf8');
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
test('new JS modules parse without syntax errors',()=>{
 for(const path of ['src/informatics-core.js','src/digital-app.js','src/digital-scene.js','src/code-worker.js']){
  const result=spawnSync(process.execPath,['--check',new URL('../'+path,import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(result.status,0,path+' does not parse: '+result.stderr);
 }
});
test('hosting workflow deploys interactive Informatics and the preserved original labs',()=>{
 const yml=readFileSync(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');
 for(const filename of ['digital.css','src/digital-app.js','src/digital-scene.js','src/informatics-core.js','src/code-worker.js','legacy/index.html']){
  assert.ok(yml.includes(filename),'Missing hosted file '+filename);
 }
});
