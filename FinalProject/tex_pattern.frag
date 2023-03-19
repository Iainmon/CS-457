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

const float PI = 3.14159265;

void
main( )
{

	vec2 st = vST;

	float tiles = 10.;

	float row = floor(st.y * tiles);
	float shift_dir = (mod(row, 2.) - .5) * 2.;

	float shift = shift_dir * uTime * 0.01;

	st.x = st.x + shift;
	vec2 diff = (floor(st * tiles) / tiles) + vec2(0.5 / tiles);
	// diff.x = diff.x + (shift / tiles);

	float diff_len = length(diff);

	float time = sin(uTime);// fract(uTime);
	float n_time = time * 2. * PI;

	vec2 st_d = st - diff;
	// st_d.x = st_d.x - shift;

	float rot = (1. - smoothstep(.0,.5,length(st_d * tiles))) * n_time;

	vec2 st_r = rotate(st_d, rot); // scale time inversely by length of diff. 
	st_r.x = st_r.x - shift;
	vec2 st_new = st_r + diff;

	vec3 rot_color = texture2D(uTexUnit, st_new).rgb;
	vec3 color = rot_color;
	// vec3 og_color = texture2D(uTexUnit, st).rgb;
	vec3 og_color = texture2D(uTexUnit, vST).rgb;

	float bias = length(diff);

	// vec3 color = mix(rot_color, og_color, bias);


	color = vec3(.5,.5,sin(uTime)) + og_color;
	gl_FragColor = vec4(color, 1.0);

}
