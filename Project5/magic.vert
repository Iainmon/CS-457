#version 330 compatibility

out vec2 vST;

void
main( )
{
vST = gl_MultiTexCoord0.st;
 // vector from the point to the light positionvE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position
gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}