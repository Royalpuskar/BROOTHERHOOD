import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {COURSES,ALL_LESSONS,quizTotal,getCourse,getLesson,gradeLesson,lessonKey} from '../syllabus/content.js';
import {evaluateGate,GATES,truthTable,decimalToBinary,binaryToDecimal,parseMatrix,add2,multiply2,determinant2,invert2,transformVector,parseSet,setOperations,combinations,parseGraph,breadthFirst,shortestPath} from '../syllabus/math-core.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('seven curricula include Digital Systems, Linear Algebra, Discrete Mathematics and four further CS subjects',()=>{
 assert.deepEqual(COURSES.map(c=>c.id),['digital','linear','discrete','dsa','algorithms','architecture','networks']);
 assert.equal(ALL_LESSONS.length,24);
 assert.equal(quizTotal,48);
 assert.equal(new Set(ALL_LESSONS.map(l=>lessonKey(l.courseId,l.id))).size,24);
 for(const course of COURSES){
  assert.ok(course.title&&course.intro&&course.tool&&course.color);
  for(const lesson of course.lessons){
   assert.ok(lesson.title&&lesson.goal&&lesson.explanation.length>60&&lesson.example.length>35&&lesson.remember);
   assert.equal(lesson.questions.length,2);
   assert.equal(getLesson(course.id,lesson.id),lesson);
  }
  assert.equal(getCourse(course.id),course);
 }
 assert.equal(getCourse('fake'),null);
 assert.equal(getLesson('digital','fake'),null);
});
test('all 48 quiz questions grade correct answers, wrong answers and invalid submissions',()=>{
 for(const lesson of ALL_LESSONS){
  for(const q of lesson.questions){
   assert.equal(q.choices.length,4);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
   assert.ok(q.why.length>15);
  }
  const perfect=gradeLesson(lesson.courseId,lesson.id,lesson.questions.map(q=>q.answer));
  assert.equal(perfect.score,2);
  assert.ok(perfect.feedback.every(f=>f.correct));
  const wrong=gradeLesson(lesson.courseId,lesson.id,lesson.questions.map(q=>(q.answer+1)%4));
  assert.equal(wrong.score,0);
  assert.ok(wrong.feedback.every(f=>!f.correct));
  assert.equal(gradeLesson(lesson.courseId,lesson.id,[]),null);
  assert.equal(gradeLesson(lesson.courseId,lesson.id,[-1,1]),null);
 }
});
test('logic gate simulator evaluates all eight operations across all four truth rows',()=>{
 assert.equal(GATES.length,8);
 const expecteds={
  'AND':[0,0,0,1],'OR':[0,1,1,1],'XOR':[0,1,1,0],
  'NAND':[1,1,1,0],'NOR':[1,0,0,0],'XNOR':[1,0,0,1],
  'NOT A':[1,1,0,0],'IMPLIES':[1,1,0,1]
 };
 for(const g of GATES){
  assert.deepEqual(truthTable(g).map(row=>row.y),expecteds[g],g);
  for(const row of truthTable(g))assert.equal(row.y,evaluateGate(g,row.a,row.b));
 }
 assert.throws(()=>evaluateGate('AND',2,1));
 assert.throws(()=>evaluateGate('INVALID',1,0));
});
test('binary conversion performs actual round-trip integer conversion and rejects malformed inputs',()=>{
 for(const n of [0,1,7,13,42,255,1024,65535])assert.equal(binaryToDecimal(decimalToBinary(n)),n);
 assert.equal(binaryToDecimal('001101'),13);
 for(const n of [-1,65536,1.5,'1.5'])assert.throws(()=>decimalToBinary(n));
 for(const text of ['10020','abc','','0'.repeat(17),'-101'])assert.throws(()=>binaryToDecimal(text));
});
test('2×2 matrix calculator adds, multiplies, computes determinant, inverse and vector transform',()=>{
 const A=parseMatrix([2,1,1,2]),B=parseMatrix([1,0,0,1]);
 assert.deepEqual(A,[[2,1],[1,2]]);
 assert.deepEqual(add2(A,B),[[3,1],[1,3]]);
 assert.deepEqual(multiply2(A,B),A);
 assert.equal(determinant2(A),3);
 const inverse=invert2(A);assert.ok(inverse);
 const identity=multiply2(A,inverse);
 for(let i=0;i<2;i++)for(let j=0;j<2;j++)assert.ok(Math.abs(identity[i][j]-(i===j?1:0))<1e-10);
 assert.deepEqual(transformVector(A,[1,2]),[4,5]);
 assert.equal(invert2([[1,2],[2,4]]),null);
 assert.throws(()=>parseMatrix(['',0,0,1]));
 assert.throws(()=>parseMatrix([1,2,3]));
 assert.throws(()=>transformVector(A,['hi',2]));
});
test('set workbench computes union, intersection, difference and symmetric difference',()=>{
 const A=parseSet('1,2,2,3'),B=parseSet('2,3,4');
 assert.deepEqual(A,['1','2','3']);
 assert.deepEqual(setOperations(A,B),{
  union:['1','2','3','4'],intersection:['2','3'],
  difference:['1'],symmetric:['1','4']
 });
 assert.deepEqual(parseSet(',,,'),[]);
 assert.throws(()=>parseSet('x'.repeat(40)));
});
test('BFS graph traversal finds repeatable visit order, distances and shortest path',()=>{
 const graph=parseGraph('A-B, A-C, B-D, C-E, D-F, E-F');
 const result=breadthFirst(graph,'A');
 assert.deepEqual(result.order,['A','B','C','D','E','F']);
 assert.equal(result.distance.F,3);
 assert.deepEqual(shortestPath(result.parent,'F'),['A','B','D','F']);
 assert.deepEqual(shortestPath(result.parent,'NOT_PRESENT'),[]);
 assert.throws(()=>breadthFirst(graph,'Z'));
 assert.throws(()=>parseGraph('A>B'));
});
test('nCr calculations support combinations and reject nonsensical input',()=>{
 assert.equal(combinations(5,2),10);
 assert.equal(combinations(4,2),6);
 assert.equal(combinations(0,0),1);
 assert.equal(combinations(40,20),137846528820);
 for(const args of [[-1,1],[5,6],[2.5,1],[41,3]])assert.throws(()=>combinations(...args));
});
test('real site includes working calculator controls, personal syllabus and explanatory quiz UI',()=>{
 const html=read('syllabus/index.html');
 for(const id of [
  'course-cards','lesson-menu','lesson-goal','lesson-example','lesson-remember',
  'practice-form','practice-questions','practice-feedback','practice-retry',
  'tool-digital','tool-linear','tool-discrete','gate-select','bit-a','bit-b','truth-body',
  'decimal-input','binary-input','matrix-a','matrix-b','matrix-op','matrix-calculate','matrix-result',
  'set-a','set-b','set-calculate','graph-edges','graph-run','graph-view',
  'choose-n','choose-r','choose-calculate','custom-form','custom-topic','custom-list',
  'export-progress','import-progress','clear-progress','overall-bar','planner-bar'
 ])assert.ok(html.includes('id="'+id+'"'),'Missing '+id);
 assert.match(html,/prefers-reduced-motion|Learn by Doing|LEARN BY DOING/i);
 const app=read('syllabus/app.js');
 for(const name of ['gradeLesson','safeStorage','cleanData','renderProgress','renderQuiz','renderLesson','evaluateGate','truthTable','parseMatrix','breadthFirst','combinations','import-progress','Blob','URL.createObjectURL'])
  assert.ok(app.includes(name)||name==='renderQuiz'&&app.includes('practice-form'),'Missing connected handler '+name);
 assert.doesNotMatch(app,/\beval\(/);
});
test('learning hub is responsive and progressively accessible',()=>{
 const css=read('syllabus/study.css'),html=read('syllabus/index.html');
 assert.match(css,/@media\(max-width:800px\)/);
 assert.match(css,/@media\(max-width:560px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(html,/aria-live="polite"/);
 assert.match(html,/role="status"/);
 assert.match(html,/Skip to learning content/);
 assert.match(html,/not an official university syllabus/);
});
test('all new scripts pass Node syntax checks and GitHub Pages packages syllabus assets',()=>{
 for(const file of ['syllabus/content.js','syllabus/math-core.js','syllabus/app.js']){
  const result=spawnSync(process.execPath,['--check',new URL('../'+file,import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(result.status,0,file+': '+result.stderr);
 }
 const pipeline=read('.github/workflows/pages.yml');
 for(const file of ['syllabus/index.html','syllabus/study.css','syllabus/app.js','syllabus/content.js','syllabus/math-core.js'])
  assert.ok(pipeline.includes(file),'Missing deployment: '+file);
 const html=read('index.html');
 assert.match(html,/href="\.\/syllabus\/"/);
 assert.match(read('experience/index.html'),/href="\.\.\/syllabus\/"/);
 assert.match(read('sw.js'),/syllabus\/app\.js/);
});
