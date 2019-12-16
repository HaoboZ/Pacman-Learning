import Main from './main';


export default class Controller extends Phaser.GameObjects.GameObject {
	
	scene: Main;
	
	controls: { [ key: string ]: Phaser.Input.Keyboard.Key } = this.scene.input.keyboard.addKeys( {
		// up:    Phaser.Input.Keyboard.KeyCodes.W,
		// down:  Phaser.Input.Keyboard.KeyCodes.S,
		// left:  Phaser.Input.Keyboard.KeyCodes.A,
		// right: Phaser.Input.Keyboard.KeyCodes.D,
		space: Phaser.Input.Keyboard.KeyCodes.SPACE,
		one:   Phaser.Input.Keyboard.KeyCodes.ONE,
		two:   Phaser.Input.Keyboard.KeyCodes.TWO,
		three: Phaser.Input.Keyboard.KeyCodes.THREE
	} ) as any;
	
	constructor( scene: Phaser.Scene ) {
		super( scene, 'controller' );
		
		// this.controls.up.on( Phaser.Input.Keyboard.Events.DOWN, () => {
		// 	this.scene.runner.instances.forEach( instance => instance.data.get( 'pacman' ).nextDirection = Phaser.UP );
		// } );
		// this.controls.down.on( Phaser.Input.Keyboard.Events.DOWN, () => {
		// 	this.scene.runner.instances.forEach( instance => instance.data.get( 'pacman' ).nextDirection = Phaser.DOWN );
		// } );
		// this.controls.left.on( Phaser.Input.Keyboard.Events.DOWN, () => {
		// 	this.scene.runner.instances.forEach( instance => instance.data.get( 'pacman' ).nextDirection = Phaser.LEFT );
		// } );
		// this.controls.right.on( Phaser.Input.Keyboard.Events.DOWN, () => {
		// 	this.scene.runner.instances.forEach( instance => instance.data.get( 'pacman' ).nextDirection = Phaser.RIGHT );
		// } );
		
		this.controls.space.on( Phaser.Input.Keyboard.Events.DOWN, () => {
			this.scene.scene.pause();
		} );
		
		this.controls.one.on( Phaser.Input.Keyboard.Events.DOWN, () => {
			this.scene.time.timeScale = this.scene.timeScale = 1;
		} );
		this.controls.two.on( Phaser.Input.Keyboard.Events.DOWN, () => {
			this.scene.time.timeScale = this.scene.timeScale = 2;
		} );
		this.controls.three.on( Phaser.Input.Keyboard.Events.DOWN, () => {
			this.scene.time.timeScale = this.scene.timeScale = 4;
		} );
	}
	
}
