export default class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.12
        this.rotation = 0
        this.speed = 2
    }

    draw(context) {
        context.save()
        context.translate(this.position.x, this.position.y)
        context.rotate(this.rotation)
        context.translate(-this.position.x, -this.position.y)
        context.beginPath()
        context.arc(
            this.position.x,
            this.position.y,
            this.radius,
            this.radians,
            Math.PI * 2 - this.radians
        )
        context.fillStyle = 'brown'
        context.lineTo(this.position.x, this.position.y)
        context.fill()
        context.closePath()
        context.restore()
    }

    update(context) {
        this.draw(context)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.radians < 0 || this.radians > 0.75) {
            this.openRate = -this.openRate
        }
        this.radians += this.openRate
    }
}
