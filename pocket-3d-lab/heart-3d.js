/**
 * Pocket 3D Lab — procedurally modeled, schematic human heart.
 *
 * Built with original Three.js geometry: anatomical-looking lobes, an outlined
 * muscular body, 4 valve rings and the main vessel routes. No model downloads
 * or pre-rendered images. Explicitly NOT an anatomically exact reconstruction.
 *
 * Interactive orbit, drag, pinch, wheel zoom, raycast selection, projected DOM
 * hotspots, oxygen-poor/rich flow particles, resize & visibility handling.
 */
import {PARTS} from './content.js';

const THREE_URL='https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const MOBILE=()=>matchMedia('(max-width: 720px)').matches;

export async function createHeartScene(host,{onSelect=()=>{},onAnchors=()=>{},onReady=()=>{},reducedMotion=false}={}){
 if(!host||!window.WebGLRenderingContext)throw Error('WebGL is not available in this browser.');
 const T=await import(THREE_URL);
 const small=MOBILE();
 const renderer=new T.WebGLRenderer({alpha:true,antialias:!small,powerPreference:small?'low-power':'high-performance'});
 renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.55;
 renderer.setClearColor(0xe8f6f0,0);
 let width=host.clientWidth||620,height=host.clientHeight||530,disposed=false;
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,small?1.3:1.8));
 renderer.setSize(width,height,false);
 const canvas=renderer.domElement;
 canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none';
 canvas.setAttribute('aria-hidden','true');
 canvas.setAttribute('tabindex','-1');
 host.prepend(canvas);
 const scene=new T.Scene();
 const camera=new T.PerspectiveCamera(37,width/height,.1,100);
 const look=new T.Vector3(0,.17,0);
 const orbit={yaw:-.12,pitch:.045,distance:9.6};
 const orbitDefaults={...orbit};
 scene.add(new T.AmbientLight(0xffffff,1.9));
 const mainLight=new T.DirectionalLight(0xfff2ea,4.2);mainLight.position.set(-5,7,10);scene.add(mainLight);
 const coolLight=new T.DirectionalLight(0x8bd6ea,2.2);coolLight.position.set(6,2,8);scene.add(coolLight);
 const rimLight=new T.DirectionalLight(0xf99f9c,2);rimLight.position.set(-2,-3,-6);scene.add(rimLight);
 const root=new T.Group();scene.add(root);
 const vector=p=>new T.Vector3(...p);
 const geoSphere=new T.SphereGeometry(1,40,26);
 const pointGeometry=new T.SphereGeometry(.062,10,8);
 const heartMaterials={
  blue:new T.MeshPhysicalMaterial({color:0x68a9c6,roughness:.36,metalness:.06,clearcoat:.45,clearcoatRoughness:.2}),
  blueUpper:new T.MeshPhysicalMaterial({color:0x85c3d5,roughness:.39,metalness:.05,clearcoat:.38}),
  red:new T.MeshPhysicalMaterial({color:0xea7d84,roughness:.35,metalness:.04,clearcoat:.42}),
  redUpper:new T.MeshPhysicalMaterial({color:0xf3a29b,roughness:.39,metalness:.03,clearcoat:.39}),
  muscle:new T.MeshPhysicalMaterial({color:0xbd6a75,roughness:.62,metalness:0,transparent:true,opacity:.42,side:T.DoubleSide,depthWrite:false}),
  shell:new T.MeshPhysicalMaterial({color:0xf7a2a0,transparent:true,opacity:.20,side:T.BackSide,depthWrite:false,roughness:.5}),
  valve:new T.MeshPhysicalMaterial({color:0xffe4a7,roughness:.37,metalness:.14,clearcoat:.45,emissive:0xbd8736,emissiveIntensity:.17}),
  highlight:new T.MeshBasicMaterial({color:0xffffbf,transparent:true,opacity:.9}),
  blueGlow:new T.MeshBasicMaterial({color:0x3cadd6,transparent:true,opacity:.78}),
  redGlow:new T.MeshBasicMaterial({color:0xf8707a,transparent:true,opacity:.85})
 };
 const clickable=[];
 const partMeshes=new Map();
 function addPart(id,mesh){
  mesh.userData.partId=id;
  if(!partMeshes.has(id))partMeshes.set(id,[]);
  partMeshes.get(id).push(mesh);
  clickable.push(mesh);
  return mesh;
 }
 function organLobe(id,color,position,scale,slant=0){
  const geo=geoSphere.clone();
  const coords=geo.attributes.position;
  for(let i=0;i<coords.count;i++){
   let x=coords.getX(i),y=coords.getY(i),z=coords.getZ(i);
   const taper=y<0?1-.29*(-y)*(-y):1+.09*y;
   coords.setXYZ(i,x*taper+y*slant,y,z*taper);
  }
  coords.needsUpdate=true;geo.computeVertexNormals();
  const organ=new T.Mesh(geo,heartMaterials[color]);
  organ.scale.set(...scale);organ.position.set(...position);
  organ.rotation.z=id==='right-ventricle'?.19:id==='left-ventricle'?.18:id==='right-atrium'?.1:-.09;
  root.add(organ);addPart(id,organ);
  const halo=new T.Mesh(geo.clone(),heartMaterials.shell);
  halo.scale.set(scale[0]*1.11,scale[1]*1.085,scale[2]*1.12);
  halo.position.copy(organ.position);halo.rotation.copy(organ.rotation);
  root.add(halo);
  return organ;
 }
 // Anatomical right appears on the viewer's LEFT in this front view.
 organLobe('right-atrium','blueUpper',[-.96,.72,.02],[.65,.62,.56],-.07);
 organLobe('right-ventricle','blue',[-.65,-.71,.15],[.79,1.11,.68],.08);
 organLobe('left-atrium','redUpper',[.58,.69,-.17],[.66,.62,.58],-.07);
 organLobe('left-ventricle','red',[.49,-.82,-.01],[.89,1.29,.80],-.17);
 // Deliberately translucent outline behind the chambers, not a fake chamber.
 const silhouette=new T.Shape();
 silhouette.moveTo(.05,-2.13);
 silhouette.bezierCurveTo(-.45,-2.02,-1.61,-.9,-1.69,.30);
 silhouette.bezierCurveTo(-1.81,1.22,-1.34,1.44,-.69,1.45);
 silhouette.bezierCurveTo(-.26,1.50,-.14,1.28,.01,1.15);
 silhouette.bezierCurveTo(.62,1.73,1.54,1.47,1.60,.56);
 silhouette.bezierCurveTo(1.77,-.72,.85,-1.88,.05,-2.13);
 const tissue=new T.Mesh(new T.ExtrudeGeometry(silhouette,{
  depth:.26,bevelEnabled:true,bevelThickness:.08,bevelSize:.08,bevelSegments:4,curveSegments:28
 }),heartMaterials.muscle);
 tissue.position.z=-.78;root.add(tissue);
 // Interventricular septum: stylized pale partition.
 const septumCurve=new T.CatmullRomCurve3([
  vector([-.12,.09,.91]),vector([-.12,-.48,.98]),vector([-.03,-1.18,.85]),vector([.02,-1.72,.50])
 ]);
 const septum=new T.Mesh(new T.TubeGeometry(septumCurve,37,.027,7,false),new T.MeshBasicMaterial({color:0xffe5dc,transparent:true,opacity:.68}));
 root.add(septum);
 function vessel(id,points,r,color){
  const curve=new T.CatmullRomCurve3(points.map(vector),false,'catmullrom',.35);
  const material=new T.MeshPhysicalMaterial({
   color,roughness:.33,metalness:.04,clearcoat:.47,clearcoatRoughness:.22
  });
  const vesselMesh=new T.Mesh(new T.TubeGeometry(curve,65,r,15,false),material);
  root.add(vesselMesh);addPart(id,vesselMesh);
  return curve;
 }
 // Major vessels as independently selectable, curved three-dimensional tubes.
 vessel('superior-vena-cava',[[-1.20,2.48,-.12],[-1.18,1.95,-.08],[-1.14,1.31,.01],[-1.02,.76,.1]],.21,0x5ba2cb);
 vessel('inferior-vena-cava',[[-1.52,-1.4,-.26],[-1.56,-.62,-.34],[-1.31,.02,-.25],[-1.02,.63,-.12]],.16,0x64acce);
 vessel('pulmonary-artery',[[-.26,.82,.20],[-.27,1.42,.26],[-.47,1.87,.36],[-1.07,2.12,.25],[-1.85,1.95,-.12]],.22,0x3e9cc3);
 vessel('pulmonary-artery',[[-1.03,2.12,.22],[-1.47,1.99,.10],[-1.91,1.52,-.37]],.12,0x3e9cc3);
 vessel('pulmonary-veins',[[1.91,1.61,-.22],[1.57,1.38,-.20],[1.11,1.11,-.18],[.59,.76,-.22]],.155,0xed868d);
 vessel('pulmonary-veins',[[1.96,.89,-.27],[1.43,.82,-.17],[1.0,.77,-.20],[.57,.67,-.22]],.13,0xed868d);
 vessel('aorta',[[.35,1.00,-.24],[.38,1.71,-.35],[.65,2.24,-.39],[1.12,2.36,-.38],[1.48,2.08,-.46],[1.57,1.58,-.55]],.24,0xdc6877);
 for(const [id,xyz,r] of [
  ['tricuspid-valve',[-.85,.08,.93],.22],
  ['pulmonary-valve',[-.19,1.07,.75],.19],
  ['mitral-valve',[.54,.11,.95],.22],
  ['aortic-valve',[.38,1.14,.55],.20]
 ]){
  const valve=new T.Group();valve.position.set(...xyz);root.add(valve);
  const rim=new T.Mesh(new T.TorusGeometry(r,.058,10,40),heartMaterials.valve);
  valve.add(rim);addPart(id,rim);
  const inside=new T.Mesh(new T.CircleGeometry(r*.64,24),new T.MeshBasicMaterial({color:0xffe8ae,transparent:true,opacity:.3,side:T.DoubleSide,depthWrite:false}));
  inside.position.z=-.014;valve.add(inside);
  for(let i=0;i<3;i++){
   const petal=new T.Mesh(new T.ConeGeometry(.075,.19,3),heartMaterials.valve);
   const a=i*Math.PI*2/3;
   petal.position.set(Math.cos(a)*.075,Math.sin(a)*.075,.035);
   petal.rotation.z=-a-.5;
   valve.add(petal);
  }
 }
 // Continuous direction paths: blue to the lungs; red from lungs to body.
 const particles=[],paths=[];
 function flowPath(points,color,number=12){
  const group=new T.Group();root.add(group);
  const curve=new T.CatmullRomCurve3(points.map(vector),false,'centripetal');
  const trailMaterial=new T.MeshBasicMaterial({color,transparent:true,opacity:.33,depthWrite:false});
  const trail=new T.Mesh(new T.TubeGeometry(curve,85,.026,7,false),trailMaterial);
  group.add(trail);
  const material=new T.MeshBasicMaterial({color});
  const balls=new T.InstancedMesh(pointGeometry,material,small?8:number);
  balls.instanceMatrix.setUsage(T.DynamicDrawUsage);
  group.add(balls);particles.push({balls,curve,count:balls.count,offset:paths.length*.24});
  paths.push(group);
 }
 flowPath([[-1.18,2.58,.13],[-1.18,1.49,.25],[-1,.78,.70],[-.84,.1,1.00],[-.66,-.71,.83],[-.22,1.04,.85],[-.53,1.88,.51],[-1.78,1.98,.12]],0x32aae1);
 flowPath([[1.9,1.57,.12],[1.29,1.22,.25],[.62,.76,.43],[.55,.13,1.03],[.48,-.84,1.06],[.39,1.16,.69],[.73,2.22,-.09],[1.54,1.63,-.25]],0xff787c);
 const dummy=new T.Object3D();
 function moveParticles(time){
  particles.forEach(({balls,curve,count,offset})=>{
   for(let i=0;i<count;i++){
    const p=curve.getPointAt((time*.18+i/count+offset)%1);
    dummy.position.copy(p);dummy.scale.setScalar(.80+(i%3)*.11);dummy.updateMatrix();
    balls.setMatrixAt(i,dummy.matrix);
   }
   balls.instanceMatrix.needsUpdate=true;
  });
 }
 let flowVisible=true,motionPaused=!!reducedMotion,visible=true,raf=0,last=0,elapsed=0,selectedPart='';
 const pointerMap=new Map();
 let dragStart=null,pinchDistance=0,wasDragged=false;
 const raycaster=new T.Raycaster(),ndc=new T.Vector2();
 function cameraView(){
  const {yaw,pitch,distance}=orbit;
  camera.position.set(Math.sin(yaw)*Math.cos(pitch)*distance,
     .18+Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance);
  camera.lookAt(look);camera.updateMatrixWorld();
 }
 function projectAnchors(){
  scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
  const output=PARTS.map(part=>{
   const world=vector(part.anchor).applyMatrix4(root.matrixWorld).project(camera);
   return{id:part.id,x:(world.x*.5+.5)*width,y:(-world.y*.5+.5)*height,
    visible:world.z<1&&world.z>-1&&world.x>-.94&&world.x<.94&&world.y>-.87&&world.y<.92};
  });
  onAnchors(output);
 }
 function render(){
  if(disposed)return;
  cameraView();renderer.render(scene,camera);projectAnchors();
 }
 function animate(stamp){
  if(disposed||!visible||motionPaused||document.hidden)return;
  const dt=clamp((stamp-last)/1000||.016,0,.06);last=stamp;elapsed+=dt;
  root.position.y=Math.sin(elapsed*1.2)*.045;
  root.scale.setScalar(1+Math.sin(elapsed*2.7)*.008);
  if(flowVisible)moveParticles(elapsed);
  render();
  raf=requestAnimationFrame(animate);
 }
 function requestRender(){render();}
 function resize(){
  if(disposed||!host.isConnected)return;
  width=Math.max(240,host.clientWidth);height=Math.max(250,host.clientHeight);
  camera.aspect=width/height;camera.updateProjectionMatrix();
  renderer.setSize(width,height,false);render();
 }
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
 const intersection=new IntersectionObserver(entries=>{
  visible=!!entries[0]?.isIntersecting;
  cancelAnimationFrame(raf);
  if(visible&&!motionPaused){last=0;raf=requestAnimationFrame(animate);}
  else if(visible)render();
 },{threshold:.01,rootMargin:'80px'});
 intersection.observe(host);
 const visibilityChange=()=>{
  cancelAnimationFrame(raf);
  if(!document.hidden&&visible&&!motionPaused){last=0;raf=requestAnimationFrame(animate);}
 };
 document.addEventListener('visibilitychange',visibilityChange);
 function zoom(delta){
  orbit.distance=clamp(orbit.distance*delta,6.5,14.2);
  render();
 }
 const onWheel=e=>{e.preventDefault();zoom(e.deltaY>0?1.11:.9);};
 canvas.addEventListener('wheel',onWheel,{passive:false});
 const onPointerDown=e=>{
  canvas.setPointerCapture?.(e.pointerId);
  pointerMap.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointerMap.size===1){dragStart={x:e.clientX,y:e.clientY};wasDragged=false;}
  if(pointerMap.size===2){
   const [a,b]=[...pointerMap.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);
  }
 };
 const onPointerMove=e=>{
  if(!pointerMap.has(e.pointerId))return;
  const old=pointerMap.get(e.pointerId);
  pointerMap.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointerMap.size>=2){
   const [a,b]=[...pointerMap.values()],next=Math.hypot(a.x-b.x,a.y-b.y);
   if(pinchDistance&&next)zoom(clamp(pinchDistance/next,.83,1.18));
   pinchDistance=next;wasDragged=true;return;
  }
  const dx=e.clientX-old.x,dy=e.clientY-old.y;
  if(dragStart&&Math.hypot(e.clientX-dragStart.x,e.clientY-dragStart.y)>5)wasDragged=true;
  orbit.yaw=clamp(orbit.yaw+dx*.011,-Math.PI,Math.PI);
  orbit.pitch=clamp(orbit.pitch+dy*.010,-1.04,1.04);
  render();
 };
 const onPointerUp=e=>{
  pointerMap.delete(e.pointerId);
  if(pointerMap.size<2)pinchDistance=0;
  if(!wasDragged&&e.type==='pointerup'){
   const r=canvas.getBoundingClientRect();
   ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
   raycaster.setFromCamera(ndc,camera);
   const hits=raycaster.intersectObjects(clickable,true);
   if(hits.length){
    let object=hits[0].object;
    while(object&&!object.userData.partId)object=object.parent;
    if(object?.userData.partId)onSelect(object.userData.partId);
   }
  }
  dragStart=null;
 };
 canvas.addEventListener('pointerdown',onPointerDown);
 canvas.addEventListener('pointermove',onPointerMove);
 canvas.addEventListener('pointerup',onPointerUp);
 canvas.addEventListener('pointercancel',onPointerUp);
 function highlight(id){
  selectedPart=id;
  partMeshes.forEach((meshList,key)=>{
   const selected=key===id;
   for(const item of meshList){
    if(item.material?.emissive)item.material.emissiveIntensity=selected?.24:0;
   }
  });
  render();
 }
 function setFlow(value){
  flowVisible=!!value;
  paths.forEach(p=>p.visible=flowVisible);
  if(flowVisible)moveParticles(elapsed);
  render();
 }
 function setMotionPaused(value){
  motionPaused=!!value;
  cancelAnimationFrame(raf);
  if(!motionPaused&&visible&&!document.hidden){last=0;raf=requestAnimationFrame(animate);}
  else render();
 }
 function reset(){
  Object.assign(orbit,orbitDefaults);
  root.position.set(0,0,0);root.scale.setScalar(1);
  render();
 }
 function dispose(){
  if(disposed)return;
  disposed=true;cancelAnimationFrame(raf);
  resizeObserver.disconnect();intersection.disconnect();
  document.removeEventListener('visibilitychange',visibilityChange);
  canvas.removeEventListener('wheel',onWheel);
  canvas.removeEventListener('pointerdown',onPointerDown);
  canvas.removeEventListener('pointermove',onPointerMove);
  canvas.removeEventListener('pointerup',onPointerUp);
  canvas.removeEventListener('pointercancel',onPointerUp);
  const materials=new Set(),geometries=new Set();
  scene.traverse(obj=>{
   if(obj.geometry)geometries.add(obj.geometry);
   const mats=obj.material;
   if(mats)for(const m of Array.isArray(mats)?mats:[mats])materials.add(m);
  });
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
  renderer.dispose();canvas.remove();
 }
 window.addEventListener('pagehide',dispose,{once:true});
 cameraView();moveParticles(0);render();
 onReady();
 if(!motionPaused){last=0;raf=requestAnimationFrame(animate);}
 return {zoom,reset,highlight,setFlow,setMotionPaused,dispose};
}
