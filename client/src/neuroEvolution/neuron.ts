import NeuroEvolution from './index';


export default class Neuron {
	
	neat: NeuroEvolution;
	
	value = 0;
	weights = [];
	
	/**
	 * Artificial Neuron class
	 *
	 * @constructor
	 * @param neat - NeuroEvolution creator
	 */
	constructor( neat: NeuroEvolution ) {
		this.neat = neat;
	}
	
	/**
	 * Initialize number of neuron weights to random clamped values.
	 *
	 * @param nb - Number of neuron weights (number of inputs).
	 * @return void
	 */
	populate( nb ) {
		this.weights = [];
		for ( let i = 0; i < nb; i++ ) {
			this.weights.push( this.neat.options.randomClamped() );
		}
	}
	
}
