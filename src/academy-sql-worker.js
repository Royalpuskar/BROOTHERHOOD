/* Real browser-side SQLite using sql.js WebAssembly. Fresh in-memory database per run.
   SELECT-only exercises, no remote database, credentials or external queries. */
const CDN='https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/';
let engine=null;
async function ready(){
 if(!engine)engine=(async()=>{
  importScripts(CDN+'sql-wasm.js');
  return await initSqlJs({locateFile:file=>CDN+file});
 })();
 return engine;
}
self.onmessage=async event=>{
 const {id,source}=event.data||{};
 const send=data=>self.postMessage({id,...data});
 if(typeof id!=='string'||typeof source!=='string'||source.length>5000){send({ok:false,error:'Keep SQL queries under 5,000 characters.'});return;}
 const normalized=source.replace(/--[^\n]*/g,'').trim();
 if(!/^SELECT\b/i.test(normalized)||/;[\s\S]*\S/.test(normalized.replace(/;$/,''))){send({ok:false,error:'This practice database accepts one read-only SELECT query at a time.'});return;}
 let db=null;
 try{
  const SQL=await ready();
  db=new SQL.Database();
  db.run('CREATE TABLE learners (id INTEGER PRIMARY KEY, name TEXT, score INTEGER, language TEXT);');
  db.run("INSERT INTO learners(name,score,language) VALUES ('Ada',96,'Python'),('Grace',90,'SQL'),('Linus',75,'C'),('Margaret',88,'JavaScript'),('Alan',67,'C++');");
  const result=db.exec(normalized);
  if(!result.length){send({ok:true,columns:[],values:[],output:'Query succeeded — no rows returned.'});return;}
  const first=result[0];
  if(first.values.length>60){send({ok:true,columns:first.columns,values:first.values.slice(0,60),output:'Result limited to 60 rows.'});return;}
  send({ok:true,columns:first.columns,values:first.values,output:'Returned '+first.values.length+' row(s).'});
 }catch(error){send({ok:false,error:String(error?.message||'SQL error').slice(0,900)});}
 finally{if(db)db.close();}
};