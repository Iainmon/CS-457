#version 120

uniform float uTime;
uniform sampler2D uTexUnit;

varying  vec2  vST;			// texture coords


vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

	// float dist = length(diff);
	// float a = atan(diff.y, diff.x);
	// float r = 0.5;
	// float t = uTime * 0.1;
	// float d = 0.5 + 0.5 * sin(t + a * 10.);
	// float f = smoothstep(r - d, r + d, dist);
	// vec2 st_r = st_d + rotate(diff, uTime * 0.1);

void
main( )
{

	vec2 st = vST;

	float tiles = 10.;
	vec2 diff = (floor(st * tiles) / tiles) + vec2(0.5 / tiles);

	float diff_len = length(diff);

	float rot = (1. - smoothstep(0.,1.,diff_len)) * uTime;

	vec2 st_d = st - diff;
	vec2 st_r = rotate(st_d, rot); // scale time inversely by length of diff. 
	vec2 st_new = st_r + diff;

	vec3 rot_color = texture2D(uTexUnit, st_new).rgb;
	vec3 color = rot_color;
	vec3 og_color = texture2D(uTexUnit, st).rgb;

	float bias = length(diff);

	// vec3 color = mix(rot_color, og_color, bias);



	gl_FragColor = vec4(color, 1.0);

}
