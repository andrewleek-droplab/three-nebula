const { System,
  Body,
  Color,
  Emitter,
  Gravity,
  Life,
  Mass,
  Position,
  Radius,
  RadialVelocity,
  RandomDrift,
  Rate,
  Rotate,
  Rotation,
  Scale,
  Span,
  SphereZone,
  LineZone,
  SpriteRenderer,
  GPURenderer,
  Vector3D,
  ease,
  Particle,
} = window.Nebula;

window.init = async ({ scene, camera, renderer }) => {
  const spriteRenderer = new SpriteRenderer(scene, THREE);
  const pointsRenderer = new GPURenderer(scene, renderer, THREE);
  const systemRenderer = pointsRenderer;

  var map = new THREE.TextureLoader().load('../../assets/line.png');

  var material = new THREE.SpriteMaterial({
    map: map,
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    fog: true,
  });

  var sprite = new THREE.Sprite(material);
  
  const emitter = new Emitter();
  emitter.setRate(new Rate(10,.01))
      .addInitializers([
        new Body(sprite),
        new Mass(1),
        new Life(1, 2),
        new Position(new LineZone(0,-15,0,0,15,0)),
        new Rotation(0,0,Math.PI/2),
				new RadialVelocity(10, new Vector3D(1, 0, 0), 10),
        new Radius(.3,.3),
      ])
      .addBehaviours([
				new RandomDrift(new Span(2, 3.5), new Span(2, 3.5), new Span(2, 3.5), new Span(3.5, 5)),
				new Scale(new Span(5, 5), 5),
        new Color('#FF0026', ['#ffff00', '#ffff11'], Infinity, ease.easeOutSine),
      ])
      .setPosition({ x: 0, y: 15, z:0 })
      .addEmitterBehaviours([
      ])
      .emit();

  const system = new System();
  system.addEmitter(emitter)

  setInterval(() => {
    emitter.setRotation({z:emitter.rotation.z + 0.05})
  }, 33);

  if(systemRenderer.type === 'GPURenderer' || systemRenderer.type === 'MobileGPURenderer' || systemRenderer.type === 'DesktopGPURenderer')
  {
    window.onresize = (e) => {
      setTimeout(() => {
        system.setSize(renderer.domElement.width,renderer.domElement.height);
      },100)
    }
  }

  return system.addRenderer(systemRenderer);
};
