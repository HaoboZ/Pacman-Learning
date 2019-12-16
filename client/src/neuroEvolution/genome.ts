export default class Genome {
	
	score: number;
	network: {
		neurons: []
		weights: []
	};
	
	/**
	 * Genome class.
	 *
	 * Composed of a score and a Neural Network.
	 *
	 * @constructor
	 *
	 * @param score
	 * @param network
	 */
	constructor( score, network ) {
		this.score = score || 0;
		this.network = network || null;
	}
	
}
