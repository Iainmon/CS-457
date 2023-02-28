#version 330 compatibility

uniform float uSc;
uniform float uTc;
uniform float uDs;
uniform float uDt;
uniform float uRad;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;
uniform sampler2D uImageUnit;
uniform float uRect;

in vec2 vST;

float isInCirc() {
    vec2 center = vec2(uSc, uTc);
    vec2 st = vST;
    vec2 rel_st = st - center;
    float dist = length(rel_st);
    float maxDist = uRad; // * uMagFactor;
    if (dist < maxDist) {
        return 1.;
    } else {
        return 0.;
    }
}

float isInRect() {
    vec2 center = vec2(uSc, uTc);
    vec2 st = vST;
    vec2 rel_st = st - center;
    float dx = abs(center.x - uDs);
    float dy = abs(center.y - uDt);
    if (abs(rel_st.x) < uDs && abs(rel_st.y) < uDt) {
        return 1.;
    } else {
        return 0.;
    }
}

vec3 sharpen(vec2 st, vec3 irgb) {
    ivec2 ires = textureSize( uImageUnit, 0 );
    float ResS = float( ires.s );
    float ResT = float( ires.t );
    vec2 stp0 = vec2(1./ResS, 0. );
    vec2 st0p = vec2(0. , 1./ResT);
    vec2 stpp = vec2(1./ResS, 1./ResT);
    vec2 stpm = vec2(1./ResS, -1./ResT);
    vec3 i00 = texture2D( uImageUnit, st ).rgb;
    vec3 im1m1 = texture2D( uImageUnit, st-stpp ).rgb;
    vec3 ip1p1 = texture2D( uImageUnit, st+stpp ).rgb;
    vec3 im1p1 = texture2D( uImageUnit, st-stpm ).rgb;
    vec3 ip1m1 = texture2D( uImageUnit, st+stpm ).rgb;
    vec3 im10 = texture2D( uImageUnit, st-stp0 ).rgb;
    vec3 ip10 = texture2D( uImageUnit, st+stp0 ).rgb;
    vec3 i0m1 = texture2D( uImageUnit, st-st0p ).rgb;
    vec3 i0p1 = texture2D( uImageUnit, st+st0p ).rgb;
    vec3 blur = vec3(0.,0.,0.);
    blur += 1.*(im1m1+ip1m1+ip1p1+im1p1);
    blur += 2.*(im10+ip10+i0m1+i0p1);
    blur += 4.*(i00);
    blur /= 16.;
    float t = uSharpFactor;
    return mix( blur, irgb, t );
}

void main () {

    vec3 color = vec3(0.0);

    float lens = 0.;

    vec2 center = vec2(uSc, uTc);
    vec2 st = vST;
    vec2 rel_st = st - center;
    if ((uRect <= .5 && isInCirc() > 0.) || (uRect > .5 && isInRect() > 0.)) {
        // float percent = dist / maxDist;
        float theta = uRotAngle;
        float s = sin(theta);
        float c = cos(theta);
        mat2 rot = mat2(c, -s, s, c);
        rel_st *= 1. - (uMagFactor/3.);
        vec2 rot_st = rot * rel_st;//center + fromCenter;
        
        rot_st += center ;
        color = texture(uImageUnit, rot_st).rgb;
        color = sharpen(rot_st,color);
    } else {
        color = texture(uImageUnit, vST).rgb;
    }
    // } else {
    //     color = texture(uImageUnit, vST).rgb;
    // }

    //vec2 center = vec2(uSc, uTc);


    



    gl_FragColor = vec4(color, 1.0);
}