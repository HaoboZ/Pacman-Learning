import Main from './main';


export default class Player extends Phaser.GameObjects.GameObject {
	
	scene: Main;
	
	controls: { [ key: string ]: Phaser.Input.Keyboard.Key } = this.scene.input.keyboard.addKeys( {
		up:    Phaser.Input.Keyboard.KeyCodes.W,
		down:  Phaser.Input.Keyboard.KeyCodes.S,
		left:  Phaser.Input.Keyboard.KeyCodes.A,
		right: Phaser.Input.Keyboard.KeyCodes.D,
		space: Phaser.Input.Keyboard.KeyCodes.SPACE
	} ) as any;
	
	constructor( scene: Phaser.Scene ) {
		super( scene, 'interactive' );
		
		this.controls.up.on( Phaser.Input.Keyboard.Events.DOWN, () => {
			this.scene.entities.pacman.direction = Phaser.UP;
		} );
		this.controls.down.on( Phaser.Input.Keyboard.Events.DOWN, () => {
			this.scene.entities.pacman.direction = Phaser.DOWN;
		} );
		this.controls.left.on( Phaser.Input.Keyboard.Events.DOWN, () => {
			this.scene.entities.pacman.direction = Phaser.LEFT;
		} );
		this.controls.right.on( Phaser.Input.Keyboard.Events.DOWN, () => {
			this.scene.entities.pacman.direction = Phaser.RIGHT;
		} );
		
		this.controls.space.on( Phaser.Input.Keyboard.Events.DOWN, () => {
			this.scene.events.emit( 'reset' );
		} );
	}
	
}
