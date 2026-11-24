/**
 * POCKET 3D LAB · Original high-school biology learning content.
 * A deliberately simplified FRONT VIEW: the anatomical right is shown
 * on the VIEWER'S LEFT, following conventional heart diagrams.
 */
export const PARTS = Object.freeze([
 {id:'right-atrium',name:'Right atrium',group:'chambers',side:'Oxygen-poor side',anchor:[-1.00,.78,.57],
  short:'The upper-right receiving chamber.',description:'The right atrium receives oxygen-poor blood returning from the body through the two vena cavae.',
  connection:'Next: blood passes through the tricuspid valve into the right ventricle.'},
 {id:'right-ventricle',name:'Right ventricle',group:'chambers',side:'Oxygen-poor side',anchor:[-.64,-.78,.85],
  short:'The chamber that pumps blood to the lungs.',description:'The right ventricle pushes oxygen-poor blood through the pulmonary valve and pulmonary artery toward the lungs.',
  connection:'In the lungs, blood picks up oxygen and releases carbon dioxide.'},
 {id:'left-atrium',name:'Left atrium',group:'chambers',side:'Oxygen-rich side',anchor:[.74,.83,.35],
  short:'The upper-left receiving chamber.',description:'The left atrium receives oxygen-rich blood returning from the lungs through the pulmonary veins.',
  connection:'Next: blood passes through the mitral valve into the left ventricle.'},
 {id:'left-ventricle',name:'Left ventricle',group:'chambers',side:'Oxygen-rich side',anchor:[.62,-.89,1.0],
  short:'The strong chamber that pumps to the body.',description:'The muscular left ventricle pushes oxygen-rich blood through the aortic valve and into the aorta, which supplies the body.',
  connection:'The left ventricle has thicker muscle walls because it pumps blood around the whole body.'},
 {id:'tricuspid-valve',name:'Tricuspid valve',group:'valves',side:'Oxygen-poor side',anchor:[-.87,.09,1.12],
  short:'A one-way door on the right side.',description:'The tricuspid valve lets blood travel from the right atrium into the right ventricle and helps stop it flowing backward.',
  connection:'Right atrium → tricuspid valve → right ventricle.'},
 {id:'pulmonary-valve',name:'Pulmonary valve',group:'valves',side:'Oxygen-poor side',anchor:[-.21,1.08,.94],
  short:'The exit valve toward the lungs.',description:'The pulmonary valve opens when the right ventricle pumps blood into the pulmonary artery and closes to limit backflow.',
  connection:'Right ventricle → pulmonary valve → pulmonary artery.'},
 {id:'mitral-valve',name:'Mitral valve',group:'valves',side:'Oxygen-rich side',anchor:[.55,.12,1.06],
  short:'A one-way door on the left side.',description:'The mitral valve, also called the bicuspid valve, directs blood from the left atrium into the left ventricle.',
  connection:'Left atrium → mitral valve → left ventricle.'},
 {id:'aortic-valve',name:'Aortic valve',group:'valves',side:'Oxygen-rich side',anchor:[.40,1.18,.69],
  short:'The exit valve toward the body.',description:'The aortic valve opens when the left ventricle pumps blood into the aorta and closes to help stop backflow.',
  connection:'Left ventricle → aortic valve → aorta.'},
 {id:'superior-vena-cava',name:'Superior vena cava',group:'vessels',side:'Oxygen-poor side',anchor:[-1.17,1.97,.30],
  short:'Returns blood from the upper body.',description:'This large vein brings oxygen-poor blood from the head, arms, and upper body into the right atrium.',
  connection:'Upper body → superior vena cava → right atrium.'},
 {id:'inferior-vena-cava',name:'Inferior vena cava',group:'vessels',side:'Oxygen-poor side',anchor:[-1.34,-.33,.07],
  short:'Returns blood from the lower body.',description:'This large vein brings oxygen-poor blood from the lower body into the right atrium.',
  connection:'Lower body → inferior vena cava → right atrium.'},
 {id:'pulmonary-artery',name:'Pulmonary artery',group:'vessels',side:'Oxygen-poor side',anchor:[-.78,1.80,.53],
  short:'Carries oxygen-poor blood to the lungs.',description:'The pulmonary artery carries oxygen-poor blood away from the right ventricle toward the lungs. It is a useful exception to the idea that arteries always carry oxygen-rich blood.',
  connection:'Right ventricle → pulmonary valve → pulmonary artery → lungs.'},
 {id:'pulmonary-veins',name:'Pulmonary veins',group:'vessels',side:'Oxygen-rich side',anchor:[1.53,1.03,.25],
  short:'Return oxygen-rich blood from the lungs.',description:'The pulmonary veins carry oxygen-rich blood from the lungs into the left atrium. Veins are named for carrying blood toward the heart.',
  connection:'Lungs → pulmonary veins → left atrium.'},
 {id:'aorta',name:'Aorta',group:'vessels',side:'Oxygen-rich side',anchor:[.87,2.16,.15],
  short:'The main artery to the body.',description:'The aorta is the body’s largest artery. It carries oxygen-rich blood away from the left ventricle to the rest of the body.',
  connection:'Left ventricle → aortic valve → aorta → body.'}
]);
export const GROUPS = Object.freeze([
 {id:'chambers',label:'Chambers',subtitle:'The four rooms'},
 {id:'valves',label:'Valves',subtitle:'Four one-way doors'},
 {id:'vessels',label:'Vessels',subtitle:'Five major routes'}
]);
export const FLOW = Object.freeze([
 {id:'blue',label:'To the lungs',kind:'Oxygen-poor blood',color:'#2589c1',
  steps:[{label:'Body',part:null},{label:'Vena cavae',part:'superior-vena-cava'},{label:'Right atrium',part:'right-atrium'},
   {label:'Tricuspid valve',part:'tricuspid-valve'},{label:'Right ventricle',part:'right-ventricle'},
   {label:'Pulmonary valve',part:'pulmonary-valve'},{label:'Pulmonary artery',part:'pulmonary-artery'},{label:'Lungs',part:null}]},
 {id:'red',label:'To the body',kind:'Oxygen-rich blood',color:'#e66869',
  steps:[{label:'Lungs',part:null},{label:'Pulmonary veins',part:'pulmonary-veins'},{label:'Left atrium',part:'left-atrium'},
   {label:'Mitral valve',part:'mitral-valve'},{label:'Left ventricle',part:'left-ventricle'},
   {label:'Aortic valve',part:'aortic-valve'},{label:'Aorta',part:'aorta'},{label:'Body',part:null}]}
]);
export const QUESTIONS = Object.freeze([
 {question:'Which chamber pumps oxygen-rich blood out to the whole body?',
  choices:['Right atrium','Right ventricle','Left atrium','Left ventricle'],answer:3,
  explain:'The left ventricle is the powerful lower chamber that sends oxygen-rich blood into the aorta.'},
 {question:'Which vessels bring oxygen-rich blood back from the lungs?',
  choices:['Pulmonary veins','Pulmonary artery','Vena cavae','Aorta'],answer:0,
  explain:'The pulmonary veins bring blood from the lungs into the left atrium.'},
 {question:'Which valve connects the right atrium to the right ventricle?',
  choices:['Aortic valve','Tricuspid valve','Mitral valve','Pulmonary valve'],answer:1,
  explain:'The tricuspid valve helps blood move in one direction between the two right-side chambers.'},
 {question:'After leaving the right ventricle, where does blood go?',
  choices:['Directly to the body through the aorta','Into the left atrium','Toward the lungs through the pulmonary artery','Back into the vena cavae'],answer:2,
  explain:'The right ventricle sends oxygen-poor blood through the pulmonary valve and pulmonary artery to the lungs.'},
 {question:'What is the main job of the heart valves?',
  choices:['To make oxygen','To help blood move one way','To turn veins into arteries','To store blood permanently'],answer:1,
  explain:'Heart valves open and close to help keep blood traveling forward rather than flowing backward.'}
]);
export const findPart=id=>PARTS.find(x=>x.id===id)||null;
export const partsInGroup=group=>group==='all'?PARTS:PARTS.filter(x=>x.group===group);
export function newQuiz(){return {index:0,answers:[],finished:false};}
export function answerQuiz(state,choice){
 if(!state||state.finished||state.answers.length!==state.index||!Number.isInteger(choice)||choice<0||choice>=QUESTIONS[state.index].choices.length)
  return {state,accepted:false};
 const answers=[...state.answers,choice];
 return {state:{...state,answers},accepted:true,correct:choice===QUESTIONS[state.index].answer};
}
export function advanceQuiz(state){
 if(!state||state.finished||state.answers.length<=state.index)return state;
 if(state.index===QUESTIONS.length-1)return {...state,finished:true};
 return {...state,index:state.index+1};
}
export function quizScore(state){
 return (state?.answers||[]).filter((choice,i)=>QUESTIONS[i]?.answer===choice).length;
}
