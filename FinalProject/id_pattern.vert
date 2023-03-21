#version 120

// uniform float	uTime;
uniform sampler2D uTexUnit;

varying vec2	vST;

void
main( )
{ 
	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
