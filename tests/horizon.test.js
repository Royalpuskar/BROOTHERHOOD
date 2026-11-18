import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const src=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('12 connected Horizon modules are rendered and navigable with distinct identifiers',()=>{
 const html=src('horizon/index.html');
 for(const name of ['dashboard','assistant','schedule','registration','cyber','expo','polls','leaderboard','connect','careers','navigation','certificate','admin']){
  assert.match(html,new RegExp('id="'+name+'"'),'Missing '+name);
 }
 assert.match(html,/href="\.\.\/studio\/"/);
 assert.match(html,/id="login-modal"/);
 assert.match(html,/id="backend-modal"/);
});
test('Horizon controls are connected to real UI handlers and backend endpoints',()=>{
 const script=src('horizon/portal.js');
 for(const id of ['chat-form','login-form','register-form','checkin-form','project-form','career-form','profile-form','verify-form','poll-create-form','event-create-form','announcement-form','backend-form']){
  assert.ok(script.includes("'"+id+"'"),'Missing handler '+id);
 }
 for(const path of ['/api/events','/api/checkins','/api/expo','/api/polls','/api/leaderboard','/api/connect','/api/careers/recommend','/api/assistant/ask','/api/admin/events','/api/certificates/verify/']){
  assert.ok(script.includes(path),'Missing API integration '+path);
 }
 assert.match(script,/state\.online/);
 assert.match(script,/require(sLive|sLogin)/);
 assert.match(script,/document\.createElement/);
});
test('User-facing event data remains labeled as demonstration when disconnected',()=>{
 const html=src('horizon/index.html'),client=src('horizon/portal.js');
 assert.match(html,/DEMONSTRATION/);
 assert.match(html,/Not an official/);
 assert.match(client,/DEMO · Opening/);
 assert.match(client,/Demo preview/);
 assert.match(client,/cannot register, vote or check in/);
});
test('Portal source parses, remains mobile-friendly, supports reduced motion and light theme',()=>{
 const out=spawnSync(process.execPath,['--check',new URL('../horizon/portal.js',import.meta.url).pathname],{encoding:'utf8'});
 assert.equal(out.status,0,out.stderr);
 const css=src('horizon/portal.css');
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/data-theme="light"/);
 assert.match(src('horizon/index.html'),/id="theme-btn"/);
});
test('Live backend is optional and the static dashboard ships with the full website',()=>{
 const workflow=src('.github/workflows/pages.yml');
 assert.match(workflow,/cp horizon\/index\.html horizon\/portal\.css horizon\/portal\.js dist\/horizon\//);
 assert.match(src('index.html'),/href="\.\/horizon\/"/);
 assert.match(src('README.md'),/Horizon Connect/);
});
