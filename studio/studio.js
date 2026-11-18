import {DEFAULT_ENDPOINT,LANGUAGES,BY_ID,TEMPLATES,CHALLENGES,DEFAULT_FILES,
 normalizeEndpoint,chooseRuntime,makeSubmission,interpretResult,gradeOutput,safeFiles} from './core.js';

const $=id=>document.getElementById(id);
const storeKey='brootherhood.studio.project.v1';
const solvedKey='brootherhood.studio.achievements.v1';
const endpointKey='brootherhood.studio.compiler.v1';
const time=()=>new Date().toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit',second:'2-digit'});
let files=loadFiles(),active=0,editor=null,loading=false,runnerController=null,languages=[],connected=false;
let compilerEndpoint=DEFAULT_ENDPOINT;
try{compilerEndpoint=normalizeEndpoint(localStorage.getItem(endpointKey)||DEFAULT_ENDPOINT);}catch{}
const solved=loadSolved();

function loadFiles(){
 try{
  const parsed=safeFiles(localStorage.getItem(storeKey));
  if(parsed.length)return parsed;
 }catch{}
 return DEFAULT_FILES.map(f=>({...f}));
}
function loadSolved(){
 try{
  const parsed=JSON.parse(localStorage.getItem(solvedKey));
  const allowed=new Set(LANGUAGES.flatMap(l=>CHALLENGES.map(p=>l.id+':'+p.id)));
  if(Array.isArray(parsed))return new Set(parsed.filter(x=>allowed.has(x)));
 }catch{}
 return new Set();
}
function persist(){try{localStorage.setItem(storeKey,JSON.stringify(files));}catch{$('editor-status').textContent='Local storage full; download your project.';}}
function persistSolved(){try{localStorage.setItem(solvedKey,JSON.stringify([...solved]));}catch{}}
function node(tag,text='',className=''){
 const element=document.createElement(tag);
 if(text!==undefined)element.textContent=String(text);
 if(className)element.className=className;
 return element;
}
function current(){return files[active];}
function editorGet(){return editor?editor.getValue():$('code-source').value;}
function editorSet(value){
 if(editor)editor.setValue(value);
 else $('code-source').value=value;
 updateLength();
}
function updateLength(){
 $('editor-length').textContent=editorGet().length.toLocaleString()+' chars';
}
function onEdited(){
 if(!current())return;
 current().code=editorGet();
 $('editor-status').textContent='Saved locally · '+time();
 updateLength();persist();
}
function initEditor(){
 const source=$('code-source'),host=$('cm-host');
 if(window.CodeMirror&&host){
  try{
   editor=window.CodeMirror(host,{
    value:current().code,lineNumbers:true,matchBrackets:true,autoCloseBrackets:true,
    lineWrapping:false,indentUnit:4,tabSize:4,indentWithTabs:false,theme:'material-darker',
    mode:BY_ID[current().language]?.mode||'text/plain',
    extraKeys:{'Ctrl-Enter':()=>runProgram(false),'Cmd-Enter':()=>runProgram(false),
      'Ctrl-S':()=>downloadFile(),'Cmd-S':()=>downloadFile(),
      'Tab':cm=>cm.replaceSelection('    ','end')},
    autofocus:false
   });
   editor.on('change',onEdited);
   document.body.classList.add('has-cm');
   const input=editor.getInputField();
   input.setAttribute('aria-label','Source editor for '+current().name);
   source.setAttribute('aria-hidden','true');
  }catch(error){editor=null;document.body.classList.remove('has-cm');}
 }
 if(!editor){
  source.value=current().code;
  source.addEventListener('input',onEdited);
  source.addEventListener('keydown',e=>{
   if(e.key==='Tab'){e.preventDefault();source.setRangeText('    ',source.selectionStart,source.selectionEnd,'end');onEdited();}
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='enter'){e.preventDefault();runProgram(false);}
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();downloadFile();}
  });
 }
 updateLength();
}

function renderFiles(){
 const tree=$('file-tree'),tabs=$('open-tabs');
 tree.replaceChildren();tabs.replaceChildren();
 files.forEach((f,index)=>{
  const row=node('button','','file-row'+(active===index?' active':''));
  row.type='button';row.setAttribute('aria-pressed',String(active===index));
  const badge=node('span',(BY_ID[f.language]?.extension||'src').slice(0,3).toUpperCase(),'file-language-icon');
  row.append(badge,node('span',f.name));row.addEventListener('click',()=>selectFile(index));tree.append(row);
  const tab=node('button','◉ '+f.name,'editor-tab'+(active===index?' active':''));
  tab.type='button';tab.setAttribute('role','tab');tab.setAttribute('aria-selected',String(active===index));
  tab.addEventListener('click',()=>selectFile(index));tabs.append(tab);
 });
 $('file-count').textContent=files.length;
 $('editor-filename').textContent=current().name;
 $('editor-lang').textContent=BY_ID[current().language]?.name||'Source';
 $('language-select').value=current().language;
 $('compiler-select').hidden=!['cpp','c'].includes(current().language);
 const lab=document.querySelector('.compiler-label');if(lab)lab.hidden=$('compiler-select').hidden;
 renderCompilerState();
}
function selectFile(index){
 if(index<0||index>=files.length)return;
 if(current()){current().code=editorGet();persist();}
 active=index;
 editorSet(current().code);
 if(editor){editor.setOption('mode',BY_ID[current().language]?.mode||'text/plain');editor.getInputField().setAttribute('aria-label','Source editor for '+current().name);}
 $('stdin-text').value=TEMPLATES[current().language]?.stdin||'';
 renderFiles();$('editor-status').textContent='Editing '+current().name;
}
function unusedName(base){
 const existing=new Set(files.map(f=>f.name));
 if(!existing.has(base))return base;
 const dot=base.lastIndexOf('.'),stem=dot>0?base.slice(0,dot):base,ext=dot>0?base.slice(dot):'';
 for(let i=2;i<100;i++)if(!existing.has(stem+i+ext))return stem+i+ext;
 return 'program-'+Date.now()+ext;
}
function inferLanguage(name){
 const ext=(name.split('.').pop()||'').toLowerCase();
 const found=LANGUAGES.find(l=>l.extension.toLowerCase()===ext);
 return found?.id||current()?.language||'cpp';
}
function newFile(name,language,starter){
 if(files.length>=25){alert('The project is limited to 25 files to protect your browser storage.');return;}
 const filename=unusedName(name);
 files.push({name:filename,language,code:starter});
 selectFile(files.length-1);persist();
}
function downloadBlob(name,body,type='text/plain;charset=utf-8'){
 const file=new Blob([body],{type}),href=URL.createObjectURL(file);
 const link=document.createElement('a');link.href=href;link.download=name;link.click();
 setTimeout(()=>URL.revokeObjectURL(href),2000);
}
function downloadFile(){if(!current())return;current().code=editorGet();persist();downloadBlob(current().name,current().code);$('editor-status').textContent='Downloaded '+current().name;}
function renderTemplates(){
 const list=$('template-list');list.replaceChildren();
 for(const id of ['cpp','c','java','python','rust','go','javascript','csharp','kotlin','swift']){
  const lang=BY_ID[id],button=node('button',lang.name+' · Starter','template-button');
  button.type='button';button.append(node('small','New '+lang.extension+' file'));
  button.addEventListener('click',()=>newFile('main.'+lang.extension,id,TEMPLATES[id].code));
  list.append(button);
 }
}
function onLanguageChange(){
 const id=$('language-select').value,match=files.findIndex(f=>f.language===id);
 if(match>=0)selectFile(match);
 else newFile('main.'+BY_ID[id].extension,id,TEMPLATES[id].code);
}
function setConnection(mode,message){
 const el=$('connection-state');el.className='connection-state '+mode;
 el.replaceChildren();
 const light=node('i');light.setAttribute('aria-hidden','true');
 el.append(light,document.createTextNode(message));
}
function renderCompilerState(){
 const id=current()?.language;
 if(!connected){setConnection('offline','Compiler unavailable / retry settings');return;}
 const runtime=chooseRuntime(languages,id,$('compiler-select').value);
 if(runtime)setConnection('online',runtime.name);
 else setConnection('offline','No '+(BY_ID[id]?.name||'language')+' compiler on this service');
}
function requestHeaders(){return{'Accept':'application/json'};}
async function fetchJSON(url,options={},signal){
 let response;
 try{
  response=await fetch(url,{...options,signal,mode:'cors',cache:'no-store'});
 }catch(error){
  if(error?.name==='AbortError')throw error;
  throw new Error('Compiler connection failed (offline, CORS blocked, or service unreachable). Try another Judge0 endpoint in Compiler settings.');
 }
 let body;
 try{body=await response.json();}
 catch{throw new Error('Compiler returned an invalid JSON response.');}
 if(!response.ok){
  const message=typeof body?.error==='string'?body.error:typeof body?.message==='string'?body.message:JSON.stringify(body).slice(0,350);
  throw new Error('Compiler API HTTP '+response.status+': '+message);
 }
 return body;
}
async function connectCompiler(){
 if(loading)return;
 const btn=$('btn-check-compiler');btn.disabled=true;
 $('config-result').textContent='Probing language list…';
 setConnection('','Detecting compilers…');
 try{
  compilerEndpoint=normalizeEndpoint($('compiler-endpoint').value);
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),9000);
  try{
   const result=await fetchJSON(compilerEndpoint+'/languages',{headers:requestHeaders()},controller.signal);
   if(!Array.isArray(result)||!result.some(x=>x.id&&x.name))throw Error('Compiler returned no usable languages.');
   languages=result;connected=true;
   $('config-result').textContent='Connected to '+languages.length+' available compiler versions. You can now press Compile & Run.';
   try{localStorage.setItem(endpointKey,compilerEndpoint);}catch{}
  }finally{clearTimeout(timer);}
 }catch(error){
  connected=false;languages=[];
  $('config-result').textContent=String(error.message||error);
 }finally{btn.disabled=false;renderCompilerState();}
}
function updateRunStatus(message){$('run-status').textContent='● '+message;$('editor-status').textContent=message;}
function showDock(tab){
 for(const button of document.querySelectorAll('[data-dock]')){
  const yes=button.dataset.dock===tab;
  button.classList.toggle('selected',yes);
  button.setAttribute('aria-selected',String(yes));
  $('dock-'+button.dataset.dock).hidden=!yes;
 }
}
function executionButtons(busy){
 loading=busy;$('btn-run').disabled=busy;$('btn-test').disabled=busy;
 $('btn-stop').hidden=!busy;
}
function sleep(ms,signal){return new Promise((resolve,reject)=>{
  if(signal.aborted){reject(new DOMException('Cancelled','AbortError'));return;}
  const timer=setTimeout(()=>{signal.removeEventListener('abort',onAbort);resolve();},ms);
  function onAbort(){clearTimeout(timer);signal.removeEventListener('abort',onAbort);reject(new DOMException('Cancelled','AbortError'));}
  signal.addEventListener('abort',onAbort,{once:true});
 });}
async function submitAndPoll({languageId,source,stdin,compilerOptions,signal}){
 const body=makeSubmission(languageId,source,stdin,compilerOptions);
 const create=await fetchJSON(compilerEndpoint+'/submissions?base64_encoded=false&wait=false',{
  method:'POST',headers:{...requestHeaders(),'Content-Type':'application/json'},body:JSON.stringify(body)
 },signal);
 if(typeof create.token!=='string'||!create.token)throw Error('Compiler did not provide a submission token.');
 const token=encodeURIComponent(create.token);
 for(let attempt=0;attempt<32;attempt++){
  await sleep(attempt<3?550:850,signal);
  const result=await fetchJSON(compilerEndpoint+'/submissions/'+token+'?base64_encoded=false&fields=stdout,stderr,compile_output,status,time,memory,exit_code,message',{headers:requestHeaders()},signal);
  const interpreted=interpretResult(result);
  if(!interpreted.queued)return interpreted;
  updateRunStatus('Compiling / executing… '+(attempt+1));
 }
 throw Error('Compiler exceeded the waiting limit. The remote task may still finish.');
}
function displayResult(result){
 $('output-text').textContent=result.stdout||'(No standard output)';
 $('compiler-text').textContent=[result.compile&&'COMPILER DIAGNOSTICS\n'+result.compile,result.stderr&&'RUNTIME / STANDARD ERROR\n'+result.stderr,result.message&&'SYSTEM MESSAGE\n'+result.message].filter(Boolean).join('\n\n')||'No compiler or runtime errors.';
 $('execution-time').textContent=result.time!=null?'Time '+result.time+' s':'Time —';
 $('execution-memory').textContent=result.memory!=null?'Memory '+result.memory+' KB':'Memory —';
 $('execution-exit').textContent=result.exitCode!=null?'Exit '+result.exitCode:'Exit —';
 $('run-status').textContent='● '+result.status;
 if(result.compile||!result.success)showDock('compiler');else showDock('output');
}
function challengeCurrent(){return CHALLENGES.find(p=>p.id===$('problem-select').value)||CHALLENGES[0];}
function drawProblem(){
 const p=challengeCurrent();
 $('problem-title').textContent=p.title;
 $('problem-statement').textContent=p.statement;
 $('problem-input').textContent=p.input||'(none)';
 $('problem-output').textContent=p.output;
 $('problem-hint').textContent=p.hint;
}
function drawProgress(){
 const count=solved.size,max=LANGUAGES.length*CHALLENGES.length;
 $('challenge-progress').textContent=count+' challenges passed across your programming languages';
 $('challenge-bar').style.width=Math.min(100,count/max*100)+'%';
}
function storeChallenge(lang,id){
 const key=lang+':'+id;
 if(solved.has(key))return;
 solved.add(key);persistSolved();drawProgress();
}
async function runProgram(test){
 if(loading)return;
 current().code=editorGet();persist();
 if(!current().code.trim()){$('output-text').textContent='Write some code before running.';showDock('output');return;}
 const runtime=chooseRuntime(languages,current().language,$('compiler-select').value);
 if(!connected||!runtime){
  await connectCompiler();
  if(!connected||!chooseRuntime(languages,current().language,$('compiler-select').value)){
   $('compiler-text').textContent='No working compiler connection for this language.\n\nThis website is hosted as static files and cannot run GCC locally. Open Compiler settings, test the community demo, or connect a CORS-enabled Judge0 server. No result has been fabricated.';
   showDock('compiler');updateRunStatus('Compiler connection unavailable');return;
  }
 }
 const languageId=chooseRuntime(languages,current().language,$('compiler-select').value).id;
 const compileFlags=['cpp','c'].includes(current().language)?$('compiler-options').value.trim():'';
 if(compileFlags&&!/^(?:[-\w=+. ]{1,120})$/.test(compileFlags)){
  $('compiler-text').textContent='Compiler flags may only contain letters, numbers, spaces and common option punctuation.';showDock('compiler');return;
 }
 const controller=new AbortController();runnerController=controller;
 const started=performance.now();
 executionButtons(true);updateRunStatus(test?'Running coding challenge…':'Submitting to real compiler…');
 $('output-text').textContent='Compiling '+current().name+' using '+compilerEndpoint+'…';
 $('compiler-text').textContent='Compiling. Errors will appear here if the compiler reports any.';
 $('test-text').textContent='Test execution started…';
 showDock(test?'tests':'output');
 try{
  const source=current().code;
  const p=challengeCurrent();
  const testCases=test?
    (p.id==='sum'?[{input:'3 4\n',expected:'Sum: 7'},{input:'10 -2\n',expected:'Sum: 8'}]:
     p.id==='even'?[{input:'24\n',expected:'even'},{input:'9\n',expected:'odd'}]:
     p.id==='loop'?[{input:'5\n',expected:'15'},{input:'10\n',expected:'55'}]:
     p.id==='reverse'?[{input:'HELLO\n',expected:'OLLEH'},{input:'CODE\n',expected:'EDOC'}]:
     [{input:p.input,expected:p.output}]):
    [{input:$('stdin-text').value,expected:null}];
  const results=[];
  for(let i=0;i<testCases.length;i++){
   if(controller.signal.aborted)throw new DOMException('Cancelled','AbortError');
   updateRunStatus('Compiler '+(i+1)+'/'+testCases.length+' · '+runtime.name);
   const caseData=testCases[i];
   const result=await submitAndPoll({languageId,source,stdin:caseData.input,compilerOptions:compileFlags,signal:controller.signal});
   results.push({result,passed:result.success&&(caseData.expected===null||gradeOutput(result.stdout,caseData.expected))});
   displayResult(result);
   if(test){
    $('test-text').textContent=results.map((x,index)=>{
     const expected=testCases[index].expected;
     return (x.passed?'✓ PASS':'✗ FAIL')+' · Case '+(index+1)+
      '\nInput: '+JSON.stringify(testCases[index].input.trim())+
      '\nExpected: '+JSON.stringify(expected)+
      '\nActual: '+JSON.stringify(x.result.stdout.trim())+
      (x.result.compile?'\nCompiler error:\n'+x.result.compile.slice(0,450):'');
    }).join('\n\n');
    showDock('tests');
    if(!result.success)break;
   }
  }
  if(test){
   const passed=results.length===testCases.length&&results.every(x=>x.passed);
   if(passed){storeChallenge(current().language,p.id);updateRunStatus('✓ Challenge passed!');}
   else updateRunStatus('Review test results and try again');
   $('test-text').textContent+='\n\n'+(passed?'ALL TEST CASES PASSED. Achievement saved locally.':'Not all test cases passed. Fix the program and run again.');
  }else updateRunStatus('Executed in '+((performance.now()-started)/1000).toFixed(1)+'s');
 }catch(error){
  const cancelled=error?.name==='AbortError';
  const details=cancelled?'Stopped waiting. If the remote compiler already accepted your program, it may still finish on that service.':String(error?.message||error);
  $('compiler-text').textContent=details;
  if(test){$('test-text').textContent='Test did not complete: '+details;showDock('tests');}
  else showDock('compiler');
  updateRunStatus(cancelled?'Run cancelled':'Execution failed');
 }finally{runnerController=null;executionButtons(false);}
}
function init(){
 const selector=$('language-select');
 LANGUAGES.forEach(lang=>{
  const option=node('option',lang.name);option.value=lang.id;selector.append(option);
 });
 $('compiler-endpoint').value=compilerEndpoint;
 CHALLENGES.forEach(problem=>{
  const option=node('option',problem.title+' · '+problem.difficulty);option.value=problem.id;$('problem-select').append(option);
 });
 $('problem-select').addEventListener('change',drawProblem);
 $('btn-load-problem').addEventListener('click',()=>{$('stdin-text').value=challengeCurrent().input;$('editor-status').textContent='Loaded sample input for '+challengeCurrent().title;});
 $('btn-connect').addEventListener('click',()=>{
  const details=$('compiler-configuration');details.open=!details.open;
  if(details.open)$('compiler-endpoint').focus();
 });
 $('btn-check-compiler').addEventListener('click',connectCompiler);
 $('btn-reset-endpoint').addEventListener('click',()=>{$('compiler-endpoint').value=DEFAULT_ENDPOINT;connectCompiler();});
 selector.addEventListener('change',onLanguageChange);
 $('compiler-select').addEventListener('change',renderCompilerState);
 $('btn-run').addEventListener('click',()=>runProgram(false));
 $('btn-test').addEventListener('click',()=>runProgram(true));
 $('btn-stop').addEventListener('click',()=>{runnerController?.abort();});
 $('btn-clear').addEventListener('click',()=>{$('output-text').textContent='Output cleared.';$('compiler-text').textContent='Compiler messages cleared.';$('test-text').textContent='Test results cleared.';});
 document.querySelectorAll('[data-dock]').forEach(button=>button.addEventListener('click',()=>showDock(button.dataset.dock)));
 $('btn-new').addEventListener('click',()=>{
  const defaultName=unusedName('main.'+BY_ID[current().language].extension);
  const name=prompt('Choose a filename with extension (e.g. main2.cpp):',defaultName);
  if(name===null)return;
  if(!/^[\w.-]{1,80}$/.test(name)){alert('Use letters, numbers, underscores, hyphens and periods.');return;}
  if(files.some(f=>f.name===name)){alert('That filename already exists.');return;}
  const lang=inferLanguage(name);newFile(name,lang,TEMPLATES[lang]?.code||'');
 });
 $('btn-rename').addEventListener('click',()=>{
  const name=prompt('Rename source file:',current().name);
  if(name===null)return;
  if(!/^[\w.-]{1,80}$/.test(name)||files.some((f,i)=>i!==active&&f.name===name)){alert('Invalid or duplicate filename.');return;}
  current().name=name;current().language=inferLanguage(name);renderFiles();persist();
 });
 $('btn-delete').addEventListener('click',()=>{
  if(files.length<=1){alert('Keep at least one source file.');return;}
  if(!confirm('Delete '+current().name+' from this browser project?'))return;
  files.splice(active,1);active=Math.max(0,active-1);
  // selectFile must not save the deleted file's editor content.
  editorSet(files[active].code);renderFiles();persist();
 });
 $('btn-copy').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(editorGet());$('editor-status').textContent='Copied code to clipboard';}
  catch{$('editor-status').textContent='Clipboard access unavailable; select the text to copy.';}
 });
 $('btn-download').addEventListener('click',downloadFile);
 $('btn-export').addEventListener('click',()=>{current().code=editorGet();persist();downloadBlob('brootherhood-project.json',JSON.stringify({version:1,files},null,2),'application/json;charset=utf-8');});
 $('project-import').addEventListener('change',async event=>{
  const uploaded=event.target.files?.[0];if(!uploaded)return;
  if(uploaded.size>850000){alert('Project file too large.');return;}
  try{
   const data=JSON.parse(await uploaded.text());
   const parsed=safeFiles(JSON.stringify(data.files));
   if(!parsed.length)throw Error('No valid source files in this project.');
   if(!confirm('Replace your locally saved project with the imported files?'))return;
   files=parsed;active=0;editorSet(current().code);renderFiles();persist();
  }catch(error){alert('Unable to import project: '+error.message);}
  finally{event.target.value='';}
 });
 $('btn-reset').addEventListener('click',()=>{
  if(!confirm('Restore this file to the starter template? Your current content will be replaced.'))return;
  editorSet(TEMPLATES[current().language]?.code||'');onEdited();
 });
 renderTemplates();
 initEditor();
 renderFiles();drawProblem();drawProgress();
 $('stdin-text').value=TEMPLATES[current().language]?.stdin||'';
 connectCompiler();
}
init();
