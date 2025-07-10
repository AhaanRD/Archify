import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

// SETUP SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// FOR IMAGE REFERENCE
const img = document.createElement("img");
img.src = "floorplan.jpeg"; 
img.style.position = "absolute";
img.style.top = "100px";
img.style.right = "100px";
img.style.width = "1500px";
img.style.border = "1px solid #ccc";
img.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
img.style.zIndex = "10";
document.body.appendChild(img);

// CAMERA (fixed)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, 400, 600);
camera.lookAt(0, -100, 0);

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(100, 200, 100);
scene.add(light);

// HELPER GRID
const grid = new THREE.GridHelper(1000, 20);
scene.add(grid);

// LOAD WALLS
fetch("walls.json")
  .then(res => res.json())
  .then(walls => {
    const allX = [], allY = [];
    walls.forEach(({ x1, y1, x2, y2 }) => {
      allX.push(x1, x2);
      allY.push(y1, y2);
    });

    const centerX = (Math.min(...allX) + Math.max(...allX)) / 2;
    const centerY = (Math.min(...allY) + Math.max(...allY)) / 2;

    walls.forEach(({ x1, y1, x2, y2 }) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const wallLength = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      const geometry = new THREE.BoxGeometry(wallLength, 50, 10);
      const material = new THREE.MeshLambertMaterial({ color: 0x5555ff });
      const wall = new THREE.Mesh(geometry, material);

      wall.position.x = (x1 + x2) / 2 - centerX;
      wall.position.z = (y1 + y2) / 2 - centerY;
      wall.position.y = 10;
      wall.rotation.y = -angle;

      scene.add(wall);
    });
  });

// Keyboard movement (basic WASD)
document.addEventListener('keydown', (event) => {
  const speed = 10;
  switch (event.key) {
    case 'w':
      camera.position.z -= speed;
      break;
    case 's':
      camera.position.z += speed;
      break;
    case 'a':
      camera.position.x -= speed;
      break;
    case 'd':
      camera.position.x += speed;
      break;
    case 'q':
      camera.position.y += speed;
      break;
    case 'e':
      camera.position.y -= speed;
      break;
  }
});

// RENDER LOOP
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
