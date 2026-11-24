/**
 * BROOTHERHOOD IMMERSIVE UNIVERSE v2
 * Original real-time Three.js scene. Procedural geometry, no stock scene or image.
 * Two variants: homepage cinematic background and accessible interactive expedition.
 * Rendering is capped/adaptive for mobile and high-density 4K-class displays.
 */
import {enhanceFloatingWorld} from './world-fidelity.js';
const THREE_URL='https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const PORTALS=Object.freeze([
 {id:'code',title:'CODE NEXUS',subtitle:'Compile, debug and build real programs',href:'../studio/',color:0x53ddff,category:'Technology',icon:'⌘'},
 {id:'cyber',title:'CYBER SHIELD',subtitle:'Practice digital defense and threat awareness',href:'../#cyber-arena',color:0xffcd7b,category:'Technology',icon:'⛨'},
 {id:'ai',title:'AI LABORATORY',subtitle:'Explore working machine-learning experiments',href:'../#ai-core',color:0xb6a1ff,category:'Technology',icon:'✺'},
 {id:'biology',title:'BIOLOGY · HEART',subtitle:'Rotate a 3D heart and follow blood flow',href:'../pocket-3d-lab/',color:0xff8ea2,category:'Science',icon:'♥'},
 {id:'physics',title:'PHYSICS STUDIO',subtitle:'Explore circuits and electricity',href:'../legacy/#circuit',color:0x63e3fa,category:'Science',icon:'⚡'},
 {id:'maths',title:'MATHEMATICS ISLAND',subtitle:'Discover fractions through visual puzzles',href:'../legacy/#fractions',color:0xffb96a,category:'Science',icon:'π'},
 {id:'eco',title:'ECO PLANET',subtitle:'Experiment with environmental choices',href:'../legacy/#eco',color:0x91f5a6,category:'Science',icon:'✿'},
 {id:'horizon',title:'HORIZON CONNECT',subtitle:'Explore the interactive event platform',href:'../horizon/',color:0xcaff81,category:'Community',icon:'◈'},
 {id:'build',title:'BUILDERS REALM',subtitle:'Connect software and architecture systems',href:'../#builders-realm',color:0x85dcff,category:'Technology',icon:'▤'}
]);
export const CAMERA_STOPS=Object.freeze([
 {position:[-11,5.1,12],target:[-10.4,2.6,-2.5]},
 {position:[-8.2,7.2,8],target:[-7.2,5.2,-10.6]},
 {position:[-.7,8.7,3],target:[-.7,6.6,-17.1]},
 {position:[7.7,7.3,8],target:[7.1,4.8,-11.1]},
 {position:[11,5,12],target:[10.6,2.5,-2.5]},
 {position:[9.0,.4,1],target:[8,-1.8,-15.8]},
 {position:[2.2,-.3,-4],target:[1.8,-3.0,-20]},
 {position:[-7.4,-.2,0],target:[-6.5,-1.9,-16.0]},
 {position:[0,3.9,-8],target:[0,1.0,-25]}
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
 if(interactive){canvas.style.pointerEvents='auto';canvas.style.touchAction='none';}
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
 const hemisphere=new T.HemisphereLight(0x80c9ff,0x040d2c,2.5);scene.add(hemisphere);
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
 // Nine independently explorable learning archipelagos surround the central energy engine.
 const islandCoords=[
  [-10.8,1.6,-2.5],[-7.2,4.1,-10.6],[-.7,5.4,-17.1],
  [7.1,4.0,-11.1],[10.6,1.6,-2.5],[8,-2.9,-15.8],
  [1.8,-4.4,-20],[-6.5,-3.1,-16],[0,.0,-25]
 ];

 // Nine distinct glowing science / technology landmarks.
 // They share simple, original Three.js primitives; all can be selected by the island.
 function decorateIsland(def,group,neonMaterial,crystalMaterial){
  const metal=materials.metal,pearl=materials.pearl;
  const orb=(x,y,z,r,mat=crystalMaterial)=>mesh(group,new T.IcosahedronGeometry(r,1),mat,x,y,z);
  const column=(x,z,height,r=.14,mat=metal)=>mesh(group,new T.CylinderGeometry(r*.8,r,height,7),mat,x,height*.5-.16,z);
  const bridgeBeam=(a,b,r=.045,mat=neonMaterial)=>line(group,[new T.Vector3(...a),new T.Vector3(...b)],mat,r);
  const blocks=(x,y,z,w,h,d,mat=metal)=>mesh(group,box(w,h,d),mat,x,y,z);
  const decorative=new T.Group();group.add(decorative);
  // Technology & science sculptures sit on the upper deck behind the glowing gateway.
  switch(def.id){
   case 'code':{
    const screen=blocks(0,2.55,-.54,1.9,1.15,.12,materials.glass);
    screen.rotation.y=-.08;
    for(let i=0;i<5;i++){
     const row=blocks(-.55+(i%2)*.12,2.92-i*.16,-.42,i%3===0?.9:1.3,.042,.045,i%2?neonMaterial:materials.pearl);
    }
    blocks(0,1.97,-.52,1.2,.10,.75,metal);
    break;
   }
   case 'cyber':{
    const shield=new T.Shape();
    shield.moveTo(0,3.42);shield.lineTo(.81,3.12);shield.lineTo(.74,2.33);
    shield.quadraticCurveTo(.48,1.88,0,1.61);
    shield.quadraticCurveTo(-.48,1.88,-.74,2.33);
    shield.lineTo(-.81,3.12);shield.closePath();
    const symbol=mesh(group,new T.ExtrudeGeometry(shield,{depth:.12,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.05,bevelThickness:.04}),crystalMaterial,0,0,-.68);
    symbol.userData.portal=def.id;
    bridgeBeam([-.29,2.68,-.45],[-.04,2.38,-.44],.09,materials.pearl);
    bridgeBeam([-.04,2.38,-.44],[.36,2.86,-.44],.09,materials.pearl);
    break;
   }
   case 'ai':{
    const coords=[[-.8,2.85,-.64],[-.4,3.41,-.56],[.27,3.28,-.62],[.82,2.68,-.64],[.37,2.10,-.54],[-.49,2.10,-.57],[0,2.77,-.38]];
    for(let i=0;i<coords.length;i++)orb(...coords[i],i===6?.23:.14,i===6?materials.pearl:crystalMaterial);
    const edges=[[0,1],[0,5],[1,2],[2,3],[2,6],[3,4],[4,5],[4,6],[5,6],[1,6]];
    for(const [a,b] of edges)bridgeBeam(coords[a],coords[b],.024,neonMaterial);
    break;
   }
   case 'biology':{
    // Heart pictogram built from two ellipsoids and a tapered ventricle.
    const tissue=new T.MeshStandardMaterial({color:0xff777f,roughness:.46,emissive:0xa92941,emissiveIntensity:.27});
    const left=mesh(group,sphere(.49,16),tissue,-.34,2.85,-.53);
    const right=mesh(group,sphere(.49,16),tissue,.35,2.85,-.53);
    left.scale.set(1,1.15,.70);right.scale.set(1,1.15,.70);
    const chamber=mesh(group,new T.ConeGeometry(.73,1.53,24),tissue,0,2.11,-.55);
    chamber.rotation.z=Math.PI;
    // The two colored vessels represent blood-flow teaching notation.
    bridgeBeam([-.22,3.65,-.56],[-.42,4.06,-.46],.13,materials.crystal);
    bridgeBeam([.21,3.67,-.56],[.41,4.06,-.44],.13,neonMaterial);
    break;
   }
   case 'physics':{
    for(let k=0;k<3;k++){
     const ring=mesh(group,new T.TorusGeometry(.62,.075,9,45),k===1?materials.pearl:neonMaterial,0,2.64,-.57);
     ring.rotation.y=k*Math.PI/3;ring.rotation.x=.2+k*.45;
    }
    orb(0,2.64,-.48,.29,materials.pearl);
    column(-.9,-.5,.75);column(.9,-.5,.75);
    bridgeBeam([-.9,.6,-.5],[.9,.6,-.5],.045,neonMaterial);
    break;
   }
   case 'maths':{
    const poly=mesh(group,new T.OctahedronGeometry(.86,0),materials.pearl,0,2.75,-.56);
    poly.rotation.z=.36;
    const gridCube=mesh(group,new T.BoxGeometry(1.6,1.6,1.6),new T.MeshBasicMaterial({color:def.color,wireframe:true,transparent:true,opacity:.65}),0,2.75,-.57);
    gridCube.rotation.y=.23;
    orb(0,3.77,-.53,.16,crystalMaterial);
    break;
   }
   case 'eco':{
    column(0,-.45,1.9,.22,new T.MeshStandardMaterial({color:0x9d744e,roughness:.84}));
    for(let j=0;j<3;j++){
     const leaves=mesh(group,new T.ConeGeometry(1.1-j*.22,1.25,7),crystalMaterial,0,2.24+j*.56,-.45);
     leaves.rotation.y=j*.38;
    }
    const waterfall=new T.MeshBasicMaterial({color:0x65e4fd,transparent:true,opacity:.57,side:T.DoubleSide,depthWrite:false});
    const fall=mesh(group,new T.CylinderGeometry(.23,.38,2.0,10,1,true),waterfall,-1.24,-1.2,.46);
    fall.userData.portal=def.id;
    break;
   }
   case 'horizon':{
    for(let k=-2;k<=2;k++){
     const height=1+(2-Math.abs(k))*.49;
     const tower=blocks(k*.47,1.88+height*.5,-.64,.33,height,.4,k%2?materials.crystal:metal);
     for(let w=0;w<3;w++)blocks(k*.47,1.98+w*.27,-.4,.21,.041,.045,neonMaterial);
    }
    const beacon=orb(0,4.18,-.61,.28,materials.pearl);
    break;
   }
   case 'build':{
    for(let k=0;k<3;k++){
     const frame=mesh(group,new T.BoxGeometry(1.65-k*.25,.16,1.35-k*.16),k%2?materials.glass:crystalMaterial,0,2.06+k*.53,-.52);
     frame.rotation.y=k*.16;frame.userData.portal=def.id;
    }
    for(let k=-1;k<=1;k++){
     column(k*.6,-.92,1.65,.065,neonMaterial);
    }
    orb(0,4.18,-.49,.28,materials.pearl);
    break;
   }
  }
  // Each portal receives a small levitating ringed satellite for parallax depth.
  for(let j=0;j<3;j++){
   const a=j*2.09+def.color*.00001;
   const sat=orb(Math.cos(a)*2.9,1.0+Math.sin(a)*.42,Math.sin(a)*1.75,.12,neonMaterial);
   sat.userData.portal=def.id;
  }
 }
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
  decorateIsland(def,group,lightMat,crystalMat);
  // An array of thin light columns suggests a hovering launch pad.
  for(let b=0;b<8;b++){
   const a=b*Math.PI/4;
   const glyph=mesh(group,new T.CapsuleGeometry(.025,.10,3,6),lightMat,Math.cos(a)*1.87,.10,Math.sin(a)*1.87);
   glyph.userData.portal=def.id;
  }
  portals.push({id:def.id,def,group,gate,emblem,halo,light:lightMat});
  islands.push(group);
  return group;
 }
 PORTALS.forEach(buildIsland);
 const fidelity=enhanceFloatingWorld({T,scene,portals,lowPower:mobileView});
 // Bridges are luminous ribbons with small running energy lights.
 const bridgePaths=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[7,8],[8,6],[2,8],[3,8]];
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
 const orbit={yaw:0,pitch:0,zoom:1,desiredYaw:0,desiredPitch:0,desiredZoom:1};
 const activePointers=new Map();
 let pinchDistance=0;
 let quality=mobileView?'performance':'quality',lighting='night';
 const targetPos=new T.Vector3(0,6,interactive?26:27),targetLook=new T.Vector3(0,1.4,-6);
 const raycaster=new T.Raycaster(),touch=new T.Vector2();
 // Reduced-motion users can still orbit and zoom without animation.
 function renderPausedOrbit(){
  if(!paused)return;
  orbit.yaw=orbit.desiredYaw;orbit.pitch=orbit.desiredPitch;orbit.zoom=orbit.desiredZoom;
  const delta=targetPos.clone().sub(targetLook);
  const length=Math.max(.01,delta.length())*orbit.zoom;
  const yaw=Math.atan2(delta.x,delta.z)+orbit.yaw;
  const pitch=clamp(Math.asin(clamp(delta.y/Math.max(.01,delta.length()),-1,1))+orbit.pitch,-.85,1.05);
  camera.position.set(
   targetLook.x+Math.sin(yaw)*Math.cos(pitch)*length,
   targetLook.y+Math.sin(pitch)*length,
   targetLook.z+Math.cos(yaw)*Math.cos(pitch)*length
  );
  cameraTarget.copy(targetLook);camera.lookAt(cameraTarget);
  renderer.render(scene,camera);
 }
 const onPointerMove=e=>{
  const rect=host.getBoundingClientRect();
  pointer.desiredX=clamp(((e.clientX-rect.left)/Math.max(1,rect.width)-.5)*2,-1,1);
  pointer.desiredY=clamp(((e.clientY-rect.top)/Math.max(1,rect.height)-.5)*2,-1,1);
  if(!interactive)return;
  if(activePointers.has(e.pointerId)){
   const previous=activePointers.get(e.pointerId);
   activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   const dx=e.clientX-previous.x,dy=e.clientY-previous.y;
   if(activePointers.size>=2){
    const [a,b]=[...activePointers.values()];
    const distance=Math.hypot(a.x-b.x,a.y-b.y);
    if(pinchDistance>0&&distance>0)orbit.desiredZoom=clamp(orbit.desiredZoom*pinchDistance/distance,.58,1.65);
    pinchDistance=distance;
    drag.moved=true;
   }else{
    orbit.desiredYaw=clamp(orbit.desiredYaw-dx*.008,-1.65,1.65);
    orbit.desiredPitch=clamp(orbit.desiredPitch+dy*.006,-.65,.65);
   }
  }
  if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>9)drag.moved=true;
  if(paused&&activePointers.has(e.pointerId))renderPausedOrbit();
 };
 const onPointerDown=e=>{
  if(!interactive)return;
  drag.x=e.clientX;drag.y=e.clientY;drag.moved=false;
  activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(activePointers.size===2){
   const [a,b]=[...activePointers.values()];
   pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);
  }
  e.target?.setPointerCapture?.(e.pointerId);
 };
 const onPointerUp=e=>{
  if(!interactive)return;
  activePointers.delete(e.pointerId);
  if(activePointers.size<2)pinchDistance=0;
  if(drag.moved)return;
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
  orbit.desiredYaw=orbit.yaw=0;
  orbit.desiredPitch=orbit.pitch=0;
  orbit.desiredZoom=orbit.zoom=1;
  if(paused){
   camera.position.copy(targetPos);cameraTarget.copy(targetLook);
   camera.lookAt(cameraTarget);renderer.render(scene,camera);
  }
  const message=PORTALS[index];
  host.dispatchEvent(new CustomEvent('brootherhood:portal',{bubbles:true,detail:{id,title:message.title,subtitle:message.subtitle,index}}));
 }
 const onGuide=e=>{
  const type=e.detail?.world||'';
  const match={code:'code',cyber:'cyber',ai:'ai',network:'horizon',build:'build',science:'biology',maths:'maths',physics:'physics',environment:'eco'}[type];
  if(match&&interactive)selectPortal(match);
 };
 const onWheel=e=>{
  if(!interactive)return;
  e.preventDefault();
  orbit.desiredZoom=clamp(orbit.desiredZoom*Math.exp(e.deltaY*.0011),.58,1.65);
  if(paused)renderPausedOrbit();
 };
 const onMotion=e=>{paused=Boolean(e.detail?.paused);cancelAnimationFrame(raf);if(!paused&&running&&!disposed){last=0;raf=requestAnimationFrame(tick);}else{drawFrame();}};
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
  fidelity.update(elapsed);
  coreInner.rotation.x+=dt*.11;coreInner.rotation.y+=dt*.21;
  engine.rotation.y+=dt*.038;
  orbitRings.forEach((g,i)=>{g.rotation.z+=dt*(i%2?-.21:.27);g.rotation.y+=dt*.05;});
  links.rotation.y+=dt*.014;
  bridges.forEach(({pulse,curve,phase})=>pulse.position.copy(curve.getPoint((elapsed*.18+phase)%1)));
  body.position.y=float*.11;
  rightArm.rotation.z=-1.2-Math.sin(elapsed*2.8)*.3;
  leftArm.rotation.z=Math.sin(elapsed*.9)*.12;
  headGroup.rotation.y=Math.sin(elapsed*.65)*.17;
  orbit.yaw+=(orbit.desiredYaw-orbit.yaw)*clamp(dt*4.1,0,1);
  orbit.pitch+=(orbit.desiredPitch-orbit.pitch)*clamp(dt*4.1,0,1);
  orbit.zoom+=(orbit.desiredZoom-orbit.zoom)*clamp(dt*4.1,0,1);
  const delta=targetPos.clone().sub(targetLook),baseRadius=delta.length();
  const baseYaw=Math.atan2(delta.x,delta.z);
  const basePitch=Math.asin(clamp(delta.y/Math.max(baseRadius,.01),-1,1));
  const viewYaw=baseYaw+orbit.yaw;
  const viewPitch=clamp(basePitch+orbit.pitch,-.85,1.05);
  const viewRadius=baseRadius*orbit.zoom;
  const cx=targetLook.x+Math.sin(viewYaw)*Math.cos(viewPitch)*viewRadius
   +pointer.x*(mobileView?.10:.32)+Math.sin(elapsed*.14)*.10;
  const cy=targetLook.y+Math.sin(viewPitch)*viewRadius-pointer.y*(mobileView?.05:.13);
  const cz=targetLook.z+Math.cos(viewYaw)*Math.cos(viewPitch)*viewRadius;
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
  host.removeEventListener('wheel',onWheel);
  host.removeEventListener('pointercancel',onPointerUp);
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
 if(interactive){
  host.addEventListener('pointerdown',onPointerDown,{passive:true});
  host.addEventListener('pointerup',onPointerUp,{passive:true});
  host.addEventListener('pointercancel',onPointerUp,{passive:true});
  host.addEventListener('wheel',onWheel,{passive:false});
 }
 window.addEventListener('brootherhood:guide',onGuide);
 window.addEventListener('brootherhood:motion',onMotion);
 document.addEventListener('visibilitychange',onVisibility);
 window.addEventListener('pagehide',cleanup,{once:true});
 if(!interactive){targetPos.set(0,5.1,26);targetLook.set(0,1.4,-8);}
 camera.position.copy(targetPos);cameraTarget.copy(targetLook);camera.lookAt(cameraTarget);
 setSize();
 if(typeof onReady==='function')onReady({portals:PORTALS});
 function resetView(){
  orbit.yaw=orbit.desiredYaw=0;orbit.pitch=orbit.desiredPitch=0;
  orbit.zoom=orbit.desiredZoom=1;
  pointer.x=pointer.desiredX=0;pointer.y=pointer.desiredY=0;
  camera.position.copy(targetPos);cameraTarget.copy(targetLook);
  camera.lookAt(cameraTarget);drawFrame();
 }
 function setQuality(mode){
  quality=mode==='quality'?'quality':'performance';
  fidelity.setDetailMode(quality);
  adaptiveDpr=quality==='quality'?baseDpr:Math.min(1,baseDpr);
  renderer.setPixelRatio(adaptiveDpr);
  setSize();return quality;
 }
 function setLighting(mode){
  lighting=mode==='dawn'?'dawn':'night';
  const dawn=lighting==='dawn';
  sun.color.setHex(dawn?0xffe0ae:0xc9e9ff);
  sun.intensity=dawn?4.5:3.1;
  hemisphere.intensity=dawn?3.4:2.5;
  rim.intensity=dawn?1.4:2.1;
  glow.intensity=dawn?62:85;
  goldLight.intensity=dawn?75:42;
  scene.fog.color.setHex(dawn?0x274963:0x071127);
  renderer.toneMappingExposure=dawn?1.65:1.55;
  drawFrame();return lighting;
 }
 fidelity.setDetailMode(quality);
 return{selectPortal,resetView,setQuality,setLighting,
  setPaused(value){
   paused=Boolean(value);cancelAnimationFrame(raf);
   if(!paused&&running){last=0;raf=requestAnimationFrame(tick);}
   else drawFrame();
  },dispose:cleanup};
}
