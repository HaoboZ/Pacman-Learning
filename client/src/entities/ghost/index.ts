import { oppositeDirection } from '../../utils';
import Entity from '../index';


export default class Ghost extends Entity {
	
	target = new Phaser.Math.Vector2();
	
	home: Phaser.Math.Vector2;
	
	prevTile: Phaser.Math.Vector2;
	
	constructor( scene: Phaser.Scene, x, y, name: string, props, frame: number ) {
		super( scene, x, y, name, frame );
		this.home = new Phaser.Math.Vector2( props.homeX, props.homeY );
		this.setDataEnabled();
		
		this.createAnims( this.name, {
			right: [ frame, frame + 1 ],
			left:  [ frame + 2, frame + 3 ],
			up:    [ frame + 4, frame + 5 ],
			down:  [ frame + 6, frame + 7 ]
		} );
		if ( !this.scene.anims.exists( 'fright' ) ) {
			this.scene.anims.create( {
				key:       'ghost-fright',
				frames:    this.scene.anims.generateFrameNumbers( 'sprites',
					{ frames: [ 64, 65, 64, 65, 64, 65, 66, 67, 66, 67, 66, 67 ] } ),
				frameRate: 15,
				repeat:    Phaser.FOREVER
			} );
			this.scene.anims.create( {
				key:       'ghost-fright-quick',
				frames:    this.scene.anims.generateFrameNumbers( 'sprites',
					{ frames: [ 64, 65, 66, 67 ] } ),
				frameRate: 15,
				repeat:    Phaser.FOREVER
			} );
		}
		
		this.createEvents( x + 8, y + 8 );
	}
	
	createEvents( x, y ) {
		this.scene.events.on( 'ghostModeChange', home => {
			this.reverse();
			this.data.set( 'mode', home );
		} );
		this.scene.events.on( 'reset', () => {
			this.data.set( 'home', true );
			this.data.set( 'mode', true );
			this.data.set( 'fright', 0 );
			this.data.set( 'dead', false );
			this.prevTile = null;
		} );
		this.scene.events.on( 'pacmanEatPellet', power => {
			if ( power && !this.data.get( 'dead' ) ) {
				this.reverse();
				this.data.set( 'fright', 2 );
				this.scene.time.delayedCall( 4500, () => {
					if ( this.data.get( 'fright' ) === 2 ) {
						this.data.set( 'fright', 1 );
					}
				} );
				this.scene.time.delayedCall( 6000, () => {
					this.data.set( 'fright', 0 );
				} );
			}
		} );
		this.on( 'changedata-home', ( _, val ) => {
			if ( val ) {
				this.setPosition( x, y );
			}
		} );
	}
	
	update() {
		const tile = this.scene.map.worldToTileXY( this.x, this.y );
		if ( !this.prevTile || !tile.equals( this.prevTile ) ) {
			if ( this.data.get( 'dead' ) ) {
				if ( tile.y === 14
					&& ( tile.x === 13 || tile.x === 14 )
					&& ( this.prevTile.x === 13 || this.prevTile.x === 14 ) ) {
					this.data.set( 'home', true );
					this.data.set( 'dead', false );
				}
			}
			this.updateNextDirection( tile );
			this.prevTile = tile;
		}
		this.scene.debugGraphic.lineBetween( this.x, this.y, this.target.x * 8 + 4, this.target.y * 8 + 4 );
		super.update();
	}
	
	updateNextDirection( tile: Phaser.Math.Vector2 ) {
		const openDirections = {
			[ Phaser.RIGHT ]: this.scene.map.getTileAt( tile.x + 1, tile.y, true ),
			[ Phaser.LEFT ]:  this.scene.map.getTileAt( tile.x - 1, tile.y, true ),
			[ Phaser.UP ]:    this.scene.map.getTileAt( tile.x, tile.y - 1, true ),
			[ Phaser.DOWN ]:  this.scene.map.getTileAt( tile.x, tile.y + 1, true )
		};
		if ( this.data.get( 'dead' ) ) {
			this.target.set( 13, 14 );
		} else if ( this.data.get( 'mode' ) ) {
			this.target.setFromObject( this.home );
		} else {
			this.updateTarget( openDirections );
		}
		let nearestDirection = this.nextDirection,
		    nearestDistance  = Infinity;
		for ( const direction in openDirections ) {
			if ( !openDirections[ direction ] ) continue;
			if ( openDirections[ direction ].index !== -1 ) continue;
			if ( +direction === oppositeDirection( this.nextDirection ) ) continue;
			
			let distance = this.data.get( 'dead' ) || !this.data.get( 'fright' )
				? Phaser.Math.Distance.Squared(
					openDirections[ direction ].x,
					openDirections[ direction ].y,
					this.target.x,
					this.target.y )
				: Math.random();
			if ( distance < nearestDistance ) {
				nearestDirection = +direction;
				nearestDistance = distance;
			}
		}
		this.nextDirection = nearestDirection;
	}
	
	updateTarget( openDirections: {} ) {
		this.target.setFromObject( this.home );
	}
	
	updateAnimation() {
		if ( this.data.get( 'dead' ) ) {
			this.anims.stop();
			if ( this.body.velocity.x > 0 ) {
				this.setFrame( 78 );
			} else if ( this.body.velocity.x < 0 ) {
				this.setFrame( 79 );
			} else if ( this.body.velocity.y < 0 ) {
				this.setFrame( 80 );
			} else if ( this.body.velocity.y > 0 ) {
				this.setFrame( 81 );
			}
		} else if ( this.data.get( 'fright' ) ) {
			this.play( `ghost-fright${this.data.get( 'fright' ) === 2 ? '' : '-quick'}`, true );
		} else {
			super.updateAnimation();
		}
	}
	
	updateVelocity() {
		if ( !this.data.get( 'home' ) ) {
			super.updateVelocity();
		} else {
			this.setVelocity( 0 );
		}
	}
	
	reverse() {
		this.nextDirection = oppositeDirection( this.direction );
		this.prevTile = null;
	}
	
	getSpeed() {
		return this.data.get( 'dead' ) ? super.getSpeed() * 2 : super.getSpeed();
	}
	
}
