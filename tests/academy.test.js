import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {LANGUAGES,LANGUAGE_BY_ID,RUNNABLE,QUESTIONS,grade,safeQuestionProgress,questionStats} from '../src/academy-content.js';
const text=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('20 distinctly named programming language tracks and honest browser execution modes',()=>{
 assert.equal(LANGUAGES.length,20);
 assert.equal(new Set(LANGUAGES.map(x=>x.id)).size,20);
 assert.deepEqual(RUNNABLE,['javascript','python','sql','html','typescript']);
 for(const lang of LANGUAGES){assert.ok(lang.name&&lang.subject&&lang.starter);assert.equal(LANGUAGE_BY_ID[lang.id].mode,lang.mode);}
});
test('100 complete, uniquely identified original quiz questions have validated answers and explanations',()=>{
 const all=Object.values(QUESTIONS).flat();
 assert.equal(all.length,100);
 assert.equal(new Set(all.map(q=>q.id)).size,60);
 for(const q of all){
  assert.equal(q.choices.length,3);assert.ok(q.question.length>=10&&q.explanation.length>=15);
  assert.deepEqual(grade(q,q.answer).correct,true);
  assert.equal(grade(q,(q.answer+1)%3).correct,false);
  assert.equal(grade(q,3).valid,false);
 }
});
test('Quiz progress cannot be inflated by malformed, duplicate or nonexistent questions',()=>{
 assert.deepEqual(safeQuestionProgress('nonsense'),[]);
 assert.deepEqual(safeQuestionProgress('{"bad":true}'),[]);
 assert.deepEqual(safeQuestionProgress('["javascript-1","javascript-1","not-real","python-2"]'),['javascript-1','python-2']);
 assert.deepEqual(questionStats(['javascript-1','javascript-1']),{solved:1,total:100});
});
test('Runnable JavaScript starter performs real arithmetic in a controlled Node test sandbox',()=>{
 const captured=[];
 runInNewContext(LANGUAGE_BY_ID.javascript.starter,{console:{log:(...args)=>captured.push(args.join(' '))}},{timeout:500});
 assert.deepEqual(captured,['Total: 12']);
});
test('Academy JavaScript modules and Python/SQL worker scripts parse',()=>{
 for(const path of ['src/academy-content.js','src/academy-app.js','src/academy-python-worker.js','src/academy-sql-worker.js','src/academy-typescript-worker.js','src/float-motion.js']){
  const r=spawnSync(process.execPath,['--check',new URL('../'+path,import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(r.status,0,path+': '+r.stderr);
 }
});
test('Editor, questions, save, archive, Webflow-style flight and accessible interaction controls exist',()=>{
 const html=text('index.html');
 for(const id of ['programming-academy','academy-search','academy-language-list','academy-challenge','academy-code','academy-run',
  'academy-reset','academy-copy','academy-save','academy-console','academy-sql-result','academy-html-preview',
  'academy-quiz-language','academy-quiz-index','academy-answer','academy-next-question','academy-quiz-options',
  'academy-percent','academy-code-score','flight','flight-count','flight-caption','hero-title']){
  assert.ok(html.includes('id="'+id+'"'),id+' missing');
 }
 assert.ok(html.includes('sandbox=""'));
 assert.match(html,/src="\.\/src\/academy-app.js"/);
 assert.match(html,/src="\.\/src\/float-motion.js"/);
 assert.match(html,/href="\.\/legacy\/"/);
});
test('Responsive and reduced-motion animation accommodations exist',()=>{
 const css=text('float-motion.css')+text('academy.css');
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/\.flight-stage\{position:sticky/);
 assert.match(css,/@media\(max-width:760px\)/);
});
test('GitHub Pages packages the academy and its real browser worker runtimes',()=>{
 const workflow=text('.github/workflows/pages.yml');
 for(const asset of ['academy.css','float-motion.css','src/academy-content.js','src/academy-app.js',
  'src/academy-python-worker.js','src/academy-sql-worker.js','src/academy-typescript-worker.js','src/float-motion.js']){
  assert.ok(workflow.includes(asset),'Missing published asset '+asset);
 }
});
