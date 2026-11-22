import {WORLD_META,WORLD_IDS,CODE_TASKS,CYBER_CASES,STARTER_SAMPLES,PACKET_HOPS,
 evaluateCyber,classifyKNN,packetStep,validateArchitecture,normalizeProgress,missionRank,safeCodeResult} from './informatics-core.js';

const $=id=>document.getElementById(id);
const $$=selector=>[...document.querySelectorAll(selector)];
const STORAGE_KEY='brootherhood.informatics.progress.v1';
function stored(){try{return normalizeProgress(localStorage.getItem(STORAGE_KEY));}catch{return [];}}
let completed=stored();
function store(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(completed));}catch{/* private mode */}}
function say(text,world='welcome',success=false){
  $('guide-dialogue').textContent=text;
  window.dispatchEvent(new CustomEvent('brootherhood:guide',{detail:{message:text,world,success}}));
}
function complete(id){
  if(!WORLD_IDS.includes(id))return;
  if(!completed.includes(id)){completed.push(id);store();}
  displayProgress();
  say('Excellent work! You unlocked the '+WORLD_META[id].badge+' achievement.','celebrate',true);
}
function displayProgress(){
 $('progress-count').textContent=completed.length+' / 5';
 $('progress-bar').style.width=(completed.length/5*100)+'%';
 $('progress-rank').textContent=missionRank(completed);
 $('progress-message').textContent=completed.length===5
    ? 'You explored all five Informatics worlds. Keep experimenting, building, and asking questions.'
    : completed.length
      ? 'Great discoveries so far. '+(5-completed.length)+' world(s) remain. Every completed mission counts.'
      : 'Complete a digital mission to unlock your first achievement.';
 const grid=$('achievement-grid');grid.replaceChildren();
 for(const id of WORLD_IDS){
   const box=document.createElement('div');box.className='achievement '+(completed.includes(id)?'unlocked':'locked');
   const icon=document.createElement('span');icon.textContent=WORLD_META[id].icon;icon.setAttribute('aria-hidden','true');
   const title=document.createElement('strong');title.textContent=WORLD_META[id].badge;
   const status=document.createElement('small');status.textContent=completed.includes(id)?'Unlocked ✓':'Not unlocked yet';
   box.append(icon,title,status);grid.append(box);
 }
}
$('clear-progress').addEventListener('click',()=>{
 if(!window.confirm('Reset your five locally saved Informatics achievements?'))return;
 completed=[];store();displayProgress();say('Your local progress has been reset. Every new start is another opportunity to learn.');
});
displayProgress();

// Mobile menu + keyboard friendly anchor navigation.
const menu=$('menu-button');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));$('main-nav').classList.toggle('open',!open);});
$$('#main-nav a').forEach(link=>link.addEventListener('click',()=>{$('main-nav').classList.remove('open');menu.setAttribute('aria-expanded','false');}));
const motionPref=matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle=$('motion-toggle');
let motionPaused=motionPref.matches;
motionToggle.textContent=motionPaused?'Enable 3D motion':'Pause 3D motion';
motionToggle.setAttribute('aria-pressed',String(motionPaused));
motionToggle.addEventListener('click',()=>{
 motionPaused=!motionPaused;
 motionToggle.textContent=motionPaused?'Enable 3D motion':'Pause 3D motion';
 motionToggle.setAttribute('aria-pressed',String(motionPaused));
 window.dispatchEvent(new CustomEvent('brootherhood:motion',{detail:{paused:motionPaused}}));
});
$('guide-wave').addEventListener('click',()=>say('Hello, explorer! Take your time; every question is the beginning of a discovery.','wave'));
const messages={
 code:'Welcome to Code Lab. Write a small JavaScript program and see exactly what it prints.',
 cyber:'Welcome to Cyber Defense Arena. Look for suspicious requests before you respond.',
 ai:'Inside AI Core, you can test how training samples change a classifier result.',
 network:'Follow the packet! DNS, routers, and servers each have different roles.',
 build:'Imagine an app as three connected layers: frontend, API, and database.'
};
for(const [id,section] of Object.entries({code:'code-lab',cyber:'cyber-arena',ai:'ai-core',network:'network-nexus',build:'builders-realm'})){
 const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){say(messages[id],id);observer.disconnect();}},{threshold:.35});observer.observe($(section));
}

// Code Lab uses a fresh dedicated worker for every execution; never evals student code in the page context.
let codeTask='variables',worker=null,runTimer=null;
function cancelCodeRun(){
 clearTimeout(runTimer);runTimer=null;
 if(worker){const stale=worker;worker=null;stale.terminate();}
 $('run-code').disabled=false;
}
function setCodeTask(key){
 cancelCodeRun();
 codeTask=Object.hasOwn(CODE_TASKS,key)?key:'variables';
 const item=CODE_TASKS[codeTask];$('code-task').value=codeTask;
 $('code-editor').value=item.starter;$('code-instruction').textContent=item.description;
 $('code-output').textContent='Run your code to see the result.';
 $('code-feedback').textContent='';$('hint-code').hidden=true;
 say('Code Lab: '+item.description,'code');
}
$('code-task').addEventListener('change',e=>setCodeTask(e.target.value));
$('reset-code').addEventListener('click',()=>setCodeTask(codeTask));
$('code-editor').addEventListener('input',()=>{
 cancelCodeRun();
 $('code-output').textContent='Run your edited code to see the result.';
 $('code-feedback').textContent='';
});
$('run-code').addEventListener('click',()=>{
 const source=$('code-editor').value;
 if(source.length>3500){$('code-feedback').textContent='Use fewer than 3,500 characters for this exercise.';return;}
 cancelCodeRun();
 const expected=CODE_TASKS[codeTask].expected;
 const id=String(Date.now())+Math.random().toString(36).slice(2);
 const button=$('run-code');button.disabled=true;
 $('code-output').textContent='Executing in an isolated worker...';$('code-feedback').textContent='';
 try{worker=new Worker('./src/code-worker.js',{type:'module'});}
 catch{$('code-output').textContent='This browser does not support the Code Lab worker.';button.disabled=false;return;}
 const current=worker;
 const finish=()=>{clearTimeout(runTimer);current.terminate();if(worker===current)worker=null;button.disabled=false;};
 runTimer=setTimeout(()=>{if(worker!==current)return;finish();$('code-output').textContent='Execution timed out after 1.5 seconds. Check for an infinite loop.';},1500);
 current.onmessage=e=>{
  if(worker!==current||e.data?.id!==id)return;
  finish();
  const result=e.data;const output=result.output||'(No console output)';
  $('code-output').textContent=result.ok?output:('Execution error: '+result.error+(result.output?'\n'+output:''));
  const success=result.ok && safeCodeResult(output,expected);
  $('code-feedback').textContent=success?'Mission complete! Your JavaScript printed the expected output.':result.ok?'The program ran, but the last printed value does not match the mission.': 'Edit the program and run it again.';
  $('code-feedback').className='mission-feedback '+(success?'positive':'caution');
  if(success)complete('code');else say('Good experiment. Read the console output, adjust your code, and run again.','code');
 };
 current.onerror=()=>{if(worker!==current)return;finish();$('code-output').textContent='The worker encountered an error. Check browser settings or the code.';};
 current.postMessage({id,source});
});
$$('[data-hint]').forEach(button=>button.addEventListener('click',()=>{
 const id=button.dataset.hint,el=$('hint-'+id);
 if(id==='code')el.textContent=CODE_TASKS[codeTask].hint;
 else if(id==='cyber')el.textContent=CYBER_CASES[$('cyber-scenario').value].hint;
 else el.textContent='kNN compares distances and votes among the nearest training examples. Different examples can change the decision.';
 el.hidden=!el.hidden;
}));

// Cyber Defense is a self-contained, non-networked defensive decision simulation.
function showCyber(){
 const item=CYBER_CASES[$('cyber-scenario').value];
 $('cyber-sender').textContent=item.sender;$('cyber-subject').textContent=item.subject;
 $('cyber-message').textContent=item.body;
 const field=$('cyber-options');
 field.replaceChildren();
 const legend=document.createElement('legend');legend.textContent='Choose your response';field.append(legend);
 for(const choice of item.options){
  const label=document.createElement('label');const input=document.createElement('input');
  input.type='radio';input.name='cyber-answer';input.value=choice.id;
  label.append(input,document.createTextNode(' '+choice.text));field.append(label);
 }
 $('cyber-feedback').textContent='';$('hint-cyber').hidden=true;
}
$('cyber-scenario').addEventListener('change',showCyber);showCyber();
$('cyber-check').addEventListener('click',()=>{
 const selected=document.querySelector('input[name="cyber-answer"]:checked')?.value;
 const r=evaluateCyber($('cyber-scenario').value,selected);
 $('cyber-feedback').textContent=r.feedback;
 $('cyber-feedback').className='mission-feedback '+(r.correct?'positive':'caution');
 if(r.correct)complete('cyber');else say('Examine the warning signs. You can always verify security messages through an official channel.','cyber');
});

// AI: kNN runs real distance and vote calculations on explicitly synthetic data.
let samples=STARTER_SAMPLES.map(p=>({...p}));
function plotSamples(){
 const chart=$('ai-plot');chart.replaceChildren();
 const axis=document.createElement('div');axis.className='sample-axis';axis.textContent='0                                     INPUT FEATURE                                     10';chart.append(axis);
 samples.forEach((sample,i)=>{
  const dot=document.createElement('span');dot.className='sample-dot '+sample.label.toLowerCase();
  dot.style.left=(5+sample.x*9)+'%';dot.style.top=(i%2===0?'31%':'56%');
  dot.title='Example at '+sample.x+', label '+sample.label;
  chart.append(dot);
 });
 const target=document.createElement('div');target.className='sample-target';
 target.style.left=(5+Number($('ai-value').value)*9)+'%';target.textContent='YOU';chart.append(target);
 const legend=document.createElement('div');legend.className='sample-legend';legend.textContent='● Blue examples     ● Green examples     ◆ Sample to classify';chart.append(legend);
}
for(const id of ['ai-value','ai-k'])$(id).addEventListener('input',()=>{
 $('ai-value-label').textContent=$('ai-value').value;
 $('ai-k-label').textContent=$('ai-k').value;plotSamples();
});
$('ai-classify').addEventListener('click',()=>{
 try{
  const x=Number($('ai-value').value),k=Number($('ai-k').value);
  const result=classifyKNN(samples,x,k);
  const success=x===8&&k===3&&result.label==='Green';
  $('ai-feedback').textContent='Result: '+result.label+' ('+result.votes.Blue+' Blue / '+result.votes.Green+' Green votes). Closest values: '+result.neighbors.map(v=>v.x+' '+v.label).join(', ')+'. '+(success?'Mission complete: sample 8 with k=3 is Green.':'Mission: try value 8 with k=3 to verify the predicted class.');
  $('ai-feedback').className='mission-feedback '+(success?'positive':'');
  if(success)complete('ai');
  else say('That result came from the nearest training examples, not a preset animation.','ai');
 }catch(error){$('ai-feedback').textContent=String(error.message);}
});
$('ai-train').addEventListener('click',()=>{
 const x=Number($('ai-value').value),label=x>=5?'Green':'Blue';
 if(samples.length>=13){$('ai-train-info').textContent='The sample limit is reached for this compact demonstration.';return;}
 samples.push({x,label});plotSamples();
 $('ai-train-info').textContent='Added synthetic training example at '+x+' labeled '+label+'. There are now '+samples.length+' training samples.';
 say('You added a training example. Try classifying again and watch how the result may change.','ai');
});
plotSamples();
$('ai-feedback').textContent='Mission: set sample value to 8 and k to 3; classify it and inspect the neighbor votes.';

// Network packet route is a teaching model; never opens a remote socket.
let packetIndex=-1,networkTimer=null;
function showHop(){
 $$('.network-node').forEach(node=>node.classList.toggle('active',Number(node.dataset.hop)===packetIndex));
 const hop=packetStep(packetIndex);
 $('network-log').textContent=hop?('HOP '+(packetIndex+1)+' / '+PACKET_HOPS.length+' — '+hop.name+': '+hop.message):'The packet is waiting at the start.';
}
function nextHop(){packetIndex=Math.min(packetIndex+1,PACKET_HOPS.length-1);showHop();if(packetIndex===3)say('Packet delivered! The server received the simulated request.','network');}
$('network-step').addEventListener('click',()=>{clearInterval(networkTimer);nextHop();});
$('network-send').addEventListener('click',()=>{
 clearInterval(networkTimer);packetIndex=-1;nextHop();
 networkTimer=setInterval(()=>{if(packetIndex>=3){clearInterval(networkTimer);return;}nextHop();if(packetIndex>=3)clearInterval(networkTimer);},650);
});
$('network-reset').addEventListener('click',()=>{clearInterval(networkTimer);packetIndex=-1;showHop();$('network-feedback').textContent='';});
$('network-check').addEventListener('click',()=>{
 const selected=document.querySelector('input[name="network-answer"]:checked')?.value;
 const success=selected==='dns'&&packetIndex===3;
 $('network-feedback').textContent=success?'Mission complete! DNS resolves domain names; routers forward packets; web servers answer requests.':selected!=='dns'?'Try again. DNS connects readable names to IP addresses.':'Correct answer! First trace the packet through all four stages.';
 $('network-feedback').className='mission-feedback '+(success?'positive':'caution');
 if(success)complete('network');else say('Keep following the packet, and notice the distinct responsibility of each node.','network');
});
showHop();

// App architecture builder uses real ordering checks, not visual-only badges.
let buildPath=[];
function showBuild(){
 const list=$('builder-path');list.replaceChildren();
 if(!buildPath.length){const li=document.createElement('li');li.className='builder-empty';li.textContent='No components selected yet';list.append(li);}
 for(const part of buildPath){const li=document.createElement('li');li.textContent=part==='api'?'API service':part.charAt(0).toUpperCase()+part.slice(1);list.append(li);}
 $$('[data-component]').forEach(button=>{button.disabled=buildPath.includes(button.dataset.component)||buildPath.length>=3;});
}
$$('[data-component]').forEach(button=>button.addEventListener('click',()=>{
 if(buildPath.length<3&&!buildPath.includes(button.dataset.component)){buildPath.push(button.dataset.component);showBuild();$('builder-feedback').textContent='';}
}));
$('builder-undo').addEventListener('click',()=>{buildPath.pop();showBuild();$('builder-feedback').textContent='';});
$('builder-reset').addEventListener('click',()=>{buildPath=[];showBuild();$('builder-feedback').textContent='';});
$('builder-check').addEventListener('click',()=>{
 const result=validateArchitecture(buildPath);
 $('builder-feedback').textContent=result.message;$('builder-feedback').className='mission-feedback '+(result.success?'positive':'caution');
 if(result.success)complete('build');else say('An app needs an interface, business logic, and a reliable place for data. Try a different order.','build');
});
showBuild();

// Optional WebGL is not a prerequisite for any mission.
if(!motionPref.matches&&'WebGLRenderingContext' in window){
 const scene=document.querySelector('#universe-canvas');
 const intro=document.querySelector('#home');
 const watcher=new IntersectionObserver(entries=>{
   if(entries[0].isIntersecting){
     import('./digital-scene.js').then(m=>m.startDigitalScene(scene)).catch(()=>{
       document.querySelector('.scene-fallback')?.classList.add('fallback-visible');
     });watcher.disconnect();
   }
 },{rootMargin:'400px'});
 watcher.observe(intro);
}else{
 document.querySelector('.scene-fallback')?.classList.add('fallback-visible');
}


// A versioned offline cache provides a quick revisit without an account.
if('serviceWorker' in navigator && location.protocol==='https:'){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}),{once:true});
}
