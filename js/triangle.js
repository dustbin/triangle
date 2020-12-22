function Triangle(verts,z,color,opacity){
	this.geometry = new THREE.BufferGeometry();
	this.vertices = new Float32Array( [
		verts[0],verts[1],-z,
		verts[2],verts[3],-z,
		verts[4],verts[5],-z
	] );
	this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
	this.material = new THREE.MeshBasicMaterial( { color: color, opacity: opacity } );
	this.mesh = new THREE.Mesh( this.geometry, this.material );
}
