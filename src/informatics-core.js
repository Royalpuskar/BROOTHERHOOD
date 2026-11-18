/** Pure Informatics learning models: no tracking, no network calls. */
export const WORLD_META=Object.freeze({
 code:{title:'Code Lab',icon:'⌘',badge:'Code Breaker'},
 cyber:{title:'Cyber Defense Arena',icon:'⛨',badge:'Cyber Guardian'},
 ai:{title:'Artificial Intelligence Core',icon:'✺',badge:'AI Explorer'},
 network:{title:'Network Nexus',icon:'⌁',badge:'Packet Pathfinder'},
 build:{title:"Builders' Realm",icon:'▤',badge:'Systems Architect'}
});
export const WORLD_IDS=Object.freeze(Object.keys(WORLD_META));
export const CODE_TASKS=Object.freeze({
 variables:{name:'Variables & arithmetic',description:'Use JavaScript to print 15. Try adding two variables or numbers.',starter:'const answer = 9 + 6;\nconsole.log(answer);',expected:'15',hint:'console.log shows output. An arithmetic expression like 9 + 6 equals 15.'},
 conditions:{name:'Conditional logic',description:'Use an if statement or a ternary operator to print "allowed" for a user aged 18.',starter:'const age = 18;\nif (age >= 16) {\n  console.log("allowed");\n} else {\n  console.log("denied");\n}',expected:'allowed',hint:'Check whether age is at least 16. Use console.log inside your conditional branch.'},
 loops:{name:'Loops & algorithms',description:'Use a loop to sum the integers from 1 through 5; print 15.',starter:'let total = 0;\nfor (let i = 1; i <= 5; i++) {\n  total += i;\n}\nconsole.log(total);',expected:'15',hint:'Start total at 0, then add each number from 1 to 5 before logging it.'}
});
export const CYBER_CASES=Object.freeze({
 phishing:{sender:'security@accounts-alert.example',subject:'URGENT: Your account will close in 10 minutes',body:'Click this unfamiliar link, enter your password, and send your verification code immediately.',options:[{id:'report',text:'Report the suspicious message through a trusted channel'},{id:'open',text:'Open the link and enter credentials'},{id:'forward',text:'Forward the link to friends'}],correct:'report',hint:'Unexpected urgency and requests for credentials or one-time codes are warning signs.',explanation:'Correct: report or independently verify through the official service. Do not share passwords or one-time verification codes.'},
 password:{sender:'device-admin@example.edu',subject:'Important account safety reminder',body:'Your password appears in a public breach. Choose how to protect the account using the real service, not links in unsolicited messages.',options:[{id:'reuse',text:'Keep using the same password everywhere'},{id:'reset',text:'Visit the official website, change to a unique password, and enable MFA'},{id:'share',text:'Send your current password to an administrator'}],correct:'reset',hint:'Unique passwords and multifactor authentication reduce the risk of credential reuse.',explanation:'Correct: navigate independently to the official service, change compromised credentials, and turn on MFA.'},
 mfa:{sender:'Authenticator app notification',subject:'Sign-in approval requested',body:'You receive a login approval prompt, but you did not attempt to sign in. What should you do?',options:[{id:'approve',text:'Approve the unexpected request'},{id:'ignore',text:'Deny the request and review account security through the official app'},{id:'copy',text:'Share your one-time code to troubleshoot'}],correct:'ignore',hint:'Never approve authentication requests you did not initiate.',explanation:'Correct: deny unsolicited MFA prompts and check the account for unauthorized sign-in attempts.'}
});
export function evaluateCyber(scenario,option){
 const item=CYBER_CASES[scenario];if(!item)return{valid:false,correct:false,feedback:'Select a valid scenario.'};
 if(!item.options.some(x=>x.id===option))return{valid:false,correct:false,feedback:'Choose an answer before checking.'};
 return {valid:true,correct:option===item.correct,feedback:option===item.correct?item.explanation:'Try again. '+item.hint};
}
export const STARTER_SAMPLES=Object.freeze([
 {x:1,label:'Blue'}, {x:2,label:'Blue'},{x:4,label:'Blue'},
 {x:6,label:'Green'},{x:8,label:'Green'},{x:9,label:'Green'}
]);
export function classifyKNN(samples,value,k){
 if(!Array.isArray(samples)||!samples.length)throw new Error('Training examples required.');
 const v=Number(value),n=Number(k);
 if(!Number.isFinite(v)||v<0||v>10||!Number.isInteger(n)||n<1||n>samples.length||n%2===0)throw new Error('Invalid classifier settings.');
 const nearest=samples.map((p,i)=>{
   if(!Number.isFinite(p.x)||!['Blue','Green'].includes(p.label))throw new Error('Invalid training example.');
   return{index:i,x:p.x,label:p.label,distance:Math.abs(p.x-v)};
 }).sort((a,b)=>a.distance-b.distance||a.index-b.index).slice(0,n);
 const blue=nearest.filter(p=>p.label==='Blue').length;
 const green=nearest.length-blue;
 return{label:green>blue?'Green':'Blue',neighbors:nearest,votes:{Blue:blue,Green:green},input:v,k:n};
}
export const PACKET_HOPS=Object.freeze([
 {name:'Browser',message:'The browser prepares a request for learning.example. This example does not send real traffic.'},
 {name:'DNS resolver',message:'The simulated DNS resolver maps learning.example to documentation address 203.0.113.42.'},
 {name:'Router',message:'A router chooses a next hop toward the server. Real routing involves multiple networks.'},
 {name:'Web server',message:'The simulated server receives the packet and responds. Mission route complete.'}
]);
export function packetStep(index){
 const i=Number(index);
 return Number.isInteger(i)&&i>=0&&i<PACKET_HOPS.length?{index:i,...PACKET_HOPS[i]}:null;
}
export const BUILD_COMPONENTS=Object.freeze(['frontend','api','database']);
export function validateArchitecture(path){
 if(!Array.isArray(path)||path.some(x=>!BUILD_COMPONENTS.includes(x)))return{valid:false,success:false,message:'Choose valid application components.'};
 if(path.length!==3)return{valid:true,success:false,message:'A basic application needs three layers: a frontend, an API, and a database.'};
 if(path.join('|')!=='frontend|api|database')return{valid:true,success:false,message:'Start at the user interface, then pass requests through the API before accessing the database.'};
 return{valid:true,success:true,message:'Great architecture! The browser uses the frontend, the API handles application logic, and the database stores data.'};
}
export function normalizeProgress(raw){
 let parsed;try{parsed=JSON.parse(raw);}catch{return [];}
 if(!Array.isArray(parsed))return [];
 return [...new Set(parsed.filter(x=>typeof x==='string'&&WORLD_IDS.includes(x)))];
}
export function missionCount(raw){return normalizeProgress(JSON.stringify(raw)).length;}
export function missionRank(completed){
 const n=Array.isArray(completed)?completed.length:0;
 return n===5?'Digital Universe Master':n>=3?'Technology Trailblazer':n>=1?'Digital Pathfinder':'Digital Explorer';
}
export function safeCodeResult(output,expected){
 return typeof output==='string' && typeof expected==='string' && output.trim().split(/\r?\n/).at(-1)?.trim()===expected;
}
