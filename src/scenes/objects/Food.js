import Phaser from 'phaser';

import { WIDTH, HEIGHT, LENGTH } from '../../config/config';

// Food Object
export default class Food extends Phaser.GameObjects.Image {
    /**
     *  The food logic that can be eaten by the snake.
     *
     *  @param {Phaser.Scene} scene - The scene that owns this image.
     *  @param {number} x - The horizontal coordinate relative to the scene viewport.
     *  @param {number} y - The vertical coordinate relative to the scene viewport.
     *  @extends Phaser.GameObjects.Image
     */
    constructor(scene, x, y) {
        super(scene, x * LENGTH, y * LENGTH, 'food').setOrigin(0);

        scene.children.add(this);
    }

    /**
     *  We can place the food anywhere in our grid *except* on-top of the snake,
     *  so we need to filter those out of the possible food locations. If there
     *  aren't any locations left, the player won!
     *
     *  @public
     *  @param {Snake} snake - The snake object.
     *  @returns {boolean} True if the food was placed, otherwise false.
     */
    reposition(snake) {
        //  First, create a grid that assumes all positions are valid for the new
        //  piece of food.
        const testGrid = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => true));

        snake.updateGrid(testGrid);

        //  Purge out false positions.
        const validLocations = [];

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (testGrid[y][x] === true) {
                    //  Is this position valid for food? If so, add it here...
                    validLocations.push({ x, y });
                }
            }
        }

        if (validLocations.length > 0) {
            //  Use the RNG to pick a random food position.
            const pos = Phaser.Math.RND.pick(validLocations);

            //  And place it.
            this.setPosition(pos.x * LENGTH, pos.y * LENGTH);

            return true;
        }

        return false;
    }
}
