class Image {
	constructor(texture,width=null,height=null){
		this.texture = texture;
		if(width){
			this.width = width;
		}else if(this.texture.image){
			this.width = this.texture.image.width;
		}else{
			this.width = 0;
		}
		if(height){
			this.height = height;
		}else if(this.texture.image){
			this.height = this.texture.image.height;
		}else{
			this.height = 0;
		}
		this.material = new THREE.MeshBasicMaterial({map: this.texture});
		this.mesh = new THREE.Mesh( Image.buildGeometry(this.width,this.height), this.material );
	}
	translateX(x){
		if(this.mesh){
			this.mesh.translateX(x);
		}
	}
	translateY(y){
		if(this.mesh){
			this.mesh.translateY(y);
		}
	}
	translateZ(z){
		if(this.mesh){
			this.mesh.translateZ(z);
		}
	}
	buildWeights(renderer){
		this.weights = Image.createTexture(Image.weightVS,Image.weightFS,this,renderer);
	}
	static createTexture(vShader,fShader,source,renderer){
		let camera = new THREE.OrthographicCamera( 0, source.width, source.height, 0, -1, 1 );
		let renderTarget = new THREE.WebGLRenderTarget(
			source.width,
			source.height,
			{
				format: THREE.RGBFormat,
				depthBuffer: false
			}
		);
		let material = new THREE.ShaderMaterial( {
			uniforms: {
				map: new THREE.Uniform(source.texture),
				xpix: { value: 1/source.width },
				ypix: { value: 1/source.height }
			},
			vertexShader: vShader,
			fragmentShader: fShader
		} );
		let mesh = new THREE.Mesh( Image.buildGeometry(source.width,source.height), material );
		let scene = new THREE.Scene();
		scene.add(mesh);
		renderer.setRenderTarget(renderTarget);
		renderer.render(scene,camera);
		renderer.setRenderTarget(null);
		return new Image(renderTarget.texture,source.width,source.height);
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
	static weightVS = `
		varying vec2 vUv;

		void main()	{
			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`;
	static weightFS = `
		uniform sampler2D map;
		uniform float xpix;
		uniform float ypix;

		varying vec2 vUv;

		void main()	{
			vec4 maxDelta = vec4(0.0);
			vec4 base = texture2D(map, vUv);
			vec4[9] pixel;
			vec4 p0 = vec4(0.0);

			bool xgt0 = vUv.x > 0.9*xpix;
			bool xlt1 = vUv.x < 1.0 - 0.9*xpix;

			bool ygt0 = vUv.y > 0.9*ypix;
			bool ylt1 = vUv.y < 1.0 - 0.9*ypix;

			if(xgt0){
				if(ygt0){ pixel[0*3+0] = abs(texture2D(map, vec2(vUv.x-xpix,vUv.y-ypix))-base)*0.7; }
				else{pixel[0*3+0] = p0;}
				pixel[0*3+1] = abs(texture2D(map, vec2(vUv.x-xpix,vUv.y))-base);
				if(ylt1){ pixel[0*3+2] = abs(texture2D(map, vec2(vUv.x-xpix,vUv.y+ypix))-base)*0.7; }
				else{pixel[0*3+2] = p0;}
			}else{
				pixel[0*3+0] = p0;
				pixel[0*3+1] = p0;
				pixel[0*3+2] = p0;
			}

			if(ygt0){ pixel[1*3+0] = abs(texture2D(map, vec2(vUv.x-xpix,vUv.y-ypix))-base); }
			else{pixel[1*3+0] = p0;}
			pixel[1*3+1] = p0;
			if(ylt1){ pixel[1*3+2] = abs(texture2D(map, vec2(vUv.x-xpix,vUv.y+ypix))-base); }
			else{pixel[1*3+2] = p0;}

			if(xlt1){
				if(ygt0){ pixel[2*3+0] = abs(texture2D(map, vec2(vUv.x+xpix,vUv.y-ypix))-base)*0.7; }
				else{pixel[2*3+0] = p0;}
				pixel[2*3+1] = abs(texture2D(map, vec2(vUv.x+xpix,vUv.y))-base);
				if(ylt1){ pixel[2*3+2] = abs(texture2D(map, vec2(vUv.x+xpix,vUv.y+ypix))-base)*0.7; }
				else{pixel[2*3+2] = p0;}
			}else{
				pixel[2*3+0] = p0;
				pixel[2*3+1] = p0;
				pixel[2*3+2] = p0;
			}

			for(int i=0;i<3;++i){
				for(int j=0;j<3;++j){
					if(pixel[i*3+j].x>maxDelta.x){maxDelta.x = pixel[i*3+j].x;}
					if(pixel[i*3+j].y>maxDelta.y){maxDelta.y = pixel[i*3+j].y;}
					if(pixel[i*3+j].z>maxDelta.z){maxDelta.z = pixel[i*3+j].z;}
				}
			}


			gl_FragColor = maxDelta;
		}
	`;
}
