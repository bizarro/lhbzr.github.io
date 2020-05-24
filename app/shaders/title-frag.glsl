uniform float alpha;
uniform sampler2D image;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(texture2D(image, vUv).xyz, alpha);
}
