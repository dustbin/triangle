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
	mutatedCopy(){
		let vertices = Array.from(this.sourceVertices);
		let color = this.sourceColor;
		let opacity = this.sourceOpacity;
		let rand = Math.random()*10;
		if(rand<6){
			let i = Math.floor(rand);
			rand = (Math.random()-0.5)*0.2;
			let temp = vertices[i] + rand;
			if(temp<0){temp=0;}
			else if(temp>1){temp=1;}
			vertices[i] = temp;
		}else if(rand<9){
			let i = Math.floor(rand)-6;
			let r = Math.floor(color/0x10000)%0x100;
			let g = Math.floor(color/0x100)%0x100;
			let b = (color)%0x100;

			let c;
			if(i==0){c = r;}
			else if(i==1){c = g;}
			else{c = b;}

			c += Math.round((Math.random()-0.5)*0.2*0x100);
			if(c>0xff){c=0xff;}
			if(c<0x00){c=0x00;}

			if(i==0){r = c;}
			else if(i==1){g = c;}
			else{b = c;}

			color = r*0x10000+g*0x100+b;
		}else{
			rand = (Math.random()-0.5)*0.2;
			let temp = opacity + rand;
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
