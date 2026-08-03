// smooth scroll for nav links
  document.querySelectorAll('.nav-links a').forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      document.querySelector(link.getAttribute('href'))
        ?.scrollIntoView({behavior:'smooth'});
    });
  });
 
  // back to top (robust: works even if a global var ever shadows scrollTo)
  document.getElementById('backToTop').addEventListener('click', ()=>{
    window.scrollTo({top:0, left:0, behavior:'smooth'});
  });
 
  // active link on scroll
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', ()=>{
    let current = '';
    sections.forEach(sec=>{
      if (scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(a=>{
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, {passive:true});
 
  // navbar: hides on scroll down, reappears on the slightest scroll up, shadow grows on scroll
  const nav = document.querySelector('.navbar');
  let lastY = scrollY, ticking = false;
  function onScroll(){
    const y = scrollY;
    nav.style.boxShadow = y > 20
      ? '0 12px 34px rgba(20,20,50,0.12)'
      : '0 8px 30px rgba(20,20,50,0.06)';
 
    if (y > lastY + 2 && y > 80) nav.classList.add('hide');   // scrolling down -> hide
    else if (y < lastY - 2 || y <= 80) nav.classList.remove('hide'); // scrolling up (any bit) -> show
 
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if(!ticking){ requestAnimationFrame(onScroll); ticking = true; }
  }, {passive:true});
 
  // ---- custom cursor: only on fine-pointer devices, dot snaps instantly, ring eases behind ----
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const hasFinePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
 
  if (hasFinePointer){
    let mx = innerWidth/2, my = innerHeight/2;
    let rx = mx, ry = my;
    let rafId = null;
 
    window.addEventListener('mousemove', e=>{
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    }, {passive:true});
 
    function loop(){
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
 
    document.querySelectorAll('a, button, .btn, .tool-card, .project-card, .cert-card').forEach(el=>{
      el.addEventListener('mouseenter', ()=>ring.classList.add('active'));
      el.addEventListener('mouseleave', ()=>ring.classList.remove('active'));
    });
  } else {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }
 
  // ---- scroll-reveal: fade+rise sections into view once, cards stagger in ----
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.querySelectorAll('.tool-card,.project-card,.cert-card,.stat-card,.skill-card,.tl-card')
          .forEach((card,i)=>{ card.style.transitionDelay = `${i*70}ms`; });
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
 
  // ---- projects carousel: arrow buttons scroll one card at a time ----
  const projGrid = document.getElementById('projectsGrid');
  const projPrev = document.getElementById('projPrev');
  const projNext = document.getElementById('projNext');
 
  if (projGrid && projPrev && projNext){
    function cardStep(){
      const card = projGrid.querySelector('.project-card');
      if (!card) return 300;
      const style = getComputedStyle(projGrid);
      const gap = parseFloat(style.columnGap || style.gap || 24);
      return card.getBoundingClientRect().width + gap;
    }
    function updateArrows(){
      const maxScroll = projGrid.scrollWidth - projGrid.clientWidth - 2;
      projPrev.disabled = projGrid.scrollLeft <= 2;
      projNext.disabled = projGrid.scrollLeft >= maxScroll;
    }
    projPrev.addEventListener('click', ()=> projGrid.scrollBy({left:-cardStep(), behavior:'smooth'}));
    projNext.addEventListener('click', ()=> projGrid.scrollBy({left:cardStep(), behavior:'smooth'}));
    projGrid.addEventListener('scroll', ()=>{
      if(!ticking) requestAnimationFrame(updateArrows);
    }, {passive:true});
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }
 
  // ---- loading screen: shows briefly, fades out once page is ready ----
  window.addEventListener('load', ()=>{
    setTimeout(()=>{
      document.getElementById('loader').classList.add('hide');
    }, 900);
  });
 
