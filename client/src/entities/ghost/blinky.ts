import Instance from '../../instance';
import Entity from '../index';
import Ghost from './index';


export default class Blinky extends Ghost {
	
	constructor( instance: Instance, x, y, props ) {
		super( instance, x, y, 'blinky', props, 56 );
	}
	
	createEvents( x, y, frame ) {
		super.createEvents( x, y, frame );
		this.instance.on( 'reset',
			() => this.setData( 'home', false ) );
	}
	
	//////////////////////////////////////////////////
	
	updateTarget() {
		const pacman = this.instance.getData( 'pacman' ) as Entity;
		this.target.setFromObject( this.scene.map.worldToTileXY( pacman.x, pacman.y ) );
	}
	
}
