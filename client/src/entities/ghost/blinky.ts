import Entity from '../index';
import Ghost from './index';


export default class Blinky extends Ghost {
	
	constructor( scene: Phaser.Scene, x, y, props ) {
		super( scene, x, y, 'blinky', props, 56 );
		
		this.scene.events.on( 'reset', () => {
			this.data.set( 'home', false );
		} );
	}
	
	updateTarget() {
		const pacman = this.scene.data.get( 'pacman' ) as Entity;
		this.target.setFromObject( this.scene.map.worldToTileXY( pacman.x, pacman.y ) );
	}
	
}
