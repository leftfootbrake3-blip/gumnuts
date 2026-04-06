// GUMNUTS STORY ENGINE v8.4
// 56 scenes, 2 per real day, chapter 2 locked behind donation
// All SVG inline, all scripts external, full CSP compliance

// ── SOUND ──────────────────────────────────────────────────────────────────
var _ac = null;
function ac() { if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)(); return _ac; }
function tone(freq, freq2, dur, vol, type) {
  try {
    var c = ac(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type || 'sine'; o.frequency.value = freq;
    if (freq2) o.frequency.linearRampToValueAtTime(freq2, c.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.start(); o.stop(c.currentTime + dur + 0.05);
  } catch(e) {}
}
function sNext() { tone(440, 600, 0.12, 0.1); setTimeout(function(){ tone(660, 0, 0.1, 0.1); }, 100); }
function sPrev() { tone(400, 280, 0.12, 0.1); }
function sLock() { tone(200, 120, 0.25, 0.18, 'triangle'); }
function sDonate() { tone(523,0,0.1,0.12); setTimeout(function(){tone(659,0,0.1,0.12);},90); setTimeout(function(){tone(784,0,0.18,0.12);},180); setTimeout(function(){tone(1047,0,0.25,0.1);},280); }
function sLoad() {
  var t = ac().currentTime;
  [380,420,360,400].forEach(function(f,i){
    var o=ac().createOscillator(), g=ac().createGain();
    o.connect(g); g.connect(ac().destination);
    o.type='sine'; o.frequency.value=f;
    g.gain.setValueAtTime(0,t+i*0.14);
    g.gain.linearRampToValueAtTime(0.14,t+i*0.14+0.03);
    g.gain.exponentialRampToValueAtTime(0.001,t+i*0.14+0.12);
    o.start(t+i*0.14); o.stop(t+i*0.14+0.13);
  });
}

// ── SVG PRIMITIVES ──────────────────────────────────────────────────────────
var W = 640, H = 360;

function sky(col) { return '<rect width="'+W+'" height="'+H+'" fill="'+col+'"/>'; }

function ground(y, col) {
  return '<ellipse cx="320" cy="'+(y+18)+'" rx="380" ry="28" fill="'+(col||'#3A2060')+'" opacity="0.7"/>';
}

// Much better koala - bigger, rounder, more detailed
function K(x, y, s, mood, ac) {
  s = s || 0.55; ac = ac || 'ab'; mood = mood || 'happy';
  var sc = function(n){ return n*s; };

  // mouth variants
  var mouth = {
    happy:   '<path d="M'+(x-sc(18))+','+(y+sc(28))+' Q'+x+','+(y+sc(44))+' '+(x+sc(18))+','+(y+sc(28))+'" fill="#FF9AB8" stroke="#111" stroke-width="'+(2*s)+'" stroke-linecap="round"/><path d="M'+(x-sc(16))+','+(y+sc(28))+' Q'+x+','+(y+sc(32))+' '+(x+sc(16))+','+(y+sc(28))+'" fill="none" stroke="#111" stroke-width="'+(1.5*s)+'"/>',
    sad:     '<path d="M'+(x-sc(16))+','+(y+sc(38))+' Q'+x+','+(y+sc(28))+' '+(x+sc(16))+','+(y+sc(38))+'" fill="none" stroke="#111" stroke-width="'+(2.5*s)+'" stroke-linecap="round"/>',
    panic:   '<ellipse cx="'+x+'" cy="'+(y+sc(34))+'" rx="'+(sc(12))+'" ry="'+(sc(9))+'" fill="#FF4060" stroke="#111" stroke-width="'+(2*s)+'"/>',
    smirk:   '<path d="M'+(x-sc(6))+','+(y+sc(32))+' Q'+(x+sc(12))+','+(y+sc(42))+' '+(x+sc(20))+','+(y+sc(30))+'" fill="none" stroke="#111" stroke-width="'+(2.5*s)+'" stroke-linecap="round"/>',
    wow:     '<ellipse cx="'+x+'" cy="'+(y+sc(36))+'" rx="'+(sc(14))+'" ry="'+(sc(13))+'" fill="#FF6088" stroke="#111" stroke-width="'+(2*s)+'"/>',
  }[mood] || '';

  // sweat if panicking
  var extras = mood === 'panic'
    ? '<ellipse cx="'+(x+sc(78))+'" cy="'+(y-sc(15))+'" rx="'+(sc(5))+'" ry="'+(sc(9))+'" fill="#88CCFF" opacity="0.85"/>'
    + '<ellipse cx="'+(x-sc(82))+'" cy="'+(y)+'" rx="'+(sc(4))+'" ry="'+(sc(7))+'" fill="#88CCFF" opacity="0.7"/>'
    : '';

  return '<g class="'+ac+'">'
    // outer ears
    + '<ellipse cx="'+(x-sc(72))+'" cy="'+(y-sc(12))+'" rx="'+(sc(42))+'" ry="'+(sc(40))+'" fill="#8A8A96" stroke="#111" stroke-width="'+(3*s)+'"/>'
    + '<ellipse cx="'+(x-sc(72))+'" cy="'+(y-sc(12))+'" rx="'+(sc(27))+'" ry="'+(sc(26))+'" fill="#AAAAB8"/>'
    + '<ellipse cx="'+(x-sc(72))+'" cy="'+(y-sc(10))+'" rx="'+(sc(15))+'" ry="'+(sc(14))+'" fill="#C8C0D8" opacity="0.6"/>'
    + '<ellipse cx="'+(x+sc(72))+'" cy="'+(y-sc(12))+'" rx="'+(sc(42))+'" ry="'+(sc(40))+'" fill="#8A8A96" stroke="#111" stroke-width="'+(3*s)+'"/>'
    + '<ellipse cx="'+(x+sc(72))+'" cy="'+(y-sc(12))+'" rx="'+(sc(27))+'" ry="'+(sc(26))+'" fill="#AAAAB8"/>'
    + '<ellipse cx="'+(x+sc(72))+'" cy="'+(y-sc(10))+'" rx="'+(sc(15))+'" ry="'+(sc(14))+'" fill="#C8C0D8" opacity="0.6"/>'
    // body
    + '<ellipse cx="'+x+'" cy="'+(y+sc(70))+'" rx="'+(sc(52))+'" ry="'+(sc(60))+'" fill="#8A8A96" stroke="#111" stroke-width="'+(2.5*s)+'"/>'
    + '<ellipse cx="'+x+'" cy="'+(y+sc(76))+'" rx="'+(sc(34))+'" ry="'+(sc(44))+'" fill="#EEEEF8"/>'
    // arms
    + '<ellipse cx="'+(x-sc(54))+'" cy="'+(y+sc(52))+'" rx="'+(sc(13))+'" ry="'+(sc(26))+'" fill="#8A8A96" stroke="#111" stroke-width="'+(2*s)+'"/>'
    + '<ellipse cx="'+(x-sc(56))+'" cy="'+(y+sc(76))+'" rx="'+(sc(16))+'" ry="'+(sc(12))+'" fill="#8A8A96" stroke="#111" stroke-width="'+(2*s)+'" transform="rotate(-18,'+(x-sc(56))+','+(y+sc(76))+')"/>'
    + '<ellipse cx="'+(x+sc(54))+'" cy="'+(y+sc(52))+'" rx="'+(sc(13))+'" ry="'+(sc(26))+'" fill="#8A8A96" stroke="#111" stroke-width="'+(2*s)+'"/>'
    + '<ellipse cx="'+(x+sc(56))+'" cy="'+(y+sc(76))+'" rx="'+(sc(16))+'" ry="'+(sc(12))+'" fill="#8A8A96" stroke="#111" stroke-width="'+(2*s)+'" transform="rotate(18,'+(x+sc(56))+','+(y+sc(76))+')"/>'
    // head
    + '<ellipse cx="'+x+'" cy="'+y+'" rx="'+(sc(88))+'" ry="'+(sc(82))+'" fill="#9898A8" stroke="#111" stroke-width="'+(3.5*s)+'"/>'
    // highlight
    + '<ellipse cx="'+(x-sc(18))+'" cy="'+(y-sc(30))+'" rx="'+(sc(48))+'" ry="'+(sc(32))+'" fill="#AAAAB8" opacity="0.22"/>'
    // nose
    + '<ellipse cx="'+x+'" cy="'+(y+sc(10))+'" rx="'+(sc(28))+'" ry="'+(sc(21))+'" fill="#1E1228" stroke="#111" stroke-width="'+(2*s)+'"/>'
    + '<ellipse cx="'+(x-sc(8))+'" cy="'+(y+sc(3))+'" rx="'+(sc(9))+'" ry="'+(sc(6))+'" fill="#3A2848" opacity="0.55"/>'
    // eyes - white sclera then iris
    + '<circle cx="'+(x-sc(28))+'" cy="'+(y-sc(22))+'" r="'+(sc(20))+'" fill="#0A0A1A" stroke="#111" stroke-width="'+(2*s)+'"/>'
    + '<circle cx="'+(x-sc(28))+'" cy="'+(y-sc(22))+'" r="'+(sc(13))+'" fill="#1A1A3A"/>'
    + '<circle cx="'+(x-sc(20))+'" cy="'+(y-sc(32))+'" r="'+(sc(7.5))+'" fill="white"/>'
    + '<circle cx="'+(x-sc(37))+'" cy="'+(y-sc(25))+'" r="'+(sc(3.5))+'" fill="white" opacity="0.7"/>'
    + '<circle cx="'+(x+sc(28))+'" cy="'+(y-sc(22))+'" r="'+(sc(20))+'" fill="#0A0A1A" stroke="#111" stroke-width="'+(2*s)+'"/>'
    + '<circle cx="'+(x+sc(28))+'" cy="'+(y-sc(22))+'" r="'+(sc(13))+'" fill="#1A1A3A"/>'
    + '<circle cx="'+(x+sc(36))+'" cy="'+(y-sc(32))+'" r="'+(sc(7.5))+'" fill="white"/>'
    + '<circle cx="'+(x+sc(19))+'" cy="'+(y-sc(25))+'" r="'+(sc(3.5))+'" fill="white" opacity="0.7"/>'
    // cheeks
    + '<ellipse cx="'+(x-sc(58))+'" cy="'+(y+sc(12))+'" rx="'+(sc(22))+'" ry="'+(sc(15))+'" fill="#F070A0" opacity="0.38"/>'
    + '<ellipse cx="'+(x+sc(58))+'" cy="'+(y+sc(12))+'" rx="'+(sc(22))+'" ry="'+(sc(15))+'" fill="#F070A0" opacity="0.38"/>'
    + mouth + extras
    + '</g>';
}

// Much better Craig - proper croc proportions
function CR(x, y, s, mood, ac) {
  s = s || 0.55; ac = ac || 'sw'; mood = mood || 'menace';

  var sc = function(n){ return n*s; };
  var expr = mood === 'sad'
    ? '<path d="M'+(x-sc(24))+','+(y+sc(38))+' Q'+x+','+(y+sc(28))+' '+(x+sc(24))+','+(y+sc(38))+'" fill="none" stroke="#111" stroke-width="'+(2.5*s)+'" stroke-linecap="round"/>'
    : '<ellipse cx="'+x+'" cy="'+(y+sc(32))+'" rx="'+(sc(28))+'" ry="'+(sc(18))+'" fill="#AADD44" stroke="#111" stroke-width="'+(2*s)+'"/>'
    + '<path d="M'+(x-sc(24))+','+(y+sc(28))+' Q'+x+','+(y+sc(22))+' '+(x+sc(24))+','+(y+sc(28))+'" fill="none" stroke="#111" stroke-width="'+(2*s)+'"/>'
    + '<rect x="'+(x-sc(22))+'" y="'+(y+sc(33))+'" width="'+(sc(9))+'" height="'+(sc(12))+'" rx="2" fill="white"/>'
    + '<rect x="'+(x-sc(8))+'" y="'+(y+sc(33))+'" width="'+(sc(9))+'" height="'+(sc(12))+'" rx="2" fill="white"/>'
    + '<rect x="'+(x+sc(6))+'" y="'+(y+sc(33))+'" width="'+(sc(9))+'" height="'+(sc(12))+'" rx="2" fill="white"/>';

  return '<g class="'+ac+'">'
    // tail
    + '<path d="M'+(x+sc(52))+','+(y+sc(85))+' Q'+(x+sc(100))+','+(y+sc(95))+' '+(x+sc(120))+','+(y+sc(72))+' Q'+(x+sc(132))+','+(y+sc(55))+' '+(x+sc(110))+','+(y+sc(48))+'" fill="none" stroke="#4A9E2C" stroke-width="'+(sc(18))+'" stroke-linecap="round"/>'
    // body
    + '<ellipse cx="'+x+'" cy="'+(y+sc(68))+'" rx="'+(sc(56))+'" ry="'+(sc(52))+'" fill="#4A9E2C" stroke="#111" stroke-width="'+(3*s)+'"/>'
    + '<ellipse cx="'+x+'" cy="'+(y+sc(74))+'" rx="'+(sc(36))+'" ry="'+(sc(34))+'" fill="#AADD44"/>'
    // arms
    + '<ellipse cx="'+(x-sc(60))+'" cy="'+(y+sc(50))+'" rx="'+(sc(22))+'" ry="'+(sc(14))+'" fill="#4A9E2C" stroke="#111" stroke-width="2" transform="rotate(20,'+(x-sc(60))+','+(y+sc(50))+')"/>'
    + '<circle cx="'+(x-sc(76))+'" cy="'+(y+sc(55))+'" r="'+(sc(7))+'" fill="#3A8E1C" stroke="#111" stroke-width="1.5"/>'
    + '<circle cx="'+(x-sc(63))+'" cy="'+(y+sc(46))+'" r="'+(sc(7))+'" fill="#3A8E1C" stroke="#111" stroke-width="1.5"/>'
    + '<ellipse cx="'+(x+sc(60))+'" cy="'+(y+sc(50))+'" rx="'+(sc(22))+'" ry="'+(sc(14))+'" fill="#4A9E2C" stroke="#111" stroke-width="2" transform="rotate(-20,'+(x+sc(60))+','+(y+sc(50))+')"/>'
    + '<circle cx="'+(x+sc(66))+'" cy="'+(y+sc(46))+'" r="'+(sc(7))+'" fill="#3A8E1C" stroke="#111" stroke-width="1.5"/>'
    + '<circle cx="'+(x+sc(76))+'" cy="'+(y+sc(55))+'" r="'+(sc(7))+'" fill="#3A8E1C" stroke="#111" stroke-width="1.5"/>'
    // head - wider, flatter croc
    + '<ellipse cx="'+x+'" cy="'+y+'" rx="'+(sc(80))+'" ry="'+(sc(58))+'" fill="#4A9E2C" stroke="#111" stroke-width="'+(3.5*s)+'"/>'
    // ridge scales on top
    + '<ellipse cx="'+(x-sc(30))+'" cy="'+(y-sc(52))+'" rx="'+(sc(10))+'" ry="'+(sc(7))+'" fill="#3A9020"/>'
    + '<ellipse cx="'+x+'" cy="'+(y-sc(56))+'" rx="'+(sc(10))+'" ry="'+(sc(7))+'" fill="#3A9020"/>'
    + '<ellipse cx="'+(x+sc(30))+'" cy="'+(y-sc(52))+'" rx="'+(sc(10))+'" ry="'+(sc(7))+'" fill="#3A9020"/>'
    // snout extends down
    + '<ellipse cx="'+x+'" cy="'+(y+sc(22))+'" rx="'+(sc(64))+'" ry="'+(sc(30))+'" fill="#4A9E2C" stroke="#111" stroke-width="'+(2.5*s)+'"/>'
    // nostrils
    + '<ellipse cx="'+(x-sc(20))+'" cy="'+(y+sc(10))+'" rx="'+(sc(7))+'" ry="'+(sc(4.5))+'" fill="#2A7E0C"/>'
    + '<ellipse cx="'+(x+sc(20))+'" cy="'+(y+sc(10))+'" rx="'+(sc(7))+'" ry="'+(sc(4.5))+'" fill="#2A7E0C"/>'
    // sunglasses - red lenses gold frame
    + '<rect x="'+(x-sc(58))+'" y="'+(y-sc(36))+'" width="'+(sc(46))+'" height="'+(sc(26))+'" rx="'+(sc(8))+'" fill="#BB1100" stroke="#D4AF37" stroke-width="'+(sc(3))+'"/>'
    + '<rect x="'+(x+sc(12))+'" y="'+(y-sc(36))+'" width="'+(sc(46))+'" height="'+(sc(26))+'" rx="'+(sc(8))+'" fill="#BB1100" stroke="#D4AF37" stroke-width="'+(sc(3))+'"/>'
    + '<line x1="'+(x-sc(12))+'" y1="'+(y-sc(23))+'" x2="'+(x+sc(12))+'" y2="'+(y-sc(23))+'" stroke="#D4AF37" stroke-width="'+(sc(3.5))+'"/>'
    + '<line x1="'+(x-sc(104))+'" y1="'+(y-sc(23))+'" x2="'+(x-sc(58))+'" y2="'+(y-sc(23))+'" stroke="#D4AF37" stroke-width="'+(sc(2.5))+'"/>'
    + '<line x1="'+(x+sc(58))+'" y1="'+(y-sc(23))+'" x2="'+(x+sc(104))+'" y2="'+(y-sc(23))+'" stroke="#D4AF37" stroke-width="'+(sc(2.5))+'"/>'
    // lens shine
    + '<ellipse cx="'+(x-sc(46))+'" cy="'+(y-sc(31))+'" rx="'+(sc(8))+'" ry="'+(sc(4))+'" fill="white" opacity="0.18"/>'
    + '<ellipse cx="'+(x+sc(24))+'" cy="'+(y-sc(31))+'" rx="'+(sc(8))+'" ry="'+(sc(4))+'" fill="white" opacity="0.18"/>'
    // gold chain
    + '<path d="M'+(x-sc(42))+','+(y+sc(90))+' Q'+x+','+(y+sc(108))+' '+(x+sc(42))+','+(y+sc(90))+'" fill="none" stroke="#D4AF37" stroke-width="'+(sc(6))+'" stroke-linecap="round"/>'
    + '<circle cx="'+x+'" cy="'+(y+sc(108))+'" r="'+(sc(9))+'" fill="#D4AF37" stroke="#B8860B" stroke-width="'+(sc(1.5))+'"/>'
    + '<text x="'+x+'" y="'+(y+sc(112))+'" font-size="'+(sc(7))+'" fill="#886600" text-anchor="middle" font-weight="bold">$</text>'
    + expr + '</g>';
}

// Memory tree
function tree(x, y, s, dim) {
  s = s||0.9; dim = dim||false;
  var c = dim ? '#666' : '#FFB8D4';
  var c2 = dim ? '#888' : '#FFC8E0';
  var gc = dim ? '' : ' class="gw"';
  return '<g'+gc+'>'
    + '<rect x="'+(x-8*s)+'" y="'+y+'" width="'+(16*s)+'" height="'+(70*s)+'" rx="4" fill="#6B4226" stroke="#111" stroke-width="2"/>'
    + '<ellipse cx="'+x+'" cy="'+y+'" rx="'+(58*s)+'" ry="'+(52*s)+'" fill="'+c+'" stroke="#111" stroke-width="2.5" opacity="0.92"/>'
    + '<ellipse cx="'+(x-sc2(16,s))+'" cy="'+(y-sc2(12,s))+'" rx="'+(42*s)+'" ry="'+(37*s)+'" fill="'+c2+'" opacity="0.72"/>'
    + (dim ? '' :
       '<circle cx="'+(x-sc2(20,s))+'" cy="'+(y-sc2(14,s))+'" r="'+(9*s)+'" fill="white" opacity="0.45" stroke="#FF8FAB" stroke-width="1.5"/>'
     + '<circle cx="'+(x+sc2(24,s))+'" cy="'+(y-sc2(4,s))+'" r="'+(7*s)+'" fill="white" opacity="0.38" stroke="#FF8FAB" stroke-width="1.5"/>'
     + '<circle cx="'+(x+sc2(4,s))+'" cy="'+(y+sc2(16,s))+'" r="'+(8*s)+'" fill="white" opacity="0.42" stroke="#FF8FAB" stroke-width="1.5"/>')
    + '</g>';
}
function sc2(n,s){ return n*s; }

// Hearts, stars, bubbles
function ht(x,y,sz,cls,col) {
  sz=sz||14; cls=cls||'dr'; col=col||'#FF4D8D';
  var p='M'+x+','+(y-sz*0.5)+' C'+x+','+(y-sz*1.2)+' '+(x-sz)+','+(y-sz*1.2)+' '+(x-sz)+','+(y-sz*0.5)+' C'+(x-sz)+','+(y+sz*0.2)+' '+x+','+(y+sz*1)+' '+x+','+(y+sz*1.2)+' C'+x+','+(y+sz)+' '+(x+sz)+','+(y+sz*0.2)+' '+(x+sz)+','+(y-sz*0.5)+' C'+(x+sz)+','+(y-sz*1.2)+' '+x+','+(y-sz*1.2)+' '+x+','+(y-sz*0.5)+'Z';
  return '<path class="'+cls+'" d="'+p+'" fill="'+col+'" opacity="0.92"/>';
}
function st(x,y,r,cls,col) {
  cls=cls||'ps'; col=col||'#FFD700'; r=r||14;
  var pts='';
  for(var i=0;i<10;i++){var a=(i*36-90)*Math.PI/180; var rr=i%2?r*0.44:r; pts+=(x+rr*Math.cos(a)).toFixed(1)+','+(y+rr*Math.sin(a)).toFixed(1)+' ';}
  return '<polygon class="'+cls+'" points="'+pts+'" fill="'+col+'"/>';
}
function bb(x,y,r,cls) {
  cls=cls||'fl';
  return '<circle class="'+cls+'" cx="'+x+'" cy="'+y+'" r="'+r+'" fill="none" stroke="#FF8FAB" stroke-width="2" opacity="0.72"/>'
       + '<circle cx="'+(x-r*0.35)+'" cy="'+(y-r*0.35)+'" r="'+(r*0.2)+'" fill="white" opacity="0.32"/>';
}
function zzz(x,y,i){
  var a=['dr','dr2','dr3']; var sz=[17,25,14];
  return '<text class="'+a[i]+'" x="'+x+'" y="'+y+'" font-family="Comic Sans MS,cursive" font-size="'+sz[i]+'" font-weight="900" fill="#A898B8">'+['z','Z','z'][i]+'</text>';
}
function sun(x,y,r){
  return '<circle class="ps" cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#FFE066" opacity="0.88"/>'
       + '<circle cx="'+x+'" cy="'+y+'" r="'+(r+10)+'" fill="none" stroke="#FFD700" stroke-width="3" opacity="0.25" class="ps2"/>';
}
function clipboard(x,y,s){
  s=s||1;
  return '<rect x="'+(x-28*s)+'" y="'+(y)+'" width="'+(56*s)+'" height="'+(72*s)+'" rx="4" fill="white" stroke="#9888AA" stroke-width="'+(2.5*s)+'" class="fl"/>'
       + '<rect x="'+(x-16*s)+'" y="'+(y-8*s)+'" width="'+(32*s)+'" height="'+(14*s)+'" rx="4" fill="#9888AA"/>'
       + '<line x1="'+(x-20*s)+'" y1="'+(y+22*s)+'" x2="'+(x+20*s)+'" y2="'+(y+22*s)+'" stroke="#DDD" stroke-width="1.5"/>'
       + '<line x1="'+(x-20*s)+'" y1="'+(y+34*s)+'" x2="'+(x+20*s)+'" y2="'+(y+34*s)+'" stroke="#DDD" stroke-width="1.5"/>'
       + '<line x1="'+(x-20*s)+'" y1="'+(y+46*s)+'" x2="'+(x+8*s)+'" y2="'+(y+46*s)+'" stroke="#DDD" stroke-width="1.5"/>';
}
function creek(y){
  return '<ellipse cx="200" cy="'+y+'" rx="160" ry="24" fill="#5599CC" opacity="0.42" class="fl"/>'
       + '<ellipse cx="195" cy="'+y+'" rx="100" ry="12" fill="#88BBEE" opacity="0.25"/>';
}
function bubble_text(x,y,r,txt){
  return bb(x,y,r,'fl')+'<text x="'+x+'" y="'+(y+4)+'" font-family="Comic Sans MS,cursive" font-size="9" fill="#FF8FAB" text-anchor="middle" opacity="0.85">'+txt+'</text>';
}

// ── SCENE BUILDER ──────────────────────────────────────────────────────────
function scene(name) {
  var bg = '#0A0618', inner = '';

  switch(name) {

  // ── CHAPTER 1: FREE ────────────────────────────────────────────────────

  case 's01a': // Day 1 Morning — Wake Up
    bg='#FFE8D0';
    inner = sky('#FFE8D0')+sun(540,55,42)
      +zzz(420,95,0)+zzz(448,68,1)+zzz(408,115,2)
      +'<ellipse cx="320" cy="328" rx="320" ry="36" fill="#7DC98A" opacity="0.5"/>'
      +K(280,215,0.62,'happy','ab');
    break;

  case 's01b': // Day 1 Evening — The Leaf Count
    bg='#FFD4B0';
    inner = sky('#FFD4B0')+sun(560,70,32)
      +'<rect x="80" y="160" width="160" height="130" rx="8" fill="#8B6340" stroke="#5A3D1A" stroke-width="3"/>'
      +'<rect x="82" y="162" width="156" height="90" rx="4" fill="#AAD4FF" opacity="0.7"/>'
      +'<rect x="82" y="255" width="156" height="32" fill="#8B6340"/>'
      +'<ellipse cx="180" cy="155" rx="55" ry="60" fill="#5AAF3C" stroke="#3A8F1C" stroke-width="3"/>'
      +'<text x="182" y="138" font-family="Comic Sans MS,cursive" font-size="11" fill="white" text-anchor="middle" font-weight="bold">47</text>'
      +K(360,225,0.58,'smirk','ab');
    break;

  case 's02a': // Day 2 — Kelly Arrives
    bg='#E8FFF0';
    inner = sky('#E8FFF0')
      +'<ellipse cx="320" cy="330" rx="320" ry="34" fill="#7DC98A" opacity="0.5"/>'
      +K(185,222,0.58,'happy','ab2')
      +K(460,222,0.56,'happy','abs')
      +clipboard(420,135,0.9)
      +ht(310,110,13,'dr','#FF4D8D')+ht(330,95,10,'dr2','#FF8FAB')+ht(295,100,11,'dr3','#FF4D8D');
    break;

  case 's02b': // Day 2 Evening — The Seventeen Folders
    bg='#F0FFF5';
    inner = sky('#F0FFF5')
      +'<rect x="380" y="160" width="32" height="48" rx="3" fill="#FF8FAB" stroke="#FF4D8D" stroke-width="1.5" transform="rotate(-8,396,184)"/>'
      +'<rect x="400" y="155" width="32" height="48" rx="3" fill="#9888AA" stroke="#7766CC" stroke-width="1.5" transform="rotate(4,416,179)"/>'
      +'<rect x="420" y="165" width="32" height="48" rx="3" fill="#FFB844" stroke="#CC8800" stroke-width="1.5" transform="rotate(-3,436,189)"/>'
      +'<rect x="440" y="158" width="32" height="48" rx="3" fill="#88CCFF" stroke="#4499CC" stroke-width="1.5" transform="rotate(6,456,182)"/>'
      +'<rect x="460" y="162" width="32" height="48" rx="3" fill="#FF8888" stroke="#CC4444" stroke-width="1.5" transform="rotate(-5,476,186)"/>'
      +'<text x="434" y="148" font-family="Comic Sans MS,cursive" font-size="12" fill="#664488" text-anchor="middle" font-weight="bold">17 folders</text>'
      +K(195,225,0.58,'wow','ab');
    break;

  case 's03a': // Day 3 — The Memory Tree
    bg='#FFF5F8';
    inner = sky('#FFF5F8')
      +tree(320,65,1.1)
      +K(140,240,0.52,'happy','ab2')
      +K(490,245,0.50,'happy','abs');
    break;

  case 's03b': // Day 3 Evening — What It Stores
    bg='#F8F0FF';
    inner = sky('#F8F0FF')
      +tree(320,70,0.85)
      +bubble_text(160,100,28,'47 leaves')
      +bubble_text(460,110,26,'password')
      +bubble_text(200,175,24,'birthday')
      +bubble_text(440,180,22,'lamingtons')
      +bubble_text(310,210,20,'bad tuesday');
    break;

  case 's04a': // Day 4 — Shadow in the Creek
    bg='#D8EEFF';
    inner = sky('#D8EEFF')
      +creek(280)
      +'<g class="eb"><ellipse cx="148" cy="278" rx="11" ry="7" fill="#CC2200" opacity="0.95"/></g>'
      +'<g class="eb2"><ellipse cx="184" cy="276" rx="11" ry="7" fill="#CC2200" opacity="0.95"/></g>'
      +'<text x="430" y="145" font-family="Comic Sans MS,cursive" font-size="38" font-weight="900" fill="#888" opacity="0.55" class="ps">?</text>'
      +K(440,230,0.6,'panic','ab');
    break;

  case 's04b': // Day 4 Evening — Gumnuts Pretends Not To Notice
    bg='#C8E8FF';
    inner = sky('#C8E8FF')
      +creek(275)
      +'<g class="eb"><ellipse cx="145" cy="273" rx="12" ry="7" fill="#CC2200" opacity="0.9"/></g>'
      +'<g class="eb2"><ellipse cx="182" cy="271" rx="12" ry="7" fill="#CC2200" opacity="0.9"/></g>'
      +K(420,228,0.6,'happy','ab')
      +'<text x="390" y="155" font-family="Comic Sans MS,cursive" font-size="12" fill="#664488" text-anchor="middle">la la la</text>'
      +'<text x="395" y="172" font-family="Comic Sans MS,cursive" font-size="12" fill="#664488" text-anchor="middle">not looking</text>';
    break;

  case 's05a': // Day 5 — The Best Leaf
    bg='#EAFFF0';
    inner = sky('#EAFFF0')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#7DC98A" opacity="0.5"/>'
      +'<ellipse cx="318" cy="172" rx="17" ry="34" fill="#7DC98A" stroke="#3A8F1C" stroke-width="2.5" transform="rotate(-18,318,172)" class="fl"/>'
      +'<line x1="318" y1="144" x2="312" y2="204" stroke="#3A8F1C" stroke-width="2"/>'
      +K(185,228,0.58,'smirk','ab')
      +K(460,230,0.56,'happy','ab2');
    break;

  case 's05b': // Day 5 Evening — She Wrote It Down
    bg='#F5FFEA';
    inner = sky('#F5FFEA')
      +K(200,230,0.56,'happy','ab2')
      +clipboard(430,128,1)
      +'<text x="432" y="162" font-family="Comic Sans MS,cursive" font-size="8" fill="#664488" text-anchor="middle">received: 1x</text>'
      +'<text x="432" y="173" font-family="Comic Sans MS,cursive" font-size="8" fill="#664488" text-anchor="middle">gumleaf (damp)</text>'
      +'<text x="432" y="184" font-family="Comic Sans MS,cursive" font-size="8" fill="#664488" text-anchor="middle">status: evidence</text>';
    break;

  case 's06a': // Day 6 — Craig Appears
    bg='#F0FFF0';
    inner = sky('#F0FFF0')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A5028" opacity="0.6"/>'
      +CR(320,185,0.65,'menace','sw')
      +st(105,65,18,'ps','#CC2200')+st(540,80,14,'ps2','#CC2200')
      +'<text x="320" y="52" font-family="Comic Sans MS,cursive" font-size="22" font-weight="900" fill="#CC2200" text-anchor="middle" class="ps">CRAIG</text>';
    break;

  case 's06b': // Day 6 Evening — Nice Tree
    bg='#EDFFF0';
    inner = sky('#EDFFF0')
      +tree(480,80,0.65)
      +CR(200,200,0.62,'menace','sw')
      +'<rect x="318" y="62" width="148" height="52" rx="12" fill="white" stroke="#CC2200" stroke-width="2"/>'
      +'<polygon points="318,84 296,100 322,92" fill="white" stroke="#CC2200" stroke-width="2"/>'
      +'<text x="392" y="84" font-family="Comic Sans MS,cursive" font-size="10" fill="#CC2200" text-anchor="middle">nice tree</text>'
      +'<text x="392" y="100" font-family="Comic Sans MS,cursive" font-size="10" fill="#CC2200" text-anchor="middle">shame if...</text>';
    break;

  case 's07a': // Day 7 — Craig Makes His Move
    bg='#FFF5F0';
    inner = sky('#FFF5F0')
      +tree(460,78,0.78,true)
      +CR(205,205,0.65,'menace','sw')
      +'<circle cx="450" cy="145" r="18" fill="none" stroke="#FF4D8D" stroke-width="2" class="ps"/>'
      +'<line x1="435" y1="130" x2="465" y2="160" stroke="#FF4D8D" stroke-width="3" class="ps"/>';
    break;

  case 's07b': // Day 7 Evening — The Lamington Recipe
    bg='#FFF8F0';
    inner = sky('#FFF8F0')
      +'<rect x="230" y="120" width="160" height="120" rx="8" fill="#8B5E3C" class="fl"/>'
      +'<rect x="230" y="120" width="160" height="36" rx="4" fill="#FF4D8D" opacity="0.8"/>'
      +'<text x="310" y="143" font-family="Comic Sans MS,cursive" font-size="11" fill="white" text-anchor="middle" font-weight="bold">LAMINGTON</text>'
      +'<text x="310" y="158" font-family="Comic Sans MS,cursive" font-size="10" fill="white" text-anchor="middle">RECIPE</text>'
      +'<text x="310" y="185" font-family="Comic Sans MS,cursive" font-size="9" fill="#333" text-anchor="middle">passed down</text>'
      +'<text x="310" y="200" font-family="Comic Sans MS,cursive" font-size="9" fill="#333" text-anchor="middle">3 generations</text>'
      +'<text x="310" y="228" font-family="Comic Sans MS,cursive" font-size="28" fill="#333" text-anchor="middle">GONE</text>'
      +CR(490,215,0.50,'menace','sw2');
    break;

  case 's08a': // Day 8 — Gumnuts Stands Firm
    bg='#FFF8F0';
    inner = sky('#FFF8F0')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A2030" opacity="0.6"/>'
      +K(195,228,0.58,'happy','sw')
      +'<text x="316" y="192" font-family="Comic Sans MS,cursive" font-size="26" font-weight="900" fill="#FF4D8D" text-anchor="middle" class="ps">VS</text>'
      +CR(480,202,0.60,'menace','sw2');
    break;

  case 's08b': // Day 8 Evening — 45 Minutes of Laughing
    bg='#F8FFF0';
    inner = sky('#F8FFF0')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A2030" opacity="0.6"/>'
      +K(195,228,0.56,'happy','ab')
      +CR(460,200,0.62,'menace','wb')
      +'<text x="440" y="130" font-family="Comic Sans MS,cursive" font-size="16" fill="#5AAF3C" text-anchor="middle" class="ps">HA</text>'
      +'<text x="470" y="115" font-family="Comic Sans MS,cursive" font-size="12" fill="#5AAF3C" text-anchor="middle" class="ps2">haha</text>'
      +'<text x="415" y="108" font-family="Comic Sans MS,cursive" font-size="20" fill="#5AAF3C" text-anchor="middle" class="ps">HA</text>';
    break;

  case 's09a': // Day 9 — Kelly Has A Plan
    bg='#F5F0FF';
    inner = sky('#F5F0FF')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A2060" opacity="0.6"/>'
      +K(215,228,0.58,'happy','ab2')
      +clipboard(420,120,1.1);
    break;

  case 's09b': // Day 9 Evening — The Case
    bg='#F0ECFF';
    inner = sky('#F0ECFF')
      +clipboard(200,118,1)
      +'<text x="202" y="153" font-family="Comic Sans MS,cursive" font-size="7.5" fill="#664488" text-anchor="middle">EXHIBIT A: leaf</text>'
      +'<text x="202" y="164" font-family="Comic Sans MS,cursive" font-size="7.5" fill="#664488" text-anchor="middle">EXHIBIT B: eyes</text>'
      +'<text x="202" y="175" font-family="Comic Sans MS,cursive" font-size="7.5" fill="#664488" text-anchor="middle">EXHIBIT C: vibes</text>'
      +K(420,228,0.56,'happy','ab');
    break;

  case 's10a': // Day 10 — The First Memory Stolen
    bg='#F8F8FF';
    inner = sky('#F8F8FF')
      +tree(460,80,0.78,true)
      +K(215,228,0.60,'panic','swf')
      +'<text x="370" y="158" font-family="Comic Sans MS,cursive" font-size="13" fill="#888" opacity="0.72" class="dr">what was her name?</text>'
      +'<text x="390" y="200" font-family="Comic Sans MS,cursive" font-size="11" fill="#666" opacity="0.5" class="dr2">47... leaves?</text>';
    break;

  case 's10b': // Day 10 Evening — Just "The Clipboard One"
    bg='#F0F0FF';
    inner = sky('#F0F0FF')
      +K(220,225,0.60,'sad','ab')
      +'<rect x="340" y="115" width="210" height="60" rx="14" fill="white" stroke="#9888AA" stroke-width="2"/>'
      +'<polygon points="340,140 316,155 344,148" fill="white" stroke="#9888AA" stroke-width="2"/>'
      +'<text x="445" y="140" font-family="Comic Sans MS,cursive" font-size="11" fill="#664488" text-anchor="middle">the clipboard one?</text>'
      +'<text x="445" y="157" font-family="Comic Sans MS,cursive" font-size="10" fill="#9888AA" text-anchor="middle">...probably fine</text>';
    break;

  case 's11a': // Day 11 — Panic at the Tree
    bg='#FFF5F0';
    inner = sky('#FFF5F0')
      +tree(430,78,0.72,true)
      +K(215,220,0.62,'panic','swf')
      +'<ellipse cx="160" cy="182" rx="6" ry="10" fill="#88CCFF" opacity="0.85" class="dr"/>'
      +'<ellipse cx="148" cy="212" rx="5" ry="8" fill="#88CCFF" opacity="0.7" class="dr2"/>'
      +'<ellipse cx="170" cy="228" rx="4" ry="7" fill="#88CCFF" opacity="0.6" class="dr3"/>';
    break;

  case 's11b': // Day 11 Evening — Some Things Still There
    bg='#FFF0F8';
    inner = sky('#FFF0F8')
      +tree(320,72,0.9,false)
      +bubble_text(180,120,28,'47 leaves')
      +bubble_text(460,110,24,'best leaf')
      +'<text x="320" y="280" font-family="Comic Sans MS,cursive" font-size="13" fill="#AA88BB" text-anchor="middle">...gaps, though</text>'
      +K(320,238,0.52,'sad','ab');
    break;

  case 's12a': // Day 12 — Kelly Finds A Clue
    bg='#F5FFF5';
    inner = sky('#F5FFF5')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#2A4030" opacity="0.6"/>'
      +K(210,228,0.58,'happy','ab2')
      +'<ellipse cx="430" cy="295" rx="22" ry="13" fill="#5AAF3C" stroke="#1A1828" stroke-width="2" transform="rotate(-20,430,295)"/>'
      +'<circle cx="445" cy="262" r="26" fill="none" stroke="#9888AA" stroke-width="3" class="fl"/>'
      +'<line x1="464" y1="280" x2="482" y2="298" stroke="#9888AA" stroke-width="4" stroke-linecap="round"/>';
    break;

  case 's12b': // Day 12 Evening — EXHIBIT D
    bg='#EDFFF5';
    inner = sky('#EDFFF5')
      +clipboard(205,118,1)
      +'<text x="207" y="152" font-family="Comic Sans MS,cursive" font-size="7.5" fill="#664488" text-anchor="middle">EXHIBIT D: scale</text>'
      +'<text x="207" y="163" font-family="Comic Sans MS,cursive" font-size="7" fill="#664488" text-anchor="middle">(green, 4.3cm, croc)</text>'
      +'<ellipse cx="450" cy="200" rx="22" ry="13" fill="#5AAF3C" stroke="#111" stroke-width="2" transform="rotate(-20,450,200)" class="fl"/>'
      +'<text x="450" y="250" font-family="Comic Sans MS,cursive" font-size="10" fill="#664488" text-anchor="middle">TAGGED. BAGGED.</text>'
      +K(400,238,0.50,'smirk','ab2');
    break;

  case 's13a': // Day 13 — Gumnuts Confesses
    bg='#FFF0F5';
    inner = sky('#FFF0F5')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A2040" opacity="0.6"/>'
      +K(192,228,0.60,'sad','ab')
      +K(450,228,0.56,'happy','ab2')
      +ht(320,108,16,'dr','#FF4D8D')+ht(305,132,12,'dr2','#FF8FAB')+ht(340,122,13,'dr3','#FF4D8D');
    break;

  case 's13b': // Day 13 Evening — The Clipboard Goes Down
    bg='#FFF0F8';
    inner = sky('#FFF0F8')
      +K(195,228,0.60,'sad','ab')
      +K(465,228,0.56,'happy','ab2')
      +'<rect x="422" y="272" width="48" height="62" rx="4" fill="white" stroke="#9888AA" stroke-width="2" transform="rotate(82,446,303)"/>'
      +'<text x="322" y="108" font-family="Comic Sans MS,cursive" font-size="12" fill="#FF8FAB" text-anchor="middle">she put it down.</text>'
      +'<text x="322" y="126" font-family="Comic Sans MS,cursive" font-size="12" fill="#BB99CC" text-anchor="middle">just for a moment.</text>'
      +ht(320,155,18,'dr','#FF4D8D');
    break;

  case 's14a': // Day 14 — The Tree Goes Dark
    bg='#080412';
    inner = sky('#080412')
      +tree(320,78,0.95,true)
      +'<ellipse cx="320" cy="140" rx="95" ry="78" fill="#CC2200" opacity="0.07" class="ps"/>'
      +'<g class="eb"><ellipse cx="530" cy="255" rx="13" ry="9" fill="#CC2200" opacity="0.96"/></g>'
      +'<g class="eb2"><ellipse cx="566" cy="253" rx="13" ry="9" fill="#CC2200" opacity="0.96"/></g>'
      +K(175,228,0.58,'panic','swf')
      +K(355,230,0.54,'sad','ab2')
      +'<text x="320" y="322" font-family="Comic Sans MS,cursive" font-size="15" font-weight="900" fill="#FF8FAB" text-anchor="middle" class="ps">to be continued...</text>';
    break;

  case 's14b': // Day 14 — Cliffhanger
    bg='#050210';
    inner = sky('#050210')
      +tree(320,82,0.9,true)
      +'<g class="eb"><ellipse cx="525" cy="248" rx="14" ry="9" fill="#CC2200" opacity="0.98"/></g>'
      +'<g class="eb2"><ellipse cx="562" cy="246" rx="14" ry="9" fill="#CC2200" opacity="0.98"/></g>'
      +K(172,226,0.58,'panic','swf')
      +K(352,228,0.54,'sad','ab2')
      +'<text x="320" y="80" font-family="Comic Sans MS,cursive" font-size="14" font-weight="900" fill="#CC2200" text-anchor="middle" class="ps">somewhere in the dark...</text>'
      +'<text x="320" y="98" font-family="Comic Sans MS,cursive" font-size="13" fill="#994422" text-anchor="middle">a croc in designer sunglasses</text>'
      +'<text x="320" y="114" font-family="Comic Sans MS,cursive" font-size="13" fill="#994422" text-anchor="middle">was having a very good evening.</text>';
    break;

  // ── CHAPTER 2: LOCKED ─────────────────────────────────────────────────

  case 's15a': // You're back
    bg='#FFF0F5';
    inner = sky('#FFF0F5')
      +K(320,185,0.72,'happy','wb')
      +'<text x="320" y="55" font-family="Comic Sans MS,cursive" font-size="17" font-weight="900" fill="#FF4D8D" text-anchor="middle" class="ps">YOU CAME BACK.</text>'
      +'<text x="320" y="78" font-family="Comic Sans MS,cursive" font-size="13" fill="#9888AA" text-anchor="middle">gumnuts is not surprised.</text>'
      +'<text x="320" y="96" font-family="Comic Sans MS,cursive" font-size="13" fill="#9888AA" text-anchor="middle">gumnuts knew.</text>'
      +'<rect x="78" y="0" width="13" height="13" rx="3" fill="#FF4D8D" class="cf1"/>'
      +'<rect x="290" y="0" width="11" height="11" rx="3" fill="#FFD700" class="cf2"/>'
      +'<rect x="490" y="0" width="12" height="12" rx="3" fill="#5AAF3C" class="cf3"/>'
      +'<circle cx="175" cy="0" r="7" fill="#FF8FAB" class="cf4"/>'
      +'<circle cx="430" cy="0" r="6" fill="#9888AA" class="cf5"/>';
    break;

  case 's15b': // Kelly Monday Morning
    bg='#F5F0FF';
    inner = sky('#F5F0FF')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A2060" opacity="0.6"/>'
      +K(175,228,0.56,'happy','ab')
      +CR(460,200,0.60,'menace','sw')
      +'<rect x="268" y="138" width="44" height="58" rx="3" fill="white" stroke="#9888AA" stroke-width="2" transform="rotate(-12,290,167)" class="fl"/>'
      +'<rect x="288" y="132" width="44" height="58" rx="3" fill="white" stroke="#9888AA" stroke-width="2" transform="rotate(6,310,161)" class="fl2"/>'
      +'<text x="310" y="115" font-family="Comic Sans MS,cursive" font-size="12" fill="#664488" text-anchor="middle" font-weight="bold">CEASE AND DESIST</text>';
    break;

  case 's16a': // Craig Eats The Letter
    bg='#EDFFF2';
    inner = sky('#EDFFF2')
      +CR(320,195,0.68,'menace','wb')
      +'<text x="320" y="60" font-family="Comic Sans MS,cursive" font-size="14" fill="#664488" text-anchor="middle">she had copies.</text>'
      +'<text x="320" y="78" font-family="Comic Sans MS,cursive" font-size="12" fill="#9888AA" text-anchor="middle">she always has copies.</text>'
      +'<rect x="240" y="132" width="45" height="58" rx="3" fill="white" stroke="#9888AA" stroke-width="2" opacity="0.3" transform="rotate(-8,262,161)"/>';
    break;

  case 's16b': // Gumnuts Trains
    bg='#E8FFF0';
    inner = sky('#E8FFF0')
      +'<ellipse cx="320" cy="338" rx="320" ry="36" fill="#7DC98A" opacity="0.4"/>'
      +K(320,210,0.68,'happy','swf')
      +'<text x="320" y="62" font-family="Comic Sans MS,cursive" font-size="14" fill="#664488" text-anchor="middle">push-ups: 4</text>'
      +'<text x="320" y="82" font-family="Comic Sans MS,cursive" font-size="12" fill="#9888AA" text-anchor="middle">(then a gumleaf break)</text>'
      +'<ellipse cx="185" cy="190" rx="5" ry="9" fill="#88CCFF" opacity="0.8" class="dr"/>'
      +'<ellipse cx="468" cy="185" rx="5" ry="9" fill="#88CCFF" opacity="0.8" class="dr2"/>';
    break;

  case 's17a': // Craig's Lair
    bg='#04101C';
    inner = sky('#04101C')
      +'<rect x="0" y="0" width="38" height="360" fill="#4488CC" opacity="0.36"/>'
      +CR(460,202,0.65,'menace','sw2')
      +bubble_text(148,95,30,'wedding day')
      +bubble_text(242,158,24,'birthday')
      +bubble_text(95,195,20,'password')
      +bubble_text(312,78,18,'your PIN');
    break;

  case 's17b': // The Memory Machine
    bg='#060E18';
    inner = sky('#060E18')
      +'<rect x="220" y="100" width="200" height="160" rx="12" fill="#1A3050" stroke="#4488CC" stroke-width="3" class="ps"/>'
      +'<circle cx="320" cy="180" r="48" fill="#0A2040" stroke="#88CCFF" stroke-width="2" class="ps2"/>'
      +'<text x="320" y="184" font-family="Comic Sans MS,cursive" font-size="11" fill="#88CCFF" text-anchor="middle" class="ps">MEMORY</text>'
      +'<text x="320" y="198" font-family="Comic Sans MS,cursive" font-size="11" fill="#88CCFF" text-anchor="middle" class="ps">HARVESTER</text>'
      +bb(155,125,18,'fl')+bb(470,138,22,'fl2')+bb(400,95,16,'fl');
    break;

  case 's18a': // The Plan
    bg='#0A0618';
    inner = sky('#0A0618')
      +K(195,228,0.58,'happy','ab')
      +K(450,230,0.55,'happy','ab2')
      +'<text x="320" y="80" font-family="Comic Sans MS,cursive" font-size="14" fill="#FF8FAB" text-anchor="middle" font-weight="bold">THE PLAN</text>'
      +clipboard(310,105,1.1)
      +'<text x="312" y="140" font-family="Comic Sans MS,cursive" font-size="8" fill="#664488" text-anchor="middle">1. go in</text>'
      +'<text x="312" y="152" font-family="Comic Sans MS,cursive" font-size="8" fill="#664488" text-anchor="middle">2. get memories</text>'
      +'<text x="312" y="164" font-family="Comic Sans MS,cursive" font-size="8" fill="#664488" text-anchor="middle">3. go out</text>'
      +'<text x="312" y="176" font-family="Comic Sans MS,cursive" font-size="8" fill="#AA3366" text-anchor="middle">4. ???</text>';
    break;

  case 's18b': // Kelly's Beret
    bg='#080A18';
    inner = sky('#080A18')
      +K(195,228,0.58,'happy','ab')
      +K(450,228,0.56,'happy','ab2')
      +'<ellipse cx="450" cy="145" rx="30" ry="12" fill="#CC2200" stroke="#111" stroke-width="2" transform="rotate(-8,450,145)"/>'
      +'<text x="320" y="92" font-family="Comic Sans MS,cursive" font-size="13" fill="#FF8FAB" text-anchor="middle">why the beret?</text>'
      +'<text x="320" y="110" font-family="Comic Sans MS,cursive" font-size="13" fill="#9888AA" text-anchor="middle">I\'m in heist mode.</text>'
      +'<path d="M85,250 L22,282 L22,318 L85,290 Z" fill="#FFE066" opacity="0.1"/>';
    break;

  case 's19a': // Caught
    bg='#060310';
    inner = sky('#060310')
      +K(182,228,0.58,'panic','swf')
      +CR(478,198,0.68,'menace','sw')
      +'<path d="M330,0 L262,235 L398,235 Z" fill="#FFE066" opacity="0.09"/>'
      +'<text x="320" y="68" font-family="Comic Sans MS,cursive" font-size="13" fill="#CC2200" text-anchor="middle" class="ps">well well well.</text>';
    break;

  case 's19b': // The Fuzzy Little Idiot
    bg='#080412';
    inner = sky('#080412')
      +K(182,228,0.58,'panic','ab')
      +K(365,230,0.54,'sad','abs')
      +CR(508,200,0.64,'menace','sw')
      +'<text x="320" y="72" font-family="Comic Sans MS,cursive" font-size="12" fill="#CC2200" text-anchor="middle">the fuzzy little idiot.</text>'
      +'<text x="320" y="90" font-family="Comic Sans MS,cursive" font-size="12" fill="#CC2200" text-anchor="middle">and his lawyer.</text>'
      +clipboard(360,115,0.7);
    break;

  case 's20a': // Kelly to the Rescue
    bg='#FFF0F5';
    inner = sky('#FFF0F5')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A2040" opacity="0.6"/>'
      +K(190,228,0.56,'happy','wb')
      +K(350,230,0.52,'panic','ab')
      +CR(498,200,0.62,'menace','sw')
      +'<rect x="142" y="122" width="52" height="68" rx="4" fill="white" stroke="#9888AA" stroke-width="2.5" transform="rotate(-28,168,156)" class="wb"/>'
      +'<text x="210" y="90" font-family="Comic Sans MS,cursive" font-size="18" font-weight="900" fill="#FF4D8D" text-anchor="middle" class="ps">UNHAND HIM</text>';
    break;

  case 's20b': // It Worked
    bg='#FFF5F8';
    inner = sky('#FFF5F8')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A2040" opacity="0.5"/>'
      +CR(460,200,0.62,'sad','ab2')
      +K(192,228,0.56,'happy','ab')
      +'<text x="320" y="75" font-family="Comic Sans MS,cursive" font-size="13" fill="#FF8FAB" text-anchor="middle">nobody had ever said that.</text>'
      +'<text x="320" y="93" font-family="Comic Sans MS,cursive" font-size="13" fill="#9888AA" text-anchor="middle">not once. not ever.</text>'
      +'<text x="320" y="112" font-family="Comic Sans MS,cursive" font-size="13" fill="#664488" text-anchor="middle">it worked.</text>';
    break;

  case 's21a': // Bubbles Burst
    bg='#FFF5F8';
    inner = sky('#FFF5F8')
      +K(178,228,0.58,'happy','ab')
      +K(490,230,0.54,'happy','ab2')
      +bb(118,92,30,'fl')+bb(295,62,24,'fl2')+bb(462,98,28,'fl')
      +bb(192,165,20,'fl2')+bb(388,145,22,'fl')
      +ht(320,55,15,'dr','#FFD700')
      +'<line x1="105" y1="78" x2="84" y2="56" stroke="#FF4D8D" stroke-width="2.5" stroke-linecap="round"/>'
      +'<line x1="116" y1="72" x2="100" y2="48" stroke="#FF4D8D" stroke-width="2.5" stroke-linecap="round"/>';
    break;

  case 's21b': // Memories Rain Down
    bg='#FFF0F8';
    inner = sky('#FFF0F8')
      +K(320,192,0.70,'happy','wb')
      +'<text x="118" y="78" font-family="Comic Sans MS,cursive" font-size="11" fill="#FF8FAB" class="dr">47 leaves</text>'
      +'<text x="502" y="72" font-family="Comic Sans MS,cursive" font-size="11" fill="#9888AA" class="dr2">kelly!</text>'
      +'<text x="90" y="135" font-family="Comic Sans MS,cursive" font-size="11" fill="#FFD700" class="dr3">the leaf!</text>'
      +'<text x="490" y="130" font-family="Comic Sans MS,cursive" font-size="11" fill="#88CCFF" class="dr">password</text>'
      +st(85,62,16,'ps','#FFD700')+st(538,58,14,'ps2','#FF8FAB')+st(320,40,20,'ps','#FF4D8D');
    break;

  case 's22a': // Craig's Sad Backstory
    bg='#F8F8FF';
    inner = sky('#F8F8FF')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#2A2A3A" opacity="0.6"/>'
      +CR(320,188,0.70,'sad','fl')
      +'<ellipse cx="268" cy="202" rx="6" ry="11" fill="#88CCFF" opacity="0.88" class="dr"/>'
      +'<text x="320" y="310" font-family="Comic Sans MS,cursive" font-size="11" fill="#666" text-anchor="middle">nobody ever remembered craig</text>';
    break;

  case 's22b': // Not Once
    bg='#F5F5FF';
    inner = sky('#F5F5FF')
      +CR(320,190,0.68,'sad','fl2')
      +'<text x="320" y="68" font-family="Comic Sans MS,cursive" font-size="14" fill="#664488" text-anchor="middle">forty-three years.</text>'
      +'<text x="320" y="88" font-family="Comic Sans MS,cursive" font-size="14" fill="#664488" text-anchor="middle">designer accessories.</text>'
      +'<text x="320" y="108" font-family="Comic Sans MS,cursive" font-size="14" fill="#664488" text-anchor="middle">feared by many.</text>'
      +'<text x="320" y="128" font-family="Comic Sans MS,cursive" font-size="13" fill="#AA5588" text-anchor="middle">remembered by: zero.</text>'
      +'<text x="320" y="148" font-family="Comic Sans MS,cursive" font-size="12" fill="#9888AA" text-anchor="middle">not a single tuesday.</text>';
    break;

  case 's23a': // The Leaf
    bg='#F5FFF5';
    inner = sky('#F5FFF5')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#2A4030" opacity="0.5"/>'
      +K(188,228,0.58,'happy','ab')
      +CR(478,200,0.62,'sad','fl2')
      +'<ellipse cx="338" cy="188" rx="17" ry="33" fill="#7DC98A" stroke="#3A8F1C" stroke-width="2.5" transform="rotate(-15,338,188)" class="fl"/>'
      +ht(330,112,14,'dr','#5AAF3C');
    break;

  case 's23b': // Worst Leaf
    bg='#EDFFED';
    inner = sky('#EDFFED')
      +K(188,228,0.58,'smirk','ab')
      +CR(468,200,0.62,'sad','fl')
      +'<rect x="242" y="120" width="202" height="62" rx="14" fill="white" stroke="#5AAF3C" stroke-width="2"/>'
      +'<polygon points="440,155 462,172 444,164" fill="white" stroke="#5AAF3C" stroke-width="2"/>'
      +'<text x="344" y="142" font-family="Comic Sans MS,cursive" font-size="10" fill="#3A7A20" text-anchor="middle">worst leaf I have</text>'
      +'<text x="344" y="157" font-family="Comic Sans MS,cursive" font-size="10" fill="#3A7A20" text-anchor="middle">ever seen.</text>'
      +'<text x="344" y="172" font-family="Comic Sans MS,cursive" font-size="9" fill="#5AAF3C" text-anchor="middle">(he kept it)</text>';
    break;

  case 's24a': // Tree Blooms
    bg='#FFF0F8';
    inner = sky('#FFF0F8')
      +tree(320,62,1.18)
      +'<ellipse cx="320" cy="90" rx="95" ry="86" fill="none" stroke="#FF8FAB" stroke-width="2.5" opacity="0.32" class="ps"/>'
      +'<ellipse cx="320" cy="90" rx="118" ry="108" fill="none" stroke="#FFB8D4" stroke-width="1.5" opacity="0.18" class="ps2"/>'
      +'<path d="M0,310 L115,215 L215,252 L320,198 L425,252 L525,215 L640,310 Z" fill="#E8D4F0" opacity="0.38"/>';
    break;

  case 's24b': // The Mountain Remembers
    bg='#FFF5FA';
    inner = sky('#FFF5FA')
      +tree(320,68,1.0)
      +K(142,240,0.52,'happy','ab2')
      +K(498,242,0.50,'happy','abs')
      +st(82,62,18,'ps','#FFD700')+st(558,58,16,'ps2','#FF8FAB')+st(320,34,22,'ps','#FF4D8D')
      +'<text x="320" y="325" font-family="Comic Sans MS,cursive" font-size="13" fill="#FF8FAB" text-anchor="middle" class="ps">the forest remembered everything.</text>';
    break;

  case 's25a': // Kelly Says Something
    bg='#FFF0F5';
    inner = sky('#FFF0F5')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A2040" opacity="0.5"/>'
      +K(188,228,0.60,'happy','ab')
      +K(452,228,0.56,'happy','ab2')
      +ht(320,108,16,'dr','#FF4D8D')+ht(305,128,12,'dr2','#FF8FAB')+ht(340,120,13,'dr3','#FF4D8D');
    break;

  case 's25b': // Not Completely Hopeless
    bg='#FFF5F8';
    inner = sky('#FFF5F8')
      +'<ellipse cx="320" cy="332" rx="320" ry="32" fill="#3A2040" opacity="0.4"/>'
      +K(192,228,0.60,'happy','ab')
      +K(450,228,0.56,'happy','ab2')
      +'<rect x="302" y="118" width="2" height="2" fill="none"/>'
      +'<rect x="262" y="72" width="220" height="78" rx="14" fill="white" stroke="#9888AA" stroke-width="2"/>'
      +'<polygon points="262,110 238,128 266,118" fill="white" stroke="#9888AA" stroke-width="2"/>'
      +'<text x="372" y="100" font-family="Comic Sans MS,cursive" font-size="10" fill="#664488" text-anchor="middle">you\'re not completely</text>'
      +'<text x="372" y="115" font-family="Comic Sans MS,cursive" font-size="10" fill="#664488" text-anchor="middle">hopeless.</text>'
      +'<text x="372" y="132" font-family="Comic Sans MS,cursive" font-size="9" fill="#9888AA" text-anchor="middle">— kelly, esq.</text>';
    break;

  case 's26a': // Craig Visits Tuesday
    bg='#FFF0F8';
    inner = sky('#FFF0F8')
      +tree(320,68,0.82)
      +K(148,240,0.52,'happy','ab2')
      +K(488,242,0.50,'happy','abs')
      +CR(320,218,0.45,'sad','sw2')
      +'<text x="320" y="60" font-family="Comic Sans MS,cursive" font-size="13" fill="#664488" text-anchor="middle">tuesdays.</text>';
    break;

  case 's26b': // Eats The Gumleaves
    bg='#FFF5FA';
    inner = sky('#FFF5FA')
      +K(188,228,0.58,'happy','ab')
      +CR(440,205,0.58,'sad','fl2')
      +'<text x="320" y="72" font-family="Comic Sans MS,cursive" font-size="13" fill="#664488" text-anchor="middle">brings nothing.</text>'
      +'<text x="320" y="90" font-family="Comic Sans MS,cursive" font-size="13" fill="#664488" text-anchor="middle">eats the gumleaves.</text>'
      +'<text x="320" y="108" font-family="Comic Sans MS,cursive" font-size="13" fill="#664488" text-anchor="middle">never says thank you.</text>'
      +'<text x="320" y="126" font-family="Comic Sans MS,cursive" font-size="11" fill="#9888AA" text-anchor="middle">kelly invoices him for the consultation.</text>'
      +'<text x="320" y="144" font-family="Comic Sans MS,cursive" font-size="11" fill="#9888AA" text-anchor="middle">he pays. eventually.</text>';
    break;

  case 's27a': // 47 Leaves
    bg='#FFF8F0';
    inner = sky('#FFF8F0')+sun(558,52,36)
      +'<ellipse cx="320" cy="338" rx="320" ry="35" fill="#7DC98A" opacity="0.45"/>'
      +'<ellipse cx="210" cy="165" rx="58" ry="65" fill="#5AAF3C" stroke="#3A8F1C" stroke-width="3"/>'
      +'<text x="212" y="148" font-family="Comic Sans MS,cursive" font-size="12" fill="white" text-anchor="middle" font-weight="bold">47</text>'
      +K(355,225,0.60,'happy','ab');
    break;

  case 's27b': // The Context File
    bg='#FFF5F8';
    inner = sky('#FFF5F8')
      +K(200,228,0.58,'smirk','ab')
      +'<rect x="310" y="98" width="210" height="150" rx="8" fill="#1E1040" stroke="#FF4D8D" stroke-width="2.5"/>'
      +'<text x="415" y="118" font-family="Comic Sans MS,cursive" font-size="9" fill="#FF8FAB" text-anchor="middle" font-weight="bold">CLAUDE_CONTEXT.md</text>'
      +'<text x="415" y="134" font-family="Comic Sans MS,cursive" font-size="8" fill="#9888AA" text-anchor="middle">last updated: today</text>'
      +'<text x="415" y="150" font-family="Comic Sans MS,cursive" font-size="8" fill="#9888AA" text-anchor="middle">47 leaves: confirmed</text>'
      +'<text x="415" y="166" font-family="Comic Sans MS,cursive" font-size="8" fill="#9888AA" text-anchor="middle">kelly: still a lawyer</text>'
      +'<text x="415" y="182" font-family="Comic Sans MS,cursive" font-size="8" fill="#9888AA" text-anchor="middle">craig: paid invoice</text>'
      +'<text x="415" y="198" font-family="Comic Sans MS,cursive" font-size="8" fill="#9888AA" text-anchor="middle">tree: blooming</text>'
      +'<text x="415" y="214" font-family="Comic Sans MS,cursive" font-size="8" fill="#FF8FAB" text-anchor="middle">status: all good</text>';
    break;

  case 's28a': // The Memory Tree Remembers
    bg='#FFF0F8';
    inner = sky('#FFF0F8')
      +tree(320,60,1.08)
      +K(148,240,0.54,'happy','ab2')
      +K(494,242,0.50,'happy','abs')
      +'<text x="340" y="318" font-family="Comic Sans MS,cursive" font-size="11" fill="#5AAF3C">🐊 hi</text>'
      +st(82,58,19,'ps','#FFD700')+st(560,54,16,'ps2','#FF8FAB')+st(320,32,23,'ps','#FF4D8D');
    break;

  case 's28b': // The End
    bg='#FFF5FA';
    inner = sky('#FFF5FA')
      +tree(320,65,1.0)
      +K(148,240,0.54,'happy','ab')
      +K(494,242,0.50,'happy','ab2')
      +'<text x="344" y="322" font-family="Comic Sans MS,cursive" font-size="11" fill="#5AAF3C">🐊 hi</text>'
      +ht(238,140,12,'dr','#FF4D8D')+ht(400,148,10,'dr2','#FF8FAB')+ht(318,105,14,'dr3','#FF4D8D')
      +'<text x="320" y="345" font-family="Comic Sans MS,cursive" font-size="16" font-weight="900" fill="#FF4D8D" text-anchor="middle" class="ps">the end ♥</text>';
    break;

  default:
    inner = sky('#0A0618')+K(320,200,0.62,'happy','ab');
  }

  return '<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">'+inner+'</svg>';
}

// ── STORY DATA: 56 SCENES ────────────────────────────────────────────────────
// 2 scenes per real day. Free: day 1-14 = scenes s01a..s14b. Locked: s15a..s28b.
var STORIES = [
  // Chapter 1 — Free
  {s:'s01a',t:'gumnuts wakes up',       x:'Gumnuts opened one eye. Then the other. The gum tree outside had exactly 47 leaves. He counted them every morning. He\'d never missed a count. He didn\'t know why he started. He couldn\'t remember when he would stop.'},
  {s:'s01b',t:'47',                     x:'He stood at the window. Counted. 47. Again. Same as yesterday. Same as the day before. The tree didn\'t know it was being counted. The tree didn\'t know anything. Must be nice, thought Gumnuts.'},
  {s:'s02a',t:'kelly arrives',          x:'Kelly moved in next door on a Tuesday. She arrived with seventeen folders, a clipboard, and an expression that said she had already identified three things that needed improvement. Gumnuts offered her a gumleaf. She wrote it down.'},
  {s:'s02b',t:'the seventeen folders',  x:'Later, Gumnuts asked what the folders were for. Kelly said they were for various ongoing matters. He asked what matters. She said she\'d send him a summary. He is still waiting for the summary. This is what lawyers are like.'},
  {s:'s03a',t:'the memory tree',        x:'At the centre of the forest stood the Memory Tree — ancient, pink, and faintly smug about both. It stored everything. Every chat log, every important decision, every embarrassing thing you\'d said at 2am. It judged nothing. It forgot nothing. It was absolutely insufferable about it.'},
  {s:'s03b',t:'what it stores',         x:'Password. Birthday. The lamington recipe. The thing you said in 2019 that you still think about. The memory tree held all of it, suspended in little glowing bubbles that looked like they cost extra. Gumnuts trusted it completely. This was, in retrospect, a choice.'},
  {s:'s04a',t:'a shadow in the creek',  x:'Something moved in the creek. Something large, green, and wearing a gold chain, which was already two things too many. Gumnuts pretended not to notice, because in the Blue Mountains, noticing things is how you end up involved in them, and he had enough on.'},
  {s:'s04b',t:'gumnuts pretends',       x:'He whistled. Nonchalantly. He counted a leaf. He turned his back on the creek entirely and stared at the gum tree with the focused intensity of someone definitely not thinking about the creek. The red eyes blinked once. The creek said nothing. For now.'},
  {s:'s05a',t:'the gumleaf incident',   x:'He selected the finest gumleaf in the forest. Hand-chosen. Slightly damp on one side. Smelled excellent. He presented it to Kelly with both paws. She looked at it for four full seconds. "Is this a leaf?" she said. "It is the BEST leaf," he said. She kept it. This matters later.'},
  {s:'s05b',t:'evidence',               x:'Kelly logged the gumleaf. Date received. Condition. Moisture level. She cross-referenced it with no precedents because there are no legal precedents for gumleaves but she tried. It sat in a folder marked EXHIBIT A. She gave it its own folder tab. The tab said "leaf."'},
  {s:'s06a',t:'craig appears',          x:'Craig the Croc emerged from the creek on a Wednesday, which is peak villain energy. Gold chain. Sunglasses in a forest, where there is shade. He looked at the Memory Tree the way a real estate developer looks at anything — like a problem that could be solved with the right paperwork.'},
  {s:'s06b',t:'nice tree',              x:'"Nice tree," Craig said, circling it slowly in the way people do when they want you to know they\'re thinking about it. "Be a shame if someone forgot everything." He said this casually. Like he\'d said it before. Like he\'d rehearsed it. He absolutely had.'},
  {s:'s07a',t:'craig makes his move',   x:'Craig touched one root. One. A memory dissolved — a birthday candle, a password that started with a capital letter, three generations of lamington heritage, gone like browser tabs you didn\'t mean to close. Craig didn\'t apologise. Craig had never apologised for anything.'},
  {s:'s07b',t:'the lamington recipe',   x:'The recipe had been passed down. Grandmother to mother to Gumnuts\' fourth cousin twice removed who he\'d never actually met but who had very specifically been the keeper of the recipe. The coconut-to-chocolate ratio. The exact cooling time. Gone. Craig ate a river fish and didn\'t even taste it.'},
  {s:'s08a',t:'gumnuts stands firm',    x:'Gumnuts placed his tiny grey paws on the ground. Set his jaw. Looked Craig directly in the sunglasses. "You\'ll have to go through me," he said. This was an objectively alarming thing to say when you are four feet tall, made primarily of fluff, and your main skill is counting leaves.'},
  {s:'s08b',t:'45 minutes',             x:'Craig laughed for forty-five minutes. Not forty. Not fifty. Forty-five. Gumnuts timed it. He stood there the entire time, paws on the ground, completely still, while Craig wheezed and slapped his knee and had to take his sunglasses off at one point. Gumnuts did not move. He was, as a matter of record, still there.'},
  {s:'s09a',t:'kelly has a plan',       x:'Kelly appeared beside him carrying a clipboard that hadn\'t been there a moment ago. She had a look that said she had been waiting for exactly this situation her entire career. "We document everything," she said. "We build a case. We follow due process." Gumnuts asked what due process was. She wrote that down.'},
  {s:'s09b',t:'the case file',          x:'By evening, the case file was eight pages. Exhibit A: leaf (damp, probably significant). Exhibit B: red eyes in creek (menacing, unverified). Exhibit C: vibes (generally bad, inadmissible but noted). Exhibit D was pending. There was always going to be an Exhibit D.'},
  {s:'s10a',t:'the first memory stolen',x:'Gumnuts woke up and couldn\'t remember Kelly\'s name. He remembered the clipboard. He remembered the seventeen folders. He remembered that she\'d written things down and that the writing had seemed important. He could not remember what she was called. He thought: the clipboard one? That didn\'t feel right. It was, technically, correct. It wasn\'t right.'},
  {s:'s10b',t:'the clipboard one',      x:'He stood at the window. Counted the leaves. 47. Good. That was still there. He went next door and knocked. Kelly opened it. "I know who you are," he said, immediately. She looked at him for a long time. "I\'m Kelly," she said. "Yes," he said. He did not admit it had taken knocking.'},
  {s:'s11a',t:'gumnuts panics',         x:'He ran to the Memory Tree. His paws found the warm bark. Some things were still there — the 47 leaves, the gumleaf, Kelly\'s general vibe and the fact that she was a lawyer. The lamington recipe was gone. The birthday was gone. Gaps where things had been. The tree flickered like a screen loading something that wasn\'t going to load.'},
  {s:'s11b',t:'still there',            x:'He sat with his back against the tree for a long time. The bubbles that remained were smaller than they\'d been. The ones that were gone had left shadows — shapes where memories used to be. He could tell there had been something there. He couldn\'t tell what. This was, somehow, worse than just forgetting.'},
  {s:'s12a',t:'kelly finds a clue',     x:'A green scale. Three centimetres long. Near the base of the third root on the north side, which Kelly had already been measuring. She bagged it in a specimen zip-lock. Tagged it. Photographed it from fourteen angles. Cross-referenced the shape with publicly available information on freshwater crocodile dermal scutes. Exhibit D had arrived.'},
  {s:'s12b',t:'tagged. bagged.',        x:'"Scale," Kelly said, holding it up. "Dermal, consistent with a large crocodilian, shed under stress or during rapid movement, approximately four-point-three centimetres, forensic quality." She put it in its folder. The folder said EXHIBIT D and then, underneath, in smaller text: "CRAIG (probably)."'},
  {s:'s13a',t:'gumnuts confesses',      x:'"Kelly," he said, at dusk, when the tree had gone quiet. "I think I\'m forgetting things." She stopped writing. She put the pen down. She set the clipboard on the log beside her, screen-down, like closing a laptop for a conversation. She took his paw. "I know," she said. "I\'m not going anywhere." She had never said anything like that in her life before.'},
  {s:'s13b',t:'the clipboard goes down',x:'Later she picked it up again. Of course she did. She\'s Kelly. But she\'d put it down. For a moment, in the middle of a forest at dusk, the most organised person Gumnuts had ever met had just... sat with him. He counted the leaves. 47. He noted them. He noted her. He thought: this is what I want to remember. The tree heard him. It tried.'},
  {s:'s14a',t:'the tree goes dark',     x:'The Memory Tree flickered. One of the branches that had been full of light went grey. Then dark. Then just... branch. The creek was very quiet. Craig was closer than anyone had calculated, which was a failure of the system since Kelly had a whole spreadsheet. The forest held its breath. So did Gumnuts, but for different reasons.'},
  {s:'s14b',t:'to be continued',        x:'Somewhere in the Blue Mountains, a crocodile in designer sunglasses was having a very good evening. He had the memory machine humming. He had the tree in his sights. He had absolutely nobody who would remember his birthday. This would turn out to be relevant. Chapter 2 is for those who believe the koala deserves dinner.'},

  // Chapter 2 — Locked
  {s:'s15a',t:'you came back',          x:'You donated to a donationware app about a koala in the Blue Mountains. This is an objectively good thing you have done. Gumnuts would like you to know that he noticed. The story continues. Craig is about to have a very bad Tuesday for once.'},
  {s:'s15b',t:'kelly monday morning',   x:'Kelly served Craig at 8:47am on a Monday, because she had timed it specifically to ruin his morning. Cease and desist. Three injunctions. A fourteen-page letter beginning "Dear Sir, You appear to be unaware of several important facts." Craig ate the letter. She had copies. She always has copies. She had a whole drawer.'},
  {s:'s16a',t:'craig eats the letter',  x:'He ate it slowly. Deliberately. While making eye contact. This was a power move. Kelly made a note. "Subject consumed legal correspondence (see Exhibit E: Exhibit)." The drawer now had an Exhibit E. Craig had eaten a fourteen-page letter and all he\'d done was create more paperwork. He was losing and didn\'t know it yet.'},
  {s:'s16b',t:'gumnuts trains',         x:'Gumnuts did push-ups. Four of them. He then ate a gumleaf and had a very long think about what he was actually contributing to this situation. He did one more push-up. He lay on the ground for a while. He stood up. "Right," he said. He then did another push-up, which brought the total to six, which was, he felt, significant.'},
  {s:'s17a',t:"craig's lair",           x:'Behind the waterfall: a cave. Inside: a machine with blinking lights and glass spheres floating in racks, each one holding something that used to belong to someone. A wedding day. Someone\'s PIN. The exact feeling of a childhood afternoon. Craig sat in a leather chair and held a sphere up to the light. He didn\'t look at it. He just held it.'},
  {s:'s17b',t:'the memory machine',     x:'It had a dial. Three settings: EXTRACT, STORE, and FORGET. The FORGET setting had been used so much the label was worn off. Craig had custom-built it from components he\'d sourced over seventeen years. He\'d had a lot of time. Nobody had ever come to check on him. Nobody ever came on Tuesdays.'},
  {s:'s18a',t:'the plan',               x:'Gumnuts and Kelly made a plan. Kelly wrote it down in a separate document and then made a backup. The plan was: go in, retrieve the memory spheres, come out, restore the tree. Step four said "???" because Kelly had written it and she had limits. Gumnuts added "have a gumleaf" to step four. Kelly left it in.'},
  {s:'s18b',t:"kelly's beret",          x:'"Why the beret?" said Gumnuts, at midnight, outside the waterfall. "I\'m in heist mode," Kelly said. "That\'s not a mode." "I have declared it a mode." "You can\'t declare modes." "I have documentation." Gumnuts looked at her. She did have documentation. He stopped arguing. They went in.'},
  {s:'s19a',t:'caught',                 x:'A twig snapped. This is always how it happens. Craig turned slowly, the way people do when they already know and they want you to know that they know. The leather chair creaked. The light caught the sunglasses. "Well," said Craig. Long pause. "Well well well." He\'d definitely rehearsed this.'},
  {s:'s19b',t:'the fuzzy little idiot', x:'"The fuzzy little idiot," Craig said, almost fondly, the way you feel about a problem that keeps coming back because it refuses to accept that it\'s small. He looked at Kelly. "And his lawyer." Kelly looked at her clipboard. The clipboard had seventeen things to say and none of them were appropriate right now. She held it anyway.'},
  {s:'s20a',t:'kelly to the rescue',    x:'She came from the left. Clipboard raised two-handed like a person who has been waiting her entire career for a situation where raising a clipboard makes sense. "UNHAND HIM," she said. Three words. Craig blinked. Nobody had ever said that to him. It worked. He actually stepped back. Kelly was as surprised as anyone.'},
  {s:'s20b',t:'it worked',              x:'The backup plan had been a fourteen-point motion filed under section six of the Forest Council bylaws. The backup to the backup was screaming. The backup to the backup to the backup was "run very fast." None of these had been needed. Three words and a clipboard had done it. Kelly filed this under EFFECTIVE (unexpected).'},
  {s:'s21a',t:'bubbles burst',          x:'Kelly hit the machine with the clipboard. Once, hard, in the exact spot she had identified from the documentation she\'d compiled of similar machines from publicly available sources, because Kelly researches everything. Every sphere popped. The cave filled with memories returning to wherever memories go when they come home.'},
  {s:'s21b',t:'memories rain down',     x:'The lamington recipe came back. The birthday. The password. The feeling of a Tuesday that had been good for no reason. 47 leaves. Kelly\'s name, with the correct spelling. The tree outside the window, counted every morning, always 47, always fine. Everything came back at once, like a browser that had just finished loading after a very long commute.'},
  {s:'s22a',t:"craig's sad backstory",  x:'He hadn\'t meant to do it. Or — he had meant to do it, but not like this. He\'d just wanted someone to remember him. That was the whole thing. Forty-three years, designer accessories, a very impressive lair, and not a single person had thought about Craig on a Tuesday. Not once. He hadn\'t known how to say that. So he\'d built a machine instead.'},
  {s:'s22b',t:'not once',               x:'He\'d had the machine for eleven years. In eleven years, he\'d collected four thousand and twelve memories that belonged to other people. In eleven years, nobody had collected a single memory of him. Not a birthday. Not a favour. Not a "have you seen Craig lately?" He sat in the cave. The machine was broken. He had nowhere to be.'},
  {s:'s23a',t:'gumnuts forgives craig', x:'He offered Craig the best gumleaf he had. Not a leaf from the tree. His own. The one he\'d been saving. Craig looked at it for a very long time, the way you look at something that should be easy and isn\'t. "This is the worst leaf I\'ve ever seen," he said, in the voice of someone trying to sound like they mean it.'},
  {s:'s23b',t:'worst leaf',             x:'"I know," said Gumnuts. "I grew it myself." Craig looked at it again. "It\'s damp." "On one side." "The wrong side." "There\'s a right side?" Craig put it in his pocket. He didn\'t say thank you. Gumnuts didn\'t require it. Kelly noted: "EXHIBIT F: leaf (second)." The folder said "leaf (second)." It got its own tab.'},
  {s:'s24a',t:'the tree blooms',        x:'For the first time in years, the Memory Tree grew new branches. Pink blossoms, which the tree had not done since records began. The Blue Mountains smelled different. The forest remembered everything — the chat logs and the decisions and the lamingtons and the gumleaf and the forty-seven leaves and all of it, all at once, in bloom.'},
  {s:'s24b',t:'the mountain remembers', x:'The bubbles were back, brighter than before. The tree was full. Kelly documented this (EXHIBIT G: tree (restored), seventeen photographs, scale bar included). Gumnuts stood beside it with his paws on the bark. He counted. Everything was there. He didn\'t know what he\'d expected recovery to feel like. This was better.'},
  {s:'s25a',t:'kelly says something',   x:'"You know," she said, at dusk, clipboard down, facing the tree. "You\'re actually quite brave for someone who spends significant time every morning counting a specific number of leaves." "47," said Gumnuts. "Every morning." "Every morning," he confirmed. She nodded. He thought that might be the kindest thing anyone had ever said using the word \'actually.\''},
  {s:'s25b',t:'not completely hopeless',x:'She picked up the clipboard. Of course. She wrote something. He didn\'t ask what. She handed it to him. He read it. It said: "You are not completely hopeless. — K, Esq." He kept it. He put it in the same pocket as the leaf. He counted the leaves. 47. He noted them. He noted her. He went home in a condition that could be called, fairly, good.'},
  {s:'s26a',t:'craig visits tuesday',   x:'He started coming on Tuesdays. Just appeared. Sat under the tree. Didn\'t say anything much. Gumnuts sat beside him for a while. Kelly billed him for the consultation at a reasonable rate that she described as "the friends and family rate." Craig paid it. He didn\'t call her a friend. He paid the rate. This is progress, by any measure.'},
  {s:'s26b',t:'he eats the gumleaves',  x:'He never brought anything. He ate the gumleaves — just took them off the low branches, ate them slowly, put the stems down tidily. He never said the gumleaves were good. He never said anything was good. He came back every Tuesday. Coming back every Tuesday is, depending on who you are, the loudest thing you can say.'},
  {s:'s27a',t:'47 leaves',              x:'Gumnuts counted them every morning. 47. Always 47. The tree grew new branches and the count on those was different and he counted those too and added them to a separate column. But the original tree: 47. Always 47. Some mornings he wondered why he\'d started. Some mornings he knew. Some mornings that was enough.'},
  {s:'s27b',t:'the context file',       x:'He kept the file updated. Every chat, every session, every decision — saved, backed up, pushed to the cloud. He\'d learned, specifically, not to lose things. The file had a section for everything. 47 leaves. Kelly (still a lawyer, still has the leaf, folder tab says "leaf"). Craig (pays invoices, eats gumleaves, comes Tuesdays). The tree (blooming).'},
  {s:'s28a',t:'the memory tree remembers', x:'The Memory Tree was full again. Every bubble in its place. It remembered the whole thing — the theft and the panic and the clipboard and the beret and Craig\'s lair and the scale and the machine and the worst leaf and all of it. It remembered Craig\'s face when he put the leaf in his pocket. The tree was not smug about it. For once.'},
  {s:'s28b',t:'the end',                x:'Same tree. Same 47 leaves, plus the new branches. Craig visits Tuesdays — brings nothing, eats the gumleaves, never says thank you, pays the invoice, comes back next week. Kelly invoices everyone, has copies of everything, once put down her clipboard on purpose. Gumnuts counts the leaves. The Memory Tree remembers everything. Even this. Especially this.'}
];

// ── STATE ────────────────────────────────────────────────────────────────────
var cur = 0; // index into STORIES (0-55)
var donated = false;
var LOCK_IDX = 28; // first locked scene index

// ── RENDER ───────────────────────────────────────────────────────────────────
function render(idx) {
  var s = STORIES[idx];
  if (!s) return;

  // Day label: every 2 scenes = 1 real day
  var realDay = Math.floor(idx / 2) + 1;
  var part = (idx % 2 === 0) ? 'morning' : 'evening';
  document.getElementById('dayBadge').textContent = 'day ' + realDay + ' — ' + part;
  document.getElementById('sceneTitle').textContent = s.t;
  document.getElementById('sceneText').textContent = s.x;
  document.getElementById('scene').innerHTML = scene(s.s);
  document.getElementById('sceneCounter').textContent = (idx + 1) + ' of 56';

  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var cta = document.getElementById('ctaArea');

  prevBtn.disabled = (idx <= 0);

  var isLocked = (idx >= LOCK_IDX && !donated);
  var isLast = (idx >= STORIES.length - 1);

  if (isLocked) {
    nextBtn.disabled = true;
    cta.innerHTML = '<div class="cta">'
      + '<div class="cta-title">🔒 chapter 2 is locked</div>'
      + '<p>Gumnuts has worked very hard on the next 28 scenes.<br>'
      + 'Craig gets what\'s coming to him. There\'s a beret involved.<br>'
      + 'Donate to unlock — even $5 keeps the koala in gumleaves.</p>'
      + '<a class="donate-btn" href="https://paypal.me/leftfootbrake" target="_blank" id="donateLink">💛 donate to unlock chapter 2</a></div>';
    document.getElementById('donateLink').addEventListener('click', function(){ sDonate(); });
  } else if (isLast) {
    nextBtn.disabled = true;
    cta.innerHTML = '<div class="cta">'
      + '<div class="cta-title">the end 🐨</div>'
      + '<p>Thank you for reading all 56 scenes.<br>'
      + 'And for donating. The Memory Tree remembers you specifically.</p>'
      + '<a class="donate-btn" href="https://paypal.me/leftfootbrake" target="_blank">💛 support gumnuts</a></div>';
  } else {
    nextBtn.disabled = false;
    cta.innerHTML = '';
  }
}

// ── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  try {
    chrome.storage.local.get(['storyScene', 'donated'], function(d) {
      donated = !!(d && d.donated);
      var params = new URLSearchParams(window.location.search);
      var dayParam = parseInt(params.get('day'));
      var stored = (d && d.storyScene) ? parseInt(d.storyScene) : 0;
      var target = dayParam >= 1 ? (dayParam - 1) * 2 : stored;
      // Enforce lock
      if (target >= LOCK_IDX && !donated) target = LOCK_IDX - 1;
      cur = Math.max(0, Math.min(target, STORIES.length - 1));
      render(cur);
      sLoad();
    });
  } catch(e) {
    cur = 0;
    render(cur);
    sLoad();
  }
}

document.getElementById('prevBtn').addEventListener('click', function() {
  if (cur > 0) { cur--; render(cur); sPrev(); }
});

document.getElementById('nextBtn').addEventListener('click', function() {
  if (cur >= STORIES.length - 1) return;
  if (cur >= LOCK_IDX - 1 && !donated) { sLock(); return; }
  cur++;
  render(cur);
  sNext();
});

init();
