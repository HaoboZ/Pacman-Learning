import Pacman from './pacman';


export default class Index extends Phaser.Physics.Arcade.Group {
	
	runChildUpdate = true;
	
	pacman: Pacman;
	ghosts = this.scene.add.group();
	
	addFromObjects( layer: Phaser.Tilemaps.ObjectLayer ) {
		layer.objects.forEach( ( object ) => {
			const SpriteClass = {
				'pacman': Pacman
			}[ object.name ];
			if ( SpriteClass ) {
				const sprite: Phaser.Physics.Arcade.Sprite = new SpriteClass( this.scene, object.x, object.y );
				this.add( sprite, true );
				sprite.setSize( 8, 8 );
				if ( object.name === 'pacman' ) {
					this.pacman = sprite as Pacman;
				} else if ( object.type === 'ghost' ) {
					this.ghosts.add( sprite );
				}
			}
		} );
	}
	
}
