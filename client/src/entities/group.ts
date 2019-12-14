import Blinky from './ghost/blinky';
import Pacman from './pacman';


export default class Entities extends Phaser.Physics.Arcade.Group {
	
	runChildUpdate = true;
	
	ghosts = this.scene.add.group();
	
	addFromObjects( layer: Phaser.Tilemaps.ObjectLayer ) {
		layer.objects.forEach( ( object ) => {
			const SpriteClass = {
				'pacman': Pacman,
				'blinky': Blinky
			}[ object.name ];
			if ( SpriteClass ) {
				const sprite: Phaser.Physics.Arcade.Sprite = new SpriteClass( this.scene, object.x, object.y,
					object.properties && object.properties.reduce( ( obj, prop ) => ( {
						...obj,
						[ prop.name ]: prop.value
					} ), {} ) );
				this.add( sprite, true );
				sprite.setSize( 8, 8 );
				
				this.scene.data.set( object.name, sprite );
				if ( object.type === 'ghost' ) {
					this.ghosts.add( sprite );
				}
			}
		} );
	}
	
}
