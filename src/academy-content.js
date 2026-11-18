// Original Brootherhood Programming Academy content. All 20 languages have a three-question mini-lesson.
export const LANGUAGES = Object.freeze([
['javascript','JavaScript','Browser programming','javascript','const total = [2,4,6].reduce((a,b)=>a+b,0);\nconsole.log("Total:",total);'],
['python','Python','AI & automation','python','values = [2,4,6]\nprint("Total:", sum(values))'],
['sql','SQL (SQLite)','Databases','sql','SELECT name, score FROM learners WHERE score >= 80 ORDER BY score DESC;'],
['html','HTML & CSS','Web design','html','<main class="card">\n<h1>Hello, Explorer!</h1><p>Welcome to BROOTHERHOOD.</p>\n</main>\n<style>body {background:#071b2a;color:white;font-family:system-ui}.card {border:2px solid cyan;border-radius:20px;padding:2rem}</style>'],
['typescript','TypeScript','Typed JavaScript','typescript','type Student = { name:string };\nconst student: Student = {name:"BROOTHERHOOD"};\nconsole.log(student.name);'],
['java','Java','Backend & Android','study','public class Main {\n public static void main(String[] a){System.out.println("BROOTHERHOOD");}\n}'],
['c','C','Systems','study','#include <stdio.h>\nint main(void){ puts("BROOTHERHOOD"); return 0; }'],
['cpp','C++','Systems & games','study','#include <iostream>\nint main(){std::cout << "BROOTHERHOOD";}'],
['csharp','C#','.NET & games','study','using System;\nclass Program { static void Main(){Console.WriteLine("BROOTHERHOOD");}}'],
['go','Go','Cloud & services','study','package main\nimport "fmt"\nfunc main(){fmt.Println("BROOTHERHOOD")}'],
['rust','Rust','Memory-safe systems','study','fn main(){ println!("BROOTHERHOOD"); }'],
['ruby','Ruby','Web scripting','study','learners = ["Ada", "Grace"]\nlearners.each { |person| puts person }'],
['php','PHP','Server-side web','study','<?php\n$topic = "BROOTHERHOOD";\necho $topic;'],
['kotlin','Kotlin','Android & JVM','study','fun main(){val topic="BROOTHERHOOD";println(topic)}'],
['swift','Swift','iOS & macOS','study','let topic="BROOTHERHOOD"\nprint(topic)'],
['r','R','Data science','study','scores <- c(80,90,95)\nprint(mean(scores))'],
['bash','Bash','DevOps','study','#!/bin/bash\nname="BROOTHERHOOD"\nprintf "%s" "$name"'],
['dart','Dart','Flutter','study','void main(){final topic="BROOTHERHOOD";print(topic);}'],
['lua','Lua','Game scripting','study','local topic="BROOTHERHOOD"\nprint(topic)'],
['scala','Scala','Functional programming','study','@main def hello(): Unit =\n  println(List(1,2,3).sum)']
].map(([id,name,subject,mode,starter])=>Object.freeze({id,name,subject,mode,starter})));
export const LANGUAGE_BY_ID = Object.freeze(Object.fromEntries(LANGUAGES.map(x=>[x.id,x])));
export const RUNNABLE=Object.freeze(LANGUAGES.filter(x=>x.mode!=='study').map(x=>x.id));
// Every entry: question | correct choice | distractor | distractor | explanation. Three per language.
const Q={
javascript:[
['What does const prevent?','Reassigning a variable binding','Any object mutation','Calling functions','A const variable cannot be reassigned, although referenced objects can still be mutable.'],
['Which method maps an array to another array?','map()','push()','includes()','map creates a new array from the callback results.'],
['What does === mean?','Strict equality without type coercion','String comparison only','Assignment','Strict equality avoids implicit type coercion.']],
python:[
['Which Python type is mutable?','list','tuple','str','Lists can be modified after creation.'],
['What does range(3) yield?','0, 1, 2','1, 2, 3','0, 1, 2, 3','range ends before 3.'],
['Which keyword handles an exception?','except','catch','rescue','Python catches errors with try and except.']],
sql:[
['Which clause filters individual rows?','WHERE','ORDER BY','HAVING only','WHERE filters rows before grouping.'],
['What does COUNT(*) count?','Matching rows','Only unique values','Tables','COUNT(*) counts all qualifying rows.'],
['Which join includes all left-side rows?','LEFT JOIN','INNER JOIN','CROSS JOIN','LEFT JOIN retains unmatched left rows.']],
html:[
['Which is the semantic top-level heading?','h1','head','p','Use h1 for the primary heading.'],
['Which label attribute targets an input id?','for','target','style','A label for value associates it with a matching input id.'],
['What does CSS Grid support?','Two-dimensional layout','SQL queries','Python modules','Grid can lay out items in rows and columns.']],
typescript:[
['What does an interface describe?','A value shape or contract','A server process','An HTML node','Interfaces document expected value structure.'],
['What happens to type annotations at compile time?','Usually removed','Converted to HTML','Always kept as runtime classes','TypeScript removes most type annotations when emitting JavaScript.'],
['Which type requires checks before use?','unknown','any','never','unknown values must be narrowed before operations.']],
java:[
['What executes Java bytecode?','JVM','CSS engine','SQL planner','Java uses the Java Virtual Machine.'],
['Which keyword creates a subclass?','extends','inherits','from','Class inheritance uses extends.'],
['How do you compare string contents?','equals()','== always','===','equals compares text contents.']],
c:[
['Which header declares printf?','stdio.h','iostream','stdlib.cpp','stdio.h defines C standard I/O declarations.'],
['What does unary &x yield?','Address of x','Negation','Square','The address-of operator returns a pointer to x.'],
['What does malloc require careful handling of?','Memory lifetime','CSS layout','Garbage collector settings','malloc allocations need eventual release via free.']],
cpp:[
['Which container is a dynamically-sized array?','std::vector','std::mutex','std::thread','vector holds dynamically sized contiguous elements.'],
['What does T& represent?','Reference to an object','HTML attribute','SQL table','A C++ reference aliases an object.'],
['What is RAII used for?','Managing resource lifetimes','Parsing HTML','Making CSS colors','RAII ties resource acquisition and release to object lifetime.']],
csharp:[
['What runtime supports C#?','.NET','JVM only','Browser CSS','.NET is the common C# runtime.'],
['What do async and await support?','Asynchronous operations','SQL joins','HTML element styling','async and await simplify asynchronous workflows.'],
['Which is the null-conditional operator?','?.','::','=>','Null conditional access stops when the receiver is null.']],
go:[
['What launches a goroutine?','go','async','launch','go starts a concurrent function call.'],
['How does Go usually report errors?','As returned values','Only exceptions','Via HTML','Go commonly returns explicit error values.'],
['What does a channel communicate?','Values between goroutines','CSS attributes','Database columns','Channels support typed concurrency communication.']],
rust:[
['Rust ownership helps with what?','Memory safety','CSS layout','HTTP DNS','Ownership tracks lifetimes and prevents many safety errors.'],
['What does &T mean?','Shared reference','Static method','Tuple list','&T creates a shared reference.'],
['What does Option model?','A value or absence','Thread priority','A browser tab','Option can be Some(value) or None.']],
ruby:[
['Which method iterates arrays?','each','forEach only','printf','each yields array elements to a block.'],
['Which is a symbol literal?',' :name','@name','#name','Ruby symbols can use colon syntax.'],
['What does nil represent?','Absence of value','Zero','Empty string','nil is a distinct absence value.']],
php:[
['Which prefix marks a PHP variable?','$','@','&','PHP variable names begin with a dollar sign.'],
['What can key an associative array?','Strings','Only integers','Only objects','PHP arrays accept string keys.'],
['Which function counts array entries?','count()','strlen()','append()','count returns the number of entries.']],
kotlin:[
['What does val mean?','Read-only reference','Mutable variable','Class inheritance','val prevents reassignment.'],
['Which provides a fallback on null?','?:','??','||','Kotlin uses the Elvis operator for null defaults.'],
['What are data classes for?','Models of data','Compiling C','Drawing graphics only','Kotlin data classes generate helpful value methods.']],
swift:[
['Which declares a constant?','let','const','final','Swift uses let.'],
['What may an Optional contain?','A value or nil','Always an integer','Only a closure','Optionals may be nil.'],
['Which unwraps safely?','if let','if var','until','if let binds the value if present.']],
r:[
['Which computes an arithmetic mean?','mean()','averageSQL()','printf()','mean computes the arithmetic average.'],
['What combines items into a vector?','c()','echo()','arraySQL()','c concatenates values.'],
['What is NA?','Missing value','Network access','A function name','NA marks missing data.']],
bash:[
['Which expands a variable in Bash?','$name','%name','@name','Bash expands variables with a dollar sign.'],
['What does exit status zero normally indicate?','Success','Timeout','Access denied','A zero exit status generally signals success.'],
['Why quote a variable in commands?','Avoid accidental splitting','Compile Java','Increase speed','Quotes preserve spaces and reduce accidental globbing.']],
dart:[
['Which UI framework commonly uses Dart?','Flutter','Django','Spring','Flutter apps are written in Dart.'],
['What does final prevent?','Variable reassignment','All object mutation','Printing strings','final permits single assignment.'],
['What models an async result?','Future','ThreadOnly','CallbackOnly','A Future can hold a later result.']],
lua:[
['Lua uses which core collection?','table','dataframe','recordset','Lua tables implement arrays and maps.'],
['Which operator joins strings?','..','+','&','Lua uses two periods for concatenation.'],
['What is the conventional first array index?','1','0','-1','Lua sequences commonly begin at 1.']],
scala:[
['Which Scala collection is immutable?','List','ArrayBuffer','mutable.HashMap','List is immutable.'],
['What matches values by cases?','Pattern matching','CSS parser','SQL join','Pattern matching handles structured alternatives.'],
['What does Option represent?','Potential missing value','Network port','Filesystem path','Option can be Some or None.']]
};
export const QUESTIONS=Object.freeze(Object.fromEntries(Object.entries(Q).map(([language,entries])=>[language,Object.freeze(entries.map(([question,correct,w1,w2,explanation],index)=>Object.freeze({
 id:language+'-'+(index+1),language,question,choices:Object.freeze([w1,correct,w2]),answer:1,explanation,difficulty:['Foundation','Practice','Challenge'][index]
})))])));
export function grade(question,choice){if(!question||!Number.isInteger(choice)||choice<0||choice>=question.choices.length)return{valid:false,correct:false};return{valid:true,correct:choice===question.answer,explanation:question.explanation};}
export function safeQuestionProgress(raw){let x;try{x=JSON.parse(raw);}catch{return [];}if(!Array.isArray(x))return[];const allowed=new Set(Object.values(QUESTIONS).flat().map(q=>q.id));return [...new Set(x.filter(v=>typeof v==='string'&&allowed.has(v)))];}
export function questionStats(progress){return{solved:safeQuestionProgress(JSON.stringify(progress)).length,total:Object.values(QUESTIONS).reduce((n,x)=>n+x.length,0)};}
