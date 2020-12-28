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
	clone(){
		let ret = new Triangle(Array.from(this.sourceVertices),this.sourceColor,this.sourceOpacity);
		ret.applyMatrix4(this.matrix);
		return ret;
	}
	mutatedCopy(){
		let vertices = Array.from(this.sourceVertices);
		let color = this.sourceColor;
		let opacity = this.sourceOpacity;
		let r = Math.random()*10;
		if(r<6){
			let i = Math.floor(Math.random()*6);
			r = (Math.random()-0.5)*0.2;
			let temp = vertices[i] + r;
			if(temp<0){temp=0;}
			else if(temp>1){temp=1;}
			vertices[i] = temp;
		}else if(r<9){
		}else{
			r = (Math.random()-0.5)*0.5;
			let temp = opacity + r*r*r;
			if(temp<0){temp=0;}
			else if(temp>1){temp=1;}
			opacity = temp;
		}
		let ret = new Triangle(Triangle.orientVertices(vertices),color,opacity);
		ret.applyMatrix4(this.matrix);
		return ret;
	}
	static randomTriangle(){
		return new Triangle(
			Triangle.randomVertices(),
			Triangle.randomColor(),
			Math.random()
		);
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
