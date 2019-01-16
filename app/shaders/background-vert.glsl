#pragma glslify: pnoise = require(glsl-noise/periodic/3d)

uniform float multiplier;
uniform float time;

varying float noise;

void main() {
  noise = pnoise(position * 0.005 - time, vec3(100.0));

  vec3 newPosition = position;

  newPosition.z += 100.0 * noise * multiplier;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  gl_PointSize = 2.0;
}
