import {mountUniverse} from './universe-v2.js';

// Share the real interactive 3D architecture with the cinematic homepage.
export async function startDigitalScene(host){
 const hero=document.querySelector('#home');
 try{
  const controller=await mountUniverse(host,{mode:'hero',onReady:()=>{
   const fallback=document.querySelector('.scene-fallback');
   if(fallback)fallback.style.display='none';
   if(hero)hero.classList.add('universe-ready');
  }});
  return controller;
 }catch(error){
  document.querySelector('.scene-fallback')?.classList.add('fallback-visible');
  throw error;
 }
}
