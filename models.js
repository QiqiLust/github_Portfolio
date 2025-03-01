// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// Import OrbitControls for camera movement
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// Import GLTFLoader (this supports BOTH .gltf and .glb files)
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.js Scene
const scene = new THREE.Scene();

// Create a new Perspective Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Keep track of the 3D object globally
let object;
let controls;

// Define the correct file path for the .glb model
const modelPath = "./models/cyber_laptop.glb"; // Ensure this is the correct location

// Instantiate the GLTFLoader
const loader = new GLTFLoader();

// Show loading screen
document.getElementById("loadingScreen").style.display = "flex";

// Load the .glb file
loader.load(
    modelPath,
    function (gltf) {
        object = gltf.scene;

        // Compute bounding box to center the model
        const bbox = new THREE.Box3().setFromObject(object);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());

        // Move object so it's centered at (0,0,0)
        object.position.sub(center);

        // Add object to the scene
        scene.add(object);

        // Adjust camera distance dynamically
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = maxDim / Math.tan(fov / 2);

        // Adjust Camera Position: 45° left & 45° above
        const angle = Math.PI / 4;
        const x = -Math.sin(angle) * cameraDistance * 1.5; // Left (-X)
        const y = Math.sin(angle) * cameraDistance * 0.2;  // Up (+Y)
        const z = Math.cos(angle) * cameraDistance * 1.5;  // Slightly back (+Z)

        camera.position.set(x, y, z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Hide loading screen when model is fully loaded
        document.getElementById("loadingScreen").style.display = "none";
    },
    function (xhr) {
        // Update loading progress
        let percent = (xhr.loaded / xhr.total) * 100;
        document.getElementById("loadingBar").style.width = percent + "%";
        document.getElementById("loadingText").innerText = `Loading... ${Math.round(percent)}%`;
    },
    function (error) {
        console.error('Error loading model:', error);
        document.getElementById("loadingText").innerText = "Failed to load!";
    }
);

// Create the WebGL Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Add Lights
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(1000, 1000, 1000);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);

// Enable OrbitControls
controls = new OrbitControls(camera, renderer.domElement);

// Function to animate the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Adjust camera on window resize
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the 3D rendering
animate();