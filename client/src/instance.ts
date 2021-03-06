import Entity from './entities';
import Blinky from './entities/ghost/blinky';
import Clyde from './entities/ghost/clyde';
import Inky from './entities/ghost/inky';
import Pinky from './entities/ghost/pinky';
import Pacman from './entities/pacman';
import Main from './main';


export default class Instance extends Phaser.GameObjects.GameObject {
	
	scene: Main;
	index: number;
	
	score: number;
	pellets = [ ...this.scene.data.get( 'dotTiles' ) ];
	ghostTimer: Phaser.Time.TimerEvent;
	
	entities = this.scene.physics.add.group( { runChildUpdate: true } );
	ghosts = this.scene.add.group();
	
	idleTimer: Phaser.Time.TimerEvent;
	
	//////////////////////////////////////////////////
	
	constructor( scene: Phaser.Scene, index = 0 ) {
		super( scene, 'instance' );
		this.setDataEnabled();
		this.index = index;
		
		this.addEntitiesFromLayers();
		
		this.scene.physics.add.collider( this.scene.map.getLayer().tilemapLayer, this.entities );
		this.scene.physics.add.overlap( this.ghosts, this.getData( 'pacman' ), ( ghost: Entity | any, pacman: Entity | any ) => {
			if ( this.getData( 'end' ) ) return;
			if ( !this.scene.map.worldToTileXY( ghost.x, ghost.y ).equals( this.scene.map.worldToTileXY( pacman.x, pacman.y ) ) ) return;
			if ( ghost.getData( 'fright' ) ) {
				ghost.setData( 'fright', 0 );
				ghost.setData( 'dead', true );
			} else if ( !ghost.getData( 'dead' ) ) {
				this.emit( 'end' );
			}
		} );
		
		this.createEvents();
		
		this.setData( 'end', true );
	}
	
	addEntitiesFromLayers() {
		this.scene.map.getObjectLayer( 'entities' ).objects.forEach( ( object ) => {
			const SpriteClass = this.scene.runner.neuvol.options.population === 1 ? {
				'pacman': Pacman,
				'blinky': Blinky,
				'pinky':  Pinky,
				'inky':   Inky,
				'clyde':  Clyde
			}[ object.name ] : {
				'pacman': Pacman,
				'blinky': Blinky
			}[ object.name ];
			if ( SpriteClass ) {
				const sprite: Phaser.Physics.Arcade.Sprite = new SpriteClass( this, object.x, object.y,
					object.properties && object.properties.reduce( ( obj, prop ) => ( {
						...obj,
						[ prop.name ]: prop.value
					} ), {} ) );
				this.entities.add( sprite, true );
				sprite.setSize( 8, 8 );
				if ( this.index ) {
					sprite.setAlpha( .25 );
				}
				
				this.setData( object.name, sprite );
				if ( object.type === 'ghost' ) {
					this.ghosts.add( sprite );
				}
			}
		} );
	}
	
	createEvents() {
		this.on( 'pacmanEatPellet', () => {
			++this.score;
			this.setGhostTimer();
			this.setIdleTimer();
		} );
		this.on( 'reset', () => {
			this.setData( 'dots', 244 );
			[ 7, 20, 7, 20, 5, 20, 5 ].reduce( ( sum, val, index ) => {
				sum += val;
				this.scene.time.delayedCall( sum * 1000,
					() => this.emit( 'ghostModeChange', index % 2 === 1 ) );
				return sum;
			}, 0 );
			this.pellets.forEach( ( tile, index ) => {
				const val = this.scene.data.get( 'dotTiles' )[ index ];
				if ( val ) {
					this.pellets[ index ] = val;
				}
			} );
			this.setGhostTimer();
			this.setIdleTimer();
			
			this.score = 0;
			this.setData( 'end', false );
		} );
		this.on( 'end', () => {
			if ( !this.getData( 'end' ) ) {
				this.setData( 'end', true );
				this.emit( 'death' );
			}
		} );
	}
	
	//////////////////////////////////////////////////
	
	update() {
		this.scene.physics.world.wrap( this.entities, 0 );
	}
	
	//////////////////////////////////////////////////
	
	setGhostTimer() {
		if ( this.ghostTimer ) this.ghostTimer.remove();
		this.ghostTimer = this.scene.time.delayedCall( 4500, () => {
			const res = { left: false };
			this.emit( 'ghostLeave', res );
			if ( res.left ) {
				this.setGhostTimer();
			}
		} );
	}
	
	setIdleTimer() {
		if ( this.idleTimer ) this.idleTimer.remove();
		this.idleTimer = this.scene.time.delayedCall( 15000, () => this.emit( 'end' ) );
	}
	
}
