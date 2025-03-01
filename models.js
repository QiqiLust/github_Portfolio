  //Import the THREE.js library
  import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
  // To allow for the camera to move around the scene
  import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
  // To allow for importing the .gltf file
  import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

  //Create a Three.JS Scene
  const scene = new THREE.Scene();
  //Create a new camera with positions and angles
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  //Keep track of the mouse position, so we can make the eye move
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  //Keep the 3D object on a global variable so we can access it later
  let object;

  //OrbitControls allow the camera to move around the scene
  let controls;

  //Set which object to render
  let objToRender = 'cyber_laptop';

  //Instantiate a loader for the .gltf file
  const loader = new GLTFLoader();

  //Load the file
  loader.load(
    `./models/${objToRender}/scene.gltf`,
    function (gltf) {
      object = gltf.scene;

      // ✅ ADDED CODE: Compute bounding box and center the model
      const bbox = new THREE.Box3().setFromObject(object);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());

      // Move object so it's centered at (0,0,0)
      object.position.sub(center);

      // Add object to the scene
      scene.add(object);

      // ✅ ADDED CODE: Adjust camera distance dynamically
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 130);
      const cameraDistance = maxDim / Math.tan(fov / 2);

      // ✅ Adjust Camera Angle: 45° left & 45° above
    const angle = Math.PI / 4; // 45 degrees in radians

    const x = -Math.sin(angle) * cameraDistance * 1.5; // Move left (-X)
    const y = Math.sin(angle) * cameraDistance * 0.2;  // Move up (+Y)
    const z = Math.cos(angle) * cameraDistance * 1.5;  // Move slightly back (+Z)

    camera.position.set(x, y, z); // 45° left (-X), 45° above (+Y), back (+Z)

      camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error(error);
    }
  );

  //Instantiate a new renderer and set its size
  const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
  renderer.setSize(window.innerWidth, window.innerHeight);

  //Add the renderer to the DOM
  document.getElementById("container3D").appendChild(renderer.domElement);

  // ✅ REMOVED STATIC CAMERA POSITION (Now it's dynamic from bounding box)

  //Add lights to the scene, so we can actually see the 3D model
  const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
  topLight.position.set(1000, 1000, 1000); //top-left-ish
  topLight.castShadow = true;
  scene.add(topLight);

  const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "cyber_laptop" ? 5 : 1);
  scene.add(ambientLight);

  //This adds controls to the camera, so we can rotate / zoom it with the mouse
  if (objToRender === "cyber_laptop") {
    controls = new OrbitControls(camera, renderer.domElement);
  }

  //Render the scene
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  // ✅ ADDED CODE: Update camera on window resize
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  //Start the 3D rendering
  animate();


  /* Skills Section animation */

  /*
  <div class="boxes">
  <div class="box">
      <div class="topic" data-aos="fade>HTML</div>
      <div class="per" data-aos="fade-right">90%</div>
  </div>
  <div class="box">
      <div class="topic" data-aos="fade-right">CSS</div>
      <div class="per" data-aos="fade-right">80%</div>
  </div>
  <div class="box">
      <div class="topic" data-aos="fade-right">JavaScript</div>
      <div class="per" data-aos="fade-right">30%</div>
  </div>
  <div class="box">
      <div class="topic" data-aos="fade-right">GitHub</div>
      <div class="per" data-aos="fade-right">50%</div>
  </div>
  <div class="box">
      <div class="topic" data-aos="fade-right" data-aos-duration="30" data-aos-delay="27">Unity & Blender</div>
      <div class="per" data-aos="fade-right" data-aos-duration="30" data-aos-delay="28">50%</div>
  </div>
  <div class="box">
      <div class="topic" data-aos="fade-right">C#/C++</div>
      <div class="per" data-aos="fade-right">60%</div>
  </div>
</div>
*/