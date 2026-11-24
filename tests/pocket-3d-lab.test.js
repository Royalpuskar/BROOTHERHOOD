import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {PARTS,GROUPS,FLOW,QUESTIONS,findPart,partsInGroup,newQuiz,answerQuiz,advanceQuiz,quizScore} from '../pocket-3d-lab/content.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('heart lesson covers four chambers, four valves, and five major vessels',()=>{
 assert.equal(PARTS.length,13);
 assert.equal(new Set(PARTS.map(x=>x.id)).size,13);
 assert.equal(partsInGroup('chambers').length,4);
 assert.equal(partsInGroup('valves').length,4);
 assert.equal(partsInGroup('vessels').length,5);
 assert.deepEqual(GROUPS.map(x=>x.id),['chambers','valves','vessels']);
 for(const p of PARTS){
  assert.ok(p.name&&p.short&&p.description&&p.connection);
  assert.equal(p.anchor.length,3);
  assert.ok(p.anchor.every(Number.isFinite));
  assert.equal(findPart(p.id),p);
 }
 assert.equal(findPart('does-not-exist'),null);
});
test('right and left side circulation anatomy is factually coherent',()=>{
 assert.match(findPart('right-atrium').description,/oxygen-poor/);
 assert.match(findPart('right-ventricle').description,/lungs/);
 assert.match(findPart('left-atrium').description,/oxygen-rich/);
 assert.match(findPart('left-ventricle').description,/aorta/);
 assert.match(findPart('pulmonary-artery').description,/oxygen-poor/);
 assert.match(findPart('pulmonary-veins').description,/oxygen-rich/);
 for(const [id,from,to] of [
  ['tricuspid-valve','right atrium','right ventricle'],
  ['mitral-valve','left atrium','left ventricle'],
  ['aortic-valve','left ventricle','aorta'],
  ['pulmonary-valve','right ventricle','pulmonary artery']
 ]){
  const d=findPart(id).description.toLowerCase();
  assert.ok(d.includes(from)&&d.includes(to),id+' flow missing '+from+' → '+to);
 }
});
test('both complete flow diagrams have a meaningful order, oxygen distinction, and clickable target mapping',()=>{
 assert.equal(FLOW.length,2);
 const blue=FLOW[0].steps.map(x=>x.label).join(' → ');
 const red=FLOW[1].steps.map(x=>x.label).join(' → ');
 for(const term of ['Body','Vena cavae','Right atrium','Tricuspid','Right ventricle','Pulmonary valve','Pulmonary artery','Lungs'])
  assert.ok(blue.includes(term),term);
 for(const term of ['Lungs','Pulmonary veins','Left atrium','Mitral valve','Left ventricle','Aortic valve','Aorta','Body'])
  assert.ok(red.includes(term),term);
 for(const flow of FLOW)for(const step of flow.steps)if(step.part)assert.ok(findPart(step.part));
});
test('five-question quiz rejects invalid and repeated answers, reports a perfect score and ends correctly',()=>{
 assert.equal(QUESTIONS.length,5);
 let state=newQuiz();
 assert.equal(state.index,0);
 assert.equal(advanceQuiz(state),state);
 const noAnswer=answerQuiz(state,-1);
 assert.equal(noAnswer.accepted,false);
 assert.equal(answerQuiz(state,77).accepted,false);
 for(let i=0;i<QUESTIONS.length;i++){
  assert.equal(state.index,i);
  const item=QUESTIONS[i];
  assert.equal(item.choices.length,4);
  assert.ok(item.answer>=0&&item.answer<4);
  assert.ok(item.explain.length>20);
  const result=answerQuiz(state,item.answer);
  assert.equal(result.accepted,true);
  assert.equal(result.correct,true);
  state=result.state;
  assert.equal(answerQuiz(state,item.answer).accepted,false);
  state=advanceQuiz(state);
 }
 assert.equal(state.finished,true);
 assert.equal(quizScore(state),5);
 assert.equal(answerQuiz(state,0).accepted,false);
 assert.equal(advanceQuiz(state),state);
});
test('wrong quiz answers stay recorded and score accurately',()=>{
 let state=newQuiz();
 for(const item of QUESTIONS){
  const wrong=(item.answer+1)%4;
  state=answerQuiz(state,wrong).state;
  state=advanceQuiz(state);
 }
 assert.equal(quizScore(state),0);
 assert.equal(state.finished,true);
});
test('all links and interactive controls exist in three integrated responsive pages',()=>{
 const html=read('pocket-3d-lab/index.html');
 for(const id of [
  'home','lesson','teachers','heart-view','heart-hotspots','heart-fallback','model-status',
  'model-reset','model-zoom-in','model-zoom-out','motion-toggle','flow-toggle',
  'part-list','group-controls','part-description','part-title','part-connection',
  'discovery-count','discovery-bar','flow-paths','quiz-question','quiz-options','quiz-next',
  'quiz-feedback','quiz-progress-bar','quiz-restart','quiz-results'
 ])assert.ok(html.includes('id="'+id+'"'),'Missing control '+id);
 for(const route of ['home','lesson','teachers'])assert.ok(html.includes('href="#'+route+'"'));
 assert.ok(html.includes('id="quiz"'));
 assert.match(html,/role="status"/);
 assert.match(html,/aria-live="polite"/);
});
test('model has original procedural 3D geometry, drag/zoom, clickable anatomy, and reduced motion',()=>{
 const model=read('pocket-3d-lab/heart-3d.js');
 for(const feature of ['WebGLRenderer','SphereGeometry','TorusGeometry','TubeGeometry','ExtrudeGeometry',
  'PerspectiveCamera','Raycaster','pointerdown','pointermove','wheel','requestAnimationFrame',
  'IntersectionObserver','ResizeObserver','dispose','setMotionPaused','setFlow','onAnchors','onSelect'])
  assert.ok(model.includes(feature),'Missing real 3D behavior '+feature);
 assert.match(model,/devicePixelRatio/);
 assert.match(model,/host\.prepend\(canvas\)/);
 assert.match(model,/three@0\.180\.0/);
});
test('lesson remains usable when WebGL fails and controls persist local student progress',()=>{
 const app=read('pocket-3d-lab/app.js'),css=read('pocket-3d-lab/styles.css');
 assert.match(app,/3D graphics are unavailable/);
 assert.match(app,/localStorage/);
 assert.match(app,/quiz\.finished/);
 assert.match(app,/setMotionPaused\(reduced\)/);
 assert.match(app,/positionHotspots/);
 assert.match(app,/startModel\(\)/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/body\.reduce-motion/);
});
test('original website requires no private backend or AI badge and includes grounded medical references',()=>{
 const html=read('pocket-3d-lab/index.html');
 assert.match(html,/www\.nhlbi\.nih\.gov\/health\/heart\/blood-flow/);
 assert.match(html,/www\.heart\.org/);
 assert.doesNotMatch(html,/Powered by (?:OpenAI|ChatGPT|Gemini|Webflow|Wix)/i);
 assert.doesNotMatch(html,/placeholder\.com|example\.com|href="#"/i);
 assert.match(html,/Simplified anatomy/);
 assert.match(html,/real blood is red/);
});
test('three Pocket 3D Lab JS modules pass syntax checks',()=>{
 for(const path of ['pocket-3d-lab/content.js','pocket-3d-lab/heart-3d.js','pocket-3d-lab/app.js']){
  const result=spawnSync(process.execPath,['--check',new URL('../'+path,import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(result.status,0,path+' failed syntax validation: '+result.stderr);
 }
});
test('Pocket 3D Lab is packaged as an independent hosted website in GitHub Pages',()=>{
 const workflow=read('.github/workflows/pages.yml');
 assert.match(workflow,/dist\/pocket-3d-lab/);
 for(const file of ['index.html','styles.css','app.js','content.js','heart-3d.js','favicon.svg'])
  assert.ok(workflow.includes(file),'Missing published asset: '+file);
});
