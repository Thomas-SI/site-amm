// Menu : fond au scroll + surlignage de la section active
const nav=document.getElementById('nav');
const links=[...document.querySelectorAll('.menu a')];
const sections=links.map(a=>document.querySelector(a.getAttribute('href')));
function onScroll(){
  const y=window.scrollY;
  nav.classList.toggle('scrolled',y>40);
  // parallaxe des montagnes
  document.querySelectorAll('.layer').forEach(l=>{
    if(y<window.innerHeight*1.2) l.style.transform=`translateY(${y*l.dataset.speed}px)`;
  });
  const sun=document.getElementById('sun');
  if(y<window.innerHeight*1.2) sun.style.transform=`translateY(${y*0.3}px)`;
  let cur=null;
  sections.forEach((s,i)=>{ if(s && s.getBoundingClientRect().top<window.innerHeight*0.4) cur=i; });
  links.forEach((a,i)=>a.classList.toggle('active',i===cur));
}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// Menu mobile
const burger=document.getElementById('burger'),menu=document.getElementById('menu');
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
