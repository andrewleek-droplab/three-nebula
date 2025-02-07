const {
  Alpha,
  Body,
  Color,
  CrossZone,
  Emitter,
  Force,
  Life,
  Mass,
  RadialVelocity,
  Radius,
  Rate,
  Scale,
  ScreenZone,
  Span,
  SpriteRenderer,
  GPURenderer,
  Vector3D,
} = window.Nebula;

const ParticleSystem = window.Nebula.default;

const createSprite = () => {
  const map = new THREE.TextureLoader().load('/assets/dot.png');
  const material = new THREE.SpriteMaterial({
    map: map,
    color: 0xff0000,
    blending: THREE.AdditiveBlending,
    fog: true,
  });

  return new THREE.Sprite(material);
};

const createEmitter = ({ colorA, colorB, camera, renderer }) => {
  const emitter = new Emitter();

  return emitter
    .setRate(new Rate(new Span(5, 7), new Span(0.01, 0.02)))
    .setInitializers([
      new Mass(1),
      new Life(2),
      new Body(createSprite()),
      new Radius(80),
      new RadialVelocity(200, new Vector3D(0, 0, -1), 0),
    ])
    .setBehaviours([
      new Alpha(1, 0),
      new Color(colorA, colorB),
      new Scale(1, 1.2),
      new CrossZone(new ScreenZone(camera, renderer), 'dead'),
      new Force(0, 0, -20),
    ])
    .emit();
};

const animateEmitters = (a, b, tha = 0, radius = 70) => {
  tha += 0.13;

  a.position.x = radius * Math.cos(tha);
  a.position.y = radius * Math.sin(tha);

  b.position.x = radius * Math.cos(tha + Math.PI / 2);
  b.position.y = radius * Math.sin(tha + Math.PI / 2);

  requestAnimationFrame(() => animateEmitters(a, b, tha, radius));
};

window.init = async ({ scene, camera, renderer }) => {
  const system = new ParticleSystem();
  const emitterA = createEmitter({
    colorA: '#4F1500',
    colorB: '#0029FF',
    camera,
    renderer,
  });
  const emitterB = createEmitter({
    colorA: '#004CFE',
    colorB: '#6600FF',
    camera,
    renderer,
  });
  //const systemRenderer = new SpriteRenderer(scene, THREE);
  const systemRenderer = new GPURenderer(scene, renderer, THREE);

  animateEmitters(emitterA, emitterB);

  if(systemRenderer.type === 'GPURenderer' || systemRenderer.type === 'MobileGPURenderer' || systemRenderer.type === 'DesktopGPURenderer')
  {
    window.onresize = (e) => {
      setTimeout(() => {
        system.setSize(renderer.domElement.width,renderer.domElement.height);
      },100)
    }
  }

  return system
    .addEmitter(emitterA)
    .addEmitter(emitterB)
    .addRenderer(systemRenderer);
};
