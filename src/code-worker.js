/* Educational JavaScript execution in a dedicated, disposable worker.
   Browser-only; not a hard security boundary for adversarial code. */
const blocked = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|importScripts|indexedDB|caches|navigator|location|postMessage|Worker|SharedWorker|globalThis|self|Function|eval)\b|\bimport\s*\(/;
self.onmessage = event => {
 const id=event.data?.id, source=event.data?.source;
 const logs=[];
 const publish=result=>self.postMessage({id,...result});
 if(typeof id!=='string'||typeof source!=='string'||source.length>6500){publish({ok:false,error:'Code must be text and under 6,500 characters.'});return;}
 if(blocked.test(source)){publish({ok:false,error:'This teaching sandbox only supports local JavaScript. Network and system APIs are unavailable.'});return;}
 const studentConsole=Object.freeze({
  log(...args){if(logs.length<50)logs.push(args.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' ').slice(0,240));},
  error(...args){if(logs.length<50)logs.push('Error: '+args.map(String).join(' ').slice(0,240));},
  warn(...args){if(logs.length<50)logs.push('Warning: '+args.map(String).join(' ').slice(0,240));}
 });
 try {
   const run = new Function('console','fetch','XMLHttpRequest','WebSocket','importScripts','indexedDB','caches','navigator','location',
    '"use strict";\n'+source+'\n');
   run(studentConsole,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined);
   publish({ok:true,output:logs.join('\n')||'(No output — use console.log to print a value.)'});
 }catch(error){publish({ok:false,output:logs.join('\n'),error:String(error?.message||'Code could not run').slice(0,360)});}
};
