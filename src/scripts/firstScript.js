import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { animateIdle, initIdleButton, getIdleButton, setDefaultPosition  } from './utils';
import GUI from 'lil-gui';

/**
 * Debug
 */
const gui = new GUI();

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log('on start')
}
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/minecraft.png');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

colorTexture.colorSpace = THREE.SRGBColorSpace;

colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

window.addEventListener('resize', () => {
  //Update size
  size.width = window.innerWidth;
  size.height = window.innerHeight

  //Update camera
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  //Update renderer
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
})

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);

//BufferGeometry experiment
// const geometry = new THREE.BufferGeometry();

// const count = 50;
// const positionsArray = new Float32Array(count * 3 * 3);

// for (let i = 0; i < count * 3 * 3; i++){ 
//   positionsArray[i] = Math.random() - 0.5;
// };

// const positionAttribute = new THREE.BufferAttribute(positionsArray, 3);
// geometry.setAttribute('position', positionAttribute);

//box
const material = new THREE.MeshBasicMaterial({ map: colorTexture});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

gui
  .add(mesh.position, 'y')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('elevation')

//wireframe
const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const wireframeMaterial = new THREE.LineBasicMaterial({
  color: 'white'
});
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

//cube object
const cube = new THREE.Object3D();
// cube.add(mesh)
// cube.add(wireframe);
//cube.scale.x = 2;

//Rotation
// cube.rotation.reorder('YXZ');
// cube.rotation.x = Math.PI * 1.34
// cube.rotation.y = Math.PI * 0.25;

//scene.add(cube);

//Group
const group = new THREE.Group();
//scene.add(group);
//group.add(cube);

const purpleMaterial = material.clone();
const purpleCube = new THREE.Mesh(geometry, purpleMaterial);
purpleCube.material.color.set('purple');

purpleCube.position.x = 1.5;
group.add(purpleCube);

const blueMaterial = material.clone();
const blueCube = new THREE.Mesh(geometry, blueMaterial);
blueCube.material.color.set('blue');

blueCube.position.x = -1.5;
group.add(blueCube);

group.position.y = -0.5;

const axesHelper = new THREE.AxesHelper(1.5);
axesHelper.position.y = -0.5;
//scene.add(axesHelper);

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//CAMERA

const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
// const aspectRation = size.width / size.height;
//const camera = new THREE.OrthographicCamera(-1 * aspectRation, 1 * aspectRation, 1, -1, 0.1, 100);
camera.position.z = 3;
camera.position.y = 1.5;

camera.lookAt(group.position);
scene.add(camera);


//ORBITCONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);

//Background
scene.background = new THREE.Color(0x000000)

//Time test
//let time = Date.now();

//Clock
const clock = new THREE.Clock();

//gsap test
// gsap.to(group.position, { duration: 1, delay: 1, x: 2 });
// gsap.to(group.position, { duration: 1, delay: 2, x: 0 });

//ADDITIONS
const button = getIdleButton();
const idle = initIdleButton(button);

//Animation
const loop = () => {

  //Clock
  const elapsedTime = clock.getElapsedTime();

  //Group Idle animation
  if (idle.isActive()) {
    animateIdle(mesh, elapsedTime, false);
  } else {
    setDefaultPosition(mesh);
  }

  //Update controls
  controls.update();

  //Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop);
}
loop();