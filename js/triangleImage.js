class TriangleImage extends Image {
	constructor(width,height=null){
		let source;
		if(width instanceof TriangleImage){
			source = width;
			width = source.width;
			height = source.height;
		}
		super(null,width,height);
		if(source){
			this.triangles = Array.from(source.triangles);
		}else{
			this.triangles = [];
		}
		this.score = Number.POSITIVE_INFINITY;
	}
	addTriangle(){
		let triangle = Triangle.randomTriangle();
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
		this.setTexture( Image.createTexture( renderer, this.width, this.height, scene) );
	}
	evaluate(image,renderer){
		if(!this.texture){
			this.render(renderer);
		}
		this.score = image.compare(this,renderer);
	}
	mutatedCopy(){
		let rand,temp,ret = new TriangleImage(this.width,this.height);
		rand = Math.floor(Math.random()*this.triangles.length);
		for(let i=0;i<this.triangles.length;++i){
			if(i==rand){
				temp = this.triangles[i].mutatedCopy();
			}else{
				temp = this.triangles[i];
			}
			ret.triangles.push(temp);
		}
		return ret;
	}
	static compare(a,b){
		return a.score-b.score;
	}
}
