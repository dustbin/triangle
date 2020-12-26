class Triangle extends THREE.Mesh {
	constructor(vertices,color,opacity){
		let geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			'position',
			new THREE.BufferAttribute(
				new Float32Array( [
					vertices[0],vertices[1],0,
					vertices[2],vertices[3],0,
					vertices[4],vertices[5],0
				] ),
				3
			)
		);
		let material = new THREE.MeshBasicMaterial( { color: color, opacity: opacity, transparent: true } );
		super(geometry,material);
		this.sourceVertices = vertices;
		this.sourceColor = color;
		this.sourceOpacity = opacity;
	}
	static randomTriangle(){
		return new Triangle(
			Triangle.randomVertices(),
			Triangle.randomColor(),
			Math.random()
		);
	}
	static randomVertices(){
		let x0 = Math.random();
		let y0 = Math.random();
		let x1 = Math.random();
		let y1 = Math.random();
		let x2 = Math.random();
		let y2 = Math.random();
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
