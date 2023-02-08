#version 330 compatibility


uniform vec3 uColor;
uniform vec4 uSpecularColor;
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent


in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye


void main( )
{
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);
    vec3 myColor = uColor.xyz; // default color
    myColor = vec3(.8,.7,.1);
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