#version 120

uniform float uTime;
uniform sampler2D uTexUnit;

varying  vec2  vST;			// texture coords

void
main( )
{

	vec2 st = vST;
    vec3 color = texture2D(uTexUnit, st).rgb;
	// color = vec3(1.,1.,0.);
	gl_FragColor = vec4(color, 1.0);

}
