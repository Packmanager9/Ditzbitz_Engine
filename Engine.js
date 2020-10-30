
window.addEventListener('DOMContentLoaded', (event) => {


    let canvas
    let canvas_context

    let keysPressed = {}
    let flex //= canvas.getBoundingClientRect();
    let tip = {}
    let xs
    let ys




    class Line {
        constructor(x, y, x2, y2, color, width) {
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        hypotenuse() {
            let xdif = this.x1 - this.x2
            let ydif = this.y1 - this.y2
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            return Math.sqrt(hypotenuse)
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.x1, this.y1)
            canvas_context.lineTo(this.x2, this.y2)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }


    class LineOP {
        constructor(object, target, color, width) {
            this.object = object
            this.target = target
            this.color = color
            this.width = width
        }
        hypotenuse() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            return Math.sqrt(hypotenuse)
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.object.x, this.object.y)
            canvas_context.lineTo(this.target.x, this.target.y)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }


    class Triangle {
        constructor(x, y, color, length, fill = 0, strokeWidth = 0, leg1Ratio = 1, leg2Ratio = 1, heightRatio = 1) {
            this.x = x
            this.y = y
            this.color = color
            this.length = length
            this.x1 = this.x + this.length * leg1Ratio
            this.x2 = this.x - this.length * leg2Ratio
            this.tip = this.y - this.length * heightRatio
            this.accept1 = (this.y - this.tip) / (this.x1 - this.x)
            this.accept2 = (this.y - this.tip) / (this.x2 - this.x)
            this.fill = fill
            this.stroke = strokeWidth
        }
        draw() {
            canvas_context.strokeStyle = this.color
            canvas_context.stokeWidth = this.stroke
            canvas_context.beginPath()
            canvas_context.moveTo(this.x, this.y)
            canvas_context.lineTo(this.x1, this.y)
            canvas_context.lineTo(this.x, this.tip)
            canvas_context.lineTo(this.x2, this.y)
            canvas_context.lineTo(this.x, this.y)
            if (this.fill == 1) {
                canvas_context.fill()
            }
            canvas_context.stroke()
            canvas_context.closePath()
        }

        isPointInside(point) {
            if (point.x <= this.x1) {
                if (point.y >= this.tip) {
                    if (point.y <= this.y) {
                        if (point.x >= this.x2) {
                            this.accept1 = (this.y - this.tip) / (this.x1 - this.x)
                            this.accept2 = (this.y - this.tip) / (this.x2 - this.x)
                            this.basey = point.y - this.tip
                            this.basex = point.x - this.x
                            if (this.basex == 0) {
                                return true
                            }
                            this.slope = this.basey / this.basex
                            if (this.slope >= this.accept1) {
                                return true
                            } else if (this.slope <= this.accept2) {
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }
    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw() {
            canvas_context.fillStyle = this.color
            canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move() {
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point) {
            if (point.x >= this.x) {
                if (point.y >= this.y) {
                    if (point.x <= this.x + this.width) {
                        if (point.y <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            if (point.x + point.radius >= this.x) {
                if (point.y + point.radius >= this.y) {
                    if (point.x - point.radius <= this.x + this.width) {
                        if (point.y - point.radius <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle {
        constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.friction = friction
            this.reflect = reflect
        }
        draw() {
            canvas_context.lineWidth = 0
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath();
            if (this.radius > 0) {
                canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
            } else {
                console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            }
            canvas_context.fillStyle = this.color
            canvas_context.fill()
            canvas_context.stroke();
        }
        move() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {

                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }

                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }

                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }

                }
                if (this.y - this.radius < 0) {

                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom

        }
        unmove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {

                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }

                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }

                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }

                }
                if (this.y - this.radius < 0) {

                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x -= this.xmom
            this.y -= this.ymom
        }
        frictiveMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {

                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }

                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }

                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }

                }
                if (this.y - this.radius < 0) {

                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
            this.x *= this.friction
            this.y *= this.friction
        }
        frictiveunMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {

                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }

                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }

                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }

                }
                if (this.y - this.radius < 0) {

                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x /= this.friction
            this.y /= this.friction
            this.x -= this.xmom
            this.y -= this.ymom
        }
        isPointInside(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
                return true
            }
            return false
        }
        doesPerimeterTouch(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
                return true
            }
            return false
        }
    }
    class Hexagon {
        constructor(x, y, size, color) {
            this.center = new Circle(x, y, size - (size * .293), "transparent")
            this.nodes = []
            this.angle = 0
            this.size = size
            this.color = color
            this.angleIncrement = (Math.PI * 2) / 6
            for (let t = 0; t < 6; t++) {
                let node = new Circle(this.center.x + (this.size * (Math.cos(this.angle))), this.center.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
        }
        isPointInside(point) {// rough approximation
            this.areaY = point.y - this.center.y
            this.areaX = point.x - this.center.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.center.radius * this.center.radius)) {
                return true
            }
            return false
        }
        draw() {
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = 0
            canvas_context.beginPath()
            canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
            for (let t = 1; t < this.nodes.length; t++) {
                canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
            }
            canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
            canvas_context.fill()
            canvas_context.stroke()
            canvas_context.closePath()
        }
    }
    class Polygon {
        constructor(x, y, size, color, sides = 3) {
            this.center = new Circle(x, y, size - (size * .293), "transparent")
            this.nodes = []
            this.angle = 0
            this.size = size
            this.color = color
            this.angleIncrement = (Math.PI * 2) / sides
            this.sides = sides
            for (let t = 0; t < sides; t++) {
                let node = new Circle(this.center.x + (this.size * (Math.cos(this.angle))), this.center.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
        }
        isPointInside(point) { // rough approximation
            if (this.sides <= 2) {
                return false
            }
            this.areaY = point.y - this.center.y
            this.areaX = point.x - this.center.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.center.radius * this.center.radius)) {
                return true
            }
            return false
        }
        draw() {
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = 0
            canvas_context.beginPath()
            canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
            for (let t = 1; t < this.nodes.length; t++) {
                canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
            }
            canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
            canvas_context.fill()
            canvas_context.stroke()
            canvas_context.closePath()
        }
    }
    class Shape {
        constructor(shapes) {
            this.shapes = shapes
        }
        isPointInside(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].isPointInside(point)) {
                    return true
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return true
                }
            }
            return false
        }
        isInsideOf(box) {

            for (let t = 0; t < this.shapes.length; t++) {
                if (box.isPointInside(this.shapes[t])) {
                    return true
                }
            }
            return false
        }
        push(object) {
            this.shapes.push(object)
        }
    }
    class Spring {
        constructor(x, y, radius, color, body = 0, length = 1, gravity = 0) {
            if (body == 0) {
                this.body = new Circle(x, y, radius, color)
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
                this.length = length
            } else {
                this.body = body
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
                this.length = length
            }
            this.gravity = gravity
        }
        balance() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            if (this.beam.hypotenuse() < this.length) {
                this.body.xmom += (this.body.x - this.anchor.x) / this.length
                this.body.ymom += (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom -= (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom -= (this.body.y - this.anchor.y) / this.length
            } else {
                this.body.xmom -= (this.body.x - this.anchor.x) / this.length
                this.body.ymom -= (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom += (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom += (this.body.y - this.anchor.y) / this.length
            }
            let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
            let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
            this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
            this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
            this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
            this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
        }
        draw() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move() {
            this.anchor.ymom += this.gravity
            this.anchor.move()
        }

    }


    class Observer {
        constructor(x, y, radius, color, range = 100, rays = 10, angle = (Math.PI * .125)) {
            this.body = new Circle(x, y, radius, color)
            this.color = color
            this.ray = []
            this.rayrange = range
            this.globalangle = Math.PI
            this.gapangle = angle
            this.currentangle = 0
            this.obstacles = []
            this.raymake = rays
        }
        beam() {
            this.currentangle = this.gapangle / 2
            for (let k = 0; k < this.raymake; k++) {
                this.currentangle += (this.gapangle / Math.ceil(this.raymake / 2))
                let ray = new Circle(this.body.x, this.body.y, 1, "white", (((Math.cos(this.globalangle + this.currentangle)))), (((Math.sin(this.globalangle + this.currentangle)))))
                ray.collided = 0
                ray.lifespan = this.rayrange - 1
                this.ray.push(ray)
            }
            for (let f = 3; f < this.rayrange / 2; f++) {
                for (let t = 0; t < this.ray.length; t++) {
                    if (this.ray[t].collided < 1) {
                        this.ray[t].move()
                        for (let q = 0; q < this.obstacles.length; q++) {
                            if (this.obstacles[q].isPointInside(this.ray[t])) {
                                this.ray[t].collided = 1
                            }
                        }
                    }
                }
            }
        }

        draw() {
            this.beam()
            this.body.draw()
            canvas_context.lineWidth = 1
            canvas_context.fillStyle = this.color
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath()
            canvas_context.moveTo(this.body.x, this.body.y)
            for (let y = 0; y < this.ray.length; y++) {
                canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
                canvas_context.lineTo(this.body.x, this.body.y)
            }
            canvas_context.stroke()
            canvas_context.fill()
            this.ray = []
        }

        control() {
            if (keysPressed['t']) {
                this.globalangle += .05
            }
            if (keysPressed['r']) {
                this.globalangle -= .05
            }
            if (keysPressed['w']) {
                this.body.y -= 2
            }
            if (keysPressed['d']) {
                this.body.x += 2
            }
            if (keysPressed['s']) {
                this.body.y += 2
            }
            if (keysPressed['a']) {
                this.body.x -= 2
            }
        }
    }




    function setUp(canvas_pass, style = "#000000") {

        canvas = canvas_pass
        canvas_context = canvas.getContext('2d');

        canvas.style.background = style

        window.setInterval(function () {
            canvas_context.clearRect(0, 0, canvas.width, canvas.height)  // refreshes the image
            main()
        }, 17)

        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            delete keysPressed[event.key];
        });



        window.addEventListener('mousedown', e => {
            flex = canvas.getBoundingClientRect();
            xs = e.clientX - flex.left;
            ys = e.clientY - flex.top;
            tip.x = xs
            tip.y = ys
            tip.body = tip
            // example usage: if(squarecircle(squareOnScreen, tip)){ do stuff }
            window.addEventListener('mousemove', continued_stimuli);
        });
        window.addEventListener('mouseup', e => {
            window.removeEventListener("mousemove", continued_stimuli);
        })
        function continued_stimuli(e) {
            flex = canvas.getBoundingClientRect();
            xs = e.clientX - flex.left;
            ys = e.clientY - flex.top;
            tip.x = xs
            tip.y = ys
            tip.body = tip
        }
    }




    // random color that will be visible on  black background
    function getRandomLightColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12) + 4)];
        }
        return color;
    }
    // random color
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 16) + 0)];
        }
        return color;
    }
    // color that will be visible on a black background
    function getRandomDarkColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12))];
        }
        return color;
    }




})