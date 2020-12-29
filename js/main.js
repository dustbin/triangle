let camera, scene, renderer;
let speciesCount = 3;
let populationCount = 4;
let species = [];
let test = [];
let image;
let height, width;

function resize(){
}

function render(){
	requestAnimationFrame(render);
	let temp,t;
	for(let s=0;s<speciesCount;++s){
		temp = species[s][0];
		species[s] = [temp];
		for(i=0;i<populationCount;++i){
			t = temp.mutatedCopy();
			t.evaluate(image,renderer);
			species[s].push(t);
		}	
		species[s].sort(TriangleImage.compare);
		species[s][0].position.x = (image.width + 5) * (s+1) + 5;
		species[s][0].position.y = height - image.height - 5;
		scene.add(species[s][0]);
	}
	species.sort(function(a,b){TriangleImage.compare(a[0],b[0]);});

	renderer.render(scene, camera);

	for(let s=0;s<speciesCount;++s){
		scene.remove(species[s][0]);
	}
}
window.onload = function(){
	width = window.innerWidth;
	height = window.innerHeight;
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
			image.position.x = 5;
			image.position.y = height - image.height - 5;
			scene.add(image);

			let weights = new WeightImage(image);
			weights.render(renderer);
			image.setWeight(weights);

			for(let t,i=0;i<10;++i){
				t = new TriangleImage(image.width,image.height)
				t.addTriangle();
				t.evaluate(image,renderer);
				test.push(t);
			}
			test.sort(TriangleImage.compare);
			species[0] = [test[0]];
			species[1] = [test[1]];
			species[2] = [test[2]];

			render();
		}
	);
};
