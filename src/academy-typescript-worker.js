/* Real TypeScript-to-JavaScript transpilation via pinned TypeScript compiler.
   Short-lived, time-bounded worker for education. Transpilation is not full project type-checking. */
const CDN='https://cdn.jsdelivr.net/npm/typescript@5.7.3/lib/typescript.js';
const blocked=/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|importScripts|indexedDB|caches|navigator|location|postMessage|Worker|SharedWorker|globalThis|self|Function|eval)\b|\bimport\s*\(/;
self.onmessage=event=>{
 const {id,source}=event.data||{},send=result=>self.postMessage({id,...result});
 if(typeof id!=='string'||typeof source!=='string'||source.length>6500){send({ok:false,error:'Please keep TypeScript programs under 6,500 characters.'});return;}
 if(blocked.test(source)){send({ok:false,error:'Network and system APIs are not supported in this learning environment.'});return;}
 try{
  importScripts(CDN);
  const transpiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None,strict:true},reportDiagnostics:true});
  const errors=transpiled.diagnostics?.filter(d=>d.category===ts.DiagnosticCategory.Error)||[];
  if(errors.length){send({ok:false,error:errors.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join('\n').slice(0,1300)});return;}
  const lines=[];
  const studentConsole=Object.freeze({
   log(...args){if(lines.length<60)lines.push(args.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' ').slice(0,350));},
   error(...args){if(lines.length<60)lines.push('Error: '+args.map(String).join(' ').slice(0,350));}
  });
  const execute=new Function('console','fetch','XMLHttpRequest','WebSocket','navigator','location','"use strict";\n'+transpiled.outputText);
  execute(studentConsole,undefined,undefined,undefined,undefined,undefined);
  send({ok:true,output:lines.join('\n')||'(Program completed without output.)',notice:'TypeScript transpiled to JavaScript before execution; complete project-level type-checking is not provided.'});
 }catch(error){send({ok:false,error:String(error?.message||'TypeScript execution error').slice(0,1000)});}
};