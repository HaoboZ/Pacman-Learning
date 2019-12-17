import Instance from './instance';
import NeuroEvolution from './neuroEvolution';


export default class Runner extends Phaser.GameObjects.GameObject {
	
	neuvol = new NeuroEvolution( {
		population: 50,
		network:    [ 14, [ 10 ], 2 ]
	} );
	
	gen = this.neuvol.nextGeneration();
	generation = 0;
	generationText = this.scene.add.text( 0, 0, 'gen: ' );
	
	instances: Instance[] = [];
	alive: number = 0;
	aliveText = this.scene.add.text( 85, 0, 'alive: ' );
	
	constructor( scene: Phaser.Scene ) {
		super( scene, 'runner' );
		
		for ( let i = 0; i < this.neuvol.options.population; ++i ) {
			const instance = new Instance( this.scene, i );
			this.instances.push( instance );
			instance.on( 'end', score => {
				this.aliveText.setText( `alive: ${--this.alive}/${this.neuvol.options.population}` );
				if ( this.neuvol.options.population !== 1 ) {
					this.neuvol.networkScore( this.gen[ i ], score );
				}
				if ( !this.alive ) {
					this.scene.time.delayedCall( 3000, () => this.start() );
				}
			} );
		}
		
		this.start();
	}
	
	start() {
		this.alive = this.neuvol.options.population;
		if ( !this.gen || this.alive !== 1 ) {
			this.gen;
		}
		this.generationText.setText( `gen: ${++this.generation}` );
		this.aliveText.setText( `alive: ${this.alive}/${this.neuvol.options.population}` );
		this.scene.events.emit( 'reset' );
		this.instances.forEach( instance => instance.emit( 'reset' ) );
	}
	
	generate( i ) {
		const instance = this.instances[ i ];
		
		const quadrants = [ 0, 0, 0, 0 ];
		instance.pellets.forEach( ( tile, index ) => {
			if ( tile === -1 ) return;
			if ( index < 504 ) {
				if ( index % 28 < 14 ) {
					quadrants[ 0 ]++;
				} else {
					quadrants[ 1 ]++;
				}
			} else {
				if ( index % 28 < 14 ) {
					quadrants[ 2 ]++;
				} else {
					quadrants[ 3 ]++;
				}
			}
		} );
		const pacmanPos = instance.getData( 'pacman' ).body.position,
		      blinkyPos = instance.getData( 'blinky' ).body.position,
		      pinkyPos  = instance.getData( 'pinky' ).body.position,
		      inkyPos   = instance.getData( 'inky' ).body.position,
		      clydePos  = instance.getData( 'clyde' ).body.position;
		
		const inputs = [ quadrants[ 0 ] / 56, quadrants[ 1 ] / 56, quadrants[ 2 ] / 66, quadrants[ 3 ] / 66,
			pacmanPos.x / 224, pacmanPos.y / 288,
			blinkyPos.x / 224, blinkyPos.y / 288,
			pinkyPos.x / 224, pinkyPos.y / 288,
			inkyPos.x / 224, inkyPos.y / 288,
			clydePos.x / 224, clydePos.y / 288 ];
		const outputs = this.gen[ i ].compute( inputs );
		return new Phaser.Math.Vector2( Math.floor( outputs[ 0 ] * 28 ), Math.floor( outputs[ 1 ] * 36 ) );
	}
	
}
