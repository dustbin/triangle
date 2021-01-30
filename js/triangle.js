class Triangle extends THREE.Mesh {
	constructor(vertices,color,opacity){
		let geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			'position',
			new THREE.BufferAttribute(Triangle.triangle,3)
		);
		super(
			geometry,
			new THREE.MeshBasicMaterial( { color: color, opacity: opacity, transparent: true } )
		)
		this.vertices = vertices;
	}
	set vertices(vertices){
		this.sourceVertices = vertices;
		let matrix = new THREE.Matrix3().set(
			vertices[0],vertices[2],vertices[4],
			vertices[1],vertices[3],vertices[5],
			1,1,1
		).multiply(Triangle.triangleMatrix);
		let a = matrix.elements[0];
		let c = matrix.elements[1];
		let b = matrix.elements[3];
		let d = matrix.elements[4];
		let x = matrix.elements[6];
		let y = matrix.elements[7];
		this.matrix.identity();
		this.applyMatrix4(
			new THREE.Matrix4().set(
				a,b,0,x,
				c,d,0,y,
				0,0,1,0,
				0,0,0,1
			)
		);
	}
	get vertices(){
		return this.sourceVertices;
	}
	set color(color){
		this.material.color.setHex(color);
	}
	get color(){
		return this.material.color.getHex();
	}
	set opacity(opacity){
		this.material.opacity = opacity;
	}
	get opacity(){
		return this.material.opacity;
	}
	clone(){
		let ret = new Triangle(
			Array.from(this.sourceVertices),
			this.color,
			this.opacity,
		);
		return ret;
	}
	static randomVertices(){
		return Triangle.orientVertices([
			Math.random(),
			Math.random(),
			Math.random(),
			Math.random(),
			Math.random(),
			Math.random()
		]);
	}
	static orientVertices(vertices){
		let x0 = vertices[0];
		let y0 = vertices[1];
		let x1 = vertices[2];
		let y1 = vertices[3];
		let x2 = vertices[4];
		let y2 = vertices[5];
		if((x1-x0)*(y2-y0)-(y1-y0)*(x2-x0)>0){
			return [x0,y0,x1,y1,x2,y2];
		}else{
			return [x0,y0,x2,y2,x1,y1];
		}
	}
	static randomColor(){
		return Math.floor(Math.random()*0x1000000);
	}
	static triangle = new Float32Array( [
		0,0,0,
		1,0,0,
		1,1,0
	] );
	static triangleMatrix = new THREE.Matrix3().set(
		0,1,1,
		0,0,1,
		1,1,1
	).invert();
}
