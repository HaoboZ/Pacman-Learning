import Entity from './index';


export default class Pacman extends Entity {
	
	constructor( scene: Phaser.Scene, x, y ) {
		super( scene, x, y, 'pacman', 2 );
		
		this.createAnims( 'pacman', {
			right: [ 1, 0, 1, 2 ],
			left:  [ 15, 14, 15, 2 ],
			up:    [ 29, 28, 29, 2 ],
			down:  [ 43, 42, 43, 2 ]
		} );
	}
	
	update() {
		const tile = this.scene.pelletLayer.getTileAtWorldXY( this.x, this.y );
		if ( tile ) {
			this.scene.events.emit( 'pacmanEatPellet', tile.index !== 46 );
			this.scene.pelletLayer.removeTileAt( tile.x, tile.y );
			if ( !this.scene.pelletLayer.tilesDrawn ) {
				this.scene.events.emit( 'reset' );
			}
		}
		super.update();
	}
	
}
