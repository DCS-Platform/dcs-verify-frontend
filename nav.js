/* DCS Verify — shared header. One source of truth for the nav across every page.
   Each page carries <div id="dcs-nav"></div> + this script; the markup below is
   injected identically everywhere, with the current page's link highlighted. */
(function(){
  var links = [
    { href:'verify.html',          label:'Verify' },
    { href:'explorer.html',        label:'Explorer' },
    { href:'registry.html',        label:'Registry' },
    { href:'trust-landscape.html', label:'Trust Landscape' },
    { href:'compliance.html',      label:'Compliance' },
    { href:'docs.html',            label:'Docs' },
    { href:'pricing.html',         label:'Pricing' }
  ];
  var cta = { href:'dashboard.html', label:'Issuer console' };

  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (here === '') here = 'index.html';

  var css = '<style>'
    + '.dcsnav{position:sticky;top:0;z-index:50;border-bottom:1px solid #1f1f29;background:rgba(10,10,15,.82);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}'
    + '.dcsnav .in{max-width:1480px;margin:0 auto;padding:0 24px;height:62px;display:flex;align-items:center;justify-content:space-between;gap:18px}'
    + '.dcsnav .b{display:flex;align-items:center;gap:9px;font:700 16px/1 "Inter",system-ui,sans-serif;color:#e8e8ec;text-decoration:none;white-space:nowrap}'
    + '.dcsnav .b .mk{width:24px;height:24px;border:1.5px solid #1e7eff;border-radius:7px;display:grid;place-items:center;color:#1e7eff;font-size:12px}'
    + '.dcsnav .lk{display:flex;align-items:center;gap:22px;flex:1;justify-content:flex-end}'
    + '.dcsnav a.l{font:500 14px/1 "Inter",system-ui,sans-serif;color:#9c9ca8;text-decoration:none;white-space:nowrap}'
    + '.dcsnav a.l:hover{color:#e8e8ec}'
    + '.dcsnav a.l.on{color:#4aa3ff}'
    + '.dcsnav a.cta{font:600 13.5px/1 "Inter",system-ui,sans-serif;color:#fff;background:#1e7eff;padding:9px 15px;border-radius:9px;text-decoration:none;white-space:nowrap}'
    + '.dcsnav a.cta:hover{background:#1565d8}'
    + '@media(max-width:860px){.dcsnav .lk a.l{display:none}}'
    + '</style>';

  var html = '<nav class="dcsnav"><div class="in">'
    + '<a class="b" href="index.html"><span class="mk">◆</span> DCS Verify</a>'
    + '<div class="lk">'
    + links.map(function(x){ return '<a class="l' + (x.href === here ? ' on' : '') + '" href="' + x.href + '">' + x.label + '</a>'; }).join('')
    + '<a class="cta" href="' + cta.href + '">' + cta.label + '</a>'
    + '</div></div></nav>';

  function mount(){
    var root = document.getElementById('dcs-nav');
    if (root) { root.outerHTML = css + html; }
    else if (document.body) { document.body.insertAdjacentHTML('afterbegin', css + html); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
