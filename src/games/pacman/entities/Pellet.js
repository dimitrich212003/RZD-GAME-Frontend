export default class Pellet {
    constructor({ position, sprite }) {
        this.position = position
        this.sprite = sprite
        this.radius = 8
    }

    draw(ctx) {
        ctx.drawImage(this.sprite,
            this.position.x - this.radius,
            this.position.y - this.radius,
            this.radius * 2,
            this.radius * 2)
    }
}
