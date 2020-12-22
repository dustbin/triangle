let camera, scene, renderer;

function resize(){
}

function render(){
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
window.onload = function(){
	let width = window.innerWidth;
	let height = window.innerHeight;
	camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	let triangle = new Triangle([100,100,0,0,100,0],1,0xffff00,.9);

	scene.add( triangle.mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	render()
};
