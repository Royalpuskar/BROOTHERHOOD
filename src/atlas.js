/**
 * Accessible homepage learning atlas.
 * Category filters are functional; each card links to a real existing lesson.
 * Hover tilt is optional and never affects keyboard or reduced-motion users.
 */
const atlas=document.getElementById('learning-universe');
if(atlas){
 const controls=[...atlas.querySelectorAll('[data-atlas-filter]')];
 const cards=[...atlas.querySelectorAll('[data-atlas-category]')];
 const status=document.getElementById('atlas-filter-status');
 function filter(category){
  let count=0;
  for(const card of cards){
   const visible=category==='All'||card.dataset.atlasCategory===category;
   card.hidden=!visible;
   if(visible)count++;
  }
  for(const button of controls){
   button.setAttribute('aria-pressed',String(button.dataset.atlasFilter===category));
  }
  if(status)status.textContent='Showing '+count+' '+(category==='All'?'learning worlds':category.toLowerCase()+' '+(count===1?'world':'worlds'))+'. Choose a floating island to open its lesson.';
 }
 for(const button of controls){
  button.addEventListener('click',()=>filter(button.dataset.atlasFilter));
 }
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 if(matchMedia('(hover: hover) and (pointer: fine)').matches&&!motion.matches){
  for(const card of cards){
   let pending=0;
   card.addEventListener('pointermove',event=>{
    if(motion.matches||pending)return;
    const rect=card.getBoundingClientRect();
    const x=Math.max(-1,Math.min(1,(event.clientX-rect.left)/Math.max(1,rect.width)*2-1));
    const y=Math.max(-1,Math.min(1,(event.clientY-rect.top)/Math.max(1,rect.height)*2-1));
    pending=requestAnimationFrame(()=>{
     card.style.setProperty('--atlas-tilt-x',(x*3.5).toFixed(2));
     card.style.setProperty('--atlas-tilt-y',(-y*3.5).toFixed(2));
     pending=0;
    });
   },{passive:true});
   const reset=()=>{
    if(pending){cancelAnimationFrame(pending);pending=0;}
    card.style.setProperty('--atlas-tilt-x','0');
    card.style.setProperty('--atlas-tilt-y','0');
   };
   card.addEventListener('pointerleave',reset);
   card.addEventListener('blur',reset);
  }
 }
 filter('All');
}
