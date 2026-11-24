import {PARTS,GROUPS,FLOW,QUESTIONS,findPart,partsInGroup,newQuiz,answerQuiz,advanceQuiz,quizScore} from './content.js';
const $=id=>document.getElementById(id);
const q=(selector,root=document)=>[...root.querySelectorAll(selector)];
const safeRead=(name)=>{try{return localStorage.getItem(name);}catch{return null;}};
const safeSave=(name,value)=>{try{localStorage.setItem(name,value);}catch{}};
const STORAGE='pocket3dlab.';
const allIds=new Set(PARTS.map(x=>x.id));
let visited=new Set();
try{const raw=JSON.parse(safeRead(STORAGE+'visited')||'[]');if(Array.isArray(raw))visited=new Set(raw.filter(id=>allIds.has(id)));}catch{}
let group='chambers',selected='right-atrium',quiz=newQuiz(),scene=null,sceneLoading=null;
let showFlow=true;
let reduced=safeRead(STORAGE+'motion')==='paused'||(!safeRead(STORAGE+'motion')&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const fallback={scale:1,rotation:0};
document.body.classList.toggle('reduce-motion',reduced);

function button(text,className='',handler=null){
 const node=document.createElement('button');node.type='button';node.className=className;node.textContent=text;
 if(handler)node.addEventListener('click',handler);
 return node;
}
function syncProgress(){
 const count=visited.size;
 $('discovery-count').replaceChildren(document.createTextNode(String(count)+' '));
 const small=document.createElement('small');small.textContent='/ 13 explored';
 $('discovery-count').append(small);
 $('discovery-bar').style.width=(count/PARTS.length*100)+'%';
}
function createHotspots(){
 const layer=$('heart-hotspots');layer.replaceChildren();
 for(const [i,part] of PARTS.entries()){
  const control=button('', 'hotspot'+(part.side==='Oxygen-rich side'?' red':''),()=>selectPart(part.id));
  control.dataset.part=part.id;control.hidden=true;
  control.setAttribute('aria-label','Explore '+part.name);
  const pin=document.createElement('span');pin.className='hotspot-point';pin.textContent=String(i+1).padStart(2,'0');
  const name=document.createElement('span');name.textContent=part.name;
  control.append(pin,name);layer.append(control);
 }
}
function positionHotspots(items){
 for(const part of items){
  const element=q('.hotspot').find(e=>e.dataset.part===part.id);
  if(!element)continue;
  const info=findPart(part.id);
  element.hidden=!part.visible||info.group!==group;
  if(part.visible){element.style.left=part.x+'px';element.style.top=part.y+'px';}
 }
}
function drawParts(){
 const list=$('part-list');list.replaceChildren();
 partsInGroup(group).forEach((part,index)=>{
  const row=button('', 'part-row'+(part.id===selected?' active':''),()=>selectPart(part.id));
  row.dataset.part=part.id;row.setAttribute('aria-pressed',String(part.id===selected));
  const badge=document.createElement('span');badge.textContent=String(index+1).padStart(2,'0');
  const name=document.createElement('span');name.className='part-row-name';name.textContent=part.name;
  const complete=document.createElement('span');complete.textContent=visited.has(part.id)?'✓':'↗';
  complete.setAttribute('aria-label',visited.has(part.id)?'Explored':'Not yet explored');
  row.append(badge,name,complete);list.append(row);
 });
}
function drawDetail(){
 const part=findPart(selected);if(!part)return;
 const order=partsInGroup(part.group).findIndex(p=>p.id===part.id)+1;
 $('part-category').textContent=part.group.slice(0,-1).toUpperCase()+' · '+String(order).padStart(2,'0');
 $('part-title').textContent=part.name;
 $('part-short').textContent=part.short;
 $('part-description').textContent=part.description;
 $('part-connection').textContent=part.connection;
 $('part-visited').textContent=visited.has(part.id)?'✓ EXPLORED':'TO DISCOVER';
 $('part-visited').classList.toggle('visited',visited.has(part.id));
 q('.hotspot').forEach(el=>el.classList.toggle('active',el.dataset.part===selected));
}
function setGroup(value){
 if(!GROUPS.some(g=>g.id===value))return;
 group=value;
 q('#group-controls [data-group]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.group===value)));
 drawParts();drawDetail();
 q('.hotspot').forEach(el=>{const part=findPart(el.dataset.part);if(part?.group!==group)el.hidden=true;});
 scene?.highlight(selected);
}
function selectPart(id,{mark=true}={}){
 const part=findPart(id);if(!part)return;
 selected=id;
 if(part.group!==group)setGroup(part.group);
 if(mark){visited.add(id);safeSave(STORAGE+'visited',JSON.stringify([...visited]));syncProgress();}
 drawParts();drawDetail();
 scene?.highlight(id);
}
q('#group-controls [data-group]').forEach(btn=>btn.addEventListener('click',()=>{
 const groupPart=partsInGroup(btn.dataset.group);
 // The first member is selected as a preview, not automatically marked explored.
 selected=groupPart[0].id;setGroup(btn.dataset.group);
}));
$('next-part').addEventListener('click',()=>{
 const i=PARTS.findIndex(x=>x.id===selected);
 selectPart(PARTS[(i+1)%PARTS.length].id);
});
function drawFlows(){
 const wrap=$('flow-paths');wrap.replaceChildren();
 for(const flow of FLOW){
  const card=document.createElement('article');card.className='flow-card '+flow.id;
  const header=document.createElement('div');header.className='flow-head';
  const heading=document.createElement('div');const symbol=document.createElement('span');symbol.className='flow-symbol';symbol.textContent=flow.id==='blue'?'↝':'♡';
  const title=document.createElement('div');const h3=document.createElement('h3');h3.textContent=flow.label;
  const sub=document.createElement('p');sub.textContent=flow.kind;
  title.append(h3,sub);heading.append(symbol,title);
  const badge=document.createElement('span');badge.className='flow-type';badge.textContent=flow.id==='blue'?'BODY → LUNGS':'LUNGS → BODY';
  header.append(heading,badge);card.append(header);
  const route=document.createElement('div');route.className='flow-steps';
  flow.steps.forEach((step,index)=>{
   if(index){const arrow=document.createElement('span');arrow.className='step-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';route.append(arrow);}
   if(step.part){
    const control=button(step.label,'',()=>{selectPart(step.part);$('part-title').scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});});
    control.setAttribute('aria-label','Learn about '+step.label);route.append(control);
   }else{
    const text=document.createElement('span');text.className='noninteractive-step';text.textContent=step.label;route.append(text);
   }
  });
  card.append(route);wrap.append(card);
 }
}
function syncMotion(){
 document.body.classList.toggle('reduce-motion',reduced);
 $('motion-toggle').textContent=reduced?'▶ Resume motion':'⏸ Pause motion';
 $('motion-toggle').setAttribute('aria-pressed',String(reduced));
 safeSave(STORAGE+'motion',reduced?'paused':'playing');
 scene?.setMotionPaused(reduced);
}
function syncFlow(){
 $('flow-toggle').textContent=showFlow?'◉ Blood flow on':'○ Blood flow off';
 $('flow-toggle').setAttribute('aria-pressed',String(showFlow));
 document.body.classList.toggle('flow-paused',!showFlow);
 scene?.setFlow(showFlow);
}
$('motion-toggle').addEventListener('click',()=>{reduced=!reduced;syncMotion();});
$('flow-toggle').addEventListener('click',()=>{showFlow=!showFlow;syncFlow();});
$('model-reset').addEventListener('click',()=>{
 if(scene)scene.reset();
 else{fallback.scale=1;fallback.rotation=0;applyFallback();}
 $('model-status').textContent=scene?'Heart model returned to front view.':'Simplified diagram reset.';
});
function applyFallback(){
 const svg=$('heart-fallback').querySelector('svg');
 svg.style.transform='scale('+fallback.scale+') rotate('+fallback.rotation+'deg)';
}
$('model-zoom-in').addEventListener('click',()=>{
 if(scene)scene.zoom(.85);
 else{fallback.scale=Math.min(1.8,fallback.scale+.13);applyFallback();}
});
$('model-zoom-out').addEventListener('click',()=>{
 if(scene)scene.zoom(1.15);
 else{fallback.scale=Math.max(.7,fallback.scale-.13);applyFallback();}
});
async function startModel(){
 if(scene||sceneLoading)return sceneLoading;
 $('model-status').textContent='Preparing the interactive 3D heart…';
 sceneLoading=import('./heart-3d.js').then(m=>m.createHeartScene($('heart-view'),{
  reducedMotion:reduced,onSelect:id=>selectPart(id),onAnchors:positionHotspots,
  onReady:()=>{
   $('heart-fallback').hidden=true;
   $('model-status').textContent='3D model ready. Drag to rotate, scroll or pinch to zoom, or select a label.';
  }
 })).then(instance=>{
  scene=instance;scene.setFlow(showFlow);scene.setMotionPaused(reduced);scene.highlight(selected);return instance;
 }).catch(error=>{
  sceneLoading=null;
  $('model-status').textContent='3D graphics are unavailable right now. The complete anatomy list, circulation routes and quiz still work.';
  $('heart-fallback').hidden=false;
  q('.hotspot').forEach(x=>x.hidden=true);
  return null;
 });
 return sceneLoading;
}
function renderQuiz(){
 const item=QUESTIONS[quiz.index],completed=quiz.answers.length>quiz.index;
 $('quiz-count').textContent='QUESTION '+String(quiz.index+1).padStart(2,'0')+' / 05';
 $('quiz-status').textContent=quiz.answers.length+' of '+QUESTIONS.length+' answered';
 $('quiz-progress-bar').style.width=(quiz.answers.length/QUESTIONS.length*100)+'%';
 if(quiz.finished){
  $('quiz-active').hidden=true;$('quiz-results').hidden=false;
  const total=quizScore(quiz);
  $('quiz-results-title').textContent=total+' out of '+QUESTIONS.length+' — '+(total===5?'A heart expert in the making!':total>=3?'You are getting the hang of it!':'Every discovery starts with a question.');
  $('quiz-results-copy').textContent=(total===5?'You can identify the main structures and trace the blood-flow pathway. ': 'Review the diagram, revisit the chambers and valves, and try again. ')+
   'This score is just for you; no account or public leaderboard is involved.';
  safeSave(STORAGE+'lastScore',String(total));
  return;
 }
 $('quiz-active').hidden=false;$('quiz-results').hidden=true;
 $('quiz-question').textContent=item.question;
 const options=$('quiz-options');options.replaceChildren();
 item.choices.forEach((choice,index)=>{
  const control=button('', 'quiz-option',()=>chooseAnswer(index));control.disabled=completed;
  const letter=document.createElement('span');letter.className='quiz-letter';letter.textContent='ABCD'[index];
  const text=document.createElement('span');text.textContent=choice;
  control.append(letter,text);
  if(completed&&index===item.answer)control.classList.add('correct');
  if(completed&&index===quiz.answers[quiz.index]&&index!==item.answer)control.classList.add('wrong');
  control.setAttribute('aria-label','Answer '+String.fromCharCode(65+index)+': '+choice);
  options.append(control);
 });
 const feedback=$('quiz-feedback');
 feedback.hidden=!completed;
 if(completed){
  const correct=quiz.answers[quiz.index]===item.answer;
  feedback.classList.toggle('wrong',!correct);
  feedback.textContent=(correct?'✓ Exactly right! ':'Not quite—and that is how we learn. ')+item.explain;
 }
 $('quiz-next').hidden=!completed;
 $('quiz-next').textContent=quiz.index===QUESTIONS.length-1?'See your results →':'Next question →';
}
function chooseAnswer(index){
 const result=answerQuiz(quiz,index);
 if(!result.accepted)return;
 quiz=result.state;renderQuiz();
}
$('quiz-next').addEventListener('click',()=>{quiz=advanceQuiz(quiz);renderQuiz();});
$('quiz-restart').addEventListener('click',()=>{
 quiz=newQuiz();renderQuiz();
 document.getElementById('quiz').scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
});
function route(){
 const hash=window.location.hash.replace('#','').trim();
 const page=hash==='teachers'?'teachers':hash==='lesson'||hash==='quiz'||hash==='flow'?'lesson':'home';
 q('.page').forEach(section=>section.hidden=section.id!==page);
 q('.nav a').forEach(link=>{
  if(link.dataset.route===page)link.setAttribute('aria-current','page');
  else link.removeAttribute('aria-current');
 });
 document.title=(page==='home'?'Pocket 3D Lab — Discover the Human Heart':page==='teachers'?'Pocket 3D Lab — For Teachers':'Pocket 3D Lab — Explore the Heart');
 requestAnimationFrame(()=>{
  if(hash==='quiz'||hash==='flow')$(hash).scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
  else window.scrollTo({top:0,behavior:'instant'});
  if(page==='lesson')startModel();
 });
}
window.addEventListener('hashchange',route);
createHotspots();drawParts();drawDetail();drawFlows();syncProgress();syncMotion();syncFlow();renderQuiz();route();
