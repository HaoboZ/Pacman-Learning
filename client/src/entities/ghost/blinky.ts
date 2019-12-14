import Ghost from './index';


export default class Blinky extends Ghost {
	
	constructor( scene: Phaser.Scene, x, y, props ) {
		super( scene, x, y, 'blinky', props, 56 );
		
		this.scene.events.on( 'reset', () => {
			this.data.set( 'home', false );
		} );
		this.on( 'changedata-home', ( _, val ) => {
			if ( val ) {
				this.data.set( 'home', false );
			}
		} );
	}
	
	updateTarget( openDirections: {} ) {
		this.target.setFromObject(
			this.scene.map.worldToTileXY( this.scene.data.get( 'pacman' ).x, this.scene.data.get( 'pacman' ).y ) );
	}
	
}
