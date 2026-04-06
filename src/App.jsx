import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const store = {
  async get(k){try{const v=localStorage.getItem('schulfit_'+k);return v?JSON.parse(v):null;}catch(e){return null;}},
  async set(k,v){try{localStorage.setItem('schulfit_'+k,JSON.stringify(v));}catch(e){}}
};

function sfx(text,pitch,rate,vol){try{var u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.pitch=pitch;u.rate=rate;u.volume=vol||1;window.speechSynthesis.speak(u);}catch(e){}}
function playSound(t){if(t==='correct')sfx('Yay!',2,1.5,1);else if(t==='wrong')sfx('Oh no!',0.5,0.85,0.9);}
function playFanfare(){sfx('Hooray! Well done!',1.6,1.3,1);}

var _st={gender:'female',setOwl:null};
function speak(text){
  try{
    window.speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(text);u.lang='de-DE';
    var all=window.speechSynthesis.getVoices();
    var de=all.filter(function(v){return v.lang.startsWith('de');});
    var pool=de.length?de:all;
    if(_st.gender==='male'){
      var mv=pool.find(function(v){return /male/i.test(v.name);})||(pool.length>1?pool[pool.length-1]:null);
      if(mv)u.voice=mv;u.pitch=0.4;u.rate=0.78;
    }else{
      var fv=pool.find(function(v){return /female/i.test(v.name);})||pool[0];
      if(fv)u.voice=fv;u.pitch=1.3;u.rate=0.88;
    }
    if(_st.setOwl){_st.setOwl('talk');u.onend=function(){_st.setOwl('idle');};u.onerror=function(){_st.setOwl('idle');};}
    window.speechSynthesis.speak(u);
  }catch(e){}
}
function openLink(url){try{window.open(url,'_blank','noopener,noreferrer');}catch(e){}}

function toG(n){
  if(n===100)return'hundert';
  var ones=['','eins','zwei','drei','vier','funf','sechs','sieben','acht','neun','zehn','elf','zwolf','dreizehn','vierzehn','funfzehn','sechzehn','siebzehn','achtzehn','neunzehn'];
  if(n<20)return ones[n];
  var tens=['','','zwanzig','dreissig','vierzig','funfzig','sechzig','siebzig','achtzig','neunzig'];
  var unit=['','ein','zwei','drei','vier','funf','sechs','sieben','acht','neun'];
  var d=Math.floor(n/10),r=n%10;
  return r===0?tens[d]:unit[r]+'und'+tens[d];
}
function shuffle(a){return a.slice().sort(function(){return Math.random()-.5;});}
function normalize(s){return s.toLowerCase().replace(/[^a-z0-9]/g,'').trim();}
function todayStr(){return new Date().toISOString().slice(0,10);}
function getLast7(daily){
  var days=[];
  for(var i=6;i>=0;i--){
    var d=new Date();d.setDate(d.getDate()-i);
    var ds=d.toISOString().slice(0,10);
    var lbl=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
    var found=daily.find(function(x){return x.date===ds;});
    days.push({label:lbl,Questions:found?found.questions:0,Correct:found?found.correct:0});
  }
  return days;
}

function genNumbers(){
  return shuffle(Array.from({length:100},function(_,i){return i+1;})).slice(0,20).map(function(n){
    return{display:String(n),german:toG(n),english:String(n)};
  });
}
function mkOpts(r){
  var w=new Set();
  for(var i=0;w.size<3&&i<40;i++){var x=r+Math.floor(Math.random()*5)-2;if(x!==r&&x>=0&&x<=30)w.add(x);}
  [1,2,3,4,5].forEach(function(d){if(w.size<3&&r+d<=30)w.add(r+d);if(w.size<3&&r-d>=0)w.add(r-d);});
  return shuffle([r].concat(Array.from(w))).slice(0,4).map(String);
}
function genMath(){
  return Array.from({length:20},function(_,i){
    var a,b,op,r;
    if(i%2===0){a=Math.floor(Math.random()*9)+1;b=Math.floor(Math.random()*(10-a))+1;op='+';r=a+b;}
    else{r=Math.floor(Math.random()*9)+1;b=Math.floor(Math.random()*r)+1;a=r+b;op='-';}
    return{numA:a,numB:b,op:op,result:r,german:String(r),mathOpts:mkOpts(r)};
  });
}
function genComp(){
  var o=[];
  for(var i=0;i<20;i++){
    var a,b,qType,ans;
    var t=i%4;
    if(t===3){
      if(Math.random()>0.5){a=b=Math.floor(Math.random()*9)+1;}
      else{do{a=Math.floor(Math.random()*10)+1;b=Math.floor(Math.random()*10)+1;}while(a===b);}
      qType='equal';ans=a===b?'ja':'nein';
    }else{
      do{a=Math.floor(Math.random()*10)+1;b=Math.floor(Math.random()*10)+1;}while(a===b);
      if(t===0){qType='bigger';ans=a>b?String(a):String(b);}
      else if(t===1){qType='smaller';ans=a<b?String(a):String(b);}
      else{qType='truefalse';ans=a>b?'ja':'nein';}
    }
    o.push({numA:a,numB:b,qType:qType,cmpAnswer:ans});
  }
  return o;
}
function genEvenOdd(){
  return shuffle(Array.from({length:20},function(_,i){return i+1;})).map(function(n){
    return{display:String(n),german:n%2===0?'Gerade':'Ungerade',english:n%2===0?'Even':'Odd'};
  });
}
function getItems(c){
  if(c.type==='comparison')return genComp();
  if(c.type==='math')return genMath();
  if(c.type==='evenodd')return genEvenOdd();
  if(c.type==='colorfill')return shuffle(c.items);
  if(c.type==='guide')return c.items;
  var its=c.dynamic?genNumbers():shuffle(c.items);
  if(c.type==='plural'){
    var out=[];
    its.forEach(function(item){
      out.push(Object.assign({},item,{quizAsk:'mehrzahl',count:3}));
      out.push(Object.assign({},item,{quizAsk:'einzahl',count:1}));
    });
    return shuffle(out);
  }
  return its;
}
function correctVal(item,cat){
  if(!item||!cat)return'';
  if(cat.type==='plural')return item.quizAsk==='einzahl'?item.german:item.plural;
  if(cat.type==='comparison')return item.cmpAnswer||'';
  return item.german||'';
}
function qSpeech(item,cat){
  if(!item||!cat)return'';
  if(cat.type==='plural'){
    var word=item.quizAsk==='einzahl'?item.german:item.plural;
    return item.count===1?'Ist '+word+' Einzahl oder Mehrzahl?':'Sind '+word+' Einzahl oder Mehrzahl?';
  }
  if(cat.type==='evenodd')return'Ist '+item.display+' gerade oder ungerade?';
  if(cat.type==='comparison'){
    var a=toG(item.numA),b=toG(item.numB);
    if(item.qType==='smaller')return'Welche Zahl ist kleiner? '+a+' oder '+b+'?';
    if(item.qType==='truefalse')return'Ist '+a+' groesser als '+b+'? Ja oder Nein?';
    if(item.qType==='equal')return'Sind '+a+' und '+b+' gleich? Ja oder Nein?';
    return'Welche Zahl ist groesser? '+a+' oder '+b+'?';
  }
  if(cat.type==='math'){var op=item.op==='+'?'plus':'minus';return toG(item.numA)+' '+op+' '+toG(item.numB);}
  return correctVal(item,cat);
}
function buildOpts(item,cat,items){
  if(!item||!cat)return[];
  var t=cat.type;
  if(t==='colorfill'){var c=PAL.find(function(x){return x.german===item.german;});return shuffle([c].concat(shuffle(PAL.filter(function(x){return x.german!==item.german;})).slice(0,5)));}
  if(t==='comparison')return[];
  if(t==='math')return item.mathOpts||[];
  if(t==='plural')return[item.german,item.plural];
  if(t==='evenodd')return['Gerade','Ungerade'];
  var others=shuffle(items.filter(function(i){return i.german!==item.german;})).slice(0,3);
  return shuffle([item].concat(others)).map(function(o){return o.german;});
}

var PAL=[
  {german:'Rot',english:'Red',hex:'#EF4444'},{german:'Blau',english:'Blue',hex:'#3B82F6'},
  {german:'Grun',english:'Green',hex:'#22C55E'},{german:'Gelb',english:'Yellow',hex:'#EAB308'},
  {german:'Orange',english:'Orange',hex:'#F97316'},{german:'Lila',english:'Purple',hex:'#A855F7'},
  {german:'Rosa',english:'Pink',hex:'#EC4899'},{german:'Braun',english:'Brown',hex:'#854D0E'},
  {german:'Grau',english:'Gray',hex:'#6B7280'},{german:'Turkis',english:'Turquoise',hex:'#06B6D4'},
  {german:'Gold',english:'Gold',hex:'#D97706'},{german:'Schwarz',english:'Black',hex:'#1F2937'}
];

function ShapeSVG(props){
  var name=props.name,fill=props.fill||'white',size=props.size||140;
  var S='#333',W=5;
  var rays=[0,45,90,135,180,225,270,315].map(function(a){var r=a*Math.PI/180;return[75+48*Math.sin(r),75-48*Math.cos(r),75+63*Math.sin(r),75-63*Math.cos(r)];});
  var petals=[0,60,120,180,240,300].map(function(a){var r=a*Math.PI/180;return{cx:75+38*Math.sin(r),cy:75-38*Math.cos(r),a:a};});
  var shapes={
    circle:<circle cx="75" cy="75" r="60" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/>,
    star:<polygon points="75,12 91,52 134,52 100,78 113,120 75,94 37,120 50,78 16,52 59,52" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/>,
    heart:<path d="M75,115C35,85 18,50 18,38C18,18 37,8 52,14C63,18 75,34 75,34C75,34 87,18 98,14C113,8 132,18 132,38C132,50 115,85 75,115Z" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/>,
    sun:<g>{rays.map(function(ray,i){return <line key={i} x1={ray[0]} y1={ray[1]} x2={ray[2]} y2={ray[3]} stroke={S} strokeWidth={W} strokeLinecap="round"/>;})}<circle cx="75" cy="75" r="36" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/></g>,
    diamond:<polygon points="75,10 132,75 75,140 18,75" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/>,
    balloon:<g><ellipse cx="75" cy="65" rx="42" ry="52" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/><path d="M75,117Q70,132 65,140M65,140Q75,134 85,140" stroke={S} strokeWidth={W} fill="none" strokeLinecap="round"/></g>,
    house:<g><rect x="22" y="72" width="106" height="68" rx="3" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/><polygon points="75,18 132,72 18,72" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/><rect x="55" y="102" width="40" height="38" rx="2" fill={fill} stroke={S} strokeWidth={W}/></g>,
    flower:<g>{petals.map(function(pt){return <ellipse key={pt.a} cx={pt.cx} cy={pt.cy} rx="16" ry="24" transform={"rotate("+pt.a+","+pt.cx+","+pt.cy+")"} fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/>;})}<circle cx="75" cy="75" r="22" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/></g>,
    leaf:<path d="M75,20C115,18 130,58 105,98C95,115 85,126 75,132C65,126 55,115 45,98C20,58 35,18 75,20Z" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/>,
    fish:<g><ellipse cx="65" cy="75" rx="48" ry="32" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/><polygon points="113,75 142,46 142,104" fill={fill} stroke={S} strokeWidth={W} strokeLinejoin="round"/><circle cx="42" cy="65" r="7" fill={S}/></g>
  };
  return <svg width={size} height={size} viewBox="0 0 150 150" style={{display:'block'}}>{shapes[name]||shapes.circle}</svg>;
}

function DotGrid(props){
  var count=Math.min(props.count,10),color=props.color;
  return <div style={{display:'flex',flexWrap:'wrap',gap:5,width:90,justifyContent:'center',minHeight:50}}>{Array.from({length:count},function(_,i){return <div key={i} style={{width:18,height:18,borderRadius:'50%',background:color,boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>;})}</div>;
}

var CATS=[
  {id:'colors',label:'Farben',sublabel:'Colors',icon:'col',emoji:'🎨',items:[{emoji:'🔴',german:'Rot',english:'Red'},{emoji:'🔵',german:'Blau',english:'Blue'},{emoji:'🟢',german:'Grun',english:'Green'},{emoji:'🟡',german:'Gelb',english:'Yellow'},{emoji:'🟠',german:'Orange',english:'Orange'},{emoji:'⚫',german:'Schwarz',english:'Black'},{emoji:'⚪',german:'Weiss',english:'White'},{emoji:'🟣',german:'Lila',english:'Purple'},{emoji:'🩷',german:'Rosa',english:'Pink'},{emoji:'🟤',german:'Braun',english:'Brown'},{emoji:'💛',german:'Gold',english:'Gold'}]},
  {id:'shapes',label:'Formen',sublabel:'Shapes',icon:'sha',emoji:'🔷',items:[{emoji:'🔵',german:'Kreis',english:'Circle'},{emoji:'🔺',german:'Dreieck',english:'Triangle'},{emoji:'🟥',german:'Quadrat',english:'Square'},{emoji:'🔷',german:'Rechteck',english:'Rectangle'},{emoji:'⭐',german:'Stern',english:'Star'},{emoji:'❤️',german:'Herz',english:'Heart'},{emoji:'🔶',german:'Raute',english:'Diamond'},{emoji:'🥚',german:'Oval',english:'Oval'},{emoji:'🌙',german:'Halbmond',english:'Crescent'},{emoji:'➕',german:'Kreuz',english:'Cross'}]},
  {id:'body',label:'Korper',sublabel:'Body Parts',icon:'bod',emoji:'🧒',items:[{emoji:'👁️',german:'Augen',english:'Eyes'},{emoji:'👃',german:'Nase',english:'Nose'},{emoji:'👄',german:'Mund',english:'Mouth'},{emoji:'👂',german:'Ohren',english:'Ears'},{emoji:'💇',german:'Kopf',english:'Head'},{emoji:'🤚',german:'Hand',english:'Hand'},{emoji:'🦵',german:'Bein',english:'Leg'},{emoji:'🦶',german:'Fuss',english:'Foot'},{emoji:'🫁',german:'Bauch',english:'Tummy'},{emoji:'💪',german:'Arm',english:'Arm'},{emoji:'🦷',german:'Zahne',english:'Teeth'},{emoji:'💈',german:'Haar',english:'Hair'},{emoji:'🫲',german:'Finger',english:'Finger'},{emoji:'🎽',german:'Schulter',english:'Shoulder'},{emoji:'🦿',german:'Knie',english:'Knee'}]},
  {id:'objects',label:'Dinge',sublabel:'Objects',icon:'obj',emoji:'🏠',items:[{emoji:'🍎',german:'Apfel',english:'Apple'},{emoji:'🐶',german:'Hund',english:'Dog'},{emoji:'🐱',german:'Katze',english:'Cat'},{emoji:'🚗',german:'Auto',english:'Car'},{emoji:'📚',german:'Buch',english:'Book'},{emoji:'🏠',german:'Haus',english:'House'},{emoji:'⚽',german:'Ball',english:'Ball'},{emoji:'🌸',german:'Blume',english:'Flower'},{emoji:'✏️',german:'Stift',english:'Pencil'},{emoji:'🪑',german:'Stuhl',english:'Chair'},{emoji:'🛏️',german:'Bett',english:'Bed'},{emoji:'💡',german:'Lampe',english:'Lamp'},{emoji:'☕',german:'Tasse',english:'Cup'},{emoji:'⏰',german:'Uhr',english:'Clock'},{emoji:'🔑',german:'Schlussel',english:'Key'},{emoji:'📱',german:'Telefon',english:'Phone'},{emoji:'👟',german:'Schuh',english:'Shoe'},{emoji:'🌳',german:'Baum',english:'Tree'},{emoji:'🐦',german:'Vogel',english:'Bird'},{emoji:'🧸',german:'Teddy',english:'Teddy'},{emoji:'🎒',german:'Rucksack',english:'Backpack'},{emoji:'🚪',german:'Tur',english:'Door'}]},
  {id:'animals',label:'Tiere',sublabel:'Animals',icon:'ani',emoji:'🐾',items:[{emoji:'🐴',german:'Pferd',english:'Horse'},{emoji:'🐄',german:'Kuh',english:'Cow'},{emoji:'🐷',german:'Schwein',english:'Pig'},{emoji:'🐑',german:'Schaf',english:'Sheep'},{emoji:'🐓',german:'Huhn',english:'Chicken'},{emoji:'🐇',german:'Hase',english:'Rabbit'},{emoji:'🦊',german:'Fuchs',english:'Fox'},{emoji:'🐺',german:'Wolf',english:'Wolf'},{emoji:'🐻',german:'Bar',english:'Bear'},{emoji:'🐘',german:'Elefant',english:'Elephant'},{emoji:'🦁',german:'Lowe',english:'Lion'},{emoji:'🐯',german:'Tiger',english:'Tiger'},{emoji:'🐒',german:'Affe',english:'Monkey'},{emoji:'🐬',german:'Delfin',english:'Dolphin'},{emoji:'🦅',german:'Adler',english:'Eagle'},{emoji:'🐸',german:'Frosch',english:'Frog'},{emoji:'🦋',german:'Schmetterling',english:'Butterfly'},{emoji:'🐢',german:'Schildkrote',english:'Turtle'},{emoji:'🦒',german:'Giraffe',english:'Giraffe'}]},
  {id:'food',label:'Essen',sublabel:'Food',icon:'foo',emoji:'🍎',items:[{emoji:'🍎',german:'Apfel',english:'Apple'},{emoji:'🍌',german:'Banane',english:'Banana'},{emoji:'🍓',german:'Erdbeere',english:'Strawberry'},{emoji:'🥕',german:'Karotte',english:'Carrot'},{emoji:'🥔',german:'Kartoffel',english:'Potato'},{emoji:'🍞',german:'Brot',english:'Bread'},{emoji:'🧀',german:'Kase',english:'Cheese'},{emoji:'🥛',german:'Milch',english:'Milk'},{emoji:'🍳',german:'Ei',english:'Egg'},{emoji:'🍝',german:'Nudeln',english:'Noodles'},{emoji:'🍰',german:'Kuchen',english:'Cake'},{emoji:'🍦',german:'Eis',english:'Ice cream'},{emoji:'💧',german:'Wasser',english:'Water'},{emoji:'🥤',german:'Saft',english:'Juice'},{emoji:'🍫',german:'Schokolade',english:'Chocolate'}]},
  {id:'family',label:'Familie',sublabel:'Family',icon:'fam',emoji:'👪',items:[{emoji:'👩',german:'Mama',english:'Mom'},{emoji:'👨',german:'Papa',english:'Dad'},{emoji:'👧',german:'Schwester',english:'Sister'},{emoji:'👦',german:'Bruder',english:'Brother'},{emoji:'👵',german:'Oma',english:'Grandma'},{emoji:'👴',german:'Opa',english:'Grandpa'},{emoji:'👶',german:'Baby',english:'Baby'},{emoji:'🤱',german:'Tante',english:'Aunt'},{emoji:'🧔',german:'Onkel',english:'Uncle'}]},
  {id:'time',label:'Zeit',sublabel:'Time and Seasons',icon:'tim',emoji:'📅',items:[{emoji:'1️⃣',german:'Montag',english:'Monday'},{emoji:'2️⃣',german:'Dienstag',english:'Tuesday'},{emoji:'3️⃣',german:'Mittwoch',english:'Wednesday'},{emoji:'4️⃣',german:'Donnerstag',english:'Thursday'},{emoji:'🎉',german:'Freitag',english:'Friday'},{emoji:'😊',german:'Samstag',english:'Saturday'},{emoji:'⛪',german:'Sonntag',english:'Sunday'},{emoji:'🌱',german:'Fruhling',english:'Spring'},{emoji:'☀️',german:'Sommer',english:'Summer'},{emoji:'🍂',german:'Herbst',english:'Autumn'},{emoji:'❄️',german:'Winter',english:'Winter'},{emoji:'🌅',german:'Morgen',english:'Morning'},{emoji:'🌞',german:'Mittag',english:'Noon'},{emoji:'🌆',german:'Abend',english:'Evening'},{emoji:'🌙',german:'Nacht',english:'Night'}]},
  {id:'positions',label:'Positionen',sublabel:'Positions',icon:'pos',emoji:'📍',items:[{emoji:'⬆️',german:'Oben',english:'Above'},{emoji:'⬇️',german:'Unten',english:'Below'},{emoji:'⬅️',german:'Links',english:'Left'},{emoji:'➡️',german:'Rechts',english:'Right'},{emoji:'↔️',german:'Neben',english:'Next to'},{emoji:'🔙',german:'Hinter',english:'Behind'},{emoji:'👆',german:'Vor',english:'In front of'},{emoji:'🔝',german:'Auf',english:'On top of'},{emoji:'📦',german:'In',english:'Inside'},{emoji:'🔄',german:'Zwischen',english:'Between'}]},
  {id:'jobs',label:'Berufe',sublabel:'Professions',icon:'job',emoji:'👷',items:[{emoji:'👮',german:'Polizist',english:'Police officer'},{emoji:'🚒',german:'Feuerwehrmann',english:'Firefighter'},{emoji:'👷',german:'Bauarbeiter',english:'Construction worker'},{emoji:'✈️',german:'Pilot',english:'Pilot'},{emoji:'🚌',german:'Busfahrer',english:'Bus driver'}]},
  {id:'dinos',label:'Dinosaurier',sublabel:'Dinosaurs',icon:'din',emoji:'🦕',items:[{emoji:'🦖',german:'Tyrannosaurus Rex',english:'Biggest meat-eater!'},{emoji:'🦕',german:'Brachiosaurus',english:'Super long neck!'},{emoji:'🦖',german:'Triceratops',english:'Three horns!'},{emoji:'🦕',german:'Stegosaurus',english:'Plates on back!'},{emoji:'🦖',german:'Velociraptor',english:'Very fast!'},{emoji:'🦕',german:'Diplodocus',english:'Longest dino!'},{emoji:'🦖',german:'Spinosaurus',english:'Big fin on back!'},{emoji:'🦕',german:'Ankylosaurus',english:'Armored tank!'}]},
  {id:'plural',label:'Einzahl Mehrzahl',sublabel:'Singular and Plural',icon:'plr',emoji:'📝',type:'plural',items:[{emoji:'🍎',german:'Apfel',plural:'Apfel',english:'Apple'},{emoji:'🐶',german:'Hund',plural:'Hunde',english:'Dog'},{emoji:'🐱',german:'Katze',plural:'Katzen',english:'Cat'},{emoji:'🚗',german:'Auto',plural:'Autos',english:'Car'},{emoji:'📚',german:'Buch',plural:'Bucher',english:'Book'},{emoji:'🏠',german:'Haus',plural:'Hauser',english:'House'},{emoji:'🌸',german:'Blume',plural:'Blumen',english:'Flower'},{emoji:'🧒',german:'Kind',plural:'Kinder',english:'Child'},{emoji:'🌳',german:'Baum',plural:'Baume',english:'Tree'},{emoji:'⚽',german:'Ball',plural:'Balle',english:'Ball'}]},
  {id:'questions',label:'Fragen beim Arzt',sublabel:'Doctor Questions',icon:'que',emoji:'💬',items:[{emoji:'👤',german:'Wie heisst du?',english:'What is your name?'},{emoji:'🎂',german:'Wie alt bist du?',english:'How old are you?'},{emoji:'📍',german:'Wo wohnst du?',english:'Where do you live?'},{emoji:'❤️',german:'Was magst du?',english:'What do you like?'},{emoji:'😊',german:'Wie geht es dir?',english:'How are you?'},{emoji:'🎯',german:'Was machst du gern?',english:'What do you like to do?'}]},
  {id:'numbers',label:'Zahlen',sublabel:'Numbers 1 to 100',icon:'num',emoji:'🔢',dynamic:true,items:[]},
  {id:'comparison',label:'Vergleichen',sublabel:'Bigger Smaller Equal',icon:'cmp',emoji:'⚖️',type:'comparison',dynamic:true,items:[]},
  {id:'math',label:'Rechnen',sublabel:'Add and Subtract',icon:'mth',emoji:'➕',type:'math',dynamic:true,items:[]},
  {id:'evenodd',label:'Gerade Ungerade',sublabel:'Even and Odd',icon:'evo',emoji:'🔁',type:'evenodd',dynamic:true,items:[]},
  {id:'colorfill',label:'Farben Malen',sublabel:'Color Fill Game',icon:'clf',emoji:'🖌️',type:'colorfill',items:[{shape:'sun',german:'Gelb',english:'Yellow',hex:'#EAB308'},{shape:'heart',german:'Rot',english:'Red',hex:'#EF4444'},{shape:'leaf',german:'Grun',english:'Green',hex:'#22C55E'},{shape:'balloon',german:'Blau',english:'Blue',hex:'#3B82F6'},{shape:'flower',german:'Rosa',english:'Pink',hex:'#EC4899'},{shape:'diamond',german:'Lila',english:'Purple',hex:'#A855F7'},{shape:'circle',german:'Orange',english:'Orange',hex:'#F97316'},{shape:'fish',german:'Turkis',english:'Turquoise',hex:'#06B6D4'},{shape:'house',german:'Braun',english:'Brown',hex:'#854D0E'},{shape:'star',german:'Gold',english:'Gold',hex:'#D97706'}]},
  {id:'guide',label:'Eltern Tipps',sublabel:'Parent Guide',icon:'gui',emoji:'📋',type:'guide',noQuiz:true,items:[
    {emoji:'💬',german:'Fragen beim Arzt',english:'Doctor questions',phrases:[{de:'Wie heisst du?',en:'What is your name?'},{de:'Wie alt bist du?',en:'How old are you?'},{de:'Wo wohnst du?',en:'Where do you live?'},{de:'Was magst du?',en:'What do you like?'},{de:'Hast du ein Haustier?',en:'Do you have a pet?'}]},
    {emoji:'🏥',german:'Was wird getestet?',english:'What is tested?',content:['Vision and hearing check','Language and vocabulary in German','Memory and concentration','Fine motor - drawing a person','Gross motor - balance and hopping','Numbers up to 10','Social and emotional readiness']},
    {emoji:'📋',german:'2-Tage Checkliste',english:'Quick checklist',content:['Names 8 colors in German?','Counts to 10?','Knows full name and age?','Can hop on one leg?','Draws a person with 6 body parts?','Vaccination booklet ready?']},
  ]},
];

var GROUPS=[
  {title:'Language and Vocabulary',ids:['colors','shapes','body','objects','animals','food','family','time','positions','jobs','dinos']},
  {title:'Grammar and Speech',ids:['plural','questions']},
  {title:'Numbers and Math',ids:['numbers','comparison','math','evenodd']},
  {title:'Fun Activities',ids:['colorfill']},
  {title:'For Parents',ids:['guide']}
];

var GRADS={
  col:'linear-gradient(135deg,#f5576c,#f093fb)',sha:'linear-gradient(135deg,#4facfe,#00f2fe)',
  bod:'linear-gradient(135deg,#43e97b,#38f9d7)',obj:'linear-gradient(135deg,#fa8231,#f7b731)',
  ani:'linear-gradient(135deg,#a18cd1,#fbc2eb)',foo:'linear-gradient(135deg,#f093fb,#f5576c)',
  fam:'linear-gradient(135deg,#ffecd2,#fcb69f)',tim:'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
  pos:'linear-gradient(135deg,#d4fc79,#96e6a1)',job:'linear-gradient(135deg,#667eea,#764ba2)',
  din:'linear-gradient(135deg,#11998e,#38ef7d)',plr:'linear-gradient(135deg,#f7971e,#ffd200)',
  que:'linear-gradient(135deg,#ee9ca7,#ffdde1)',num:'linear-gradient(135deg,#4facfe,#00f2fe)',
  cmp:'linear-gradient(135deg,#43e97b,#38f9d7)',mth:'linear-gradient(135deg,#f5576c,#f093fb)',
  evo:'linear-gradient(135deg,#a18cd1,#fbc2eb)',clf:'linear-gradient(135deg,#f5576c,#f093fb)',
  gui:'linear-gradient(135deg,#667eea,#764ba2)'
};

var TUTORIAL=[
  {emoji:'🇩🇪',title:'Welcome to SchulFit!',text:'Help your child prepare for the Einschulungsuntersuchung - the official school entry exam in Germany.'},
  {emoji:'📚',title:'Choose a Topic',text:'Pick from categories covering Colors, Body Parts, Animals, Numbers and more!'},
  {emoji:'🎮',title:'Three Practice Modes',text:'Cards - Study by flipping\nQuiz - Tap the right answer\nSpeak - Say it out loud in German'},
  {emoji:'🔊',title:'Auto Audio',text:'German words play automatically! Tap the speaker to replay anytime.'},
  {emoji:'🦉',title:'Meet Owly!',text:'Your friendly owl mascot reacts to every answer!'},
  {emoji:'📊',title:'Track Progress',text:'All progress is saved automatically on your device.'},
];

var MODES={loading:'loading',setup:'setup',welcome:'welcome',menu:'menu',stats:'stats',settings:'settings',about:'about',flash:'flash',quiz:'quiz',voice:'voice'};
var CELEB=[{de:'Yay!',en:'Amazing!'},{de:'Super!',en:'Super!'},{de:'Toll!',en:'Great!'},{de:'Bravo!',en:'Bravo!'},{de:'Prima!',en:'Excellent!'},{de:'Klasse!',en:'Awesome!'}];
var BG='linear-gradient(135deg,#667eea 0%,#764ba2 100%)';
var CSS='@keyframes confettiFall{0%{transform:translateY(-30px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(800deg);opacity:0}} @keyframes celebPop{0%{transform:scale(0) rotate(-15deg);opacity:0}45%{transform:scale(1.35) rotate(5deg);opacity:1}70%{transform:scale(1) rotate(-2deg);opacity:1}100%{transform:scale(0.6);opacity:0}} .celeb-pop{animation:celebPop 1.4s cubic-bezier(.17,.67,.35,1.2) forwards;text-align:center;} @keyframes owlFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}} @keyframes owlTalk{0%,100%{transform:scale(1)}50%{transform:scale(1.15) rotate(-6deg)}} @keyframes owlHappy{0%{transform:scale(1)}40%{transform:scale(1.4) rotate(15deg)}70%{transform:scale(1.1)}100%{transform:scale(1)}} @keyframes owlSad{0%,100%{transform:translateY(0)}50%{transform:translateY(4px) rotate(-8deg)}} .owl-idle{animation:owlFloat 2s ease-in-out infinite} .owl-talk{animation:owlTalk 0.35s ease-in-out infinite} .owl-happy{animation:owlHappy 0.75s ease-out} .owl-sad{animation:owlSad 0.55s ease-in-out 3}';

function Owl(props){var state=props.state,size=props.size||44;var e=state==='talk'?'🗣️':state==='happy'?'🥳':state==='sad'?'😔':'🦉';return <div style={{fontSize:size,lineHeight:1,display:'inline-block'}} className={'owl-'+(state||'idle')}>{e}</div>;}
var CC=['#667eea','#f5576c','#22C55E','#EAB308','#F97316','#A855F7','#EC4899','#06B6D4','#fff'];
function Confetti(){
  var pieces=Array.from({length:80},function(_,i){return{id:i,color:CC[i%CC.length],left:Math.random()*100,delay:Math.random()*1.8,dur:2.2+Math.random()*2,size:7+Math.random()*11,round:Math.random()>.5};});
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,pointerEvents:'none',zIndex:1000,overflow:'hidden'}}>{pieces.map(function(x){return <div key={x.id} style={{position:'absolute',top:-20,left:x.left+'%',width:x.size,height:x.size,background:x.color,borderRadius:x.round?'50%':'3px',animation:'confettiFall '+x.dur+'s '+x.delay+'s ease-in forwards'}}/>;})}</div>;
}

var CARD={background:'white',borderRadius:24,padding:'22px 18px',textAlign:'center',boxShadow:'0 8px 30px rgba(0,0,0,.15)',display:'flex',flexDirection:'column',alignItems:'center'};
var SPK={marginTop:12,background:'#667eea',border:'none',color:'white',borderRadius:'50%',width:44,height:44,fontSize:18,cursor:'pointer'};
var MSPK={background:'#667eea',border:'none',color:'white',borderRadius:'50%',width:28,height:28,fontSize:13,cursor:'pointer',padding:0};
function B(c1,c2){return{background:c2?'linear-gradient(135deg,'+c1+','+c2+')':c1,border:'none',color:'white',borderRadius:10,padding:'10px 16px',cursor:'pointer',fontWeight:700,fontSize:14};}
function bdg(c){return{background:c==='blue'?'#667eea':'#11998e',color:'white',borderRadius:6,padding:'2px 8px',fontSize:10,fontWeight:700,flexShrink:0};}

function CmpCard(props){
  var item=props.item,onSpeak=props.onSpeak;
  var qText=item.qType==='smaller'?'Welche Zahl ist kleiner?':item.qType==='truefalse'?'Stimmt das?':item.qType==='equal'?'Sind die Zahlen gleich?':'Welche Zahl ist groesser?';
  var showStmt=item.qType==='truefalse'||item.qType==='equal';
  return <React.Fragment>
    <div style={{fontSize:13,fontWeight:700,color:'#555',marginBottom:8}}>{qText}</div>
    {showStmt&&<div style={{fontSize:22,fontWeight:900,color:'#333',marginBottom:6}}>{item.numA} <span style={{color:'#667eea'}}>{item.qType==='equal'?'gleich':'groesser als'}</span> {item.numB}?</div>}
    <div style={{display:'flex',gap:16,alignItems:'center',justifyContent:'center',marginBottom:6}}>
      <div style={{textAlign:'center'}}><DotGrid count={item.numA} color='#667eea'/><div style={{fontSize:40,fontWeight:900,color:'#667eea',marginTop:6}}>{item.numA}</div></div>
      <div style={{fontSize:22,color:'#ccc',fontWeight:900}}>vs</div>
      <div style={{textAlign:'center'}}><DotGrid count={item.numB} color='#f5576c'/><div style={{fontSize:40,fontWeight:900,color:'#f5576c',marginTop:6}}>{item.numB}</div></div>
    </div>
    <button onClick={onSpeak} style={SPK}>🔊</button>
  </React.Fragment>;
}

function CmpAnswers(props){
  var item=props.item,correct=props.correct,chosen=props.chosen,onPick=props.onPick;
  if(item.qType==='truefalse'||item.qType==='equal'){
    return <div style={{display:'flex',gap:12,marginBottom:12}}>{[{l:'Ja, richtig!',v:'ja'},{l:'Nein, falsch!',v:'nein'}].map(function(x){var isC=x.v===correct,isS=x.v===chosen;return <button key={x.v} onClick={function(){onPick(x.v);}} style={{flex:1,background:chosen?(isC?'#d4edda':isS?'#f8d7da':'white'):'white',border:'3px solid '+(chosen?(isC?'#28a745':isS?'#dc3545':'#ddd'):'#ddd'),borderRadius:16,padding:'16px 8px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:15,fontWeight:800,color:'#333'}}>{x.l}</div></button>;})} </div>;
  }
  return <div style={{display:'flex',gap:12,marginBottom:12}}>{[{v:String(item.numA),col:'#667eea'},{v:String(item.numB),col:'#f5576c'}].map(function(x){var isC=x.v===correct,isS=x.v===chosen;return <button key={x.v} onClick={function(){onPick(x.v);}} style={{flex:1,background:chosen?(isC?'#d4edda':isS?'#f8d7da':'white'):'white',border:'4px solid '+(chosen?(isC?'#28a745':isS?'#dc3545':x.col):x.col),borderRadius:16,padding:'16px 8px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:42,fontWeight:900,color:chosen?(isC?'#28a745':isS?'#dc3545':x.col):x.col}}>{x.v}</div><div style={{fontSize:11,color:'#888',marginTop:2}}>{x.v===String(item.numA)?'Linke Zahl':'Rechte Zahl'}</div></button>;})} </div>;
}

export default function App(){
  var [mode,setMode]=useState(MODES.loading);
  var [profile,setProfile]=useState({kidName:''});
  var [viewMode,setViewMode]=useState('grid');
  var [voiceGender,setVoiceGender]=useState('female');
  var [catProgress,setCatProgress]=useState({});
  var [dailyStats,setDailyStats]=useState([]);
  var [cat,setCat]=useState(null);
  var [items,setItems]=useState([]);
  var [stableOpts,setStableOpts]=useState([]);
  var [cardIdx,setCardIdx]=useState(0);
  var [flipped,setFlipped]=useState(false);
  var [idx,setIdx]=useState(0);
  var [chosen,setChosen]=useState(null);
  var [score,setScore]=useState(0);
  var [done,setDone]=useState(false);
  var [voiceRes,setVoiceRes]=useState(null);
  var [heard,setHeard]=useState('');
  var [listening,setListening]=useState(false);
  var [micOk,setMicOk]=useState(true);
  var [celebrate,setCelebrate]=useState(false);
  var [celebIdx,setCelebIdx]=useState(0);
  var [owlState,setOwlState]=useState('idle');
  var [tutStep,setTutStep]=useState(-1);
  var [prevMode,setPrevMode]=useState(MODES.menu);
  var recRef=useRef(null);
  var celebTimer=useRef(null);
  var sessionStart=useRef(null);

  var isPl=cat&&cat.type==='plural';
  var isCmp=cat&&cat.type==='comparison';
  var isMth=cat&&cat.type==='math';
  var isCF=cat&&cat.type==='colorfill';
  var isGd=cat&&cat.type==='guide';
  var isEO=cat&&cat.type==='evenodd';

  useEffect(function(){if(items[idx]&&cat){setStableOpts(buildOpts(items[idx],cat,items));}}, [idx,cat]);
  useEffect(function(){_st.setOwl=setOwlState;return function(){_st.setOwl=null;};},[]);
  useEffect(function(){_st.gender=voiceGender;},[voiceGender]);
  useEffect(function(){var l=function(){window.speechSynthesis.getVoices();};window.speechSynthesis.onvoiceschanged=l;l();},[]);
  useEffect(function(){
    if((mode===MODES.quiz||mode===MODES.voice)&&items[idx]&&cat){
      var t=setTimeout(function(){speak(qSpeech(items[idx],cat));},500);
      return function(){clearTimeout(t);};
    }
  },[idx,mode]);
  useEffect(function(){
    (async function(){
      try{
        var p=await store.get('profile');
        var prefs=await store.get('prefs');
        var prog=await store.get('allProgress');
        var daily=await store.get('dailyStats');
        if(p)setProfile(p);
        if(prefs&&prefs.view)setViewMode(prefs.view);
        if(prefs&&prefs.voice){setVoiceGender(prefs.voice);_st.gender=prefs.voice;}
        if(prog)setCatProgress(prog);
        if(daily)setDailyStats(daily);
        if(p&&p.kidName){setMode(MODES.welcome);if(!prefs||!prefs.tutorialDone)setTutStep(0);}
        else setMode(MODES.setup);
      }catch(e){setMode(MODES.setup);}
    })();
  },[]);

  var completeTut=async function(){setTutStep(-1);var p=await store.get('prefs')||{};p.tutorialDone=true;await store.set('prefs',p);};
  var changeVoice=async function(g){setVoiceGender(g);_st.gender=g;var p=await store.get('prefs')||{};p.voice=g;await store.set('prefs',p);};
  var toggleView=async function(){var v=viewMode==='list'?'grid':'list';setViewMode(v);var p=await store.get('prefs')||{};p.view=v;await store.set('prefs',p);};
  var saveProfile=async function(p){setProfile(p);await store.set('profile',p);};
  var openSettings=function(from){setPrevMode(from);setMode(MODES.settings);};
  var trigCelebrate=function(){clearTimeout(celebTimer.current);setCelebIdx(Math.floor(Math.random()*CELEB.length));setCelebrate(true);celebTimer.current=setTimeout(function(){setCelebrate(false);},1400);};
  var go=function(m,c){sessionStart.current=Date.now();var its=getItems(c);setCat(c);setItems(its);setIdx(0);setChosen(null);setScore(0);setDone(false);setVoiceRes(null);setHeard('');setMicOk(true);setCardIdx(0);setFlipped(false);setCelebrate(false);setOwlState('idle');setMode(m);};
  var advance=function(){
    var wasOk=chosen!==null?(chosen===correctVal(items[idx],cat)):(voiceRes==='correct');
    playSound(wasOk?'correct':'wrong');
    setCelebrate(false);setOwlState('idle');
    if(idx<items.length-1){setIdx(function(i){return i+1;});setChosen(null);setVoiceRes(null);setHeard('');}
    else setDone(true);
  };
  var saveProgress=async function(catId,sc,tot,cpSnap,dsSnap){
    var today=todayStr();
    var np=Object.assign({},cpSnap);
    var ex=np[catId]||{sessions:0,bestScore:0,bestTotal:1,totalCorrect:0,totalQuestions:0};
    np[catId]={sessions:ex.sessions+1,bestScore:Math.max(ex.bestScore,sc),bestTotal:tot,totalCorrect:ex.totalCorrect+sc,totalQuestions:ex.totalQuestions+tot,lastPlayed:today};
    setCatProgress(np);await store.set('allProgress',np);
    var el=Math.round((Date.now()-(sessionStart.current||Date.now()))/1000);
    var nd=dsSnap.slice();
    var di=nd.findIndex(function(d){return d.date===today;});
    if(di>=0){nd[di]=Object.assign({},nd[di],{questions:nd[di].questions+tot,correct:nd[di].correct+sc,sessions:nd[di].sessions+1,timeSeconds:(nd[di].timeSeconds||0)+el});}
    else nd.push({date:today,questions:tot,correct:sc,sessions:1,timeSeconds:el});
    var s=nd.sort(function(a,b){return a.date>b.date?-1:1;}).slice(0,30);
    setDailyStats(s);await store.set('dailyStats',s);
  };
  var pickAnswer=function(val){if(chosen)return;setChosen(val);var ok=val===correctVal(items[idx],cat);playSound(ok?'correct':'wrong');if(ok){setScore(function(s){return s+1;});trigCelebrate();setOwlState('happy');setTimeout(function(){setOwlState('idle');},1000);}else{setOwlState('sad');setTimeout(function(){setOwlState('idle');},1500);}};
  var pickVoice=function(val){if(voiceRes)return;var ok=val===correctVal(items[idx],cat);setVoiceRes(ok?'correct':'wrong');setHeard(val);playSound(ok?'correct':'wrong');if(ok){setScore(function(s){return s+1;});trigCelebrate();setOwlState('happy');setTimeout(function(){setOwlState('idle');},1000);}else{setOwlState('sad');setTimeout(function(){setOwlState('idle');},1500);}};
  var toggleMic=function(){
    if(listening){if(recRef.current)recRef.current.stop();setListening(false);return;}
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){setMicOk(false);return;}
    var r=new SR();r.lang='de-DE';r.interimResults=false;r.maxAlternatives=5;
    r.onstart=function(){setListening(true);};r.onend=function(){setListening(false);};
    r.onerror=function(e){setListening(false);if(e.error==='not-allowed')setMicOk(false);};
    r.onresult=function(e){var alts=Array.from(e.results[0]).map(function(a){return a.transcript;});var target=normalize(correctVal(items[idx],cat));var ok=alts.some(function(a){return normalize(a)===target||normalize(a).includes(target);});setHeard(alts[0]);setVoiceRes(ok?'correct':'wrong');playSound(ok?'correct':'wrong');if(ok){setScore(function(s){return s+1;});trigCelebrate();setOwlState('happy');setTimeout(function(){setOwlState('idle');},1000);}else{setOwlState('sad');setTimeout(function(){setOwlState('idle');},1500);}};
    recRef.current=r;try{r.start();}catch(e){setMicOk(false);}
  };

  function Overlay(){return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none',zIndex:999}}><div className="celeb-pop"><div style={{fontSize:90,lineHeight:1}}>🎉</div><div style={{fontSize:44,fontWeight:900,color:'white',textShadow:'0 3px 14px rgba(0,0,0,.5)'}}>{CELEB[celebIdx].de}</div><div style={{fontSize:20,color:'rgba(255,255,255,.8)'}}>{CELEB[celebIdx].en}</div></div></div>;}

  if(mode===MODES.loading)return <div style={{minHeight:'100vh',background:BG,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}><div style={{fontSize:64}}>🇩🇪</div><div style={{color:'white',fontSize:16,opacity:.7}}>Loading…</div></div>;
  if(mode===MODES.setup)return <SetupScreen onSave={async function(p){await saveProfile(p);setMode(MODES.welcome);setTutStep(0);}}/>;
  if(mode===MODES.about)return <AboutScreen onBack={function(){setMode(MODES.welcome);}}/>;
  if(mode===MODES.stats)return <StatsScreen profile={profile} catProgress={catProgress} dailyStats={dailyStats} onBack={function(){setMode(MODES.menu);}} onSettings={function(){openSettings(MODES.stats);}}/>;
  if(mode===MODES.settings)return <SettingsScreen profile={profile} voiceGender={voiceGender} onVoice={changeVoice} onSaveProfile={saveProfile} onBack={function(){setMode(prevMode);}} onResetProgress={async function(){setCatProgress({});setDailyStats([]);await store.set('allProgress',{});await store.set('dailyStats',[]);}} onResetAll={async function(){await store.set('profile',null);await store.set('prefs',null);await store.set('allProgress',{});await store.set('dailyStats',[]);setMode(MODES.setup);}}/>;

  if(mode===MODES.welcome)return(
    <div style={{minHeight:'100vh',background:BG,fontFamily:'system-ui,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <style>{CSS}</style>
      {tutStep>=0&&<TutOverlay step={tutStep} onNext={function(){if(tutStep<TUTORIAL.length-1)setTutStep(function(t){return t+1;});else completeTut();}} onSkip={completeTut}/>}
      <div style={{maxWidth:440,width:'100%',textAlign:'center',color:'white'}}>
        <Owl state={owlState} size={80}/>
        <h1 style={{fontSize:28,fontWeight:900,margin:'12px 0 4px'}}>SchulFit</h1>
        {profile.kidName&&<div style={{fontSize:17,opacity:.9,marginBottom:4}}>Welcome back, {profile.kidName}!</div>}
        <div style={{fontSize:12,opacity:.6,marginBottom:24}}>Einschulungsuntersuchung Practice</div>
        <button onClick={function(){setMode(MODES.menu);}} style={{background:'white',color:'#667eea',border:'none',borderRadius:16,padding:'16px 40px',fontSize:18,fontWeight:800,cursor:'pointer',width:'100%',boxShadow:'0 4px 20px rgba(0,0,0,.2)',marginBottom:10}}>Start Practicing</button>
        <button onClick={function(){setMode(MODES.stats);}} style={Object.assign({},B('rgba(255,255,255,.2)'),{width:'100%',padding:12,fontSize:15,marginBottom:10})}>Progress Dashboard</button>
        <div style={{display:'flex',gap:10,marginBottom:20}}>
          <button onClick={function(){openSettings(MODES.welcome);}} style={Object.assign({},B('rgba(255,255,255,.15)'),{flex:1,padding:12,fontSize:15})}>Settings</button>
          <button onClick={function(){setMode(MODES.about);}} style={Object.assign({},B('rgba(255,255,255,.15)'),{flex:1,padding:12,fontSize:15})}>About</button>
        </div>
        <div style={{background:'rgba(255,255,255,.1)',borderRadius:16,padding:'14px 18px',textAlign:'left',marginBottom:14}}>
          <div style={{fontSize:15,fontWeight:800,marginBottom:2}}>Rahat Hameed</div>
          <div style={{fontSize:12,opacity:.75,marginBottom:10}}>Pakistani software engineer in Frankfurt. Building free tools for immigrant families in Germany.</div>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <button onClick={function(){openLink('https://www.instagram.com/rahatrajpoot');}} style={Object.assign({},B('rgba(255,255,255,.2)'),{flex:1,fontSize:12})}>Instagram</button>
            <button onClick={function(){openLink('https://youtube.com/@rahatrajpoot');}} style={Object.assign({},B('rgba(255,0,0,.5)'),{flex:1,fontSize:12})}>YouTube</button>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={function(){openLink('https://forms.gle/drTrdvgwEJsc9kbn7');}} style={Object.assign({},B('rgba(34,197,94,.7)'),{flex:1,fontSize:12,fontWeight:800})}>Join Community</button>
            <button onClick={function(){openLink('https://www.paypal.com/paypalme/rahatrajpoot');}} style={Object.assign({},B('rgba(0,48,135,.5)'),{flex:1,fontSize:12})}>Support</button>
          </div>
        </div>
        <button onClick={function(){setTutStep(0);}} style={{background:'none',border:'none',color:'rgba(255,255,255,.5)',fontSize:12,cursor:'pointer'}}>Show Tutorial Again</button>
      </div>
    </div>
  );

  if(mode===MODES.menu)return(
    <div style={{minHeight:'100vh',background:BG,fontFamily:'system-ui,sans-serif',padding:'16px 16px 32px'}}>
      <style>{CSS}</style>
      <div style={{maxWidth:500,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',marginBottom:16,gap:8}}>
          <button onClick={function(){setMode(MODES.welcome);}} style={Object.assign({},B('rgba(255,255,255,.2)'),{padding:'8px 12px',fontSize:13})}>Home</button>
          <div style={{flex:1,textAlign:'center',color:'white',fontWeight:700,fontSize:16}}>{profile.kidName?profile.kidName+"'s Topics":'Topics'}</div>
          <Owl state={owlState} size={32}/>
          <button onClick={function(){setMode(MODES.stats);}} style={Object.assign({},B('rgba(255,255,255,.2)'),{padding:'8px 10px',fontSize:16})}>📊</button>
          <button onClick={function(){openSettings(MODES.menu);}} style={Object.assign({},B('rgba(255,255,255,.2)'),{padding:'8px 10px',fontSize:16})}>⚙️</button>
          <button onClick={toggleView} style={Object.assign({},B('rgba(255,255,255,.2)'),{padding:'8px 10px',fontSize:16})}>{viewMode==='list'?'⊞':'☰'}</button>
        </div>
        {GROUPS.map(function(g){
          var cats=CATS.filter(function(c){return g.ids.includes(c.id);});
          return <div key={g.title} style={{marginBottom:20}}>
            <div style={{color:'rgba(255,255,255,.65)',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:10,paddingLeft:4}}>{g.title}</div>
            {viewMode==='grid'?(
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                {cats.map(function(c){
                  var p=catProgress[c.id],pct=p?Math.round(p.bestScore/p.bestTotal*100):0,star=p&&pct>=80;
                  var grad=GRADS[c.icon]||'linear-gradient(135deg,#667eea,#764ba2)';
                  return <div key={c.id} style={{borderRadius:24,overflow:'hidden',boxShadow:'0 8px 28px rgba(0,0,0,.25)'}}>
                    <div style={{background:grad,padding:'28px 12px 18px',textAlign:'center',position:'relative',minHeight:170,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                      {star&&<div style={{position:'absolute',top:10,right:12,fontSize:18}}>⭐</div>}
                      <div style={{fontSize:70,lineHeight:1,marginBottom:10}}>{c.emoji||'📚'}</div>
                      <div style={{fontSize:14,fontWeight:900,color:'white',textShadow:'0 2px 8px rgba(0,0,0,.4)',marginBottom:3}}>{c.label}</div>
                      <div style={{fontSize:11,color:'rgba(255,255,255,.8)',fontWeight:500}}>{c.sublabel}</div>
                      {p&&<div style={{width:'65%',margin:'10px auto 0',height:4,background:'rgba(255,255,255,.3)',borderRadius:2}}><div style={{width:pct+'%',height:'100%',background:'white',borderRadius:2}}/></div>}
                    </div>
                    <div style={{background:'white',padding:'10px',display:'flex',gap:6}}>
                      <button onClick={function(){go(MODES.flash,c);}} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:10,padding:'9px 0',cursor:'pointer',fontSize:20}}>🃏</button>
                      {!c.noQuiz&&<React.Fragment>
                        <button onClick={function(){go(MODES.quiz,c);}} style={{flex:1,background:'#fef2f2',border:'none',borderRadius:10,padding:'9px 0',cursor:'pointer',fontSize:20}}>🎯</button>
                        <button onClick={function(){go(MODES.voice,c);}} style={{flex:1,background:'#f0fdf4',border:'none',borderRadius:10,padding:'9px 0',cursor:'pointer',fontSize:20}}>🎤</button>
                      </React.Fragment>}
                    </div>
                  </div>;
                })}
              </div>
            ):(
              cats.map(function(c){
                var p=catProgress[c.id],pct=p?Math.round(p.bestScore/p.bestTotal*100):0,star=p&&pct>=80;
                return <div key={c.id} style={{background:'white',borderRadius:14,padding:'12px 14px',marginBottom:8,boxShadow:'0 2px 12px rgba(0,0,0,.1)'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}><div style={{fontSize:28,marginRight:4}}>{c.emoji||'📚'}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:700}}>{c.label}</div><div style={{fontSize:11,color:'#888'}}>{c.sublabel}</div>{p&&<div style={{marginTop:5}}><div style={{width:'100%',height:4,background:'#f0f0f0',borderRadius:2,marginBottom:2}}><div style={{width:pct+'%',height:'100%',background:star?'#22C55E':'#667eea',borderRadius:2,transition:'width .3s'}}/></div><div style={{fontSize:10,color:star?'#22C55E':'#888'}}>{star?'⭐ ':''}{p.bestScore}/{p.bestTotal} - {p.sessions} sessions</div></div>}</div><div style={{display:'flex',gap:5,flexShrink:0}}><button onClick={function(){go(MODES.flash,c);}} style={Object.assign({},B('#667eea','#764ba2'),{padding:'7px 9px',fontSize:14})}>🃏</button>{!c.noQuiz&&<React.Fragment><button onClick={function(){go(MODES.quiz,c);}} style={Object.assign({},B('#f5576c','#f093fb'),{padding:'7px 9px',fontSize:14})}>🎯</button><button onClick={function(){go(MODES.voice,c);}} style={Object.assign({},B('#11998e','#38ef7d'),{padding:'7px 9px',fontSize:14})}>🎤</button></React.Fragment>}</div></div></div>;
              })
            )}
          </div>;
        })}
      </div>
    </div>
  );

  if(mode===MODES.quiz){
    if(done)return <Results score={score} total={items.length} catId={cat.id} catProgress={catProgress} dailyStats={dailyStats} onSave={saveProgress} onRetry={function(){go(MODES.quiz,cat);}} onMenu={function(){setMode(MODES.menu);}}/>;
    var item=items[idx];if(!item)return null;
    var correct=correctVal(item,cat);
    var chosenHex=isCF&&chosen?PAL.find(function(c){return c.german===chosen;}):null;
    return(
      <div style={{minHeight:'100vh',background:BG,padding:20,fontFamily:'system-ui,sans-serif'}}>
        <style>{CSS}</style>{celebrate&&<Overlay/>}
        <div style={{maxWidth:400,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <button onClick={function(){setMode(MODES.menu);}} style={{background:'rgba(255,255,255,.2)',border:'none',color:'white',borderRadius:10,padding:'8px 12px',cursor:'pointer',fontSize:13,flexShrink:0}}>Back</button>
            <div style={{flex:1}}><div style={{background:'rgba(255,255,255,.25)',height:10,borderRadius:5}}><div style={{width:((idx+1)/items.length*100)+'%',height:'100%',background:'#22C55E',borderRadius:5,transition:'width .5s ease'}}/></div><div style={{color:'rgba(255,255,255,.6)',fontSize:10,textAlign:'center',marginTop:2}}>{idx+1} / {items.length} - score {score}</div></div>
            <Owl state={owlState} size={40}/>
          </div>
          <div style={Object.assign({},CARD,{marginBottom:14,cursor:'default'})}>
            {isCF&&<React.Fragment><ShapeSVG name={item.shape} fill={chosen&&chosenHex?chosenHex.hex:'white'} size={148}/><div style={{marginTop:10,fontSize:17,fontWeight:700,color:'#333'}}>Color it {item.german}!</div><div style={{fontSize:13,color:'#888'}}>({item.english})</div></React.Fragment>}
            {isCmp&&<CmpCard item={item} onSpeak={function(){speak(qSpeech(item,cat));}}/>}
            {isMth&&<React.Fragment><div style={{fontSize:42,fontWeight:900,color:'#333'}}>{item.numA} {item.op} {item.numB} = ?</div><div style={{fontSize:13,color:'#888',marginTop:4}}>{toG(item.numA)} {item.op==='+'?'plus':'minus'} {toG(item.numB)}</div><button onClick={function(){speak(qSpeech(item,cat));}} style={SPK}>🔊</button></React.Fragment>}
            {isPl&&<React.Fragment>
              <div style={{display:'flex',gap:4,justifyContent:'center',flexWrap:'wrap',marginBottom:8}}>{Array.from({length:item.count||1},function(_,i){return <span key={i} style={{fontSize:item.count>1?44:72}}>{item.emoji}</span>;})}</div>
              <div style={{fontSize:15,color:'#333',marginTop:4,fontWeight:700,textAlign:'center'}}>{item.count===1?'Ist '+item.german+' Einzahl oder Mehrzahl?':'Sind '+item.plural+' Einzahl oder Mehrzahl?'}</div>
              <button onClick={function(){speak(qSpeech(item,cat));}} style={SPK}>🔊</button>
            </React.Fragment>}
            {isEO&&<React.Fragment><div style={{fontSize:90,fontWeight:900,color:'#667eea',fontFamily:'monospace',lineHeight:1}}>{item.display}</div><div style={{fontSize:14,color:'#555',marginTop:10,fontWeight:600}}>Gerade oder Ungerade?</div><button onClick={function(){speak(qSpeech(item,cat));}} style={SPK}>🔊</button></React.Fragment>}
            {!isCF&&!isCmp&&!isMth&&!isPl&&!isEO&&<React.Fragment><div style={{fontSize:item.display?56:72,fontWeight:item.display?900:'normal',color:item.display?'#667eea':'inherit',fontFamily:item.display?'monospace':'inherit',marginBottom:4}}>{item.display||item.emoji}</div><div style={{fontSize:14,color:'#555',marginTop:4}}>What is this in German?</div>{item.english&&<div style={{fontSize:13,fontStyle:'italic',color:'#888',marginTop:2}}>{item.english}</div>}<button onClick={function(){speak(correctVal(item,cat));}} style={SPK}>🔊</button></React.Fragment>}
          </div>
          {isCF&&<React.Fragment><div style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center',background:'rgba(255,255,255,.12)',borderRadius:18,padding:16,marginBottom:12}}>{stableOpts.map(function(c){var isC=c.german===correct,isS=c.german===chosen;return <button key={c.german} onClick={function(){pickAnswer(c.german);}} title={c.german} style={{width:52,height:52,borderRadius:'50%',background:c.hex,cursor:'pointer',border:'4px solid '+(chosen?(isC?'#22C55E':isS?'#EF4444':'rgba(255,255,255,.4)'):'rgba(255,255,255,.4)'),transform:chosen&&isS?'scale(1.2)':'scale(1)',transition:'all 0.15s',boxShadow:'0 3px 10px rgba(0,0,0,.25)'}}/>;})}</div>{chosen&&<div style={{textAlign:'center',color:'white',fontSize:15,fontWeight:600,marginBottom:12}}>{chosen===correct?'Correct! '+item.german+' = '+item.english:'It is '+item.german+' ('+item.english+')'}</div>}</React.Fragment>}
          {isCmp&&<CmpAnswers item={item} correct={correct} chosen={chosen} onPick={pickAnswer}/>}
          {isMth&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>{stableOpts.map(function(val){var isC=val===correct,isS=val===chosen;return <button key={val} onClick={function(){pickAnswer(val);}} style={{background:chosen?(isC?'#d4edda':isS?'#f8d7da':'white'):'white',border:'2px solid '+(chosen?(isC?'#28a745':isS?'#dc3545':'#eee'):'#eee'),borderRadius:14,padding:'16px 8px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:32,fontWeight:900,color:'#333'}}>{val}</div></button>;})}</div>}
          {isPl&&<div style={{display:'flex',gap:12,marginBottom:12}}>{[{label:'Singular',val:item.german},{label:'Plural',val:item.plural}].map(function(x){var isC=x.val===correct,isS=x.val===chosen;return <button key={x.val} onClick={function(){pickAnswer(x.val);}} style={{flex:1,background:chosen?(isC?'#d4edda':isS?'#f8d7da':'white'):'white',border:'3px solid '+(chosen?(isC?'#28a745':isS?'#dc3545':'#ddd'):'#ddd'),borderRadius:16,padding:'14px 8px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:11,color:'#888',marginBottom:4}}>{x.label}</div><div style={{fontSize:20,fontWeight:800,color:'#333'}}>{x.val}</div></button>;})}</div>}
          {isEO&&<div style={{display:'flex',gap:12,marginBottom:12}}>{stableOpts.map(function(val){var isC=val===correct,isS=val===chosen;return <button key={val} onClick={function(){pickAnswer(val);}} style={{flex:1,background:chosen?(isC?'#d4edda':isS?'#f8d7da':'white'):'white',border:'3px solid '+(chosen?(isC?'#28a745':isS?'#dc3545':'#ddd'):'#ddd'),borderRadius:16,padding:'16px 8px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:22,fontWeight:800,color:'#333'}}>{val}</div><div style={{fontSize:12,color:'#888',marginTop:2}}>{val==='Gerade'?'Even':'Odd'}</div></button>;})}</div>}
          {!isCF&&!isCmp&&!isMth&&!isPl&&!isEO&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>{stableOpts.map(function(val){var isC=val===correct,isS=val===chosen;var o=items.find(function(i){return i.german===val;});return <button key={val} onClick={function(){pickAnswer(val);}} style={{background:chosen?(isC?'#d4edda':isS?'#f8d7da':'white'):'white',border:'2px solid '+(chosen?(isC?'#28a745':isS?'#dc3545':'#eee'):'#eee'),borderRadius:14,padding:'12px 8px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:15,fontWeight:700}}>{val}</div>{o&&o.english&&<div style={{fontSize:11,color:'#aaa'}}>{o.english}</div>}</button>;})}</div>}
          {chosen!==null&&<button onClick={advance} style={Object.assign({},B('#22C55E'),{width:'100%',padding:14,fontSize:15})}>{idx<items.length-1?'Next Question':'See Results'}</button>}
        </div>
      </div>
    );
  }

  if(mode===MODES.flash){
    var fitem=items[cardIdx];if(!fitem)return null;
    return(
      <div style={{minHeight:'100vh',background:BG,padding:20,fontFamily:'system-ui,sans-serif'}}>
        <style>{CSS}</style>
        <div style={{maxWidth:400,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <button onClick={function(){setMode(MODES.menu);}} style={{background:'rgba(255,255,255,.2)',border:'none',color:'white',borderRadius:10,padding:'8px 12px',cursor:'pointer',fontSize:13}}>Back</button>
            <div style={{flex:1,textAlign:'center'}}><div style={{color:'white',fontWeight:700,fontSize:14}}>{cat.label}</div><div style={{color:'rgba(255,255,255,.6)',fontSize:11}}>{cardIdx+1} / {items.length}</div></div>
            <Owl state={owlState} size={36}/>
          </div>
          <div onClick={function(){setFlipped(function(f){return !f;});}} style={CARD}>
            {isGd&&<React.Fragment>{fitem.emoji&&<div style={{fontSize:52,marginBottom:8}}>{fitem.emoji}</div>}<div style={{fontSize:18,fontWeight:800,color:'#333'}}>{fitem.german}</div><div style={{fontSize:13,color:'#888',marginBottom:8}}>{fitem.english}</div>{flipped?(fitem.phrases?<div style={{textAlign:'left',width:'100%',maxHeight:300,overflowY:'auto'}}>{fitem.phrases.map(function(ph,i){return <div key={i} onClick={function(e){e.stopPropagation();speak(ph.de);}} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 4px',borderBottom:i<fitem.phrases.length-1?'1px solid #f0f0f0':'none',cursor:'pointer'}}><div><div style={{fontSize:14,fontWeight:700,color:'#333'}}>{ph.de}</div><div style={{fontSize:12,color:'#888',marginTop:2}}>{ph.en}</div></div><button onClick={function(e){e.stopPropagation();speak(ph.de);}} style={Object.assign({},MSPK,{marginLeft:10})}>🔊</button></div>;})}</div>:<div style={{textAlign:'left',width:'100%'}}>{fitem.content.map(function(l,i){return <div key={i} style={{fontSize:13,padding:'5px 0',borderBottom:i<fitem.content.length-1?'1px solid #f0f0f0':'none',color:'#444'}}>{l}</div>;})}</div>):<div style={{fontSize:12,color:'#bbb',marginTop:8}}>{fitem.phrases?'Tap to see phrases':'Tap to see tips'}</div>}</React.Fragment>}
            {isCF&&<React.Fragment><ShapeSVG name={fitem.shape} fill={flipped?fitem.hex:'white'} size={150}/>{flipped?<React.Fragment><div style={{fontSize:22,fontWeight:800,color:fitem.hex,marginTop:10}}>{fitem.german}</div><div style={{fontSize:14,color:'#888'}}>{fitem.english}</div></React.Fragment>:<div style={{fontSize:13,color:'#888',marginTop:12}}>Tap to fill with color</div>}</React.Fragment>}
            {isCmp&&<React.Fragment><div style={{fontSize:13,fontWeight:700,color:'#555',marginBottom:8}}>{qSpeech(fitem,cat)}</div><div style={{display:'flex',gap:16,alignItems:'center',justifyContent:'center'}}><div style={{textAlign:'center'}}><DotGrid count={fitem.numA} color='#667eea'/><div style={{fontSize:36,fontWeight:900,color:'#667eea',marginTop:4}}>{fitem.numA}</div></div><div style={{fontSize:18,color:'#ccc',fontWeight:900}}>vs</div><div style={{textAlign:'center'}}><DotGrid count={fitem.numB} color='#f5576c'/><div style={{fontSize:36,fontWeight:900,color:'#f5576c',marginTop:4}}>{fitem.numB}</div></div></div>{flipped?<div style={{marginTop:10,fontSize:18,fontWeight:800,color:'#22C55E'}}>{fitem.cmpAnswer==='ja'?'Ja':'Nein'}</div>:<div style={{fontSize:12,color:'#bbb',marginTop:10}}>Tap to reveal</div>}</React.Fragment>}
            {isMth&&<React.Fragment><div style={{fontSize:36,fontWeight:900,color:'#333',marginBottom:8}}>{fitem.numA} {fitem.op} {fitem.numB} = {flipped?<span style={{color:'#22C55E'}}>{fitem.result}</span>:<span style={{color:'#ccc'}}>?</span>}</div><div style={{fontSize:13,color:'#888'}}>{flipped?'Answer: '+fitem.result:'Tap to see answer'}</div></React.Fragment>}
            {isPl&&<React.Fragment><div style={{display:'flex',gap:4,justifyContent:'center',flexWrap:'wrap',marginBottom:8}}>{Array.from({length:flipped?3:1},function(_,i){return <span key={i} style={{fontSize:flipped?44:72}}>{fitem.emoji}</span>;})}</div><div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}><span style={bdg('blue')}>Singular</span><span style={{fontSize:18,fontWeight:800,color:'#333'}}>{fitem.german}</span><button onClick={function(e){e.stopPropagation();speak(fitem.german);}} style={MSPK}>🔊</button></div>{flipped?<div style={{display:'flex',alignItems:'center',gap:6,marginTop:8}}><span style={bdg('green')}>Plural</span><span style={{fontSize:18,fontWeight:800,color:'#11998e'}}>{fitem.plural}</span><button onClick={function(e){e.stopPropagation();speak(fitem.plural);}} style={MSPK}>🔊</button></div>:<div style={{fontSize:12,color:'#bbb',marginTop:10}}>Tap to see Plural</div>}</React.Fragment>}
            {isEO&&<React.Fragment><div style={{fontSize:80,fontWeight:900,color:'#667eea',fontFamily:'monospace',lineHeight:1}}>{fitem.display}</div>{flipped?<div style={{fontSize:24,fontWeight:900,color:'#22C55E',marginTop:12}}>{fitem.german} ({fitem.english})</div>:<div style={{fontSize:13,color:'#888',marginTop:12}}>Tap to reveal!</div>}</React.Fragment>}
            {!isGd&&!isCF&&!isCmp&&!isMth&&!isPl&&!isEO&&<React.Fragment><div style={{fontSize:fitem.display?56:72,fontWeight:fitem.display?900:'normal',color:fitem.display?'#667eea':'inherit',fontFamily:fitem.display?'monospace':'inherit',marginBottom:4}}>{fitem.display||fitem.emoji}</div><div style={{fontSize:20,fontWeight:800,color:'#333'}}>{fitem.display?toG(+fitem.display):fitem.german}</div>{flipped?<div style={{fontSize:15,color:'#888',marginTop:4}}>{fitem.english}</div>:<div style={{fontSize:12,color:'#bbb',marginTop:8}}>Tap to see translation</div>}{!fitem.display&&<button onClick={function(e){e.stopPropagation();speak(fitem.german);}} style={SPK}>🔊</button>}</React.Fragment>}
          </div>
          <div style={{display:'flex',gap:10,marginTop:14}}>
            <button onClick={function(){if(cardIdx>0){setCardIdx(cardIdx-1);setFlipped(false);}}} disabled={cardIdx===0} style={Object.assign({},B('rgba(255,255,255,.25)'),{flex:1,opacity:cardIdx===0?.4:1})}>Prev</button>
            <button onClick={function(){if(cardIdx<items.length-1){setCardIdx(cardIdx+1);setFlipped(false);}else setMode(MODES.menu);}} style={Object.assign({},B('rgba(255,255,255,.25)'),{flex:1})}>{cardIdx===items.length-1?'Done':'Next'}</button>
          </div>
        </div>
      </div>
    );
  }

  if(mode===MODES.voice){
    if(done)return <Results score={score} total={items.length} catId={cat.id} catProgress={catProgress} dailyStats={dailyStats} onSave={saveProgress} onRetry={function(){go(MODES.voice,cat);}} onMenu={function(){setMode(MODES.menu);}}/>;
    var vitem=items[idx];if(!vitem)return null;
    var vcorrect=correctVal(vitem,cat);
    var vok=voiceRes==='correct',vbad=voiceRes==='wrong';
    var onSpk=function(){speak(isCmp||isMth||isEO||isPl?qSpeech(vitem,cat):correctVal(vitem,cat));};
    return(
      <div style={{minHeight:'100vh',background:BG,padding:20,fontFamily:'system-ui,sans-serif'}}>
        <style>{CSS}</style>{celebrate&&<Overlay/>}
        <div style={{maxWidth:400,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <button onClick={function(){setMode(MODES.menu);}} style={{background:'rgba(255,255,255,.2)',border:'none',color:'white',borderRadius:10,padding:'8px 12px',cursor:'pointer',fontSize:13,flexShrink:0}}>Back</button>
            <div style={{flex:1}}><div style={{background:'rgba(255,255,255,.25)',height:10,borderRadius:5}}><div style={{width:((idx+1)/items.length*100)+'%',height:'100%',background:'#22C55E',borderRadius:5,transition:'width .5s ease'}}/></div><div style={{color:'rgba(255,255,255,.6)',fontSize:10,textAlign:'center',marginTop:2}}>{idx+1} / {items.length} - score {score}</div></div>
            <Owl state={owlState} size={40}/>
          </div>
          <div style={Object.assign({},CARD,{marginBottom:16,cursor:'default'})}>
            {isCF&&<React.Fragment><ShapeSVG name={vitem.shape} fill={vok?vitem.hex:'white'} size={140}/><div style={{marginTop:10,fontSize:16,fontWeight:700,color:'#333'}}>Say: {vitem.german}</div><div style={{fontSize:13,color:'#888'}}>({vitem.english})</div></React.Fragment>}
            {isCmp&&<CmpCard item={vitem} onSpeak={onSpk}/>}
            {isMth&&<React.Fragment><div style={{fontSize:36,fontWeight:900,color:'#333'}}>{vitem.numA} {vitem.op} {vitem.numB} = ?</div><div style={{fontSize:13,color:'#888',marginTop:4}}>{toG(vitem.numA)} {vitem.op==='+'?'plus':'minus'} {toG(vitem.numB)}</div></React.Fragment>}
            {isPl&&<React.Fragment><div style={{display:'flex',gap:4,justifyContent:'center',flexWrap:'wrap',marginBottom:6}}>{Array.from({length:vitem.count||1},function(_,i){return <span key={i} style={{fontSize:vitem.count>1?44:72}}>{vitem.emoji}</span>;})}</div><div style={{fontSize:15,color:'#333',fontWeight:700,textAlign:'center'}}>{vitem.count===1?'Ist '+vitem.german+' Einzahl oder Mehrzahl?':'Sind '+vitem.plural+' Einzahl oder Mehrzahl?'}</div></React.Fragment>}
            {isEO&&<React.Fragment><div style={{fontSize:80,fontWeight:900,color:'#667eea',fontFamily:'monospace',lineHeight:1}}>{vitem.display}</div><div style={{fontSize:14,color:'#777',marginTop:8,fontWeight:600}}>Gerade oder Ungerade?</div></React.Fragment>}
            {!isCF&&!isCmp&&!isMth&&!isPl&&!isEO&&<React.Fragment><div style={{fontSize:vitem.display?56:72,fontWeight:vitem.display?900:'normal',color:vitem.display?'#667eea':'inherit',fontFamily:vitem.display?'monospace':'inherit'}}>{vitem.display||vitem.emoji}</div><div style={{fontSize:14,color:'#777',marginTop:6}}>Say in German:</div><div style={{fontSize:15,fontWeight:700,color:'#444'}}>{vitem.english}</div></React.Fragment>}
            <button onClick={onSpk} style={SPK}>🔊</button>
          </div>
          {!voiceRes&&<div>
            {micOk&&<div style={{textAlign:'center',marginBottom:14}}><button onClick={toggleMic} style={{display:'block',margin:'0 auto 8px',width:96,height:96,borderRadius:'50%',border:'none',fontSize:40,cursor:'pointer',background:listening?'linear-gradient(135deg,#f5576c,#f093fb)':'white',boxShadow:listening?'0 0 0 14px rgba(255,255,255,.25)':'0 4px 20px rgba(0,0,0,.2)',transition:'all .2s'}}>{listening?'🎙️':'🎤'}</button><div style={{color:'white',fontSize:14,fontWeight:600,marginBottom:4}}>{listening?'Listening…':'Tap to speak'}</div></div>}
            {!micOk&&<div style={{background:'rgba(255,200,0,.2)',borderRadius:12,padding:'10px 14px',marginBottom:12,color:'white',fontSize:13,textAlign:'center'}}>Mic not available - tap answer below!</div>}
            <div style={{background:'rgba(255,255,255,.12)',borderRadius:14,padding:12}}>
              <div style={{color:'rgba(255,255,255,.7)',fontSize:12,marginBottom:10,textAlign:'center'}}>{micOk?'Or tap:':'Tap the correct answer:'}</div>
              {isCF&&<div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center'}}>{stableOpts.map(function(c){return <button key={c.german} onClick={function(){pickVoice(c.german);}} title={c.german} style={{width:48,height:48,borderRadius:'50%',background:c.hex,border:'3px solid rgba(255,255,255,.5)',cursor:'pointer'}}/>;})}</div>}
              {isCmp&&<CmpAnswers item={vitem} correct={vcorrect} chosen={null} onPick={pickVoice}/>}
              {!isCF&&!isCmp&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{stableOpts.map(function(val,vi){return <button key={vi} onClick={function(){pickVoice(val);}} style={{background:'white',border:'2px solid #eee',borderRadius:12,padding:'12px 6px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:isPl||isEO?18:isMth?26:14,fontWeight:700}}>{val}</div>{isEO&&<div style={{fontSize:10,color:'#aaa'}}>{val==='Gerade'?'Even':'Odd'}</div>}{isPl&&<div style={{fontSize:10,color:'#aaa'}}>{val===vitem.german?'Singular':'Plural'}</div>}</button>;})}</div>}
            </div>
          </div>}
          {voiceRes&&<div style={{background:'white',borderRadius:20,padding:24,textAlign:'center'}}><div style={{fontSize:52}}>{vok?'🎉':'😅'}</div><div style={{fontSize:20,fontWeight:800,color:vok?'#28a745':'#dc3545'}}>{vok?'Sehr gut!':'Not quite!'}</div><div style={{fontSize:13,color:'#aaa',marginBottom:8}}>{vok?'(Very good!)':'(Try again)'}</div>{heard&&<div style={{fontSize:13,color:'#999',marginBottom:8}}>I heard: {heard}</div>}{vbad&&<div style={{fontSize:14,color:'#555',marginBottom:10}}>Correct: {vcorrect}</div>}<div style={{display:'flex',gap:10}}>{vbad&&<button onClick={function(){setVoiceRes(null);setHeard('');}} style={Object.assign({},B('#667eea','#764ba2'),{flex:1})}>Try Again</button>}<button onClick={advance} style={Object.assign({},B(vok?'#22C55E':'#f5576c',vok?'#38ef7d':undefined),{flex:1})}>{idx<items.length-1?'Next':'Results'}</button></div></div>}
        </div>
      </div>
    );
  }
  return null;
}

function AboutScreen(props){
  var onBack=props.onBack;
  return <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',fontFamily:'system-ui,sans-serif',padding:'16px 16px 40px'}}>
    <div style={{maxWidth:460,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',marginBottom:20}}><button onClick={onBack} style={{background:'rgba(255,255,255,.2)',border:'none',color:'white',borderRadius:10,padding:'8px 14px',cursor:'pointer',fontSize:14}}>Back</button><div style={{flex:1,textAlign:'center',color:'white',fontWeight:800,fontSize:18}}>About SchulFit</div></div>
      <div style={{background:'white',borderRadius:24,padding:28,marginBottom:14,textAlign:'center',boxShadow:'0 4px 20px rgba(0,0,0,.15)'}}>
        <div style={{fontSize:64,marginBottom:8}}>👨‍💻</div>
        <div style={{fontSize:20,fontWeight:900,color:'#333',marginBottom:4}}>Rahat Hameed</div>
        <div style={{fontSize:13,color:'#667eea',fontWeight:700,marginBottom:12}}>Pakistani Software Engineer - Frankfurt, Germany</div>
        <div style={{fontSize:13,color:'#555',lineHeight:1.7,marginBottom:20}}>I built SchulFit to help immigrant families in Germany prepare their children for the Einschulungsuntersuchung. As a Pakistani living in Frankfurt, I understand the challenges. This app is my free contribution to every family.</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          <button onClick={function(){openLink('https://www.instagram.com/rahatrajpoot');}} style={{background:'linear-gradient(135deg,#f5576c,#f093fb)',border:'none',borderRadius:14,padding:'14px 10px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:28,marginBottom:4}}>📸</div><div style={{fontSize:12,fontWeight:800,color:'white'}}>Instagram</div><div style={{fontSize:10,color:'rgba(255,255,255,.8)'}}>@rahatrajpoot</div></button>
          <button onClick={function(){openLink('https://youtube.com/@rahatrajpoot');}} style={{background:'linear-gradient(135deg,#ff0000,#ff6b35)',border:'none',borderRadius:14,padding:'14px 10px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:28,marginBottom:4}}>▶️</div><div style={{fontSize:12,fontWeight:800,color:'white'}}>YouTube</div><div style={{fontSize:10,color:'rgba(255,255,255,.8)'}}>@rahatrajpoot</div></button>
        </div>
        <button onClick={function(){openLink('https://forms.gle/drTrdvgwEJsc9kbn7');}} style={{width:'100%',background:'linear-gradient(135deg,#22C55E,#16a34a)',border:'none',borderRadius:14,padding:'14px',cursor:'pointer',marginBottom:10}}><div style={{fontSize:14,fontWeight:800,color:'white'}}>Join the Community</div><div style={{fontSize:11,color:'rgba(255,255,255,.8)'}}>Get notified about new features</div></button>
        <button onClick={function(){openLink('https://www.paypal.com/paypalme/rahatrajpoot');}} style={{width:'100%',background:'linear-gradient(135deg,#667eea,#764ba2)',border:'none',borderRadius:14,padding:'14px',cursor:'pointer'}}><div style={{fontSize:14,fontWeight:800,color:'white'}}>Support SchulFit</div><div style={{fontSize:11,color:'rgba(255,255,255,.8)'}}>Help keep it free for all families</div></button>
      </div>
    </div>
  </div>;
}

function TutOverlay(props){
  var step=props.step,onNext=props.onNext,onSkip=props.onSkip;
  var T=TUTORIAL[step];if(!T)return null;
  return <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.75)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:'system-ui,sans-serif'}}><div style={{background:'white',borderRadius:24,padding:32,maxWidth:380,width:'100%',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,.3)'}}><div style={{fontSize:72,marginBottom:12,lineHeight:1}}>{T.emoji}</div><h2 style={{margin:'0 0 12px',color:'#333',fontSize:20,fontWeight:800}}>{T.title}</h2><p style={{color:'#666',fontSize:14,lineHeight:1.7,marginBottom:24,whiteSpace:'pre-line'}}>{T.text}</p><div style={{display:'flex',justifyContent:'center',gap:6,marginBottom:20}}>{TUTORIAL.map(function(_,i){return <div key={i} style={{width:i===step?20:8,height:8,borderRadius:4,background:i===step?'#667eea':'#e5e7eb',transition:'all .2s'}}/>;})}</div><div style={{display:'flex',gap:10}}><button onClick={onSkip} style={{flex:1,background:'#f3f4f6',border:'none',borderRadius:12,padding:'12px',fontSize:14,cursor:'pointer',color:'#666',fontWeight:600}}>Skip</button><button onClick={onNext} style={{flex:2,background:'linear-gradient(135deg,#667eea,#764ba2)',border:'none',borderRadius:12,padding:'12px',fontSize:15,fontWeight:800,color:'white',cursor:'pointer'}}>{step===TUTORIAL.length-1?'Start Learning!':'Next'}</button></div></div></div>;
}

function SetupScreen(props){
  var onSave=props.onSave;
  var [kidName,setKidName]=useState('');
  return <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',fontFamily:'system-ui,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
    <div style={{maxWidth:420,width:'100%',background:'white',borderRadius:24,padding:32,boxShadow:'0 8px 40px rgba(0,0,0,.2)'}}>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{fontSize:64,marginBottom:8}}>🇩🇪</div>
        <h1 style={{fontSize:24,fontWeight:900,margin:'0 0 6px',color:'#333'}}>SchulFit</h1>
        <p style={{fontSize:13,color:'#888',margin:0}}>German school prep for immigrant families</p>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:600,color:'#555',marginBottom:6}}>What is your child called?</div>
        <input value={kidName} onChange={function(e){setKidName(e.target.value);}} placeholder="e.g. Ali, Fatima, Sara..." style={{width:'100%',padding:'12px 14px',border:'2px solid #e5e7eb',borderRadius:12,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
      </div>
      <button onClick={function(){onSave({kidName:kidName||'Champ'});}} style={{width:'100%',background:'linear-gradient(135deg,#667eea,#764ba2)',border:'none',borderRadius:12,padding:'14px',fontSize:16,fontWeight:800,color:'white',cursor:'pointer',marginBottom:10}}>Start Learning!</button>
      <button onClick={function(){onSave({kidName:'Champ'});}} style={{width:'100%',background:'none',border:'none',color:'#aaa',fontSize:13,cursor:'pointer'}}>Skip for now</button>
    </div>
  </div>;
}

function SettingsScreen(props){
  var profile=props.profile,voiceGender=props.voiceGender,onVoice=props.onVoice,onSaveProfile=props.onSaveProfile,onBack=props.onBack,onResetProgress=props.onResetProgress,onResetAll=props.onResetAll;
  var [kidName,setKidName]=useState(profile.kidName||'');
  var [saved,setSaved]=useState(false);
  var [confirmReset,setConfirmReset]=useState(false);
  var handleSave=async function(){await onSaveProfile({kidName:kidName||'Champ'});setSaved(true);setTimeout(function(){setSaved(false);},2000);};
  var testVoice=function(g){onVoice(g);setTimeout(function(){_st.gender=g;speak('Hallo! Ich bin dein Assistent.');},100);};
  return <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',fontFamily:'system-ui,sans-serif',padding:'16px 16px 40px'}}>
    <div style={{maxWidth:460,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',marginBottom:20}}>
        <button onClick={onBack} style={{background:'rgba(255,255,255,.2)',border:'none',color:'white',borderRadius:10,padding:'8px 14px',cursor:'pointer',fontSize:14}}>Back</button>
        <div style={{flex:1,textAlign:'center',color:'white',fontWeight:800,fontSize:18}}>Settings</div>
      </div>
      <div style={{background:'white',borderRadius:20,padding:20,marginBottom:14,boxShadow:'0 2px 16px rgba(0,0,0,.12)'}}>
        <div style={{fontSize:14,fontWeight:800,color:'#333',marginBottom:12}}>Child Nickname</div>
        <input value={kidName} onChange={function(e){setKidName(e.target.value);}} placeholder="e.g. Ali, Fatima" style={{width:'100%',padding:'10px 12px',border:'2px solid #e5e7eb',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',marginBottom:12}}/>
        <button onClick={handleSave} style={{width:'100%',background:'linear-gradient(135deg,#667eea,#764ba2)',border:'none',borderRadius:12,padding:'12px',fontSize:15,fontWeight:800,color:'white',cursor:'pointer'}}>{saved?'Saved!':'Save Name'}</button>
      </div>
      <div style={{background:'white',borderRadius:20,padding:20,marginBottom:14,boxShadow:'0 2px 16px rgba(0,0,0,.12)'}}>
        <div style={{fontSize:14,fontWeight:800,color:'#333',marginBottom:6}}>Voice Gender</div>
        <div style={{fontSize:12,color:'#888',marginBottom:14}}>Tap to switch and hear a sample.</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {[{g:'female',label:'Female',desc:'Higher pitch'},{g:'male',label:'Male',desc:'Lower pitch'}].map(function(x){return <button key={x.g} onClick={function(){testVoice(x.g);}} style={{background:voiceGender===x.g?'linear-gradient(135deg,#667eea,#764ba2)':'#f8f9fa',border:'2px solid '+(voiceGender===x.g?'#667eea':'#e5e7eb'),borderRadius:14,padding:'14px 10px',cursor:'pointer',textAlign:'center'}}><div style={{fontSize:28,marginBottom:4}}>{voiceGender===x.g?'🔊':'🔈'}</div><div style={{fontSize:14,fontWeight:800,color:voiceGender===x.g?'white':'#333',marginBottom:2}}>{x.label}</div><div style={{fontSize:11,color:voiceGender===x.g?'rgba(255,255,255,.8)':'#888'}}>{x.desc}</div>{voiceGender===x.g&&<div style={{fontSize:10,color:'rgba(255,255,255,.9)',marginTop:4,fontWeight:700}}>Active</div>}</button>;})}
        </div>
      </div>
      <div style={{background:'white',borderRadius:20,padding:20,boxShadow:'0 2px 16px rgba(0,0,0,.12)'}}>
        <div style={{fontSize:14,fontWeight:800,color:'#333',marginBottom:14}}>Data and Reset</div>
        <button onClick={onResetProgress} style={{width:'100%',background:'#fff3cd',border:'2px solid #ffc107',borderRadius:12,padding:'12px',fontSize:14,fontWeight:700,color:'#856404',cursor:'pointer',marginBottom:10}}>Reset Progress Only</button>
        {!confirmReset
          ?<button onClick={function(){setConfirmReset(true);}} style={{width:'100%',background:'#f8d7da',border:'2px solid #dc3545',borderRadius:12,padding:'12px',fontSize:14,fontWeight:700,color:'#721c24',cursor:'pointer'}}>Reset Everything</button>
          :<div style={{background:'#f8d7da',borderRadius:12,padding:14,border:'2px solid #dc3545'}}><div style={{fontSize:13,color:'#721c24',fontWeight:700,marginBottom:10,textAlign:'center'}}>Delete all data?</div><div style={{display:'flex',gap:8}}><button onClick={function(){setConfirmReset(false);}} style={{flex:1,background:'#6c757d',border:'none',borderRadius:10,padding:'10px',color:'white',fontWeight:700,cursor:'pointer'}}>Cancel</button><button onClick={onResetAll} style={{flex:1,background:'#dc3545',border:'none',borderRadius:10,padding:'10px',color:'white',fontWeight:700,cursor:'pointer'}}>Yes Delete</button></div></div>}
      </div>
    </div>
  </div>;
}

function StatsScreen(props){
  var profile=props.profile,catProgress=props.catProgress,dailyStats=props.dailyStats,onBack=props.onBack,onSettings=props.onSettings;
  var last7=getLast7(dailyStats),allP=Object.values(catProgress);
  var totalSessions=allP.reduce(function(s,p){return s+p.sessions;},0),totalQ=allP.reduce(function(s,p){return s+p.totalQuestions;},0),totalC=allP.reduce(function(s,p){return s+p.totalCorrect;},0);
  var accuracy=totalQ>0?Math.round(totalC/totalQ*100):0,totalTime=dailyStats.reduce(function(s,d){return s+(d.timeSeconds||0);},0);
  var fmtTime=function(t){if(t<60)return t+'s';if(t<3600)return Math.floor(t/60)+'m';return Math.floor(t/3600)+'h '+Math.floor((t%3600)/60)+'m';};
  var playedCats=CATS.filter(function(c){return catProgress[c.id];});
  return <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',fontFamily:'system-ui,sans-serif',padding:'16px 16px 32px'}}>
    <div style={{maxWidth:500,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',marginBottom:18,gap:8}}>
        <button onClick={onBack} style={{background:'rgba(255,255,255,.2)',border:'none',color:'white',borderRadius:10,padding:'8px 14px',cursor:'pointer',fontSize:14}}>Back</button>
        <div style={{flex:1,textAlign:'center',color:'white',fontWeight:700,fontSize:17}}>Progress Dashboard</div>
        <button onClick={onSettings} style={{background:'rgba(255,255,255,.2)',border:'none',color:'white',borderRadius:10,padding:'8px 12px',cursor:'pointer',fontSize:16}}>⚙️</button>
      </div>
      {profile.kidName&&<div style={{background:'rgba(255,255,255,.12)',borderRadius:16,padding:'12px 16px',marginBottom:14,color:'white'}}><div style={{fontSize:16,fontWeight:800}}>{profile.kidName}</div></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:8,marginBottom:14}}>{[['Sessions',totalSessions,'🎯'],['Questions',totalQ,'❓'],['Accuracy',accuracy+'%','✅'],['Time',fmtTime(totalTime),'⏱']].map(function(x){return <div key={x[0]} style={{background:'white',borderRadius:14,padding:'12px 6px',textAlign:'center',boxShadow:'0 2px 10px rgba(0,0,0,.1)'}}><div style={{fontSize:20}}>{x[2]}</div><div style={{fontSize:18,fontWeight:900,color:'#667eea',marginTop:2}}>{x[1]}</div><div style={{fontSize:10,color:'#888',marginTop:1}}>{x[0]}</div></div>;})}</div>
      <div style={{background:'white',borderRadius:18,padding:'18px 14px',marginBottom:14,boxShadow:'0 2px 12px rgba(0,0,0,.1)'}}>
        <div style={{fontSize:14,fontWeight:700,color:'#333',marginBottom:12}}>Activity - Last 7 Days</div>
        {last7.every(function(d){return d.Questions===0;})
          ?<div style={{textAlign:'center',color:'#aaa',fontSize:13,padding:'20px 0'}}>No activity yet - start practicing!</div>
          :<ResponsiveContainer width="100%" height={160}><BarChart data={last7} margin={{top:5,right:5,bottom:0,left:-20}}><XAxis dataKey="label" tick={{fontSize:11}}/><YAxis tick={{fontSize:10}}/><Tooltip contentStyle={{fontSize:12}}/><Legend iconSize={10} wrapperStyle={{fontSize:11}}/><Bar dataKey="Questions" fill="#667eea" radius={[3,3,0,0]}/><Bar dataKey="Correct" fill="#22C55E" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer>}
      </div>
      {playedCats.length>0&&<div style={{background:'white',borderRadius:18,padding:'18px 14px',boxShadow:'0 2px 12px rgba(0,0,0,.1)'}}>
        <div style={{fontSize:14,fontWeight:700,color:'#333',marginBottom:12}}>Category Progress</div>
        {playedCats.sort(function(a,b){return(catProgress[b.id].bestScore/catProgress[b.id].bestTotal)-(catProgress[a.id].bestScore/catProgress[a.id].bestTotal);}).map(function(c){var p=catProgress[c.id],pct=Math.round(p.bestScore/p.bestTotal*100),star=pct>=80;return <div key={c.id} style={{marginBottom:12}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><div style={{fontSize:13,fontWeight:600,color:'#333'}}>{c.emoji} {c.label}</div><div style={{fontSize:12,color:star?'#22C55E':'#667eea',fontWeight:600}}>{star?'⭐ ':''}{pct}%</div></div><div style={{width:'100%',height:8,background:'#f0f0f0',borderRadius:4}}><div style={{width:pct+'%',height:'100%',background:star?'#22C55E':'#667eea',borderRadius:4,transition:'width .3s'}}/></div><div style={{fontSize:10,color:'#aaa',marginTop:2}}>Best: {p.bestScore}/{p.bestTotal} - Sessions: {p.sessions}</div></div>;})}
      </div>}
    </div>
  </div>;
}

function Results(props){
  var score=props.score,total=props.total,catId=props.catId,catProgress=props.catProgress,dailyStats=props.dailyStats,onSave=props.onSave,onRetry=props.onRetry,onMenu=props.onMenu;
  var wrong=total-score,pct=score/total,stars=pct>=0.8?3:pct>=0.5?2:1;
  var msg=pct>=0.8?{de:'Wunderbar!',en:'Wonderful!'}:pct>=0.5?{de:'Gut gemacht!',en:'Well done!'}:{de:'Weiter ueben!',en:'Keep practicing!'};
  var saved=useRef(false);
  useEffect(function(){playFanfare();if(!saved.current&&onSave&&catId){saved.current=true;onSave(catId,score,total,catProgress,dailyStats);}},[]);
  return <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui,sans-serif',padding:20}}>
    <style>{'@keyframes confettiFall{0%{transform:translateY(-30px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(800deg);opacity:0}}'}</style>
    <Confetti/>
    <div style={{background:'white',borderRadius:24,padding:32,textAlign:'center',maxWidth:360,width:'100%',boxShadow:'0 8px 40px rgba(0,0,0,.2)'}}>
      <div style={{fontSize:48,marginBottom:4}}>{'⭐'.repeat(stars)+'☆'.repeat(3-stars)}</div>
      <div style={{fontSize:72,fontWeight:900,color:'#667eea',lineHeight:1,marginBottom:4}}>{score}<span style={{fontSize:32,color:'#aaa'}}>/{total}</span></div>
      <h2 style={{margin:'8px 0 4px',color:'#333'}}>{msg.de}</h2>
      <div style={{fontSize:14,color:'#888',marginBottom:20}}>{msg.en}</div>
      <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:20}}>
        <div style={{background:'#d4edda',borderRadius:16,padding:'14px 20px',textAlign:'center',flex:1}}><div style={{fontSize:32,fontWeight:900,color:'#28a745'}}>{score}</div><div style={{fontSize:13,color:'#28a745',fontWeight:600}}>Correct</div></div>
        <div style={{background:'#f8d7da',borderRadius:16,padding:'14px 20px',textAlign:'center',flex:1}}><div style={{fontSize:32,fontWeight:900,color:'#dc3545'}}>{wrong}</div><div style={{fontSize:13,color:'#dc3545',fontWeight:600}}>Wrong</div></div>
      </div>
      <div style={{display:'flex',gap:10}}>
        <button onClick={onRetry} style={{flex:1,padding:'12px 8px',background:'linear-gradient(135deg,#667eea,#764ba2)',border:'none',color:'white',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:14}}>Try Again</button>
        <button onClick={onMenu} style={{flex:1,padding:'12px 8px',background:'linear-gradient(135deg,#f5576c,#f093fb)',border:'none',color:'white',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:14}}>Menu</button>
      </div>
    </div>
  </div>;
}
