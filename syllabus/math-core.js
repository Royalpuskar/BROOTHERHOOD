/**
 * Deterministic, pure browser-side educational computation engines.
 * No eval, code execution, requests or remote math services.
 */
export const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const isBit=v=>v===0||v===1;
export function evaluateGate(gate,a,b){
 if(!isBit(a)||!isBit(b))throw new RangeError('Gate inputs must be 0 or 1');
 const and=a&b,or=a|b,xor=a^b;
 switch(String(gate).toUpperCase()){
  case 'AND':return and;
  case 'OR':return or;
  case 'XOR':return xor;
  case 'NAND':return 1-and;
  case 'NOR':return 1-or;
  case 'XNOR':return 1-xor;
  case 'NOT A':return 1-a;
  case 'IMPLIES':return a===1&&b===0?0:1;
  default:throw new RangeError('Unknown gate');
 }
}
export const GATES=['AND','OR','XOR','NAND','NOR','XNOR','NOT A','IMPLIES'];
export function truthTable(gate){
 return [[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>({a,b,y:evaluateGate(gate,a,b)}));
}
export function decimalToBinary(value){
 const n=Number(value);
 if(!Number.isSafeInteger(n)||n<0||n>65535)throw new RangeError('Use a whole decimal number from 0 to 65535.');
 return n.toString(2);
}
export function binaryToDecimal(value){
 const text=String(value).trim();
 if(!/^[01]{1,16}$/.test(text))throw new RangeError('Use up to 16 binary digits (0 or 1).');
 return parseInt(text,2);
}
export function parseMatrix(values){
 if(!Array.isArray(values)||values.length!==4)throw new Error('Enter four matrix entries.');
 const a=values.map(x=>typeof x==='string'&&x.trim()===''?NaN:Number(x));
 if(!a.every(Number.isFinite)||a.some(x=>Math.abs(x)>1e6))throw new Error('Enter four finite numbers with magnitude at most 1,000,000.');
 return [[a[0],a[1]],[a[2],a[3]]];
}
export function determinant2(A){return A[0][0]*A[1][1]-A[0][1]*A[1][0];}
export function add2(A,B){return A.map((row,i)=>row.map((v,j)=>v+B[i][j]));}
export function multiply2(A,B){
 return A.map((row,i)=>row.map((_,j)=>A[i][0]*B[0][j]+A[i][1]*B[1][j]));
}
export function invert2(A){
 const det=determinant2(A);
 if(!Number.isFinite(det)||Math.abs(det)<1e-10)return null;
 return [[A[1][1]/det,-A[0][1]/det],[-A[1][0]/det,A[0][0]/det]];
}
export function transformVector(A,v){
 if(!Array.isArray(v)||v.length!==2||v.some(x=>!Number.isFinite(Number(x))))throw new Error('Enter two vector coordinates.');
 const [x,y]=v.map(Number);
 if(Math.abs(x)>1e6||Math.abs(y)>1e6)throw new Error('Vector values must be at most 1,000,000 in magnitude.');
 return [A[0][0]*x+A[0][1]*y,A[1][0]*x+A[1][1]*y];
}
export function parseSet(value){
 const elements=String(value).split(',').map(x=>x.trim()).filter(Boolean);
 if(elements.length>60||elements.some(x=>x.length>32))throw new Error('Use up to 60 comma-separated values, each at most 32 characters.');
 return [...new Set(elements)];
}
const sortValues=arr=>[...arr].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
export function setOperations(A,B){
 const left=new Set(A),right=new Set(B);
 return{
  union:sortValues(new Set([...left,...right])),
  intersection:sortValues([...left].filter(x=>right.has(x))),
  difference:sortValues([...left].filter(x=>!right.has(x))),
  symmetric:sortValues([...left,...right].filter(x=>left.has(x)!==right.has(x)))
 };
}
export function combinations(n,r){
 if(!Number.isInteger(n)||!Number.isInteger(r)||n<0||n>40||r<0||r>n)throw new RangeError('Use 0 ≤ r ≤ n ≤ 40.');
 const k=Math.min(r,n-r);
 let result=1;
 for(let i=1;i<=k;i++)result=result*(n-k+i)/i;
 return Math.round(result);
}
export function parseGraph(input){
 const entries=String(input).split(/[\n,;]+/).map(x=>x.trim()).filter(Boolean);
 if(entries.length>60)throw new Error('Use at most 60 edges.');
 const adjacency=new Map();
 const normalize=s=>s.trim().toUpperCase();
 for(const entry of entries){
  const parts=entry.split(/\s*-\s*/);
  if(parts.length!==2||parts.some(x=>!/^[A-Za-z0-9_]{1,14}$/.test(x)))throw new Error('Edges must look like A-B, B-C, C-D.');
  const [a,b]=parts.map(normalize);
  if(!adjacency.has(a))adjacency.set(a,new Set());
  if(!adjacency.has(b))adjacency.set(b,new Set());
  adjacency.get(a).add(b);adjacency.get(b).add(a);
 }
 if(adjacency.size>45)throw new Error('Use at most 45 distinct graph nodes.');
 return adjacency;
}
export function breadthFirst(graph,start){
 const source=String(start).trim().toUpperCase();
 if(!graph.has(source))throw new Error('Start at a node that appears in your edge list.');
 const queue=[source],visited=new Set([source]),distance=new Map([[source,0]]),parent=new Map([[source,null]]);
 for(let i=0;i<queue.length;i++){
  const node=queue[i],neighbors=sortValues(graph.get(node)||[]);
  for(const next of neighbors)if(!visited.has(next)){
   visited.add(next);distance.set(next,distance.get(node)+1);
   parent.set(next,node);queue.push(next);
  }
 }
 return {order:queue,distance:Object.fromEntries(distance),parent:Object.fromEntries(parent)};
}
export function shortestPath(parent,target){
 const key=String(target).toUpperCase(),path=[];
 if(!Object.hasOwn(parent,key))return [];
 let node=key;
 for(let i=0;node!==null&&i<100;i++){
  path.push(node);node=parent[node]??null;
 }
 return path.reverse();
}
