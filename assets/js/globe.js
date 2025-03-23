import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

let currentGlobeIndex = 0; 
let isRotatingToPointer = false;



const locations = {
  India: { lat: 25.5937, lon: 78.9629 },
  USA: { lat: 37.0902, lon: -95.7129 },
  Brazil: { lat: -14.2350, lon: -51.9253 },
  "South Africa": { lat: -30.5595, lon: 22.9375 },
  Australia: { lat: -25.2744, lon: 133.7751 },
  Russia: { lat: 61.5240, lon: 105.3188 },
  Antarctica: { lat: -82.8628, lon: 135.0 }
};




const globeContainer = document.getElementById("globe-container");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const resetBtn = document.getElementById("reset-button");


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
globeContainer.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.rotateSpeed = 0.4;
controls.minDistance = 1.1;
controls.maxDistance = 10;
controls.enablePan = false;


const geometry = new THREE.SphereGeometry(1, 32, 32);
const textureLoader = new THREE.TextureLoader();


const textureCache = {};
const loadTexture = (path) => {
  if (!textureCache[path]) {
    textureCache[path] = textureLoader.load(path);
  }
  return textureCache[path];
};



const globeTextures = [
  { name: "Temperature", path: 'assets/images/temperature_1.jpg' },          
  { name: "Atmosphere", path: 'assets/images/atmosphere.jpg' },                  
  { name: "Clouds", path: 'assets/images/clouds.jpg' },       
  { name: "Ozone", path: 'assets/images/ozone.jpg' }, 
  { name: "Deforestation", path: 'assets/images/earth.jpg' }, //will add later
  { name: "Ice Cover", path: 'assets/images/earth.jpg' },                
  { name: "Sea Level Rise", path: 'assets/images/earth.jpg' },           
  { name: "Pollution", path: 'assets/images/earth.jpg' },                

]

const textures = {
  current: loadTexture('assets/images/earth.jpg'),
  '10-years': loadTexture('assets/images/earth.jpg'),
  '50-years': loadTexture('assets/images/earth.jpg'),      // will add images
  '100-years': loadTexture('assets/images/earth.jpg'),
  '150-years': loadTexture('assets/images/earth.jpg'),
  '200-years': loadTexture('assets/images/earth.jpg'),
  '250-years': loadTexture('assets/images/earth.jpg'),
};


const globeText = document.getElementById("globe-text");


let currentPointer; 

function addPointerToGlobe(lat, lon) {
  if (currentPointer) globe.remove(currentPointer); 

  const radius = 1.005;  
  const pointerColor = 0xff0000;  


  const phi = lat * (Math.PI / 180);  
const theta = (lon - 180) * (Math.PI / 180);  

const x = -radius * Math.cos(phi) * Math.cos(theta);
const y = radius * Math.sin(phi);  
const z = radius * Math.cos(phi) * Math.sin(theta);



  const pointerGeometry = new THREE.SphereGeometry(0.02, 32, 32);
  const pointerMaterial = new THREE.MeshBasicMaterial({ color: pointerColor });
  const pointerMesh = new THREE.Mesh(pointerGeometry, pointerMaterial);

  pointerMesh.position.set(x, y, z);


  globe.add(pointerMesh);
  currentPointer = pointerMesh;  

  rotateGlobeToCenter(lat, lon);
}

function rotateGlobeToCenter(lat, lon) {

  const phi = lat * (Math.PI / 180);
  const theta = (lon - 180) * (Math.PI / 180);


  const targetRotationX = phi;  
  const targetRotationY = Math.PI/2 -theta;  

  isRotatingToPointer = true;

 
  function animateRotation() {
   
    globe.rotation.x += (targetRotationX - globe.rotation.x) * 0.1;
    globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.1;

   
    if (Math.abs(globe.rotation.x - targetRotationX) < 0.001 &&
        Math.abs(globe.rotation.y - targetRotationY) < 0.001) {
      globe.rotation.x = targetRotationX;  
      globe.rotation.y = targetRotationY;
      isRotatingToPointer = false; 
    }

    if (isRotatingToPointer) {
      requestAnimationFrame(animateRotation);  
    }
  }

  animateRotation();  
}








const material = new THREE.MeshStandardMaterial({ map: textures.current });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);


const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);


function animate() {
  requestAnimationFrame(animate);

 
  if (!isRotatingToPointer) {
    globe.rotation.y += 0.001;  
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();


const leftBtn = document.getElementById("left-button");
const rightBtn = document.getElementById("right-button");



leftBtn.addEventListener("click", () => {
  camera.position.set(0, 0, 5);
  slideGlobeEffect("left");  
});

rightBtn.addEventListener("click", () => {
  camera.position.set(0, 0, 5);
  slideGlobeEffect("right"); 
});


function slideGlobeEffect(direction) {
  const slideSpeed = 0.1;  
  const slideDistance = 3; 

 
  currentGlobeIndex = (currentGlobeIndex + (direction === "left" ? -1 : 1) + globeTextures.length) % globeTextures.length;

 
  globeText.textContent = globeTextures[currentGlobeIndex].name;

 
  const slideOut = setInterval(() => {
    globe.position.x += direction === "left" ? -slideSpeed : slideSpeed;
    if (Math.abs(globe.position.x) >= slideDistance) {
      clearInterval(slideOut);

      globe.material.map = loadTexture(globeTextures[currentGlobeIndex].path);
      globe.material.needsUpdate = true;
      globe.position.x = direction === "left" ? slideDistance : -slideDistance;  

     
      const slideIn = setInterval(() => {
        globe.position.x += direction === "left" ? -slideSpeed : slideSpeed;
        if (Math.abs(globe.position.x) <= 0.1) {  
          globe.position.x = 0;  
          clearInterval(slideIn);
        }
      }, 16);  
    }
  }, 16); 
}



document.getElementById("location-input").addEventListener("input", (e) => {
  const locationName = e.target.value;

  
  if (locations[locationName]) {
    addPointerToGlobe(locations[locationName].lat, locations[locationName].lon);
  }
});


const datalist = document.getElementById("suggestions");

Object.keys(locations).forEach(location => {
  const option = document.createElement("option");
  option.value = location; 
  datalist.appendChild(option);
});



document.addEventListener("DOMContentLoaded", function () {
  const timeSelect = document.getElementById("time-select");
  timeSelect.addEventListener("change", (event) => {
    const selectedTime = event.target.value;
    globe.material.map = textures[selectedTime];  
    globe.material.needsUpdate = true;
  });

 
  zoomInBtn.addEventListener("click", () => {
    camera.position.z -= 2; 
  });

  zoomOutBtn.addEventListener("click", () => {
    camera.position.z += 2;
  });

  resetBtn.addEventListener("click", () => {
    camera.position.set(0, 0, 5); 
    controls.reset();
  });
});

