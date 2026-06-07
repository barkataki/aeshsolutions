// Animated aurora shader — raw WebGL2, no library dependency.
// Mounts into every .hero-shader element. Respects prefers-reduced-motion,
// renders a single frozen frame for [data-static] heroes, and pauses the
// animated hero when off-screen or when the tab is hidden.
(function () {
  var mounts = document.querySelectorAll('.hero-shader');
  if (!mounts.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var FRAG =
    '#version 300 es\nprecision highp float;out vec4 fragColor;uniform float iTime;uniform vec2 iResolution;' +
    'float rand(vec2 n){return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);}' +
    'float noise(vec2 p){vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);' +
    'float res=mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);return res*res;}' +
    'float fbm(vec2 x){float v=0.0;float a=0.3;vec2 shift=vec2(100);mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));' +
    'for(int i=0;i<3;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}return v;}' +
    'void main(){vec2 shake=vec2(sin(iTime*1.2)*0.005,cos(iTime*2.1)*0.005);' +
    'vec2 p=((gl_FragCoord.xy+shake*iResolution.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.0,-4.0,4.0,6.0);' +
    'vec2 v;vec4 o=vec4(0.0);float f=2.0+fbm(p+vec2(iTime*5.0,0.0))*0.5;' +
    'for(float i=0.0;i<35.0;i++){' +
    'v=p+cos(i*i+(iTime+p.x*0.08)*0.025+i*vec2(13.0,11.0))*3.5+vec2(sin(iTime*3.0+i)*0.003,cos(iTime*3.5-i)*0.003);' +
    'float tailNoise=fbm(v+vec2(iTime*0.5,i))*0.3*(1.0-(i/35.0));' +
    'vec4 auroraColors=vec4(0.1+0.3*sin(i*0.2+iTime*0.4),0.3+0.5*cos(i*0.3+iTime*0.5),0.7+0.3*sin(i*0.4+iTime*0.3),1.0);' +
    'vec4 currentContribution=auroraColors*exp(sin(i*i+iTime*0.8))/length(max(v,vec2(v.x*f*0.015,v.y*1.5)));' +
    'float thinnessFactor=smoothstep(0.0,1.0,i/35.0)*0.6;o+=currentContribution*(1.0+tailNoise*0.8)*thinnessFactor;}' +
    'o=tanh(pow(o/100.0,vec4(1.6)));fragColor=o*1.5;}';
  var VERT =
    '#version 300 es\nvoid main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(p*2.0-1.0,0.0,1.0);}';

  for (var i = 0; i < mounts.length; i++) init(mounts[i], reduce);

  function init(mount, reduce) {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    mount.appendChild(canvas);
    var gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return; // unsupported → hero keeps its CSS gradient background

    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindVertexArray(gl.createVertexArray());
    var uTime = gl.getUniformLocation(prog, 'iTime');
    var uRes = gl.getUniformLocation(prog, 'iResolution');

    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    function size() {
      var w = mount.clientWidth || window.innerWidth, h = mount.clientHeight || window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    size();

    var isStatic = mount.hasAttribute('data-static') || reduce;
    var t = isStatic ? (parseFloat(mount.getAttribute('data-static')) || 12.0) : 0;
    function draw() { gl.uniform1f(uTime, t); gl.drawArrays(gl.TRIANGLES, 0, 3); }

    var raf = null, running = false;
    function loop() { t += 0.016; draw(); raf = requestAnimationFrame(loop); }
    function start() { if (running || isStatic) return; running = true; loop(); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    if (isStatic) {
      draw();
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
      }, { threshold: 0.01 }).observe(mount);
      document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    } else { start(); }

    var rr;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(rr);
      rr = requestAnimationFrame(function () { size(); if (isStatic) draw(); });
    });
  }
})();
