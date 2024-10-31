import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //used for camera movement in 3d space.
import { fragmentShader, vertexShader } from "./glsl.js"

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene(); //init new scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 48000); //fov, aspect ratio, near, far

const controls = new OrbitControls(camera, renderer.domElement);

let loader = new THREE.TextureLoader();
loader.setPath('./src');

let ctloader = new THREE.CubeTextureLoader();
ctloader.setPath('./src');

//bg https://threejs.org/docs/index.html?q=cube#api/en/textures/CubeTexture
/*
	right, left
	top, bottom
	front, rear
*/

//used for skybox (cube) https://jaxry.github.io/panorama-to-cubemap/
const skybox_textures = ctloader.load([
	'/px-right.png', //right
	'/nx-left.png', //left

	'/py-top.png', //top 
	'/ny-bottom.png', //bottom

	'/pz-front.png', //front 
	'/nz-back.png', //rear
]);

console.log(ctloader.load('/nx-left.png'));

const floor = loader.load('/floor.jpg');
const underwater = loader.load('/underwater.jpg');
const surface = loader.load('/surface.jpg');

//https://threejs.org/examples/webgl_water.html
//scene
//mesh contains, geometry (shape) and material (texture)

const aquarium_mat = new THREE.ShaderMaterial({

	// we require custom shader due to ShaderLib not having rectangular prism
	// vertexShader: shader.vertexShader,
	// fragmentShader: shader.fragmentShader,
	// uniforms: shader.uniforms, 
	
	vertexShader,	
	fragmentShader,

	uniforms: {
		//apply textured cube shaders to meshes
		tfloor: {value: floor},
		tunderwater: {value: underwater},
		tsurface: {value: surface},
	},

	transparent: true,
	opacity: 0.80,
	depthWrite: false, //set as false, allows for layering of opposing mesh ie. looking through front, rear will render. and not vanish
	side: THREE.DoubleSide	

});

// const sphere_mat = new THREE.MeshBasicMaterial({
	// map: loader.load('/src/background.jpg');
// 	side: THREE.DoubleSide,
// })

//sphere geometry
// const sphere_geometry = new THREE.SphereGeometry(20480,8,8);
// const sphere = new THREE.Mesh(sphere_geometry, sphere_mat)

const aquarium_geometry = new THREE.BoxGeometry(2048,1024,1024);
const aquarium = new THREE.Mesh(aquarium_geometry, aquarium_mat);

// scene.add(sphere);
scene.add(aquarium);

//skybox
scene.background = skybox_textures;


//lighting


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