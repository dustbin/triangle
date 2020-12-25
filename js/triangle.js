class Triangle {
	constructor(verts,z,color,opacity){
		this.geometry = new THREE.BufferGeometry();
		this.vertices = new Float32Array( [
			verts[0],verts[1],0,
			verts[2],verts[3],0,
			verts[4],verts[5],0
		] );
		this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
		this.material = new THREE.MeshBasicMaterial( { color: color, opacity: opacity, transparent: true } );
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.mesh.translateZ(-z);
	}
	static randomTriangle(z,width,height){
		return new Triangle(
			Triangle.randomVerts(width,height),
			z,
			Triangle.randomColor(),
			Math.random()
		);
	}
	static randomVerts(width,height){
		let x0 = Math.random()*width;
		let y0 = Math.random()*height;
		let x1 = Math.random()*width;
		let y1 = Math.random()*height;
		let x2 = Math.random()*width;
		let y2 = Math.random()*height;
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
