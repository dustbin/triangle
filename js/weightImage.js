class WeightImage extends Image {
	constructor(image){
		super(null,image.width,image.height);
		this.source = image;
	}
	render(renderer){
		let material = new THREE.ShaderMaterial( {
			uniforms: {
				map: new THREE.Uniform(this.source.texture),
				xpix: { value: 1/this.width },
				ypix: { value: 1/this.height }
			},
			vertexShader: WeightImage.VShader,
			fragmentShader: WeightImage.FShader
		} );
		let mesh = new THREE.Mesh( Image.buildGeometry(this.width,this.height), material );
		let scene = new THREE.Scene();
		scene.add(mesh);
		this.setTexture( Image.createTexture( renderer, this.width, this.height, scene) );
	}
	static VShader = `
		varying vec2 vUv;

		void main()	{
			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`;
	static FShader = `
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
