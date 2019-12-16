import Instance from '../instance';
import { createAnimExists, oppositeDirection } from '../utils';
import Entity from './index';


export default class Pacman extends Entity {
	
	prevTile: Phaser.Math.Vector2;
	
	target = new Phaser.Math.Vector2();
	
	constructor( instance: Instance, x, y ) {
		super( instance, x, y, 'pacman', 2 );
		
		this.createAnims( 'pacman', {
			right: [ 1, 0, 1, 2 ],
			left:  [ 15, 14, 15, 2 ],
			up:    [ 29, 28, 29, 2 ],
			down:  [ 43, 42, 43, 2 ]
		} );
		createAnimExists( this.scene, {
			key:            'pacman-death',
			frames:         this.scene.anims.generateFrameNumbers( 'sprites', { start: 3, end: 13 } ),
			frameRate:      15,
			repeat:         0,
			hideOnComplete: true
		} );
		
		this.instance.on( 'reset', () => {
			this.prevTile = null;
		} );
		this.instance.on( 'end', () => {
			this.anims.stop();
			this.scene.time.delayedCall( 1000, () => {
				this.play( 'pacman-death' );
			} );
		} );
	}
	
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
					if ( !dots ) {
						this.instance.emit( 'reset', true );
					}
				}
			}
			
			this.target = this.scene.runner.generate( this.instance.index );
			this.updateNextDirection( tilePos );
			this.prevTile = tilePos;
		}
		
		this.scene.debugGraphic.lineStyle( 1, this.instance.index ? 0xffffff : 0x00ff00, this.instance.index ? 0.25 : 1 );
		this.scene.debugGraphic.lineBetween( this.x, this.y, this.target.x * 8 + 4, this.target.y * 8 + 4 );
		super.update();
	}
	
	updateNextDirection( tile: Phaser.Math.Vector2 ) {
		const openDirections = {
			[ Phaser.RIGHT ]: this.scene.map.getTileAt( tile.x + 1, tile.y, true ),
			[ Phaser.LEFT ]:  this.scene.map.getTileAt( tile.x - 1, tile.y, true ),
			[ Phaser.UP ]:    this.scene.map.getTileAt( tile.x, tile.y - 1, true ),
			[ Phaser.DOWN ]:  this.scene.map.getTileAt( tile.x, tile.y + 1, true )
		};
		let nearestDirection = this.nextDirection,
		    nearestDistance  = Infinity;
		for ( const direction in openDirections ) {
			if ( !openDirections[ direction ] ) continue;
			if ( openDirections[ direction ].index !== -1 ) continue;
			if ( +direction === oppositeDirection( this.nextDirection ) ) continue;
			
			let distance = Phaser.Math.Distance.Squared(
				openDirections[ direction ].x,
				openDirections[ direction ].y,
				this.target.x,
				this.target.y );
			if ( distance < nearestDistance ) {
				nearestDirection = +direction;
				nearestDistance = distance;
			}
		}
		this.nextDirection = nearestDirection;
	}
	
}
