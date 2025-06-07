export default class Ghost {
    static speed = 1.5

    constructor({ position, velocity, sprites }) {
        this.position = position
        this.velocity = velocity
        this.sprites  = sprites
        this.radius   = 15
        this.prevCollisions = []
        this.speed    = 1.5
        this.scared   = false
    }

    draw(ctx) {
        const img = this.scared
            ? this.sprites.inactive
            : this.sprites.active

        ctx.drawImage(img,
            this.position.x - this.radius,
            this.position.y - this.radius,
            this.radius * 2,
            this.radius * 2)
    }

    update(ctx) {
        this.draw(ctx)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
