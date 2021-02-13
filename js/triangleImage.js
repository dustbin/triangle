class TriangleImage extends THREE.Group {
	constructor(width,height){
		super();
		this.width = width;
		this.height = height;
		this.scale.x = this.width;
		this.scale.y = this.height;
		this.triangles = [];
		this.score = Number.POSITIVE_INFINITY;
	}
	deconstructor(){
		for(let i in this.triangles){
			this.remove(this.triangles[i]);
			TrianglePool.addTriangle(this.triangles[i]);
		}
	}
	addTriangle(){
		let triangle = TrianglePool.getRandomTriangle();
		triangle.position.z = this.triangles.length-1000;
		this.triangles.push(triangle);
		this.add(triangle);
	}
	render(renderer){
		this.position.x = 0;
		this.position.y = 0;
		let scene = new THREE.Scene();
		scene.add(this);
		return Image.createTexture( renderer, this.width, this.height, scene);
	}
	evaluate(image,renderer){
		this.score = image.compare(new Image(this.render(renderer)),renderer);
	}
	clone(){
		let temp,ret = new TriangleImage(this.width,this.height);
		for(let i=0;i<this.triangles.length;++i){
			temp = TrianglePool.getTriangleClone(this.triangles[i]);
			ret.triangles.push(temp);
			ret.add(temp);
		}
		return ret;
	}
	mutatedClone(){
		let rand,temp,ret = new TriangleImage(this.width,this.height);
		rand = Math.floor(Math.random()*this.triangles.length);
		for(let i=0;i<this.triangles.length;++i){
			if(i==rand){
				temp = TrianglePool.getTriangleMutatedClone(this.triangles[i]);
			}else{
				temp = TrianglePool.getTriangleClone(this.triangles[i]);
			}
			ret.triangles.push(temp);
			ret.add(temp);
		}
		return ret;
	}
	static compare(a,b){
		return a.score-b.score;
	}
}
