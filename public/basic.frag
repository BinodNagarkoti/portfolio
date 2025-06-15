// #extension GL_OES_standard_derivatives : enable

precision highp float;
precision highp int;

#define PI      3.14159265358
#define TAU     6.28318530718
#define PHI     1.61803398874
#define SQRT3   1.73205080757

uniform vec2 u_resolution;
uniform float u_time;

float HexDist(vec2 p) {
    p = abs(p);
    float c = dot(p, normalize(vec2(1., SQRT3)));
    return max(c, p.x);
}

const vec2 repeat = vec2(1., SQRT3);
const vec2 height = .5 * repeat;

vec4 HexCoords(vec2 uv) {
    vec2 a = mod(uv, repeat) - height;
    vec2 b = mod(uv - height, repeat) - height;
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    vec2 id = uv - gv;
    return vec4(gv.x, gv.y, id.x, id.y);
}

// const float scale = 3.5;
const float scale = 4.75;

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;

    // output
    vec3 rgb;

    // a mask for each color channel
    vec3 ccm;

    // float str = .45;
    float str = .45 + .525 * length(uv) / scale;

    float spd = fract(.5 * u_time) * TAU;
    float dst = dot(uv, uv);
    float ampl = 0.025;

    vec2 freq = 5. * TAU * uv.yx + 2. * TAU * uv.xy;

    for (int i = 0; i < 3; i += 1) {
        float off = float(i) / 3. * PI;
        vec2 p = uv + ampl * dst * sin(freq + spd + off);
        vec4 hex = HexCoords(p * scale);
        float mask = HexDist(hex.xy);

        ccm[i] = smoothstep(str - .05, str, mask);
    }

    rgb = vec3(ccm);
    rgb = pow(rgb,vec3(0.4545));

    gl_FragColor = vec4(rgb, 1.0);
}