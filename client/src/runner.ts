import Instance from './instance';
import NeuroEvolution from './neuroEvolution';
import Network from './neuroEvolution/network';


export default class Runner extends Phaser.GameObjects.GameObject {
	
	neuvol = new NeuroEvolution( {
		population: 50,
		network:    [ 10, [ 10 ], 2 ]
	} );
	
	gen: Network[];
	generation = 0;
	generationText: Phaser.GameObjects.Text;
	
	instances: Instance[] = [];
	alive: number = 0;
	aliveText: Phaser.GameObjects.Text;
	
	constructor( scene: Phaser.Scene ) {
		super( scene, 'runner' );
		
		for ( let i = 0; i < this.neuvol.options.population; ++i ) {
			const instance = new Instance( this.scene, i );
			this.instances.push( instance );
			instance.on( 'end', score => {
				this.aliveText.setText( `${--this.alive}/${this.neuvol.options.population}` );
				this.neuvol.networkScore( this.gen[ i ], score );
				if ( !this.alive ) {
					this.scene.time.delayedCall( 2000, () => {
						this.start();
					} );
				}
			} );
		}
		
		this.generationText = this.scene.add.text( 0, 0, '' );
		this.aliveText = this.scene.add.text( 50, 0, '' );
		
		this.start();
	}
	
	start() {
		this.alive = this.neuvol.options.population;
		this.gen = this.neuvol.nextGeneration();
		this.generationText.setText( ( ++this.generation ).toString() );
		this.aliveText.setText( `${this.alive}/${this.neuvol.options.population}` );
		this.scene.events.emit( 'reset' );
		this.instances.forEach( instance => instance.emit( 'reset' ) );
	}
	
	generate( i ) {
		const instance = this.instances[ i ];
		
		const pacmanPos = instance.getData( 'pacman' ).body.position,
		      blinkyPos = instance.getData( 'blinky' ).body.position,
		      pinkyPos  = instance.getData( 'pinky' ).body.position,
		      inkyPos   = instance.getData( 'inky' ).body.position,
		      clydePos  = instance.getData( 'clyde' ).body.position;
		const inputs = [ pacmanPos.x / 224, pacmanPos.y / 288,
			blinkyPos.x / 224, blinkyPos.y / 288,
			pinkyPos.x / 224, pinkyPos.y / 288,
			inkyPos.x / 224, inkyPos.y / 288,
			clydePos.x / 224, clydePos.y / 288 ];
		const outputs = this.gen[ i ].compute( inputs );
		return new Phaser.Math.Vector2( Math.floor( outputs[ 0 ] * 28 ), Math.floor( outputs[ 1 ] * 36 ) );
	}
	
}
