/* Adapted from the supplied Cshade.tsx WebGL field shader for this static frontend. */
(function () {
    const vertex = `#version 300 es
    void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(p*2.0-1.0,0.0,1.0);}`;

    const fragment = `#version 300 es
    precision highp float;
    uniform vec2 iResolution; uniform float iTime; out vec4 fragColor;
    const float TAU=6.28318530718;
    vec3 oklch(float L,float C,float h){float a=C*cos(h),b=C*sin(h);float l=L+.3963377774*a+.2158037573*b;float m=L-.1055613458*a-.0638541728*b;float s=L-.0894841775*a-1.291485548*b;vec3 v=vec3(l,m,s);v=v*v*v;return mat3(4.0767416621,-1.2684380046,-.0041960863,-3.3077115913,2.6097574011,-.7034186147,.2309699292,-.3413193965,1.707614701)*v;}
    void main(){
      vec2 R=iResolution,pos=(gl_FragCoord.xy-.5*R)/R.y;
      float t=iTime*.430808067+20.2688236;
      float breath=(-sin(iTime*.686919)+sin(iTime*.457946+1.0))*.25+.5;
      vec2 u=(pos-vec2(-.252584,-.489916))*(.980741-breath*.116615);
      float ct=cos(1.30865788),st=sin(1.30865788);u=mat2(ct,st,-st,ct)*u;
      mat2 fold=mat2(cos(2.11316895),sin(2.11316895),-.956491232,cos(2.11316895));
      vec3 color=vec3(0.0);float h0=.0991554931*TAU,h1=h0-.147368088*TAU;
      for(float i=1.0;i<=72.0;i+=1.0){
        u.x+=-sin(u.y*.378028214+t+i*.007)*.156621769;
        u.y+=-sin(u.x*2.39491224-t+i*.02)*.0345561393;
        u=fold*u*.953927994;
        vec2 q=u-vec2(.412003905+breath*.1,.0331539437);
        vec2 s=vec2(q.x*2.10272551,q.y*.142524004);
        float glow=.00166834553/(dot(s,s)+.00161607983);glow*=.25+breath*.4;
        float r=length(u),k=sin(i*.112212479+t*1.2+r*2.33345318)*.5+.5;
        vec3 tint=clamp(oklch(.522443473+.204128146*k,.112515278*(.75+.35*k),mix(h0,h1,k)),0.0,1.0);
        color+=glow*tint*exp2(-r*.364997596);
      }
      vec3 x=max(color,0.0);color=(x*(2.51*x+.03))/(x*(2.43*x+.59)+.14);color=pow(clamp(color,0.0,1.0),vec3(.85,.92,.98));
      vec3 background=vec3(.035,.039,.035);color=background+color*(1.0-background);
      fragColor=vec4(clamp(color,0.0,1.0),1.0);
    }`;

    function compile(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
        return shader;
    }

    window.startIntraOpsShader = function (canvas) {
        const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
        if (!gl) return () => {};
        const program = gl.createProgram();
        gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
        gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
        const resolution = gl.getUniformLocation(program, "iResolution");
        const time = gl.getUniformLocation(program, "iTime");
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let frame = 0;
        let active = true;

        function draw(now) {
            if (!active) return;
            const ratio = Math.min(devicePixelRatio || 1, 2);
            const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
            const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
            if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
            gl.viewport(0, 0, width, height);
            gl.useProgram(program);
            gl.uniform2f(resolution, width, height);
            gl.uniform1f(time, reduced ? 0 : now / 1000);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            if (!reduced) frame = requestAnimationFrame(draw);
        }
        frame = requestAnimationFrame(draw);
        return () => { active = false; cancelAnimationFrame(frame); gl.deleteProgram(program); };
    };
})();
