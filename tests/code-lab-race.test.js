import test from 'node:test';
import assert from 'node:assert/strict';

test('Code Lab rejects late worker results after switching, resetting or editing',async()=>{
  const nodes=new Map(),workers=[],saved=new Map();
  function node(){
    return {value:'',textContent:'',disabled:false,hidden:false,style:{},dataset:{},
      classList:{toggle(){},add(){},remove(){}},events:{},attrs:{},
      addEventListener(name,handler){this.events[name]=handler;},
      getAttribute(name){return this.attrs[name]??null;},
      setAttribute(name,value){this.attrs[name]=value;},
      append(){},replaceChildren(){}};
  }
  function get(id){
    if(!nodes.has(id))nodes.set(id,node());
    return nodes.get(id);
  }
  get('cyber-scenario').value='phishing';
  get('ai-value').value='5';get('ai-k').value='3';
  globalThis.document={getElementById:get,querySelectorAll:()=>[],querySelector:()=>null,
    createElement:node,createTextNode:s=>s};
  globalThis.window={dispatchEvent(){},addEventListener(){}};
  globalThis.localStorage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)};
  globalThis.matchMedia=()=>({matches:true});
  globalThis.IntersectionObserver=class{observe(){}disconnect(){}};
  globalThis.Worker=class{
    constructor(){workers.push(this);this.terminated=false;}
    terminate(){this.terminated=true;}
    postMessage(message){this.message=message;}
    deliver(output){this.onmessage({data:{id:this.message.id,ok:true,output}});}
  };
  await import('../src/digital-app.js');
  const task=get('code-task'),editor=get('code-editor'),run=get('run-code');
  const progress=get('progress-count')||{};
  task.events.change({target:{value:'variables'}});
  run.events.click();
  const first=workers.at(-1);
  assert.equal(run.disabled,true);
  task.events.change({target:{value:'loops'}});
  assert.equal(first.terminated,true);assert.equal(run.disabled,false);
  // Both missions print 15: a late result from the previous task must not earn a badge.
  first.deliver('15');assert.equal(progress.textContent,'0 / 5');
  assert.equal(get('code-output').textContent,'Run your code to see the result.');
  run.events.click();
  const second=workers.at(-1);
  get('reset-code').events.click();
  second.deliver('15');assert.equal(progress.textContent,'0 / 5');
  assert.equal(second.terminated,true);assert.equal(run.disabled,false);
  run.events.click();
  const third=workers.at(-1);
  editor.value='console.log(14)';editor.events.input();
  third.deliver('15');assert.equal(progress.textContent,'0 / 5');
  assert.equal(third.terminated,true);assert.equal(run.disabled,false);
  assert.equal(get('code-output').textContent,'Run your edited code to see the result.');
  editor.value='console.log(15)';editor.events.input();
  run.events.click();workers.at(-1).deliver('15');
  assert.equal(progress.textContent,'1 / 5');
  assert.equal(run.disabled,false);
});
