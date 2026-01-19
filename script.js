import * as THREE from 'three';

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);

//box
const material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
const mesh = new THREE.Mesh(geometry, material);

//wireframe
const wireframeGeometry = new THREE.WireframeGeometry(geometry);
const wireframeMaterial = new THREE.LineBasicMaterial({
  color: 'white'
});
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
// wireframe.material.depthTest = false;
// wireframe.renderOrder = 1;

//cube object
const cube = new THREE.Object3D();
cube.add(mesh)
cube.add(wireframe);
//cube.scale.x = 2;

//Rotation
// cube.rotation.reorder('YXZ');
// cube.rotation.x = Math.PI * 1.34
// cube.rotation.y = Math.PI * 0.25;

scene.add(cube);

//Group
const group = new THREE.Group();
scene.add(group);
group.add(cube);

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
group.rotation.y = Math.PI * 0.25;

const axesHelper = new THREE.AxesHelper(1.5);
// axesHelper.position.z = 0.5;
// axesHelper.position.y = 0.5;
scene.add(axesHelper);

const size = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
camera.position.y = 1.7;
//camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -0.5)
// const center = new THREE.Vector3()
//   .addVectors(cube.position, purpleCube.position)
//   .multiplyScalar(0.5);

// camera.position.set(center.x, 1, 3);
// camera.lookAt(center);
camera.lookAt(cube.position);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);

renderer.render(scene, camera);