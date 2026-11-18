/* BROOTHERHOOD original articulated 3D guide and scroll-controlled discovery world.
   Built from procedural geometry, not a static image or looping video.
   Three.js is a pinned, external runtime module; 2D learning works without it. */
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const prefersLess = matchMedia('(prefers-reduced-motion: reduce)');
const onSmallScreen = matchMedia('(max-width: 760px)');
const introText = {
  fractions: "Look closely: fractions reveal how equal pieces make a whole.",
  circuit: "Imagine electricity flowing through a circuit. Voltage and resistance change its current.",
  eco: "Your choices matter. Let's explore a clearly hypothetical sustainability model."
};
function setCaption(text) { const el=document.getElementById('guide-caption');if(el)el.textContent=text; }
function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
function color(hex){return hex;}
export async function launchJourney() {
  const host=document.getElementById('guide-canvas');
  const section=document.getElementById('journey');
  if(!host||!section) return;
  const fallback=document.getElementById('guide-fallback');
  if(prefersLess.matches || !('WebGLRenderingContext' in window) || navigator.connection?.saveData){
    setCaption('Explore each world with the accessible learning cards below. Motion is optional.');
    const toggle=document.getElementById('guide-render-toggle'); if(toggle){toggle.textContent='3D paused for accessibility';toggle.disabled=true;}
    return;
  }
  let THREE;
  try { THREE=await import(CDN); } catch {
    setCaption('3D is unavailable right now. All three interactive labs remain available below.');
    const toggle=document.getElementById('guide-render-toggle'); if(toggle){toggle.textContent='3D unavailable';toggle.disabled=true;}
    return;
  }
  let renderer;
  try { renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:onSmallScreen.matches?'low-power':'high-performance'}); }
  catch {setCaption('Your device does not support WebGL. Explore the fully functional labs below.');const toggle=document.getElementById('guide-render-toggle');if(toggle){toggle.textContent='3D unsupported';toggle.disabled=true;}return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,onSmallScreen.matches?1.15:1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.35;
  renderer.shadowMap.enabled=!onSmallScreen.matches;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  host.replaceChildren(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden','true');
  renderer.domElement.style.width='100%';renderer.domElement.style.height='100%';renderer.domElement.style.display='block';
  fallback?.classList.add('guide-fallback-hidden');

  const scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x071c2f,0.018);
  const camera=new THREE.PerspectiveCamera(43,1,0.1,90);
  camera.position.set(-4.3,4.25,10.8);
  const hemi=new THREE.HemisphereLight(0xc6f2ff,0x082337,2.3);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xe8fdec,3.8);sun.position.set(-5,12,8);sun.castShadow=!onSmallScreen.matches;
  sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.near=1;sun.shadow.camera.far=32;sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;scene.add(sun);
  const pink=new THREE.PointLight(0x80cfff,55,25);pink.position.set(1,5,-6);scene.add(pink);
  const lime=new THREE.PointLight(0xcafa70,33,16);lime.position.set(-5,2,3);scene.add(lime);
  const mats={
    black:new THREE.MeshStandardMaterial({color:0x0d2536,metalness:.54,roughness:.32}),
    mint:new THREE.MeshStandardMaterial({color:0x80ead3,metalness:.5,roughness:.22,emissive:0x0b7063,emissiveIntensity:.25}),
    lime:new THREE.MeshStandardMaterial({color:0xd4f66a,metalness:.16,roughness:.3,emissive:0x6b8f2a,emissiveIntensity:.3}),
    cyan:new THREE.MeshStandardMaterial({color:0x2cbae4,metalness:.57,roughness:.19,emissive:0x006488,emissiveIntensity:.35}),
    blue:new THREE.MeshStandardMaterial({color:0x0f426c,metalness:.5,roughness:.25}),
    glass:new THREE.MeshPhysicalMaterial({color:0x54b6c8,metalness:.12,roughness:.1,transparent:true,opacity:.24,side:THREE.DoubleSide}),
    skin:new THREE.MeshStandardMaterial({color:0xc99170,roughness:.77}),
    hair:new THREE.MeshStandardMaterial({color:0x19212b,roughness:.7}),
    jacket:new THREE.MeshStandardMaterial({color:0x4db5ae,roughness:.55,metalness:.15}),
    pants:new THREE.MeshStandardMaterial({color:0x173a65,roughness:.73}),
    shoes:new THREE.MeshStandardMaterial({color:0xdef1ec,roughness:.4}),
    white:new THREE.MeshStandardMaterial({color:0xf3f7eb,emissive:0x4b6355,emissiveIntensity:.18,roughness:.35})
  };
  function mesh(geometry,material,parent,x=0,y=0,z=0) {
    const o=new THREE.Mesh(geometry,material);
    o.position.set(x,y,z);o.castShadow=!onSmallScreen.matches;o.receiveShadow=!onSmallScreen.matches;
    parent.add(o);return o;
  }
  function platform(x,glow) {
    const base=mesh(new THREE.CylinderGeometry(3.3,2.8,.26,64),mats.black,scene,x,-.23,-3);
    base.receiveShadow=true;mesh(new THREE.TorusGeometry(3.13,.08,8,72),glow,scene,x,-.08,-3).rotation.x=Math.PI/2;
    mesh(new THREE.CylinderGeometry(2.92,2.92,.035,64),mats.glass,scene,x,-.08,-3);
    for(let i=0;i<14;i++){
      const theta=i*Math.PI*2/14;
      mesh(new THREE.BoxGeometry(.085,.13,.14),glow,scene,x+2.72*Math.cos(theta),.08,-3+2.72*Math.sin(theta));
    }
  }
  [-5,0,5].forEach((x,i)=>platform(x,[mats.lime,mats.cyan,mats.mint][i]));
  // A lightweight bridge of individually suspended glass panels.
  for(let i=0;i<31;i++){
    const x=-6+i*.39;
    const tile=mesh(new THREE.BoxGeometry(.32,.042,.9),i%4===0?mats.mint:mats.glass,scene,x,-.01,0.1);
    tile.rotation.y=Math.sin(i*.3)*.05;
  }
  const stars=new Float32Array(240*3);
  for(let i=0;i<240;i++){stars[i*3]=-14+Math.random()*28;stars[i*3+1]=.8+Math.random()*12;stars[i*3+2]=-16+Math.random()*12;}
  const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(stars,3));
  scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xc4f4dd,size:.045,transparent:true,opacity:.68,sizeAttenuation:true})));
  // Real 3D mathematical fraction pieces.
  const mathGroup=new THREE.Group();mathGroup.position.set(-5,1.6,-3);scene.add(mathGroup);
  for(let i=0;i<8;i++){
    const wedge=mesh(new THREE.CylinderGeometry(1.05,1.05,.24,24,1,false,(Math.PI*2*i)/8,Math.PI*2/8-.018),i<3?mats.lime:mats.blue,mathGroup);
    wedge.rotation.x=.25;
  }
  const orbit=mesh(new THREE.TorusGeometry(1.55,.025,8,80),mats.mint,mathGroup);orbit.rotation.x=1.12;
  // Real 3D circuit artifacts: a luminous bulb, battery, and wiring.
  const circuit=new THREE.Group();circuit.position.set(0,1.6,-3);scene.add(circuit);
  const battery=mesh(new THREE.CylinderGeometry(.45,.45,.85,30),mats.blue,circuit,-1,0,0);battery.rotation.z=Math.PI/2;
  mesh(new THREE.CylinderGeometry(.29,.29,.08,24),mats.lime,circuit,-.55,0,0).rotation.z=Math.PI/2;
  const bulb=mesh(new THREE.SphereGeometry(.67,28,22),mats.white,circuit,.9,.23,0);
  mesh(new THREE.TorusGeometry(.7,.045,8,64),mats.cyan,circuit,.9,.23,0);
  const wirePath=new THREE.CatmullRomCurve3([new THREE.Vector3(-1,0,0),new THREE.Vector3(-1,-1,0),new THREE.Vector3(1.1,-1,0),new THREE.Vector3(1.1,-.4,0)]);
  mesh(new THREE.TubeGeometry(wirePath,50,.045,8,false),mats.cyan,circuit);
  // Original stylized planet, without externally sourced assets.
  const eco=new THREE.Group();eco.position.set(5,1.65,-3);scene.add(eco);
  mesh(new THREE.SphereGeometry(1.02,40,32),mats.blue,eco);
  for(let i=0;i<18;i++){
    const lat=Math.sin(i*4.1),ang=i*2.399;
    const norm=new THREE.Vector3(Math.cos(ang)*Math.sqrt(1-lat*lat),lat,Math.sin(ang)*Math.sqrt(1-lat*lat));
    const patch=mesh(new THREE.IcosahedronGeometry(.18+(i%4)*.047,0),i%3===0?mats.lime:mats.mint,eco,...norm.clone().multiplyScalar(1.005).toArray());
    patch.scale.set(1.35,.6,.9);
  }
  const ecoRing=mesh(new THREE.TorusGeometry(1.52,.025,8,80),mats.mint,eco);ecoRing.rotation.x=.45;

  // Custom articulated, rigged human explorer: joint pivots for arms, legs, head.
  const guide=new THREE.Group();guide.name='Explorer';scene.add(guide);guide.position.set(-5,.03,.5);
  const body=new THREE.Group();guide.add(body);
  mesh(new THREE.CapsuleGeometry(.31,.66,7,16),mats.jacket,body,0,1.46,0);
  mesh(new THREE.BoxGeometry(.24,.29,.12),mats.lime,body,0,1.58,.30);
  const headPivot=new THREE.Group();headPivot.position.set(0,2.11,0);body.add(headPivot);
  mesh(new THREE.SphereGeometry(.26,24,16),mats.skin,headPivot,0,.15,0);
  mesh(new THREE.SphereGeometry(.269,24,12,0,Math.PI*2,0,Math.PI*.45),mats.hair,headPivot,0,.19,0);
  mesh(new THREE.SphereGeometry(.025,12,8),mats.hair,headPivot,-.086,.17,.244);
  mesh(new THREE.SphereGeometry(.025,12,8),mats.hair,headPivot,.086,.17,.244);
  mesh(new THREE.TorusGeometry(.07,.009,6,20,Math.PI),mats.hair,headPivot,0,.04,.25).rotation.z=Math.PI;
  const leftArm=new THREE.Group();leftArm.position.set(-.40,1.91,0);body.add(leftArm);
  mesh(new THREE.CapsuleGeometry(.112,.48,5,12),mats.jacket,leftArm,0,-.34,0);
  mesh(new THREE.SphereGeometry(.108,14,10),mats.skin,leftArm,0,-.73,0);
  const rightArm=new THREE.Group();rightArm.position.set(.40,1.91,0);body.add(rightArm);
  mesh(new THREE.CapsuleGeometry(.112,.48,5,12),mats.jacket,rightArm,0,-.34,0);
  mesh(new THREE.SphereGeometry(.108,14,10),mats.skin,rightArm,0,-.73,0);
  const leftLeg=new THREE.Group();leftLeg.position.set(-.18,1.01,0);body.add(leftLeg);
  mesh(new THREE.CapsuleGeometry(.15,.58,5,14),mats.pants,leftLeg,0,-.43,0);
  mesh(new THREE.BoxGeometry(.32,.17,.44),mats.shoes,leftLeg,0,-.85,.11);
  const rightLeg=new THREE.Group();rightLeg.position.set(.18,1.01,0);body.add(rightLeg);
  mesh(new THREE.CapsuleGeometry(.15,.58,5,14),mats.pants,rightLeg,0,-.43,0);
  mesh(new THREE.BoxGeometry(.32,.17,.44),mats.shoes,rightLeg,0,-.85,.11);
  const guideRig={body,headPivot,leftArm,rightArm,leftLeg,rightLeg};
  // Three.js AnimationMixer drives a subtle breathing pose; joint motion is blended in updatePose.
  const mixer=new THREE.AnimationMixer(body);
  const idleClip=new THREE.AnimationClip('breathing',2,[
    new THREE.NumberKeyframeTrack('.position[y]',[0,1,2],[0,.035,0])
  ]);
  mixer.clipAction(idleClip).play();

  let action='wave',actionUntil=performance.now()+2100,targetX=-5,currentX=-5,travel=0,lastIndex=-1;
  const scrollPosition=()=> {
    const rect=section.getBoundingClientRect();
    const range=Math.max(1,section.offsetHeight-innerHeight);
    return clamp(-rect.top/range,0,1);
  };
  const chapters=[...section.querySelectorAll('.guide-chapter')];
  let currentIndex=0;
  let welcomed=false;
  function updateSceneTarget() {
    const p=scrollPosition();
    targetX=-5+p*10;
    const i=p<.333?0:p<.666?1:2;
    if(!welcomed && p>0.045){welcomed=true;setCaption(introText.fractions);}
    if(i!==lastIndex){
      lastIndex=i;currentIndex=i;
      const key=['fractions','circuit','eco'][i];
      if(welcomed)setCaption(introText[key]);
      chapters.forEach((el,n)=>el.classList.toggle('guide-chapter-active',n===i));
    }
  }
  document.addEventListener('brootherhood:labchange',event=>{
    const key=event.detail?.id;const n=['fractions','circuit','eco'].indexOf(key);
    if(n>=0){action='point';actionUntil=performance.now()+1300;setCaption(introText[key]);}
  });
  document.addEventListener('brootherhood:guide',event=>{
    setCaption(event.detail?.message||'Explore at your own pace.');
    action=event.detail?.action||'point';actionUntil=performance.now()+2000;
  });
  document.addEventListener('brootherhood:mission',event=>{
    const won=Boolean(event.detail?.passed);
    action=won?'celebrate':'point';actionUntil=performance.now()+1900;
    setCaption(won?'Excellent discovery! You understood the concept.':'Try again. Every great discovery begins with a question.');
  });

  function moveJoints(dt,now) {
    const movement=clamp(targetX-currentX,-dt*3.1,dt*3.1);
    currentX+=movement;
    guide.position.x=currentX;
    guide.position.y=.03+Math.sin(now*1.6)*.02;
    const moving=Math.abs(targetX-currentX)>.06;
    const mode=performance.now()<actionUntil?action:(moving?'walk':'idle');
    const ease=clamp(dt*7,0,1);
    const stride=now*7.4;
    const swing=mode==='walk'?Math.sin(stride)*.55:0;
    const poses=mode==='wave'?[-.08,-2.45,0,0]:mode==='point'?[-.15,-1.25,0,0]:mode==='celebrate'?[2.35,-2.35,.09,-.09]:[swing*.65,-swing*.65,swing,-swing];
    leftArm.rotation.z += (poses[0]-leftArm.rotation.z)*ease;
    rightArm.rotation.z += (poses[1]-rightArm.rotation.z)*ease;
    leftLeg.rotation.x += (poses[2]-leftLeg.rotation.x)*ease;
    rightLeg.rotation.x += (poses[3]-rightLeg.rotation.x)*ease;
    body.rotation.z += ((mode==='walk'?.03*Math.sin(stride):0)-body.rotation.z)*ease;
    headPivot.rotation.y += ((mode==='point'?.27*Math.sin(now*1.2):0)-headPivot.rotation.y)*ease;
    if(mode==='wave'){rightArm.rotation.x=Math.sin(now*8)*.23;}
    else rightArm.rotation.x += (0-rightArm.rotation.x)*ease;
    if(mode==='celebrate')guide.rotation.y+=dt*1.7;
    else guide.rotation.y+=(0-guide.rotation.y)*ease;
    mathGroup.rotation.y+=dt*.16;orbit.rotation.z+=dt*.16;
    circuit.rotation.y=Math.sin(now*.4)*.08;
    bulb.material.emissiveIntensity=.18+Math.sin(now*3)*.08;
    eco.rotation.y+=dt*.25;ecoRing.rotation.y+=dt*.23;
    const camTargetX=currentX*.75;
    camera.position.x += (camTargetX-camera.position.x)*ease*.45;
    camera.lookAt(camera.position.x*.65,1.2,-2.1);
  }
  let active=false,raf=0,last=0,t=0,paused=false;
  function onFrame(ms) {
    if(!active||paused)return;
    const dt=clamp((ms-last)/1000||.016,0,.05);last=ms;t+=dt;
    updateSceneTarget();
    mixer.update(dt);moveJoints(dt,t);
    renderer.render(scene,camera);
    raf=requestAnimationFrame(onFrame);
  }
  function resize(){
    const width=Math.max(300,host.clientWidth),height=Math.max(290,host.clientHeight);
    camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,onSmallScreen.matches?1.15:1.75));
  }
  const observer=new IntersectionObserver(entries=>{
    active=entries[0].isIntersecting;
    if(active&&!paused){action='wave';actionUntil=performance.now()+1500;resize();last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(onFrame);}
    else cancelAnimationFrame(raf);
  },{threshold:0.02});
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  observer.observe(section);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(raf);}else if(active&&!paused){last=0;raf=requestAnimationFrame(onFrame);}
  });
  const toggle=document.getElementById('guide-render-toggle');
  toggle?.addEventListener('click',()=>{
    paused=!paused;
    toggle.textContent=paused?'Resume 3D':'Pause 3D';
    toggle.setAttribute('aria-pressed',String(paused));
    if(paused){cancelAnimationFrame(raf);host.classList.add('guide-paused');}
    else {host.classList.remove('guide-paused');last=0;if(active)raf=requestAnimationFrame(onFrame);}
  });
  resize();updateSceneTarget();
}
