// Basic setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 300, 300); // Move back and up
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(100, 200, 100);
scene.add(light);

// OrbitControls (for interactive camera movement)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Load wall data and build 3D scene
fetch("walls.json")
  .then((response) => response.json())
  .then((walls) => {
    // Compute center of all walls
    const allX = [], allY = [];
    walls.forEach(({ x1, x2, y1, y2 }) => {
      allX.push(x1, x2);
      allY.push(y1, y2);
    });

    const centerX = (Math.min(...allX) + Math.max(...allX)) / 2;
    const centerY = (Math.min(...allY) + Math.max(...allY)) / 2;

    // Add walls to scene
    walls.forEach(({ x1, y1, x2, y2 }) => {
      const wallLength = Math.hypot(x2 - x1, y2 - y1);
      const angle = Math.atan2(y2 - y1, x2 - x1);

      const geometry = new THREE.BoxGeometry(wallLength, 20, 5); // width, height, depth
      const material = new THREE.MeshLambertMaterial({ color: 0x5555ff });
      const wall = new THREE.Mesh(geometry, material);

      wall.position.x = (x1 + x2) / 2 - centerX;
      wall.position.z = (y1 + y2) / 2 - centerY;
      wall.position.y = 10; // raise by half height
      wall.rotation.y = -angle;

      scene.add(wall);
    });
  })
  .catch((err) => console.error("Failed to load walls.json:", err));

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
