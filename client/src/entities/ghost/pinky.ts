import Instance from '../../instance';
import Entity from '../index';
import Ghost from './index';


export default class Pinky extends Ghost {
	
	constructor( instance: Instance, x, y, props ) {
		super( instance, x, y, 'pinky', props, 70 );
	}
	
	createEvents( x, y, frame ) {
		super.createEvents( x, y, frame );
		this.instance.on( 'reset',
			() => this.scene.time.delayedCall( 500,
				() => this.setData( 'home', false ) ) );
	}
	
	//////////////////////////////////////////////////
	
	updateTarget() {
		const pacman = this.instance.getData( 'pacman' ) as Entity;
		const velocity = new Phaser.Math.Vector2(
			+( pacman.direction === Phaser.RIGHT ) - +( pacman.direction === Phaser.LEFT ),
			+( pacman.direction === Phaser.DOWN ) - +( pacman.direction === Phaser.UP ) );
		this.target.setFromObject( velocity ).scale( 4 )
			.add( this.scene.map.worldToTileXY( pacman.x, pacman.y ) );
	}
	
}
