import Instance from './instance';


export default class Main extends Phaser.Scene {
	
	map: Phaser.Tilemaps.Tilemap;
	
	instances: Instance[] = [];
	
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
		} );
		
		this.instances.push( new Instance( this, true ) );
		this.instances.push( new Instance( this ) );
		this.instances.push( new Instance( this ) );
		this.instances.push( new Instance( this ) );
	}
	
	update() {
		this.instances.forEach( instance => instance.active && instance.update() );
	}
	
}
