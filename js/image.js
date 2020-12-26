class Image extends THREE.Object3D {
	constructor(texture=null,width=null,height=null){
		super();
		if(texture){
			this.setTexture(texture);
		}else{
			this.texture = null;
			this.material = null;
			this.mesh = null;
			this.width = width;
			this.height = height;
		}
	}
	setTexture(texture){
		this.texture = texture;
		if(this.texture.image){
			this.width = this.texture.image.width;
			this.height = this.texture.image.height;
		}
		this.material = new THREE.MeshBasicMaterial({map: this.texture});
		this.mesh = new THREE.Mesh( Image.buildGeometry(this.width,this.height), this.material );
		this.add(this.mesh);
	}
	static createTexture(renderer,width,height,scene){
		let camera = new THREE.OrthographicCamera( 0, width, height, 0, -1, 1000 );
		let renderTarget = new THREE.WebGLRenderTarget(
			width,
			height,
			{
				format: THREE.RGBFormat,
				depthBuffer: false
			}
		);
		renderer.setRenderTarget(renderTarget);
		renderer.render(scene,camera);
		renderer.setRenderTarget(null);
		return renderTarget.texture;
	}
	static buildGeometry(width, height){
		let geometry = new THREE.BufferGeometry();
		let vertices = new Float32Array( [
			0,0,0,
			width,0,0,
			width,height,0,

			0,0,0,
			width,height,0,
			0,height,0
		] );
		let uv = new Float32Array( [
			0,0,
			1,0,
			1,1,

			0,0,
			1,1,
			0,1
		] );
		geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		geometry.setAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );
		return geometry;
	}
}
