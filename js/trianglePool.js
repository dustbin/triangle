class TrianglePool{
	static pool = [];
	static getTriangle(vertices,color,opacity){
		if(TrianglePool.pool.length>0){
			let triangle = TrianglePool.pool.pop();
			triangle.setVertices(vertices);
			triangle.setColor(color);
			triangle.setOpacity(opacity);
			triangle.resetMatrix();
			return triangle;
		}
		return new Triangle(vertices,color,opacity);
	}
	static addTriangle(triangle){
		TrianglePool.pool.shift(triangle);
	}
	static getRandomTriangle(){
		return TrianglePool.getTriangle(
			Triangle.randomVertices(),
			Triangle.randomColor(),
			Math.random()
		);
	}
	static getTriangleClone(triangle){
		let ret = TrianglePool.getTriangle(
			Array.from(triangle.sourceVertices),
			triangle.sourceColor,
			triangle.sourceOpacity
		);
		ret.applyMatrix4(triangle.matrix);
		return ret;
	}
	static getTriangleMutatedClone(triangle){
		let vertices = Array.from(triangle.sourceVertices);
		let color = triangle.sourceColor;
		let opacity = triangle.sourceOpacity;

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
		let ret = TrianglePool.getTriangle(vertices,color,opacity);
		ret.applyMatrix4(triangle.matrix);
		return ret;
	}
}
