import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //used for camera movement in 3d space.
import { fragmentShader, vertexShader } from "./glsl.js"

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene(); //init new scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 48000); //fov, aspect ratio, near, far

const controls = new OrbitControls(camera, renderer.domElement);

//bg https://threejs.org/docs/index.html?q=cube#api/en/textures/CubeTexture
/*
	right, left
	top, bottom
	front, rear
*/


const aquarium_geometry = new THREE.BoxGeometry(16384,4096,16384);
const aquarium_mesh = new THREE.Mesh(aquarium_geometry, aquarium_mat);

scene.add(aquarium_mesh);


//skybox

scene.background = skybox_textures;
// scene.background = new THREE.Color(0xFFFFFFFF);


//lighting


// aquarium.position.copy(light.position)




camera.position.z = 2400;

function animate() {
	requestAnimationFrame(animate); 
	//constantly callback animate() function. i.e. requestAnimationFrame(animate) -> requestAnimationFrame(animate) ... 
	//frequency of callback will match the display refresh rate. i.e. 60hz = 60 cycles / frame per second
	
	controls.update(); //update scope position
	//https://github.com/mrdoob/three.js/blob/bd2051d642bc6347b8ac21c08d800baaa41941f4/examples/jsm/controls/OrbitControls.js#L186

	renderer.render(scene, camera); //render updated scene.

}

//start animating.
animate();

//scale objects when viewport updates.
window.addEventListener('resize', function() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});