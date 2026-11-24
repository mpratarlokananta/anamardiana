/* Tema: ditetapkan sebelum halaman dirender agar tidak berkedip */
(function(){
  var root=document.documentElement,KEY='theme',mq=window.matchMedia('(prefers-color-scheme: dark)');
  function saved(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
  function apply(t){root.setAttribute('data-theme',t);}
  apply(saved()||(mq.matches?'dark':'light'));
  mq.addEventListener&&mq.addEventListener('change',function(e){if(!saved())apply(e.matches?'dark':'light');});
  window.__toggleTheme=function(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    apply(next);try{localStorage.setItem(KEY,next);}catch(e){}
    return next;
  };
  root.classList.add('js');
})();

document.addEventListener('DOMContentLoaded',function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Tombol tema */
  var tbtn=document.getElementById('themeBtn');
  function label(){
    var dark=document.documentElement.getAttribute('data-theme')==='dark';
    tbtn.setAttribute('aria-label',dark?'Beralih ke mode terang':'Beralih ke mode gelap');
  }
  if(tbtn){label();tbtn.addEventListener('click',function(){window.__toggleTheme();label();});}

  /* Menu mobile */
  var btn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
  if(btn&&nav){
    btn.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',open);
    });
    nav.addEventListener('click',function(e){
      if(e.target.tagName==='A'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');}
    });
  }

  if(!('IntersectionObserver' in window))return;

  /* Animasi masuk: aktif setiap elemen terlihat saat scroll, dan diulang saat kembali */
  var els=document.querySelectorAll('.cutout,#about h2,#about .about>*,#pendidikan h2,.edu,#project h2,.card,#kontak .contact');
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){e.target.classList.toggle('in',e.isIntersecting);});
  },{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(el){
    var i=Array.prototype.indexOf.call(el.parentNode.children,el);
    el.classList.add('reveal');el.style.setProperty('--d',(i%4*110)+'ms');io.observe(el);
  });

  /* Menandai menu yang aktif sesuai section */
  var links=document.querySelectorAll('nav a[href^="#"]');
  var secs=['about','pendidikan','project','kontak'].map(function(id){return document.getElementById(id);});
  var nio=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;
      links.forEach(function(a){a.removeAttribute('aria-current');if(a.getAttribute('href')==='#'+e.target.id)a.setAttribute('aria-current','true');});
    });
  },{rootMargin:'-40% 0px -55% 0px'});
  secs.forEach(function(s){s&&nio.observe(s);});

  /* Efek parallax foto hero mengikuti scroll */
  var cut=document.querySelector('.cutout');
  if(cut&&!reduce){
    var ticking=false;
    function update(){
      var p=Math.min(Math.max(window.scrollY/window.innerHeight,0),1);
      cut.style.setProperty('--p',p.toFixed(3));ticking=false;
    }
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
    update();
  }
});
