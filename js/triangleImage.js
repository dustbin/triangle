class TriangleImage extends Image {
	constructor(width,height){
		super(null,width,height);
		this.triangles = [];
		this.triangleGroup = new THREE.Group();
		this.score = Number.POSITIVE_INFINITY;
	}
	addTriangle(){
		let triangle = Triangle.randomTriangle();
		triangle.scale.x = this.width;
		triangle.scale.y = this.height;
		triangle.position.z = this.triangles.length-1000;
		this.triangles.push(triangle);
		this.triangleGroup.add(triangle);
	}
	render(renderer){
		let scene = new THREE.Scene();
		scene.add(this.triangleGroup);
		this.setTexture( Image.createTexture( renderer, this.width, this.height, scene) );
	}
	evaluate(image,renderer){
		if(!this.texture){
			this.render(renderer);
		}
		this.score = image.compare(this,renderer);
	}
	clone(){
		let temp,ret = new TriangleImage(this.width,this.height);
		for(let i=0;i<this.triangles.length;++i){
			temp = this.triangles[i].clone();
			ret.triangles.push(temp);
			ret.triangleGroup.add(temp);
		}
		return ret;
	}
	mutatedCopy(){
		let rand,temp,ret = new TriangleImage(this.width,this.height);
		rand = Math.floor(Math.random()*this.triangles.length);
		for(let i=0;i<this.triangles.length;++i){
			if(i==rand){
				temp = this.triangles[i].mutatedCopy();
			}else{
				temp = this.triangles[i].clone();
			}
			ret.triangles.push(temp);
			ret.triangleGroup.add(temp);
		}
		return ret;
	}
	static compare(a,b){
		return a.score-b.score;
	}
}
