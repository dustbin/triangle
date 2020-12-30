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
	setWeight(weight){
		this.weight = weight;
	}
	compare(image, renderer){
		let material = new THREE.ShaderMaterial( {
			uniforms: {
				map1: new THREE.Uniform(this.texture),
				mapw: new THREE.Uniform(this.weight.texture),
				map2: new THREE.Uniform(image.texture),
				xpix: { value: 1/this.width },
				ypix: { value: 1/this.height }
			},
			vertexShader: Image.VShader,
			fragmentShader: Image.FShaderCompare
		} );
		let mesh = new THREE.Mesh( Image.buildGeometry(this.width,1), material );
		let scene = new THREE.Scene();
		scene.add(mesh);
		let renderTarget = Image.createRender(renderer,this.width,1,scene);
		let result = new Uint8Array(this.width*4);
		renderer.readRenderTargetPixels(renderTarget,0,0,this.width,1,result);
		let ret = 0;
		for(let i=0;i<this.width;++i){
			ret += result[i*4]*0x1000000+result[i*4+1]*0x10000+result[i*4+2]*0x100+result[i*4+3];
		}
		return ret;
	}
	static createTexture(renderer,width,height,scene,unique=false){
		return Image.createRender(renderer,width,height,scene,unique).texture;
	}
	static createRender(renderer,width,height,scene,unique=false){
		let camera = new THREE.OrthographicCamera( 0, width, height, 0, -1, 1000 );
		let renderTarget = TargetPool.getTarget(width,height,unique);
		renderer.setRenderTarget(renderTarget);
		renderer.render(scene,camera);
		renderer.setRenderTarget(null);
		return renderTarget;
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
	static VShader = `
		varying vec2 vUv;

		void main()	{
			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`;
	static FShaderCompare = `
		uniform sampler2D map1;
		uniform sampler2D mapw;
		uniform sampler2D map2;
		uniform float xpix;
		uniform float ypix;

		varying vec2 vUv;

		void main()	{
			int diff = 0;
			vec4 temp;
			vec2 coord;

			float i = ypix*0.5;
			while(i < 1.0){
				coord = vec2(vUv.x,i);
				temp = abs( texture2D(map2,coord) - texture2D(map1,coord) ) * (texture2D(mapw,coord)*0.5+0.5);
				diff += int( floor( (temp.r+temp.g+temp.b)*1000.0/3.0 ) );
				i += ypix;
			}
			gl_FragColor = vec4(
				float((diff/(256*256*256))%256)/255.0,
				float((diff/(256*256))%256)/255.0,
				float((diff/256)%256)/255.0,
				float(diff%256)/255.0
			);
		}
	`;
}
