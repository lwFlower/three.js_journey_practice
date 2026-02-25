import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded',
    particlesColor: '#ffffff',
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        toonMaterial.color.set(parameters.materialColor);
    })

gui
    .addColor(parameters, 'particlesColor')
    .onChange(() => {
        particlesMaterial.color.set(parameters.particlesColor);
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Textures
const textureLoader = new THREE.TextureLoader();
const toonTexture = textureLoader.load('/textures/gradients/3.jpg');
toonTexture.magFilter = THREE.NearestFilter;

const particlesTexture = textureLoader.load('/textures/particles/8.png');

//Material
const toonMaterial = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: toonTexture,
})

//Objects
const objectGap = 4;

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    toonMaterial
);
//torus.position.x = -objectGap;

const sphere = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    toonMaterial
);

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    toonMaterial
);
//torusKnot.position.x = objectGap;

torus.position.y = - objectGap * 0;
sphere.position.y = - objectGap * 1;
torusKnot.position.y = - objectGap * 2;

torus.position.x = 2;
sphere.position.x = -2;
torusKnot.position.x = 2;

scene.add(torus, sphere, torusKnot);

const sceneMeshes = [ torus, sphere, torusKnot ];

//Particles
//Geom
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = objectGap / 2 - Math.random() * objectGap * sceneMeshes.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

//Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.3,
    transparent: true,
    alphaMap: particlesTexture,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

//Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
//Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Scroll
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    const newSection = Math.round(scrollY / sizes.height);

    if (newSection !== currentSection) {
        currentSection = newSection;

        gsap.to(
            sceneMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+= 6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

//Cursor
const cursor = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let prevTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - prevTime;
    prevTime = elapsedTime;

    //Animate camera
    camera.position.y = - scrollY / sizes.height * objectGap;

    const parallaxX = cursor.x * 0.75;
    const parallaxY = - cursor.y * 0.75;

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime;

    //Animate
    for (const mesh of sceneMeshes) {
        mesh.rotation.x += deltaTime * 0.5;
        mesh.rotation.y += deltaTime * 0.15;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()