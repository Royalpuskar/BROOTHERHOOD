import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {LANGUAGES,BY_ID,TEMPLATES,CHALLENGES,DEFAULT_FILES,DEFAULT_ENDPOINT,
 normalizeEndpoint,chooseRuntime,makeSubmission,interpretResult,gradeOutput,safeFiles} from '../studio/core.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('BROOTHERHOOD IDE models 19 language templates with complete C/C++ input examples',()=>{
 assert.equal(LANGUAGES.length,19);
 assert.equal(new Set(LANGUAGES.map(x=>x.id)).size,19);
 for(const lang of LANGUAGES){
  assert.ok(BY_ID[lang.id]===lang);
  assert.ok(lang.extension&&lang.mode&&lang.match instanceof RegExp);
  assert.ok(TEMPLATES[lang.id]?.code.length>15,lang.id+' missing a real starter');
 }
 assert.match(TEMPLATES.cpp.code,/#include <iostream>/);
 assert.match(TEMPLATES.cpp.code,/cin >> a >> b/);
 assert.match(TEMPLATES.c.code,/scanf/);
 assert.equal(TEMPLATES.cpp.stdin,'3 4\n');
 assert.equal(TEMPLATES.java.code.includes('class Main'),true);
});
test('Judge0 service endpoints allow HTTPS and reject risky or invalid URL forms',()=>{
 assert.equal(normalizeEndpoint('https://ce.judge0.com/'),DEFAULT_ENDPOINT);
 assert.equal(normalizeEndpoint('https://compiler.example.org/base/'),'https://compiler.example.org/base');
 assert.equal(normalizeEndpoint('http://localhost:2358'),'http://localhost:2358');
 for(const invalid of ['javascript:alert(1)','http://example.com','https://me:secret@example.com','https://example.com?token=secret','//somewhere.com','http://169.254.169.254']){
  assert.throws(()=>normalizeEndpoint(invalid));
 }
});
test('selects highest matching GCC/Clang and never confuses C with C++ or JavaFX with Java',()=>{
 const languages=[
  {id:104,name:'C (Clang 18.1.8)'},{id:103,name:'C (GCC 14.1.0)'},
  {id:105,name:'C++ (GCC 14.1.0)'},{id:76,name:'C++ (Clang 7.0.1)'},
  {id:91,name:'Java (JDK 17.0.6)'},{id:96,name:'JavaFX (JDK 17.0.6)'},
  {id:100,name:'Python (3.12.5)'},{id:109,name:'Python (3.13.2)'},
  {id:71,name:'Python (3.8.1)'},{id:108,name:'Rust (1.85.0)'}
 ];
 assert.equal(chooseRuntime(languages,'cpp','gcc').id,105);
 assert.equal(chooseRuntime(languages,'cpp','clang').id,76);
 assert.equal(chooseRuntime(languages,'c','gcc').id,103);
 assert.equal(chooseRuntime(languages,'c','clang').id,104);
 assert.equal(chooseRuntime(languages,'java').id,91);
 assert.equal(chooseRuntime(languages,'python').id,109);
 assert.equal(chooseRuntime(languages,'rust').id,108);
 assert.equal(chooseRuntime(languages,'kotlin'),null);
});
test('Judge0 request body supports stdin, time and memory limits without injecting API keys',()=>{
 const request=makeSubmission(105,TEMPLATES.cpp.code,'3 4\n','-std=c++17 -Wall');
 assert.equal(request.language_id,105);
 assert.equal(request.stdin,'3 4\n');
 assert.equal(request.compiler_options,'-std=c++17 -Wall');
 assert.equal(request.cpu_time_limit,3);
 assert.equal(request.wall_time_limit,8);
 assert.ok(request.memory_limit<=262144);
 assert.equal('api_key' in request,false);
 for(const bad of ['', '  ', 'x'.repeat(30001)])assert.throws(()=>makeSubmission(105,bad));
 assert.throws(()=>makeSubmission(0,'int main() {}'));
 assert.throws(()=>makeSubmission(105,'int main() {}','x'.repeat(13000)));
});
test('Actual compiler response recognizes queued, success, compile errors and stderr separately',()=>{
 const waiting=interpretResult({status:{id:1,description:'In Queue'}});
 assert.equal(waiting.queued,true);
 const accepted=interpretResult({stdout:'Sum: 7\n',stderr:null,status:{id:3,description:'Accepted'},time:'0.023',memory:8120,exit_code:0});
 assert.equal(accepted.success,true);
 assert.equal(accepted.stdout,'Sum: 7\n');
 assert.equal(accepted.time,'0.023');
 assert.equal(accepted.exitCode,0);
 const compileError=interpretResult({compile_output:'error: expected ;',status:{id:6,description:'Compilation Error'}});
 assert.equal(compileError.success,false);
 assert.match(compileError.output,/error: expected ;/);
 const runtime=interpretResult({stderr:'panic',status:{id:7,description:'Runtime Error'}});
 assert.match(runtime.stderr,/panic/);
});
test('Result validation compares exact normalized stdout, not fabricated completion badges',()=>{
 assert.equal(gradeOutput('Sum: 7\n','Sum: 7'),true);
 assert.equal(gradeOutput('Sum: 7\r\n','Sum: 7\n'),true);
 assert.equal(gradeOutput('Sum: 8\n','Sum: 7'),false);
 assert.equal(gradeOutput('Not correct','Sum: 7'),false);
 assert.equal(CHALLENGES.length,5);
 assert.ok(CHALLENGES.every(p=>p.id&&p.input!==undefined&&p.output&&p.hint&&p.statement));
});
test('Project file sanitization drops duplicate, invalid and oversized entries',()=>{
 const mixed=JSON.stringify([
  {name:'main.cpp',language:'cpp',code:'int main(){}'},
  {name:'main.cpp',language:'cpp',code:'overwriting is bad'},
  {name:'../secret',language:'cpp',code:'bad path'},
  {name:'test.py',language:'python',code:'print(1)'},
  {name:'huge.rs',language:'rust',code:'x'.repeat(30001)}
 ]);
 assert.deepEqual(safeFiles(mixed),[
  {name:'main.cpp',language:'cpp',code:'int main(){}'},
  {name:'test.py',language:'python',code:'print(1)'}
 ]);
 assert.deepEqual(safeFiles('invalid JSON'),[]);
 assert.equal(DEFAULT_FILES[0].name,'main.cpp');
});
test('Professional IDE features, keyboard access and true external compiler disclosures are shipped',()=>{
 const html=read('studio/index.html'),script=read('studio/studio.js'),css=read('studio/studio.css');
 for(const id of ['file-tree','open-tabs','language-select','compiler-select','compiler-endpoint','compiler-options','btn-check-compiler','btn-run','btn-test','btn-stop','code-source','cm-host','stdin-text','output-text','compiler-text','test-text','problem-select','btn-new','btn-export','project-import']){
  assert.ok(html.includes('id="'+id+'"'),'Missing IDE control '+id);
 }
 assert.match(html,/codemirror/i);
 assert.match(html,/aria-live="polite"/);
 assert.match(html,/single-file compilation/i);
 assert.match(script,/submissions\?base64_encoded=false&wait=false/);
 assert.match(script,/submitAndPoll/);
 assert.match(script,/getValue/);
 assert.match(script,/localStorage/);
 assert.match(script,/Ctrl-Enter/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
test('All IDE JavaScript modules pass Node syntax verification',()=>{
 for(const path of ['studio/studio.js','studio/core.js']){
  const out=spawnSync(process.execPath,['--check',new URL('../'+path,import.meta.url).pathname],{encoding:'utf8'});
  assert.equal(out.status,0,path+' has syntax error '+out.stderr);
 }
});
test('New compiler studio is included in the GitHub Pages deploy artifact and home links to it',()=>{
 const deploy=read('.github/workflows/pages.yml'),home=read('index.html');
 assert.match(deploy,/cp studio\/index\.html studio\/studio\.css studio\/studio\.js studio\/core\.js dist\/studio\//);
 assert.match(home,/href="\.\/studio\/"/);
});
