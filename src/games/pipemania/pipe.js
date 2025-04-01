export default class Pipe {
    constructor(flow = Pipe.random()) {
        this.flow = flow;
        this.img = flow.img;
        this.fill = false;
    }

    setFlowIn(dir) {
        this.flow[dir] = "in";
    }

    setFlowOut(dir) {
        this.flow[dir] = "out";
    }

    checkConnection(otherPipe) {
        const dir1 = this.getFlowDir('out');
        const dir2 = Pipe.complement(dir1);
        return Object.prototype.hasOwnProperty.call(otherPipe.flow, dir2);
    }

    getFlowDir(flow) {
        return Object.keys(this.flow).find(key => this.flow[key] === flow);
    }

    resetFlow() {
        Object.keys(this.flow).forEach(key => {
            if (key !== "img") {
                this.flow[key] = "";
            }
        });
    }

    // Для определения противоположного направления (up->down и т.д.)
    static complement(dir) {
        switch (dir) {
            case 'up':    return 'down';
            case 'down':  return 'up';
            case 'left':  return 'right';
            case 'right': return 'left';
            default:      return "";
        }
    }

    // Стартовая труба
    static source() {
        // img:6 (по аналогии с оригиналом)
        return new Pipe({ 'right': 'out', img: 6 });
    }

    // Конечная труба
    static destination() {
        // img:1 (по аналогии с оригиналом)
        return new Pipe({ 'up': 'in', img: 1 });
    }

    // Выбор случайной конфигурации
    static random() {
        return Pipe.SECTIONS[Math.floor(Math.random() * Pipe.SECTIONS.length)];
    }
}

// Из оригинального кода:
Pipe.SECTIONS = [
    { 'up': '', 'down': '', 'img': 1 },
    { 'left': '', 'right': '', 'img': 0 },
    { 'up': '', 'down': '', 'img': 1 },
    { 'left': '', 'right': '', 'img': 0 },
    { 'up': '', 'left': '', 'img': 3 },
    { 'up': '', 'right': '', 'img': 4 },
    { 'down': '', 'left': '', 'img': 2 },
    { 'down': '', 'right': '', 'img': 5 }
];

// Движение для out-flow
Pipe.MOVES = {
    'up':    [ 0, -1],
    'down':  [ 0,  1],
    'left':  [-1,  0],
    'right': [ 1,  0]
};