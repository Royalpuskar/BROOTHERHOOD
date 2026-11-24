import {PORTALS,mountUniverse} from '../src/universe-v2.js';

const $=id=>document.getElementById(id);
const buttons=[...document.querySelectorAll('[data-portal]')];
const filterButtons=[...document.querySelectorAll('[data-world-filter]')];
let activeFilter='All';
const visibleIndexes=()=>PORTALS.map((portal,index)=>({portal,index}))
 .filter(item=>activeFilter==='All'||item.portal.category===activeFilter).map(item=>item.index);
function showCategory(category,{autoselect=true}={}){
 activeFilter=category;
 filterButtons.forEach(control=>{
  control.setAttribute('aria-pressed',String(control.dataset.worldFilter===category));
 });
 buttons.forEach(control=>{
  const portal=PORTALS.find(item=>item.id===control.dataset.portal);
  control.hidden=category!=='All'&&portal?.category!==category;
 });
 if(autoselect&&!visibleIndexes().includes(selected))select(visibleIndexes()[0],{announce:true});
}
function stepSelection(direction){
 const options=visibleIndexes();
 const current=options.indexOf(selected);
 const next=options[(current+direction+options.length)%options.length]??options[0];
 select(next);
}
function focusSelection(){
 const btn=buttons[selected];
 if(!btn||btn.hidden)return;
 const list=$('xp-portal-list');
 // Scroll the inner portal directory instead of scrolling the entire page.
 const top=btn.offsetTop-list.offsetTop;
 if(top<list.scrollTop)list.scrollTop=top-8;
 else if(top+btn.offsetHeight>list.scrollTop+list.clientHeight)
  list.scrollTop=top+btn.offsetHeight-list.clientHeight+8;
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const details={
 code:'A real programming workspace with language compilers, standard input, diagnostic output and coding challenges.',
 cyber:'Investigate safe simulated attacks, evaluate phishing scenarios and develop practical defensive skills.',
 ai:'Understand machine learning using a transparent, working k-nearest-neighbors demonstration.',
 horizon:'Discover the connected event dashboard: registration concepts, student projects, smart polls and a bilingual event guide.',
 biology:'Spin a detailed teaching schematic of the human heart. Find chambers, valves, major vessels and trace circulation before trying a five-question biology quiz.',
 physics:'Adjust voltage and resistance in a working circuit simulator. Explore the relationship between current, voltage and resistance.',
 maths:'Use draggable fractions and live feedback to understand parts of a whole and complete discovery missions.',
 eco:'Experiment with transport choices and see how daily habits affect a simple environmental impact model.',
 build:'Arrange frontend, API and database components to understand software architecture and how applications connect.'
};
let selected=0,controller=null,paused=reduced.matches,tourTimer=0,touring=false,lastWheel=0;
function clearTour(){touring=false;clearTimeout(tourTimer);$('xp-explore').textContent='Take the 3D tour →';}
function select(index,{announce=true,stopTour=true}={}){
 if(stopTour)clearTour();
 selected=(index+PORTALS.length)%PORTALS.length;
 const portal=PORTALS[selected],count=String(selected+1).padStart(2,'0');
 if(activeFilter!=='All'&&portal.category!==activeFilter)showCategory('All',{autoselect:false});
 buttons.forEach(btn=>{
  const active=btn.dataset.portal===portal.id;
  btn.classList.toggle('is-active',active);
  btn.setAttribute('aria-pressed',String(active));
 });
 $('xp-counter').textContent=count+' OF '+String(PORTALS.length).padStart(2,'0');
 $('xp-coordinate').textContent='COORD / '+count+'.00';
 $('xp-current-index').textContent='WORLD '+count+' / '+String(PORTALS.length).padStart(2,'0');
 $('xp-current-category').textContent=portal.category.toUpperCase();
 $('xp-current-title').textContent=portal.title;
 $('xp-current-detail').textContent=details[portal.id];
 $('xp-enter').href=portal.href;
 $('xp-track-count').textContent=count+' / '+String(PORTALS.length).padStart(2,'0');
 $('xp-track').style.width=((selected+1)/PORTALS.length*100)+'%';
 if(announce)$('xp-announcement').textContent='Selected: '+portal.title+'. '+details[portal.id];
 controller?.selectPortal(portal.id);
 focusSelection();
}
buttons.forEach((btn,i)=>btn.addEventListener('click',()=>select(i)));
filterButtons.forEach(control=>control.addEventListener('click',()=>{
 clearTour();showCategory(control.dataset.worldFilter);
 $('xp-announcement').textContent=control.dataset.worldFilter+' destinations selected. '+visibleIndexes().length+' available worlds.';
}));
$('xp-portal-list').addEventListener('keydown',event=>{
 if(event.key!=='ArrowDown'&&event.key!=='ArrowUp')return;
 event.preventDefault();
 stepSelection(event.key==='ArrowDown'?1:-1);
 buttons[selected]?.focus({preventScroll:true});
});
$('xp-next').addEventListener('click',()=>stepSelection(1));
$('xp-prev').addEventListener('click',()=>stepSelection(-1));
$('xp-motion').addEventListener('click',()=>{
 paused=!paused;
 $('xp-motion').textContent=paused?'Resume motion':'Pause motion';
 $('xp-motion').setAttribute('aria-pressed',String(paused));
 controller?.setPaused(paused);
 if(paused)clearTour();
});
function tourStep(step,start){
 if(!touring||paused||step>PORTALS.length){clearTour();return;}
 select((start+step)%PORTALS.length,{stopTour:false});
 tourTimer=setTimeout(()=>tourStep(step+1,start),2550);
}
$('xp-explore').addEventListener('click',()=>{
 if(touring){clearTour();return;}
 if(paused){$('xp-announcement').textContent='Motion is paused. Resume motion to start the guided camera tour.';return;}
 showCategory('All',{autoselect:false});
 touring=true;
 $('xp-explore').textContent='Stop the tour ■';
 tourStep(1,selected);
});
window.addEventListener('keydown',event=>{
 const target=event.target;
 if(target?.matches?.('input, textarea, select, [contenteditable]'))return;
 if(event.key==='ArrowRight'&&!target?.closest?.('button,a')){event.preventDefault();stepSelection(1);}
 if(event.key==='ArrowLeft'&&!target?.closest?.('button,a')){event.preventDefault();stepSelection(-1);}
 if(/^[1-9]$/.test(event.key)){showCategory('All',{autoselect:false});select(Number(event.key)-1);}
 if(event.key==='Escape'&&touring)clearTour();
});
const canvasHost=$('experience-space');
canvasHost.addEventListener('brootherhood:portal',event=>{
 const index=PORTALS.findIndex(p=>p.id===event.detail?.id);
 if(index>=0&&selected!==index)select(index);
});
// Smooth touch swipes and paced wheel-navigation are optional, never override page scroll on mobile.
let touchStart=null;
canvasHost.addEventListener('touchstart',e=>{
 if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
},{passive:true});
canvasHost.addEventListener('touchend',e=>{
 if(!touchStart||!e.changedTouches.length)return;
 const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
 if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.6)stepSelection(dx<0?1:-1);
 touchStart=null;
},{passive:true});
canvasHost.addEventListener('wheel',e=>{
 if(innerWidth<900||Math.abs(e.deltaY)<10)return;
 const time=performance.now();
 if(time-lastWheel<780)return;
 lastWheel=time;
 stepSelection(e.deltaY>0?1:-1);
},{passive:true});
const isReduced=()=>reduced.matches;
const onMediaChange=()=>{
 if(isReduced()&&!paused){paused=true;$('xp-motion').textContent='Resume motion';$('xp-motion').setAttribute('aria-pressed','true');controller?.setPaused(true);clearTour();}
};
reduced.addEventListener?.('change',onMediaChange);
$('xp-motion').textContent=paused?'Resume motion':'Pause motion';
$('xp-motion').setAttribute('aria-pressed',String(paused));
select(0,{announce:false});
async function boot(){
 try{
  controller=await mountUniverse(canvasHost,{
   mode:'experience',
   onReady:()=>{
    canvasHost.classList.add('is-ready');
    $('space-fallback').hidden=true;
    $('xp-render-status').textContent='Nine floating 3D worlds active · Select a portal';
   },
   onPortal:id=>{
    const i=PORTALS.findIndex(p=>p.id===id);
    if(i>=0)select(i);
   }
  });
  controller.setPaused(paused);
  controller.selectPortal(PORTALS[selected].id);
 }catch(error){
  $('xp-render-status').textContent='3D unavailable · All nine worlds remain accessible';
  $('space-fallback').hidden=false;
  $('xp-announcement').textContent='WebGL could not load. You can still choose and enter any world using the accessible buttons.';
 }
}
boot();
window.addEventListener('pagehide',()=>{clearTour();controller?.dispose();},{once:true});
