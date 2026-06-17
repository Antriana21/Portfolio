// Apply theme before paint to avoid FOUC.
(function(){
  try{
    var saved = localStorage.getItem('theme');
    var prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefers ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }catch(e){}
})();

document.addEventListener('DOMContentLoaded', function(){
  var btn = document.querySelector('.theme-toggle');
  if(!btn) return;
  btn.addEventListener('click', function(){
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('theme', next); }catch(e){}
  });
  // follow OS when user hasn't overridden
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener && mq.addEventListener('change', function(e){
    if(localStorage.getItem('theme')) return;
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  });
});
