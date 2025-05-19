export default class Player {
    constructor({ position, velocity, sprite  }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.sprite = sprite
        this.rotation = 0
        this.speed = 2
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(this.rotation)
        ctx.drawImage(this.sprite, -this.radius, -this.radius,
            this.radius * 2, this.radius * 2)
        ctx.restore()
    }

    update(ctx) {
        this.draw(ctx)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
