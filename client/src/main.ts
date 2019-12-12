export default class Main extends Phaser.Scene {
	
	preload() {
		this.load.image( 'tiles', 'assets/tilemap/maze.png' );
		this.load.tilemapTiledJSON( 'map', 'assets/tilemap/maze.json' );
	}
	
	create() {
		const map = this.add.tilemap( 'map' );
		const tiles = map.addTilesetImage( 'maze', 'tiles' );
		
		const maze = map.createStaticLayer( 'maze', tiles, 0, 0 );
		const pellets = map.createStaticLayer( 'pellets', tiles, 0, 0 );
	}
	
}
