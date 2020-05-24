#pragma glslify: pnoise = require(glsl-noise/periodic/3d)

uniform sampler2D image;

varying float noise;

void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.3 * noise);
  gl_FragColor = gl_FragColor * texture2D(image, gl_PointCoord);
}
