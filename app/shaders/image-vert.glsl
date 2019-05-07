#pragma glslify: pnoise = require(glsl-noise/periodic/3d)

uniform float multiplier;
uniform float noise;
uniform float time;

varying vec2 vUv;

void main() {
  vUv = uv;

  float displacement = pnoise(position * 0.005 + time, vec3(noise));

  vec3 newPosition = position;

  newPosition.z += 20.0 * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
