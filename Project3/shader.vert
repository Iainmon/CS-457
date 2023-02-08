#version 330 compatibility


out vec2 vST; // texture coords
out vec3 vN; // normal vector
out vec3 vL; // vector from point to light
out vec3 vE; // vector from point to eye

uniform float uK;
uniform float uY0;
uniform float uP;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

out vec3  vMCposition;
out float vLightIntensity; 


const vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	vec4 pos = gl_Vertex;
	pos.z = uK * (uY0 - pos.y) * sin(2. * 3.1415926538 * pos.x / uP);
	

	float dzdx = uK * (uY0 - pos.y) * (2. * 3.1415926538 / uP) * cos(2. * 3.1415926538 * pos.x / uP);
	float dzdy = -uK * sin(2. * 3.1415926538 * pos.x / uP);

	vec3 Tx = vec3(1.,0.,dzdx);
	vec3 Ty = vec3(0.,1.,dzdy);

	vec3 normal = normalize(cross(Tx,Ty));

	vec3 tnorm      = normalize(gl_NormalMatrix * normal);// normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = vec3( gl_ModelViewMatrix * pos );
	vLightIntensity  = abs( dot( normalize(vec3(uLightX,uLightY,uLightZ) - ECposition), tnorm ) );


	vN = normal;//normalize(gl_NormalMatrix * normal); // normalize( gl_NormalMatrix * gl_Normal ); // normal vector
	vL = vec3(uLightX,uLightY,uLightZ) - ECposition.xyz;
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;

	vMCposition  = pos.xyz;
	gl_Position =  gl_ModelViewProjectionMatrix * pos;
}

// #version 330 compatibility

// void
// main( )
// {
//  // vector from the point to the light positionvE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position
// gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
// }