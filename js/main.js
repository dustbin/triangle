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

	for(let s=0;s<speciesCount;++s){
		species[s].tick(renderer);
		species.push(species[s].mutate(renderer));
	}
	species.sort(Species.compare);
	species = species.slice(0,speciesCount);

	for(let s=0;s<speciesCount;++s){
		species[s].updateGroup();
		species[s].group.position.x = (image.width + 5) * s;
		species[s].group.position.y = height - image.height;
		scene.add(species[s].group);
	}

	renderer.render(scene, camera);

	for(let s=0;s<speciesCount;++s){
		scene.remove(species[s].group);
	}
}
function onTextureLoad(texture){
	image = new Image(texture);

	width = (image.width+5)*speciesCount-5;
	height = image.height;

	camera = new THREE.OrthographicCamera( 0, width, height, 0, -1);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setClearColor(0x000000,1);
	renderer.setSize( width, height );
	document.getElementById("canvas").appendChild( renderer.domElement );

	let weights = new WeightImage(image);
	weights.render(renderer);
	image.setWeight(weights);

	let t;
	for(let i=0;i<speciesCount*3;++i){
		t = new TriangleImage(image.width,image.height)
		t.addTriangle();
		t.evaluate(image,renderer);
		species.push(new Species(t,populationCount,image));
	}
	species.sort(Species.compare);
	species = species.slice(0,speciesCount);

	let temp;
	for(let s=0;s<speciesCount;++s){
		temp = new Rectangle(0x000000,1);
		temp.scale.x = image.width;
		temp.scale.y = image.height;
		temp.position.x = (image.width + 5) * s;
		temp.position.y = height - image.height;
		temp.position.z = -1001;
		scene.add(temp);
	}

	render();
}
window.onload = function(){
	new THREE.TextureLoader().load( "images/test.jpg", onTextureLoad );
	let img = document.createElement("img");
	img.src = "images/test.jpg";
	document.getElementById("menu").appendChild( img );
};
