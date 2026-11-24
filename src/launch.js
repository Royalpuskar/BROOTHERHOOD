/**
 * BROOTHERHOOD cinematic launch — lightweight accessible interactions.
 * Search results and carousel destinations are real internal learning links.
 * Real-time 3D rendering is provided independently by src/universe-v2.js.
 */
const $=id=>document.getElementById(id);
const searchDialog=$('launch-search-dialog');
const searchOpen=$('launch-search-open');
const searchClose=$('launch-search-close');
const searchInput=$('launch-search-input');
const searchResults=$('launch-search-results');
const destinations=[
 {name:'3D Floating Universe',category:'Immersive world',href:'./experience/',keywords:'nine 9 floating islands science explore'},
 {name:'Guided 3D Tour',category:'Animated exploration',href:'./experience/?tour=1',keywords:'watch demo orbit flyover cinematic'},
 {name:'Computer Science Study Lab',category:'Seven courses · 24 lessons',href:'./syllabus/',keywords:'digital systems linear algebra discrete mathematics algorithms networks'},
 {name:'Code Studio',category:'Real programming tools',href:'./studio/',keywords:'cpp c++ python java javascript compiler editor run'},
 {name:'Cybersecurity Arena',category:'Defensive security practice',href:'#cyber-arena',keywords:'phishing mfa passwords missions'},
 {name:'Pocket 3D Lab',category:'Interactive human heart',href:'./pocket-3d-lab/',keywords:'biology heart chambers valves blood circulation'},
 {name:'Electricity Studio',category:'Physics simulation',href:'./legacy/#circuit',keywords:'voltage current ohms resistance circuit'},
 {name:'Fraction Playground',category:'Mathematics simulation',href:'./legacy/#fractions',keywords:'maths fractions numbers'},
 {name:'Eco Planet',category:'Environmental science',href:'./legacy/#eco',keywords:'climate transport sustainability environment'},
 {name:'AI Laboratory',category:'Machine learning lesson',href:'#ai-core',keywords:'classification knn experiment'},
 {name:'Horizon Connect',category:'Event platform demo',href:'./horizon/',keywords:'innovation expo events cybersecurity schedule ai assistant'},
 {name:'My Learning Progress',category:'Local achievement tracker',href:'#progress',keywords:'points badges progress completed'},
 {name:'All Learning Worlds',category:'Browse every destination',href:'#learning-universe',keywords:'worlds catalogue browse'},
];
function drawSearch(value=''){
 if(!searchResults)return;
 const query=value.trim().toLowerCase();
 const items=destinations.filter(item=>(item.name+' '+item.category+' '+item.keywords).toLowerCase().includes(query));
 searchResults.replaceChildren();
 if(!items.length){
  const text=document.createElement('p');text.className='launch-search-empty';
  text.textContent='No results for that term. Try “heart”, “maths”, “cyber” or “coding”.';
  searchResults.append(text);return;
 }
 for(const item of items){
  const link=document.createElement('a');link.href=item.href;
  const label=document.createElement('span');label.textContent=item.name;
  const meta=document.createElement('small');meta.textContent=item.category+' ↗';
  link.append(label,meta);
  link.addEventListener('click',()=>{
   searchDialog?.close?.();
  });
  searchResults.append(link);
 }
}
if(searchDialog&&searchOpen&&searchClose&&searchInput){
 searchOpen.addEventListener('click',()=>{
  drawSearch(searchInput.value);
  if(typeof searchDialog.showModal==='function'&&!searchDialog.open)searchDialog.showModal();
  else searchDialog.setAttribute('open','');
  searchInput.focus();
 });
 searchClose.addEventListener('click',()=>{
  if(typeof searchDialog.close==='function')searchDialog.close();
  else searchDialog.removeAttribute('open');
 });
 searchInput.addEventListener('input',()=>drawSearch(searchInput.value));
 searchDialog.addEventListener('click',event=>{
  if(event.target===searchDialog)searchDialog.close();
 });
 window.addEventListener('keydown',event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){
   event.preventDefault();
   searchOpen.click();
  }
 });
 drawSearch();
}
const previews=[
 {name:'The Floating Universe',description:'Explore nine real-time 3D learning destinations.',href:'./experience/?tour=1',kind:'tour'},
 {name:'Pocket 3D Biology Lab',description:'Rotate the heart, explore anatomy and follow blood flow.',href:'./pocket-3d-lab/',kind:'biology'},
 {name:'Cybersecurity Challenge',description:'Choose safer responses to realistic digital threats.',href:'#cyber-arena',kind:'cyber'},
];
const prev=$('launch-preview-prev'),next=$('launch-preview-next');
const previewLink=$('launch-preview-link'),previewTitle=$('launch-preview-title'),previewDesc=$('launch-preview-desc');
const previewNumber=$('launch-preview-number'),previewVisual=document.querySelector('.launch-preview-visual');
const dots=[...document.querySelectorAll('[data-preview]')];
let previewIndex=0;
function showPreview(index){
 previewIndex=(index+previews.length)%previews.length;
 const item=previews[previewIndex];
 if(!previewLink||!previewTitle||!previewDesc||!previewNumber)return;
 previewTitle.textContent=item.name;
 previewDesc.textContent=item.description;
 previewLink.href=item.href;
 previewLink.textContent=item.kind==='tour'?'▶':'↗';
 previewLink.setAttribute('aria-label','Open '+item.name);
 previewNumber.textContent=String(previewIndex+1).padStart(2,'0')+' / '+String(previews.length).padStart(2,'0');
 if(previewVisual)previewVisual.dataset.kind=item.kind;
 for(const dot of dots)dot.setAttribute('aria-pressed',String(Number(dot.dataset.preview)===previewIndex));
}
prev?.addEventListener('click',()=>showPreview(previewIndex-1));
next?.addEventListener('click',()=>showPreview(previewIndex+1));
for(const dot of dots)dot.addEventListener('click',()=>showPreview(Number(dot.dataset.preview)));
showPreview(0);
