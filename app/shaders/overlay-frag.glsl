#pragma glslify: pnoise = require(glsl-noise/periodic/3d)

uniform float alpha;
uniform vec3 color;
uniform float noise;
uniform float time;
uniform float isMobile;

varying vec3 location;

void main() {
  if (isMobile < 1.0) {
    float displacement = pnoise(location * 0.01 + (time * 4.0), vec3(noise));

    gl_FragColor = vec4(color, alpha * displacement * 0.5);
  } else {
    gl_FragColor = vec4(color, alpha * 0.1);
  }
}
