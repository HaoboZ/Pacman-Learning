import * as dat from 'dat.gui';

import Main from './main';


export default class Controller {
	
	scene: Main;
	
	gui = new dat.GUI();
	
	// controls: { [ key: string ]: Phaser.Input.Keyboard.Key };
	
	constructor( scene: Main ) {
		this.scene = scene;
		
		this.gui.add( this.scene.scene, 'pause' );
		this.gui.add( this.scene.scene, 'resume' );
		this.gui.add( this.scene.sound, 'mute' ).listen();
		this.gui.add( this.scene, 'timeScale', .1, 4 )
			.onChange( val => this.scene.time.timeScale = val );
		
		// this.controls = this.scene.input.keyboard.addKeys( {
		// 	up:    Phaser.Input.Keyboard.KeyCodes.W,
		// 	down:  Phaser.Input.Keyboard.KeyCodes.S,
		// 	left:  Phaser.Input.Keyboard.KeyCodes.A,
		// 	right: Phaser.Input.Keyboard.KeyCodes.D
		// } ) as any
		//
		// this.controls.up.on( Phaser.Input.Keyboard.Events.DOWN,
		// 	() => this.scene.runner.instances.forEach( instance => instance.data.get( 'pacman' ).nextDirection = Phaser.UP ) );
		// this.controls.down.on( Phaser.Input.Keyboard.Events.DOWN,
		// 	() => this.scene.runner.instances.forEach( instance => instance.data.get( 'pacman' ).nextDirection = Phaser.DOWN ) );
		// this.controls.left.on( Phaser.Input.Keyboard.Events.DOWN,
		// 	() => this.scene.runner.instances.forEach( instance => instance.data.get( 'pacman' ).nextDirection = Phaser.LEFT ) );
		// this.controls.right.on( Phaser.Input.Keyboard.Events.DOWN,
		// 	() => this.scene.runner.instances.forEach( instance => instance.data.get( 'pacman' ).nextDirection = Phaser.RIGHT ) );
	}
	
}
