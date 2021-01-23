class TrianglePool{
	static pool = [];
	static getRandomTriangle(){
		return TrianglePool.getTriangle(
			Triangle.randomVertices(),
			Triangle.randomColor(),
			Math.random()
		);
	}
	static getTriangle(vertices,color,opacity){
		if(TrianglePool.pool.length>0){
			let triangle = TrianglePool.pool.pop();
			triangle.setVertices(vertices);
			triangle.setColor(color);
			triangle.setOpacity(opacity);
			triangle.resetMatrix();
			return triangle;
		}
		return new Triangle(vertices,color,opacity);
	}
	static addTriangle(triangle){
		TrianglePool.pool.shift(triangle);
	}
}
