
class Rectangle extends THREE.Mesh {
	constructor(color,opacity){
		let geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			'position',
			new THREE.BufferAttribute(
				new Float32Array( [
					0,0,0,
					1,0,0,
					1,1,0,

					0,0,0,
					1,1,0,
					0,1,0
				] ),
				3
			)
		);
		let material = new THREE.MeshBasicMaterial( { color: color, opacity: opacity, transparent: true } );
		super(geometry,material);
	}
}
