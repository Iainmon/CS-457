#version 330 compatibility

uniform sampler3D	Noise3;
uniform float 		uNoiseAmp;
uniform float 		uNoiseFreq;
uniform float Timer;

uniform float uZoom;
uniform float uSpeed;


in vec2 vST;

float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(in vec2 p) {
	vec4 n = texture( Noise3, vec3(p,0.) );
	float a = n.r + n.g + n.b + n.a;	//  1. -> 3.
	a = a - 2.;				// -1. -> 1.
    a *= 0.5;				// -0.5 -> 0.5
    a += 0.5;				//  0. -> 1.
	// a *= uNoiseAmp;
    return a;
}

float lin_noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(rand(i), rand(i+vec2(1.0,0.0)), u.x),
               mix(rand(i+vec2(0.0,1.0)), rand(i+vec2(1.0,1.0)), u.x), u.y);
}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float perlin(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  float ret = 2.3 * n_xy;
  return (ret + 0.5) * 0.5;
}









vec2 tile(vec2 st, float zoom){
    st *= zoom;
    return fract(st);
}

float circle(vec2 st, float radius){
    vec2 pos = vec2(0.5)-st;
    radius *= 0.75;
    return 1.-smoothstep(radius-(radius*0.05),radius+(radius*0.05),dot(pos,pos)*3.14);
}

float circlePattern(vec2 st, float radius) {
    return  circle(st+vec2(0.,-.5), radius)+
            circle(st+vec2(0.,.5), radius)+
            circle(st+vec2(-.5,0.), radius)+
            circle(st+vec2(.5,0.), radius);
}

vec3 pattern(vec2 st,float u_time) {
    vec3 color = vec3(0.0);

    vec2 grid1 = tile(st,7.);
    grid1 = tile(st + vec2(cos(u_time),sin(u_time))*0.2,7.);
    color += mix(vec3(0.329,0.082,0.169),vec3(0.973,0.843,0.675),circlePattern(grid1,0.23)-circlePattern(grid1,0.01));

    vec2 grid2 = tile(st,3.);
    grid2 = tile(st + vec2(cos(u_time),sin(u_time))*0.2 ,3.);
    color = mix(color, vec3(0.636,0.785,0.548), circlePattern(grid2,0.2)) - circlePattern(grid2,0.05);
    return color;
}



float parabola(vec2 st) {
    return (st.x * st.x * st.x) + (st.y * st.y * st.y);
}






void main () {

    vec3 color = vec3(0.0);

    vec2 st = vST * 20.;
    float warp = parabola(st);
    st /= warp;
    st *= uZoom;

    float bailey_noise = noise((st + vec2(Timer)) * uNoiseFreq) * uNoiseAmp;
    float linear_noise = lin_noise((st + vec2(Timer)) * uNoiseFreq) * uNoiseAmp;
    float perlin_noise = perlin((st + vec2(Timer)) * uNoiseFreq) * uNoiseAmp;
    float composed_noise = perlin(st * perlin_noise * linear_noise);
    color = vec3(composed_noise);

    color = pattern(st, Timer * uSpeed);
    // if (color.r < 0. || color.g < 0. || color.b < 0.) {
    //     discard;
    // }

    gl_FragColor = vec4(color, 1.0);
}