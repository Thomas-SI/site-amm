// Menu : fond au scroll, rubrique active et petit sommet qui glisse
const nav=document.getElementById('nav');
const burger=document.getElementById('burger'),menu=document.getElementById('menu'),peak=document.getElementById('peak');
const links=[...document.querySelectorAll('.menu a')];
const sections=links.map(a=>document.querySelector(a.getAttribute('href')));
let current=null,peakVisible=false;

function movePeak(){
  if(!peak) return;
  if(current===null){peak.style.opacity=0;peakVisible=false;return}
  const a=links[current];
  const x=a.offsetLeft+a.offsetWidth/2;
  if(!peakVisible){            // première apparition : on se place sans glisser
    peak.style.transition='none';
    peak.style.transform=`translateX(${x}px)`;
    peak.offsetWidth;          // force l'application
    peak.style.transition='';
  } else {
    peak.style.transform=`translateX(${x}px)`;
  }
  peak.style.opacity=1;peakVisible=true;
}

// Frise « Mon histoire » : la barre se remplit, le point lumineux grossit sur chaque étape
const timeline=document.getElementById('timeline');
const tlFill=document.getElementById('tlFill'),tlOrb=document.getElementById('tlOrb');
const tlSteps=timeline?[...timeline.querySelectorAll('.step')]:[];
function updateTimeline(){
  if(!timeline) return;
  const line=timeline.querySelector('.tl-line').getBoundingClientRect();
  const readY=window.innerHeight*0.55;                        // « ligne de lecture » à 55 % de l'écran
  const h=Math.max(0,Math.min(line.height,readY-line.top));
  tlFill.style.height=h+'px';
  tlOrb.style.top=h+'px';
  timeline.classList.toggle('live',readY>line.top-40 && line.bottom>0);
  let lastPassed=-1,near=Infinity;
  tlSteps.forEach((s,i)=>{
    const dotY=s.getBoundingClientRect().top+9+5.5;
    if(dotY<=readY) lastPassed=i;
    near=Math.min(near,Math.abs(dotY-(line.top+h)));
  });
  tlSteps.forEach((s,i)=>{
    s.classList.toggle('passed',i<lastPassed);
    s.classList.toggle('current',i===lastPassed);
  });
  tlOrb.style.setProperty('--orb-scale',(1+1.1*Math.max(0,1-near/70)).toFixed(2));
}

function onScroll(){
  const y=window.scrollY;
  nav.classList.toggle('scrolled',y>40);
  // parallaxe de la photo d'accueil
  const media=document.getElementById('heroMedia');
  if(media && y<window.innerHeight*1.2) media.style.transform=`translateY(${y*0.25}px)`;
  let cur=null;
  sections.forEach((s,i)=>{ if(s && s.getBoundingClientRect().top<window.innerHeight*0.4) cur=i; });
  updateTimeline();
  if(cur!==current){
    current=cur;
    links.forEach((a,i)=>a.classList.toggle('active',i===cur));
    movePeak();
  }
}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',()=>{movePeak();updateTimeline()});
if(document.fonts) document.fonts.ready.then(movePeak);   // recalcule une fois les polices chargées
onScroll();

// Menu mobile
burger.onclick=()=>{burger.classList.toggle('open');menu.classList.toggle('open')};
links.forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('open');menu.classList.remove('open')}));

// Apparition au scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Filtre des randos
document.getElementById('filters').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  document.querySelectorAll('#filters button').forEach(x=>x.classList.toggle('on',x===b));
  document.querySelectorAll('#randos .rando').forEach(r=>{
    r.style.display=(b.dataset.f==='all'||r.dataset.niveau===b.dataset.f)?'':'none';
  });
});
document.getElementById('year').textContent=new Date().getFullYear();
