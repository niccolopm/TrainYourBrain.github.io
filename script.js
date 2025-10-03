// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("brain-container").appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5).normalize();
scene.add(light);

// Load brain model
const loader = new THREE.GLTFLoader();
let brain;
loader.load('<iframe src="https://clara.io/embed/c67b5288-7325-4a2f-a7aa-c1e8d74ebe44?renderer=webgl&timeline=true&autoplay=false&bgColor=0xffffff&tools=false" width="400" height="300" allowfullscreen></iframe>', function(gltf) {
  brain = gltf.scene;
  scene.add(brain);
  brain.rotation.y = Math.PI; // adjust orientation
});

camera.position.z = 3;

// Raycaster for hover detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Brain area metadata
const brainAreas = {
  "hippocampus": {
    name: "Hippocampus",
    function: "Memory formation and spatial navigation",
    link: "games/memory.html"
  },
  "prefrontal": {
    name: "Prefrontal Cortex",
    function: "Decision-making, planning, and attention",
    link: "games/attention.html"
  }
};

// Mouse move event
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  if (brain) brain.rotation.y += 0.002;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const objName = intersects[0].object.name.toLowerCase();
    if (brainAreas[objName]) {
      const info = brainAreas[objName];
      document.getElementById("info-card").classList.remove("hidden");
      document.getElementById("area-name").textContent = info.name;
      document.getElementById("area-function").textContent = info.function;
      document.getElementById("train-link").href = info.link;
    }
  }
  renderer.render(scene, camera);
}
animate();
