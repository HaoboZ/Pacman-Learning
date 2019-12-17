import Instance from '../instance';
import Main from '../main';
import { createAnimExists, oppositeDirection } from '../utils';


export default class Entity extends Phaser.Physics.Arcade.Sprite {
	
	scene: Main;
	instance: Instance;
	body: Phaser.Physics.Arcade.Body;
	
	nextDirection = Phaser.NONE;
	direction = Phaser.NONE;
	
	target = new Phaser.Math.Vector2();
	
	//////////////////////////////////////////////////
	
	constructor( instance: Instance, x, y, name: string, frame: number ) {
		super( instance.scene, x + 8, y + 8, 'sprites', frame );
		this.instance = instance;
		this.name = name;
		
		this.createAnims( frame );
		this.createEvents( x, y, frame );
	}
	
	createAnims( frame ) {
	}
	
	createEvents( x, y, frame ) {
		this.instance.on( 'reset', () => {
			this.setPosition( x + 8, y + 8 );
			this.direction = this.nextDirection = Phaser.NONE;
			this.anims.stop();
			this.setFrame( frame );
			this.setActive( true );
			this.setVisible( true );
		} );
		this.instance.on( 'end', () => this.setVelocity( 0 ) );
	}
	
	createDirectionAnims( name, frames: { right: integer[], left: integer[], up: integer[], down: integer[] } ) {
		createAnimExists( this.scene, {
			key:       `${name}-right`,
			frames:    this.scene.anims.generateFrameNumbers( 'sprites', { frames: frames.right } ),
			frameRate: 15,
			repeat:    Phaser.FOREVER
		} );
		createAnimExists( this.scene, {
			key:       `${name}-left`,
			frames:    this.scene.anims.generateFrameNumbers( 'sprites', { frames: frames.left } ),
			frameRate: 15,
			repeat:    Phaser.FOREVER
		} );
		createAnimExists( this.scene, {
			key:       `${name}-up`,
			frames:    this.scene.anims.generateFrameNumbers( 'sprites', { frames: frames.up } ),
			frameRate: 15,
			repeat:    Phaser.FOREVER
		} );
		createAnimExists( this.scene, {
			key:       `${name}-down`,
			frames:    this.scene.anims.generateFrameNumbers( 'sprites', { frames: frames.down } ),
			frameRate: 15,
			repeat:    Phaser.FOREVER
		} );
	}
	
	//////////////////////////////////////////////////
	
	update() {
		this.updateAnimation();
		this.updateDirection();
		this.updateVelocity();
		this.updateSnap();
	}
	
	updateAnimation() {
		if ( this.body.velocity.x < 0 ) {
			this.play( `${this.name}-left`, true );
		} else if ( this.body.velocity.x > 0 ) {
			this.play( `${this.name}-right`, true );
		} else if ( this.body.velocity.y < 0 ) {
			this.play( `${this.name}-up`, true );
		} else if ( this.body.velocity.y > 0 ) {
			this.play( `${this.name}-down`, true );
		} else {
			this.anims.stop();
			if ( this.anims.currentAnim ) {
				this.anims.setCurrentFrame( this.anims.currentAnim.frames[ 0 ] );
			}
		}
	}
	
	updateDirection() {
		if ( this.direction !== this.nextDirection ) {
			const directionTile = this.getOpenDirections( this.scene.map.worldToTileXY( this.x, this.y ) )[ this.nextDirection ];
			if ( !directionTile || directionTile.index === -1 ) {
				switch ( this.nextDirection ) {
				case Phaser.RIGHT:
				case Phaser.LEFT:
					const tileCenterY = Math.floor( this.body.center.y / 8 ) * 8;
					if ( ( tileCenterY - this.body.y ) * ( tileCenterY - this.body.prev.y ) <= 0 ) {
						this.direction = this.nextDirection;
					}
					break;
				case Phaser.UP:
				case Phaser.DOWN:
					const tileCenterX = Math.floor( this.body.center.x / 8 ) * 8;
					if ( ( tileCenterX - this.body.x ) * ( tileCenterX - this.body.prev.x ) <= 0 ) {
						this.direction = this.nextDirection;
					}
					break;
				}
			}
		}
	}
	
	updateSnap() {
		switch ( this.direction ) {
		case Phaser.UP:
		case Phaser.DOWN:
			this.setX( Phaser.Math.Snap.To( this.x, this.scene.map.tileWidth, this.scene.map.tileWidth / 2 ) );
			break;
		case Phaser.LEFT:
		case Phaser.RIGHT:
			this.setY( Phaser.Math.Snap.To( this.y, this.scene.map.tileHeight, this.scene.map.tileHeight / 2 ) );
			break;
		}
	}
	
	updateVelocity() {
		const velocity = new Phaser.Math.Vector2(
			+( this.direction === Phaser.RIGHT ) - +( this.direction === Phaser.LEFT ),
			+( this.direction === Phaser.DOWN ) - +( this.direction === Phaser.UP ) );
		this.body.velocity.setFromObject( velocity ).scale( this.getSpeed() );
	}
	
	//////////////////////////////////////////////////
	
	getSpeed() {
		return 50 * this.scene.timeScale;
	}
	
	getOpenDirections( tile: Phaser.Math.Vector2 ) {
		return {
			[ Phaser.RIGHT ]: this.scene.map.getTileAt( tile.x + 1, tile.y, true ),
			[ Phaser.LEFT ]:  this.scene.map.getTileAt( tile.x - 1, tile.y, true ),
			[ Phaser.UP ]:    this.scene.map.getTileAt( tile.x, tile.y - 1, true ),
			[ Phaser.DOWN ]:  this.scene.map.getTileAt( tile.x, tile.y + 1, true )
		};
	}
	
	randomNextDirection( tile: Phaser.Math.Vector2 ) {
		const openDirections = this.getOpenDirections( tile ),
		      directions     = [];
		for ( const direction in openDirections ) {
			if ( !openDirections[ direction ] ) continue;
			if ( openDirections[ direction ].index !== -1 ) continue;
			if ( +direction === oppositeDirection( this.nextDirection ) ) continue;
			directions.push( +direction );
		}
		
		if ( directions.length ) {
			this.nextDirection = Phaser.Utils.Array.GetRandom( directions );
		}
	}
	
	targetNextDirection( tile: Phaser.Math.Vector2 ) {
		const openDirections = this.getOpenDirections( tile );
		let nearestDirection = this.nextDirection,
		    nearestDistance  = Infinity;
		for ( const direction in openDirections ) {
			if ( !openDirections[ direction ] ) continue;
			if ( openDirections[ direction ].index !== -1 ) continue;
			if ( +direction === oppositeDirection( this.nextDirection ) ) continue;
			
			let distance = Phaser.Math.Distance.Squared(
				openDirections[ direction ].x,
				openDirections[ direction ].y,
				this.target.x,
				this.target.y );
			if ( distance < nearestDistance ) {
				nearestDirection = +direction;
				nearestDistance = distance;
			}
		}
		this.nextDirection = nearestDirection;
	}
	
}
