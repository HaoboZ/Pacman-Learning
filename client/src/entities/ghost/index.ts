import Instance from '../../instance';
import { createAnimExists, oppositeDirection } from '../../utils';
import Entity from '../index';


export default class Ghost extends Entity {
	
	home: Phaser.Math.Vector2;
	
	prevTile: Phaser.Math.Vector2;
	
	//////////////////////////////////////////////////
	
	constructor( instance: Instance, x, y, name: string, props, frame: number ) {
		super( instance, x, y, name, frame );
		this.home = new Phaser.Math.Vector2( props.homeX, props.homeY );
		this.setDataEnabled();
	}
	
	createAnims( frame ) {
		this.createDirectionAnims( this.name, {
			right: [ frame, frame + 1 ],
			left:  [ frame + 2, frame + 3 ],
			up:    [ frame + 4, frame + 5 ],
			down:  [ frame + 6, frame + 7 ]
		} );
		createAnimExists( this.scene, {
			key:       'ghost-fright',
			frames:    this.scene.anims.generateFrameNumbers( 'sprites',
				{ frames: [ 64, 65, 64, 65, 64, 65, 66, 67, 66, 67, 66, 67 ] } ),
			frameRate: 15,
			repeat:    Phaser.FOREVER
		} );
		createAnimExists( this.scene, {
			key:       'ghost-fright-quick',
			frames:    this.scene.anims.generateFrameNumbers( 'sprites',
				{ frames: [ 64, 65, 66, 67 ] } ),
			frameRate: 15,
			repeat:    Phaser.FOREVER
		} );
	}
	
	createEvents( x, y, frame ) {
		super.createEvents( x, y, frame );
		this.instance.on( 'reset', () => {
			this.setData( 'home', true );
			this.setData( 'mode', true );
			this.setData( 'fright', 0 );
			this.setData( 'dead', false );
			this.prevTile = null;
		} );
		this.instance.on( 'ghostModeChange', home => {
			this.reverse();
			this.setData( 'mode', home );
		} );
		this.instance.on( 'pacmanEatPellet', ( total, power ) => {
			// TODO: unremove power pellet
			// if ( power && !this.getData( 'dead' ) ) {
			// 	this.reverse();
			// 	this.setData( 'fright', 2 );
			// 	this.scene.time.delayedCall( 4500, () => {
			// 		if ( this.getData( 'fright' ) === 2 ) {
			// 			this.setData( 'fright', 1 );
			// 		}
			// 	} );
			// 	this.scene.time.delayedCall( 6000, () => {
			// 		this.setData( 'fright', 0 );
			// 	} );
			// }
		} );
		this.instance.on( 'ghostLeave', res => {
			if ( this.getData( 'home' ) && !res.left ) {
				this.setData( 'home', false );
				res.left = true;
			}
		} );
		this.instance.on( 'end', () => {
			this.setActive( false );
			this.scene.time.delayedCall( 1000,
				() => this.setVisible( false ) );
		} );
		this.on( 'changedata-home', ( _, val ) => {
			if ( !val ) {
				this.setPosition( 112, 116 );
			}
		} );
	}
	
	//////////////////////////////////////////////////
	
	update() {
		const tile = this.scene.map.worldToTileXY( this.x, this.y );
		if ( !this.prevTile || !tile.equals( this.prevTile ) ) {
			if ( this.getData( 'dead' ) ) {
				if ( tile.y === 14
					&& ( tile.x === 13 || tile.x === 14 )
					&& ( this.prevTile.x === 13 || this.prevTile.x === 14 ) ) {
					this.setData( 'dead', false );
				}
			}
			this.updateNextDirection( tile );
			this.prevTile = tile;
		}
		super.update();
	}
	
	updateNextDirection( tile: Phaser.Math.Vector2 ) {
		if ( this.getData( 'dead' ) ) {
			this.target.set( 13, 14 );
		} else if ( this.getData( 'mode' ) ) {
			this.target.setFromObject( this.home );
		} else {
			this.updateTarget();
		}
		
		if ( this.getData( 'dead' ) || !this.getData( 'fright' ) ) {
			this.targetNextDirection( tile );
		} else {
			this.randomNextDirection( tile );
		}
	}
	
	updateTarget() {
		this.target.setFromObject( this.home );
	}
	
	updateAnimation() {
		if ( this.getData( 'dead' ) ) {
			this.anims.stop();
			switch ( this.direction ) {
			case Phaser.LEFT:
				this.setFrame( 78 );
				break;
			case Phaser.RIGHT:
				this.setFrame( 79 );
				break;
			case Phaser.UP:
				this.setFrame( 80 );
				break;
			case Phaser.DOWN:
				this.setFrame( 81 );
				break;
			}
		} else if ( this.getData( 'fright' ) ) {
			this.play( `ghost-fright${this.getData( 'fright' ) === 2 ? '' : '-quick'}`, true );
		} else {
			super.updateAnimation();
		}
	}
	
	updateVelocity() {
		if ( !this.getData( 'home' ) ) {
			super.updateVelocity();
		} else {
			this.setVelocity( 0 );
		}
	}
	
	updateSnap() {
		if ( !this.getData( 'home' ) && !this.getData( 'dead' ) ) {
			super.updateSnap();
		}
	}
	
	//////////////////////////////////////////////////
	
	reverse() {
		this.nextDirection = oppositeDirection( this.direction );
		this.prevTile = null;
	}
	
	getSpeed() {
		return this.getData( 'dead' ) ? super.getSpeed() * 2 : super.getSpeed() * .8;
	}
	
}
