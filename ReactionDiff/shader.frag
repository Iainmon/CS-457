#ifdef GL_ES
precision highp float;
out vec4 outputColor;
#endif

// uniform sampler2D   u_buffer0;
// uniform sampler2D   u_buffer1;

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

uniform sampler2D u_texture_0;
uniform vec3 u_camera;

varying vec3 v_position;
varying vec2 v_texcoord;


// Lighting
varying vec3 v_normal;
varying vec3 v_light;
varying vec3 v_eye;

#include "./diffusion.glsl"


const vec3 color = vec3(1.0, 0.0, 0.0);
const vec3 specular_color = vec3(1.0, 1.0, 1.0);

const float shininess = 20.0;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec3 normal = normalize(v_normal);
    vec3 light = normalize(v_light);
    vec3 eye = normalize(v_eye);

    vec3 color = vec3(1.);
    color.r = v_texcoord.x;
    color.g = v_texcoord.y;


    float diffuse = max(dot(light, normal), 0.0);
    float specular = 0.0;
    if (diffuse > 0.0) {
        vec3 reflect = normalize(reflect(-light, normal));
        specular = pow(max(dot(eye, reflect), 0.0), shininess);
    }

    color *= diffuse * color + specular * specular_color;



    // color *= texture2D(u_texture_0, v_texcoord).rgb;


    #ifdef GL_ES
        outputColor = vec4(color, 1.);
    #else
        gl_FragColor = vec4(color, 1.);
    #endif
}