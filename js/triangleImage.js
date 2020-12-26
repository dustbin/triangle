class TriangleImage extends Image {
	constructor(width,height){
		super(null,width,height);
		this.triangles = [];
		this.triangleGroup = new THREE.Group();
	}
	addTriangle(){
		let triangle = Triangle.randomTriangle();
		triangle.scale.x = this.width;
		triangle.scale.y = this.height;
		triangle.position.z = -this.triangles.length;
		triangle.updateMatrix();
		this.triangles.push(triangle);
		this.triangleGroup.add(triangle);
	}
	render(renderer){
		let scene = new THREE.Scene();
		scene.add(this.triangleGroup);
		this.setTexture( Image.createTexture( renderer, this.width, this.height, scene) );
	}
}
