let camera, scene, renderer;
let triangles = [];
let image;

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

	new THREE.TextureLoader().load(
		"test.jpg",
		function(texture){
			image = new Image(texture);
			image.translateX(image.width()*-1);
			image.translateY(image.height()/-2);
			image.translateZ(-1);
			scene.add(image.mesh);
			image.buildWeights(renderer);
		}
	);

	triangles.push(new Triangle([0,0,100,0,100,100],1,0xffff00,0.5));
	triangles.push(new Triangle([50,0,150,0,150,100],2,0xffff00,0.3));
	scene.add( triangles[0].mesh );
	scene.add( triangles[1].mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0x000000,1);
	document.body.appendChild( renderer.domElement );

	render()
};
