class Triangle extends THREE.Mesh {
	constructor(vertices,color,opacity){
		let f32a = new Float32Array( [
			vertices[0],vertices[1],0,
			vertices[2],vertices[3],0,
			vertices[4],vertices[5],0
		] )
		let geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			'position',
			new THREE.BufferAttribute(f32a, 3)
		);
		let material = new THREE.MeshBasicMaterial( { color: color, opacity: opacity, transparent: true } );
		super(geometry,material);
		this.meshVertices = f32a;
		this.meshMaterial = material;
		this.sourceVertices = vertices;
		this.sourceColor = color;
		this.sourceOpacity = opacity;
	}
	setVertices(vertices){
		this.meshVertices[0]=vertices[0];
		this.meshVertices[1]=vertices[1];
		this.meshVertices[3]=vertices[2];
		this.meshVertices[4]=vertices[3];
		this.meshVertices[6]=vertices[4];
		this.meshVertices[7]=vertices[5];
		this.sourceVertices = vertices;
	}
	setColor(color){
		this.meshMaterial.color = color;
		this.sourceColor = color;
	}
	setOpacity(opacity){
		this.meshMaterial.opacity = opacity;
		this.sourceOpacity = opacity;
	}
	resetMatrix(){
		this.matrix.identity();
	}
	clone(){
		let ret = new Triangle(
			Array.from(this.sourceVertices),
			this.sourceColor,
			this.sourceOpacity,
		);
		ret.applyMatrix4(this.matrix);
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
}
