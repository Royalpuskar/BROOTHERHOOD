/**
 * BROOTHERHOOD STUDY LAB — original beginner-friendly computer-science roadmap.
 * Suggested topics only, not an official university syllabus.
 * Each lesson has a plain-language explanation, worked example and two answerable questions.
 */
const Q=(question,choices,answer,why)=>({question,choices,answer,why});
const L=(id,title,goal,explanation,example,remember,questions)=>({id,title,goal,explanation,example,remember,questions});
export const COURSES=[
 {id:'digital',symbol:'⊞',title:'Digital Systems',tag:'Build the logic',color:'#6ce5f3',
  intro:'Start with 0s and 1s, combine logic gates, and understand how circuits make decisions.',
  tool:'Logic Gate Simulator',time:'~45 min',lessons:[
  L('binary','Binary & Number Systems','Convert numbers between decimal and binary.',
    'Computers represent information as bits. A bit is either 0 or 1. Each binary position is a power of two: 8, 4, 2, 1 from left to right in a 4-bit number.',
    '1011₂ = 8 + 0 + 2 + 1 = 11₁₀. Decimal 13 is 1101₂.',
    'Read binary from the right: 1, 2, 4, 8, 16…',[
      Q('What is binary 1010 in decimal?',['8','10','12','14'],1,'1010₂ = 8 + 2 = 10.'),
      Q('How is decimal 7 written in binary?',['100','110','111','1000'],2,'7 = 4 + 2 + 1, so 111₂.')
    ]),
  L('gates','Logic Gates','Predict the output of AND, OR, XOR and NOT.',
    'A logic gate takes one or more bit inputs and creates a bit output. AND needs both inputs to be 1; OR needs at least one; XOR needs exactly one; NOT flips a single input.',
    'With A=1 and B=0: AND=0, OR=1, XOR=1, NOT A=0.',
    'Try every combination in the interactive gate workbench.',[
      Q('For A=1, B=0, what does AND output?',['0','1','10','Undefined'],0,'AND produces 1 only when both inputs are 1.'),
      Q('For A=1, B=1, what does XOR output?',['1','2','0','Undefined'],2,'XOR is 1 only when exactly one input is 1.')
    ]),
  L('boolean','Boolean Algebra','Simplify expressions using logic identities.',
    'Boolean algebra describes logical circuits using AND (·), OR (+) and NOT (¬). Useful laws include A·1=A, A+0=A and A+¬A=1.',
    'A·1 + A·0 = A + 0 = A. This means the extra gates can be removed.',
    'Simpler expressions usually mean fewer physical circuit components.',[
      Q('Which expression always equals 1?',['A·0','A+¬A','A·¬A','A+0'],1,'A OR NOT A is always true.'),
      Q('Simplify A·1.',['0','1','¬A','A'],3,'AND with 1 preserves A.')
    ]),
  L('truth','Truth Tables & Circuits','Test every possible input combination.',
    'A truth table lists outputs for all binary input combinations. Two inputs have 2²=4 rows; three inputs have 2³=8 rows. Tables help verify circuits before building them.',
    'For A XOR B: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0.',
    'Use the truth-table generator to see all four two-input cases.',[
      Q('How many rows does a truth table with 3 input bits need?',['3','6','8','9'],2,'There are 2³=8 input combinations.'),
      Q('When are the outputs of XOR and OR different?',['A=0 B=1','A=1 B=0','A=0 B=0','A=1 B=1'],3,'OR(1,1)=1 but XOR(1,1)=0.')
    ])
 ]},
 {id:'linear',symbol:'⌗',title:'Linear Algebra',tag:'Think in vectors',color:'#c0b0ff',
  intro:'Understand vectors, matrices and transformations with real calculations instead of only formulas.',
  tool:'Matrix Calculator',time:'~45 min',lessons:[
  L('vectors','Vectors & Magnitude','Describe direction and length using coordinates.',
    'A vector is an ordered list of values, often drawn as an arrow. Add vectors by adding matching components. The length of (x,y) is √(x²+y²).',
    'u=(2,3), v=(1,-1): u+v=(3,2), and |u|=√13≈3.61.',
    'A vector has both magnitude and direction.',[
      Q('What is (2,3)+(1,4)?',['(3,7)','(2,7)','(1,-1)','(8,12)'],0,'Add components: (2+1,3+4)=(3,7).'),
      Q('What is the magnitude of vector (3,4)?',['7','25','5','1'],2,'Compute the length: √(3²+4²)=√25=5.')
    ]),
  L('matrices','Matrix Operations','Add and multiply 2×2 matrices.',
    'A matrix arranges numbers in rows and columns. For addition, add matching entries. For multiplication, multiply each row by each column and sum the products.',
    '[[1,2],[3,4]] · [[1,0],[0,1]] equals the original matrix because the second is the identity matrix.',
    'Matrix order matters: AB and BA may be different.',[
      Q('Which matrix leaves A unchanged when multiplied by A?',['Zero matrix','Identity matrix','All-ones matrix','Any matrix'],1,'The identity matrix I satisfies AI=IA=A.'),
      Q('Which is the top-left entry of [[1,2],[3,4]]·[[2,0],[1,2]]?',['2','3','4','6'],2,'Row 1 dot column 1 = 1×2 + 2×1 = 4.')
    ]),
  L('determinant','Determinants','Know whether a 2×2 matrix is invertible.',
    'The determinant of a 2×2 matrix [[a,b],[c,d]] is ad−bc. If it equals zero, the matrix has no inverse. The absolute determinant also gives an area-scaling factor.',
    'For matrix [[2,1],[3,4]], det(A) = 2×4 − 1×3 = 8−3 = 5.',
    'Determinant zero means a transformation collapses space in at least one direction.',[
      Q('Find det([[1,2],[3,4]]).',['-2','2','10','0'],0,'The determinant is 1×4 − 2×3 = −2.'),
      Q('When does a square matrix have no inverse?',['When det=1','When det=0','When det>0','When it has decimals'],1,'A square matrix is invertible exactly when its determinant is nonzero.')
    ]),
  L('transform','Inverse & 2D Transformations','Undo a 2×2 transform when possible.',
    'A 2×2 matrix can rotate, stretch or reflect a vector. For a matrix with determinant Δ≠0, the inverse is (1/Δ)[[d,-b],[-c,a]]. Use the inverse to undo a transformation.',
    '[[2,0],[0,3]] sends (1,2) to (2,6). Its inverse scales x by 1/2 and y by 1/3.',
    'Try matrix–vector multiplication and inverse calculations in the workbench.',[
      Q('Where does [[2,0],[0,3]] send vector (1,2)?',['(1,2)','(3,5)','(2,6)','(2,3)'],2,'The new coordinates are (2×1,3×2)=(2,6).'),
      Q('What is the inverse of the identity matrix?',['Identity matrix','Zero matrix','Its negative','It has none'],0,'I·I=I, so I is its own inverse.')
    ])
 ]},
 {id:'discrete',symbol:'∩',title:'Discrete Mathematics',tag:'Reason clearly',color:'#ffc589',
  intro:'Use logic, sets, counting and graph theory to solve problems in computer science.',
  tool:'Sets & Graph Explorer',time:'~45 min',lessons:[
  L('sets','Sets & Operations','Compute unions, intersections and differences.',
    'A set is a collection of distinct values. A∪B contains items in either set. A∩B contains items in both. A−B keeps items from A that are not in B.',
    'For A={1,2,3}, B={3,4}: union={1,2,3,4}, intersection={3}, A−B={1,2}.',
    'Repeated values do not count twice in a set.',[
      Q('If A={1,2} and B={2,3}, what is A∩B?',['{1,2,3}','{2}','{1,3}','{}'],1,'The number 2 appears in both sets.'),
      Q('What is A∪B for A={1} and B={2,3}?',['{1}','{2,3}','{}','{1,2,3}'],3,'Union contains every distinct item from either set.')
    ]),
  L('logic','Propositions & Implication','Understand truth, negation and implications.',
    'A proposition is a statement that is true or false. P→Q means “if P then Q.” It is false only when P is true and Q is false. Negation ¬P reverses a truth value.',
    'If “it rains” is true and “the road is wet” is false, the implication is false.',
    'An implication does not mean P and Q must both be true.',[
      Q('When is P→Q false?',['P=0,Q=0','P=0,Q=1','P=1,Q=0','P=1,Q=1'],2,'Only a true premise followed by a false conclusion makes implication false.'),
      Q('What does ¬(P∧Q) equal?',['¬P∨¬Q','P∨Q','¬P∧¬Q','P∧Q'],0,'De Morgan’s law: NOT(P AND Q)=(NOT P) OR (NOT Q).')
    ]),
  L('count','Counting & Combinations','Count arrangements without guessing.',
    'The multiplication principle counts independent choices by multiplying counts. Permutations care about order, but combinations count selections where order does not matter.',
    'Choose 2 students from 4: C(4,2)=4!/(2!2!)=6. There are 4×3=12 ordered pairs.',
    'Ask: does swapping the chosen items create a different outcome?',[
      Q('How many 2-person groups can be chosen from 4 students?',['4','6','8','12'],1,'Use C(4,2)=4×3/2=6 distinct groups.'),
      Q('How many passwords can be made from 2 digits 0–9 with repetition?',['10','20','90','100'],3,'Ten choices for each digit gives 10×10=100.')
    ]),
  L('graphs','Graph Theory & BFS','Explore nodes, edges and shortest unweighted paths.',
    'A graph connects vertices using edges. Breadth-first search (BFS) visits nearest neighbors first; in an unweighted graph this finds the shortest path by number of edges.',
    'For edges A–B, A–C, B–D, BFS from A visits A, B, C, D if neighbors are alphabetically ordered.',
    'Try changing the edges to see how the BFS order changes.',[
      Q('Which algorithm finds shortest paths by edge count in an unweighted graph?',['DFS','BFS','Bubble sort','Binary search'],1,'BFS explores vertices in increasing distance from the start.'),
      Q('A graph vertex is another name for a…',['Node','Edge','Cycle','Weight'],0,'Nodes (vertices) are the points that edges connect.')
    ])
 ]},
 {id:'dsa',symbol:'▥',title:'Data Structures',tag:'Organize information',color:'#a4e9c1',
 intro:'Choose useful ways to store and retrieve information before writing complex programs.',
 tool:'Practice Lessons',time:'~30 min',lessons:[
 L('arrays','Arrays & Indexing','Understand ordered collections.',
  'An array stores values in an order. In many languages, the first element has index 0. Arrays are useful when you need to visit or update items by position.',
  'items=[7,9,3]; items[1] is 9 in JavaScript and Python.','Indices count positions, not the values themselves.',[
   Q('What is the first array index in JavaScript?',['0','1','-1','2'],0,'JavaScript arrays start at index 0.'),
   Q('For [4,7,8], what is the value at index 2?',['4','7','8','2'],2,'Index 0→4, index 1→7, index 2→8.')
  ]),
 L('stacks','Stacks & Queues','Know LIFO and FIFO behaviors.',
  'A stack is last-in, first-out (LIFO), like plates on a stack. A queue is first-in, first-out (FIFO), like people waiting in line.',
  'Push A, then B into a stack: the first pop returns B. Enqueue A then B: the first dequeue returns A.','Stacks help with undo; queues help with orderly processing.',[
   Q('Which structure typically powers an undo feature?',['Queue','Stack','Graph','Set'],1,'Stacks retrieve the most recently pushed item first.'),
   Q('A queue is…',['LIFO','Random order','FIFO','Always sorted'],2,'First-in, first-out.')
  ]),
 L('trees','Trees & Hash Maps','Understand hierarchical and key-based storage.',
  'Trees store parent–child relationships. Hash maps associate keys with values for fast average lookup. Both are widely used for organizing software data.',
  'An organization chart is a tree. A dictionary mapping student ID to grade is a hash map.','Pick a structure based on the operations you need most.',[
   Q('Which structure best models a file-folder hierarchy?',['Tree','Stack','Array only','Number'],0,'Folders and nested folders form a tree.'),
   Q('What does a hash map associate?',['Shapes and colors only','A queue with stack','Only two arrays','Keys with values'],3,'Hash maps look up values using keys.')
  ])
 ]},
 {id:'algorithms',symbol:'⇄',title:'Algorithms',tag:'Solve efficiently',color:'#8de3ff',
 intro:'Write steps that work, then reason about their speed and correctness.',
 tool:'Practice Lessons',time:'~30 min',lessons:[
 L('complexity','Big-O Basics','Compare growth rates as inputs get larger.',
  'Big-O describes how work grows with input size. Scanning a list is O(n). Halving a sorted search area repeatedly gives O(log n). A nested loop can be O(n²).',
  'With 1,000 items, linear search may inspect 1,000 items, while binary search needs about 10 comparisons.','Efficiency matters more as the data grows.',[
   Q('Scanning all n items once is typically…',['O(1)','O(n)','O(n²)','O(2ⁿ)'],1,'A linear scan performs work proportional to n.'),
   Q('Binary search on a sorted array typically takes…',['O(n²)','O(n)','O(log n)','O(2ⁿ)'],2,'Each step roughly halves the remaining search range.')
  ]),
 L('sorting','Sorting Algorithms','Tell insertion sort from merge sort.',
  'Insertion sort inserts one item at a time into a growing sorted section. Merge sort divides the list and combines sorted halves, typically requiring O(n log n) time.',
  'Insertion sort on [3,1,2]: insert 1 before 3, then insert 2 between 1 and 3.','When choosing a sort, consider input size and available memory.',[
   Q('Which sorting strategy divides a list into halves, then merges them?',['Merge sort','Linear search','BFS','Hashing'],0,'Merge sort divides and merges.'),
   Q('What is typical worst-case time for insertion sort?',['O(1)','O(log n)','O(n)','O(n²)'],3,'When many elements shift, insertion sort can take quadratic time.')
  ]),
 L('searching','Searching & Conditions','Know when binary search is appropriate.',
  'Linear search checks items one by one. Binary search requires sorted data and repeatedly compares the middle item to reduce the search interval.',
  'To find 7 in [1,3,5,7,9], check 5, then 7 in the right half.','Binary search is not valid on an unsorted array without additional work.',[
   Q('Binary search requires…',['An array with no duplicates','Sorted data','A stack','Exactly 10 items'],1,'Binary search relies on the order of the data.'),
   Q('Which strategy checks items in sequence?',['DFS','Matrix inversion','Linear search','Merge sort'],2,'Linear search examines one item at a time.')
  ])
 ]},
 {id:'architecture',symbol:'▣',title:'Computer Architecture',tag:'Inside the machine',color:'#ffb5a0',
 intro:'Discover how processors, memory and binary instructions work together.',
 tool:'Practice Lessons',time:'~30 min',lessons:[
 L('cpu','CPU & Instruction Cycle','Explain fetch, decode and execute.',
  'The CPU repeatedly fetches an instruction from memory, decodes it, then executes it. Registers hold small, fast values used by the processor.',
  'To add two numbers, a processor may load values into registers, execute ADD, then store the result.','A CPU handles instructions, not whole programming languages directly.',[
   Q('Which order describes a common CPU instruction cycle?',['Execute–fetch–decode','Fetch–decode–execute','Store–execute–fetch','Decode–store–fetch'],1,'Fetch, decode and execute are the fundamental phases.'),
   Q('Where are values commonly held for very fast CPU operations?',['Hard drive','Printer','Registers','Monitor'],2,'CPU registers are small, fast storage locations.')
  ]),
 L('memory','RAM, Cache & Storage','Compare fast memory and persistent storage.',
  'Registers and cache are very fast, small memory areas close to the CPU. RAM holds active programs, but is typically volatile. SSD or HDD storage retains files after power is removed.',
  'A browser tab uses RAM while open; saved downloads remain on storage after restart.','Fast memory is generally more expensive per byte.',[
   Q('Which memory normally loses its data when power is removed?',['SSD','RAM','USB flash','DVD'],1,'Typical RAM is volatile.'),
   Q('Which is closest to a CPU core?',['L1 cache','Cloud storage','USB drive','Hard disk'],0,'L1 cache is on or near the processor core.')
  ]),
 L('representation','Bytes & Two’s Complement','See how computers store signed integers.',
  'Eight bits make a byte. Two’s complement is a common representation of signed integers; for n bits, values range from −2ⁿ⁻¹ to 2ⁿ⁻¹−1.',
  'With 8-bit two’s complement, −1 is 11111111 and the range is −128 to 127.','The meaning of a bit pattern depends on its representation.',[
   Q('How many bits are in one byte?',['4','16','8','32'],2,'A byte is eight bits.'),
   Q('What is the range of signed 8-bit two’s-complement values?',['0 to 255','−127 to 128','−256 to 255','−128 to 127'],3,'Signed 8-bit two’s complement ranges from −128 through 127.')
  ])
 ]},
 {id:'networks',symbol:'⌁',title:'Computer Networks',tag:'Connect the world',color:'#f6d4a0',
 intro:'Learn how data travels between devices and why secure communication matters.',
 tool:'Practice Lessons',time:'~30 min',lessons:[
 L('packets','Packets & Addresses','Know how messages travel across networks.',
  'Large messages can be split into packets. Devices use network addresses to route packets toward destinations. Routers forward packets between networks.',
  'A file download travels as many packets that can be reassembled at the destination.','A packet may take a different route from another packet.',[
   Q('What commonly forwards packets between different networks?',['Router','Mouse','Monitor','Keyboard'],0,'Routers connect networks and forward packets.'),
   Q('Why split a file into packets?',['To make it invisible','To transmit manageable units','To remove all errors','To avoid addresses'],1,'Packets allow networks to transmit and handle data in manageable pieces.')
  ]),
 L('protocols','TCP, IP, DNS & HTTP','Identify the role of common protocols.',
  'IP provides addressing and routing. TCP establishes a reliable ordered byte stream. DNS translates domain names to IP addresses. HTTPS adds authenticated encrypted HTTP transport.',
  'Typing a website name may cause a DNS lookup before the browser connects using HTTPS.','Protocols are agreements on how machines exchange information.',[
   Q('What service translates domain names into IP addresses?',['TCP','HTML','DNS','USB'],2,'DNS resolves names into network addresses.'),
   Q('What does HTTPS provide over regular HTTP?',['Guaranteed safety from all attacks','No connection required','Public IP hiding','Encryption and authentication in transit'],3,'HTTPS uses TLS to protect communications in transit.')
  ]),
 L('security','Network Safety','Recognize least privilege and encrypted transport.',
  'Networks should validate input, protect credentials, use encrypted connections, and restrict permissions. Firewalls filter traffic based on rules but are not a substitute for good application security.',
  'Use strong unique passwords, multifactor authentication when available, and HTTPS for sensitive traffic.','A lock icon does not prove a website is honest—check who you are talking to.',[
   Q('What is least privilege?',['Give only needed permissions','Give everyone administrator access','Never update software','Allow all traffic'],0,'Least privilege limits access to what a user or service needs.'),
   Q('What is a useful defense against password reuse attacks?',['Reuse short passwords','Unique passwords and MFA','Disable updates','Share passwords by email'],1,'Unique passwords and multifactor authentication improve account security.')
  ])
 ]}
];
export const ALL_LESSONS=COURSES.flatMap(course=>course.lessons.map(lesson=>({...lesson,courseId:course.id,courseTitle:course.title})));
export const lessonKey=(courseId,lessonId)=>courseId+':'+lessonId;
export const getCourse=id=>COURSES.find(x=>x.id===id)||null;
export const getLesson=(courseId,lessonId)=>getCourse(courseId)?.lessons.find(x=>x.id===lessonId)||null;
export const quizTotal=ALL_LESSONS.reduce((n,lesson)=>n+lesson.questions.length,0);
export function gradeLesson(courseId,lessonId,answers){
 const lesson=getLesson(courseId,lessonId);
 if(!lesson||!Array.isArray(answers)||answers.length!==lesson.questions.length)return null;
 if(answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=lesson.questions[i].choices.length))return null;
 return {score:answers.filter((a,i)=>a===lesson.questions[i].answer).length,total:lesson.questions.length,
  feedback:lesson.questions.map((q,i)=>({correct:answers[i]===q.answer,explanation:q.why,answer:q.choices[q.answer]}))};
}
