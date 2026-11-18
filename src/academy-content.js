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

// Advanced practice pairs focus on debugging, safety, architecture and meaningful concepts.
const EXTRA={
 javascript:[
 ['Which API sets user-generated text without parsing HTML?','textContent','innerHTML','document.write','textContent inserts text without interpreting it as HTML.'],
 ['What does Promise.all do when one input promise rejects?','It rejects','It always returns partial values','It never settles','Promise.all rejects when any provided promise rejects.']],
 python:[
 ['What does yield create in a Python function?','A generator function','A compiled class','A SQL query','A function containing yield returns a generator that produces values lazily.'],
 ['How can a function avoid a shared mutable list default?','Use None and create a list inside','Use [] directly as a default','Use global list','Using None and constructing a list per call avoids sharing a single mutable default.']],
 sql:[
 ['What does GROUP BY support?','Aggregate results by group','Always sort ascending','Encrypt records','GROUP BY partitions rows so aggregate functions can summarize each group.'],
 ['How should values be inserted into SQL queries safely?','Parameterized queries','String concatenation of raw input','Escaping HTML only','Bind variables or prepared statements prevent data being misinterpreted as SQL syntax.']],
 html:[
 ['Which CSS feature responds to viewport width?','Media query','SQL WHERE','HTTP cookie','CSS media queries can apply different styles at different viewport widths.'],
 ['What should an image alt attribute convey?','Meaning or purpose when informative','Random keywords','Source file size','Useful alt text provides an equivalent for meaningful images; decorative images can use empty alt text.']],
 typescript:[
 ['What narrows a discriminated union?','Checking a shared literal tag','Removing all type annotations','Adding any to everything','A literal tag lets TypeScript narrow a union to a specific variant.'],
 ['What is the purpose of strictNullChecks?','Distinguish possibly null values','Disable modules','Remove interfaces','strictNullChecks requires nullable values to be handled explicitly.']],
 java:[
 ['Which Java collection dynamically grows as items are added?','ArrayList','Primitive int','Thread only','ArrayList expands storage as more elements are appended.'],
 ['What is try-with-resources designed to close?','AutoCloseable resources','Every class in the JVM','Only CSS files','Java try-with-resources invokes close on declared AutoCloseable resources.']],
 c:[
 ['What helps avoid writing beyond a fixed buffer?','Check bounds before writing','Assume input is always short','Use gets','Buffer bounds must be validated to prevent out-of-bounds writes.'],
 ['What does sizeof(array) report in its declaring scope for a real array?','The entire array size in bytes','Always the number of elements','Always pointer size','sizeof returns bytes for a real array; after parameter decay a pointer behaves differently.']],
 cpp:[
 ['Which smart pointer has exclusive ownership?','std::unique_ptr','std::shared_ptr','std::weak_ptr','unique_ptr exclusively owns its managed resource.'],
 ['What does std::move itself do?','Cast to an rvalue expression','Allocate new memory','Automatically destroy an object','std::move enables move operations but does not move data by itself.']],
 csharp:[
 ['What does a LINQ Where call produce?','A filtered sequence','A compiled EXE immediately','An HTML table','Where returns a sequence of elements matching a predicate.'],
 ['Why implement IDisposable?','Release resources deterministically','Force every class to be abstract','Create CSS','IDisposable defines explicit cleanup for managed/unmanaged resources.']],
 go:[
 ['Why use defer in a Go function?','Schedule a call when the function returns','Spawn a goroutine','Force a compiler error','defer schedules cleanup calls at function exit.'],
 ['What is context cancellation useful for?','Propagating cancel signals for work','Adding CSS animations','Managing HTML focus','A Context can carry cancellation and deadlines through Go operations.']],
 rust:[
 ['What does Result<T,E> model?','Success or error','Only a raw pointer','An HTML element','Result can be Ok(value) or Err(error).'],
 ['What restriction does Rust generally place on active mutable borrows?','Only one exclusive mutable borrow at a time','Unlimited simultaneous mutable borrows','No immutable references ever','The borrow checker enforces exclusive mutable borrowing.']],
 ruby:[
 ['What is a Ruby block used for?','Passing behavior to a method','Compiling SQL','Only declaring constants','Blocks pass executable behavior to methods.'],
 ['What does Hash store?','Key-value pairs','Only sequential indexes','Only executable files','Ruby Hash maps keys to values.']],
 php:[
 ['What helps escape HTML special characters in PHP output?','htmlspecialchars','eval','unlink','htmlspecialchars encodes HTML special characters before embedding untrusted text.'],
 ['How should PHP connect user values to SQL statements?','Prepared statements','Concatenating raw form input','Running shell commands','Prepared statements bind values separately from query syntax.']],
 kotlin:[
 ['What is a suspend function designed for?','Coroutine-friendly suspension','Database table creation','Forcing a thread for every call','suspend marks a function that can pause and resume in a coroutine.'],
 ['What can a sealed class help model?','Restricted known class hierarchies','Unrestricted inheritance across modules','Only numbers','Sealed hierarchies help exhaustively represent constrained states.']],
 swift:[
 ['Why use guard let for an optional?','Unwrap with an early-exit path','Convert it to HTML','Always allocate a class','guard let binds a non-optional value and requires an exit if missing.'],
 ['Are Swift structs generally value or reference types?','Value types','Always reference types','Neither','Swift structs have value semantics.']],
 r:[
 ['What does na.rm=TRUE commonly do in summary functions?','Ignore missing values','Replace values with zero','Sort columns','The na.rm argument requests removal of missing values for many summaries.'],
 ['Which R structure stores data in rows and named columns?','data.frame','Thread','CSS grid','A data.frame represents tabular data with columns of compatible lengths.']],
 bash:[
 ['Why use read -r in Bash?','Avoid backslash escape processing','Automatically encrypt input','Run a web server','read -r treats backslashes literally.'],
 ['What is the purpose of double bracket tests [[ ... ]]?','Shell conditional expressions','Creating a SQL table','Defining a Java class','Bash [[ ]] offers conditional expression syntax with safer string handling than many test forms.']],
 dart:[
 ['How does Stream differ from Future?','It can emit multiple asynchronous events','It always returns immediately with one value','It only creates CSS','A Stream can deliver a sequence of events over time.'],
 ['What does the ? suffix commonly indicate on a Dart type?','Nullable type','Thread-local type','Database field','A nullable type can contain null.']],
 lua:[
 ['What does pairs iterate over?','Table key-value entries','Only integer sequences','HTML elements','pairs traverses table entries and their keys.'],
 ['What is a metatable used for?','Customizing table behavior','Connecting to SQL automatically','Compiling C','Metatables customize operations such as indexing and arithmetic.']],
 scala:[
 ['What does map produce for a collection?','A transformed collection','A raw thread','A database transaction','map applies a function to each element and creates a result collection.'],
 ['What does Future represent in Scala?','An eventual result of asynchronous computation','A CSS animation','An immutable integer only','Futures represent results that may become available later.']]
};
export const QUESTIONS=Object.freeze(Object.fromEntries(Object.entries(Q).map(([language,entries])=>[
 language,Object.freeze([...entries,...EXTRA[language]].map(([question,correct,w1,w2,explanation],index)=>{
  const position=(index+language.length)%3;
  const choices=[w1,w2];choices.splice(position,0,correct);
  return Object.freeze({
    id:language+'-'+(index+1),language,question,choices:Object.freeze(choices),answer:position,explanation,
    difficulty:['Foundation','Practice','Challenge','Debugging','Secure design'][index]
  });
 })
])));
export function grade(question,choice){if(!question||!Number.isInteger(choice)||choice<0||choice>=question.choices.length)return{valid:false,correct:false};return{valid:true,correct:choice===question.answer,explanation:question.explanation};}
export function safeQuestionProgress(raw){let x;try{x=JSON.parse(raw);}catch{return [];}if(!Array.isArray(x))return[];const allowed=new Set(Object.values(QUESTIONS).flat().map(q=>q.id));return [...new Set(x.filter(v=>typeof v==='string'&&allowed.has(v)))];}
export function questionStats(progress){return{solved:safeQuestionProgress(JSON.stringify(progress)).length,total:Object.values(QUESTIONS).reduce((n,x)=>n+x.length,0)};}
