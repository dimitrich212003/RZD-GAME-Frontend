export default class Ghost {
    static speed = 1.5

    constructor({ position, velocity, color = 'red' }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 1.5
        this.scared = false
    }

    draw(context) {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = this.scared ? 'blue' : this.color
        context.fill()
        context.closePath()
    }

    update(context) {
        this.draw(context)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
