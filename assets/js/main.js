const menu=document.querySelector('.menu');const nav=document.querySelector('.nav');menu?.addEventListener('click',()=>{const open=menu.classList.toggle('active');nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':''});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('active');nav.classList.remove('open');menu.setAttribute('aria-expanded','false');document.body.style.overflow=''}));;const header=document.querySelector('.header');const syncHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);syncHeader();window.addEventListener('scroll',syncHeader,{passive:true});

/* five-minute data reveal */
(()=> {
  const cards=[...document.querySelectorAll('.five-data-grid .five-stat')];
  if(!cards.length) return;

  const reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce) document.documentElement.classList.add('motion-ready');

  const format=(n,comma)=>comma?Math.round(n).toLocaleString('ja-JP'):String(Math.round(n));

  const animateNumber=(el)=>{
    if(el.dataset.counted==='true') return;
    el.dataset.counted='true';

    const unit=el.dataset.countUnit||'';
    const prefix=el.dataset.countPrefix||'';
    const comma=el.dataset.countComma==='true';
    const range=el.dataset.countRange;
    const single=el.dataset.count;
    if(!range && !single) return;

    if(reduce){
      if(range){
        const [a,b]=range.split(',').map(Number);
        el.innerHTML=prefix+format(a,comma)+'〜'+format(b,comma)+(unit?'<i>'+unit+'</i>':'');
      }else{
        el.innerHTML=prefix+format(Number(single),comma)+(unit?'<i>'+unit+'</i>':'');
      }
      return;
    }

    const duration=1050;
    const start=performance.now();
    const ease=t=>1-Math.pow(1-t,3);
    const draw=(now)=>{
      const p=Math.min(1,(now-start)/duration);
      const e=ease(p);
      if(range){
        const [a,b]=range.split(',').map(Number);
        const va=a*e;
        const vb=b*e;
        el.innerHTML=prefix+format(va,comma)+'〜'+format(vb,comma)+(unit?'<i>'+unit+'</i>':'');
      }else{
        const value=Number(single)*e;
        el.innerHTML=prefix+format(value,comma)+(unit?'<i>'+unit+'</i>':'');
      }
      if(p<1) requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  };

  const reveal=(card)=>{
    card.classList.add('is-visible');
    card.querySelectorAll('[data-count],[data-count-range]').forEach(animateNumber);
  };

  if(!('IntersectionObserver' in window) || reduce){
    cards.forEach(reveal);
    return;
  }

  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.28});

  cards.forEach(card=>observer.observe(card));
})();
