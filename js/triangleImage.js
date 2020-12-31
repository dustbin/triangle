class TriangleImage {
	constructor(width,height=null){
		let source;
		if(width instanceof TriangleImage){
			source = width;
			this.width = source.width;
			this.height = source.height;
		}else{
			this.width = width;
			this.height = height;
		}
		if(source){
			this.triangles = Array.from(source.triangles);
		}else{
			this.triangles = [];
		}
		this.score = Number.POSITIVE_INFINITY;
	}
	addTriangle(){
		let triangle = Triangle.randomTriangle(this);
		triangle.scale.x = this.width;
		triangle.scale.y = this.height;
		triangle.position.z = this.triangles.length-1000;
		this.triangles.push(triangle);
	}
	render(renderer){
		let scene = new THREE.Scene();
		for(let i in this.triangles){
			scene.add(this.triangles[i]);
		}
		return Image.createTexture( renderer, this.width, this.height, scene);
	}
	evaluate(image,renderer){
		this.score = image.compare(new Image(this.render(renderer)),renderer);
	}
	mutatedCopy(){
		let rand,temp,ret = new TriangleImage(this.width,this.height);
		rand = Math.floor(Math.random()*this.triangles.length);
		for(let i=0;i<this.triangles.length;++i){
			if(i==rand){
				temp = this.triangles[i].mutatedCopy(this);
			}else{
				temp = this.triangles[i];
			}
			ret.triangles.push(temp);
		}
		return ret;
	}
	updateGroup(){
		if(!this.group){
			this.group = new THREE.Group();
		}
		for(let i in this.triangles){
			if(this.triangles[i].triParent != this){this.triangles[i] = this.triangles[i].clone(this);}
			this.group.add(this.triangles[i]);
		}
	}
	static compare(a,b){
		return a.score-b.score;
	}
}
