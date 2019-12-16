import Controller from './controller';
import Runner from './runner';


export default class Main extends Phaser.Scene {
	
	map: Phaser.Tilemaps.Tilemap;
	
	startTime: number;
	runner: Runner;
	timeScale = 1;
	
	debugGraphic: Phaser.GameObjects.Graphics;
	
	preload() {
		this.load.image( 'tiles', 'assets/tilemap/maze.png' );
		this.load.tilemapTiledJSON( 'map', 'assets/tilemap/maze.json' );
		this.load.spritesheet( 'sprites', 'assets/sprites.png', {
			frameWidth:  16,
			frameHeight: 16
		} );
	}
	
	create() {
		this.map = this.add.tilemap( 'map' );
		const tiles = this.map.addTilesetImage( 'maze', 'tiles' );
		
		const maze = this.map.createStaticLayer( 'maze', tiles );
		maze.setCollisionByProperty( { collides: true } );
		
		const pellets = this.map.createDynamicLayer( 'pellets', tiles );
		const dotTiles = [];
		pellets.forEachTile( ( tile, index ) => dotTiles[ index ] = tile.index );
		this.data.set( 'dotTiles', dotTiles );
		
		this.map.setLayer( maze );
		
		this.events.on( 'reset', () => {
			this.time.removeAllEvents();
			pellets.forEachTile( ( tile, index ) => {
				if ( this.data.get( 'dotTiles' )[ index ] ) {
					pellets.putTileAt( this.data.get( 'dotTiles' )[ index ], tile.x, tile.y );
				}
			} );
			this.startTime = this.time.now;
		} );
		
		this.debugGraphic = this.add.graphics();
		this.debugGraphic.setDepth( Number.MAX_VALUE );
		this.events.on( 'preupdate', () => this.debugGraphic.clear() );
		
		this.runner = new Runner( this );
		
		new Controller( this );
	}
	
	update() {
		this.runner.instances.forEach( instance => instance.active && instance.update() );
	}
	
}
