function Triangle(verts,z,color,opacity){
	this.geometry = new THREE.BufferGeometry();
	this.vertices = new Float32Array( [
		verts[0],verts[1],0,
		verts[2],verts[3],0,
		verts[4],verts[5],0
	] );
	this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
	this.material = new THREE.MeshBasicMaterial( { color: color, opacity: opacity, transparent: true } );
	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.translateZ(-z);
}
