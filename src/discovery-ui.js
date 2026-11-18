import { WORLDS, LEVELS, CASES, missionKey, evaluateMission, safeAchievements, earnedTitle } from './discovery.js';
const root = document.querySelector('#discovery-engine');
if (root) {
  const $ = s => root.querySelector(s);
  const storageKey = 'brootherhood.discovery.v1';
  let achievements = [];
  try { achievements = safeAchievements(localStorage.getItem(storageKey)); } catch {}
  let world = 'fractions', level = 'starter', tries = 0;
  const hints = { fractions: 'Think about equal pieces of the same whole.', circuit: 'Use voltage, current, and resistance together.', eco: 'The classroom model uses assumed values, not measured emissions.' };
  function speak(message,action='idle') {
    document.dispatchEvent(new CustomEvent('brootherhood:guide',{detail:{message,action}}));
  }
  function refresh() {
    const challenge = CASES[world][level];
    $('#discovery-case-title').textContent = WORLDS[world].name + ' / ' + level.toUpperCase();
    $('#discovery-prompt').textContent = challenge.prompt;
    $('#discovery-answer').value = '';
    $('#discovery-feedback').textContent = 'Reason through the scenario, then test your answer.';
    $('#discovery-feedback').className='discovery-feedback';
    $('#discovery-hint').hidden = true;
    $('#discovery-reflection').hidden = true;
    $('#discovery-answer').setAttribute('aria-label', 'Answer for ' + WORLDS[world].name + ' ' + level);
    $('#discovery-objective').textContent = world==='fractions' ? 'Understand fractions and proportions.' : world==='circuit' ? 'Apply basic ideal-circuit calculations.' : 'Reason with clearly labeled hypothetical environmental values.';
    $('#discovery-score').textContent=achievements.length + ' / 9 missions';
    $('#discovery-level').textContent=earnedTitle(achievements);
    $('#discovery-history').textContent=achievements.length ? achievements.map(k=>k.replace(':',' · ')).join('  •  ') : 'Your completed missions will appear here.';
    for(const btn of root.querySelectorAll('[data-discovery-world]')){
      const active=btn.dataset.discoveryWorld===world; btn.setAttribute('aria-pressed',String(active));btn.classList.toggle('selected',active);
    }
    $('#discovery-difficulty').value=level;
  }
  root.querySelectorAll('[data-discovery-world]').forEach(btn=>btn.addEventListener('click',()=>{
    world=btn.dataset.discoveryWorld; tries=0; refresh();
    speak(world==='fractions' ? "Let's explore how fractions describe equal parts of a whole." : world==='circuit' ? "Let's investigate how voltage and resistance change the current." : "Let's explore sustainability using our illustrative travel model.",'point');
  }));
  $('#discovery-difficulty').addEventListener('change',ev=>{level=ev.target.value;tries=0;refresh();speak("New challenge selected. You've got this.",'point');});
  $('#discovery-hint-button').addEventListener('click',()=>{
    $('#discovery-hint').hidden=false;
    $('#discovery-hint').textContent='Hint: '+CASES[world][level].hint;
    speak(CASES[world][level].hint,'point');
  });
  $('#discovery-next').addEventListener('click',()=>{
    const next=(LEVELS.indexOf(level)+1)%LEVELS.length;level=LEVELS[next];tries=0;refresh();
    speak("Ready for the next discovery? Let's keep exploring!",'walk');
  });
  $('#discovery-go-lab').addEventListener('click',()=>{
    const tab=document.querySelector('[data-tab="'+world+'"]');
    if(tab){tab.click();document.querySelector('#lab')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  });
  $('#discovery-check').addEventListener('click',()=>{
    const answer=$('#discovery-answer').value;
    const result=evaluateMission(world,level,answer);
    const output=$('#discovery-feedback');
    if(!result.valid){output.textContent=result.message;output.className='discovery-feedback';return;}
    tries+=1;
    if(result.correct){
      const key=missionKey(world,level);
      if(!achievements.includes(key)){achievements.push(key);try{localStorage.setItem(storageKey,JSON.stringify(achievements));}catch{}}
      output.textContent='Discovery unlocked! '+result.message;
      output.className='discovery-feedback success';
      $('#discovery-reflection').hidden=false;
      $('#discovery-reflection').textContent='Reflect: What changed your understanding? Try adjusting the relevant lab controls to see this principle in action.';
      refreshSummary();
      speak('Excellent discovery! You reasoned through the concept. Ready for the next mission?','celebrate');
    }else{
      output.textContent=result.message+(tries>=2?' '+CASES[world][level].hint:'');
      output.className='discovery-feedback needs-work';
      speak("Not quite. Let's revisit the relationship and try again.",'idle');
    }
  });
  function refreshSummary(){
    $('#discovery-score').textContent=achievements.length+' / 9 missions';
    $('#discovery-level').textContent=earnedTitle(achievements);
    $('#discovery-history').textContent=achievements.map(k=>k.replace(':',' · ')).join('  •  ');
    document.dispatchEvent(new CustomEvent('brootherhood:achievement',{detail:{count:achievements.length,title:earnedTitle(achievements)}}));
  }
  refresh();
  const completed = achievements.length;
  if(completed) refreshSummary();
}
