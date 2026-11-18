/* BROOTHERHOOD Horizon client: real API actions only with a connected backend.
   Offline entries are clearly labeled examples. All user content uses textContent. */
const $=id=>document.getElementById(id);
const state={base:'',online:false,token:'',user:null,items:{}};
const EXAMPLE={
 events:[{id:1,title:'DEMO · Opening & Welcome',venue:'Sample Zone A · Not confirmed',start_at:'2026-12-05T09:00:00+07:00',description:'Illustrative event; not an official university schedule.',is_demo:true},{id:2,title:'DEMO · Cyber Challenge',venue:'Sample Zone B · Not confirmed',start_at:'2026-12-05T10:30:00+07:00',description:'Demonstration competition.',is_demo:true},{id:3,title:'DEMO · Innovation Expo',venue:'Sample Expo Space · Not confirmed',start_at:'2026-12-05T13:00:00+07:00',description:'Example student exhibit.',is_demo:true}],
 announcements:[{id:1,text:'DEMO: Dates, venues and announcements require organizer approval.',is_demo:true}],
 cyber:[{id:1,title:'Phishing detection',scenario:'An urgent message asks for your login code.',choices:['Verify through the official service','Send the code','Forward the link'],correct:0,explanation:'Never share one-time authentication codes.'},{id:2,title:'Unrequested MFA',scenario:'You receive a login approval request you did not initiate.',choices:['Approve immediately','Deny and review security','Send your password'],correct:1,explanation:'Deny unrequested login prompts.'}],
 expo:[{id:1,title:'DEMO · Accessibility Mapper',description:'Illustrative campus accessibility innovation.',category:'Software',votes:0,is_demo:true},{id:2,title:'DEMO · Privacy-First Study Buddy',description:'Illustrative student AI assistant concept.',category:'AI',votes:0,is_demo:true}],
 polls:[{id:1,question:'DEMO · Which technology interests you?',options:['Cybersecurity','AI','Programming','Robotics'],is_demo:true}],
 connect:{profiles:[],communities:[{name:'DEMO · Cyber Defenders',description:'Example community.',interests:['security'],is_demo:true}]},
 navigation:{address:'Scientia Boulevard, Gading Serpong, Tangerang, Banten, Indonesia',room_locations:[],map_url:'https://www.google.com/maps/search/?api=1&query=Universitas+Multimedia+Nusantara+Gading+Serpong'}
};
const doc=(tag,content='',cls='')=>{const n=document.createElement(tag);n.textContent=String(content);if(cls)n.className=cls;return n;};
function clear(id){const n=typeof id==='string'?$(id):id;n.replaceChildren();return n;}
function msg(id,text){$(id).textContent=String(text);}
function fail(id,error){msg(id,'Error: '+String(error?.message||error));}
function offline(id,text){clear(id).append(doc('p',text,'hint'));}
function isSafe(url){try{const u=new URL(url);return !u.username&&!u.password&&!u.search&&!u.hash&&(u.protocol==='https:'||(['localhost','127.0.0.1'].includes(u.hostname)&&u.protocol==='http:'));}catch{return false;}}
function saved(key){try{return localStorage.getItem(key)||'';}catch{return '';}}
function save(key,value){try{localStorage.setItem(key,value);}catch{}}
state.base=saved('brootherhood.horizon.backend')||(['localhost','127.0.0.1'].includes(location.hostname)?location.origin:'');
$('api-url').value=state.base;
if(saved('brootherhood.horizon.theme')==='light')document.body.dataset.theme='light';
$('theme-btn').addEventListener('click',()=>{const next=document.body.dataset.theme==='light'?'dark':'light';document.body.dataset.theme=next;save('brootherhood.horizon.theme',next);});
function requiresLive(){if(!state.online)throw Error('Connect a deployed Horizon backend to use this action. Static demo data cannot register, vote or check in.');}
function requiresLogin(){requiresLive();if(!state.token)throw Error('Sign in to continue.');}
async function call(path,options={}){
 requiresLive();
 const headers={Accept:'application/json'};
 if(options.data!==undefined)headers['Content-Type']='application/json';
 if(options.auth!==false&&state.token)headers.Authorization='Bearer '+state.token;
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
 try{
  const res=await fetch(state.base+path,{method:options.method||'GET',headers,body:options.data!==undefined?JSON.stringify(options.data):undefined,signal:controller.signal,cache:'no-store'});
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw Error(typeof data.detail==='string'?data.detail:res.status+' '+res.statusText);
  return data;
 }catch(e){if(e.name==='AbortError')throw Error('Backend request timed out.');throw e;}
 finally{clearTimeout(timeout);}
}
async function downloadSecured(path,name){
 requiresLogin();
 const res=await fetch(state.base+path,{headers:{Authorization:'Bearer '+state.token},cache:'no-store'});
 if(!res.ok)throw Error('Download failed: HTTP '+res.status);
 const blob=await res.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
}
function stamp(value){const d=new Date(value);return Number.isNaN(d.getTime())?String(value):d.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});}
function labelDemo(parent,item){if(item.is_demo)parent.append(doc('span','DEMO · UNVERIFIED','demo-label'));}
function setConnection(yes){
 $('live-indicator').className='server-status'+(yes?' connected':'');
 const indicator=$('live-indicator');indicator.replaceChildren();
 const dot=doc('i');dot.setAttribute('aria-hidden','true');
 indicator.append(dot,document.createTextNode(yes?' Live API':' Demo preview'));
 $('demo-banner').hidden=yes&&!state.items.dashboard?.sample_data;
}
async function connect(){
 const base=$('api-url').value.trim().replace(/\/+$/,'');
 if(!isSafe(base)){msg('backend-result','Use an HTTPS API address, or local HTTP for development.');return;}
 msg('backend-result','Checking API connection…');
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);
 try{
  const res=await fetch(base+'/api/health',{signal:controller.signal,cache:'no-store'});
  if(!res.ok)throw Error('HTTP '+res.status);
  const health=await res.json();
  if(health.ok!==true||!health.version)throw Error('This is not a Horizon API.');
  if(state.base!==base){state.token='';state.user=null;}
  state.base=base;state.online=true;save('brootherhood.horizon.backend',base);setConnection(true);
  msg('backend-result','Connected to Horizon API v'+health.version+' · sample data: '+(health.sample_data?'yes':'no')+' · Gemini key: '+(health.ai_connected?'configured':'not configured'));
  updateSession();await refresh();
 }catch(error){state.online=false;state.token='';state.user=null;setConnection(false);updateSession();fail('backend-result',error);renderAll();}
 finally{clearTimeout(timeout);}
}
$('api-btn').addEventListener('click',()=>$('backend-modal').showModal());
$('backend-form').addEventListener('submit',e=>{e.preventDefault();connect();});
$('login-btn').addEventListener('click',()=>$('login-modal').showModal());
$('logout-btn').addEventListener('click',()=>{state.user=null;state.token='';updateSession();renderPasses();});
$('show-login').addEventListener('click',()=>{ $('login-form').hidden=false;$('register-form').hidden=true;$('show-login').classList.add('selected');$('show-register').classList.remove('selected');});
$('show-register').addEventListener('click',()=>{ $('register-form').hidden=false;$('login-form').hidden=true;$('show-register').classList.add('selected');$('show-login').classList.remove('selected');});
function updateSession(){
 const yes=!!state.user;
 $('login-btn').hidden=yes;$('logout-btn').hidden=!yes;
 if(yes)$('logout-btn').textContent='Sign out · '+state.user.name;
 const admin=yes&&['admin','organizer'].includes(state.user.role);
 $('admin').hidden=!admin;$('admin-link').hidden=!admin;
 $('checkin-form').querySelector('button').disabled=!admin;
 if(admin)refreshAdmin();
}
async function authenticate(path,form){
 try{
  requiresLive();
  const data=Object.fromEntries(new FormData(form));
  const response=await call(path,{method:'POST',data,auth:false});
  state.user=response.user;state.token=response.access_token;
  updateSession();msg('auth-response','Signed in as '+state.user.name+'.');form.reset();
  $('login-modal').close();await renderPasses();
 }catch(e){fail('auth-response',e);}
}
$('login-form').addEventListener('submit',e=>{e.preventDefault();authenticate('/api/auth/login',e.currentTarget);});
$('register-form').addEventListener('submit',e=>{e.preventDefault();authenticate('/api/auth/register',e.currentTarget);});
function renderEvents(){
 const wrap=clear('event-list'),data=state.items.events||EXAMPLE.events;
 if(!data.length){wrap.append(doc('p','No published events yet.'));return;}
 for(const event of data){
  const card=doc('article','','event-item'),info=doc('div');
  labelDemo(info,event);
  info.append(doc('h4',event.title),doc('small',stamp(event.start_at)+' · '+event.venue),doc('p',event.description||''));
  const btn=doc('button',state.online?'Register →':'Sample only');btn.type='button';btn.disabled=!state.online;
  btn.addEventListener('click',async()=>{
   try{requiresLogin();const result=await call('/api/events/'+event.id+'/register',{method:'POST'});alert('Registered. Pass #'+result.registration_id+' is in QR Attendance.');await renderPasses();await refreshMetrics();}
   catch(e){alert(e.message);}
  });
  card.append(info,btn);wrap.append(card);
 }
}
function renderAnnouncements(){
 const wrap=clear('announcement-list'),data=state.items.announcements||EXAMPLE.announcements;
 for(const a of data){const card=doc('div','','announcement');labelDemo(card,a);card.append(doc('span',a.text));wrap.append(card);}
 if(!data.length)wrap.append(doc('p','No announcements published.'));
}
function renderMetrics(){
 const d=state.items.dashboard||{events:3,registrations:null,attendance:null,projects:2};
 msg('metric-events',d.events??'—');msg('metric-registrations',d.registrations??'—');msg('metric-checkins',d.attendance??'—');msg('metric-expo',d.projects??'—');
 $('demo-banner').hidden=state.online&&!d.sample_data;
}
async function renderPasses(){
 const box=clear('my-registrations'),certs=clear('certificate-list');
 if(!state.user||!state.online){box.append(doc('p','Sign in to retrieve signed QR passes.'));certs.append(doc('p','Certificates require real attendance.'));return;}
 try{
  const rows=await call('/api/me/registrations');
  if(!rows.length){box.append(doc('p','No registrations yet.'));certs.append(doc('p','No certificates yet.'));return;}
  for(const reg of rows){
   const card=doc('article','','pass-card');
   card.append(doc('b',reg.event.title),doc('small',reg.checked_in?'✓ Attendance verified':'Check-in pending'));
   const qr=doc('button','Show QR pass');
   qr.addEventListener('click',async()=>{
    try{
     const resp=await fetch(state.base+'/api/registrations/'+reg.id+'/qr',{headers:{Authorization:'Bearer '+state.token}});
     if(!resp.ok)throw Error('QR unavailable.');
     const blob=await resp.blob(),url=URL.createObjectURL(blob),image=document.createElement('img');
     image.alt='Event admission QR for registration '+reg.id;image.src=url;
     card.querySelectorAll('img,code').forEach(x=>x.remove());
     card.append(image,doc('code',reg.pass_token));
     setTimeout(()=>URL.revokeObjectURL(url),60000);
    }catch(e){alert(e.message);}
   });
   const tokenButton=doc('button','Copy pass token');tokenButton.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(reg.pass_token);tokenButton.textContent='Copied ✓';}
    catch{card.append(doc('code',reg.pass_token));}
   });
   card.append(qr,tokenButton);box.append(card);
   if(reg.checked_in){
    const row=doc('article','','list-item'),btn=doc('button','Create & download PDF');
    row.append(doc('b',reg.event.title),btn);
    btn.addEventListener('click',async()=>{
     try{const result=await call('/api/certificates/'+reg.id,{method:'POST'});
      await downloadSecured(result.download,'brootherhood-certificate-'+result.certificate_id+'.pdf');alert('Verification ID: '+result.certificate_id);
     }catch(e){alert(e.message);}
    });
    certs.append(row);
   }
  }
  if(!certs.childElementCount)certs.append(doc('p','Check in to unlock your certificate.'));
 }catch(e){box.append(doc('p',e.message));}
}
$('checkin-form').addEventListener('submit',async e=>{
 e.preventDefault();
 try{requiresLogin();const result=await call('/api/checkins',{method:'POST',data:{pass_token:$('checkin-token').value.trim()}});
  msg('checkin-result',result.message);$('checkin-token').value='';await refreshMetrics();await renderPasses();
 }catch(error){fail('checkin-result',error);}
});
$('verify-form').addEventListener('submit',async e=>{
 e.preventDefault();
 try{const value=$('verify-id').value.trim();const result=await call('/api/certificates/verify/'+encodeURIComponent(value),{auth:false});
  msg('verification-result',result.verified?'Verified · '+result.event+(result.is_demo?' · DEMO event':''):'Not verified');
 }catch(error){fail('verification-result',error);}
});
function renderCyber(){
 const wrap=clear('challenge-list'),data=state.items.cyber||EXAMPLE.cyber;
 for(const c of data){
  const card=doc('article','','challenge-card'),choices=doc('div'),feedback=doc('p','','feedback');
  card.append(doc('h3',c.title),doc('p',c.scenario));
  c.choices.forEach((choice,index)=>{
   const label=doc('label'),radio=document.createElement('input');radio.type='radio';radio.name='cyber-'+c.id;radio.value=String(index);
   label.append(radio,doc('span',choice));choices.append(label);
  });
  const button=doc('button','Check my decision');
  button.addEventListener('click',async()=>{
   const selected=choices.querySelector('input:checked');
   if(!selected){feedback.textContent='Choose one answer first.';return;}
   try{
    let result;
    if(state.online){requiresLogin();result=await call('/api/cyber/'+c.id+'/answer',{method:'POST',data:{selected:Number(selected.value)}});}
    else result={correct:Number(selected.value)===c.correct,explanation:Number(selected.value)===c.correct?c.explanation:'Review the safest defensive response.',points:0};
    feedback.textContent=(result.correct?'✓ Correct. ':'Try again. ')+result.explanation+(state.online&&result.correct?' · +25 points (first correct solve only)':'');
    if(state.online)await refreshLeaderboard();
   }catch(e){feedback.textContent=e.message;}
  });
  card.append(choices,button,feedback);wrap.append(card);
 }
}
function renderExpo(){
 const wrap=clear('expo-list'),data=state.items.expo||EXAMPLE.expo;
 for(const p of data){
  const card=doc('article','','project-card');labelDemo(card,p);
  card.append(doc('h3',p.title),doc('p',p.description),doc('p',p.category),doc('strong',p.votes+' votes','vote-meta'));
  const btn=doc('button',state.online?'Vote for project':'Demo showcase');btn.disabled=!state.online;
  btn.addEventListener('click',async()=>{try{requiresLogin();await call('/api/expo/'+p.id+'/vote',{method:'POST'});await refreshExpo();}catch(e){alert(e.message);}});
  card.append(btn);wrap.append(card);
 }
 if(!data.length)wrap.append(doc('p','No approved expo projects.'));
}
$('project-form').addEventListener('submit',async e=>{
 e.preventDefault();
 try{requiresLogin();const data=Object.fromEntries(new FormData(e.currentTarget));const result=await call('/api/expo',{method:'POST',data});
  msg('project-response',result.message);e.currentTarget.reset();
 }catch(error){fail('project-response',error);}
});
async function renderPolls(){
 const box=clear('poll-list'),data=state.items.polls||EXAMPLE.polls;
 for(const poll of data){
  const card=doc('article','','poll-card'),resultText=doc('p','','response'),form=document.createElement('form');
  labelDemo(card,poll);card.append(doc('h3',poll.question));
  poll.options.forEach((option,index)=>{
   const label=doc('label'),radio=document.createElement('input');radio.type='radio';radio.name='poll-'+poll.id;radio.value=index;
   label.append(radio,doc('span',option));form.append(label);
  });
  const submit=doc('button',state.online?'Submit one vote':'Demo poll');submit.type='submit';submit.disabled=!state.online;
  form.append(submit);form.addEventListener('submit',async e=>{
   e.preventDefault();
   const selected=form.querySelector('input:checked');
   if(!selected){resultText.textContent='Select an option.';return;}
   try{requiresLogin();await call('/api/polls/'+poll.id+'/vote',{method:'POST',data:{selected:Number(selected.value)}});resultText.textContent='Vote recorded once.';await updatePollResults(poll.id,card);}
   catch(error){resultText.textContent=error.message;}
  });
  card.append(form,resultText);box.append(card);
  if(state.online)updatePollResults(poll.id,card);
 }
 if(!data.length)box.append(doc('p','No active polls.'));
}
async function updatePollResults(id,card){
 try{
  const result=await call('/api/polls/'+id+'/results',{auth:false});
  let area=card.querySelector('.poll-bars');if(!area){area=doc('div','','poll-bars');card.append(area);}
  area.replaceChildren();
  result.options.forEach((name,index)=>{
   const row=doc('div',name+' · '+result.counts[index]+' votes'),bar=doc('div','','poll-bar'),fill=doc('span');
   fill.style.width=result.total?(result.counts[index]/result.total*100)+'%':'0%';
   bar.append(fill);row.append(bar);area.append(row);
  });
 }catch{}
}
function renderLeaderboard(){
 const box=clear('leaderboard-list'),items=state.items.leaderboard||[];
 if(!items.length){box.append(doc('p',state.online?'No verified points awarded yet.':'Live leaderboard requires a connected backend.'));return;}
 items.forEach(entry=>{const row=doc('div','','leaderboard-entry');row.append(doc('span','#'+entry.position+' · '+entry.display_name),doc('b',entry.points+' pts'));box.append(row);});
}
function renderConnect(){
 const data=state.items.connect||EXAMPLE.connect;
 const groups=clear('community-list'),profiles=clear('profile-list');
 for(const c of data.communities||[]){const row=doc('article','','list-item');labelDemo(row,c);row.append(doc('b',c.name),doc('p',c.description));groups.append(row);}
 for(const p of data.profiles||[]){const row=doc('article','','list-item');row.append(doc('b',p.name),doc('p',p.interests.join(' · ')));profiles.append(row);}
 if(!profiles.children.length)profiles.append(doc('p','No public profiles yet. Private student profiles are hidden.'));
}
$('profile-form').addEventListener('submit',async e=>{
 e.preventDefault();
 try{requiresLogin();const interests=$('profile-interests').value.split(',').map(x=>x.trim()).filter(Boolean).slice(0,8);
  await call('/api/me/profile',{method:'PATCH',data:{interests,public_profile:$('public-profile').checked}});
  msg('profile-response','Profile privacy preferences saved.');await refreshConnections();
 }catch(error){fail('profile-response',error);}
});
function renderNavigation(){
 const info=state.items.navigation||EXAMPLE.navigation;
 msg('campus-address',info.address);
 const map=$('campus-map-link');if(info.map_url&&info.map_url.startsWith('https://'))map.href=info.map_url;
 const box=clear('location-list');
 (info.room_locations||[]).forEach(loc=>{const row=doc('article','','list-item');row.append(doc('b',loc.name),doc('p',loc.status));box.append(row);});
 if(!box.children.length)box.append(doc('p','Indoor room and floorplan details have not been verified.'));
}
function careerCard(r){
 const card=doc('article','','career-card');card.append(doc('h4',r.career),doc('p','Learning path: '+r.skills.join(' → ')),doc('small','Resource: '+r.resource));return card;
}
$('career-form').addEventListener('submit',async e=>{
 e.preventDefault();const interests=$('career-interests').value.split(',').map(x=>x.trim()).filter(Boolean);
 const box=clear('career-results');
 try{
  if(!state.online){box.append(doc('p','Connect a backend for transparent skill-matching recommendations. This feature is not pretending to run an AI model.'));return;}
  const result=await call('/api/careers/recommend',{method:'POST',data:{interests},auth:false});
  result.recommendations.forEach(r=>box.append(careerCard(r)));
 }catch(e){box.append(doc('p',e.message));}
});
function localFAQ(question,language){
 const q=question.toLowerCase(),bahasa=language==='id';
 if(/schedule|jadwal|when|kapan/.test(q))return bahasa?'Jadwal yang ditampilkan hanyalah contoh. Hubungkan server untuk data terkini.':'Displayed schedules are fictional examples. Connect the backend for organizer-published events.';
 if(/register|daftar|ticket|tiket/.test(q))return bahasa?'Silakan masuk lalu daftar pada halaman jadwal jika server aktif.':'Sign in, then register from the schedule once the backend is connected.';
 if(/where|venue|lokasi|kampus|location/.test(q))return bahasa?'Kampus UMN berada di Gading Serpong. Ruangan acara belum dikonfirmasi.':'UMN campus is in Gading Serpong. Indoor event locations are unverified.';
 return bahasa?'Ini adalah pratinjau FAQ, bukan AI yang aktif. Hubungkan backend untuk menggunakan asisten.':'This is a local FAQ preview, not live AI. Connect the backend to enable the assistant.';
}
$('chat-form').addEventListener('submit',async e=>{
 e.preventDefault();
 const q=$('chat-question').value.trim(),lang=$('chat-language').value;if(q.length<3)return;
 const transcript=$('chat-transcript'),user=doc('div','','chat-bubble user');
 user.append(doc('b','You'),doc('p',q));transcript.append(user);
 const bubble=doc('div','','chat-bubble bot'),answer=doc('p','Processing…');
 bubble.append(doc('b','Horizon Guide'),answer);transcript.append(bubble);transcript.scrollTop=transcript.scrollHeight;
 $('chat-question').value='';
 try{
  if(state.online){
   const result=await call('/api/assistant/ask',{method:'POST',data:{question:q,language:lang},auth:false});
   answer.textContent=result.answer;msg('chat-mode',result.mode);
  }else{answer.textContent=localFAQ(q,lang);msg('chat-mode','Local FAQ demo · no generative AI connected');}
 }catch(e){answer.textContent='Unable to answer: '+e.message;}
 transcript.scrollTop=transcript.scrollHeight;
});
async function refreshMetrics(){if(!state.online)return;try{state.items.dashboard=await call('/api/dashboard',{auth:false});renderMetrics();}catch{}}
async function refreshExpo(){if(!state.online)return;try{state.items.expo=await call('/api/expo',{auth:false});renderExpo();}catch{}}
async function refreshLeaderboard(){if(!state.online)return;try{state.items.leaderboard=await call('/api/leaderboard',{auth:false});renderLeaderboard();}catch{}}
async function refreshConnections(){if(!state.online)return;try{state.items.connect=await call('/api/connect',{auth:false});renderConnect();}catch{}}
async function refreshAdmin(){
 if(!state.user||!['organizer','admin'].includes(state.user.role))return;
 try{
  const data=await call('/api/admin/analytics'),box=clear('admin-stats');
  Object.entries(data).forEach(([name,value])=>{
   const row=doc('div');row.append(doc('strong',value),doc('span',name.replaceAll('_',' ')));box.append(row);
  });
 }catch{}
}
$('export-csv').addEventListener('click',async e=>{e.preventDefault();try{await downloadSecured('/api/admin/registrations.csv','horizon-registrations.csv');}catch(err){alert(err.message);}});
$('announcement-form').addEventListener('submit',async e=>{
 e.preventDefault();try{requiresLogin();const text=new FormData(e.currentTarget).get('text');
  await call('/api/admin/announcements',{method:'POST',data:{text}});e.currentTarget.reset();msg('admin-announcement-result','Announcement published.');await refresh();
 }catch(err){fail('admin-announcement-result',err);}
});
$('poll-create-form').addEventListener('submit',async e=>{
 e.preventDefault();try{requiresLogin();const data=Object.fromEntries(new FormData(e.currentTarget));
  await call('/api/admin/polls',{method:'POST',data:{question:data.question,options:data.options.split(/\r?\n/).map(x=>x.trim()).filter(Boolean)}});
  e.currentTarget.reset();msg('admin-poll-result','Poll published.');await refresh();
 }catch(err){fail('admin-poll-result',err);}
});
$('event-create-form').addEventListener('submit',async e=>{
 e.preventDefault();try{
  requiresLogin();const data=Object.fromEntries(new FormData(e.currentTarget));
  const iso=x=>new Date(x).toISOString();data.start_at=iso(data.start_at);data.end_at=iso(data.end_at);data.capacity=Number(data.capacity);
  await call('/api/admin/events',{method:'POST',data});e.currentTarget.reset();msg('admin-event-result','Event published.');await refresh();
 }catch(err){fail('admin-event-result',err);}
});
function renderAll(){renderMetrics();renderEvents();renderAnnouncements();renderCyber();renderExpo();renderPolls();renderLeaderboard();renderConnect();renderNavigation();}
async function refresh(){
 if(!state.online){renderAll();return;}
 const jobs=[['dashboard','/api/dashboard'],['events','/api/events'],['announcements','/api/announcements'],['cyber','/api/cyber/challenges'],['expo','/api/expo'],['polls','/api/polls'],['leaderboard','/api/leaderboard'],['connect','/api/connect'],['navigation','/api/navigation']];
 const result=await Promise.allSettled(jobs.map(async([key,path])=>{state.items[key]=await call(path,{auth:false});}));
 const failed=result.filter(x=>x.status==='rejected').length;
 if(failed)console.warn('Horizon connection: '+failed+' sections could not load.');
 renderAll();if(state.user){await renderPasses();await refreshAdmin();}
}
document.querySelectorAll('#portal-nav [data-link]').forEach(a=>a.addEventListener('click',()=>{
 document.querySelectorAll('#portal-nav [data-link]').forEach(x=>x.classList.toggle('selected',x===a));
}));
setConnection(false);updateSession();renderAll();
if(state.base&&isSafe(state.base)){connect();}
setInterval(()=>{if(state.online&&!document.hidden)refresh();},30000);
