import Instance from './instance';
import Main from './main';
import NeuroEvolution from './neuroEvolution';
import Network from './neuroEvolution/network';
import Timeline from './timeline';


export default class Runner {
	
	scene: Main;
	
	neuvol = new NeuroEvolution( {
		population:    200,
		mutationRange: .8,
		mutationRate:  .2,
		network:       [ 8, [ 10 ], 2 ]
	} );
	gen: Network[];
	
	instances: Instance[] = [];
	
	generation = 0;
	generationText = this.scene.add.text( 0, 0, 'gen: ' );
	
	alive: number = 0;
	aliveText = this.scene.add.text( 85, 0, 'alive: ' );
	
	constructor( scene: Main ) {
		this.scene = scene;
		
		const timeline = new Timeline( this );
		
		const data = [];
		for ( let i = 0; i < this.neuvol.options.population; ++i ) {
			const instance = new Instance( this.scene, i );
			this.instances.push( instance );
			instance.on( 'death', () => {
				this.aliveText.setText( `alive: ${--this.alive}/${this.neuvol.options.population}` );
				if ( this.neuvol.options.population !== 1 ) {
					// Math.floor( ( this.scene.time.now - this.scene.startTime ) / 100 );
					data[ i ] = instance.score;
					this.neuvol.networkScore( this.gen[ i ], data[ i ] );
				}
				if ( !this.alive ) {
					timeline.addPoint( this.generation,
						Math.min( ...data ), data.reduce( ( a, b ) => a + b, 0 ) / data.length, Math.max( ...data ) );
					this.scene.time.delayedCall( 3000, () => this.start() );
				}
			} );
		}
		
		this.start();
	}
	
	start() {
		this.alive = this.neuvol.options.population;
		if ( !this.gen || this.alive !== 1 ) {
			this.gen = this.neuvol.nextGeneration();
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
				quadrants[ index % 28 < 14 ? 0 : 1 ]++;
			} else {
				quadrants[ index % 28 < 14 ? 2 : 3 ]++;
			}
		} );
		const pacmanPos = instance.getData( 'pacman' ).body.position,
		      blinkyPos = instance.getData( 'blinky' ).body.position;
		// pinkyPos  = instance.getData( 'pinky' ).body.position,
		// inkyPos   = instance.getData( 'inky' ).body.position,
		// clydePos  = instance.getData( 'clyde' ).body.position;
		
		const inputs = [ quadrants[ 0 ] / 56, quadrants[ 1 ] / 56, quadrants[ 2 ] / 66, quadrants[ 3 ] / 66,
			pacmanPos.x / 224, pacmanPos.y / 288,
			blinkyPos.x / 224, blinkyPos.y / 288 ];
		// pinkyPos.x / 224, pinkyPos.y / 288,
		// inkyPos.x / 224, inkyPos.y / 288,
		// clydePos.x / 224, clydePos.y / 288 ];
		const outputs = this.gen[ i ].compute( inputs );
		return new Phaser.Math.Vector2( Math.floor( outputs[ 0 ] * 28 ), Math.floor( outputs[ 1 ] * 36 ) );
	}
	
}
