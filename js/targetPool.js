class TargetPool {
	static pool = [];
	static getTarget(width,height){
		if(!TargetPool.pool[width]){
			TargetPool.pool[width]=[];
		}
		if(!TargetPool.pool[width][height]){
			TargetPool.pool[width][height] = new THREE.WebGLRenderTarget(
				width,
				height,
				{
					depthBuffer: false
				}
			);
		}
		return TargetPool.pool[width][height];
	};
}
