import NeuroEvolution from './index';
import Neuron from './neuron';


export default class Layer {
	
	neat: NeuroEvolution;
	
	id;
	neurons: Neuron[] = [];
	
	/**
	 * Neural Network Layer class.
	 *
	 * @constructor
	 * @param neat - NeuroEvolution creator
	 * @param index - Index of this Layer in the Network.
	 */
	constructor( neat: NeuroEvolution, index ) {
		this.neat = neat;
		this.id = index || 0;
	}
	
	/**
	 * Populate the Layer with a set of randomly weighted Neurons.
	 *
	 * Each Neuron be initialized with nbInputs inputs with a random clamped
	 * value.
	 *
	 * @param nbNeurons - Number of neurons.
	 * @param nbInputs - Number of inputs.
	 * @return void
	 */
	populate( nbNeurons, nbInputs ) {
		this.neurons = [];
		for ( let i = 0; i < nbNeurons; i++ ) {
			const n = new Neuron( this.neat );
			n.populate( nbInputs );
			this.neurons.push( n );
		}
	}
	
}
