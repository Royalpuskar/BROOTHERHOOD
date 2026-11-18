/* Python 3 execution via pinned Pyodide in a disposable browser worker.
   Educational runtime, not a hardened sandbox for adversarial submissions. */
const ROOT='https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
let boot=null;
async function ready(){
 if(!boot) boot=(async()=>{
  importScripts(ROOT+'pyodide.js');
  return await loadPyodide({indexURL:ROOT});
 })();
 return boot;
}
self.onmessage=async event=>{
 const {id,source}=event.data||{};
 const send=data=>self.postMessage({id,...data});
 if(typeof id!=='string'||typeof source!=='string'||source.length>6500){send({ok:false,error:'Please keep Python programs under 6,500 characters.'});return;}
 try{
  const runtime=await ready();
  const output=[];
  runtime.setStdout({batched:text=>{if(output.join('').length<10000)output.push(text);}});
  runtime.setStderr({batched:text=>{if(output.join('').length<10000)output.push(text);}});
  await runtime.runPythonAsync(source);
  send({ok:true,output:output.join('\n')||'(Program finished with no output.)'});
 }catch(error){send({ok:false,error:String(error?.message||'Python error').slice(0,1200)});}
};