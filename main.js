import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //used for camera movement in 3d space.

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene(); //init new scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //fov, aspect ratio, near, far

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new THREE.TextureLoader();

//scene
// scene.background = loader.load('img/back.png')

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);

camera.position.z = 5;

//skybox / cubemap background
//https://jaxry.github.io/panorama-to-cubemap/ 

const cubeGeometry = new THREE.BoxGeometry(400,400,400); //x y z 	new Box geometry
const cubeMeshBasicMaterials = [ // new MeshBasicMaterial(s) used for new Box geometry

	// https://threejs.org/docs/#api/en/materials/Material 		class Materials
	// https://threejs.org/docs/#api/en/textures/Texture 	interface Texture
	// https://threejs.org/docs/#api/en/materials/MeshBasicMaterial 	class MeshBasicMaterial extends Materials implements Texture
	
	// https://threejs.org/docs/#api/en/loaders/TextureLoader

	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/img/front.png'), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/img/back.png'), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/img/top.png'), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/img/bottom.png'), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/img/left.png'), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/img/back.png'), side: THREE.DoubleSide})
];

const cubeMaterial = new THREE.Mesh(cubeGeometry, cubeMeshBasicMaterials); //apply MeshBasicMaterial(s) to Geometry
scene.add(cubeMaterial)


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