import Entities from './entities/group';
import Player from './player';


export default class Main extends Phaser.Scene {
	
	map: Phaser.Tilemaps.Tilemap;
	pelletLayer: Phaser.Tilemaps.DynamicTilemapLayer;
	
	entities: Entities;
	
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
		this.createMap();
		
		this.entities = this.add.existing( new Entities( this.physics.world, this ) as any ) as any;
		this.entities.addFromObjects( this.map.getObjectLayer( 'entities' ) );
		this.physics.add.collider( this.map.getLayer().tilemapLayer, this.entities );
		this.physics.add.overlap( this.entities.ghosts, this.data.get( 'pacman' ), ( ghost ) => {
			// if ( ghost.data.get( 'fright' ) ) {
			ghost.data.set( 'fright', 0 );
			ghost.data.set( 'dead', true );
			// } else if ( !ghost.data.get( 'dead' ) ) {
			// 	this.events.emit( 'reset' );
			// }
		} );
		
		this.events.on( 'reset', () => {
			this.time.removeAllEvents();
			this.createTimers();
			this.pelletLayer.forEachTile( ( tile, index ) => {
				if ( this.data.get( 'dotTiles' )[ index ] ) {
					this.pelletLayer.putTileAt( this.data.get( 'dotTiles' )[ index ], tile.x, tile.y );
				}
			} );
		} );
		
		new Player( this );
		
		this.debugGraphic = this.add.graphics( { x: 0, y: 0 } );
		this.debugGraphic.setDepth( Number.MAX_VALUE );
		this.events.on( 'preupdate', () => this.debugGraphic.clear() );
		
		this.events.emit( 'reset' );
	}
	
	createMap() {
		this.map = this.add.tilemap( 'map' );
		const tiles = this.map.addTilesetImage( 'maze', 'tiles' );
		
		const maze = this.map.createStaticLayer( 'maze', tiles );
		maze.setCollisionByProperty( { collides: true } );
		this.pelletLayer = this.map.createDynamicLayer( 'pellets', tiles );
		this.pelletLayer.setCollisionByProperty( { edible: true } );
		const dotTiles = [];
		this.pelletLayer.forEachTile( ( tile, index ) => dotTiles[ index ] = tile.index );
		this.data.set( 'dotTiles', dotTiles );
		this.map.setLayer( maze );
	}
	
	createTimers() {
		[ 7, 20, 7, 20, 5, 20, 5 ].reduce( ( sum, val, index ) => {
			sum += val;
			this.time.delayedCall( sum * 1000, () => {
				this.events.emit( 'ghostModeChange', index % 2 === 1 );
			} );
			return sum;
		}, 0 );
	}
	
	update() {
		this.physics.world.wrap( this.entities, 0 );
	}
	
}
