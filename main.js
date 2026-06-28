// ===== Nav scroll state =====
const nav=document.getElementById('nav');
if(nav&&!nav.classList.contains('solid')){
  addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40));
}
// ===== Mobile menu =====
const toggle=document.querySelector('.nav-toggle');
const links=document.querySelector('.nav-links');
if(toggle&&links){
  toggle.addEventListener('click',()=>links.classList.toggle('show'));
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('show')));
}
// ===== Reveal on scroll =====
const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.14});
document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));
// Fail-safe: anything still hidden after 2.5s gets revealed, so a missed
// observer callback can never leave content (especially images) invisible.
setTimeout(()=>document.querySelectorAll('.reveal:not(.in)').forEach(el=>{
  const r=el.getBoundingClientRect();
  if(r.top<innerHeight&&r.bottom>0)el.classList.add('in');
}),2500);

// ===== Services interactive list =====
const svcData=[
 {c:'<strong>Embed AI directly inside your core ERP.</strong> We deploy SAP Joule, configure S/4HANA copilots, and build use-case-driven AI that surfaces inside the workflows your teams already use — accurate, governed, and audit-ready.'},
 {c:'<strong>See what happens next.</strong> Forecasting, demand planning, and predictive maintenance powered by your SAP data and SAP Analytics Cloud — accurate, transparent, and operationally useful.'},
 {c:'<strong>Remove the manual bottlenecks.</strong> Document AI, intelligent RPA, and workflow automation that cut cycle time and error rates across finance, supply chain, and operations.',link:{href:'case-automated-decision-systems.html',label:'Read use case'}},
 {c:'<strong>Trustworthy AI starts with clean data.</strong> We unify, model, and migrate your SAP data — Datasphere, pipelines, and governance — so every model is built on a reliable foundation.'}
];
const items=[...document.querySelectorAll('.svc-item')];
const copy=document.getElementById('svcCopy');
const svcFoot=document.getElementById('svcFoot');
const svcFootLabel=document.getElementById('svcFootLabel');
function select(it){
  items.forEach(i=>i.classList.remove('active'));it.classList.add('active');
  const i=+it.dataset.svc;
  if(copy)copy.style.opacity=0;
  setTimeout(()=>{
    if(copy){copy.innerHTML=svcData[i].c;copy.style.opacity=1;}
    const L=svcData[i].link||{href:'contact.html',label:'Discuss your use case'};
    if(svcFoot)svcFoot.setAttribute('href',L.href);
    if(svcFootLabel)svcFootLabel.textContent=L.label;
  },160);
}
items.forEach(it=>{it.addEventListener('mouseenter',()=>select(it));it.addEventListener('click',()=>select(it));});

// ===== FAQ accordion =====
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const item=q.parentElement,a=item.querySelector('.faq-a'),open=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>{i.classList.remove('open');i.querySelector('.faq-a').style.maxHeight=null});
    if(!open){item.classList.add('open');a.style.maxHeight=a.scrollHeight+40+'px';}
  });
});
document.querySelectorAll('.faq-filters button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.faq-filters button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
}));

// ===== Contact form (Formspree) =====
const form=document.getElementById('contactForm');
if(form){
  const fields=[...form.querySelectorAll('[required]')];
  const validate=(el)=>{
    const wrap=el.closest('.field');let ok=el.value.trim()!=='';
    if(el.type==='email')ok=ok&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    wrap.classList.toggle('invalid',!ok);return ok;
  };
  fields.forEach(el=>el.addEventListener('blur',()=>validate(el)));
  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    let valid=true;fields.forEach(el=>{if(!validate(el))valid=false;});
    if(!valid)return;
    const btn=form.querySelector('button[type=submit]');const orig=btn.textContent;
    btn.textContent='Sending…';btn.disabled=true;
    try{
      const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if(res.ok){
        form.style.display='none';
        document.getElementById('formSuccess').classList.add('show');
      }else{throw new Error('Submit failed');}
    }catch(err){
      btn.textContent=orig;btn.disabled=false;
      alert('Sorry — something went wrong. Please try again in a moment.');
    }
  });
}

// ===== Footer year =====
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

// ===== Interactive media: cursor tilt + sheen (any .story-media) =====
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(!window.matchMedia('(hover:hover)').matches)return; // skip touch devices
  document.querySelectorAll('.story-media').forEach(function(el){
    var sheen=el.querySelector('.sheen');
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
      var rx=(0.5-py)*6, ry=(px-0.5)*8;
      el.style.transform='perspective(900px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) scale(1.02)';
      if(sheen){sheen.style.setProperty('--mx',(px*100).toFixed(1)+'%');sheen.style.setProperty('--my',(py*100).toFixed(1)+'%');}
    });
    el.addEventListener('mouseleave',function(){el.style.transform='';});
  });
})();

// ===== Magnetic stats: numbers drift toward the cursor on hover =====
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(!window.matchMedia('(hover:hover)').matches)return;
  document.querySelectorAll('.stats .stat').forEach(function(stat){
    stat.addEventListener('mousemove',function(e){
      var r=stat.getBoundingClientRect();
      var dx=(e.clientX-(r.left+r.width/2))/r.width;   // -0.5..0.5
      var dy=(e.clientY-(r.top+r.height/2))/r.height;
      stat.style.transform='translate('+(dx*10).toFixed(1)+'px,'+(dy*8).toFixed(1)+'px)';
    });
    stat.addEventListener('mouseleave',function(){stat.style.transform='';});
  });
})();

// ===== Sticky mobile CTA (thumb-zone, phones only) =====
(function(){
  var path=(location.pathname.split('/').pop()||'index.html');
  if(path==='contact.html')return; // no point on the contact page itself
  var bar=document.createElement('div');
  bar.className='mobile-cta';
  bar.innerHTML='<a href="contact.html">Book a consultation <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a>';
  document.body.appendChild(bar);
  var nearBottom=false, scrolledEnough=false;
  function update(){bar.classList.toggle('show',scrolledEnough&&!nearBottom&&!document.body.classList.contains('cookie-active'));}
  // Re-evaluate when the cookie banner is dismissed.
  window.addEventListener('cookie-consent-resolved',update);
  addEventListener('scroll',function(){scrolledEnough=scrollY>420;update();},{passive:true});
  // Hide when the page's own CTA or footer is visible (avoid a duplicate ask)
  var sentinel=document.querySelector('.cta')||document.querySelector('footer');
  if(sentinel&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){nearBottom=es[0].isIntersecting;update();},{threshold:.05}).observe(sentinel);
  }
})();

// ===== Cookie / analytics consent banner =====
(function(){
  var KEY='aesh_cookie_consent';
  function setConsent(v){try{localStorage.setItem(KEY,v);}catch(e){}}
  function getConsent(){try{return localStorage.getItem(KEY);}catch(e){return null;}}
  // enableAnalytics() — load analytics here only after consent; left as a stub.
  function enableAnalytics(){/* place analytics init (e.g. GA) here */}
  function showBanner(){
    if(document.querySelector('.cookie-bar'))return;
    var bar=document.createElement('div');
    bar.className='cookie-bar';
    bar.setAttribute('role','dialog');
    bar.setAttribute('aria-label','Cookie consent');
    bar.innerHTML='<p>We use essential cookies to run this site and, with your consent, basic analytics cookies to understand traffic and improve your experience. See our <a href="privacy.html#cookies">Privacy Policy</a>.</p>'+
      '<div class="cookie-actions"><button type="button" class="decline">Decline</button><button type="button" class="accept">Accept all</button></div>';
    document.body.appendChild(bar);
    document.body.classList.add('cookie-active'); // suppress the sticky mobile CTA while visible
    requestAnimationFrame(()=>requestAnimationFrame(()=>bar.classList.add('show')));
    function dismiss(){document.body.classList.remove('cookie-active');bar.classList.remove('show');setTimeout(()=>bar.remove(),500);window.dispatchEvent(new Event('cookie-consent-resolved'));}
    bar.querySelector('.accept').addEventListener('click',function(){setConsent('accepted');enableAnalytics();dismiss();});
    bar.querySelector('.decline').addEventListener('click',function(){setConsent('declined');dismiss();});
  }
  // Expose for the footer "Cookie settings" link
  window.openCookieSettings=function(e){if(e)e.preventDefault();showBanner();};
  // "Cookie settings" trigger(s)
  document.querySelectorAll('[data-cookie-settings]').forEach(function(el){el.addEventListener('click',window.openCookieSettings);});
  // Initial state: apply prior consent, or prompt on first visit
  var c=getConsent();
  if(c==='accepted'){enableAnalytics();return;}
  if(c==='declined'){return;}
  showBanner();
})();
