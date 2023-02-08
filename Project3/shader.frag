#version 330 compatibility


uniform vec3 uColor;
uniform vec4 uSpecularColor;
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform sampler3D Noise3;


in vec3 vMCposition;
in float vLightIntensity;
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void main( )
{
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);
    vec3 vMC = vMCposition;
    vec3 myColor = uColor.xyz; // default color
    myColor = vec3(.8,.7,.1);//* vLightIntensity;


    vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;	// -1. to +1.
	angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;	// -1. to +1.
	angy *= uNoiseAmp;

    Normal = normalize(gl_NormalMatrix * RotateNormal(angx,angy,Normal));

   //  << possibly change myColor >>
    vec3 ambient = uKa * myColor;
    float d = 0.;
    float s = 0.;
    if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
    {
        d = dot(Normal,Light);
        vec3 R = normalize( reflect( -Light, Normal ) ); // reflection vector
        s = pow( max( dot(Eye,R), 0. ), uShininess );
    }
    vec3 diffuse = uKd * d * myColor;
    vec3 specular = uKs * s * uSpecularColor.xyz;
    gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}