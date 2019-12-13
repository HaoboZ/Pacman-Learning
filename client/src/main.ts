import Entities from './entities';
import Player from './player';


export default class Main extends Phaser.Scene {
	
	pelletLayer: Phaser.Tilemaps.DynamicTilemapLayer;
	
	entities: Entities;
	
	preload() {
		this.load.image( 'tiles', 'assets/tilemap/maze.png' );
		this.load.tilemapTiledJSON( 'map', 'assets/tilemap/maze.json' );
		this.load.spritesheet( 'sprites', 'assets/sprites.png', {
			frameWidth:  16,
			frameHeight: 16
		} );
	}
	
	create() {
		const map = this.add.tilemap( 'map' );
		const tiles = map.addTilesetImage( 'maze', 'tiles' );
		
		const maze = map.createStaticLayer( 'maze', tiles );
		maze.setCollisionByProperty( { collides: true } );
		this.pelletLayer = map.createDynamicLayer( 'pellets', tiles );
		this.pelletLayer.setCollisionByProperty( { edible: true } );
		this.pelletLayer.forEachTile( tile => tile.properties.index = tile.index );
		
		this.entities = this.add.existing( new Entities( this.physics.world, this ) as any ) as any;
		this.entities.addFromObjects( map.getObjectLayer( 'objects' ) );
		
		this.physics.add.collider( maze, this.entities );
		
		new Player( this );
		
		this.events.on( 'reset', () => {
			this.pelletLayer.forEachTile( tile => {
				if ( tile.properties.index !== -1 ) {
					this.pelletLayer.putTileAt( tile.properties.index, tile.x, tile.y );
				}
			} );
		} );
	}
	
	update() {
		this.physics.world.wrap( this.entities );
		const tile = this.pelletLayer.getTileAtWorldXY( this.entities.pacman.x, this.entities.pacman.y );
		if ( tile && tile.index !== -1 ) {
			this.pelletLayer.putTileAt( 45, tile.x, tile.y );
		}
	}
	
}
