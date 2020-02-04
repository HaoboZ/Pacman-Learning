import Instance from '../instance';
import { createAnimExists } from '../utils';
import Entity from './index';


export default class Pacman extends Entity {
	
	eatSound = this.scene.sound.add( 'eating' );
	deathSound = this.scene.sound.add( 'miss', {
		volume: .5
	} );
	
	prevTile: Phaser.Math.Vector2;
	
	constructor( instance: Instance, x, y ) {
		super( instance, x, y, 'pacman', 2 );
		
		this.eatSound.addMarker( {
			name:     'play',
			start:    1.20,
			duration: .24,
			config:   {
				volume: .5
			}
		} );
	}
	
	createAnims() {
		this.createDirectionAnims( 'pacman', {
			right: [ 1, 0, 1, 2 ],
			left:  [ 15, 14, 15, 2 ],
			up:    [ 29, 28, 29, 2 ],
			down:  [ 43, 42, 43, 2 ]
		} );
		createAnimExists( this.scene, {
			key:            'pacman-death',
			frames:         this.scene.anims.generateFrameNumbers( 'sprites', { start: 2, end: 13 } ),
			frameRate:      10,
			repeat:         0,
			hideOnComplete: true
		} );
	}
	
	createEvents( x, y, frame ) {
		super.createEvents( x, y, frame );
		this.instance.on( 'pacmanEatPellet', dots => {
			if ( !dots ) {
				this.instance.emit( 'end' );
			}
			if ( this.instance.index === 0 ) {
				if ( !this.eatSound.isPlaying ) {
					this.eatSound.play( 'play' );
				}
			}
		} );
		this.instance.on( 'reset', () => this.prevTile = null );
		this.instance.on( 'death', () => {
			this.anims.stop();
			this.scene.time.delayedCall( 1000,
				() => {
					this.play( 'pacman-death' );
					if ( !this.instance.index ) {
						this.deathSound.play();
					}
				} );
		} );
	}
	
	//////////////////////////////////////////////////
	
	update() {
		if ( this.instance.getData( 'end' ) ) return;
		
		const pelletLayer = this.scene.map.getLayer( 'pellets' ).tilemapLayer as Phaser.Tilemaps.DynamicTilemapLayer,
		      tilePos     = this.scene.map.worldToTileXY( this.x, this.y );
		
		if ( !this.prevTile || !tilePos.equals( this.prevTile ) ) {
			if ( pelletLayer.getTileAt( tilePos.x, tilePos.y, true ) ) {
				const pellet = this.instance.pellets[ tilePos.y * 28 + tilePos.x ];
				if ( pellet !== -1 ) {
					if ( !this.instance.index ) {
						pelletLayer.removeTileAt( tilePos.x, tilePos.y );
					}
					this.instance.pellets[ tilePos.y * 28 + tilePos.x ] = -1;
					const dots = this.instance.getData( 'dots' ) - 1;
					this.instance.setData( 'dots', dots );
					this.instance.emit( 'pacmanEatPellet', dots, pellet !== 46 );
				}
			}
			
			if ( this.scene.runner.neuvol.options.population !== 1 ) {
				this.target = this.scene.runner.generate( this.instance.index );
				this.targetNextDirection( tilePos );
			}
			this.prevTile = tilePos;
		}
		
		if ( this.scene.runner.neuvol.options.population !== 1 ) {
			this.scene.debugGraphic.lineStyle( 1, this.instance.index ? 0xffffff : 0x00ff00, this.instance.index ? 0.25 : 1 );
			this.scene.debugGraphic.lineBetween( this.x, this.y, this.target.x * 8 + 4, this.target.y * 8 + 4 );
		}
		super.update();
	}
	
}
