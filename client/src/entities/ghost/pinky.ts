import Entity from '../index';
import Ghost from './index';


export default class Pinky extends Ghost {
	
	constructor( scene: Phaser.Scene, x, y, props ) {
		super( scene, x, y, 'pinky', props, 70 );
		
		this.scene.events.on( 'reset', () => {
			this.scene.time.delayedCall( 500, () => {
				this.data.set( 'home', false );
			} );
		} );
	}
	
	updateTarget() {
		const pacman = this.scene.data.get( 'pacman' ) as Entity;
		const velocity = new Phaser.Math.Vector2(
			+( pacman.direction === Phaser.RIGHT ) - +( pacman.direction === Phaser.LEFT ),
			+( pacman.direction === Phaser.DOWN ) - +( pacman.direction === Phaser.UP ) );
		this.target.setFromObject( velocity ).scale( 4 )
			.add( this.scene.map.worldToTileXY( pacman.x, pacman.y ) );
	}
	
}
