#pragma glslify: pnoise = require(glsl-noise/periodic/3d)

uniform float multiplier;
uniform float noise;
uniform float time;

varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
