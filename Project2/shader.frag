#version 330 compatibility


uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;

uniform sampler2D Noise2;

in  vec2  vST;

float noise(in vec2 st) {
    vec4 nv = texture(Noise2,uNoiseFreq * st);
    float n = nv.r + nv.g + nv.b + nv.a;
    // n = (n - 1.) / 2.; 
    n = (n - 2.) * uNoiseAmp;
    return n;
}

void program(inout vec4 myColor) {
    
    vec2 st = vST; // * 10.;
    // float diam = 2.;// abs(0.1 * sin(u_time));
    // float r = diam/2.;

    float s = st.s;
    float t = st.t;

    float a_r = uAd / 2.;
    float b_r = uBd / 2.;
    
    int n_s = int(s/uAd);
    int n_t = int(t/uBd);

    float s_c = (float(n_s) * uAd) + a_r;
    float t_c = (float(n_t) * uBd) + b_r;

    float ds = s - s_c;
    float dt = t - t_c;

    float old_dist = sqrt((ds * ds) + (dt * dt));
    float new_dist = old_dist + noise(vST);
    float scale = new_dist / old_dist;

    float d = pow((ds * scale) / a_r, 2.) + pow((dt * scale) / b_r, 2.);
    // float d = pow((s - s_c) / a_r, 2.) + pow((t - t_c) / b_r, 2.);
    float edge = 1.;// pow(r, 2.);
    // float uTol = 0.00001;
    float m = smoothstep(edge - uTol, edge + uTol, d);
    // float m = 0.0;
    // if (d < pow(r,2.)) {
    //     m = 1.0;
    // }
    myColor = mix(myColor, vec4(1., 1., 1., uAlpha), m);
    if (m > 0.99 && uAlpha == 0.) {
        discard;
    }
    
}

void
main( )
{
    // vec3 Normal    = normalize(vN);
    // vec3 Light     = normalize(vL);
    // vec3 Eye       = normalize(vE);

    // vec3 SpecularColor = vec3( 1., 1., 1. );
    vec4 myColor = vec4(1.0, 0.5, 0.0, 1.);
    // float ds = uD;
    // float dt = uD;


    // if(	uS0-ds/2. <= vST.s  &&  vST.s <= uS0+ds/2.  && 
    // 	uT0-dt/2. <= vST.t  &&  vST.t <= uT0+dt/2.  )
    // {
    // 		myColor = vec3( 1., 0., 0. );
    // }

    
    program(myColor);
    gl_FragColor = myColor;

    // vec3 ambient = uKa * myColor;

    // float d = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
    // vec3 diffuse = uKd * d * myColor;

    // float s = 0.;
    // if( dot(Normal,Light) > 0. )	          // only do specular if the light can see the point
    // {
    //     vec3 ref = normalize(  reflect( -Light, Normal )  );
    //     s = pow( max( dot(Eye,ref),0. ), uShininess );
    // }
    // vec3 specular = uKs * s * SpecularColor.rgb;
    // gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}
