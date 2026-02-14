import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

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
scene.background = new THREE.Color( 0x0f0f00 )

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * CAMERA
 */
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.z = 3;
camera.position.y = 1.5;

/**
 * CONTROLS
 */
//ORBITCONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);

/**
 * GUI
 */
const gui = new GUI();

/**
 * TEXTURES
 */
const textureLoader = new THREE.TextureLoader();

const colorTexture = textureLoader.load('./textures/door/color.jpg');
const ambientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('./textures/matcaps/2.png');
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg');

colorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * MESHES
 */
//BASIC MATERIAL
// const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
// basicMaterial.map = colorTexture;
// basicMaterial.color = new THREE.Color( 'purple' );
// basicMaterial.wireframe = true;
// basicMaterial.opacity = 0.2;
// basicMaterial.transparent = true;
// basicMaterial.alphaMap = alphaTexture;

//NORMAL MATERIAL
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

//MESH MATERIAL
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

//DEPTH MATERIAL
// const material = new THREE.MeshDepthMaterial();

//LAMBER MATERIAL
// const material = new THREE.MeshLambertMaterial();

//PHONG MATERIAL
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0xff58f8);

//TOON MATERIAL
// const material = new THREE.MeshToonMaterial();
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

//STANDART MATERIAL
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = alphaTexture;

//PHYSICAL MATERIAL
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = alphaTexture;

gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.001);

//Clearcoat
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;

// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001);
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001);

//Sheen
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);

//Iridescence
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [ 100, 800];

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001);
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001);
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1);

//Transmission
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5
gui.add(material, 'transmission').min(0).max(1).step(0.0001);
gui.add(material, 'ior').min(1).max(10).step(0.0001);
gui.add(material, 'thickness').min(0).max(1).step(0.0001);


const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128);

const sphere = new THREE.Mesh(sphereGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);

sphere.position.x = -1.5;
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * LIGHTS
 */
// const ambientLight = new THREE.AmbientLight( 0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

/**
 * ENV MAP
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

const clock = new THREE.Clock();

const loop = () => {

  const elapsedTime = clock.getElapsedTime();
  
  //Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  //Update controls
  controls.update();

  //Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop);
}
loop();