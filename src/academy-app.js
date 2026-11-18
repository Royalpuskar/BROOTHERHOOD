import {LANGUAGES,LANGUAGE_BY_ID,QUESTIONS,grade,safeQuestionProgress,questionStats} from './academy-content.js';

const $=id=>document.getElementById(id);
if(!$('programming-academy')) throw new Error('Academy HTML controls missing');
const STORAGE_QUESTIONS='brootherhood.academy.questions.v1';
const STORAGE_CODE='brootherhood.academy.code.v1';
function readArray(key,parse){
 try{return parse(localStorage.getItem(key));}catch{return [];}
}
let solved=readArray(STORAGE_QUESTIONS,safeQuestionProgress);
const allTasks=['javascript','python','sql','html','typescript'].flatMap(id=>[0,1,2,3,4].map(i=>id+'-'+i));
let codePassed=readArray(STORAGE_CODE,raw=>{
 try{const v=JSON.parse(raw);return Array.isArray(v)?[...new Set(v.filter(x=>allTasks.includes(x)))]:[];}catch{return [];}
});
function store(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
function el(tag,props={},value=''){
 const node=document.createElement(tag);
 for(const [key,val] of Object.entries(props)){
  if(key==='className')node.className=val;
  else if(key.startsWith('aria-'))node.setAttribute(key,val);
  else node[key]=val;
 }
 if(value)node.textContent=value;return node;
}
const TASKS={
 javascript:[
  {title:'01 · Variables and arrays',description:'Create an array with 2, 4 and 6. Print Total: 12 using JavaScript.',starter:LANGUAGE_BY_ID.javascript.starter,hint:'reduce can sum an array; console.log("Total:", sum) prints two values.',expected:'Total: 12'},
  {title:'02 · Loops',description:'Add the integers 1 through 5 with a loop. Print 15.',starter:'let sum = 0;\nfor (let i = 1; i <= 5; i++) sum += i;\nconsole.log(sum);',hint:'Initialize sum, loop from 1 to 5, and add each i.',expected:'15'},
  {title:'03 · Conditional decisions',description:'Determine whether 24 is even. Print even using a condition.',starter:'const value = 24;\nif (value % 2 === 0) console.log("even");\nelse console.log("odd");',hint:'The remainder after dividing by 2 is 0 for even numbers.',expected:'even'}
 ],
 typescript:[
  {title:'01 · Types and objects',description:'Define a typed Student object and print BROOTHERHOOD.',starter:LANGUAGE_BY_ID.typescript.starter,hint:'Use type Student = { name: string } and console.log(student.name).',expected:'BROOTHERHOOD'},
  {title:'02 · Typed functions',description:'Write a function with number parameters and print 15.',starter:'function add(a: number, b: number): number { return a + b; }\nconsole.log(add(7,8));',hint:'Parameter types go after colons; the return type follows the closing parenthesis.',expected:'15'},
  {title:'03 · Union types',description:'Use a string | number type and print the number 42.',starter:'let value: string | number = 42;\nconsole.log(value);',hint:'The vertical bar creates a union type.',expected:'42'}
 ],
 python:[
  {title:'01 · Lists and summation',description:'Sum 2, 4, and 6 using Python. Print Total: 12.',starter:LANGUAGE_BY_ID.python.starter,hint:'Use sum(numbers) and print("Total:", result).',expected:'Total: 12'},
  {title:'02 · Python loops',description:'Use a for loop to sum 1 through 5 and print 15.',starter:'total = 0\nfor value in range(1, 6):\n    total += value\nprint(total)',hint:'range(1, 6) includes 1, 2, 3, 4 and 5.',expected:'15'},
  {title:'03 · Python functions',description:'Define a function square and use it to print 49 for input 7.',starter:'def square(number):\n    return number * number\n\nprint(square(7))',hint:'Return number * number, then call square(7).',expected:'49'}
 ],
 sql:[
  {title:'01 · SELECT and WHERE',description:'Find learners scoring at least 80. The sample table contains 3 qualifying rows.',starter:LANGUAGE_BY_ID.sql.starter,hint:'SELECT ... FROM learners WHERE score >= 80',expectedRows:3,expectedNames:['Ada','Grace','Margaret']},
  {title:'02 · Aggregate functions',description:'Find the number of learners in the table. One row should contain the count 5.',starter:'SELECT COUNT(*) AS total_learners FROM learners;',hint:'COUNT(*) counts matching rows.',expectedValue:5},
  {title:'03 · ORDER BY',description:'Show all five learners, with their scores from highest to lowest.',starter:'SELECT name, score FROM learners ORDER BY score DESC;',hint:'Use ORDER BY score DESC to sort from largest to smallest.',expectedRows:5,descending:true,expectedNumbers:[96,90,88,75,67]}
 ],
 html:[
  {title:'01 · Semantic headings',description:'Create a visible h1 heading to welcome a learner.',starter:LANGUAGE_BY_ID.html.starter,hint:'Use an h1 element inside the main page content.',pattern:/<h1(?:\s|>)[\s\S]*?<\/h1>/i},
  {title:'02 · Accessible controls',description:'Create a button with readable text and an associated input label.',starter:'<main>\n  <h1>Join the digital journey</h1>\n  <label for="nickname">Nickname</label>\n  <input id="nickname" type="text">\n  <button type="button">Explore</button>\n</main>',hint:'The label for value must match the input id and a button should contain visible text.',pattern:/<button(?:\s|>)[\s\S]*?<\/button>/i,labelCheck:true},
  {title:'03 · CSS layout',description:'Use CSS Grid to lay out at least two cards.',starter:'<div class="grid"><article>Code Lab</article><article>AI Core</article></div>\n<style>.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}article{padding:20px;background:#153555;color:white}</style>',hint:'display: grid and grid-template-columns create a two-column layout.',pattern:/display\s*:\s*grid/i,gridCheck:true}
 ]
};

// Further guided exercises deepen each executable language beyond its first three examples.
const EXTRA_TASKS={
 javascript:[
  {title:'04 · Functions',description:'Write a reusable function that doubles 9 and prints 18.',starter:'function double(value){return value*2;}\nconsole.log(double(9));',hint:'Return value * 2 from a function and call it with 9.',expected:'18'},
  {title:'05 · Filtering data',description:'Count how many of [60, 85, 95] are at least 80. Print 2.',starter:'const scores=[60,85,95];\nconsole.log(scores.filter(score=>score>=80).length);',hint:'Use array.filter and then read the length of the filtered array.',expected:'2'}
 ],
 python:[
  {title:'04 · Dictionaries',description:'Use a dictionary to get Ada’s score of 96 and print 96.',starter:'scores={"Ada":96,"Grace":90}\nprint(scores["Ada"])',hint:'Python dictionaries are keyed; read scores["Ada"].',expected:'96'},
  {title:'05 · List comprehensions',description:'Count the scores at least 80 from [60,85,95] and print 2.',starter:'scores=[60,85,95]\nprint(len([score for score in scores if score>=80]))',hint:'Use a list comprehension with if score>=80.',expected:'2'}
 ],
 sql:[
  {title:'04 · Multiple WHERE conditions',description:'Find the learner scoring above 80 and learning Python. The result should contain Ada.',starter:"SELECT name, score FROM learners WHERE score > 80 AND language = 'Python';",hint:'Combine conditions with AND in the WHERE clause.',expectedRows:1,expectedNames:['Ada']},
  {title:'05 · Aggregation',description:'Find the maximum score in the sample table. The result should show 96.',starter:'SELECT MAX(score) AS best_score FROM learners;',hint:'Use MAX(score) to find the highest numeric score.',expectedValue:96}
 ],
 html:[
  {title:'04 · Accessible forms',description:'Create a form, a label associated with an input, and a submit button.',starter:'<form>\n <label for="email">Email</label>\n <input id="email" type="email" required>\n <button type="submit">Join</button>\n</form>',hint:'The label for attribute should match the input id, and a form wraps the controls.',pattern:/<form(?:\s|>)[\s\S]*?<\/form>/i,labelCheck:true},
  {title:'05 · Responsive layouts',description:'Add an @media rule that changes the layout at narrow screen widths.',starter:'<div class="layout"><article>Code Lab</article><article>AI Core</article></div>\n<style>.layout{display:grid;grid-template-columns:1fr 1fr;gap:1rem}@media(max-width:600px){.layout{grid-template-columns:1fr}}</style>',hint:'Use @media (max-width: 600px) with CSS rules for the small viewport.',pattern:/@media\s*\(/i}
 ],
 typescript:[
  {title:'04 · Typed interfaces',description:'Create an interface with a label property and print secure.',starter:'interface Mission { label: string; }\nconst mission: Mission = {label:"secure"};\nconsole.log(mission.label);',hint:'Declare interface Mission {label:string} and create an object of that type.',expected:'secure'},
  {title:'05 · Union types and branches',description:'Create a union type success | error and print ready for success.',starter:"type State = 'success' | 'error';\nlet state: State = 'success';\nconsole.log(state === 'success' ? 'ready' : 'retry');",hint:'Use a union type and check which variant was selected.',expected:'ready'}
 ]
};
for(const [id,tasks] of Object.entries(EXTRA_TASKS))TASKS[id].push(...tasks);

const filenames={javascript:'main.js',python:'main.py',sql:'learners.sql',html:'index.html',typescript:'main.ts',java:'Main.java',c:'main.c',cpp:'main.cpp',csharp:'Program.cs',go:'main.go',rust:'main.rs',ruby:'main.rb',php:'index.php',kotlin:'Main.kt',swift:'main.swift',r:'analysis.R',bash:'script.sh',dart:'main.dart',lua:'main.lua',scala:'Main.scala'};
let language='javascript',challenge=0,quizLanguage='javascript',quizIndex=0, activeRun=null,persistentWorkers={};
const codeEl=$('academy-code');
const status=$('academy-runtime-status');
function guide(message){
 $('academy-guide-copy').textContent=message;
 window.dispatchEvent(new CustomEvent('brootherhood:guide',{detail:{world:'code',message}}));
}
function updateScores(){
 const stats=questionStats(solved);
 $('academy-quiz-score').textContent=stats.solved+' / '+stats.total+' solved';
 $('academy-answered').textContent=stats.solved+' of '+stats.total+' questions completed';
 $('academy-percent').textContent=Math.round(stats.solved/stats.total*100)+'%';
 $('academy-code-score').textContent=codePassed.length+' / '+allTasks.length+' guided programs completed';
 const ring=document.querySelector('.academy-ring');
 ring?.style.setProperty('--academy-progress',Math.round(stats.solved/stats.total*100)+'%');
}
function markCodePassed(){
 const key=language+'-'+challenge;
 if(!allTasks.includes(key))return;
 if(!codePassed.includes(key)){codePassed.push(key);store(STORAGE_CODE,codePassed);}
 updateScores();
 guide('Excellent! Your program produced the result expected for this guided coding challenge.');
}
function chooseLanguage(id){
 if(!LANGUAGE_BY_ID[id])return;
 if(activeRun) activeRun.cancel();
 language=id;challenge=0;
 const item=LANGUAGE_BY_ID[id];
 $('academy-language-title').textContent=item.name+' Workbench';
 $('academy-language-subtitle').textContent=item.subject+' · '+(item.mode==='study'?'Source examples and assessed questions. Real compilation requires a separate toolchain.':'Editable programs and genuine browser-based execution.');
 $('academy-filename').textContent=filenames[id];
 $('academy-mode-tag').textContent=item.mode==='study'?'◈ STUDY MODE':item.mode==='html'?'● SANDBOXED PREVIEW':'● REAL '+(item.mode==='sql'?'SQLITE':item.mode.toUpperCase())+' EXECUTION';
 $('academy-mode-tag').classList.toggle('study-mode',item.mode==='study');
 $('academy-run').disabled=item.mode==='study';
 $('academy-run').textContent=item.mode==='study'?'Compiler not connected':item.mode==='html'?'▶ Preview HTML/CSS':'▶ Run program';
 $('academy-editor-mode').textContent=item.mode==='study'?'EDITABLE REFERENCE':'EDITABLE CODE';
 const sel=$('academy-challenge');sel.replaceChildren();
 if(item.mode==='study'){sel.append(el('option',{value:'0'},'Language example & reference'));sel.disabled=true;}
 else {sel.disabled=false;TASKS[id].forEach((task,i)=>sel.append(el('option',{value:String(i)},task.title)));}
 const input=$('academy-quiz-language');input.value=id;quizLanguage=id;quizIndex=0;$('academy-quiz-index').value='0';
 $$('[data-academy-lang]').forEach(btn=>{
  const selected=btn.dataset.academyLang===id;btn.classList.toggle('selected',selected);btn.setAttribute('aria-pressed',String(selected));
 });
 showChallenge();renderQuiz();
}
function showChallenge(){
 const item=LANGUAGE_BY_ID[language];const task=TASKS[language]?.[challenge];
 codeEl.value=task?.starter||item.starter;
 $('academy-challenge-description').textContent=task?.description||item.subject+' reference: the editor is editable and downloadable, but this language requires a compiler/runtime outside the current static website.';
 $('academy-hint').hidden=true;
 $('academy-hint').textContent='';
 $('academy-console').textContent=item.mode==='study'?'Study Mode: code is editable, but this site does not claim to compile '+item.name+'. Choose JavaScript, TypeScript, Python, SQLite, or HTML/CSS for actual running.':'Press Run to execute this exercise, or edit it and experiment.';
 $('academy-sql-result').hidden=true;$('academy-html-preview').hidden=true;
 $('academy-validation').textContent='';
 status.textContent=item.mode==='study'?'STUDY MODE':'READY';
}
$('academy-challenge').addEventListener('change',e=>{challenge=Number(e.target.value)||0;showChallenge();});
$('academy-show-hint').addEventListener('click',()=>{
 const p=$('academy-hint'),task=TASKS[language]?.[challenge];
 p.textContent=task?.hint||'Read the code one line at a time. Identify inputs, operations and output, then answer the questions below.';
 p.hidden=!p.hidden;
});
$('academy-reset').addEventListener('click',showChallenge);
$('academy-code').addEventListener('keydown',event=>{
 if(event.key==='Tab'){event.preventDefault();const start=codeEl.selectionStart,end=codeEl.selectionEnd;codeEl.setRangeText('  ',start,end,'end');}
 if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){event.preventDefault();run();}
});
$('academy-copy').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(codeEl.value);status.textContent='CODE COPIED';}
 catch{status.textContent='COPY UNAVAILABLE';codeEl.focus();codeEl.select();}
});
$('academy-save').addEventListener('click',()=>{
 const blob=new Blob([codeEl.value],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filenames[language];link.click();URL.revokeObjectURL(url);
 status.textContent='FILE SAVED';
});
function resultTable(columns,values){
 const holder=$('academy-sql-result');holder.replaceChildren();
 const table=document.createElement('table');const head=document.createElement('thead');const row=document.createElement('tr');
 columns.forEach(name=>row.append(el('th',{},String(name))));head.append(row);table.append(head);
 const body=document.createElement('tbody');
 values.forEach(cells=>{const tr=document.createElement('tr');cells.forEach(cell=>tr.append(el('td',{},cell===null?'NULL':String(cell))));body.append(tr);});
 table.append(body);holder.append(table);holder.hidden=false;
}
function testResult(output,result){
 const task=TASKS[language]?.[challenge];if(!task||!result.ok)return false;
 if(language==='javascript'||language==='python'||language==='typescript')return String(output).trim().split(/\r?\n/).at(-1)?.trim()===task.expected;
 if(language==='sql'){
  const rows=result.values||[],count=rows.length;
  if(task.expectedValue!==undefined)return rows.length===1&&rows[0].some(x=>x===task.expectedValue);
  if(count!==task.expectedRows)return false;
  if(task.expectedNames){
   const nameIndex=(result.columns||[]).findIndex(name=>String(name).toLowerCase()==='name');
   if(nameIndex<0||rows.map(r=>String(r[nameIndex])).sort().join('|')!==task.expectedNames.slice().sort().join('|'))return false;
  }
  if(task.descending){const numbers=rows.map(r=>Number(r[1]));return numbers.every((n,i)=>i===0||numbers[i-1]>=n)&&(!task.expectedNumbers||numbers.every((n,i)=>n===task.expectedNumbers[i]));}
  return true;
 }
 if(language==='html'){
  if(!task.pattern?.test(codeEl.value))return false;
  if(task.labelCheck){
   const label=/<label[^>]*for\s*=\s*["']([^"']+)["']/i.exec(codeEl.value);
   const field=/<input[^>]*id\s*=\s*["']([^"']+)["']/i.exec(codeEl.value);
   return !!(label&&field&&label[1]===field[1]);
  }
  if(task.gridCheck)return /grid-template-columns\s*:/i.test(codeEl.value);
  return true;
 }
 return false;
}
function sandboxPreview(source){
 const frame=$('academy-html-preview');
 const csp='<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;; style-src &#39;unsafe-inline&#39;; img-src data:; form-action &#39;none&#39;;">';
 frame.srcdoc='<!doctype html><html lang="en"><head><meta charset="utf-8">'+csp+'</head><body>'+source+'</body></html>';
 frame.hidden=false;
}
function makeWorker(mode){
 if(mode==='javascript')return new Worker('./src/code-worker.js',{type:'module'});
 if(mode==='python')return new Worker('./src/academy-python-worker.js');
 if(mode==='typescript')return new Worker('./src/academy-typescript-worker.js');
 if(mode==='sql')return new Worker('./src/academy-sql-worker.js');
 throw new Error('Unsupported execution mode');
}
async function runInWorker(mode,source){
 const timeoutMs=mode==='javascript'?2200:mode==='python'?45000:mode==='typescript'?35000:25000;
 const worker=makeWorker(mode);
 const id=String(Date.now())+'-'+Math.random().toString(36).slice(2);
 return new Promise(resolve=>{
  let finished=false;
  const settle=(result)=>{
   if(finished)return;finished=true;clearTimeout(timer);worker.terminate();activeRun=null;resolve(result);
  };
  activeRun={cancel:()=>settle({ok:false,error:'Run cancelled.'})};
  const timer=setTimeout(()=>settle({ok:false,error:'The runtime exceeded its '+Math.round(timeoutMs/1000)+'-second time limit. It was stopped.'}),timeoutMs);
  worker.onmessage=event=>{if(event.data?.id===id)settle(event.data);};
  worker.onerror=()=>settle({ok:false,error:'The runtime could not load or encountered an execution error.'});
  worker.postMessage({id,source});
 });
}
async function run(){
 if(activeRun)return;
 const mode=LANGUAGE_BY_ID[language].mode;
 if(mode==='study')return;
 const source=codeEl.value;
 if(source.length>7000){$('academy-console').textContent='Please keep programs below 7,000 characters.';return;}
 $('academy-run').disabled=true;status.textContent=mode==='python'?'LOADING PYTHON…':mode==='sql'?'LOADING SQLITE…':mode==='typescript'?'COMPILING TYPESCRIPT…':'RUNNING…';
 $('academy-validation').textContent='';
 $('academy-sql-result').hidden=true;$('academy-html-preview').hidden=true;
 let result={ok:false,error:'Runtime unavailable.'},output='';
 if(mode==='html'){
  sandboxPreview(source);
  result={ok:true,output:'Sandboxed HTML/CSS preview rendered. Scripts and top-level navigation are disabled.'};
 }else{
  try{result=await runInWorker(mode,source);}
  catch(error){result={ok:false,error:String(error?.message||error)};}
 }
 output=result.ok?(result.output||'Program finished.'):'Execution error: '+(result.error||'Unable to run.');
 $('academy-console').textContent=output;
 if(result.ok&&mode==='sql')resultTable(result.columns||[],result.values||[]);
 const passed=testResult(output,result);
 $('academy-validation').textContent=passed?'✓ Guided challenge passed. Your verified accomplishment was saved locally.':result.ok?'Program executed. To complete this challenge, match its stated objective. Edit and try again.':'The runtime did not complete. Check the code or connection; Python, TypeScript, and SQLite require downloading their browser runtimes.';
 $('academy-validation').className=passed?'academy-valid':'academy-notice';
 if(passed)markCodePassed();
 status.textContent=result.ok?'EXECUTION COMPLETE':'RUNTIME ERROR';
 $('academy-run').disabled=mode==='study';activeRun=null;
}
$('academy-run').addEventListener('click',run);
function renderLanguages(filter=''){
 const list=$('academy-language-list');list.replaceChildren();
 const matches=LANGUAGES.filter(item=>item.name.toLowerCase().includes(filter.toLowerCase())||item.subject.toLowerCase().includes(filter.toLowerCase()));
 for(const item of matches){
  const btn=el('button',{type:'button','aria-pressed':String(item.id===language),className:'academy-language'+(item.id===language?' selected':'')});
  btn.dataset.academyLang=item.id;
  const icon=el('span',{className:'academy-lang-symbol'},item.name.slice(0,2).toUpperCase());
  const name=el('span',{className:'academy-lang-name'},item.name);
  const tag=el('small',{},item.mode==='study'?'STUDY':item.mode==='html'?'PREVIEW':'RUN');
  btn.append(icon,name,tag);btn.addEventListener('click',()=>chooseLanguage(item.id));list.append(btn);
 }
 if(!matches.length)list.append(el('p',{},'No languages match this search.'));
}
$('academy-search').addEventListener('input',event=>renderLanguages(event.target.value));
const quizSelector=$('academy-quiz-language');
LANGUAGES.forEach(lang=>quizSelector.append(el('option',{value:lang.id},lang.name)));
quizSelector.addEventListener('change',event=>{quizLanguage=event.target.value;quizIndex=0;$('academy-quiz-index').value='0';renderQuiz();});
$('academy-quiz-index').addEventListener('change',event=>{quizIndex=Number(event.target.value)||0;renderQuiz();});
function renderQuiz(){
 const question=QUESTIONS[quizLanguage]?.[quizIndex];
 if(!question)return;
 $('academy-quiz-prompt').textContent=question.question;
 $('academy-quiz-feedback').textContent=solved.includes(question.id)?'✓ You have already solved this question. Review or try again.':'Choose an option, then check your reasoning.';
 const field=$('academy-quiz-options');field.replaceChildren();
 field.append(el('legend',{},'Choose the correct answer'));
 question.choices.forEach((choice,index)=>{
  const label=el('label',{className:'academy-option'});
  const input=el('input',{type:'radio',name:'academy-choice',value:String(index)});
  label.append(input,document.createTextNode(' '+choice));field.append(label);
 });
 updateScores();
}
$('academy-answer').addEventListener('click',()=>{
 const q=QUESTIONS[quizLanguage][quizIndex];
 const selected=$('academy-quiz-options').querySelector('input:checked');
 const result=grade(q,selected?Number(selected.value):-1);
 if(!result.valid){$('academy-quiz-feedback').textContent='Select an answer to continue.';return;}
 if(result.correct&&!solved.includes(q.id)){solved.push(q.id);store(STORAGE_QUESTIONS,solved);}
 $('academy-quiz-feedback').textContent=(result.correct?'✓ Correct! ':'Not yet. ')+result.explanation;
 $('academy-quiz-feedback').className=result.correct?'academy-quiz-feedback correct':'academy-quiz-feedback retry';
 if(result.correct)guide('Excellent reasoning! '+result.explanation);
 updateScores();
});
$('academy-next-question').addEventListener('click',()=>{
 quizIndex=(quizIndex+1)%QUESTIONS[quizLanguage].length;
 $('academy-quiz-index').value=String(quizIndex);renderQuiz();
});
chooseLanguage('javascript');renderLanguages();updateScores();
