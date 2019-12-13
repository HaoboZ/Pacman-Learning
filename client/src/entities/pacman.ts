import { reverseDirection } from '../utils';


export default class Pacman extends Phaser.Physics.Arcade.Sprite {
	
	name = 'pacman';
	
	body: Phaser.Physics.Arcade.Body;
	
	direction = Phaser.NONE;
	prevDirection = Phaser.NONE;
	
	constructor( scene: Phaser.Scene, x, y ) {
		super( scene, x + 8, y + 8, 'sprites', 2 );
		
		scene.anims.create( {
			key:       'right',
			frames:    scene.anims.generateFrameNumbers( 'sprites', { frames: [ 1, 0, 1, 2 ] } ),
			frameRate: 15,
			repeat:    -1
		} );
		scene.anims.create( {
			key:       'left',
			frames:    scene.anims.generateFrameNumbers( 'sprites', { frames: [ 15, 14, 15, 2 ] } ),
			frameRate: 15,
			repeat:    -1
		} );
		scene.anims.create( {
			key:       'up',
			frames:    scene.anims.generateFrameNumbers( 'sprites', { frames: [ 29, 28, 29, 2 ] } ),
			frameRate: 15,
			repeat:    -1
		} );
		scene.anims.create( {
			key:       'down',
			frames:    scene.anims.generateFrameNumbers( 'sprites', { frames: [ 43, 42, 43, 2 ] } ),
			frameRate: 15,
			repeat:    -1
		} );
		
		scene.events.on( 'reset', () => {
			this.setPosition( x + 8, y + 8 );
			this.prevDirection = this.direction = Phaser.NONE;
			this.anims.stop();
			this.setFrame( 2 );
		} );
	}
	
	update(): void {
		if ( this.body.velocity.x < 0 ) {
			this.play( 'left', true );
		} else if ( this.body.velocity.x > 0 ) {
			this.play( 'right', true );
		} else if ( this.body.velocity.y < 0 ) {
			this.play( 'up', true );
		} else if ( this.body.velocity.y > 0 ) {
			this.play( 'down', true );
		} else {
			this.anims.stop();
			if ( this.anims.currentAnim ) {
				this.anims.setCurrentFrame( this.anims.currentAnim.frames[ 0 ] );
			}
		}
		
		if ( this.prevDirection !== this.direction ) {
			if ( this.prevDirection === reverseDirection( this.direction ) ) {
				this.prevDirection = this.direction;
			} else {
				switch ( this.direction ) {
				case Phaser.RIGHT:
				case Phaser.LEFT:
					if ( this.body.velocity.x !== 0 ) {
						this.prevDirection = this.direction;
					}
					break;
				case Phaser.UP:
				case Phaser.DOWN:
					if ( this.body.velocity.y !== 0 ) {
						this.prevDirection = this.direction;
					}
					break;
				}
			}
		}
		
		const velocity = new Phaser.Math.Vector2(
			+( this.direction === Phaser.RIGHT || this.prevDirection === Phaser.RIGHT ) - +( this.direction === Phaser.LEFT || this.prevDirection === Phaser.LEFT ),
			+( this.direction === Phaser.DOWN || this.prevDirection === Phaser.DOWN ) - +( this.direction === Phaser.UP || this.prevDirection === Phaser.UP ) );
		this.body.velocity.setFromObject( velocity ).scale( 100 );
	}
	
}
