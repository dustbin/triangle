class Image {
	constructor(texture){
		this.texture = texture;
		this.material = new THREE.MeshBasicMaterial({map: this.texture});
		this.mesh = new THREE.Mesh( this.buildGeometry(), this.material );
	}
	width(){
		if(this.texture.image){
			return this.texture.image.width;
		}else{
			return 0;
		}
	}
	height(){
		if(this.texture.image){
			return this.texture.image.height;
		}else{
			return 0;
		}
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
	buildGeometry(){
		let geometry = new THREE.BufferGeometry();
		let vertices = new Float32Array( [
			0,0,0,
			this.width(),0,0,
			this.width(),this.height(),0,

			0,0,0,
			this.width(),this.height(),0,
			0,this.height(),0
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
	buildWeights(renderer){
		let camera = new THREE.OrthographicCamera( 0, this.width(), this.height(), 0, -1, 1 );
		let renderTarget = new THREE.WebGLRenderTarget(
			this.width(),
			this.height(),
			{
				format: THREE.RGBFormat,
				depthBuffer: false
			}
		)
		let material = new THREE.ShaderMaterial( {
			uniforms: { map: { type: 't', value: this.texture } },
			vertexShader: Image.weightVS,
			fragmentShader: Image.weightFS
		} );
		let mesh = new THREE.Mesh( this.buildGeometry(), material );
		let scene = new THREE.Scene();
		scene.add(mesh);
		renderer.setRenderTarget(renderTarget);
		renderer.render(scene,camera);
		renderer.setRenderTarget(null);
		this.textureWeights = renderTarget.texture;
		this.materialWeights = new THREE.MeshBasicMaterial( {map: this.textureWeights} );
		this.meshWeights = new THREE.Mesh( this.buildGeometry(), this.materialWeights );
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
		varying vec2 vUv;

		void main()	{
			gl_FragColor = texture2D(map, vUv);
		}
	`;
}
