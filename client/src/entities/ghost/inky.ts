import Instance from '../../instance';
import Entity from '../index';
import Ghost from './index';


export default class Inky extends Ghost {
	
	constructor( instance: Instance, x, y, props ) {
		super( instance, x, y, 'inky', props, 84 );
		
		this.instance.on( 'pacmanEatPellet', total => {
			if ( this.data.get( 'home' ) && total <= 244 - 30 ) {
				this.data.set( 'home', false );
			}
		} );
	}
	
	updateTarget() {
		const pacman = this.instance.data.get( 'pacman' ) as Entity,
		      blinky = this.instance.data.get( 'blinky' ) as Entity;
		
		const velocity = new Phaser.Math.Vector2(
			+( pacman.direction === Phaser.RIGHT ) - +( pacman.direction === Phaser.LEFT ),
			+( pacman.direction === Phaser.DOWN ) - +( pacman.direction === Phaser.UP ) );
		
		this.target.setFromObject( this.scene.map.worldToTileXY( pacman.x, pacman.y )
			.add( velocity.scale( 2 ) ).scale( 2 )
			.subtract( this.scene.map.worldToTileXY( blinky.x, blinky.y ) ) );
	}
	
}
