import Instance from '../instance';
import Main from '../main';
import { createAnimExists, oppositeDirection } from '../utils';


export default class Entity extends Phaser.Physics.Arcade.Sprite {
	
	scene: Main;
	instance: Instance;
	body: Phaser.Physics.Arcade.Body;
	
	nextDirection = Phaser.NONE;
	direction = Phaser.NONE;
	
	constructor( instance: Instance, x, y, name: string, frame: number ) {
		super( instance.scene, x + 8, y + 8, 'sprites', frame );
		this.instance = instance;
		this.name = name;
		
		this.instance.on( 'reset', () => {
			this.setPosition( x + 8, y + 8 );
			this.direction = this.nextDirection = Phaser.NONE;
			this.anims.stop();
			this.setFrame( frame );
			this.setActive( true );
			this.setVisible( true );
		} );
		this.instance.on( 'end', () => {
			this.setVelocity( 0 );
		} );
	}
	
	createAnims( name, frames: { right: integer[], left: integer[], up: integer[], down: integer[] } ) {
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
	
	update() {
		this.updateAnimation();
		this.updateDirection();
		this.updateVelocity();
	}
	
	updateAnimation() {
		if ( this.body.position.equals( this.body.prev ) ) {
			switch ( this.direction ) {
			case Phaser.UP:
			case Phaser.DOWN:
				this.x = Phaser.Math.Snap.To( this.x, this.scene.map.tileWidth, this.scene.map.tileWidth / 2 );
				break;
			case Phaser.LEFT:
			case Phaser.RIGHT:
				this.y = Phaser.Math.Snap.To( this.y, this.scene.map.tileHeight, this.scene.map.tileHeight / 2 );
				break;
			}
		}
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
			if ( this.direction === oppositeDirection( this.nextDirection ) ) {
				this.direction = this.nextDirection;
			} else {
				switch ( this.nextDirection ) {
				case Phaser.RIGHT:
				case Phaser.LEFT:
					if ( !Phaser.Math.Fuzzy.Equal( this.body.x, this.body.prev.x ) ) {
						this.direction = this.nextDirection;
					}
					break;
				case Phaser.UP:
				case Phaser.DOWN:
					if ( !Phaser.Math.Fuzzy.Equal( this.body.y, this.body.prev.y ) ) {
						this.direction = this.nextDirection;
					}
					break;
				}
			}
		}
	}
	
	updateVelocity() {
		const velocity = new Phaser.Math.Vector2(
			+( this.nextDirection === Phaser.RIGHT || this.direction === Phaser.RIGHT ) - +( this.nextDirection === Phaser.LEFT || this.direction === Phaser.LEFT ),
			+( this.nextDirection === Phaser.DOWN || this.direction === Phaser.DOWN ) - +( this.nextDirection === Phaser.UP || this.direction === Phaser.UP ) );
		this.body.velocity.setFromObject( velocity ).scale( this.getSpeed() );
	}
	
	getSpeed() {
		return 50 * this.scene.timeScale;
	}
	
}
