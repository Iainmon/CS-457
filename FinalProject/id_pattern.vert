#version 120

// uniform float	uTime;

varying vec2	vST;

void
main( )
{ 
	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}