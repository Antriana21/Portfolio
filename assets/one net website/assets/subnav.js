// Section sub-nav: smooth-scroll + scroll-spy highlighting.
(function(){
  function init(){
    var nav = document.querySelector('.subnav');
    if(!nav) return;
    var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
    if(!links.length) return;
    var OFFSET = 142; // sticky topbar (88) + subnav (52) + breathing room

    function targetOf(a){ return document.getElementById(a.getAttribute('href').slice(1)); }

    links.forEach(function(a){
      a.addEventListener('click', function(e){
        var el = targetOf(a);
        if(!el) return;
        e.preventDefault();
        var startY = window.pageYOffset;
        var destY = el.getBoundingClientRect().top + startY - OFFSET;
        var diff = destY - startY, st = null, dur = 600;
        function step(ts){
          if(!st) st = ts;
          var p = Math.min((ts - st)/dur, 1);
          var e2 = p < .5 ? 2*p*p : 1 - Math.pow(-2*p+2, 2)/2;
          window.scrollTo(0, startY + diff*e2);
          if(p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    });

    function spy(){
      var cur = null;
      links.forEach(function(a){
        var el = targetOf(a);
        if(!el) return;
        if(el.getBoundingClientRect().top - OFFSET - 12 <= 0) cur = a;
      });
      if(!cur) cur = links[0];
      links.forEach(function(a){ a.classList.toggle('active', a === cur); });
    }
    window.addEventListener('scroll', spy, {passive:true});
    window.addEventListener('resize', spy, {passive:true});
    spy();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
