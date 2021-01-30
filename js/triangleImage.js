class TriangleImage {
	constructor(width,height){
		this.width = width;
		this.height = height;
		this.triangles = [];
		this.score = Number.POSITIVE_INFINITY;
	}
	deconstructor(){
		for(let i in this.triangles){
			TrianglePool.addTriangle(this.triangles[i]);
		}
	}
	addTriangle(){
		let triangle = TrianglePool.getRandomTriangle();
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
				temp = TrianglePool.getTriangleMutatedClone(this.triangles[i]);
			}else{
				temp = TrianglePool.getTriangleClone(this.triangles[i]);
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
			this.group.add(this.triangles[i]);
		}
	}
	static compare(a,b){
		return a.score-b.score;
	}
}
