const opposites = {
	[ Phaser.UP ]:    Phaser.DOWN,
	[ Phaser.DOWN ]:  Phaser.UP,
	[ Phaser.LEFT ]:  Phaser.RIGHT,
	[ Phaser.RIGHT ]: Phaser.LEFT
};

export function oppositeDirection( direction ) {
	return opposites[ direction ];
}

export function createAnimExists( scene: Phaser.Scene, config: Phaser.Types.Animations.Animation ) {
	if ( !scene.anims.exists( config.key ) ) {
		scene.anims.create( config );
	}
}