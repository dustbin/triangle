let camera, scene, renderer;
let triangleImages = [];
let image;
let result;

function resize(){
}

function render(){
	requestAnimationFrame(render);

	let t0 = triangleImages[0];
	t0.position.x = (image.width+5)*1+5;
	t0.position.y = 5;
	let t1 = triangleImages[1];
	t1.position.x = (image.width+5)*2+5;
	t1.position.y = 5;
	let t2 = triangleImages[2];
	t2.position.x = (image.width+5)*3+5;
	t2.position.y = 5;
	scene.add(t0,t1,t2);

	renderer.render(scene, camera);

	scene.remove(t0,t1,t2);

	triangleImages = [t0,t1,t2];
	let t,i;
	for(i=0;i<3;++i){
		t = t0.mutatedCopy();
		t.addTriangle();
		t.evaluate(image,renderer);
		triangleImages.push(t);
	}
	for(i=0;i<3;++i){
		t = t1.mutatedCopy();
		t.addTriangle();
		t.evaluate(image,renderer);
		triangleImages.push(t);
	}
	for(i=0;i<3;++i){
		t = t2.mutatedCopy();
		t.addTriangle();
		t.evaluate(image,renderer);
		triangleImages.push(t);
	}
	triangleImages.sort(TriangleImage.compare);
}
window.onload = function(){
	let width = window.innerWidth;
	let height = window.innerHeight;
	camera = new THREE.OrthographicCamera( 0, width, height, 0, -1);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0x000000,1);
	document.body.appendChild( renderer.domElement );

	new THREE.TextureLoader().load(
		"test.jpg",
		function(texture){
			image = new Image(texture);
			image.translateX((image.width+5)*0+5);
			image.translateY((image.height+5)*0+5);
			scene.add(image);

			let weights = new WeightImage(image);
			weights.render(renderer);
			image.setWeight(weights);

			for(let t,i=0;i<10;++i){
				t = new TriangleImage(image.width,image.height)
				t.addTriangle();
				t.evaluate(image,renderer);
				triangleImages.push(t);
			}
			triangleImages.sort(TriangleImage.compare);

			render();
		}
	);
};
