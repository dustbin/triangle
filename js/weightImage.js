class WeightImage extends Image {
	constructor(image){
		super(null,image.width,image.height);
		this.source = image;
	}
	render(renderer){
		let material,mesh,scene,texture1,texture2;

		material = new THREE.ShaderMaterial( {
			uniforms: {
				map: new THREE.Uniform(this.source.texture),
				xpix: { value: 1/this.width },
				ypix: { value: 1/this.height }
			},
			vertexShader: Image.VShader,
			fragmentShader: WeightImage.FShader1
		} );
		mesh = new THREE.Mesh( Image.buildGeometry(this.width,this.height), material );
		scene = new THREE.Scene();
		scene.add(mesh);
		texture1 = Image.createTexture( renderer, this.width, this.height, scene);

		material = new THREE.ShaderMaterial( {
			uniforms: {
				map: new THREE.Uniform(texture1),
				xpix: { value: 1/this.width },
				ypix: { value: 1/this.height }
			},
			vertexShader: Image.VShader,
			fragmentShader: WeightImage.FShader2
		} );
		mesh = new THREE.Mesh( Image.buildGeometry(1,1), material );
		scene = new THREE.Scene();
		scene.add(mesh);
		texture2 = Image.createTexture( renderer, 1, 1, scene);

		material = new THREE.ShaderMaterial( {
			uniforms: {
				map: new THREE.Uniform(texture1),
				delta: new THREE.Uniform(texture2),
			},
			vertexShader: Image.VShader,
			fragmentShader: WeightImage.FShader3
		} );

		mesh = new THREE.Mesh( Image.buildGeometry(this.width,this.height), material );
		scene = new THREE.Scene();
		scene.add(mesh);
		this.setTexture( Image.createTexture( renderer, this.width, this.height, scene ) );
	}
	static FShader1 = `
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

			maxDelta.a = 1.0;

			gl_FragColor = maxDelta;
		}
	`;
	static FShader2 = `
		uniform sampler2D map;
		uniform float xpix;
		uniform float ypix;

		varying vec2 vUv;

		void main()	{
			vec4 maxDelta = vec4(0.0), temp;

			float i = xpix*0.5, j;
			while(i < 1.0){
				j = ypix*0.5;
				while(j < 1.0){
					temp = texture2D(map,vec2(i,j));
					if(temp.x > maxDelta.x){maxDelta = temp.xxxx;}
					if(temp.y > maxDelta.x){maxDelta = temp.yyyy;}
					if(temp.z > maxDelta.x){maxDelta = temp.zzzz;}
					j += ypix;
				}
				i += xpix;
			}
			maxDelta.w = 1.0;
			gl_FragColor = maxDelta;
		}
	`;
	static FShader3 = `
		uniform sampler2D map;
		uniform sampler2D delta;

		varying vec2 vUv;

		void main()	{
			gl_FragColor = texture2D(map,vUv) / texture2D(delta,vec2(0.5,0.5));
		}
	`;
}

