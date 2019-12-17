import Instance from '../../instance';
import Entity from '../index';
import Ghost from './index';


export default class Clyde extends Ghost {
	
	constructor( instance: Instance, x, y, props ) {
		super( instance, x, y, 'clyde', props, 98 );
	}
	
	createEvents( x, y, frame ) {
		super.createEvents( x, y, frame );
		this.instance.on( 'pacmanEatPellet', total => {
			if ( this.getData( 'home' ) && total <= 244 - 60 ) {
				this.setData( 'home', false );
			}
		} );
	}
	
	//////////////////////////////////////////////////
	
	updateTarget() {
		const pacman = this.instance.getData( 'pacman' ) as Entity;
		const pacmanPos = this.scene.map.worldToTileXY( pacman.x, pacman.y ),
		      tilePos   = this.scene.map.worldToTileXY( pacman.x, pacman.y );
		if ( Phaser.Math.Distance.Squared( tilePos.x, tilePos.y, pacmanPos.x, pacmanPos.y ) > 64 ) {
			this.target.setFromObject( pacmanPos );
		} else {
			this.target.setFromObject( this.home );
		}
	}
	
}
