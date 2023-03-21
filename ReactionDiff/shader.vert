#ifdef GL_ES
precision mediump float;
#endif

uniform mat4    u_modelViewProjectionMatrix;
uniform mat4    u_modelViewMatrix;
uniform mat3    u_normalMatrix;

uniform float   u_time;

attribute vec4  a_position;
varying vec4    v_position;

attribute vec2  a_texcoord;
varying vec2    v_texcoord;

attribute vec3  a_normal;
varying vec3    v_normal;

varying vec3 v_light;
varying vec3 v_eye;

// varying vec2    surfacePosition;

const vec3 light_position = vec3(0.0, 0.0, 1.0);

vec3 change(in vec3);

void main(void) {
    // v_position = a_position;
    // surfacePosition = a_texcoord - 0.5;
    // gl_MultiTexCoord0.st

    v_texcoord = a_texcoord;
    v_position = u_modelViewProjectionMatrix * a_position;
    
    
    v_normal = normalize(u_normalMatrix * a_normal);
    v_light  = normalize(light_position - (u_modelViewMatrix * a_position).xyz);
    v_eye    = normalize(- (u_modelViewMatrix * a_position).xyz);

    


    // gl_Position = u_modelViewProjectionMatrix * a_position; // <-- working

    vec4 pos = vec4(change(a_position.xyz),1.0);
    gl_Position = u_modelViewProjectionMatrix * pos;

}


vec3 change(in vec3 pos) {
    float change_length = abs(sin(u_time * 2.)) * 0.1;

    vec3 change_dir = normalize(v_normal);
    vec3 change_pos = pos + change_dir * change_length;

    return change_pos;

}