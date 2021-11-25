import * as THREE from './js/build/three.module.js';
import { BoxLineGeometry } from './js/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from './js/examples/jsm/webxr/VRButton.js';

const clock = new THREE.Clock();

let container;
let camera, scene, renderer;

let room;

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x505050 );

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
  camera.position.set( 0, 1.6, 50 );
  scene.add( camera );

  const light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );


  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(0, 1, -5)
  scene.add( cube );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  container.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize );

  document.body.appendChild( VRButton.createButton( renderer ) );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  renderer.setAnimationLoop( render );

}

function render() {

  const delta = clock.getDelta() * 60;

  renderer.render( scene, camera );

}