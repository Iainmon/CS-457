#version 120

uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent
uniform float uS0, uT0, uD;		// square pattern
uniform float u_time;

uniform float uA;
uniform float uB;
uniform float uTol;

varying  vec2  vST;			// texture coords
varying  vec3  vN;			// normal vector
varying  vec3  vL;			// vector from point to light
varying  vec3  vE;			// vector from point to eye

void program(inout vec3 myColor) {
    
    vec2 st = vST * 10.;
    float diam = 2.;// abs(0.1 * sin(u_time));
    float r = diam/2.;

    float s = st.s;
    float t = st.t;
    
    int n_s = int(s/diam);
    int n_t = int(t/diam);

    float s_c = (n_s * diam) + r;
    float t_c = (n_t * diam) + r;

    float d = pow((s - s_c) / uA, 2.) + pow((t - t_c) / uB, 2.);
    float edge =  pow(r, 2.);
    // float uTol = 0.00001;
    float m = smoothstep(edge - uTol, edge + uTol, d);
    // float m = 0.0;
    // if (d < pow(r,2.)) {
    //     m = 1.0;
    // }
    myColor = mix(myColor, vec3(1., 0., 0.), m);
    
}

void
main( )
{
    vec3 Normal    = normalize(vN);
    vec3 Light     = normalize(vL);
    vec3 Eye       = normalize(vE);

    vec3 SpecularColor = vec3( 1., 1., 1. );
    vec3 myColor = vec3(1.0, 0.5, 0.0 );
    float ds = uD;
    float dt = uD;


    // if(	uS0-ds/2. <= vST.s  &&  vST.s <= uS0+ds/2.  && 
    // 	uT0-dt/2. <= vST.t  &&  vST.t <= uT0+dt/2.  )
    // {
    // 		myColor = vec3( 1., 0., 0. );
    // }

    
    program(myColor);

    vec3 ambient = uKa * myColor;

    float d = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
    vec3 diffuse = uKd * d * myColor;

    float s = 0.;
    if( dot(Normal,Light) > 0. )	          // only do specular if the light can see the point
    {
        vec3 ref = normalize(  reflect( -Light, Normal )  );
        s = pow( max( dot(Eye,ref),0. ), uShininess );
    }
    vec3 specular = uKs * s * SpecularColor.rgb;
    gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}
