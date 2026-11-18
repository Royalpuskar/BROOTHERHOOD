/* Original real-time Three.js Informatics world, built with procedural 3D geometry.
   No pre-rendered character/video is used as the 3D scene. */
const THREE_URL='https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const limit=(x,a,b)=>Math.max(a,Math.min(b,x));
export async function startDigitalScene(host){
 if(!host||!('WebGLRenderingContext' in window))return;
 let T;try{T=await import(THREE_URL);}catch{throw new Error('3D library unavailable');}
 const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width: 800px)');
 let renderer;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:mobile.matches?'low-power':'high-performance'});}catch{throw new Error('WebGL unavailable');}
 renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.65;
 renderer.shadowMap.enabled=!mobile.matches;
 renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile.matches?1:1.7));
 host.replaceChildren(renderer.domElement);
 renderer.domElement.setAttribute('aria-hidden','true');
 renderer.domElement.style.cssText='width:100%;height:100%;display:block';
 const fallback=document.querySelector('.scene-fallback');if(fallback)fallback.style.display='none';
 const scene=new T.Scene();scene.fog=new T.FogExp2(0x040d29,.02);
 const camera=new T.PerspectiveCamera(40,1,.1,110);camera.position.set(0,3.1,19);camera.lookAt(0,1,-2);
 scene.add(new T.HemisphereLight(0xb7e8ff,0x031027,2));
 const sun=new T.DirectionalLight(0xc2efff,3.7);sun.position.set(-7,15,7);sun.castShadow=!mobile.matches;
 if(sun.castShadow){sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;sun.shadow.camera.far=40;}scene.add(sun);
 const cyanLight=new T.PointLight(0x06d8ff,120,30);cyanLight.position.set(-3,5,-5);scene.add(cyanLight);
 const purpleLight=new T.PointLight(0x8a56ff,100,26);purpleLight.position.set(9,5,-8);scene.add(purpleLight);
 const limeLight=new T.PointLight(0xc7ff55,50,22);limeLight.position.set(0,0,3);scene.add(limeLight);
 const materials={
  midnight:new T.MeshStandardMaterial({color:0x06182d,metalness:.75,roughness:.34}),
  darkBlue:new T.MeshStandardMaterial({color:0x153b72,metalness:.6,roughness:.25}),
  azure:new T.MeshStandardMaterial({color:0x0d78ac,metalness:.6,roughness:.22,emissive:0x064d7b,emissiveIntensity:.3}),
  cyan:new T.MeshStandardMaterial({color:0x21e4ff,metalness:.4,roughness:.14,emissive:0x11c3ed,emissiveIntensity:1}),
  lime:new T.MeshStandardMaterial({color:0xc5fa61,metalness:.22,roughness:.28,emissive:0x80ca17,emissiveIntensity:.55}),
  violet:new T.MeshStandardMaterial({color:0x8f64ff,metalness:.35,roughness:.22,emissive:0x5120ee,emissiveIntensity:.45}),
  gold:new T.MeshStandardMaterial({color:0xffd47e,metalness:.46,roughness:.25,emissive:0xe49519,emissiveIntensity:.3}),
  glass:new T.MeshPhysicalMaterial({color:0x7acbfa,transparent:true,opacity:.23,roughness:.12,metalness:.15,side:T.DoubleSide}),
  skin:new T.MeshStandardMaterial({color:0xd39775,metalness:.01,roughness:.72}),
  hair:new T.MeshStandardMaterial({color:0x271721,roughness:.69}),
  jacket:new T.MeshStandardMaterial({color:0x126fb4,metalness:.18,roughness:.37}),
  white:new T.MeshStandardMaterial({color:0xd9e9fd,roughness:.5}),
  trousers:new T.MeshStandardMaterial({color:0x102741,roughness:.73})
 };
 const mesh=(parent,geom,mat,x=0,y=0,z=0)=>{
  const m=new T.Mesh(geom,mat);m.position.set(x,y,z);m.castShadow=!mobile.matches;m.receiveShadow=!mobile.matches;parent.add(m);return m;
 };
 // Floating sci-fi islands with neon ring supports, towers and light waterfalls.
 const clusters=new T.Group();scene.add(clusters);
 function island(x,y,z,r,accent){
  const group=new T.Group();group.position.set(x,y,z);clusters.add(group);
  mesh(group,new T.CylinderGeometry(r,r*.76,.33,48),materials.midnight,0,-.21,0);
  const crust=mesh(group,new T.ConeGeometry(r*.83,.9,8),materials.darkBlue,0,-.8,0);crust.rotation.y=Math.PI/8;
  const ring=mesh(group,new T.TorusGeometry(r*.9,.065,10,64),accent,0,-.04,0);ring.rotation.x=Math.PI/2;
  mesh(group,new T.CylinderGeometry(r*.87,r*.87,.055,48),materials.glass,0,0,0);
  for(let i=0;i<5;i++){
   const a=i*Math.PI*2/5,radius=r*.54;
   const tower=mesh(group,new T.CylinderGeometry(.13,.19,.4+((i*11)%5)*.18,8),i%2?materials.darkBlue:materials.azure,radius*Math.cos(a),.25+((i*11)%5)*.09,radius*Math.sin(a));
   mesh(group,new T.SphereGeometry(.14,12,8),accent,tower,0,.38,0);
  }
  const stream=mesh(group,new T.CylinderGeometry(.05,.16,1.7,12),materials.glass,r*.45,-1.08,r*.12);
  const a=mesh(group,new T.TorusGeometry(r*.97,.018,5,80),accent,0,.5,0);a.rotation.x=Math.PI/2;
  return group;
 }
 const islands=[
  island(-8.2,2.6,-9,2,materials.cyan),island(-3.2,3.6,-13,2.8,materials.violet),
  island(2.4,4.0,-15,3.3,materials.cyan),island(8.5,2.2,-10,2.4,materials.lime),
  island(11,5.2,-24,2.8,materials.cyan),island(-13,4.9,-22,2.4,materials.violet),
  island(0,-2.2,-6,4.1,materials.cyan)
 ];
 // Connect the architectural hubs with glowing Bézier skybridges.
 function bridge(from,to){
  const mid=new T.Vector3((from.x+to.x)/2,(from.y+to.y)/2-.7,(from.z+to.z)/2);
  const curve=new T.CatmullRomCurve3([from,mid,to]);
  mesh(scene,new T.TubeGeometry(curve,50,.035,6,false),materials.cyan);
 }
 bridge(new T.Vector3(-6.9,2.7,-9),new T.Vector3(-1.6,3.7,-13));
 bridge(new T.Vector3(-1.4,3.7,-13),new T.Vector3(.7,4.1,-15));
 bridge(new T.Vector3(4.6,4,-15),new T.Vector3(6.8,2.3,-10));
 // Holographic learning hub, rotating gyroscopes, digital shield and neon antennas.
 const hub=new T.Group();hub.position.set(1.2,5.3,-13.3);scene.add(hub);
 const hubCore=mesh(hub,new T.IcosahedronGeometry(.94,1),materials.glass);
 mesh(hub,new T.IcosahedronGeometry(.59,1),materials.cyan);
 const hoops=[];
 for(let i=0;i<3;i++){
  const h=mesh(hub,new T.TorusGeometry(1.45+i*.37,.024,8,100),i===0?materials.cyan:i===1?materials.lime:materials.violet);
  h.rotation.x=Math.PI/3+i*.5;h.rotation.y=i*.32;hoops.push(h);
 }
 const shield=new T.Group();shield.position.set(8.8,4.9,-9.7);scene.add(shield);
 mesh(shield,new T.IcosahedronGeometry(.64,1),materials.violet);
 mesh(shield,new T.TorusGeometry(1.2,.03,6,70),materials.cyan).rotation.x=.56;
 // Network node constellation: actual 3D segments.
 const network=new T.Group();network.position.set(-5,5.5,-13);scene.add(network);
 const nodes=[];
 for(let i=0;i<9;i++){
  const p=new T.Vector3(Math.cos(i*2.4)*2.2,Math.sin(i*1.4)*1.2,Math.sin(i*2.4)*1.5);
  nodes.push(p);mesh(network,new T.SphereGeometry(.13,12,8),i%2?materials.cyan:materials.lime,p.x,p.y,p.z);
 }
 for(let i=0;i<nodes.length-1;i++){
  const curve=new T.LineCurve3(nodes[i],nodes[(i+3)%nodes.length]);
  mesh(network,new T.TubeGeometry(curve,2,.018,5,false),materials.glass);
 }
 // Character assembled as a genuinely articulated 3D skeleton hierarchy, not an image.
 // It is stylized rather than a photorealistic imported GLB.
 const explorer=new T.Group();explorer.position.set(-6.35,-1.72,3.6);explorer.rotation.y=.05;scene.add(explorer);
 const torso=new T.Group();explorer.add(torso);
 mesh(torso,new T.CapsuleGeometry(.37,.97,7,18),materials.jacket,0,1.67,0);
 const logo=mesh(torso,new T.TorusGeometry(.15,.035,6,22),materials.cyan,0,1.73,.38);logo.rotation.y=0;
 const head=new T.Group();head.position.set(0,2.44,0);torso.add(head);
 mesh(head,new T.SphereGeometry(.31,26,20),materials.skin,0,.18,0);
 const hair=mesh(head,new T.SphereGeometry(.317,26,16,0,Math.PI*2,0,Math.PI*.47),materials.hair,0,.28,0);
 hair.rotation.z=-.12;
 for(const x of [-.11,.11])mesh(head,new T.SphereGeometry(.027,10,8),materials.hair,x,.2,.292);
 mesh(head,new T.TorusGeometry(.1,.012,7,24,Math.PI),materials.hair,0,.09,.296).rotation.z=Math.PI;
 const leftArm=new T.Group();leftArm.position.set(-.49,2.12,0);torso.add(leftArm);
 mesh(leftArm,new T.CapsuleGeometry(.137,.58,5,12),materials.jacket,0,-.45,0);
 mesh(leftArm,new T.SphereGeometry(.14,12,9),materials.skin,0,-.87,0);
 const rightArm=new T.Group();rightArm.position.set(.49,2.12,0);torso.add(rightArm);
 mesh(rightArm,new T.CapsuleGeometry(.137,.58,5,12),materials.jacket,0,-.45,0);
 mesh(rightArm,new T.SphereGeometry(.14,12,9),materials.skin,0,-.87,0);
 const leftLeg=new T.Group();leftLeg.position.set(-.23,1.06,0);torso.add(leftLeg);
 mesh(leftLeg,new T.CapsuleGeometry(.17,.67,5,12),materials.trousers,0,-.52,0);
 mesh(leftLeg,new T.BoxGeometry(.34,.17,.54),materials.white,0,-1,.2);
 const rightLeg=new T.Group();rightLeg.position.set(.23,1.06,0);torso.add(rightLeg);
 mesh(rightLeg,new T.CapsuleGeometry(.17,.67,5,12),materials.trousers,0,-.52,0);
 mesh(rightLeg,new T.BoxGeometry(.34,.17,.54),materials.white,0,-1,.2);
 const backpack=mesh(torso,new T.BoxGeometry(.78,1.12,.38),materials.darkBlue,0,1.72,-.48);
 mesh(torso,new T.TorusGeometry(.22,.032,8,32),materials.cyan,0,1.72,-.69);
 // Floating code holograms created as a dynamic original CanvasTexture, no stock artwork.
 const holoCanvas=document.createElement('canvas');holoCanvas.width=512;holoCanvas.height=320;
 const ctx=holoCanvas.getContext('2d');
 ctx.fillStyle='rgba(2,14,34,0.76)';ctx.fillRect(0,0,512,320);
 ctx.strokeStyle='#25dbff';ctx.lineWidth=7;ctx.strokeRect(4,4,504,312);
 ctx.font='bold 22px monospace';ctx.fillStyle='#c6ff78';ctx.fillText('> DIGITAL GATEWAY',26,55);
 ctx.font='18px monospace';ctx.fillStyle='#9cdaff';
 ['const future = "open";','if (curious) explore();','learn("cybersecurity");','build("something new");','// THINK · BUILD · SECURE'].forEach((line,i)=>ctx.fillText(line,26,103+i*38));
 const tex=new T.CanvasTexture(holoCanvas);tex.colorSpace=T.SRGBColorSpace;
 const holoMat=new T.MeshBasicMaterial({map:tex,transparent:true,opacity:.88,side:T.DoubleSide,depthWrite:false});
 const holo=mesh(scene,new T.PlaneGeometry(3.8,2.38),holoMat,-9.7,5.5,-11);holo.rotation.y=.3;
 // Planet, orbital rings, layered starfields.
 const planet=new T.Group();planet.position.set(11.8,6.9,-25);scene.add(planet);
 mesh(planet,new T.SphereGeometry(2.6,30,22),materials.darkBlue);
 for(let i=0;i<14;i++){
  const a=i*2.399,z=(i%6-3)*.48;
  const p=mesh(planet,new T.IcosahedronGeometry(.24+(i%3)*.11,0),i%3===0?materials.lime:materials.azure,Math.cos(a)*Math.sqrt(Math.max(1,1-z*z/9))*2.3,z,Math.sin(a)*2.26);
  p.rotation.z=a;
 }
 const ring=mesh(planet,new T.TorusGeometry(3.55,.026,8,100),materials.violet);ring.rotation.x=.45;
 const stars=new Float32Array(380*3);
 for(let i=0;i<380;i++){stars[i*3]=-27+Math.random()*54;stars[i*3+1]=-10+Math.random()*32;stars[i*3+2]=-50+Math.random()*30;}
 const starGeo=new T.BufferGeometry();starGeo.setAttribute('position',new T.BufferAttribute(stars,3));
 scene.add(new T.Points(starGeo,new T.PointsMaterial({color:0xb1d8ff,size:.068,sizeAttenuation:true,transparent:true,opacity:.77})));
 const hero=document.getElementById('home');
 let running=false,paused=false,last=0,time=0,raf=0,action='wave',until=performance.now()+1900,chapter='welcome';
 function resize(){
  if(!host.isConnected)return;
  const w=Math.max(320,host.clientWidth),h=Math.max(350,host.clientHeight);
  camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.setSize(w,h,false);renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile.matches?1:1.7));
 }
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
 window.addEventListener('brootherhood:guide',e=>{
  const d=e.detail||{};chapter=d.world||'welcome';
  action=d.success?'celebrate':chapter==='wave'?'wave':'point';until=performance.now()+1500;
  if(chapter==='code')holo.material.opacity=1;
 });
 window.addEventListener('brootherhood:motion',e=>{
  paused=Boolean(e.detail?.paused);
  if(paused){cancelAnimationFrame(raf);}else if(running){last=0;raf=requestAnimationFrame(tick);}
 });
 const visibility=new IntersectionObserver(e=>{
  running=e[0].isIntersecting;
  cancelAnimationFrame(raf);
  if(running&&!paused){resize();last=0;raf=requestAnimationFrame(tick);}
 },{threshold:.01});
 visibility.observe(hero);
 document.addEventListener('visibilitychange',()=>{
  cancelAnimationFrame(raf);if(!document.hidden&&running&&!paused){last=0;raf=requestAnimationFrame(tick);}
 });
 function tick(stamp){
  if(!running||paused||document.hidden)return;
  const dt=limit((stamp-last)/1000||.016,0,.05);last=stamp;time+=dt;
  const foot=Math.sin(time*3.8);
  const mode=stamp<until?action:'idle';
  const target=mode==='wave'?-2.42:mode==='point'?-1.2:mode==='celebrate'?-2.2:-.07;
  rightArm.rotation.z+=(target-rightArm.rotation.z)*limit(dt*8,0,1);
  leftArm.rotation.z+=((mode==='celebrate'?2.2:.1)-leftArm.rotation.z)*limit(dt*7,0,1);
  rightArm.rotation.x=mode==='wave'?Math.sin(time*7)*.13:0;
  leftLeg.rotation.x=mode==='walk'?foot*.35:Math.sin(time*.8)*.018;
  rightLeg.rotation.x=mode==='walk'?-foot*.35:-Math.sin(time*.8)*.018;
  head.rotation.y=Math.sin(time*.8)*.07;
  torso.position.y=Math.sin(time*1.9)*.04;
  explorer.rotation.y=mode==='celebrate'?Math.sin(time*3)*.21:.05;
  hub.rotation.y+=dt*.26;hoops.forEach((h,i)=>h.rotation.z+=dt*(i%2?-.3:.32));
  network.rotation.z+=dt*.035;shield.rotation.y+=dt*.35;planet.rotation.y+=dt*.023;
  islands.forEach((isle,i)=>{isle.position.y+=Math.sin(time*.5+i)*.0009;});
  const progress=limit(window.scrollY/Math.max(1,hero.offsetHeight),0,1);
  camera.position.x+=(Math.sin(time*.09)*.12+progress*.8-camera.position.x)*.012;
  camera.lookAt(0,1.4,-2);
  renderer.render(scene,camera);raf=requestAnimationFrame(tick);
 }
 const dispose=()=>{
  cancelAnimationFrame(raf);visibility.disconnect();resizeObserver.disconnect();
  scene.traverse(obj=>{
   if(obj.geometry)obj.geometry.dispose();
   const mats=obj.material;if(mats){for(const m of Array.isArray(mats)?mats:[mats]){if(m.map)m.map.dispose();m.dispose();}}
  });renderer.dispose();
 };
 window.addEventListener('pagehide',dispose,{once:true});
 resize();
}
