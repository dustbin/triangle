let camera, scene, renderer;
let speciesCount = 5;
let populationCount = 10;
let species = [];
let image;
let height, width;

function resize(){
}

function render(){
	requestAnimationFrame(render);
	let test = new TriangleImage(species[0][0]);
	test.addTriangle();
	test.evaluate(image,renderer);
	species[speciesCount]=[test];
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
	}
	species.sort(function(a,b){return TriangleImage.compare(a[0],b[0]);});

	for(let s=0;s<speciesCount;++s){
		species[s][0].updateGroup();
		species[s][0].group.position.x = (image.width + 5) * (s+1) + 5;
		species[s][0].group.position.y = height - image.height - 5;
		scene.add(species[s][0].group);
	}

	renderer.render(scene, camera);

	for(let s=0;s<speciesCount;++s){
		scene.remove(species[s][0].group);
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
		"images/test.jpg",
		function(texture){
			image = new Image(texture);
			image.position.x = 5;
			image.position.y = height - image.height - 5;
			scene.add(image);

			let weights = new WeightImage(image);
			weights.render(renderer);
			image.setWeight(weights);

			let t,test = [];
			for(let i=0;i<speciesCount*3;++i){
				t = new TriangleImage(image.width,image.height)
				t.addTriangle();
				t.evaluate(image,renderer);
				test.push(t);
			}
			test.sort(TriangleImage.compare);

			let temp;
			for(let s=0;s<speciesCount;++s){
				species[s] = [test[s]];

				temp = new Rectangle(0x000000,1);
				temp.scale.x = image.width;
				temp.scale.y = image.height;
				temp.position.x = (image.width + 5) * (s+1) + 5;
				temp.position.y = height - image.height - 5;
				temp.position.z = -1001;
				scene.add(temp);
			}

			render();
		}
	);
};
