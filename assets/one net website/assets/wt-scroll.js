(function(){
  if(window.parent === window) return;
  document.documentElement.setAttribute('data-theme','dark');

  // Remove backdrop-filter blur on the topbar — it forces re-composition on every
  // programmatic scroll frame and causes visible shaking in the walkthrough.
  var s = document.createElement('style');
  s.textContent = '.topbar{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;transform:translateZ(0);will-change:transform;}';
  (document.head || document.documentElement).appendChild(s);

  window.addEventListener('message', function(e){
    if(e.data && e.data.type === 'wt-scroll') window.scrollTo(0, e.data.y);
  });

  function report(){
    var src = (location.pathname.split('/').pop() || location.href.split('/').pop()) || '';
    var isHome = (src === 'index.html' || src === '');
    var h;
    if(isHome){
      h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    } else {
      var stop = document.querySelector('section.explore, footer');
      h = stop ? stop.offsetTop : Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    }
    window.parent.postMessage({type:'wt-height', src:src, h:h}, '*');
  }

  window.addEventListener('load', function(){
    report();
    setTimeout(report, 900);
  });
})();
