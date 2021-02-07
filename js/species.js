class Species {
	constructor(base,size,image){
		this.species = [base];
		this.size = size;
		this.image = image;
	}
	deconstructor(){
		for(let i=0;i<this.species.length;++i){
			this.species[i].deconstructor();
		}
	}
	tick(renderer){
		for(let i=1;i<this.species.length;++i){
			this.species[i].deconstructor();
		}
		let t,temp = this.species[0];
		this.species = [temp];
		for(let i=0;i<this.size;++i){
			t = temp.mutatedCopy();
			t.evaluate(this.image,renderer);
			this.species.push(t);
		}
		this.species.sort(TriangleImage.compare);
	}
	mutate(renderer){
		let ret = this.species[0].clone();
		ret.addTriangle();
		ret.evaluate(this.image,renderer);
		return new Species(ret,this.size,this.image);
	}
	updateGroup(){
		this.group = this.species[0].group;
	}

	static compare(a,b){
		return TriangleImage.compare(a.species[0],b.species[0]);
	}
}
