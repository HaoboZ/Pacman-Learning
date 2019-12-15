import Blinky from './entities/ghost/blinky';
import Clyde from './entities/ghost/clyde';
import Inky from './entities/ghost/inky';
import Pinky from './entities/ghost/pinky';
import Pacman from './entities/pacman';
import Main from './main';


export default class Instance extends Phaser.GameObjects.GameObject {
	
	scene: Main;
	main: boolean;
	
	pellets: number[];
	
	entities = this.scene.physics.add.group( { runChildUpdate: true } );
	ghosts = this.scene.add.group();
	
	constructor( scene: Phaser.Scene, main = false ) {
		super( scene, 'instance' );
		this.setDataEnabled();
		this.main = main;
		this.pellets = [ ...this.scene.data.get( 'dotTiles' ) ];
		
		this.addEntitiesFromLayers();
		
		this.scene.physics.add.collider( this.scene.map.getLayer().tilemapLayer, this.entities );
		this.scene.physics.add.overlap( this.ghosts, this.data.get( 'pacman' ), ( ghost ) => {
			if ( this.data.get( 'end' ) ) return;
			if ( ghost.data.get( 'fright' ) ) {
				ghost.data.set( 'fright', 0 );
				ghost.data.set( 'dead', true );
			} else if ( !ghost.data.get( 'dead' ) ) {
				this.emit( 'end', 244 - this.data.get( 'dots' ) );
				this.data.set( 'end', true );
			}
		} );
		
		this.on( 'reset', () => {
			this.data.set( 'dots', 244 );
			[ 7, 20, 7, 20, 5, 20, 5 ].reduce( ( sum, val, index ) => {
				sum += val;
				this.scene.time.delayedCall( sum * 1000, () => {
					this.emit( 'ghostModeChange', index % 2 === 1 );
				} );
				return sum;
			}, 0 );
			this.pellets.forEach( ( tile, index ) => {
				const val = this.scene.data.get( 'dotTiles' )[ index ];
				if ( val ) {
					this.pellets[ index ] = val;
				}
			} );
			this.data.set( 'end', false );
		} );
		this.on( 'end', ( dots ) => {
			console.log( dots );
		} );
		
		this.emit( 'reset' );
	}
	
	addEntitiesFromLayers() {
		this.scene.map.getObjectLayer( 'entities' ).objects.forEach( ( object ) => {
			const SpriteClass = {
				'pacman': Pacman,
				'blinky': Blinky,
				'pinky':  Pinky,
				'inky':   Inky,
				'clyde':  Clyde
			}[ object.name ];
			if ( SpriteClass ) {
				const sprite: Phaser.Physics.Arcade.Sprite = new SpriteClass( this, object.x, object.y,
					object.properties && object.properties.reduce( ( obj, prop ) => ( {
						...obj,
						[ prop.name ]: prop.value
					} ), {} ) );
				this.entities.add( sprite, true );
				sprite.setSize( 8, 8 );
				if ( !this.main ) {
					sprite.setAlpha( .25 );
				}
				
				this.data.set( object.name, sprite );
				if ( object.type === 'ghost' ) {
					this.ghosts.add( sprite );
				}
			}
		} );
	}
	
	update() {
		this.scene.physics.world.wrap( this.entities, 0 );
	}
	
}
