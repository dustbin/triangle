class TriangleImage extends Image {
	constructor(width,height){
		super(null,width,height);
		this.triangles = [];
		this.triangleGroup = new THREE.Group();
	}
	addTriangle(){
		let triangle = Triangle.randomTriangle(this.triangles.length,this.width,this.height);
		this.triangles.push(triangle);
		this.triangleGroup.add(triangle.mesh);
	}
	render(renderer){
		let scene = new THREE.Scene();
		scene.add(this.triangleGroup);
		this.setTexture( Image.createTexture( renderer, this.width, this.height, scene) );
	}
}
