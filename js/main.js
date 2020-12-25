let camera, scene, renderer;
let triangleImages = [];
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
	camera = new THREE.OrthographicCamera( 0, width, height, 0, -1);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	new THREE.TextureLoader().load(
		"test.jpg",
		function(texture){
			image = new Image(texture);
			image.translateX((image.width()+5)*0+5);
			image.translateY((image.height()+5)*0+5);
			scene.add(image.mesh);

			image.buildWeights(renderer);
			image.meshWeights.translateX((image.width()+5)*1+5);
			image.meshWeights.translateY((image.height()+5)*0+5);
			scene.add(image.meshWeights);
			
			triangleImages.push(new TriangleImage(image.width(),image.height()));
			triangleImages[0].addTriangle();
			triangleImages[0].translateX((image.width()+5)*2+5);
			triangleImages[0].translateY((image.height()+5)*0+5);
			scene.add(triangleImages[0]);
		}
	);


	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0x000000,1);
	document.body.appendChild( renderer.domElement );

	render()
};
