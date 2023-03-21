#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D   u_buffer1;
uniform vec2     u_resolution;
uniform float   u_time;

uniform mat4    u_modelViewProjectionMatrix;
uniform mat4    u_modelViewMatrix;
uniform mat3    u_normalMatrix;



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
float parabola(vec2 st) {
    return (st.x * st.x * st.x) + (st.y * st.y * st.y);
}
void main(void) {
    // v_position = a_position;
    // surfacePosition = a_texcoord - 0.5;
    // gl_MultiTexCoord0.st

    float zoom = 1.;///parabola(a_texcoord - 0.5);

    v_texcoord = a_texcoord * .5; // (a_texcoord)/ parabola(a_texcoord);
    // v_texcoord *= parabola(v_texcoord);
    vec4 position = a_position;
    position += vec4(0.0, -5.0, 0.0, 0.0);
    v_position = u_modelViewProjectionMatrix * position * zoom;
    
    
    v_normal = normalize(u_normalMatrix * a_normal);
    v_light  = normalize(light_position - (u_modelViewMatrix * position).xyz);
    v_eye    = normalize(- (u_modelViewMatrix * position).xyz);

    


    // gl_Position = u_modelViewProjectionMatrix * a_position; // <-- working

    vec4 pos = vec4(change(position.xyz * zoom),1.0);
    gl_Position = u_modelViewProjectionMatrix * pos;

}


float get_diff_value() {
    vec2 pixel = 1. / u_resolution;
    vec2 st = v_texcoord + pixel*0.03;
    vec3 texColor = texture2D(u_buffer1, st).rgb;
    float diff_val = texColor.b;
    return diff_val;
}

vec3 change(in vec3 pos) {
    float change_length = .8;
    change_length *= get_diff_value();

    vec3 change_dir = normalize(v_normal);
    vec3 change_pos = pos + change_dir * change_length;

    return change_pos;

}