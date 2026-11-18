// Lightweight, original scroll-driven visual motion. Respects low-power and reduced-motion preferences.
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const fine=matchMedia('(hover:hover) and (pointer:fine)');
const hero=document.querySelector('#home');
const flight=document.querySelector('#flight');
const captions=[
 '01 / Code Lab — make ideas executable.',
 '02 / Cyber Defense — identify threats and protect accounts.',
 '03 / AI Core — see how training data changes predictions.',
 '04 / Network Nexus — follow a packet across the Internet.',
 '05 / Builders’ Realm — connect applications from interface to data.'
];
let frame=0,visibleFlight=false,previousIndex=-1;
const interactive=!reduce.matches;
if(interactive&&hero&&fine.matches){
 let nextX=0,nextY=0,pending=false;
 hero.addEventListener('pointermove',event=>{
  const rect=hero.getBoundingClientRect();
  nextX=(event.clientX-rect.left)/rect.width*2-1;
  nextY=(event.clientY-rect.top)/rect.height*2-1;
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{
   hero.style.setProperty('--float-x',String(Math.max(-1,Math.min(1,nextX))));
   hero.style.setProperty('--float-y',String(Math.max(-1,Math.min(1,nextY))));
   pending=false;
  });
 },{passive:true});
 hero.addEventListener('pointerleave',()=>{
  hero.style.setProperty('--float-x','0');
  hero.style.setProperty('--float-y','0');
 },{passive:true});
}
// The anchored floating world changes only while its section is near the viewport.
if(flight){
 const chapters=[...flight.querySelectorAll('.flight-chapter')];
 const update=()=>{
  frame=0;
  const rect=flight.getBoundingClientRect();
  const max=Math.max(1,flight.offsetHeight-innerHeight);
  const p=Math.max(0,Math.min(1,-rect.top/max));
  flight.style.setProperty('--flight-progress',String(interactive?p:0));
  const index=Math.min(4,Math.floor(Math.min(.999,p)*5));
  if(previousIndex!==index){
   previousIndex=index;
   chapters.forEach((c,i)=>c.classList.toggle('flight-active',i===index));
   const caption=document.getElementById('flight-caption'),count=document.getElementById('flight-count');
   if(caption)caption.textContent=captions[index];
   if(count)count.textContent=String(index+1).padStart(2,'0')+' / 05';
  }
 };
 const schedule=()=>{
  if(!visibleFlight||frame)return;
  frame=requestAnimationFrame(update);
 };
 const observer=new IntersectionObserver(entries=>{
  visibleFlight=entries[0].isIntersecting;
  if(visibleFlight)schedule();
 },{rootMargin:'180px'});
 observer.observe(flight);
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
}
// Reveal content as it arrives, but never hide it if reduced motion or observers are unavailable.
if(interactive && 'IntersectionObserver' in window){
 const targets=document.querySelectorAll('.overview-card,.lab-card,.academy-quiz-card,.academy-roadmap-card,.academy-main,.academy-sidebar');
 targets.forEach(target=>target.dataset.rise='');
 const reveal=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('in-view');reveal.unobserve(entry.target);}
  });
 },{threshold:.08,rootMargin:'0px 0px 60px 0px'});
 targets.forEach(x=>reveal.observe(x));
}
// Light cursor-responsive perspective on world cards. No expensive continuous rendering.
if(interactive&&fine.matches){
 document.querySelectorAll('.overview-card').forEach(card=>{
  let raf=0,x=0,y=0;
  card.addEventListener('pointermove',event=>{
   const r=card.getBoundingClientRect();
   x=(event.clientX-r.left)/r.width-.5;
   y=(event.clientY-r.top)/r.height-.5;
   if(raf)return;
   raf=requestAnimationFrame(()=>{
    card.style.setProperty('--card-tilt-y',Math.round(x*11)+'deg');
    card.style.setProperty('--card-tilt-x',Math.round(-y*9)+'deg');raf=0;
   });
  },{passive:true});
  card.addEventListener('pointerleave',()=>{
   card.style.setProperty('--card-tilt-x','0deg');card.style.setProperty('--card-tilt-y','0deg');
  },{passive:true});
 });
}
