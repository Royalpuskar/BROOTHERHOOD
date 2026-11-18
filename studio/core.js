/**
 * BROOTHERHOOD Studio language models and Judge0-compatible remote execution core.
 * Source goes to the selected external compiler only after the learner presses Run.
 */
export const DEFAULT_ENDPOINT='https://ce.judge0.com';
export const LANGUAGES=Object.freeze([
 {id:'cpp',name:'C++',extension:'cpp',mode:'text/x-c++src',match:/^C\+\+ \((?:GCC|Clang)/i},
 {id:'c',name:'C',extension:'c',mode:'text/x-csrc',match:/^C \((?:GCC|Clang)/i},
 {id:'python',name:'Python',extension:'py',mode:'python',match:/^Python \(3/i},
 {id:'java',name:'Java',extension:'java',mode:'text/x-java',match:/^Java \((?!FX)/i},
 {id:'javascript',name:'JavaScript',extension:'js',mode:'javascript',match:/^JavaScript \(Node/i},
 {id:'typescript',name:'TypeScript',extension:'ts',mode:'javascript',match:/^TypeScript \(/i},
 {id:'rust',name:'Rust',extension:'rs',mode:'rust',match:/^Rust \(/i},
 {id:'go',name:'Go',extension:'go',mode:'go',match:/^Go \(/i},
 {id:'csharp',name:'C#',extension:'cs',mode:'text/x-csharp',match:/^C# \(/i},
 {id:'kotlin',name:'Kotlin',extension:'kt',mode:'text/x-kotlin',match:/^Kotlin \(/i},
 {id:'swift',name:'Swift',extension:'swift',mode:'swift',match:/^Swift \(/i},
 {id:'ruby',name:'Ruby',extension:'rb',mode:'ruby',match:/^Ruby \(/i},
 {id:'php',name:'PHP',extension:'php',mode:'php',match:/^PHP \(/i},
 {id:'dart',name:'Dart',extension:'dart',mode:'javascript',match:/^Dart \(/i},
 {id:'scala',name:'Scala',extension:'scala',mode:'text/x-scala',match:/^Scala \(/i},
 {id:'r',name:'R',extension:'R',mode:'r',match:/^R \(/i},
 {id:'bash',name:'Bash',extension:'sh',mode:'shell',match:/^Bash \(/i},
 {id:'pascal',name:'Pascal',extension:'pas',mode:'pascal',match:/^Pascal \(/i},
 {id:'sql',name:'SQL',extension:'sql',mode:'sql',match:/^SQL \(SQLite/i}
]);
export const BY_ID=Object.freeze(Object.fromEntries(LANGUAGES.map(x=>[x.id,x])));
export const TEMPLATES=Object.freeze({
 cpp:{code:'#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << "Sum: " << (a + b) << "\\n";\n    return 0;\n}\n',stdin:'3 4\n',expected:'Sum: 7'},
 c:{code:'#include <stdio.h>\nint main(void) {\n    int a,b;\n    scanf("%d %d", &a, &b);\n    printf("Sum: %d\\n", a+b);\n    return 0;\n}\n',stdin:'3 4\n',expected:'Sum: 7'},
 python:{code:'a,b=map(int,input().split())\nprint("Sum:",a+b)\n',stdin:'3 4\n',expected:'Sum: 7'},
 java:{code:'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a=sc.nextInt(), b=sc.nextInt();\n    System.out.println("Sum: "+(a+b));\n  }\n}\n',stdin:'3 4\n',expected:'Sum: 7'},
 javascript:{code:'const fs=require("fs");\nconst [a,b]=fs.readFileSync(0,"utf8").trim().split(/\\s+/).map(Number);\nconsole.log("Sum:",a+b);\n',stdin:'3 4\n',expected:'Sum: 7'},
 typescript:{code:'const fs=require("fs");\nconst nums:number[]=fs.readFileSync(0,"utf8").trim().split(/\\s+/).map(Number);\nconsole.log("Sum:",nums[0]+nums[1]);\n',stdin:'3 4\n',expected:'Sum: 7'},
 rust:{code:'use std::io::{self, Read};\nfn main(){let mut s=String::new();io::stdin().read_to_string(&mut s).unwrap();let n:Vec<i32>=s.split_whitespace().map(|x|x.parse().unwrap()).collect();println!("Sum: {}",n[0]+n[1]);}\n',stdin:'3 4\n',expected:'Sum: 7'},
 go:{code:'package main\nimport "fmt"\nfunc main(){var a,b int;fmt.Scan(&a,&b);fmt.Println("Sum:",a+b)}\n',stdin:'3 4\n',expected:'Sum: 7'},
 csharp:{code:'using System;\nclass Program{static void Main(){var n=Console.ReadLine().Split();Console.WriteLine("Sum: "+(int.Parse(n[0])+int.Parse(n[1])));}}\n',stdin:'3 4\n',expected:'Sum: 7'},
 kotlin:{code:'fun main(){val n=readLine()!!.trim().split(" ").map{it.toInt()};println("Sum: "+(n[0]+n[1]))}\n',stdin:'3 4\n',expected:'Sum: 7'},
 swift:{code:'let n=readLine()!.split(separator:" ").compactMap{Int($0)}\nprint("Sum: "+String(n[0]+n[1]))\n',stdin:'3 4\n',expected:'Sum: 7'},
 ruby:{code:'a,b=gets.split.map(&:to_i)\nputs "Sum: #{a+b}"\n',stdin:'3 4\n',expected:'Sum: 7'},
 php:{code:'<?php\n$n=preg_split("/\\s+/",trim(fgets(STDIN)));\necho "Sum: ".((int)$n[0]+(int)$n[1])."\\n";\n',stdin:'3 4\n',expected:'Sum: 7'},
 dart:{code:'import "dart:io";\nvoid main(){final n=stdin.readLineSync()!.trim().split(" ").map(int.parse).toList();print("Sum: "+(n[0]+n[1]).toString());}\n',stdin:'3 4\n',expected:'Sum: 7'},
 scala:{code:'object Main extends App {println("Sum: "+(3+4))}\n',stdin:'',expected:'Sum: 7'},
 r:{code:'cat("Sum:",3+4,"\\n")\n',stdin:'',expected:'Sum: 7'},
 bash:{code:'read a b\nprintf "Sum: %d\\n" "$((a+b))"\n',stdin:'3 4\n',expected:'Sum: 7'},
 pascal:{code:"program Add;\nvar a,b:integer;\nbegin\n readln(a,b);\n writeln('Sum: ',a+b);\nend.\n",stdin:'3 4\n',expected:'Sum: 7'},
 sql:{code:'SELECT 3+4 AS result;\n',stdin:'',expected:'7'}
});
export const CHALLENGES=Object.freeze([
 {id:'sum',title:'Add two numbers',difficulty:'Starter',statement:'Read two integers from standard input. Print Sum: and their result.',input:'3 4\n',output:'Sum: 7',hint:'Use standard input, then print the sum. The starter template already does this.'},
 {id:'even',title:'Even or odd?',difficulty:'Starter',statement:'Read a number and print even when divisible by 2, otherwise odd.',input:'24\n',output:'even',hint:'The expression n % 2 evaluates to zero for even integers.'},
 {id:'loop',title:'Loop from 1 through N',difficulty:'Intermediate',statement:'Read N. Print the sum of the whole numbers from 1 to N.',input:'5\n',output:'15',hint:'Accumulate a running total or use N × (N+1) / 2.'},
 {id:'reverse',title:'Reverse a word',difficulty:'Intermediate',statement:'Read HELLO and print OLLEH.',input:'HELLO\n',output:'OLLEH',hint:'Walk through the string in reverse, or use a language-specific reverse method.'},
 {id:'hello',title:'Hello, World!',difficulty:'Starter',statement:'Print Hello, BROOTHERHOOD! exactly.',input:'',output:'Hello, BROOTHERHOOD!',hint:'Use the standard output facility in your language.'}
]);
export const DEFAULT_FILES=Object.freeze([
 {name:'main.cpp',language:'cpp',code:TEMPLATES.cpp.code},
 {name:'main.py',language:'python',code:TEMPLATES.python.code}
]);
export function normalizeEndpoint(raw){
 try{
  const url=new URL(String(raw).trim());
  const local=url.hostname==='localhost'||url.hostname==='127.0.0.1';
  if(url.username||url.password||url.search||url.hash||(url.protocol!=='https:'&&!(local&&url.protocol==='http:')))throw Error('invalid');
  return url.href.replace(/\/+$/,'');
 }catch{throw new Error('Enter an HTTPS Judge0 API endpoint (localhost HTTP allowed for development only).');}
}
export function chooseRuntime(list,id,preference='gcc'){
 if(!Array.isArray(list)||!BY_ID[id])return null;
 const available=list.filter(x=>Number.isInteger(x?.id)&&BY_ID[id].match.test(String(x.name)));
 if(!available.length)return null;
 const preferred=preference==='clang'?'Clang':'GCC';
 available.sort((a,b)=>{
  if(id==='cpp'||id==='c'){
   const score=x=>String(x.name).includes(preferred)?1:0;
   if(score(a)!==score(b))return score(b)-score(a);
  }
  const v=x=>((String(x.name).match(/(\d+(?:\.\d+){0,3})/)||[])[1]||'0').split('.').map(Number);
  const av=v(a),bv=v(b);
  for(let i=0;i<4;i++)if((bv[i]||0)!==(av[i]||0))return(bv[i]||0)-(av[i]||0);
  return b.id-a.id;
 });
 return available[0];
}
export function makeSubmission(id,source,stdin='',compilerOptions=''){
 if(!Number.isInteger(id)||id<=0)throw Error('Compiler unavailable.');
 if(typeof source!=='string'||!source.trim()||source.length>30000)throw Error('Program must contain 1–30,000 characters.');
 if(typeof stdin!=='string'||stdin.length>12000)throw Error('Input must be under 12,000 characters.');
 const data={language_id:id,source_code:source,stdin,cpu_time_limit:3,wall_time_limit:8,memory_limit:196608};
 if(compilerOptions)data.compiler_options=String(compilerOptions).slice(0,120);
 return data;
}
export function interpretResult(data){
 const statusId=Number(data?.status?.id||0);
 const stdout=String(data?.stdout||''),stderr=String(data?.stderr||''),compile=String(data?.compile_output||''),message=String(data?.message||'');
 const status=String(data?.status?.description||'Unknown');
 const output=[compile&&'COMPILER\n'+compile,stdout&&'STANDARD OUTPUT\n'+stdout,stderr&&'STANDARD ERROR\n'+stderr,message&&'SYSTEM\n'+message].filter(Boolean).join('\n\n')||'(Program produced no output)';
 return {status,statusId,queued:statusId===1||statusId===2,success:statusId===3,stdout,stderr,compile,message,output,exitCode:data?.exit_code,time:data?.time,memory:data?.memory};
}
export function gradeOutput(actual,expected){return String(actual).replace(/\r\n/g,'\n').trimEnd()===String(expected).replace(/\r\n/g,'\n').trimEnd();}
export function safeFiles(raw){
 try{
  const files=JSON.parse(raw);if(!Array.isArray(files))return [];
  const result=[],names=new Set();
  for(const item of files.slice(0,25)){
   const name=String(item?.name||'');
   if(!/^[\w.-]{1,80}$/.test(name)||names.has(name)||typeof item.code!=='string'||item.code.length>30000)continue;
   names.add(name);result.push({name,language:BY_ID[item.language]?item.language:'cpp',code:item.code});
  }
  return result;
 }catch{return [];}
}
