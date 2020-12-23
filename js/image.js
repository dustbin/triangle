function Image(texture){
	this.texture = texture;
	this.material = new THREE.MeshBasicMaterial({map: this.texture});
	let geometry = new THREE.BufferGeometry();
	let width = this.texture.image.width;
	let height = this.texture.image.height;
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
	this.mesh = new THREE.Mesh( geometry, this.material );
	this.mesh.translateX(-width);
	this.mesh.translateY(height/-2);
	this.mesh.translateZ(-1);
}
