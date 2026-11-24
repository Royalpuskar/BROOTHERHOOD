/**
 * BROOTHERHOOD IMMERSIVE UNIVERSE v2
 * Original real-time Three.js scene. Procedural geometry, no stock scene or image.
 * Two variants: homepage cinematic background and accessible interactive expedition.
 * Rendering is capped/adaptive for mobile and high-density 4K-class displays.
 */
const THREE_URL='https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const PORTALS=Object.freeze([
 {id:'code',title:'CODE NEXUS',subtitle:'Real compilers and programming',href:'../studio/',color:0x69efff},
 {id:'cyber',title:'CYBER SHIELD',subtitle:'Defend the digital world',href:'../#cyber-arena',color:0xffce7b},
 {id:'ai',title:'AI LABORATORY',subtitle:'Train and test intelligence',href:'../#ai-core',color:0xb2a2ff},
 {id:'horizon',title:'HORIZON CONNECT',subtitle:'The connected event universe',href:'../horizon/',color:0xbafa70},
 {id:'build',title:'BUILDERS REALM',subtitle:'Make architecture work',href:'../#builders-realm',color:0x74f5c0}
]);
export const CAMERA_STOPS=Object.freeze([
 {position:[-6.8,5.7,19],target:[-7,1.3,-4]},
 {position:[-5.6,6.2,20],target:[-4.1,3.7,-10]},
 {position:[5.6,6.3,20],target:[4.1,3.7,-10]},
 {position:[7.4,5.5,19],target:[7.3,1.9,-4]},
 {position:[0,4.2,21],target:[0,-2.6,-14]}
]);
export async function mountUniverse(host,{mode='hero',onPortal,onReady}={}){
 if(!host||!window.WebGLRenderingContext)throw Error('This browser cannot display a WebGL world.');
 const T=await import(THREE_URL);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width: 800px)');
 const interactive=mode==='experience';
 const theme={
  deep:0x050b22,base:0x061a35,blue:0x12386c,steel:0x0b2a50,
  cyan:0x54dfff,lime:0xc3ff78,purple:0x9478ff,pink:0xff8ec7
 };
 const renderer=new T.WebGLRenderer({alpha:true,antialias:!mobile.matches,depth:true,powerPreference:mobile.matches?'low-power':'high-performance'});
 renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.55;
 renderer.setClearColor(0x050b20,0);
 const mobileView=mobile.matches,baseDpr=clamp(window.devicePixelRatio||1,1,mobileView?1.15:1.65);
 let adaptiveDpr=baseDpr;
 renderer.setPixelRatio(adaptiveDpr);
 const canvas=renderer.domElement;
 canvas.setAttribute('aria-hidden','true');
 canvas.className='universe-webgl';
 canvas.style.cssText='width:100%;height:100%;display:block;touch-action:pan-y';
 if(interactive){canvas.style.pointerEvents='auto';canvas.style.touchAction='pan-y';}
 else canvas.style.pointerEvents='none';
 // Preserve the accessible fallback until the renderer has fully initialized.
 host.querySelector(".universe-webgl")?.remove();
 host.prepend(canvas);
 const scene=new T.Scene();
 scene.fog=new T.FogExp2(0x071127,0.012);
 const camera=new T.PerspectiveCamera(interactive?46:41,1,.1,125);
 const cameraPos=new T.Vector3(0,5,interactive?28:26);
 // Camera starts centered and eases between the five portal routes.
 cameraPos.set(0,6,interactive?27:28);
 camera.position.copy(cameraPos);
 const cameraTarget=new T.Vector3(0,1.3,-6);
 scene.add(new T.HemisphereLight(0x80c9ff,0x040d2c,2.5));
 const sun=new T.DirectionalLight(0xc9e9ff,3.1);sun.position.set(-7,15,13);scene.add(sun);
 const rim=new T.DirectionalLight(0x9a77ff,2.1);rim.position.set(10,7,-12);scene.add(rim);
 const glow=new T.PointLight(0x23cbf3,85,34);glow.position.set(0,7,-4);scene.add(glow);
 const goldLight=new T.PointLight(0xc5fd8b,42,21);goldLight.position.set(8,4,0);scene.add(goldLight);
 const materials={
  obsidian:new T.MeshStandardMaterial({color:theme.base,metalness:.64,roughness:.29}),
  metal:new T.MeshStandardMaterial({color:theme.blue,metalness:.72,roughness:.23}),
  crystal:new T.MeshStandardMaterial({color:0x2fa8d6,metalness:.38,roughness:.22,emissive:0x074a89,emissiveIntensity:.85}),
  glass:new T.MeshPhysicalMaterial({color:0x7cddff,metalness:.12,roughness:.16,transparent:true,opacity:.25,side:T.DoubleSide,depthWrite:false}),
  neon:new T.MeshBasicMaterial({color:theme.cyan,blending:T.AdditiveBlending,depthWrite:false}),
  pearl:new T.MeshStandardMaterial({color:0xe7efff,metalness:.22,roughness:.43}),
  skin:new T.MeshStandardMaterial({color:0xc58b65,roughness:.69}),
  hair:new T.MeshStandardMaterial({color:0x1d1726,roughness:.76}),
  jacket:new T.MeshStandardMaterial({color:0x2366bb,metalness:.28,roughness:.41})
 };
 const box=(w,h,d)=>new T.BoxGeometry(w,h,d);
 const sphere=(r,s=16)=>new T.SphereGeometry(r,s,Math.max(8,Math.floor(s*.7)));
 const mesh=(parent,geometry,material,x=0,y=0,z=0)=>{
  const object=new T.Mesh(geometry,material);
  object.position.set(x,y,z);parent.add(object);return object;
 };
 const line=(parent,points,material,width=.026)=>{
  const path=new T.CatmullRomCurve3(points);
  return mesh(parent,new T.TubeGeometry(path,Math.max(12,points.length*11),width,5,false),material);
 };
 const pointsGeo=(count,spread,depth)=>{
  const coords=new Float32Array(count*3);
  // Deterministic star positions for stable render and visual tests.
  for(let i=0;i<count;i++){
   const u=Math.sin(i*127.1+91.7)*43758.5453,v=Math.sin(i*311.7+14.1)*22791.73,w=Math.sin(i*19.83+411.3)*71932.83;
   coords[i*3]=((u-Math.floor(u))-.5)*spread;
   coords[i*3+1]=((v-Math.floor(v))-.5)*spread*.74+3.5;
   coords[i*3+2]=-depth*(w-Math.floor(w))-14;
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(coords,3));return geo;
 };
 scene.add(new T.Points(pointsGeo(mobileView?420:1250,95,54),new T.PointsMaterial({
  color:0xb1dfff,size:mobileView?.078:.11,sizeAttenuation:true,transparent:true,opacity:.86,
  blending:T.AdditiveBlending,depthWrite:false
 })));
 const auroraGroup=new T.Group();scene.add(auroraGroup);
 for(let i=0;i<4;i++){
  const haloMat=new T.MeshBasicMaterial({color:[0x36adff,0x9f73f6,0x2de2cb,0x4e7dff][i],transparent:true,opacity:.09,depthWrite:false,side:T.DoubleSide});
  const g=mesh(auroraGroup,new T.PlaneGeometry(30+i*8,15+i*3),haloMat,0,5,-38-i*2);
  g.rotation.z=i*.55;
 }
 // The central orbital engine is constructed from independent 3D meshes.
 const engine=new T.Group();engine.position.set(0,3,-10);scene.add(engine);
 const darkInner=new T.MeshStandardMaterial({color:0x092758,metalness:.8,roughness:.18,emissive:0x123b7f,emissiveIntensity:.7});
 mesh(engine,new T.IcosahedronGeometry(2.15,3),darkInner);
 mesh(engine,new T.IcosahedronGeometry(2.29,2),new T.MeshBasicMaterial({color:0x31dfff,wireframe:true,transparent:true,opacity:.46,blending:T.AdditiveBlending,depthWrite:false}));
 const coreInner=mesh(engine,new T.IcosahedronGeometry(1.18,1),new T.MeshBasicMaterial({color:0xa8fbef,transparent:true,opacity:.82}));
 const orbitRings=[];
 for(let i=0;i<4;i++){
  const color=[theme.cyan,theme.lime,theme.purple,theme.pink][i];
  const orbital=mesh(engine,new T.TorusGeometry(3.3+i*.44,.032,8,126),
   new T.MeshBasicMaterial({color,transparent:true,opacity:.75,blending:T.AdditiveBlending,depthWrite:false}));
  orbital.rotation.x=.65+i*.36;orbital.rotation.y=i*.5;orbitRings.push(orbital);
 }
 for(let j=0;j<12;j++){
  const a=j*Math.PI/6;
  const item=mesh(engine,new T.OctahedronGeometry(j%3===0?.28:.14,0),
   j%3===0?materials.pearl:materials.neon,Math.cos(a)*4.7,Math.sin(a)*3.8,Math.sin(a*2)*.9);
  item.rotation.z=a;
 }
 // Five floating islands, each represented by a real 3D portal and a link target.
 const islandCoords=[
  [-9.1,1.25,-4.8],[-4.8,3.0,-12.5],[5.1,3.1,-12.8],[9,1.15,-4.9],[.4,-3.1,-17.5]
 ];
 const portals=[],islands=[];
 function buildIsland(def,i){
  const [x,y,z]=islandCoords[i],group=new T.Group();group.position.set(x,y,z);scene.add(group);
  group.userData.portal=def.id;
  const crystalMat=new T.MeshStandardMaterial({
   color:def.color,metalness:.35,roughness:.23,emissive:def.color,emissiveIntensity:.75
  });
  const lightMat=new T.MeshBasicMaterial({color:def.color,transparent:true,opacity:.87,blending:T.AdditiveBlending,depthWrite:false});
  // Stratified hovering architecture and tapered floating underside.
  mesh(group,new T.CylinderGeometry(2.15,2.06,.26,12),materials.obsidian,0,-.35,0);
  mesh(group,new T.CylinderGeometry(2.05,0,2.1,12),materials.metal,0,-1.49,0);
  const floor=mesh(group,new T.CylinderGeometry(1.96,1.96,.08,40),materials.glass,0,-.14,0);
  floor.userData.portal=def.id;
  const rim=mesh(group,new T.TorusGeometry(2.05,.056,8,70),lightMat,0,-.16,0);rim.rotation.x=Math.PI/2;
  // Vertical gateway plane faces camera; clicking gateway enters destination.
  const gate=mesh(group,new T.TorusGeometry(1.13,.095,12,84),lightMat,0,1.37,.18);
  gate.userData.portal=def.id;
  const gateInner=mesh(group,new T.TorusGeometry(.88,.029,8,70),lightMat,0,1.37,.22);
  gateInner.userData.portal=def.id;
  const emblem=mesh(group,new T.IcosahedronGeometry(.58,1),crystalMat,0,1.37,.29);
  emblem.userData.portal=def.id;
  const halo=mesh(group,new T.TorusGeometry(1.56,.02,6,68),lightMat,0,1.38,-.24);
  halo.rotation.y=.55;
  // Floating glyph pillars and short neon spires.
  for(let k=0;k<6;k++){
   const angle=k*Math.PI/3,r=1.55,h=.35+(k%3)*.2;
   mesh(group,new T.CylinderGeometry(.105,.18,h,8),materials.crystal,Math.cos(angle)*r,h/2,Math.sin(angle)*r);
   mesh(group,new T.SphereGeometry(.105,9,7),lightMat,Math.cos(angle)*r,h+.06,Math.sin(angle)*r);
  }
  const baseRing=mesh(group,new T.TorusGeometry(1.35,.018,5,60),lightMat,0,-1.95,0);baseRing.rotation.x=Math.PI/2;
  mesh(group,new T.ConeGeometry(.3,1.4,6),crystalMat,0,-2.65,0);
  portals.push({id:def.id,def,group,gate,emblem,halo,light:lightMat});
  islands.push(group);
  return group;
 }
 PORTALS.forEach(buildIsland);
 // Bridges are luminous ribbons with small running energy lights.
 const bridgePaths=[[0,1],[1,4],[4,2],[2,3],[1,2]];
 const bridges=[];
 for(const [a,b] of bridgePaths){
  const start=new T.Vector3(...islandCoords[a]).add(new T.Vector3(0,-.05,0));
  const end=new T.Vector3(...islandCoords[b]).add(new T.Vector3(0,-.05,0));
  const mid=start.clone().lerp(end,.5);mid.y+=1.05;
  const curve=new T.CatmullRomCurve3([start,mid,end]);
  const track=mesh(scene,new T.TubeGeometry(curve,42,.023,6,false),
   new T.MeshBasicMaterial({color:0x38c5fc,transparent:true,opacity:.65,blending:T.AdditiveBlending}));
  const pulse=mesh(scene,sphere(.105,10),materials.neon);
  bridges.push({track,pulse,curve,phase:(a+b)/6});
 }
 // Procedural distant skyline and spinning data cubes, made from instanced geometry.
 const towerGeom=box(.72,1,.72);
 const towerMaterial=new T.MeshStandardMaterial({color:0x123d71,metalness:.59,roughness:.28,emissive:0x074a76,emissiveIntensity:.45});
 const nTowers=mobileView?45:110;
 const towers=new T.InstancedMesh(towerGeom,towerMaterial,nTowers),dummy=new T.Object3D();
 for(let i=0;i<nTowers;i++){
  const angle=i*2.399963+.3,radius=17+(i%13)*.7,h=.6+(i%11)*.48;
  dummy.position.set(Math.cos(angle)*radius,-5+h/2,Math.sin(angle)*radius-9);
  dummy.rotation.y=angle;dummy.scale.set(.55+(i%4)*.2,h,.55+(i%4)*.2);dummy.updateMatrix();towers.setMatrixAt(i,dummy.matrix);
 }
 towers.instanceMatrix.needsUpdate=true;scene.add(towers);
 const tipGeom=new T.BoxGeometry(.11,.09,.11);
 const tipMat=new T.MeshBasicMaterial({color:theme.cyan,transparent:true,opacity:.85});
 const tips=new T.InstancedMesh(tipGeom,tipMat,nTowers);
 for(let i=0;i<nTowers;i++){
  const angle=i*2.399963+.3,radius=17+(i%13)*.7,h=.6+(i%11)*.48;
  dummy.position.set(Math.cos(angle)*radius,-5+h+.1,Math.sin(angle)*radius-9);dummy.rotation.y=0;dummy.scale.set(5,1,5);dummy.updateMatrix();tips.setMatrixAt(i,dummy.matrix);
 }
 tips.instanceMatrix.needsUpdate=true;scene.add(tips);
 const grid=new T.GridHelper(90,40,0x275f9b,0x103056);
 grid.position.set(0,-5,-9);
 grid.material.transparent=true;grid.material.opacity=.4;scene.add(grid);
 // Network and coding constellation appears behind portals.
 const links=new T.Group();links.position.set(-1,9,-20);scene.add(links);
 const nodes=[];
 for(let i=0;i<(mobileView?22:43);i++){
  const u=i*2.399,v=i*1.673;
  const p=new T.Vector3(Math.cos(u)*8,Math.sin(v)*2,Math.sin(u)*5);
  nodes.push(p);
  mesh(links,sphere(.08+(i%4)*.025,9),i%4===0?materials.pearl:materials.neon,p.x,p.y,p.z);
 }
 for(let i=0;i<nodes.length-3;i+=2){
  const segment=new T.BufferGeometry().setFromPoints([nodes[i],nodes[(i+7)%nodes.length]]);
  links.add(new T.Line(segment,new T.LineBasicMaterial({color:0x31c9ff,transparent:true,opacity:.23})));
 }
 // Stylized animated human explorer: torso, neck, head, legs and genuinely articulated arm groups.
 const character=new T.Group();character.position.set(-1.5,-3.6,5.2);scene.add(character);
 const body=new T.Group();character.add(body);
 mesh(body,new T.CapsuleGeometry(.31,.84,5,14),materials.jacket,0,1.38,0);
 mesh(body,new T.TorusGeometry(.12,.026,6,21),materials.neon,0,1.44,.32);
 const headGroup=new T.Group();headGroup.position.set(0,2.06,0);body.add(headGroup);
 mesh(headGroup,sphere(.26,19),materials.skin,0,.19,0);
 const hair=mesh(headGroup,new T.SphereGeometry(.27,18,14,0,Math.PI*2,0,Math.PI*.5),materials.hair,0,.26,0);
 hair.rotation.z=.08;
 for(const pos of [-.095,.095])mesh(headGroup,sphere(.025,9),materials.hair,pos,.20,.238);
 const leftArm=new T.Group();leftArm.position.set(-.42,1.83,0);body.add(leftArm);
 mesh(leftArm,new T.CapsuleGeometry(.12,.43,4,10),materials.jacket,0,-.31,0);
 mesh(leftArm,sphere(.11,10),materials.skin,0,-.66,0);
 const rightArm=new T.Group();rightArm.position.set(.42,1.83,0);body.add(rightArm);
 mesh(rightArm,new T.CapsuleGeometry(.12,.43,4,10),materials.jacket,0,-.31,0);
 mesh(rightArm,sphere(.11,10),materials.skin,0,-.66,0);
 for(const side of [-1,1]){
  const leg=new T.Group();leg.position.set(side*.19,.86,0);body.add(leg);
  mesh(leg,new T.CapsuleGeometry(.145,.52,4,10),materials.metal,0,-.34,0);
  mesh(leg,box(.3,.12,.43),materials.pearl,0,-.77,.11);
 }
 mesh(body,box(.62,.83,.22),materials.obsidian,0,1.36,-.31);
 // Energy rail at foreground frames the entire floating world.
 const rail=mesh(scene,new T.TorusGeometry(9.4,.027,8,125),new T.MeshBasicMaterial({
  color:0x4ce4ff,transparent:true,opacity:.23,blending:T.AdditiveBlending
 }),0,-5,2.2);rail.rotation.x=Math.PI/2;
 let selected=0,disposed=false,paused=reduced.matches,running=false,raf=0,last=0,elapsed=0,frames=0,slowFrames=0;
 const pointer={x:0,y:0,desiredX:0,desiredY:0};
 const inputSurface=interactive?host:(host.closest("#home")||host);
 const drag={x:0,y:0,moved:false};
 const targetPos=new T.Vector3(0,6,interactive?26:27),targetLook=new T.Vector3(0,1.4,-6);
 const raycaster=new T.Raycaster(),touch=new T.Vector2();
 const onPointerMove=e=>{
  const rect=host.getBoundingClientRect();
  pointer.desiredX=clamp(((e.clientX-rect.left)/Math.max(1,rect.width)-.5)*2,-1,1);
  pointer.desiredY=clamp(((e.clientY-rect.top)/Math.max(1,rect.height)-.5)*2,-1,1);
  if(interactive&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>9)drag.moved=true;
 };
 const onPointerDown=e=>{drag.x=e.clientX;drag.y=e.clientY;drag.moved=false;};
 const onPointerUp=e=>{
  if(!interactive||drag.moved)return;
  const rect=host.getBoundingClientRect();
  touch.set(((e.clientX-rect.left)/Math.max(1,rect.width))*2-1,-((e.clientY-rect.top)/Math.max(1,rect.height))*2+1);
  raycaster.setFromCamera(touch,camera);
  const hits=raycaster.intersectObjects(portals.flatMap(p=>[p.gate,p.emblem,p.group]),true);
  if(hits.length){
   let object=hits[0].object;while(object&&!object.userData.portal)object=object.parent;
   const id=object?.userData.portal;
   if(id){selectPortal(id);if(typeof onPortal==='function')onPortal(id);}
  }
 };
 function selectPortal(id){
  const index=PORTALS.findIndex(p=>p.id===id);
  if(index<0)return;
  selected=index;
  const stop=CAMERA_STOPS[index];
  targetPos.set(...stop.position);targetLook.set(...stop.target);
  const message=PORTALS[index];
  host.dispatchEvent(new CustomEvent('brootherhood:portal',{bubbles:true,detail:{id,title:message.title,subtitle:message.subtitle,index}}));
 }
 const onGuide=e=>{
  const type=e.detail?.world||'';
  const match={code:'code',cyber:'cyber',ai:'ai',network:'horizon',build:'build'}[type];
  if(match&&interactive)selectPortal(match);
 };
 const onMotion=e=>{paused=Boolean(e.detail?.paused)||reduced.matches;cancelAnimationFrame(raf);if(!paused&&running&&!disposed){last=0;raf=requestAnimationFrame(tick);}else{drawFrame();}};
 const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(raf);}else if(running&&!paused&&!disposed){last=0;raf=requestAnimationFrame(tick);}};
 const setSize=()=>{
  if(disposed||!host.isConnected)return;
  const width=Math.max(320,host.clientWidth),height=Math.max(320,host.clientHeight);
  camera.aspect=width/height;camera.updateProjectionMatrix();
  renderer.setPixelRatio(adaptiveDpr);
  renderer.setSize(width,height,false);
  drawFrame();
 };
 const resizeObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(setSize):null;
 if(resizeObserver)resizeObserver.observe(host);
 else window.addEventListener('resize',setSize);
 const visibility=new IntersectionObserver(entries=>{
  running=entries[0]?.isIntersecting||false;
  cancelAnimationFrame(raf);
  if(running&&!paused&&!disposed){last=0;raf=requestAnimationFrame(tick);}
 },{threshold:.02,rootMargin:'100px'});
 visibility.observe(host);
 const drawFrame=()=>{if(!disposed)renderer.render(scene,camera);};
 function tick(stamp){
  if(disposed||paused||document.hidden||!running)return;
  const dt=clamp((stamp-last)/1000||.016,0,.06);last=stamp;elapsed+=dt;frames++;
  if(frames<400&&frames%50===0&&dt>.029&&adaptiveDpr>1){
   slowFrames++;if(slowFrames>=2){adaptiveDpr=Math.max(1,adaptiveDpr-.2);renderer.setPixelRatio(adaptiveDpr);setSize();slowFrames=0;}
  }
  pointer.x+=(pointer.desiredX-pointer.x)*clamp(dt*3,0,1);
  pointer.y+=(pointer.desiredY-pointer.y)*clamp(dt*3,0,1);
  const float=Math.sin(elapsed*.83);
  islands.forEach((g,i)=>{
   const base=islandCoords[i];g.position.y=base[1]+Math.sin(elapsed*.73+i*.9)*.24;
   g.rotation.y=Math.sin(elapsed*.17+i*.5)*.09;
   portals[i].emblem.rotation.y+=dt*.46;
   portals[i].emblem.rotation.z=Math.sin(elapsed*.8+i)*.18;
   portals[i].halo.rotation.z+=dt*(i%2?-.18:.18);
  });
  coreInner.rotation.x+=dt*.11;coreInner.rotation.y+=dt*.21;
  engine.rotation.y+=dt*.038;
  orbitRings.forEach((g,i)=>{g.rotation.z+=dt*(i%2?-.21:.27);g.rotation.y+=dt*.05;});
  links.rotation.y+=dt*.014;
  bridges.forEach(({pulse,curve,phase})=>pulse.position.copy(curve.getPoint((elapsed*.18+phase)%1)));
  body.position.y=float*.11;
  rightArm.rotation.z=-1.2-Math.sin(elapsed*2.8)*.3;
  leftArm.rotation.z=Math.sin(elapsed*.9)*.12;
  headGroup.rotation.y=Math.sin(elapsed*.65)*.17;
  const cx=targetPos.x+pointer.x*(mobileView?.28:.83)+Math.sin(elapsed*.14)*.27;
  const cy=targetPos.y-pointer.y*(mobileView?.12:.32)+Math.sin(elapsed*.25)*.11;
  const cz=targetPos.z;
  camera.position.x+=(cx-camera.position.x)*clamp(dt*1.9,0,1);
  camera.position.y+=(cy-camera.position.y)*clamp(dt*1.9,0,1);
  camera.position.z+=(cz-camera.position.z)*clamp(dt*1.9,0,1);
  const targetCameraLook=targetLook.clone().add(new T.Vector3(pointer.x*.19,-pointer.y*.12,0));
  cameraTarget.lerp(targetCameraLook,clamp(dt*2.3,0,1));
  camera.lookAt(cameraTarget);
  drawFrame();raf=requestAnimationFrame(tick);
 }
 const cleanup=()=>{
  if(disposed)return;disposed=true;cancelAnimationFrame(raf);
  visibility.disconnect();resizeObserver?.disconnect();
  if(!resizeObserver)window.removeEventListener('resize',setSize);
  inputSurface.removeEventListener('pointermove',onPointerMove);
  host.removeEventListener('pointerdown',onPointerDown);
  host.removeEventListener('pointerup',onPointerUp);
  window.removeEventListener('brootherhood:guide',onGuide);
  window.removeEventListener('brootherhood:motion',onMotion);
  document.removeEventListener('visibilitychange',onVisibility);
  const geos=new Set(),mats=new Set();
  scene.traverse(obj=>{
   if(obj.geometry)geos.add(obj.geometry);
   if(obj.material)for(const m of Array.isArray(obj.material)?obj.material:[obj.material])mats.add(m);
  });
  geos.forEach(g=>g.dispose());
  mats.forEach(m=>{if(m.map)m.map.dispose();m.dispose();});
  renderer.dispose();canvas.remove();
 };
 inputSurface.addEventListener('pointermove',onPointerMove,{passive:true});
 if(interactive){host.addEventListener('pointerdown',onPointerDown,{passive:true});host.addEventListener('pointerup',onPointerUp,{passive:true});}
 window.addEventListener('brootherhood:guide',onGuide);
 window.addEventListener('brootherhood:motion',onMotion);
 document.addEventListener('visibilitychange',onVisibility);
 window.addEventListener('pagehide',cleanup,{once:true});
 if(!interactive){targetPos.set(0,5.1,26);targetLook.set(0,1.4,-8);}
 camera.position.copy(targetPos);cameraTarget.copy(targetLook);camera.lookAt(cameraTarget);
 setSize();
 if(typeof onReady==='function')onReady({portals:PORTALS});
 return{selectPortal,setPaused(value){paused=Boolean(value)||reduced.matches;cancelAnimationFrame(raf);if(!paused&&running){last=0;raf=requestAnimationFrame(tick);}else drawFrame();},dispose:cleanup};
}
