import Generations from './generations';
import Genome from './genome';
import Network from './network';


export default class NeuroEvolution {
	
	options = {
		// Logistic activation function.
		activation( a ) {
			const ap = -a;
			return ( 1 / ( 1 + Math.exp( ap ) ) );
		},
		randomClamped() {
			return Math.random() * 2 - 1;
		},
		// constious factors and parameters (along with default values).
		network:         [ 1, [ 1 ], 1 ],
		population:      50,
		elitism:         0.2,
		randomBehaviour: 0.2,
		mutationRate:    0.1,
		mutationRange:   0.5,
		historic:        0,
		lowHistoric:     false,
		scoreSort:       -1,
		nbChild:         1
	};
	
	generations = new Generations( this );
	
	constructor( options: {
		// Logistic activation function.
		activation?
		//Returns a random value between -1 and 1.
		randomClamped?
		// Perceptron network structure (1 hidden layer).
		network?
		// Population by generation.
		population?
		// Best networks kepts unchanged for the next generation (rate).
		elitism?
		// New random networks for the next generation (rate).
		randomBehaviour?
		// Mutation rate on the weights of synapses.
		mutationRate?
		// Interval of the mutation changes on the synapse weight.
		mutationRange?
		// Latest generations saved.
		historic?
		// Only save score (not the network).
		lowHistoric?
		// Sort order (-1 = desc, 1 = asc).
		scoreSort?
		// Number of children by breeding.
		nbChild?
	} ) {
		this.options = { ...this.options, ...options };
	}
	
	/**
	 * Reset and create a new Generations object.
	 *
	 * @return void.
	 */
	restart() {
		this.generations = new Generations( this );
	}
	
	/**
	 * Create the next generation.
	 *
	 * @return Neural Network array for next Generation.
	 */
	nextGeneration() {
		let networks: any[] = this.generations.generations.length == 0 ?
			this.generations.firstGeneration() : this.generations.nextGeneration() as any[];
		
		// Create Networks from the current Generation.
		const nns: Network[] = [];
		for ( const i in networks ) {
			const nn = new Network( this );
			nn.setSave( networks[ i ] );
			nns.push( nn );
		}
		
		if ( this.options.lowHistoric ) {
			// Remove old Networks.
			if ( this.generations.generations.length >= 2 ) {
				const genomes =
					      this.generations
						      .generations[ this.generations.generations.length - 2 ]
						      .genomes;
				for ( const i in genomes ) {
					delete genomes[ i ].network;
				}
			}
		}
		
		if ( this.options.historic != -1 ) {
			// Remove older generations.
			if ( this.generations.generations.length > this.options.historic + 1 ) {
				this.generations.generations.splice( 0,
					this.generations.generations.length - ( this.options.historic + 1 ) );
			}
		}
		
		return nns;
	}
	
	/**
	 * Adds a new Genome with specified Neural Network and score.
	 *
	 * @param network - Neural Network.
	 * @param score - Score value.
	 * @return void.
	 */
	networkScore( network, score ) {
		this.generations.addGenome( new Genome( score, network.getSave() ) );
	}
}
