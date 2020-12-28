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
	setWeightTexture(weightTexture){
		this.weightTexture = weightTexture;
	}
	compare(image, renderer){
		let material = new THREE.ShaderMaterial( {
			uniforms: {
				map1: new THREE.Uniform(this.texture),
				mapw: new THREE.Uniform(this.weightTexture),
				map2: new THREE.Uniform(image.texture),
				xpix: { value: 1/this.width },
				ypix: { value: 1/this.height }
			},
			vertexShader: Image.VShader,
			fragmentShader: Image.FShaderCompare
		} );
		let mesh = new THREE.Mesh( Image.buildGeometry(1,1), material );
		let scene = new THREE.Scene();
		scene.add(mesh);
		let renderTarget = Image.createRender(renderer,1,1,scene);
		let result = new Uint8Array(4);
		renderer.readRenderTargetPixels(renderTarget,0,0,1,1,result);
		return (result[0]*result[0])+(result[1]*result[1])+(result[2]*result[2]);
	}
	static createTexture(renderer,width,height,scene){
		return Image.createRender(renderer,width,height,scene).texture;
	}
	static createRender(renderer,width,height,scene){
		let camera = new THREE.OrthographicCamera( 0, width, height, 0, -1, 1000 );
		let renderTarget = new THREE.WebGLRenderTarget(
			width,
			height,
			{
				depthBuffer: false
			}
		);
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
			vec4 diff = vec4(0.0);
			vec2 coord;
			float count = 0.0;

			float i = xpix*0.5, j;
			while(i < 1.0){
				j = ypix*0.5;
				while(j < 1.0){
					coord = vec2(i,j);
					diff += abs(texture2D(map2,coord)-texture2D(map1,coord))*texture2D(mapw,coord);
					count += 1.0;
					j += ypix;
				}
				i += xpix;
			}
			gl_FragColor = diff;
		}
	`;
}
