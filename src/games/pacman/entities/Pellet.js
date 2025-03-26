export default class Pellet {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    draw(context) {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'black'
        context.fill()
        context.closePath()
    }
}
