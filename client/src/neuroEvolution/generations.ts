import Generation from './generation';
import NeuroEvolution from './index';
import Network from './network';


export default class Generations {
	
	neat: NeuroEvolution;
	
	generations: Generation[] = [];
	currentGeneration = new Generation( this.neat );
	
	/**
	 * Generations class.
	 *
	 * Hold's previous Generations and current Generation.
	 *
	 * @constructor
	 * @param neat - NeuroEvolution creator
	 */
	constructor( neat: NeuroEvolution ) {
		this.neat = neat;
	}
	
	/**
	 * Create the first generation.
	 *
	 * @param input - Input layer.
	 * @param hiddens - Hidden layer(s).
	 * @param output - Output layer.
	 * @return First Generation.
	 */
	firstGeneration( input?, hiddens?, output? ): any[] {
		// FIXME input, hiddens, output unused.
		
		const out = [];
		for ( let i = 0; i < this.neat.options.population; i++ ) {
			// Generate the Network and save it.
			const nn = new Network( this.neat );
			nn.perceptronGeneration( this.neat.options.network[ 0 ],
				this.neat.options.network[ 1 ],
				this.neat.options.network[ 2 ] );
			out.push( nn.getSave() );
		}
		
		this.generations.push( new Generation( this.neat ) );
		return out;
	}
	
	/**
	 * Create the next Generation.
	 *
	 * @return Next Generation.
	 */
	nextGeneration(): any[] | boolean {
		if ( this.generations.length == 0 ) {
			// Need to create first generation.
			return false;
		}
		
		const gen = this.generations[ this.generations.length - 1 ]
			.generateNextGeneration();
		this.generations.push( new Generation( this.neat ) );
		return gen;
	}
	
	/**
	 * Add a genome to the Generations.
	 *
	 * @param genome
	 * @return False if no Generations to add to.
	 */
	addGenome( genome ) {
		// Can't add to a Generation if there are no Generations.
		if ( this.generations.length == 0 ) return false;
		
		// FIXME addGenome returns void.
		return this.generations[ this.generations.length - 1 ].addGenome( genome );
	}
	
}
