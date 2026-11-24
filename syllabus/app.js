import {COURSES,ALL_LESSONS,getCourse,getLesson,gradeLesson,lessonKey,quizTotal} from './content.js';
import {GATES,evaluateGate,truthTable,decimalToBinary,binaryToDecimal,parseMatrix,add2,multiply2,determinant2,invert2,transformVector,parseSet,setOperations,parseGraph,breadthFirst,shortestPath,combinations} from './math-core.js';
const $=id=>document.getElementById(id);
const q=(selector,root=document)=>[...root.querySelectorAll(selector)];
const STORAGE='brootherhood.study.v1';
const keys=new Set(ALL_LESSONS.map(x=>lessonKey(x.courseId,x.id)));
const safeStorage={
 read(){try{const raw=localStorage.getItem(STORAGE);return raw?JSON.parse(raw):null;}catch{return null;}},
 write(value){try{localStorage.setItem(STORAGE,JSON.stringify(value));}catch{}}
};
let data={mastered:[],custom:[],course:'digital',lesson:'binary'};
function cleanData(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const mastered=Array.isArray(value.mastered)?[...new Set(value.mastered.filter(x=>typeof x==='string'&&keys.has(x)))]:[];
 const custom=Array.isArray(value.custom)?value.custom.slice(0,60).filter(x=>x&&typeof x==='object'&&typeof x.text==='string'&&x.text.trim().length<=100&&x.text.trim().length>0).map((x,i)=>({
  id:String(x.id||'topic-'+i).slice(0,70),text:x.text.trim(),done:x.done===true
 })): [];
 const course=getCourse(value.course)?value.course:'digital';
 const lesson=getLesson(course,value.lesson)?value.lesson:getCourse(course).lessons[0].id;
 return{mastered,custom,course,lesson};
}
data=cleanData(safeStorage.read())||data;
const save=()=>safeStorage.write(data);
const noMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToSection=id=>$(id)?.scrollIntoView({behavior:noMotion()?'instant':'smooth',block:'start'});
function el(tag,className,text){
 const n=document.createElement(tag);if(className)n.className=className;
 if(text!==undefined)n.textContent=String(text);return n;
}
const put=(id,value)=>{$(id).textContent=String(value);};
const format=n=>{
 if(!Number.isFinite(n))return String(n);
 return Math.abs(n)<1e-10?'0':String(Number(n.toFixed(6)));
};
function renderProgress(){
 const count=data.mastered.length,customDone=data.custom.filter(x=>x.done).length;
 put('metric-complete',count);put('overall-count',count+' / '+ALL_LESSONS.length);
 $('overall-bar').style.width=(count/ALL_LESSONS.length*100)+'%';
 const total=ALL_LESSONS.length+data.custom.length,done=count+customDone;
 const percentage=total?Math.round(done/total*100):0;
 put('planner-progress',percentage+'%');
 $('planner-bar').style.width=percentage+'%';
 put('planner-details',count+' of '+ALL_LESSONS.length+' roadmap lessons mastered; '+customDone+' of '+data.custom.length+' personal topics completed. Get full marks on a two-question check to master a lesson.');
 renderCourses(false);
}
function renderCourses(shouldRerenderLesson=true){
 const box=$('course-cards');box.replaceChildren();
 for(const course of COURSES){
  const complete=course.lessons.filter(l=>data.mastered.includes(lessonKey(course.id,l.id))).length;
  const control=el('button','course-card');
  control.type='button';control.style.setProperty('--subject-accent',course.color);
  control.setAttribute('aria-pressed',String(data.course===course.id));
  control.setAttribute('aria-label',course.title+', '+complete+' of '+course.lessons.length+' concepts mastered. Open course.');
  const top=el('div','course-card-top'),icon=el('span','course-icon',course.symbol),tag=el('span','course-card-tag',course.tag.toUpperCase());
  top.append(icon,tag);
  const head=el('h3','',course.title),intro=el('p','',course.intro);
  const foot=el('div','course-card-footer');
  foot.append(el('span','',complete+' / '+course.lessons.length+' mastered'),el('i','','↗'));
  control.append(top,head,intro,foot);
  control.addEventListener('click',()=>selectCourse(course.id,{scroll:true}));
  box.append(control);
 }
 if(shouldRerenderLesson)renderLesson();
}
function selectCourse(id,{scroll=false}={}){
 const course=getCourse(id);if(!course)return;
 data.course=id;
 data.lesson=course.lessons[0].id;
 save();renderCourses();
 if(scroll)scrollToSection('lesson');
}
function selectLesson(id){
 if(!getLesson(data.course,id))return;
 data.lesson=id;save();renderLesson();
 scrollToSection('lesson');
}
function renderLesson(){
 const course=getCourse(data.course)||COURSES[0],lesson=getLesson(course.id,data.lesson)||course.lessons[0];
 if(!lesson)return;
 put('lesson-course-label',course.title.toUpperCase()+' / EASY LEARNING');
 put('lesson-title',course.title+' · Learn one thing at a time');
 put('lesson-course-title',course.title);
 const menu=$('lesson-menu');menu.replaceChildren();
 for(const [i,l] of course.lessons.entries()){
  const done=data.mastered.includes(lessonKey(course.id,l.id));
  const button=el('button','lesson-menu-btn');
  button.type='button';button.setAttribute('aria-pressed',String(lesson.id===l.id));
  button.append(el('span','',done?'✓':String(i+1).padStart(2,'0')),el('strong','',l.title));
  button.addEventListener('click',()=>selectLesson(l.id));
  menu.append(button);
 }
 const order=course.lessons.findIndex(x=>x.id===lesson.id);
 put('lesson-step','LESSON '+String(order+1).padStart(2,'0')+' / '+String(course.lessons.length).padStart(2,'0'));
 put('lesson-state',data.mastered.includes(lessonKey(course.id,lesson.id))?'✓ MASTERED':'PRACTICE TO MASTER');
 put('lesson-heading',lesson.title);put('lesson-goal',lesson.goal);
 put('lesson-explanation',lesson.explanation);put('lesson-example',lesson.example);
 put('lesson-remember',lesson.remember);
 const toolButton=$('lesson-open-tool');
 toolButton.textContent=['digital','linear','discrete'].includes(course.id)?'Try the '+course.tool+' →':'Review related learning tools →';
 const quiz=$('practice-questions');quiz.replaceChildren();
 lesson.questions.forEach((question,qi)=>{
  const card=el('fieldset','practice-question');
  const legend=el('legend','',String(qi+1)+'. '+question.question);
  card.append(legend);
  question.choices.forEach((text,i)=>{
   const label=el('label','practice-choice');
   const radio=el('input');
   radio.type='radio';radio.name='practice-'+qi;radio.value=String(i);
   const val=el('span','',String.fromCharCode(65+i)+'. '+text);
   label.append(radio,val);card.append(label);
  });
  quiz.append(card);
 });
 $('practice-feedback').hidden=true;$('practice-feedback').replaceChildren();
 $('practice-retry').hidden=true;$('practice-check').disabled=false;
}
$('lesson-open-tool').addEventListener('click',()=>{
 const tools=['digital','linear','discrete'];
 selectTool(tools.includes(data.course)?data.course:'digital');
 scrollToSection('workspace');
});
$('lesson-next').addEventListener('click',()=>{
 const courseIndex=COURSES.findIndex(x=>x.id===data.course);
 const course=COURSES[courseIndex],i=course.lessons.findIndex(x=>x.id===data.lesson);
 if(i<course.lessons.length-1)selectLesson(course.lessons[i+1].id);
 else selectCourse(COURSES[(courseIndex+1)%COURSES.length].id,{scroll:true});
});
$('practice-form').addEventListener('submit',event=>{
 event.preventDefault();
 const course=getCourse(data.course),lesson=getLesson(data.course,data.lesson);
 const answers=lesson.questions.map((q,i)=>{
  const checked=document.querySelector('input[name="practice-'+i+'"]:checked');
  return checked?Number(checked.value):null;
 });
 if(answers.some(x=>x===null)){
  const feedback=$('practice-feedback');feedback.hidden=false;
  feedback.replaceChildren(el('strong','','Choose an answer for each question before checking.'));
  return;
 }
 const grade=gradeLesson(data.course,data.lesson,answers);
 if(!grade)return;
 const passed=grade.score===grade.total;
 const feedback=$('practice-feedback');feedback.hidden=false;feedback.replaceChildren();
 feedback.append(el('strong','',passed?'✓ Perfect! '+grade.score+'/'+grade.total+' — lesson mastered.':
  grade.score+'/'+grade.total+' correct — review the explanations and try again.'));
 grade.feedback.forEach((item,i)=>{
  feedback.append(el('p','',(item.correct?'✓ Correct. ':'Not yet. ')+item.explanation));
 });
 if(passed&&!data.mastered.includes(lessonKey(course.id,lesson.id))){
  data.mastered.push(lessonKey(course.id,lesson.id));save();
  renderProgress();put('lesson-state','✓ MASTERED');
  q('.lesson-menu-btn')[course.lessons.findIndex(x=>x.id===lesson.id)]?.firstElementChild?.replaceChildren('✓');
 }
 $('practice-check').disabled=true;$('practice-retry').hidden=false;
 q('#practice-questions input').forEach(input=>input.disabled=true);
});
$('practice-retry').addEventListener('click',()=>renderLesson());
const toolButtons=q('[data-tool]');
function selectTool(id){
 if(!['digital','linear','discrete'].includes(id))return;
 toolButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tool===id)));
 for(const panel of ['digital','linear','discrete'])$('tool-'+panel).hidden=id!==panel;
}
toolButtons.forEach(button=>button.addEventListener('click',()=>selectTool(button.dataset.tool)));
// DIGITAL SYSTEMS
const gateHints={
 'AND':'AND is 1 only when both bits are 1.',
 'OR':'OR is 1 when at least one bit is 1.',
 'XOR':'XOR is 1 when exactly one input bit is 1.',
 'NAND':'NAND is the opposite of AND.',
 'NOR':'NOR is the opposite of OR.',
 'XNOR':'XNOR is 1 when the two inputs match.',
 'NOT A':'NOT A flips bit A; B is ignored.',
 'IMPLIES':'A→B is 0 only when A=1 and B=0.'
};
const bits={a:0,b:0};
function updateGate(){
 const gate=$('gate-select').value;
 put('gate-symbol',gate);put('gate-output',evaluateGate(gate,bits.a,bits.b));
 put('gate-help',gateHints[gate]);put('truth-head',gate);
 const body=$('truth-body');body.replaceChildren();
 for(const {a,b,y} of truthTable(gate)){
  const row=el('tr');
  if(a===bits.a&&b===bits.b)row.className='active';
  for(const v of [a,b,y])row.append(el('td','',v));
  body.append(row);
 }
 for(const key of ['a','b']){
  const button=$('bit-'+key);button.textContent=bits[key];
  button.setAttribute('aria-pressed',String(bits[key]===1));
 }
 $('bit-b').disabled=gate==='NOT A';
}
for(const key of ['a','b'])$('bit-'+key).addEventListener('click',()=>{bits[key]=1-bits[key];updateGate();});
$('gate-select').addEventListener('change',updateGate);
$('decimal-input').addEventListener('input',()=>{
 try{
  const binary=decimalToBinary($('decimal-input').value);
  $('binary-input').value=binary;put('binary-status',Number($('decimal-input').value)+'₁₀ = '+binary+'₂');
 }catch(e){put('binary-status',e.message);}
});
$('binary-input').addEventListener('input',()=>{
 try{
  const decimal=binaryToDecimal($('binary-input').value);
  $('decimal-input').value=String(decimal);put('binary-status',$('binary-input').value+'₂ = '+decimal+'₁₀');
 }catch(e){put('binary-status',e.message);}
});
// LINEAR ALGEBRA
$('matrix-op').addEventListener('change',()=>{
 $('vector-inputs').hidden=$('matrix-op').value!=='vector';
 $('vector-view').hidden=true;
});
const SVGNS='http://www.w3.org/2000/svg';
function svg(tag,attrs={}){
 const node=document.createElementNS(SVGNS,tag);
 for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));
 return node;
}
function vectorPlot(source,result){
 const grid=$('vector-grid'),arrows=$('vector-arrows');grid.replaceChildren();arrows.replaceChildren();
 const max=Math.max(4,...source.map(Math.abs),...result.map(Math.abs));
 const scale=Math.min(80,100/max);
 const cx=180,cy=125;
 for(let i=-5;i<=5;i++){
  const x=cx+i*scale,y=cy+i*scale;
  if(x>=0&&x<=360)grid.append(svg('line',{x1:x,y1:0,x2:x,y2:250,stroke:i===0?'#81b3ca':'#264e69','stroke-width':i===0?1.5:.65}));
  if(y>=0&&y<=250)grid.append(svg('line',{x1:0,y1:y,x2:360,y2:y,stroke:i===0?'#81b3ca':'#264e69','stroke-width':i===0?1.5:.65}));
 }
 for(const [v,color,name] of [[source,'#84e6f4','Original'],[result,'#caff95','Transformed']]){
  const x=cx+v[0]*scale,y=cy-v[1]*scale;
  arrows.append(svg('line',{x1:cx,y1:cy,x2:x,y2:y,stroke:color,'stroke-width':3.5,'stroke-linecap':'round'}));
  arrows.append(svg('circle',{cx:x,cy:y,r:5,fill:color}));
  const label=svg('text',{x:Math.max(7,Math.min(295,x+8)),y:Math.max(15,Math.min(240,y-8)),fill:color,'font-size':12});
  label.textContent=name;arrows.append(label);
 }
 $('vector-view').hidden=false;
}
function runMatrix(){
 const display=$('matrix-result');
 try{
  const A=parseMatrix(q('#matrix-a input').map(x=>x.value));
  const B=parseMatrix(q('#matrix-b input').map(x=>x.value));
  const operation=$('matrix-op').value;
  const matrixText=m=>m.map(row=>'[ '+row.map(format).join('   ')+' ]').join('\n');
  $('vector-view').hidden=true;
  let result;
  if(operation==='add')result='A + B =\n'+matrixText(add2(A,B));
  else if(operation==='multiply')result='A × B =\n'+matrixText(multiply2(A,B));
  else if(operation==='det')result='det(A) = '+format(determinant2(A));
  else if(operation==='inverse'){
   const inverse=invert2(A);
   result=inverse?'A⁻¹ =\n'+matrixText(inverse):'Matrix A is singular (determinant 0), so it has no inverse.';
  }else if(operation==='vector'){
   const v=[$('vector-x').value,$('vector-y').value];
   const transformed=transformVector(A,v);
   result='A × ('+v.join(', ')+') = ('+transformed.map(format).join(', ')+')';
   vectorPlot(v.map(Number),transformed);
  }else result='Unknown operation.';
  display.textContent=result;
 }catch(error){display.textContent='Check your inputs: '+error.message;$('vector-view').hidden=true;}
}
$('matrix-calculate').addEventListener('click',runMatrix);
// DISCRETE MATHEMATICS
$('set-calculate').addEventListener('click',()=>{
 try{
  const A=parseSet($('set-a').value),B=parseSet($('set-b').value),r=setOperations(A,B);
  const fmt=x=>'{'+x.join(', ')+'}';
  put('set-result','A ∪ B = '+fmt(r.union)+'\nA ∩ B = '+fmt(r.intersection)+'\nA − B = '+fmt(r.difference)+'\nSymmetric diff = '+fmt(r.symmetric));
 }catch(e){put('set-result',e.message);}
});
function renderGraph(graph,result){
 const view=$('graph-view');view.replaceChildren();
 const nodes=[...graph.keys()].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
 const positions={};for(const [i,node] of nodes.entries()){
  const a=-Math.PI/2+i*2*Math.PI/nodes.length;
  positions[node]=[190+130*Math.cos(a),120+86*Math.sin(a)];
 }
 const drawn=new Set();
 for(const [node,neighbors] of graph.entries())for(const neighbor of neighbors){
  const k=[node,neighbor].sort().join(':');if(drawn.has(k))continue;drawn.add(k);
  const [x1,y1]=positions[node],[x2,y2]=positions[neighbor];
  view.append(svg('line',{x1,y1,x2,y2,stroke:'#6cb7d0','stroke-width':2}));
 }
 for(const node of nodes){
  const [x,y]=positions[node];
  const circle=svg('circle',{cx:x,cy:y,r:19,fill:Object.hasOwn(result.distance,node)?'#216e76':'#24384d',stroke:'#b5e9d3','stroke-width':2});
  const label=svg('text',{x,y:y+5,'text-anchor':'middle',fill:'#fff','font-size':14,'font-weight':800});label.textContent=node;
  view.append(circle,label);
 }
}
$('graph-run').addEventListener('click',()=>{
 try{
  const graph=parseGraph($('graph-edges').value),start=$('graph-start').value;
  const result=breadthFirst(graph,start);
  put('graph-result','BFS visit order: '+result.order.join(' → ')+'\nDistances: '+Object.entries(result.distance).map(([k,v])=>k+'='+v).join(', '));
  renderGraph(graph,result);
 }catch(e){put('graph-result',e.message);$('graph-view').replaceChildren();}
});
$('choose-calculate').addEventListener('click',()=>{
 try{
  const n=Number($('choose-n').value),r=Number($('choose-r').value);
  put('choose-result','C('+n+','+r+') = '+combinations(n,r).toLocaleString('en-US')+' ways to choose '+r+' from '+n+' (order does not matter).');
 }catch(e){put('choose-result',e.message);}
});
// PERSONAL SYLLABUS
const customList=$('custom-list');
function renderCustom(){
 customList.replaceChildren();
 put('custom-count',data.custom.length+' '+(data.custom.length===1?'topic':'topics'));
 if(!data.custom.length){
  customList.append(el('p','empty-custom','No personal topics yet. Add a topic from your course outline above.'));return;
 }
 data.custom.forEach(topic=>{
  const row=el('div','custom-item'+(topic.done?' completed':''));
  const checkbox=el('input');checkbox.type='checkbox';checkbox.checked=topic.done;
  checkbox.id='personal-'+topic.id;checkbox.setAttribute('aria-label','Completed: '+topic.text);
  checkbox.addEventListener('change',()=>{topic.done=checkbox.checked;save();renderCustom();renderProgress();});
  const label=el('label','',topic.text);label.htmlFor=checkbox.id;
  const remove=el('button','','×');remove.type='button';remove.setAttribute('aria-label','Remove '+topic.text);
  remove.addEventListener('click',()=>{data.custom=data.custom.filter(x=>x.id!==topic.id);save();renderCustom();renderProgress();});
  row.append(checkbox,label,remove);customList.append(row);
 });
}
$('custom-form').addEventListener('submit',e=>{
 e.preventDefault();const input=$('custom-topic'),text=input.value.trim();
 if(!text||data.custom.length>=60){input.setCustomValidity(data.custom.length>=60?'Maximum of 60 personal topics reached.':'Enter a topic.');input.reportValidity();return;}
 input.setCustomValidity('');
 data.custom.push({id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,8),text,done:false});
 input.value='';save();renderCustom();renderProgress();
});
$('custom-topic').addEventListener('input',e=>e.target.setCustomValidity(''));
$('export-progress').addEventListener('click',()=>{
 const payload={format:'brootherhood-study-v1',exportedAt:new Date().toISOString(),...data};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);
 const link=el('a');link.href=url;link.download='brootherhood-my-syllabus.json';document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
});
$('import-progress').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 if(file.size>200000){alert('Use a syllabus JSON file smaller than 200 KB.');e.target.value='';return;}
 try{
  const raw=JSON.parse(await file.text());
  if(raw.format!=='brootherhood-study-v1')throw new Error('This file is not a BROOTHERHOOD Study Lab export.');
  const clean=cleanData(raw);
  if(!clean)throw new Error('Invalid progress data.');
  data=clean;save();renderCustom();renderProgress();renderLesson();
  alert('Your local syllabus and study progress were imported.');
 }catch(error){alert('Could not import this file: '+error.message);}
 e.target.value='';
});
$('clear-progress').addEventListener('click',()=>{
 if(!confirm('Reset all local mastered lessons and personal topics on this device? Export a backup first if needed.'))return;
 data={mastered:[],custom:[],course:'digital',lesson:'binary'};
 save();renderCustom();renderProgress();renderLesson();selectTool('digital');
});
put('total-course-count',String(COURSES.length).padStart(2,'0'));
put('total-lesson-count',String(ALL_LESSONS.length).padStart(2,'0'));
put('total-question-count',String(quizTotal).padStart(2,'0'));
renderCustom();renderProgress();renderLesson();updateGate();runMatrix();
$('set-calculate').click();$('graph-run').click();$('choose-calculate').click();
