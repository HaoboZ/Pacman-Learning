import Instance from '../../instance';
import Entity from '../index';
import Ghost from './index';


export default class Blinky extends Ghost {
	
	constructor( instance: Instance, x, y, props ) {
		super( instance, x, y, 'blinky', props, 56 );
		
		this.instance.on( 'reset', () => {
			this.data.set( 'home', false );
		} );
	}
	
	updateTarget() {
		const pacman = this.instance.data.get( 'pacman' ) as Entity;
		this.target.setFromObject( this.scene.map.worldToTileXY( pacman.x, pacman.y ) );
	}
	
}
