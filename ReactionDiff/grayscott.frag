// Copyright Patricio Gonzalez Vivo, 2016 - http://patriciogonzalezvivo.com/
// I am the sole copyright owner of this Work.
//
// You cannot host, display, distribute or share this Work in any form,
// including physical and digital. You cannot use this Work in any
// commercial or non-commercial product, website or project. You cannot
// sell this Work and you cannot mint an NFTs of it.
// I share this Work for educational purposes, and you can link to it,
// through an URL, proper attribution and unmodified screenshot, as part
// of your educational material. If these conditions are too restrictive
// please contact me and we'll definitely work it out.

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D   u_buffer0;
uniform sampler2D   u_buffer1;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

varying vec2        v_texcoord;

// Lighting
varying vec3 v_normal;
varying vec3 v_light;
varying vec3 v_eye;



const vec3 coral_color = vec3(0.985,0.882,0.601);
const vec3 coral_orange = vec3(0.985,0.811,0.288);
const vec3 specular_color = vec3(1.0, 1.0, 1.0);

const float shininess = 20.0;


#define ITERATIONS 9

// float diffU = 0.25;
// float diffV = 0.05;
// float f = 0.1;
// float k = 0.063;


float diffU = 0.1;
float diffV = 0.05;
float f = 0.04;
float k = 0.06;

float random (in float x) {
    return fract(sin(x)*43758.5453123);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

void main() {
    vec2 pixel = 1. / u_resolution;
    vec2 st = v_texcoord + pixel*0.03;
    // st.y = 1.0 - st.y;

#ifdef BUFFER_0
    // PING BUFFER
    //
    //  Note: Here is where most of the action happens. But need's to read
    //  te content of the previous pass, for that we are making another buffer
    //  BUFFER_1 (u_buffer1)

    float kernel[9];
    kernel[0] = 0.707106781;
    kernel[1] = 1.0;
    kernel[2] = 0.707106781;
    kernel[3] = 1.0;
    kernel[4] = -6.82842712;
    kernel[5] = 1.0;
    kernel[6] = 0.707106781;
    kernel[7] = 1.0;
    kernel[8] = 0.707106781;

    vec2 offset[9];
    offset[0] = pixel * vec2(-1.0,-1.0);
    offset[1] = pixel * vec2( 0.0,-1.0);
    offset[2] = pixel * vec2( 1.0,-1.0);

    offset[3] = pixel * vec2(-1.0,0.0);
    offset[4] = pixel * vec2( 0.0,0.0);
    offset[5] = pixel * vec2( 1.0,0.0);

    offset[6] = pixel * vec2(-1.0,1.0);
    offset[7] = pixel * vec2( 0.0,1.0);
    offset[8] = pixel * vec2( 1.0,1.0);

    vec2 texColor = texture2D(u_buffer1, st).rb;

    vec2 uv = st;
    float t = u_time;
    uv -= u_mouse/u_resolution;
    float pct = random(u_time);
    float srcTexColor = smoothstep(.999+pct*0.0001,1.,1.-dot(uv,uv))*random(st)*pct;

    vec2 lap = vec2(0.0);

    for (int i=0; i < ITERATIONS; i++){
        vec2 tmp = texture2D(u_buffer1, st + offset[i]).rb;
        lap += tmp * kernel[i];
    }

    float F  = f + srcTexColor * 0.025 - 0.0005;
    float K  = k + srcTexColor * 0.025 - 0.0005;

    float u  = texColor.r;
    float v  = texColor.g + srcTexColor * 0.5;

    float uvv = u * v * v;

    float du = diffU * lap.r - uvv + F * (1.0 - u);
    float dv = diffV * lap.g + uvv - (F + K) * v;

    u += du * 0.6;
    v += dv * 0.6;

    gl_FragColor = vec4(clamp( u, 0.0, 1.0 ), 1.0 - u/v ,clamp( v, 0.0, 1.0 ), 1.0);

#elif defined( BUFFER_1 )
    // PONG BUFFER
    //
    //  Note: Just copy the content of the BUFFER0 so it can be 
    //  read by it in the next frame
    //
    gl_FragColor = texture2D(u_buffer0, st);
#else


    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec3 normal = normalize(v_normal);
    vec3 light = normalize(v_light);
    vec3 eye = normalize(v_eye);


    // Main Buffer
    vec3 color = vec3(0.0);
    color = texture2D(u_buffer1, st).rgb;
    float d1 = distance(color, vec3(1.,1.,1.));
    float d2 = distance(color, vec3(0.,0.,0.));

    float d = smoothstep(-2., 0.3, color.g + color.b);


    // color = mix(coral_orange,coral_color, d);


    vec3 coral_col_1 = coral_orange;

    float dot_density = 800.;
    vec2 dot_st = (st + random(floor(st * dot_density))) * dot_density;
    vec2 dot_loc = floor(dot_st);
    vec2 dot_off = vec2(random(dot_loc),random(-dot_loc));
    float dot_dist = length((dot_loc + vec2(.5)) - dot_st);
    float dots = 1. - smoothstep(0.1,0.13,dot_dist);
    
    vec3 coral_col_2 = mix(coral_color,vec3(1.),dots * .5);

    color = mix(coral_col_1,coral_col_2, d);

    float diffuse = max(dot(light, normal), 0.0);
    float specular = 0.0;
    if (diffuse > 0.0) {
        vec3 reflect = normalize(reflect(-light, normal));
        specular = pow(max(dot(eye, reflect), 0.0), shininess);
    }

    color *= diffuse * color + specular * specular_color;

    
    gl_FragColor = vec4(color, 1.0);
#endif
}
