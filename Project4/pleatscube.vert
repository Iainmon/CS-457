#version 330 compatibility

uniform float uK, uP, uY0;

out vec3	vNs;
out vec3	vEs;
out vec3	vMC;




void
main( )
{    
	vMC = gl_Vertex.xyz;

	// vec4 newVertex = gl_Vertex;
	//?????
	

    vec4 pos = gl_Vertex;
    pos.z = uK * (uY0 - pos.y) * sin(2. * 3.1415926538 * pos.x / uP);    
    vec4 newVertex = pos;

	vec4 ECposition = gl_ModelViewMatrix * newVertex;

	// float dzdx = ?????
	// float dzdy = ?????
	// vec3 xtangent = ?????
	// vec3 ytangent = ?????

	float dzdx = uK * (uY0 - pos.y) * (2. * 3.1415926538 / uP) * cos(2. * 3.1415926538 * pos.x / uP);
	float dzdy = -uK * sin(2. * 3.1415926538 * pos.x / uP);

	vec3 Tx = vec3(1.,0.,dzdx);
	vec3 Ty = vec3(0.,1.,dzdy);

	vec3 normal = normalize(cross(Tx,Ty));


	vec3 newNormal = normal; // ?????
	vNs = newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. ) ; 
	       		// vector from the eye position to the point

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}