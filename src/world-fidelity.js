/**
 * BROOTHERHOOD · WORLD FIDELITY v3
 * Distinctive original physically-shaded, layered floating architecture.
 * All surface texture, atmosphere and geometry are procedural; no external assets.
 *
 * This is stylized physically based WebGL, not photogrammetry or a photoreal asset scan.
 * The module's high-detail group can be disabled without affecting portal interaction.
 */
const TAU=Math.PI*2;
const lerp=(a,b,t)=>a+(b-a)*t;
const hash=n=>{const x=Math.sin(n*127.1+89.7)*43758.5453123;return x-Math.floor(x);};

export function enhanceFloatingWorld({T,scene,portals,lowPower=false}){
 const detailGroup=new T.Group(),atmosphere=new T.Group();
 detailGroup.name='Procedural Architecture and Rock Strata';
 atmosphere.name='Atmospheric Scattering and Lens Glow';
 scene.add(detailGroup,atmosphere);
 const tierCount=lowPower?12:22;
 const glowCanvas=document.createElement('canvas');
 glowCanvas.width=glowCanvas.height=128;
 const glowContext=glowCanvas.getContext('2d');
 if(!glowContext)throw Error('Canvas 2D context is unavailable');
 let gradient=glowContext.createRadialGradient(64,64,0,64,64,62);
 gradient.addColorStop(0,'rgba(255,255,255,0.9)');
 gradient.addColorStop(.22,'rgba(255,255,255,0.38)');
 gradient.addColorStop(.62,'rgba(255,255,255,0.07)');
 gradient.addColorStop(1,'rgba(255,255,255,0)');
 glowContext.fillStyle=gradient;glowContext.fillRect(0,0,128,128);
 const glowTexture=new T.CanvasTexture(glowCanvas);
 glowTexture.colorSpace=T.SRGBColorSpace;
 const size=lowPower?128:256;
 const rockCanvas=document.createElement('canvas');rockCanvas.width=rockCanvas.height=size;
 const context=rockCanvas.getContext('2d');
 if(!context)throw Error('Canvas 2D context is unavailable');
 const image=context.createImageData(size,size);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const broad=Math.sin(x*.11+y*.07)*14+Math.cos(y*.063-x*.042)*14;
  const grains=(hash(x*13.7+y*97.1)-.5)*54;
  const veins=Math.abs(Math.sin(x*.037+y*.084+Math.sin(y*.061)*1.7))*23;
  const v=Math.max(38,Math.min(218,120+broad+grains-veins));
  const i=(y*size+x)*4;
  image.data[i]=v;image.data[i+1]=v*.99;image.data[i+2]=v*.94;image.data[i+3]=255;
 }
 context.putImageData(image,0,0);
 const rockMap=new T.CanvasTexture(rockCanvas);
 rockMap.wrapS=rockMap.wrapT=T.RepeatWrapping;
 rockMap.repeat.set(2.5,1.6);
 rockMap.colorSpace=T.SRGBColorSpace;
 rockMap.anisotropy=lowPower?1:4;
 const rockMaterial=new T.MeshStandardMaterial({
  map:rockMap,bumpMap:rockMap,bumpScale:.055,vertexColors:true,
  metalness:.07,roughness:.93,side:T.DoubleSide,flatShading:false
 });
 const darkMetal=new T.MeshStandardMaterial({color:0x132a40,metalness:.76,roughness:.29});
 const brushedMetal=new T.MeshStandardMaterial({color:0x3e6879,metalness:.71,roughness:.32});
 const platedMetal=new T.MeshStandardMaterial({color:0xb2d6de,metalness:.67,roughness:.27});
 const soil=new T.MeshStandardMaterial({color:0x4c6954,metalness:.04,roughness:.94});
 const moss=new T.MeshStandardMaterial({color:0x5eaf7e,metalness:.03,roughness:.87});
 const rings=[],beacons=[],rubble=[];
 const highDetailRoots=[];
 const softClouds=[];
 const make=(parent,geometry,material,x=0,y=0,z=0)=>{
  const obj=new T.Mesh(geometry,material);obj.position.set(x,y,z);
  obj.receiveShadow=true;obj.castShadow=true;parent.add(obj);return obj;
 };
 function raggedRock(radius=2.05,depth=3.5,segments=tierCount,seed=0){
  const geometry=new T.BufferGeometry();
  const ys=[-.38,-.54,-.86,-1.25,-1.72,-2.26,-2.83,-3.4];
  const rs=[1.05,1.09,1.00,.89,.68,.52,.27,.055];
  const vertices=[],uv=[],colors=[],indices=[];
  for(let j=0;j<ys.length;j++){
   const taper=rs[j];
   for(let k=0;k<=segments;k++){
    const angle=k/segments*TAU;
    const noise=(hash(seed*31+k*61+j*29)-.5)*(.12+j*.028);
    const ridges=Math.sin(angle*5+seed+j*.72)*(.085+j*.015)+Math.cos(angle*7-seed*.4)*.055;
    const r=radius*(taper+noise+ridges);
    const vertical=ys[j]*depth/3.5 + Math.sin(angle*7+j)*.045;
    vertices.push(Math.cos(angle)*r,vertical,Math.sin(angle)*r);
    uv.push(k/segments*3,j/(ys.length-1)*2);
    const slate=0.58+hash(k*19+j*101+seed*71)*.25;
    const darken=1-j*.026;
    colors.push(slate*.55*darken,slate*.8*darken,slate*.94*darken);
    if(j<ys.length-1&&k<segments){
     const here=j*(segments+1)+k,next=here+segments+1;
     indices.push(here,here+1,next,here+1,next+1,next);
    }
   }
  }
  geometry.setIndex(indices);
  geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));
  geometry.computeVertexNormals();
  return geometry;
 }
 for(const [i,p] of portals.entries()){
  const local=new T.Group();
  p.group.add(local);
  const accent=new T.Color(p.def.color);
  const circuitMaterial=new T.MeshStandardMaterial({
   color:accent,metalness:.38,roughness:.24,emissive:accent,emissiveIntensity:.63
  });
  const glowMaterial=new T.MeshBasicMaterial({color:accent,transparent:true,opacity:.64,depthWrite:false,blending:T.AdditiveBlending});
  const stone=make(local,raggedRock(2.02,3.7,lowPower?12:25,i+13),rockMaterial);
  stone.name='Irregular Rock Strata';
  stone.userData.portal=p.id;
  // A convincing floor edge: plates, glowing trim, bolts, and physical beveling.
  const topDeck=make(local,new T.CylinderGeometry(2.06,2.1,.14,lowPower?22:44,1),p.id==='eco'?soil:darkMetal,0,-.12,0);
  topDeck.userData.portal=p.id;
  const glassTop=make(local,new T.CylinderGeometry(1.87,1.87,.015,lowPower?22:42),p.id==='eco'?moss:brushedMetal,0,-.037,0);
  glassTop.userData.portal=p.id;
  const track=make(local,new T.TorusGeometry(2.07,.029,7,lowPower?34:70),circuitMaterial,0,-.06,0);
  track.rotation.x=Math.PI/2;
  const track2=make(local,new T.TorusGeometry(1.82,.016,6,lowPower?34:70),glowMaterial,0,.012,0);
  track2.rotation.x=Math.PI/2;
  // The island is held aloft with gyroscopic aerospace rings and thruster light.
  const thruster=make(local,new T.CylinderGeometry(.17,.46,.72,10,1,true),glowMaterial,0,-3.53,0);
  thruster.userData.portal=p.id;
  const hoverRing=make(local,new T.TorusGeometry(2.55,.037,8,65),glowMaterial,0,-2.52,0);
  hoverRing.rotation.x=Math.PI/2;
  rings.push({mesh:hoverRing,phase:i*1.73});
  const lens=new T.Sprite(new T.SpriteMaterial({map:glowTexture,color:accent,opacity:.30,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));
  lens.position.set(0,-3.30,0);lens.scale.set(6.6,3.15,1);
  local.add(lens);softClouds.push(lens);
  // Mechanical details, tactile stone chips and accent lighting.
  const decorative=new T.Group();local.add(decorative);highDetailRoots.push(decorative);
  for(let k=0;k<(lowPower?8:16);k++){
   const a=k/(lowPower?8:16)*TAU;
   const pad=make(local,new T.BoxGeometry(.32,.065,.32),k%4===0?platedMetal:brushedMetal,
    Math.cos(a)*1.67,.014,Math.sin(a)*1.67);
   pad.rotation.y=-a;
   if(k%2===0){
    const bolt=make(local,new T.IcosahedronGeometry(.065,1),platedMetal,Math.cos(a)*1.77,.09,Math.sin(a)*1.77);
    bolt.userData.portal=p.id;
   }
  }
  for(let k=0;k<(lowPower?4:9);k++){
   const a=k*2.39996+i*.87;
   const dist=2.5+hash(k*22+i*9)*1.2;
   const shard=make(decorative,new T.DodecahedronGeometry(.11+hash(k*i+81)*.22,0),k%3===0?circuitMaterial:darkMetal,
    Math.cos(a)*dist,-1.1-hash(i*15+k)*2.8,Math.sin(a)*dist);
   shard.rotation.set(a*.37,a*.41,a*.28);
   shard.userData.portal=p.id;
   rubble.push({mesh:shard,phase:k*.42+i,origin:shard.position.y});
  }
  const beacon=make(local,new T.SphereGeometry(.13,12,9),circuitMaterial,0,4.51,-.42);
  const corona=new T.Sprite(new T.SpriteMaterial({map:glowTexture,color:accent,transparent:true,opacity:.62,blending:T.AdditiveBlending,depthWrite:false}));
  corona.position.copy(beacon.position);corona.scale.set(.95,.95,1);
  local.add(corona);beacons.push({mesh:corona,phase:i*1.37});
  // A concise sign identifies the destination on the actual 3D architecture.
  if(!lowPower){
   const canvas=document.createElement('canvas');canvas.width=640;canvas.height=148;
   const ctx=canvas.getContext('2d');
   if(ctx){
    ctx.clearRect(0,0,640,148);
    ctx.fillStyle='rgba(6,24,38,.82)';
    ctx.fillRect(18,10,604,122);
    ctx.strokeStyle='#c9faff';
    ctx.lineWidth=2;ctx.strokeRect(19,11,602,120);
    ctx.fillStyle='#ffffff';
    ctx.font='bold 32px sans-serif';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(p.def.title,320,78);
    const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
    const board=make(local,new T.PlaneGeometry(3.05,.71),
     new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:T.DoubleSide}),0,3.92,1.14);
    board.userData.portal=p.id;
   }
  }
  if(i===6){
   // Eco island has rough mossy slabs and suspended natural droplets.
   const foliage=new T.MeshStandardMaterial({color:0x70c98f,roughness:.85,metalness:0});
   for(let j=0;j<7;j++){
    const a=j*2.3999;
    make(local,new T.DodecahedronGeometry(.26+hash(j*34)*.14,0),foliage,Math.cos(a)*1.4,.19,Math.sin(a)*1.4);
   }
  }
 }
 // Height-variable clouds glow between islands, adding parallax and depth.
 for(let j=0;j<(lowPower?6:15);j++){
  const theta=j*2.399963,rad=9+(j%5)*3.2;
  const cloud=new T.Sprite(new T.SpriteMaterial({
   map:glowTexture,color:j%3===0?0xb8f7e8:0x4bafd8,transparent:true,
   opacity:lowPower?.10:.16,depthWrite:false,blending:T.AdditiveBlending
  }));
  cloud.position.set(Math.cos(theta)*rad,-6.4+(j%4)*1.8,Math.sin(theta)*rad-14);
  cloud.scale.set(14+(j%4)*4,3+(j%3)*2,1);
  atmosphere.add(cloud);
  softClouds.push(cloud);
 }
 detailGroup.visible=!lowPower;
 highDetailRoots.forEach(g=>g.visible=!lowPower);
 function update(t){
  rings.forEach(({mesh,phase})=>{
   const pulse=1+Math.sin(t*1.33+phase)*.047;
   mesh.scale.set(pulse,pulse,pulse);
   mesh.material.opacity=.40+Math.sin(t*1.4+phase)*.10;
  });
  beacons.forEach(({mesh,phase})=>{
   mesh.material.opacity=.51+Math.sin(t*2+phase)*.22;
  });
  rubble.forEach(({mesh,phase,origin})=>{
   mesh.position.y=origin+Math.sin(t*.9+phase)*.16;
   mesh.rotation.y+=.0015;
  });
 }
 const setDetailMode=mode=>{
  const high=mode==='quality';
  detailGroup.visible=high;
  highDetailRoots.forEach(g=>g.visible=high);
  for(let i=0;i<softClouds.length;i++){
   if(i<portals.length)continue;
   softClouds[i].visible=high;
  }
 };
 return{update,setDetailMode};
}
