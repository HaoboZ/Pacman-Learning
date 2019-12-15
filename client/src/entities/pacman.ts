import Instance from '../instance';
import { oppositeDirection } from '../utils';
import Entity from './index';


export default class Pacman extends Entity {
	
	prevTile: Phaser.Math.Vector2;
	
	constructor( instance: Instance, x, y ) {
		super( instance, x, y, 'pacman', 2 );
		
		this.createAnims( 'pacman', {
			right: [ 1, 0, 1, 2 ],
			left:  [ 15, 14, 15, 2 ],
			up:    [ 29, 28, 29, 2 ],
			down:  [ 43, 42, 43, 2 ]
		} );
	}
	
	update() {
		const pelletLayer = this.scene.map.getLayer( 'pellets' ).tilemapLayer as Phaser.Tilemaps.DynamicTilemapLayer,
		      tilePos     = this.scene.map.worldToTileXY( this.x, this.y );
		
		if ( !this.prevTile || !tilePos.equals( this.prevTile ) ) {
			if ( pelletLayer.getTileAt( tilePos.x, tilePos.y, true ) ) {
				const pellet = this.instance.pellets[ tilePos.y * 28 + tilePos.x ];
				if ( pellet !== -1 ) {
					if ( this.instance.main ) {
						pelletLayer.removeTileAt( tilePos.x, tilePos.y );
					}
					this.instance.pellets[ tilePos.y * 28 + tilePos.x ] = -1;
					const dots = this.instance.data.get( 'dots' ) - 1;
					this.instance.data.set( 'dots', dots );
					this.instance.emit( 'pacmanEatPellet', dots, pellet !== 46 );
					if ( !dots ) {
						this.instance.emit( 'end', 244 );
						this.instance.data.set( 'end', true );
					}
				}
			}
			
			this.updateNextDirection( tilePos );
			this.prevTile = tilePos;
		}
		
		super.update();
	}
	
	updateNextDirection( tile: Phaser.Math.Vector2 ) {
		const openDirections = {
			[ Phaser.RIGHT ]: this.scene.map.getTileAt( tile.x + 1, tile.y, true ),
			[ Phaser.LEFT ]:  this.scene.map.getTileAt( tile.x - 1, tile.y, true ),
			[ Phaser.UP ]:    this.scene.map.getTileAt( tile.x, tile.y - 1, true ),
			[ Phaser.DOWN ]:  this.scene.map.getTileAt( tile.x, tile.y + 1, true )
		};
		
		const directions = [];
		for ( const direction in openDirections ) {
			if ( !openDirections[ direction ] ) continue;
			if ( openDirections[ direction ].index !== -1 ) continue;
			if ( +direction === oppositeDirection( this.nextDirection ) ) continue;
			directions.push( +direction );
		}
		
		if ( directions.length ) {
			this.nextDirection = Phaser.Utils.Array.GetRandom( directions );
		}
	}
	
}
