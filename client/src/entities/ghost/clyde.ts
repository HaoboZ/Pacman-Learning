import Instance from '../../instance';
import Entity from '../index';
import Ghost from './index';


export default class Clyde extends Ghost {
	
	constructor( instance: Instance, x, y, props ) {
		super( instance, x, y, 'clyde', props, 98 );
		
		this.instance.on( 'pacmanEatPellet', total => {
			if ( this.data.get( 'home' ) && total <= 244 - 60 ) {
				this.data.set( 'home', false );
			}
		} );
	}
	
	updateTarget() {
		const pacman = this.instance.data.get( 'pacman' ) as Entity;
		const pacmanPos = this.scene.map.worldToTileXY( pacman.x, pacman.y ),
		      tilePos   = this.scene.map.worldToTileXY( pacman.x, pacman.y );
		if ( Phaser.Math.Distance.Squared( tilePos.x, tilePos.y, pacmanPos.x, pacmanPos.y ) > 64 ) {
			this.target.setFromObject( pacmanPos );
		} else {
			this.target.setFromObject( this.home );
		}
	}
	
}
