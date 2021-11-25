import * as THREE from './js/build/three.module.js';
import { BoxLineGeometry } from './js/examples/jsm/geometries/BoxLineGeometry.js';
import { VRButton } from './js/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from './js/examples/jsm/webxr/XRControllerModelFactory.js';

const clock = new THREE.Clock();

let container;
let camera, scene, raycaster, renderer;

let room;

let controller, controllerGrip;

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x505050 );

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
  camera.position.set( 0, 1.6, 3 );
  scene.add( camera );

  room = new THREE.LineSegments(
    new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
    new THREE.LineBasicMaterial( { color: 0x808080 } )
  );

  scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

  const light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );


  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;
  container.appendChild( renderer.domElement );

  function onSelectStart() {

    this.userData.isSelecting = true;

  }

  function onSelectEnd() {

    this.userData.isSelecting = false;

  }

  controller = renderer.xr.getController( 0 );
  controller.addEventListener( 'selectstart', onSelectStart );
  controller.addEventListener( 'selectend', onSelectEnd );
  controller.addEventListener( 'connected', function ( event ) {

    this.add( buildController( event.data ) );

  } );
  controller.addEventListener( 'disconnected', function () {

    this.remove( this.children[ 0 ] );

  } );
  scene.add( controller );

  const controllerModelFactory = new XRControllerModelFactory();

  controllerGrip = renderer.xr.getControllerGrip( 0 );
  controllerGrip.add( controllerModelFactory.createControllerModel( controllerGrip ) );
  scene.add( controllerGrip );

  window.addEventListener( 'resize', onWindowResize );

  document.body.appendChild( VRButton.createButton( renderer ) );

}

function buildController( data ) {

  let geometry, material;

  switch ( data.targetRayMode ) {

    case 'tracked-pointer':

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
      geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

      material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

      return new THREE.Line( geometry, material );

    case 'gaze':

      geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
      material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
      return new THREE.Mesh( geometry, material );

  }

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