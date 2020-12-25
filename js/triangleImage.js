class TriangleImage extends THREE.Group {
	constructor(width,height){
		super();
		this.width = width;
		this.height = height;
		this.triangles = [];
	}
	addTriangle(){
		let triangle = Triangle.randomTriangle(this.triangles.length,this.width,this.height);
		this.triangles.push(triangle);
		this.add(triangle.mesh);
	}
}
