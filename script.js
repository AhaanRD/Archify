import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 500, 500);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(100, 200, 100);
scene.add(light);

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

      const geometry = new THREE.BoxGeometry(wallLength, 20, 5);
      const material = new THREE.MeshLambertMaterial({ color: 0x5555ff });
      const wall = new THREE.Mesh(geometry, material);

      wall.position.x = (x1 + x2) / 2 - centerX;
      wall.position.z = (y1 + y2) / 2 - centerY;
      wall.position.y = 10;
      wall.rotation.y = -angle;

      scene.add(wall);
    });
  });

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
