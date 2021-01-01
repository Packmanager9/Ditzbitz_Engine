
let scape1 = new Image()
scape1.src = "2399.jpg"
let scape2 = new Image()
scape2.src = "1876.jpg"
let scape3 = new Image()
scape3.src = "3930.jpg"
let scape4 = new Image()
scape4.src = "1624.jpg"
let scape5 = new Image()
scape5.src = "1847.jpg"
let bumper = new Audio()
bumper.src = "bumpy.wav"


let alertsong = new Audio()
alertsong.src = "Alert.wav"
let betraysong = new Audio()
betraysong.src = "Betray.wav"
let blocksong = new Audio()
blocksong.src = "Block.wav"
let bypasssong = new Audio()
bypasssong.src = "Bypass.wav"
let detonatesong = new Audio()
detonatesong.src = "Detonate.wav"
let drainsong = new Audio()
drainsong.src = "Drain.wav"
let enragesong = new Audio()
enragesong.src = "Enrage.wav"
let paddingsong = new Audio()
paddingsong.src = "Padding.wav"
let poisonedsong = new Audio()
poisonedsong.src = "Poisoned.wav"
let rampagesong = new Audio()
rampagesong.src = "Rampage.wav"
let resistsong = new Audio()
resistsong.src = "Resist.wav"
let stunsong = new Audio()
stunsong.src = "Stunned.wav"
let summonsong = new Audio()
summonsong.src = "Summoner.wav"
let thicksong = new Audio()
thicksong.src = "Thick.wav"
let thornsong = new Audio()
thornsong.src = "Thorns.wav"
let treatsong = new Audio()
treatsong.src = "Treat.wav"
let venomsong = new Audio()
venomsong.src = "Venom.wav"
let healsong = new Audio()
healsong.src = "Heal.wav"
window.addEventListener('DOMContentLoaded', (event) => {
    const gamepadAPI = {
        controller: {},
        turbo: true,
        connect: function (evt) {
            if (navigator.getGamepads()[0] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[1] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[2] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[3] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            }
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i] === null) {
                    continue;
                }
                if (!gamepads[i].connected) {
                    continue;
                }
            }
        },
        disconnect: function (evt) {
            gamepadAPI.turbo = false;
            delete gamepadAPI.controller;
        },
        update: function () {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.buttonsCache = [];// clear the buttons cache
            for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {// move the buttons status from the previous frame to the cache
                gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
            }
            gamepadAPI.buttonsStatus = [];// clear the buttons status
            var c = gamepadAPI.controller || {}; // get the gamepad object
            var pressed = [];
            if (c.buttons) {
                for (var b = 0, t = c.buttons.length; b < t; b++) {// loop through buttons and push the pressed ones to the array
                    if (c.buttons[b].pressed) {
                        pressed.push(gamepadAPI.buttons[b]);
                    }
                }
            }
            var axes = [];
            if (c.axes) {
                for (var a = 0, x = c.axes.length; a < x; a++) {// loop through axes and push their values to the array
                    axes.push(c.axes[a].toFixed(2));
                }
            }
            gamepadAPI.axesStatus = axes;// assign received values
            gamepadAPI.buttonsStatus = pressed;
            // console.log(pressed); // return buttons for debugging purposes
            return pressed;
        },
        buttonPressed: function (button, hold) {
            var newPress = false;
            for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {// loop through pressed buttons
                if (gamepadAPI.buttonsStatus[i] == button) {// if we found the button we're looking for...
                    newPress = true;// set the boolean variable to true
                    if (!hold) {// if we want to check the single press
                        for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {// loop through the cached states from the previous frame
                            if (gamepadAPI.buttonsCache[j] == button) { // if the button was already pressed, ignore new press
                                newPress = false;
                            }
                        }
                    }
                }
            }
            return newPress;
        },
        buttons: [
            'A', 'B', 'X', 'Y', 'LB', 'RB', 'Left-Trigger', 'Right-Trigger', 'Back', 'Start', 'Axis-Left', 'Axis-Right', 'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right', "Power"
        ],
        buttonsCache: [],
        buttonsStatus: [],
        axesStatus: []
    };
    let canvas
    let canvas_context
    let keysPressed = {}
    let FLEX_engine
    let TIP_engine = {}
    let XS_engine
    let YS_engine
    class Point {
        constructor(x, y) {
            this.x = x
            this.y = y
            this.radius = 0
        }
        pointDistance(point) {
            return (new LineOP(this, point, "transparent", 0)).hypotenuse()
        }
    }
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
        constructor(x, y, width, height, color, fill = 1, stroke = 0, strokeWidth = 1) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
            this.stroke = stroke
            this.strokeWidth = 2
            this.fill = fill
        }
        draw() {

            canvas_context.beginPath()
            canvas_context.fillStyle = this.color
            canvas_context.strokeStyle = "white"
            canvas_context.lineWidth = Math.max(this.strokeWidth, .00001)
            canvas_context.strokeRect(this.x, this.y, this.width, this.height)
            canvas_context.fillRect(this.x, this.y, this.width, this.height)

            canvas_context.closePath()
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
        constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.friction = friction
            this.reflect = reflect
            this.strokeWidth = strokeWidth
            this.strokeColor = strokeColor
            this.locked = 0
        }
        draw() {
            canvas_context.lineWidth = this.strokeWidth
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath();
            if (this.radius > 0) {
                canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                canvas_context.fillStyle = this.color
                canvas_context.fill()
                canvas_context.stroke();
            } else {
                // console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            }
        }
        move() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                        this.radius -= 2
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                        this.radius -= 2
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                        this.radius -= 2
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                        this.radius -= 2
                    }
                }
            }
            if (this.locked == 0) {
                this.x += this.xmom
                this.y += this.ymom
            }

            if (Math.abs(this.xmom) + Math.abs(this.ymom) > 14) {
                this.xmom *= .95
                this.ymom *= .95
            }
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
            this.xmom *= this.friction
            this.ymom *= this.friction
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
            this.xmom /= this.friction
            this.ymom /= this.friction
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
    } class Polygon {
        constructor(x, y, size, color, sides = 3, xmom = 0, ymom = 0, angle = 0, reflect = 0) {
            if (sides < 2) {
                sides = 2
            }
            this.reflect = reflect
            this.xmom = xmom
            this.ymom = ymom
            this.body = new Circle(x, y, size - (size * -3.293), "transparent")
            this.nodes = []
            this.angle = angle
            this.size = size
            this.color = color
            this.angleIncrement = (Math.PI * 2) / sides
            this.sides = sides
            for (let t = 0; t < sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
        }
        isPointInside(point) { // rough approximation
            this.body.radius = this.size - (this.size * -3.293)
            if (this.sides <= 2) {
                return false
            }
            this.areaY = point.y - this.body.y
            this.areaX = point.x - this.body.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.body.radius * this.body.radius)) {
                return true
            }
            return false
        }
        move() {
            if (this.reflect == 1) {
                if (this.body.x > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.body.x < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.body.x += this.xmom
            this.body.y += this.ymom
        }
        draw() {
            canvas_context.lineWidth = 3
            this.nodes = []
            this.angleIncrement = (Math.PI * 2) / this.sides
            this.body.radius = this.size - (this.size * -3.293)
            for (let t = 0; t < this.sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
            canvas_context.strokeStyle = this.color
            canvas_context.fillStyle = this.color
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
        constructor(x, y, radius, color, body = 0, length = 1, gravity = 0, width = 1) {
            if (body == 0) {
                this.body = new Circle(x, y, radius, color)
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            } else {
                this.body = body
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            }
            this.gravity = gravity
            this.width = width
        }
        balance() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
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
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move() {
            this.anchor.ymom += this.gravity
            this.anchor.move()
        }

    }
    class Color {
        constructor(baseColor, red = -1, green = -1, blue = -1, alpha = 1) {
            this.hue = baseColor
            if (red != -1 && green != -1 && blue != -1) {
                this.r = red
                this.g = green
                this.b = blue
                if (alpha != 1) {
                    if (alpha < 1) {
                        this.alpha = alpha
                    } else {
                        this.alpha = alpha / 255
                        if (this.alpha > 1) {
                            this.alpha = 1
                        }
                    }
                }
                if (this.r > 255) {
                    this.r = 255
                }
                if (this.g > 255) {
                    this.g = 255
                }
                if (this.b > 255) {
                    this.b = 255
                }
                if (this.r < 0) {
                    this.r = 0
                }
                if (this.g < 0) {
                    this.g = 0
                }
                if (this.b < 0) {
                    this.b = 0
                }
            } else {
                this.r = 0
                this.g = 0
                this.b = 0
            }
        }
        normalize() {
            if (this.r > 255) {
                this.r = 255
            }
            if (this.g > 255) {
                this.g = 255
            }
            if (this.b > 255) {
                this.b = 255
            }
            if (this.r < 0) {
                this.r = 0
            }
            if (this.g < 0) {
                this.g = 0
            }
            if (this.b < 0) {
                this.b = 0
            }
        }
        randomLight() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 12) + 4)];
            }
            var color = new Color(hash, 55 + Math.random() * 200, 55 + Math.random() * 200, 55 + Math.random() * 200)
            return color;
        }
        randomDark() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 12))];
            }
            var color = new Color(hash, Math.random() * 200, Math.random() * 200, Math.random() * 200)
            return color;
        }
        random() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 16))];
            }
            var color = new Color(hash, Math.random() * 255, Math.random() * 255, Math.random() * 255)
            return color;
        }
    }
    class Softbody { //buggy, spins in place
        constructor(x, y, radius, color, members = 10, memberLength = 5, force = 10, gravity = 0) {
            this.springs = []
            this.pin = new Circle(x, y, radius, color)
            this.spring = new Spring(x, y, radius, color, this.pin, memberLength, gravity)
            this.springs.push(this.spring)
            for (let k = 0; k < members; k++) {
                this.spring = new Spring(x, y, radius, color, this.spring.anchor, memberLength, gravity)
                if (k < members - 1) {
                    this.springs.push(this.spring)
                } else {
                    this.spring.anchor = this.pin
                    this.springs.push(this.spring)
                }
            }
            this.forceConstant = force
            this.centroid = new Point(0, 0)
        }
        circularize() {
            this.xpoint = 0
            this.ypoint = 0
            for (let s = 0; s < this.springs.length; s++) {
                this.xpoint += (this.springs[s].anchor.x / this.springs.length)
                this.ypoint += (this.springs[s].anchor.y / this.springs.length)
            }
            this.centroid.x = this.xpoint
            this.centroid.y = this.ypoint
            this.angle = 0
            this.angleIncrement = (Math.PI * 2) / this.springs.length
            for (let t = 0; t < this.springs.length; t++) {
                this.springs[t].body.x = this.centroid.x + (Math.cos(this.angle) * this.forceConstant)
                this.springs[t].body.y = this.centroid.y + (Math.sin(this.angle) * this.forceConstant)
                this.angle += this.angleIncrement
            }
        }
        balance() {
            for (let s = this.springs.length - 1; s >= 0; s--) {
                this.springs[s].balance()
            }
            this.xpoint = 0
            this.ypoint = 0
            for (let s = 0; s < this.springs.length; s++) {
                this.xpoint += (this.springs[s].anchor.x / this.springs.length)
                this.ypoint += (this.springs[s].anchor.y / this.springs.length)
            }
            this.centroid.x = this.xpoint
            this.centroid.y = this.ypoint
            for (let s = 0; s < this.springs.length; s++) {
                this.link = new Line(this.centroid.x, this.centroid.y, this.springs[s].anchor.x, this.springs[s].anchor.y, 0, "transparent")
                if (this.link.hypotenuse() != 0) {
                    this.springs[s].anchor.xmom += (((this.springs[s].anchor.x - this.centroid.x) / (this.link.hypotenuse()))) * this.forceConstant
                    this.springs[s].anchor.ymom += (((this.springs[s].anchor.y - this.centroid.y) / (this.link.hypotenuse()))) * this.forceConstant
                }
            }
            for (let s = 0; s < this.springs.length; s++) {
                this.springs[s].move()
            }
            for (let s = 0; s < this.springs.length; s++) {
                this.springs[s].draw()
            }
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
            for (let f = 0; f < this.rayrange; f++) {
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
    }
    function setUp(canvas_pass, style = "#050505") {
        canvas = canvas_pass
        canvas_context = canvas.getContext('2d');
        canvas_context.imageSmoothingEnabled = true
        canvas.style.background = style
        window.setInterval(function () {
            main()
        }, 18)
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            delete keysPressed[event.key];
        });
        window.addEventListener('pointerdown', e => {
            // for(let t = 0;t<enemies.length;t++){
            //     enemies[t].type += 1
            // }

            if(notstarted == 1){
                if(startbutton.isPointInside(TIP_engine)){
                    notstarted = 0
                }
            }else{

                if (player.health > 0) {
                    FLEX_engine = canvas.getBoundingClientRect();
                    XS_engine = e.clientX - FLEX_engine.left;
                    YS_engine = e.clientY - FLEX_engine.top;
                    TIP_engine.x = XS_engine
                    TIP_engine.y = YS_engine
                    TIP_engine.body = TIP_engine
                    if (player.reward == 0) {
                        if (player.drawbutton.isPointInside(TIP_engine)) {
                            if (player.locked == 0) {
                                for (let t = 0; t < enemies.length; t++) {
                                    enemies[t].attacked = 0
                                }
                                player.deck.pull()
                            }
                        }
                    } else {
    
                    }
                    for (let t = 0; t < player.deck.active.length; t++) {
                        if (player.deck.active[t].body.isPointInside(TIP_engine)) {
                            player.deck.active[t].play()
                        }
                    }
                    for (let t = 0; t < enemies.length; t++) {
                        if (enemies[t].body.body.isPointInside(TIP_engine)) {
                            player.selected = enemies[t]
                            tringle.x = player.selected.body.body.x
                            tringle.y = player.selected.body.body.y - 90
                        }
                    }
                }
    
                for (let t = 0; t < player.deck.reward.length; t++) {
                    if (player.deck.reward[t].body.isPointInside(TIP_engine)) {
                        player.deck.drawable.push(player.deck.reward[t].clone())
                        player.deck.reward = []
                        player.reward = 0
                        player.deck.softpull()
                        spawn()
                    }
                    if (player.reward != 0) {
                        if (player.skipbutton.isPointInside(TIP_engine)) {
                            player.deck.reward = []
                            player.reward = 0
                            player.deck.softpull()
                            spawn()
                        }
                    }
                }
                if (player.cleanbutton.isPointInside(TIP_engine)) {
                    player.cleaning *= -1
                }
    
                if (player.indexdownbutton.isPointInside(TIP_engine)) {
                    player.displaycardindex -= 1
                    if (player.displaycardindex < 0) {
                        player.displaycardindex = 0
                    }
                }
                if (player.indexupbutton.isPointInside(TIP_engine)) {
                    player.displaycardindex += 1
                    if (player.displaycardindex > player.deck.drawable.length - 1) {
                        player.displaycardindex = player.deck.drawable.length - 1
                    }
                }
    
                if (player.removebutton.isPointInside(TIP_engine)) {
                    if (player.deck.drawable.length > 1) {
                        player.deck.drawable.splice(player.displaycardindex, 1)
                        player.displaycardindex -= 1
                        if (player.displaycardindex < 0) {
                            player.displaycardindex = 0
                        }
                    }
                }
    
    
    
            }
        });
        // window.addEventListener('pointerup', e => {
        //     window.removeEventListener("pointermove", continued_stimuli);
        // })

        canvas.addEventListener('pointermove', continued_stimuli);
        function continued_stimuli(e) {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
            TIP_engine.x = XS_engine
            TIP_engine.y = YS_engine
            TIP_engine.body = TIP_engine

            // if (player.drawbutton.isPointInside(TIP_engine)) {
            //     player.drawbutton.stokeWidth = 3
            // }else{
            //     player.drawbutton.strokeWidth = 0
            // }


            for (let t = 0; t < player.deck.active.length; t++) {
                if (player.deck.active[t].body.isPointInside(TIP_engine)) {
                    player.deck.active[t].body.strokeWidth = 3
                } else {
                    player.deck.active[t].body.strokeWidth = 0
                }
            }

        }
    }
    function gamepad_control(object, speed = 1) { // basic control for objects using the controler
        console.log(gamepadAPI.axesStatus[1] * gamepadAPI.axesStatus[0])
        if (typeof object.body != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
                if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                    object.body.x += (gamepadAPI.axesStatus[2] * speed)
                    object.body.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        } else if (typeof object != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
                if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                    object.x += (gamepadAPI.axesStatus[0] * speed)
                    object.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        }
    }
    function control(object, speed = 1) { // basic control for objects
        if (typeof object.body != 'undefined') {
            if (keysPressed['w']) {
                object.body.y -= speed * gamepadAPI.axesStatus[0]
            }
            if (keysPressed['d']) {
                object.body.x += speed
            }
            if (keysPressed['s']) {
                object.body.y += speed
            }
            if (keysPressed['a']) {
                object.body.x -= speed
            }
        } else if (typeof object != 'undefined') {
            if (keysPressed['w']) {
                object.y -= speed
            }
            if (keysPressed['d']) {
                object.x += speed
            }
            if (keysPressed['s']) {
                object.y += speed
            }
            if (keysPressed['a']) {
                object.x -= speed
            }
        }
    }
    function getRandomLightColor() { // random color that will be visible on  black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12) + 4)];
        }
        return color;
    }
    function getRandomColor() { // random color
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 16) + 0)];
        }
        return color;
    }
    function getRandomDarkColor() {// color that will be visible on a black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 10))];
        }
        return color;
    }
    function castBetween(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
        let limit = granularity
        let shape_array = []
        for (let t = 0; t < limit; t++) {
            let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
            shape_array.push(circ)
        }
        return (new Shape(shape_array))
    }


    class Pointer {
        constructor(x, y, color, length = 40) {
            this.x = x
            this.y = y
            this.color = color
            this.length = length
            this.radius = length
        }
        draw() {
            canvas_context.beginPath();
            canvas_context.lineWidth = 3
            canvas_context.strokeStyle = "black"
            canvas_context.moveTo(this.x, this.y + this.length / 2);
            canvas_context.lineTo(this.x + this.length, this.y + this.length / 2);
            canvas_context.lineTo(this.x, this.y + this.length * 1.41);
            canvas_context.lineTo(this.x - this.length, this.y + this.length / 2);
            canvas_context.lineTo(this.x, this.y + this.length / 2);
            canvas_context.stroke();
            canvas_context.fillStyle = this.color
            canvas_context.fill()
            canvas_context.closePath()
        }
    }

    class Player {
        constructor() {
            this.image = Math.floor(Math.random() * 5)
            this.leftdisp = Math.random()
            this.topdisp = Math.random()
            this.locked = 0
            this.selected = {}
            this.selected.body = {}
            this.selected.body.body = {}
            this.selected.body.body.x = 100
            this.selected.body.body.y = 100
            this.deck = new Deck()
            this.venom = 0

            let strangecard = new Card(5, 0)

            let stuncard = new Card(1, 8)
            stuncard.stun = 1
            stuncard.energy = 1
            stuncard.hits = 5
            let healingcard = new Card(1, 1)
            healingcard.healing = 10
            healingcard.energy = 2
            healingcard.hits = 2
            let blockcard = new Card(1, 2)
            blockcard.block = 1
            blockcard.energy = 1
            blockcard.hits = 3
            let poisoncard = new Card(1, 3)
            poisoncard.poison = 4
            poisoncard.energy = 1
            poisoncard.hits = 2
            let thorncard = new Card(1, 4)
            thorncard.thorns = 2
            thorncard.energy = 1
            thorncard.hits = 3
            let energybonuscard = new Card(1, 5)
            energybonuscard.energybonus = 3
            energybonuscard.energy = 2
            energybonuscard.hits = 5
            let curecard = new Card(1, 6)
            curecard.cure = 1
            curecard.healing = 2
            curecard.energy = 2
            curecard.hits = 6
            let pullcard = new Card(1, 9)
            pullcard.pull = 1
            pullcard.hits = 6
            pullcard.energy = 1
            let retcard = new Card(1, 7)
            retcard.ret = 1
            retcard.hits = 4
            retcard.energy = 0

            this.deck.push(pullcard)
            this.deck.push(healingcard)
            this.deck.push(blockcard)
            this.deck.push(poisoncard)
            this.deck.push(thorncard)
            this.deck.push(energybonuscard)
            this.deck.push(curecard)
            this.deck.push(stuncard)
            this.deck.push(retcard)

            this.r = 0
            this.g = 255
            this.b = 0


            this.skipbutton = new Rectangle(880, 540, 220, 60, "white")
            this.cleanbutton = new Rectangle(880, 640, 220, 60, "green")
            this.removebutton = new Rectangle(100, 270, 160, 50, "white")
            this.indexupbutton = new Rectangle(280, 180, 50, 50, "#00FF00")
            this.indexdownbutton = new Rectangle(30, 180, 50, 50, "#FF0000")
            this.drawbutton = new Rectangle(900, 660, 220, 50, "black")
            this.cardbox = new Rectangle(0, 500, 750, 220, "#222222")
            this.statbox = new Rectangle(750, 500, 620, 220, "#111111")
            this.buffbox = new Rectangle(850, 610, 330, 40, "#222222")
            this.energybarx = new Rectangle(1030, 590, 150, 10, `#222222`)
            this.healthbarx = new Rectangle(850, 590, 150, 10, `#222222`)
            this.healthbar = new Rectangle(850, 590, 150, 10, `rgb(${this.r},${this.g},${this.b})`)
            this.energybar = new Rectangle(1030, 590, 150, 10, "cyan")
            this.healthbar.strokeWidth = 0
            this.energybar.strokeWidth = 0
            this.cardbox.strokeWidth = 0
            this.statbox.strokeWidth = 0
            this.buffbox.strokeWidth = 0
            this.energymax = 7
            this.energy = 7
            this.maxhealth = 100
            this.health = 100
            this.block = 0
            this.thorns = 0
            this.reward = 0
            this.level = 0
            this.displaycardindex = 0
            this.cleaning = -1
        }
        draw() {
            // this.cardbox.draw()
            // this.statbox.draw()

            if (this.health < 0) {
                this.health = 0
            }

            if (this.reward == 0) {

                this.buffbox.draw()
                this.healthbarx.draw()
                this.energybarx.draw()

                this.healthbar.width = Math.min((150 * (this.health / this.maxhealth)), 150)
                this.energybar.width = Math.min((150 * (this.energy / this.energymax)), 150)

                this.g = ((this.healthbar.width / 150)) * 255
                this.r = 255 - this.g
                this.healthbar.color = `rgb(${this.r},${this.g},${this.b})`

                this.healthbar.draw()
                this.energybar.draw()

                if (this.locked == 0) {
                    this.drawbutton.draw()
                    canvas_context.font = "43px arial"
                    canvas_context.fillStyle = "white"
                    canvas_context.fillText("Draw", this.drawbutton.x + 60, this.drawbutton.y + 40)
                }
                canvas_context.font = "43px arial"
                canvas_context.fillStyle = "white"
                // canvas_context.fillText("Draw", this.drawbutton.x + 60, this.drawbutton.y + 40)
                canvas_context.font = "19px arial"
                canvas_context.fillStyle = "white"
                canvas_context.strokeStyle = "black"
                canvas_context.lineWidth = 3
                canvas_context.strokeText(`Health: ${this.health}`, this.healthbar.x, this.healthbar.y - 20)
                canvas_context.strokeText(`Energy: ${this.energy}`, this.energybar.x, this.energybar.y - 20)
                canvas_context.fillText(`Health: ${this.health}`, this.healthbar.x, this.healthbar.y - 20)
                canvas_context.fillText(`Energy: ${this.energy}`, this.energybar.x, this.energybar.y - 20)
                canvas_context.font = "19px arial"
                canvas_context.fillText(`Block: ${this.block} Thorns: ${this.thorns} Poisoned: ${this.venom}`, this.buffbox.x + 25, this.buffbox.y + 25)

            } else {
                this.skipbutton.draw()
                this.cleanbutton.draw()
                canvas_context.font = "43px arial"
                canvas_context.fillStyle = "black"
                canvas_context.fillText("Skip", 590, 425)
                canvas_context.fillStyle = "white"
                canvas_context.fillText(`Select a reward card!`, 10, 425)

                canvas_context.fillStyle = "black"
                canvas_context.font = "33px arial"
                canvas_context.fillText(`Clean`, this.cleanbutton.x + 60, this.cleanbutton.y + 40)
                canvas_context.fillText(`Skip`, this.skipbutton.x + 70, this.skipbutton.y + 40)
                if (this.cleaning == 1) {
                    this.deck.drawable[this.displaycardindex].body.x = 130
                    this.deck.drawable[this.displaycardindex].body.y = 120
                    this.deck.drawable[this.displaycardindex].draw()
                    this.removebutton.draw()
                    this.indexdownbutton.draw()
                    this.indexupbutton.draw()
                    canvas_context.font = "43px arial"
                    canvas_context.fillStyle = "white"
                    canvas_context.fillText(`Cards: ${this.deck.drawable.length}`, 100, 50)
                    canvas_context.fillStyle = "black"
                    canvas_context.fillText(`>`, 292, 220)
                    canvas_context.fillText(`<`, 42, 220)
                    canvas_context.font = "33px arial"
                    canvas_context.fillText(`Remove`, 117, 305)
                }
            }
            this.deck.draw()
        }
    }
    class Deck {
        constructor() {
            this.active = []
            this.drawable = []
            this.discarded = []
            this.reward = []
            for (let t = 0; t < 0; t++) {
                this.push(new Card(0, Math.floor(Math.random() * 10)))
            }
        }
        makeprize() {
            player.displaycardindex = 0
            player.image = Math.floor(Math.random() * 5)
            player.leftdisp = Math.random()
            player.topdisp = Math.random()
            summons = []
            for (let t = 0; t < 5; t++) {
                this.reward.push(new Card(player.level, Math.floor(Math.random() * 10)))
            }
            for (let t = 0; t < this.reward.length; t++) {
                this.reward[t].body.x = (t * 160) + 500
                this.reward[t].body.y = 350
            }
        }
        push(card) {
            this.drawable.push(card)
        }
        pull() {
            player.health -= player.venom
            player.energy = player.energymax
            for (let t = 0; t < this.active.length; t++) {
                this.push(this.active[t].clone())
            }
            let pulllength = Math.min(this.drawable.length, 5)
            this.active = []
            for (let t = 0; t < pulllength; t++) {
                let index = Math.floor(Math.random() * this.drawable.length)
                this.active.push(this.drawable[index].clone())
                this.drawable.splice(index, 1)
            }

            for (let t = 0; t < this.active.length; t++) {
                this.active[t].body.x = (t * 141) + 40
                this.active[t].body.y = 570
            }
            // for (let t = 0; t < enemies.length; t++) {
            //     enemies[t].attack()
            // }

            player.locked = 1
            // setTimeout(function () {
            enemies[0].attack()
            // }, (1));

        }
        softpull() {
            player.energy = player.energymax
            for (let t = 0; t < this.active.length; t++) {
                this.push(this.active[t].clone())
            }
            let pulllength = Math.min(this.drawable.length, 5)
            this.active = []
            for (let t = 0; t < pulllength; t++) {
                let index = Math.floor(Math.random() * this.drawable.length)
                this.active.push(this.drawable[index].clone())
                this.drawable.splice(index, 1)
            }

            for (let t = 0; t < this.active.length; t++) {
                this.active[t].body.x = (t * 141) + 40
            }
        }
        draw() {
            if (player.reward == 0) {
                for (let t = 0; t < this.active.length; t++) {
                    this.active[t].draw()
                }
            } else {
                for (let t = 0; t < this.reward.length; t++) {
                    this.reward[t].draw()
                }
            }
        }
    }
    class Card {
        constructor(level = 0, type = 0) {
            this.level = level + 1
            this.type = type
            this.body = new Rectangle(0, 570, 100, 120, "red")
            this.energy = Math.floor(Math.random() * 3) + 1
            if (Math.random() < .4) {
                this.energy -= 1
            }
            this.hits = Math.floor(((Math.random() * .15) + .85) * 8 * this.level) + 2
            this.hits = Math.ceil(this.hits * (1 + (((this.energy / 3)))))
            this.played = 0
            if (this.type == 0) {
                this.hits *= 2
            }
            if (this.type == 1) {
                this.healing = Math.ceil(((((Math.random() * .15) + .85) * 5.1) + Math.ceil(((Math.random() * .15) + .85) * 6.1 * (level + 1)) + 1) * (1 + (((this.energy / 3)))))
                this.body.color = "#00FF00"
            } else {
                this.healing = 0
            }
            if (this.type == 2) {
                this.block = (Math.ceil((((((Math.random() * .15) + .85) * 1) + Math.ceil(((Math.random() * .15) + .85) * .8 * (level + 0))) + 1) * (1 + (((this.energy / 3))))))
                this.body.color = "gray"
            } else {
                this.block = 0
            }
            if (this.type == 3) {
                this.poison = Math.ceil(((((Math.random() * .15) + .85) * 1.05) + Math.ceil(((Math.random() * .15) + .85) * 9 * (level + 1)) + 1) * (1 + (((this.energy / 3)))))
                this.body.color = "#FF00FF"
            } else {
                this.poison = 0
            }
            if (this.type == 4) {
                this.thorns = (Math.ceil((((((Math.random() * .15) + .85) * 1.05) + Math.ceil(((Math.random() * .15) + .85) * 3.5 * (level + 1))) + 1) * (1 + (((this.energy / 3))))))
                this.body.color = "#666600"
            } else {
                this.thorns = 0
            }
            if (this.type == 5) {

                this.energybonus = 1
                // this.energybonus = Math.ceil(((Math.random())) * 3)
                for (let t = 0; t < 3; t++) {
                    if (Math.random() < .65) {
                        this.energybonus += 1
                    }
                }
                this.energybonus = Math.floor(this.energybonus * (1 + (((this.energy / 4)))))
                this.body.color = "#00CCFF"
            } else {
                this.energybonus = 0
            }
            if (this.type == 6) {
                this.cure = 1
                this.healing = Math.ceil(((((Math.random() * .15) + .85) * 2) + Math.ceil(((Math.random() * .15) + .85) * 3 * (level + 1)) + 1) * (1 + (((this.energy / 3)))))
                this.body.color = "#EEEEEE"
            } else {
                this.cure = 0
            }
            if (this.type == 7) {
                this.ret = Math.ceil(((((Math.random() * 1) + 0)) + Math.ceil(((Math.random() * 1) + 0) * 2 * level)) * (1 + ((this.energy / 300))))
                this.body.color = "teal"
                if (this.ret > this.hits) {
                    this.hits = this.ret
                }
            } else {
                this.ret = 0
            }
            if (this.type == 8) {
                this.stun = Math.ceil(((((Math.random() * .15) + .85) * .6 * level)) * (1 + (((this.energy / 3)))))
                if (this.stun == 0) {
                    this.stun = 1
                }
                this.body.color = "blue"
            } else {
                this.stun = 0
            }
            if (this.type == 9) {
                this.pull = 1
                this.body.color = "#FEDCBA"
                if (this.energy < 1) {
                    this.energy = 1
                }
            } else {
                this.pull = 0
            }

            this.line = new Line(this.body.x + 10, this.body.y + 60, this.body.x + this.body.width - 10, this.body.y + 60, "white")
        }
        stringmaker() {
            this.strings = []
            if (this.ret == 0) {
                this.strings.push([`Damage: ${this.hits}`, "white"])
            } else {
                this.strings.push([`Damage all: ${this.hits}`, "white"])
            }
            this.strings.push([`Energy: ${this.energy}`, "white"])
            if (this.body.color == "#EEEEEE" || this.body.color == "#00FF00" || this.body.color == "#00CCFF" || this.body.color == "#FEDCBA") {
                this.strings[0][1] = "black"
                this.strings[1][1] = "black"
            }
            this.strings.push([`padding`, "transparent"])
            if (this.block > 0) {
                this.strings.push([`Block: ${this.block}`, "black"])
            }
            if (this.thorns > 0) {
                this.strings.push([`Thorns: ${this.thorns}`, "#FFAA55"])
            }
            if (this.poison > 0) {
                this.strings.push([`Poison: ${this.poison}`, "#555555"])
            }
            if (this.healing > 0) {
                this.strings.push([`Heals: ${this.healing}`, "#CC0000"])
            }
            if (this.energybonus > 0) {
                this.strings.push([`Recharge: ${this.energybonus}`, "Blue"])
            }
            if (this.cure > 0) {
                this.strings.push([`Cure`, "#DD00DD"])
            }
            if (this.ret > 0) {
                this.strings.push([`Self Damage: ${this.ret}`, "#ffffff"])
            }
            if (this.stun > 0) {
                this.strings.push([`Stun: ${this.stun}`, "#FFFF00"])
            }
            if (this.pull > 0) {
                this.strings.push([`Pull`, "#0000FF"])
            }
        }
        clone() {
            let clone = new Card()
            clone.energy = this.energy
            clone.level = this.level
            clone.hits = this.hits
            clone.type = this.type
            clone.healing = this.healing
            clone.block = this.block
            clone.poison = this.poison
            clone.thorns = this.thorns
            clone.cure = this.cure
            clone.energybonus = this.energybonus
            clone.ret = this.ret
            clone.stun = this.stun
            clone.pull = this.pull
            clone.body.color = this.body.color
            return clone
        }
        draw() {
            if (this.played == 0) {
                this.body.draw()
                this.stringmaker()
                canvas_context.font = "11.5px arial"
                for (let t = 0; t < this.strings.length; t++) {
                    canvas_context.fillStyle = this.strings[t][1]
                    canvas_context.fillText(this.strings[t][0], this.body.x + 7.5, this.body.y + 20 + (t * 20))
                }

                this.line = new Line(this.body.x + 10, this.body.y + 60, this.body.x + this.body.width - 10, this.body.y + 60, "white")
                this.line.draw()
            }
        }
        play() {
            if (this.played == 0) {
                if (player.energy >= this.energy) {
                    bumper.play()


                    this.played = 1
                    player.health -= this.ret
                    player.thorns += this.thorns
                    player.health -= player.selected.thorns
                    player.block += this.block
                    player.health += this.healing
                    player.energy -= this.energy
                    player.energy += this.energybonus
                    if (player.selected.enrage > 0) {
                        player.selected.enrage += 1
                    }
                    if (this.ret == 0) {
                        if (this.hits >= player.selected.blocks) {
                            player.selected.health -= (this.hits - player.selected.blocks)
                        }
                    } else {
                        for (let t = 0; t < enemies.length; t++) {
                            enemies[t].health -= Math.max((this.hits - enemies[t].alert), 0)
                        }
                    }
                    player.selected.stun += Math.max(this.stun - player.selected.thick, 0)
                    player.selected.poison += Math.max(this.poison - player.selected.resist, 0)
                    if (player.selected.health < 0) {
                        player.selected.health = 0
                    }
                    if (this.cure == 1) {
                        player.venom = 0
                    }
                    if (this.pull == 1) {
                        let index = Math.floor(Math.random() * player.deck.drawable.length)

                        let blockindex = player.deck.active.indexOf(this)
                        player.deck.push(this.clone())

                        player.deck.active = player.deck.active.filter(a => a != this)
                        player.deck.active.push(player.deck.drawable[index].clone())
                        player.deck.drawable.splice(index, 1)

                        for (let t = 0; t < player.deck.active.length; t++) {
                            player.deck.active[t].body.x = (t * 141) + 40
                        }
                    }
                }
            }
        }
    }

    function srcnames(idnumber) {
        //////console.log(idnumber)


        if (idnumber > -1) {
            switch (idnumber) {

                case 0:
                    return "errantnope";
                case 1:
                    return "kunk";
                case 2:
                    return "kohboh";
                case 3:
                    return "djoper";
                case 4:
                    return "schorp";
                case 5:
                    return "zaume";
                case 6:
                    return "nhainhai";
                case 7:
                    return "degeissdt";
                case 8:
                    return "yuggle";
                case 9:
                    return "bongu";
                case 10:
                    return "giteriglia";
                case 11:
                    return "cyosteroth";
                case 12:
                    return "nentopode";
                case 13:
                    return "centiclaka";
                case 14:
                    return "uggnawb";
                case 15:
                    return "grobhost";
                case 16:
                    return "illelonab";
                case 17:
                    return "rongzeed";
                case 18:
                    return "blattle";
                case 19:
                    return "swogharnler";
                case 20:
                    return "adenolish";
                case 21:
                    // if (Math.random() < .5) {
                    //     return "genaupresangb";
                    // }
                    return "genaupresang";
                case 22:
                    return "daahnida";
                case 23:
                    return "Sorba";
                case 24:
                    return "Jiyou";
                case 25:
                    return "Sparvae";
                case 26:
                    return "Vellup"; //vellup too load intense
                case 27:
                    return "Bellaja";
                case 28:
                    return "Levdzell";
                case 29:
                    return "Rytegg";
                case 30:
                    return "flashmer";
                case 31:
                    return "schmodozer";
                case 32:
                    return "octgotot";
                case 33:
                    return "triaural";
                case 34:
                    return "dicyto";
                case 35:
                    return "monopteryx";
                case 36:
                    return "Pigin";
                case 37:
                    return "toobapath";
                case 38:
                    return "wheeliosbop";
                case 39:
                    return "Ihmpdrap";
                case 40:
                    return "Epibazang";
                case 41:
                    return "Hemtan";
                case 42:
                    return "Ogo";
                case 43:
                    return "Strachid";
                case 44:
                    return "Toximastica";
                case 45:
                    return "Urcuria";
                case 46:
                    return "Hyuntress";
                case 47:
                    return "Mondosplak";
                case 48:
                    return "Banandroid";
                case 49:
                    return "Sapiosuant";
                case 50:
                    return "Munegull";
                case 51:
                    return "Sudakleez";
                case 52:
                    return "Halocordate";
                case 53:
                    return "faydendron";
                case 54:
                    return "Osteoplang";
                case 55:
                    return "zrachnid";
                case 56:
                    return "xlitch";
                case 57:
                    return "baa";
                case 58:
                    return "mantidile";
                case 59:
                    return "nokoyl";
                case 60:
                    return "yallod";
                case 61:
                    return "algaetizer";
                case 62:
                    return "kachort";
                case 63:
                    return "slamelion";
                case 64:
                    return "ayateda";
                case 65:
                    return "wochem";
                case 66:
                    return "humun";
                case 67:
                    return "psychobath";
                case 68:
                    return "gytanic";
                case 69:
                    return "beis";
                case 70:
                    return "Gungholio";
                case 71:
                    return "honigkonig";
                case 72:
                    return "Kungulpa";
                case 73:
                    return "satinella";
                case 74:
                    return "elocurl";
                case 75:
                    return "takobie";
                case 76:
                    return "obchovy";
                case 77:
                    return "Nimnamnom";
                case 78:
                    return "Tutewtoo";
                case 79:
                    return "Blanqast";
                case 80:
                    return "Indeo";
                case 81:
                    return "Deblobbio";
                case 82:
                    return "Knightstacean";
                case 83:
                    return "Prostrax";
                case 84:
                    return "Haptozahen";
                case 85:
                    return "Minkohabod";
                case 86:
                    return "Zeen";
                case 87:
                    return "Tacroach";
                case 88:
                    return "Manterfly";
                case 89:
                    return "Beary";
                case 90:
                    return "Sluggernaut";
                case 91:
                    return "errantnope"
                case 92:
                    return "Memeek";
                case 93:
                    return "Doughgnat";
                case 94:
                    return "rattic";
                case 95:
                    return "missleaneous";
                case 96:
                    return "Runnybabbit";
                case 97:
                    return "Zubgondrakter";
                case 98:
                    return "Whumpuhmp";

                case 99:
                    return "Mangoon";
                case 100:
                    return "Scarbeque";
                case 101:
                    return "Fwuffynumpkins";

                case 102:
                    return "Dothog";
                case 103:
                    return "Reefcake";
                case 104:
                    return "Cheetza";
                case 105:
                    return "Sortsand";
                case 106:
                    return "chilldabeest";
                case 107:
                    return "Communigator";
                case 108:
                    return "mossboss";
                case 109:
                    return "vamprey";
                case 110:
                    return "parafox";
                case 111:
                    return "rhischlosserous";  //Rhischlosserous
                case 112:
                    return "Hykeyna";
                case 113:
                    return "Tafantula";
                case 114:
                    return "Farmot";
                case 115:
                    return "Beeurchin";
                case 116:
                    return "Flyinsoup";
                case 117:
                    return "melancolli";
                case 118:
                    return "scorphibian";
                case 119:
                    return "geliphant";
                case 120:
                    return "chimpansy";
                case 121:
                    if (Math.random() < .5) {
                        return "giveup";
                    }
                    return "giveupx";
                case 122:
                    return "Avokaboom";
                case 123:
                    return "Eggress";
                case 124:
                    return "Zentapede";
                case 125:
                    return "Probocetus";
                case 126:
                    return "Tankgolin";
                case 127:
                    return "Spiekgul";
                case 128:
                    return "Mnemont";
                case 129:
                    return "Banandroid"; // used at 48
                case 130:
                    return "Pigin"; // used at 35

            }
        } else {
            return "error";
        }
        return "errantnope";

    }


    class Enemy {
        constructor(type = -1, level = player.level) {

            if (type == -1) {
                this.type = Math.floor(Math.random() * 137)
                // this.type = 99

                this.name = nameswitch(this.type)
                // if(enemies.length == 0){
                //     this.type = 73
                // }else if(enemies.length == 1){
                //     this.type = 128
                // }else if(enemies.length == 2){
                //     this.type = 93
                // }else if(enemies.length == 3){
                //     this.type = 110
                // }else if(enemies.length == 4){
                //     this.type = 81
                // }else if(enemies.length == 5){
                //     this.type = 54
                // }else if(enemies.length == 6){
                //     this.type = 60
                // }else if(enemies.length == 7){
                //     this.type = 23
                // }
                if (this.type == 0) {
                    this.thornsyes = 1
                }
                if (this.type == 1) {
                    this.blockyes = 1
                }
                if (this.type == 2) {
                    this.thornsyes = 1
                    this.blockyes = 1
                }
                if (this.type == 3) {
                    this.healsyes = 1
                }
                if (this.type == 4) {
                    this.venomyes = 1
                }
                if (this.type == 5) {
                    this.venomyes = 1
                    this.healsyes = 1
                }
                if (this.type == 6) {
                    this.blockyes = 1
                    this.healsyes = 1
                }
                if (this.type == 7) {
                    this.venomyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 8) {
                    this.healsyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 9) {
                    this.enrageyes = 1
                }
                if (this.type == 10) {
                    this.enrageyes = 1
                    this.blockyes = 1
                }
                if (this.type == 11) {
                    this.enrageyes = 1
                    this.healsyes = 1
                }
                if (this.type == 12) {
                    this.healsyes = 1 //bongu: was enrage same as 16  childabeest
                    this.summonyes = 1 //was throns
                }
                if (this.type == 13) {
                    this.enrageyes = 1
                    this.venomyes = 1
                }
                if (this.type == 14) {
                    this.summonyes = 1
                }
                if (this.type == 15) {
                    this.blockyes = 1
                    this.venomyes = 1
                }
                if (this.type == 16) {
                    this.thornsyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 17) {
                    this.thornsyes = 1
                    this.summonyes = 1
                }
                if (this.type == 18) {
                    this.blockyes = 1
                    this.summonyes = 1
                }
                if (this.type == 19) {
                    this.venomyes = 1
                    this.summonyes = 1
                }
                if (this.type == 20) {
                    this.enrageyes = 1
                    this.summonyes = 1
                }
                if (this.type == 21) {
                    this.bypassyes = 1
                }
                if (this.type == 22) {
                    this.bypassyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 23) {
                    this.bypassyes = 1
                    this.venomyes = 1
                }
                if (this.type == 24) {
                    this.bypassyes = 1
                    this.summonyes = 1
                }
                if (this.type == 25) {
                    this.bypassyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 26) {
                    this.bypassyes = 1
                    this.blockyes = 1
                }
                if (this.type == 27) {
                    this.bypassyes = 1
                    this.healsyes = 1
                }
                if (this.type == 28) {
                    this.cureyes = 1
                }
                if (this.type == 29) {
                    this.cureyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 30) {
                    this.cureyes = 1
                    this.venomyes = 1
                }
                if (this.type == 31) {
                    this.cureyes = 1
                    this.summonyes = 1
                }
                if (this.type == 32) {
                    this.cureyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 33) {
                    this.cureyes = 1
                    this.blockyes = 1
                }
                if (this.type == 34) {
                    this.cureyes = 1
                    this.healsyes = 1
                }
                if (this.type == 35) {
                    this.cureyes = 1
                    this.bypassyes = 1
                }
                if (this.type == 36) {
                    this.betrayyes = 1
                }
                if (this.type == 37) {
                    this.betrayyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 38) {
                    this.betrayyes = 1
                    this.venomyes = 1
                }
                if (this.type == 39) {
                    this.betrayyes = 1
                    this.summonyes = 1
                }
                if (this.type == 40) {
                    this.betrayyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 41) {
                    this.betrayyes = 1
                    this.blockyes = 1
                }
                if (this.type == 42) {
                    this.betrayyes = 1
                    this.healsyes = 1
                }
                if (this.type == 43) {
                    this.betrayyes = 1
                    this.bypassyes = 1
                }
                if (this.type == 44) {
                    this.cureyes = 1
                    this.betrayyes = 1
                }
                if (this.type == 45) {
                    this.drainyes = 1
                }
                if (this.type == 46) {
                    this.betrayyes = 1
                    this.drainyes = 1
                }
                if (this.type == 47) {
                    this.drainyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 48) {
                    this.drainyes = 1
                    this.venomyes = 1
                }
                if (this.type == 49) {
                    this.drainyes = 1
                    this.summonyes = 1
                }
                if (this.type == 50) {
                    this.drainyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 51) {
                    this.drainyes = 1
                    this.blockyes = 1
                }
                if (this.type == 52) {
                    this.drainyes = 1
                    this.healsyes = 1
                }
                if (this.type == 53) {
                    this.drainyes = 1
                    this.bypassyes = 1
                }
                if (this.type == 54) {
                    this.cureyes = 1
                    this.drainyes = 1
                }
                if (this.type == 55) {
                    this.paddingyes = 1
                }
                if (this.type == 56) {
                    this.betrayyes = 1
                    this.paddingyes = 1
                }
                if (this.type == 57) {
                    this.paddingyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 58) {
                    this.paddingyes = 1
                    this.venomyes = 1
                }
                if (this.type == 59) {
                    this.paddingyes = 1
                    this.summonyes = 1
                }
                if (this.type == 60) {
                    this.paddingyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 61) {
                    this.paddingyes = 1
                    this.blockyes = 1
                }
                if (this.type == 62) {
                    this.paddingyes = 1
                    this.healsyes = 1
                }
                if (this.type == 63) {
                    this.paddingyes = 1
                    this.bypassyes = 1
                }
                if (this.type == 64) {
                    this.cureyes = 1
                    this.paddingyes = 1
                }
                if (this.type == 65) {
                    this.drainyes = 1
                    this.paddingyes = 1
                }
                if (this.type == 66) {
                    this.resistyes = 1
                }
                if (this.type == 67) {
                    this.paddingyes = 1
                    this.resistyes = 1
                }
                if (this.type == 68) {
                    this.betrayyes = 1
                    this.resistyes = 1
                }
                if (this.type == 69) {
                    this.resistyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 70) {
                    this.resistyes = 1
                    this.venomyes = 1
                }
                if (this.type == 71) {
                    this.resistyes = 1
                    this.summonyes = 1
                }
                if (this.type == 72) {
                    this.resistyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 73) {
                    this.resistyes = 1
                    this.blockyes = 1
                }
                if (this.type == 74) {
                    this.resistyes = 1
                    this.healsyes = 1
                }
                if (this.type == 75) {
                    this.resistyes = 1
                    this.bypassyes = 1
                }
                if (this.type == 76) {
                    this.cureyes = 1
                    this.resistyes = 1
                }
                if (this.type == 77) {
                    this.drainyes = 1
                    this.resistyes = 1
                }
                if (this.type == 78) {
                    this.thickyes = 1
                }
                if (this.type == 79) {
                    this.paddingyes = 1
                    this.thickyes = 1
                }
                if (this.type == 80) {
                    this.betrayyes = 1
                    this.thickyes = 1
                }
                if (this.type == 81) {
                    this.thickyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 82) {
                    this.thickyes = 1
                    this.venomyes = 1
                }
                if (this.type == 83) {
                    this.thickyes = 1
                    this.summonyes = 1
                }
                if (this.type == 84) {
                    this.thickyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 85) {
                    this.thickyes = 1
                    this.blockyes = 1
                }
                if (this.type == 86) {
                    this.thickyes = 1
                    this.healsyes = 1
                }
                if (this.type == 87) {
                    this.thickyes = 1
                    this.bypassyes = 1
                }
                if (this.type == 88) {
                    this.cureyes = 1
                    this.thickyes = 1
                }
                if (this.type == 89) {
                    this.drainyes = 1
                    this.thickyes = 1
                }
                if (this.type == 90) {
                    this.resistyes = 1
                    this.thickyes = 1
                }
                if (this.type == 91) {
                    this.rampageyes = 1
                }
                if (this.type == 92) {
                    this.paddingyes = 1
                    this.rampageyes = 1
                }
                if (this.type == 93) {
                    this.betrayyes = 1
                    this.rampageyes = 1
                }
                if (this.type == 94) {
                    this.rampageyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 95) {
                    this.rampageyes = 1
                    this.venomyes = 1
                }
                if (this.type == 96) {
                    this.rampageyes = 1
                    this.summonyes = 1
                }
                if (this.type == 97) {
                    this.rampageyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 98) {
                    this.rampageyes = 1
                    this.blockyes = 1
                }
                if (this.type == 99) {
                    this.rampageyes = 1
                    this.healsyes = 1
                }
                if (this.type == 100) {
                    this.rampageyes = 1
                    this.bypassyes = 1
                }
                if (this.type == 101) {
                    this.cureyes = 1
                    this.rampageyes = 1
                }
                if (this.type == 102) {
                    this.drainyes = 1
                    this.rampageyes = 1
                }
                if (this.type == 103) {
                    this.resistyes = 1
                    this.rampageyes = 1
                }
                if (this.type == 104) {
                    this.thickyes = 1
                    this.rampageyes = 1
                }
                if (this.type == 105) {
                    this.explodeyes = 1
                }
                if (this.type == 106) {
                    this.paddingyes = 1
                    this.explodeyes = 1
                }
                if (this.type == 107) {
                    this.betrayyes = 1
                    this.explodeyes = 1
                }
                if (this.type == 108) {
                    this.explodeyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 109) {
                    this.explodeyes = 1
                    this.venomyes = 1
                }
                if (this.type == 110) {
                    this.explodeyes = 1
                    this.summonyes = 1
                }
                if (this.type == 111) {
                    this.explodeyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 112) {
                    this.explodeyes = 1
                    this.blockyes = 1
                }
                if (this.type == 113) {
                    this.explodeyes = 1
                    this.healsyes = 1
                }
                if (this.type == 114) {
                    this.explodeyes = 1
                    this.bypassyes = 1
                }
                if (this.type == 115) {
                    this.cureyes = 1
                    this.explodeyes = 1
                }
                if (this.type == 116) {
                    this.drainyes = 1
                    this.explodeyes = 1
                }
                if (this.type == 117) {
                    this.resistyes = 1
                    this.explodeyes = 1
                }
                if (this.type == 118) {
                    this.thickyes = 1
                    this.explodeyes = 1
                }
                if (this.type == 119) {
                    this.rampageyes = 1
                    this.explodeyes = 1
                }
                if (this.type == 120) {
                    this.alertyes = 1
                }
                if (this.type == 121) {
                    this.paddingyes = 1
                    this.alertyes = 1
                }
                if (this.type == 122) {
                    this.betrayyes = 1
                    this.alertyes = 1
                }
                if (this.type == 123) {
                    this.alertyes = 1
                    this.enrageyes = 1
                }
                if (this.type == 124) {
                    this.alertyes = 1
                    this.venomyes = 1
                }
                if (this.type == 125) {
                    this.alertyes = 1
                    this.summonyes = 1
                }
                if (this.type == 126) {
                    this.alertyes = 1
                    this.thornsyes = 1
                }
                if (this.type == 127) {
                    this.alertyes = 1
                    this.blockyes = 1
                }
                if (this.type == 128) {
                    this.alertyes = 1
                    this.healsyes = 1
                }
                if (this.type == 129) {
                    this.alertyes = 1
                    this.bypassyes = 1
                }
                if (this.type == 130) {
                    this.cureyes = 1
                    this.alertyes = 1
                }
                if (this.type == 131) {
                    this.drainyes = 1
                    this.alertyes = 1
                }
                if (this.type == 132) {
                    this.resistyes = 1
                    this.alertyes = 1
                }
                if (this.type == 133) {
                    this.thickyes = 1
                    this.alertyes = 1
                }
                if (this.type == 134) {
                    this.rampageyes = 1
                    this.alertyes = 1
                }
                if (this.type == 135) {
                    this.explodeyes = 1
                    this.alertyes = 1
                }
                if (this.type == 136) {
                    this.pomaoyes = 1
                }
                // if(expcounter == 0){
                //     if(level == 10){
                //         this.type = 23
                //     }
                // }

                this.imageholder = new Image()
                this.imageholder.src = `m${this.type}.png`//srcnames(this.type) + ".svg"
            } else {
                this.type = type
            }



            this.r = 0
            this.g = 255
            this.b = 0


            this.healthbarx = new Rectangle(850, 590, 75, 5, `#222222`)
            this.healthbar = new Rectangle(850, 590, 75, 5, `rgb(${this.r},${this.g},${this.b})`)
            this.energybar = new Rectangle(1030, 590, 150, 10, "cyan")
            this.healthbar.strokeWidth = 0


            // this.type = 0
            this.level = level
            // this.level = 5


            this.body = new Polygon(350, 160, 15, getRandomColor(), this.type)
            this.health = 10 + (Math.floor(((Math.random() * .25) + .75) * this.level * 306))
            this.maxhealth = this.health
            this.hits = (Math.floor(((Math.random() * .25) + .75) * (this.level * 4.20))) + 1   //2.7


            this.attacked = 0
            this.alert = 0
            this.poison = 0
            this.resist = 0
            this.padding = 0
            this.drain = 0
            this.venom = 0
            this.blocks = 0
            this.enrage = 0
            this.thorns = 0
            this.bypass = 0
            this.betray = 0
            this.thick = 0
            this.explode = 0
            this.rampage = 0
            this.stun = 0

            if(this.pomaoyes == 1){
                this.maxhealth = (Math.ceil(this.maxhealth*1.2))
                this.health = (Math.ceil(this.health*1.2))
                this.hits = (Math.ceil(this.hits*1.2))


            if (Math.random()<.09){
                this.explode = Math.floor(((Math.random() * .25) + .75) * (this.level + 3) * 3) + 1
            }
            if (Math.random()<.09){
                this.blocks = Math.floor(((Math.random() * .25) + .75) * (this.level + 2) * 2)
            }
            if (Math.random()<.09){
                this.thorns = Math.floor(((Math.random() * .25) + .75) * (this.level + 1.5) * 1.4)
            }
            if (Math.random()<.09){
                this.heals = Math.floor(((Math.random() * .25) + .75) * (this.level + 3) * 2.3)
            }
            if (Math.random()<.09){
                this.venom = Math.floor(((Math.random() * .25) + .75) * (this.level + 2) * 2.15)
            }
            if (Math.random()<.09){
                this.enrage = Math.floor(((Math.random() * .25) + .75) * (this.level + 1) * 2.25) + 1
            }
            if (Math.random()<.09){
                this.bypass = Math.floor(((Math.random() * .25) + .75) * (this.level * 3) * 2.75) + 1
            }
            if (Math.random()<.09){
                this.cure = Math.floor(((Math.random() * .25) + .75) * (this.level + 1) * 1.65) + 1
            }
            if (Math.random()<.09){
                this.betray = Math.floor(((Math.random() * .25) + .75) * (this.level + 3.75) * 2.25) + 1
            }
            if (Math.random()<.09){
                this.drain = Math.floor(((Math.random() * .25) + .75) * (this.level + 3) * 5.5) + 1
            }
            if (Math.random()<.09){
                this.padding = Math.floor(((Math.random() * .25) + .75) * (this.level + 3) * 2.65) + 1
            }
            if (Math.random()<.09){
                this.resist = Math.floor(((Math.random() * .25) + .75) * (this.level + 1) * 1.80) + 1
            }
            if (Math.random()<.09){
                this.thick = Math.floor(((Math.random() * .4) + .6) * (this.level + 0.1) * .4)
                if (this.thick == 0) {
                    if (Math.random() > .2) {
                        this.thick = 1
                    }
                }
            }
            if (Math.random()<.09){
                this.rampage = Math.floor(((Math.random() * .25) + .75) * (this.level + 1) * 1.8) + 1
            }
            if (Math.random()<.09){
                this.alert = Math.floor(((Math.random() * .25) + .75) * (this.level + 2) * 4.4)  //should always be much higher than block or is completely redundant
            }
            if (Math.random()<.09){
                this.summon = 1
                if (Math.random() < .09) {
                    this.hits = 0
                }
            }
            }


            if (this.explodeyes == 1) {
                this.explode = Math.floor(((Math.random() * .25) + .75) * (this.level + 1) * 10) - 1
            }
            if (this.blockyes == 1) {
                this.blocks = Math.floor(((Math.random() * .25) + .75) * (this.level + 2) * 2.1)
            }
            if (this.thornsyes == 1) {
                this.thorns = Math.floor(((Math.random() * .25) + .75) * (this.level + 1.5) * 1.5)
            }
            if (this.healsyes == 1) {
                this.heals = Math.floor(((Math.random() * .25) + .75) * (this.level + 3) * 2.8)
            }
            if (this.venomyes == 1) {
                this.venom = Math.floor(((Math.random() * .25) + .75) * (this.level + 2) * 2.4)
            }
            if (this.enrageyes == 1) {
                this.enrage = Math.floor(((Math.random() * .25) + .75) * (this.level + 1) * 2.5) + 1
            }
            if (this.bypassyes == 1) {
                this.bypass = Math.floor(((Math.random() * .25) + .75) * (this.level * 3) * 2.9) + 1
            }
            if (this.cureyes == 1) {
                this.cure = Math.floor(((Math.random() * .25) + .75) * (this.level + 1) * 1.9) + 1
            }

            if (this.betrayyes == 1) {
                this.betray = Math.floor(((Math.random() * .25) + .75) * (this.level + 3.75) * 2.35) + 1
            }
            if (this.drainyes == 1) {
                this.drain = Math.floor(((Math.random() * .25) + .75) * (this.level + 3) * 5.5) + 1
            }
            if (this.paddingyes == 1) {
                this.padding = Math.floor(((Math.random() * .25) + .75) * (this.level + 3) * 3.1) + 1
            }
            if (this.resistyes == 1) {
                this.resist = Math.floor(((Math.random() * .25) + .75) * (this.level + 1) * 1.90) + 1
            }
            if (this.thickyes == 1) {
                this.thick = Math.floor(((Math.random() * .4) + .6) * (this.level + 0.1) * .4)
                if (this.thick == 0) {
                    if (Math.random() > .2) {
                        this.thick = 1
                    }
                }
            }
            if (this.rampageyes == 1) {
                this.rampage = Math.floor(((Math.random() * .25) + .75) * (this.level + 1) * 2.7) + 1
            }
            if (this.alertyes == 1) {
                this.alert = Math.floor(((Math.random() * .25) + .75) * (this.level + 2) * 4.4)  //should always be much higher than block or is completely redundant
            }
            if (this.summonyes == 1) {
                this.summon = 1
                if (Math.random() < .09) {
                    this.hits = 0
                }
            }
            if (this.drain > (this.hits + this.enrage + this.rampage) && this.drain > (this.betray + this.enrage + this.rampage)) {
                this.drain = Math.max(this.hits + this.enrage + this.rampage, this.betray + this.rampage + this.enrage)
            }
            this.strings = []
            this.stringmaker()
        }
        stringmaker() {
            this.strings = []
            if (this.health < 0) {
                this.health = 0
            }
            if (this.health > this.maxhealth) {
                this.health = this.maxhealth
            }
            this.strings.push([`${this.health}/${this.maxhealth}`, "white"])
            this.strings.push([``, "transparent"])
            this.strings.push([`Hits: ${this.hits + this.enrage + this.rampage}`, "white"])


            if (this.blocks > 0) {
                this.strings.push([`Blocks: ${this.blocks}`, "gray"])
                blocksong.play()
            }
            if (this.thorns > 0) {
                this.strings.push([`Thorns: ${this.thorns}`, "yellow"])
                thornsong.play()
            }
            if (this.poison > 0) {
                this.strings.push([`Poisoned: ${this.poison}`, "green"])
                poisonedsong.play()
            }
            if (this.heals > 0) {
                this.strings.push([`Heals: ${this.heals}`, "#00FF00"])
                healsong.play()
            }
            if (this.venom > 0) {
                this.strings.push([`Venom: ${this.venom}`, "magenta"])
                venomsong.play()
            }
            if (this.enrage > 0) {
                this.strings.push([`Enrage: ${this.enrage}`, "#DD2222"])
                enragesong.play()
            }
            if (this.summon > 0) {
                this.strings.push([`Summoner`, "#AAAA00"])
                summonsong.play()
            }
            if (this.bypass > 0) {
                this.strings.push([`Bypass: ${this.bypass}`, "#AAAAAA"])
                bypasssong.play()
            }
            if (this.cure > 0) {
                this.strings.push([`Treat: ${this.cure}`, "#FFAAAA"])
                treatsong.play()
            }
            if (this.betray > 0) {
                this.strings.push([`Betray: ${this.betray + this.enrage + this.rampage}`, "#FF0099"])
                betraysong.play()
            }
            if (this.drain > 0) {
                this.strings.push([`Drain: ${this.drain}`, "#99AAFF"])
                drainsong.play()
            }
            if (this.padding > 0) {
                this.strings.push([`Padded: ${this.padding}`, "#FFFFFF"])
                paddingsong.play()
            }
            if (this.resist > 0) {
                this.strings.push([`Resist: ${this.resist}`, "#FFAA00"])
                resistsong.play()
            }
            if (this.stun > 0) {
                this.strings.push([`Stunned: ${this.stun}`, "#3311FF"])
                stunsong.play()
            }
            if (this.thick > 0) {
                this.strings.push([`Thick: ${this.thick}`, "#33FFAA"])
                thicksong.play()
            }
            if (this.rampage > 0) {
                this.strings.push([`Frenzy: ${this.rampage}`, "#AA33FF"])
                rampagesong.play()
            }
            if (this.explode > 0) {
                this.strings.push([`Detonate: ${this.explode + this.enrage + this.rampage}`, "#FF6600"])
                detonatesong.play()
            }
            if (this.alert > 0) {
                this.strings.push([`Alert: ${this.alert}`, "#50AAAA"])
                alertsong.play()
            }
        }
        animate(guy) {

            setTimeout(function () {
                guy.body.y -= 7
                setTimeout(function () {
                    guy.body.y -= 6.5
                    setTimeout(function () {
                        guy.body.y -= 6
                        setTimeout(function () {
                            guy.body.y -= 5.5
                            setTimeout(function () {
                                guy.body.y -= 5
                                setTimeout(function () {
                                    guy.body.y -= 4.5
                                    setTimeout(function () {
                                        guy.body.y -= 4
                                        setTimeout(function () {
                                            guy.body.y -= 3.5
                                            setTimeout(function () {
                                                guy.body.y -= 3
                                                setTimeout(function () {
                                                    guy.body.y -= 2.5
                                                    setTimeout(function () {
                                                        guy.body.y -= 2
                                                        setTimeout(function () {
                                                            guy.body.y -= 1.5
                                                            setTimeout(function () {
                                                                guy.body.y -= 1
                                                                setTimeout(function () {
                                                                    guy.body.y -= 0.5
                                                                    setTimeout(function () {
                                                                        guy.body.y -= 0
                                                                        setTimeout(function () {
                                                                            guy.body.y += 0.5
                                                                            setTimeout(function () {
                                                                                guy.body.y += 1
                                                                                setTimeout(function () {
                                                                                    guy.body.y += 1.5
                                                                                    setTimeout(function () {
                                                                                        guy.body.y += 2
                                                                                        setTimeout(function () {
                                                                                            guy.body.y += 2.5
                                                                                            setTimeout(function () {
                                                                                                guy.body.y += 3
                                                                                                setTimeout(function () {
                                                                                                    guy.body.y += 3.5
                                                                                                    setTimeout(function () {
                                                                                                        guy.body.y += 4
                                                                                                        setTimeout(function () {
                                                                                                            guy.body.y += 4.5
                                                                                                            setTimeout(function () {
                                                                                                                guy.body.y += 5
                                                                                                                setTimeout(function () {
                                                                                                                    guy.body.y += 5.5
                                                                                                                    setTimeout(function () {
                                                                                                                        guy.body.y += 6
                                                                                                                        setTimeout(function () {
                                                                                                                            guy.body.y += 6.5
                                                                                                                            setTimeout(function () {
                                                                                                                                guy.body.y += 7
                                                                                                                            }, 9);
                                                                                                                        }, 9);
                                                                                                                    }, 9);
                                                                                                                }, 9);
                                                                                                            }, 9);
                                                                                                        }, 9);
                                                                                                    }, 9);
                                                                                                }, 9);
                                                                                            }, 9);
                                                                                        }, 9);
                                                                                    }, 9);
                                                                                }, 9);
                                                                            }, 9);
                                                                        }, 9);
                                                                    }, 9);
                                                                }, 9);
                                                            }, 9);
                                                        }, 9);
                                                    }, 9);
                                                }, 9);
                                            }, 9);
                                        }, 9);
                                    }, 9);
                                }, 9);
                            }, 9);
                        }, 9);
                    }, 9);
                }, 9);
            }, 9);

        }
        attackstart() {
            let holder = this
            // if(this.stun <= 0){
            setTimeout(function () {
                holder.attack()
            }, (300));
            // }
        }
        attack() {
            if (this.attacked == 0) {
                this.attacked = 1
                if (this.health > 0) {
                    if (this.stun <= 0) {
                        this.animate(this.body)
                        if (this.summon > 0) {
                            summons.push(new Enemy(-1, Math.max(this.level - 2, 0)))
                        }
                        player.venom += this.venom
                        if ((this.hits + this.enrage + this.rampage) >= (player.block - this.bypass)) {
                            player.health -= ((this.hits + this.enrage + this.rampage) - Math.max((player.block - this.bypass), 0))
                            if (((this.hits + this.enrage + this.rampage) - Math.max((player.block - this.bypass), 0)) > this.drain) {
                                this.health += this.drain
                            } else {
                                this.health += ((this.hits + this.enrage + this.rampage) - Math.max((player.block - this.bypass), 0))
                            }
                        }
                        if ((this.hits + this.enrage + this.rampage) > 0) {
                            this.health -= Math.max(player.thorns - this.padding, 0)
                        }
                        this.health -= this.poison
                        if (this.heals > 0) {
                            let index = Math.floor(enemies.length * Math.random())
                            let clicked = 0
                            for (let t = 0; clicked < 1; t++) {
                                index = Math.floor(enemies.length * Math.random())
                                if (enemies[index].health < enemies[index].maxhealth) {
                                    enemies[index].health += this.heals
                                    clicked = 1
                                    if (enemies[index].health > enemies[index].maxhealth) {
                                        enemies[index].health = enemies[index].maxhealth
                                    }
                                }
                                if (t > 100) {
                                    break
                                }
                            }
                        }
                        if (this.cure > 0) {
                            let index = Math.floor(enemies.length * Math.random())
                            let clicked = 0
                            for (let t = 0; clicked < 1; t++) {
                                index = Math.floor(enemies.length * Math.random())
                                if (enemies[index].poison > 0) {
                                    enemies[index].poison -= this.cure
                                    clicked = 1
                                    if (enemies[index].poison < 0) {
                                        enemies[index].poison = 0
                                    }
                                }
                                if (t > 100) {
                                    break
                                }
                            }
                        }
                        if (this.betray > 0) {
                            let index = Math.floor(enemies.length * Math.random())
                            let clicked = 0
                            for (let t = 0; clicked < 1; t++) {
                                index = Math.floor(enemies.length * Math.random())
                                if (enemies[index] != this) {
                                    enemies[index].health -= ((this.betray + this.enrage + this.rampage) - Math.max((enemies[index].blocks - this.bypass), 0))
                                    if (((this.betray + this.enrage + this.rampage) - Math.max((enemies[index].blocks - this.bypass), 0)) > this.drain) {
                                        this.health += this.drain
                                    } else {
                                        this.health += ((this.betray + this.enrage + this.rampage) - Math.max((enemies[index].blocks - this.bypass), 0))
                                    }
                                    if (enemies[index].enrage > 0) {
                                        enemies[index].enrage += 1
                                    }
                                    if (enemies[index].thorns > 0) {
                                        this.health -= Math.max(enemies[index].thorns - this.padding, 0)
                                    }
                                    clicked = 1
                                }
                                if (t > 100) {
                                    break
                                }
                            }
                        }
                        if (this.rampage > 0) {
                            this.rampage += 1
                        }
                    } else {
                        this.health -= this.poison
                    }
                }

                this.stun -= 1
                if (this.stun < 0) {
                    this.stun = 0
                }

                let indexer = enemies.indexOf(this)
                // console.log(indexer)
                if (indexer < enemies.length - 1) {
                    enemies[indexer + 1].attackstart()
                } else {
                    for (let t = 0; t < summons.length; t++) {
                        if (enemies.length < 16) {
                            enemies.push(summons[t])
                        }
                    }
                    summons = []
                    setTimeout(function () {
                        player.locked = 0
                    }, (600));
                }
            } else {

                let indexer = enemies.indexOf(this)
                // console.log(indexer)
                if (indexer < enemies.length - 1) {
                    enemies[indexer + 1].attackstart()
                } else {
                    for (let t = 0; t < summons.length; t++) {
                        if (enemies.length < 12) {
                            enemies.push(summons[t])
                        }
                    }
                    summons = []
                    setTimeout(function () {
                        player.locked = 0
                    }, (600));
                }
            }
        }
        drawImage(flip, flop, img = this.imageholder, x = this.body.body.x, y = this.body.body.y, width = 100, height = 100, deg = 0) {

            this.imageholder.src = `m${this.type}.png`//(srcnames(this.type) + ".svg").toLowerCase()
            canvas_context.save();
            let flipScale
            let flopScale

            if (typeof width === "undefined") width = img.width;
            if (typeof height === "undefined") height = img.height;

            // Set rotation point to center of image, instead of top/left
            if (true) {
                x -= width / 2;
                y -= height / 2;
            }

            // Set the origin to the center of the image
            canvas_context.translate(x + width / 2, y + height / 2);

            // Rotate the canvas around the origin
            var rad = 2 * Math.PI - deg * Math.PI / 180;
            canvas_context.rotate(rad);

            // Flip/flop the canvas
            if (flip) flipScale = -1; else flipScale = 1;
            if (flop) flopScale = -1; else flopScale = 1;
            canvas_context.scale(flipScale, flopScale);

            // Draw the image    
            canvas_context.drawImage(this.imageholder, -50, -50, 100, 100);

            canvas_context.restore();
        }
        draw() {

            this.stringmaker()
            // this.body.draw()
            // canvas_context.drawImage(this.imageholder, this.body.body.x-30, this.body.body.y-30, 60,60)

            if (enemies.indexOf(this) >= Math.floor(enemies.length * .5)) {
                this.drawImage(true, false)
            } else {

                this.drawImage(false, false)
            }


            this.healthbar.x = this.body.body.x - 37.5
            this.healthbarx.x = this.healthbar.x
            this.healthbar.y = this.body.body.y + 80
            this.healthbarx.y = this.healthbar.y
            this.healthbar.width = Math.min((75 * (this.health / this.maxhealth)), 75)


            this.g = ((this.healthbar.width / 75)) * 255
            this.r = 255 - this.g
            this.healthbar.color = `rgb(${this.r},${this.g},${this.b})`

            this.healthbarx.draw()
            this.healthbar.draw()



            // canvas_context.font = "12px arial"

            canvas_context.font = `${15 + (2 - (enemies.length / 8))}px arial`


            if (player.selected == this) {

                canvas_context.fillStyle = "white"

                canvas_context.strokeStyle = "black"
                canvas_context.lineWidth = 3
                canvas_context.font = `${17 + (2 - (enemies.length / 8))}px arial`
                canvas_context.strokeText(this.name, tringle.x - (getTextWidth(this.name, canvas_context.font) / 2), this.body.body.y - 76 + (1 * 18))
                canvas_context.fillText(this.name, tringle.x - (getTextWidth(this.name, canvas_context.font) / 2), this.body.body.y - 76 + (1 * 18))

                canvas_context.font = `${16 + (2 - (enemies.length / 8))}px arial`
            }

            // canvas_context.fillStyle = "white"
            for (let t = 0; t < this.strings.length; t++) {
                canvas_context.fillStyle = this.strings[t][1]
                canvas_context.strokeStyle = "black"
                canvas_context.lineWidth = 3
                canvas_context.strokeText(this.strings[t][0], this.body.body.x - 20, this.body.body.y + 70 + (t * 18))
                canvas_context.fillText(this.strings[t][0], this.body.body.x - 20, this.body.body.y + 70 + (t * 18))
            }
            // canvas_context.fillText(`${this.health}/${this.maxhealth}`, this.body.body.x - 15, this.body.body.y + 60)
            // canvas_context.fillText(`Hits: ${this.hits}`, this.body.body.x - 15, this.body.body.y + 80)
            // if(this.poison > 0){
            //     canvas_context.fillStyle = "green"
            //     canvas_context.fillText(`Poisoned: ${this.poison}`, this.body.body.x - 15, this.body.body.y + 100)
            // }
            if (this.health <= 0) {
                if (this.explode > 0) {
                    for (let t = 0; t < enemies.length; t++) {
                        enemies[t].health -= Math.max(((this.explode + this.enrage + this.rampage) - Math.max((enemies[t].blocks - this.bypass), 0) - enemies[t].alert), 0)
                    }
                    player.health -= ((this.explode + this.enrage + this.rampage) - Math.max((player.block - this.bypass), 0))

                }
                enemies.splice(enemies.indexOf(this), 1)

                if (enemies.length > 0) {
                    alertsong.pause()
                    betraysong.pause()
                    blocksong.pause()
                    bypasssong.pause()
                    detonatesong.pause()
                    drainsong.pause()
                    enragesong.pause()
                    paddingsong.pause()
                    poisonedsong.pause()
                    rampagesong.pause()
                    resistsong.pause()
                    stunsong.pause()
                    summonsong.pause()
                    thicksong.pause()
                    thornsong.pause()
                    treatsong.pause()
                    venomsong.pause()
                    healsong.pause()
                }

                if (enemies.length == 0) {
                    player.reward = 1
                    for (let t = 0; t < player.deck.active.length; t++) {
                        player.deck.push(player.deck.active[t].clone())
                    }
                    player.deck.active = []
                    player.deck.makeprize()
                } else if (!enemies.includes(player.selected)) {
                    player.selected = enemies[0]
                }
            }
        }


    }

    let player = new Player()
    let enemies = []
    let summons = []
    let expcounter = 0
    let enenum = Math.floor(Math.random() * 8) + 1
    for (let t = 0; t < enenum; t++) {
        let enemy = new Enemy(-1)
        enemies.push(enemy)
    }
    player.level = 0
    function spawn() {
        expcounter++
        if (expcounter > 0) {
            player.level += .05
            player.maxhealth += 2
            expcounter = 0
        }
        enenum = Math.floor(Math.random() * 8) + 1
        for (let t = 0; t < enenum; t++) {
            let enemy
            if (enenum > 3) {
                enemy = new Enemy(-1, player.level * (1 + (1 - (enenum / 8))))
            } else {

                if (enenum == 1) {
                    enemy = new Enemy(-1, player.level * 3)
                } else if (enenum == 2) {
                    enemy = new Enemy(-1, player.level * 2.3)
                } else if (enenum == 3) {
                    enemy = new Enemy(-1, player.level * 1.8)
                }
            }
            enemies.push(enemy)
        }
        player.health = player.maxhealth
        player.energy = player.energymax
        player.block = 0
        player.thorns = 0
        player.venom = 0

        player.deck.softpull()

        alertsong.pause()
        betraysong.pause()
        blocksong.pause()
        bypasssong.pause()
        detonatesong.pause()
        drainsong.pause()
        enragesong.pause()
        paddingsong.pause()
        poisonedsong.pause()
        rampagesong.pause()
        resistsong.pause()
        stunsong.pause()
        summonsong.pause()
        thicksong.pause()
        thornsong.pause()
        treatsong.pause()
        venomsong.pause()
        healsong.pause()
    }

    let setup_canvas = document.getElementById('canvas') //getting canvas from document
    setUp(setup_canvas) // setting up canvas refrences, starting timer. 

    let counter = 0

    let tringle = new Pointer(350, 350, "white", 10)

    let notstarted = 1
    let startbutton = new Rectangle(0, 0, 1280, 720, "white")
    player.deck.softpull()
    function main() {

        if (player.reward == 0) {
            if (player.health > 0) {
                if (keysPressed['1']) {
                    player.deck.active[0].play()
                }
                if (keysPressed['2']) {
                    player.deck.active[1].play()
                }
                if (keysPressed['3']) {
                    player.deck.active[2].play()
                }
                if (keysPressed['4']) {
                    player.deck.active[3].play()
                }
                if (keysPressed['5']) {
                    player.deck.active[4].play()
                }
            }
        }
        for (let k = 0; k < enemies.length; k++) {
            for (let t = 0; t < enemies.length; t++) {
                enemies[t].body.body.x = (((canvas.width - 36) / enemies.length + 1) * (t)) + (((canvas.width - 36) / (enemies.length * 2)))
                enemies[t].draw()
            }
        }
        canvas_context.clearRect(0, 0, (canvas.width), canvas.height)


        if (player.reward == 0) {

            drawbg()
            // canvas_context.drawImage(scape1, 0,0,1280,720) 
        }
        gamepadAPI.update()
        for (let t = 0; t < enemies.length; t++) {
            enemies[t].body.body.x = (((canvas.width - 36) / enemies.length + 1) * (t)) + (((canvas.width - 36) / (enemies.length * 2)))
            enemies[t].draw()
        }
        player.draw()
        if (player.reward == 0) {
            if (!enemies.includes(player.selected)) {
                player.selected = enemies[0]
            } else {
                tringle.x = player.selected.body.body.x
                tringle.y = player.selected.body.body.y - 90
                tringle.draw()
            }
        }
        if(notstarted == 1){
            startbutton.draw()

            canvas_context.font = "100px arial"
            canvas_context.fillStyle = "Black"
            canvas_context.fillText("Click to Start", 375, 400)
            canvas_context.fillText("Click to Start", 375, 400)
            canvas_context.fillText("Click to Start", 375, 400)
            canvas_context.fillText("Click to Start", 375, 400)
            canvas_context.font = "29px arial"
            canvas_context.fillStyle = "Black"
            canvas_context.fillText("Music By: Lekman, Interface Layout by: ssstar, Backgrounds by upklyak and vectorpouch / Freepik", 0, 710)
        }
    }
    function drawbg() {
        if (player.image == 0) {
            canvas_context.drawImage(scape1, player.leftdisp * (scape1.width - (1280 * 1.5)), player.topdisp * (scape1.height - (720 * 1.5)), 1280 * 1.5, 720 * 1.5, 0, 0, 1280, 720)
        }
        if (player.image == 1) {
            canvas_context.drawImage(scape2, player.leftdisp * (scape2.width - (1280 * 1.5)), player.topdisp * (scape2.height - (720 * 1.5)), 1280 * 1.5, 720 * 1.5, 0, 0, 1280, 720)
        }
        if (player.image == 2) {
            canvas_context.drawImage(scape3, player.leftdisp * (scape3.width - (1280 * 1.5)), player.topdisp * (scape3.height - (720 * 1.5)), 1280 * 1.5, 720 * 1.5, 0, 0, 1280, 720)
        }
        if (player.image == 3) {
            canvas_context.drawImage(scape4, player.leftdisp * (scape4.width - (1280 * 1.5)), player.topdisp * (scape4.height - (720 * 1.5)), 1280 * 1.5, 720 * 1.5, 0, 0, 1280, 720)
        }
        if (player.image == 4) {
            canvas_context.drawImage(scape5, player.leftdisp * (scape5.width - (1280 * 1.5)), player.topdisp * (scape5.height - (720 * 1.5)), 1280 * 1.5, 720 * 1.5, 0, 0, 1280, 720)
        }
    }

    function nameswitch(type) {
        switch (type) {
            case 0:
                return "Adenolish"
            case 1:
                return "Algadjin"
            case 2:
                return "Avokaboom"
            case 3:
                return "Ayateda"
            case 4:
                return "Baa"
            case 5:
                return "Banandroid"
            case 6:
                return "Beary"
            case 7:
                return "Beeurchin"
            case 8:
                return "Bice"
            case 9:
                return "Bellaja"
            case 10:
                return "Blanqast"
            case 11:
                return "Blattle"
            case 12:
                return "Bongu"
            case 13:
                return "Battlerfly"
            case 14:
                return "Centiclak"
            case 15:
                return "Cheetza"
            case 16:
                return "Chilldabeast"
            case 17:
                return "Chimpansy"
            case 18:
                return "Communigator"
            case 19:
                return "Phishuk"
            case 20:
                return "Cyosteroth"
            case 21:
                return "Rushroom"
            case 22:
                return "Deblobbio"
            case 23:
                return "Degeissdt"
            case 24:
                return "Dicyto"
            case 25:
                return "Djoper"
            case 26:
                return "Dothog"
            case 27:
                return "Doughgnat"
            case 28:
                return "Eggress"
            case 29:
                return "Elocurl"
            case 30:
                return "Epibazang"
            case 31:
                return "Errantnope"
            case 32:
                return "Farmot"
            case 33:
                return "Faedendron"
            case 34:
                return "Flashmer"
            case 35:
                return "Flyinsoup"
            case 36:
                return "Fwuffynumpkins"
            case 37:
                return "Geliphant"
            case 38:
                return "Threadnought"
            case 39:
                return "Giteriglia"
            case 40:
                return "Glyer"
            case 41:
                return "Grobhost"
            case 42:
                return "Gungholio"
            case 43:
                return "Gytanic"
            case 44:
                return "Halocordate"
            case 45:
                return "Haptozahen"
            case 46:
                return "Hemtan"
            case 47:
                return "Honigkonig"
            case 48:
                return "Hmun"
            case 49:
                return "Hykeyna"
            case 50:
                return "Hyuntress"
            case 51:
                return "Ihmpdrap"
            case 52:
                return "Illellonab"
            case 53:
                return "Indeo"
            case 54:
                return "Jiyou"
            case 55:
                return "Kachort"
            case 56:
                return "Knightstacean"
            case 57:
                return "Kohboh"
            case 58:
                return "Kungulp"
            case 59:
                return "Kunk"
            case 60:
                return "Levdzell"
            case 61:
                return "Mangoon"
            case 62:
                return "Manterfly"
            case 63:
                return "Mantidile"
            case 64:
                return "Meloncollie"
            case 65:
                return "Memeek"
            case 66:
                return "Minkohabod"
            case 67:
                return "Toximastica"
            case 68:
                return "Mnemont"
            case 69:
                return "Mondosplak"
            case 70:
                return "Monopteryx"
            case 71:
                return "Mossboss"
            case 72:
                return "Munegull"
            case 73:
                return "Sungull"
            case 74:
                return "Nentopode"
            case 75:
                return "Nhainhai"
            case 76:
                return "Nimnamnom"
            case 77:
                return "Nokoyl"
            case 78:
                return "Obchovy"
            case 79:
                return "Octgotot"
            case 80:
                return "Ogo"
            case 81:
                return "Origanimal"
            case 82:
                return "Osteoplang"
            case 83:
                return "Parafox"
            case 84:
                return "Pigin"
            case 85:
                return "Probocetus"
            case 86:
                return "Prostrax"
            case 87:
                return "Psychobath"
            case 88:
                return "R@tic"
            case 89:
                return "Reefcake"
            case 90:
                return "Rhischlosserous"
            case 91:
                return "Rivzo"
            case 92:
                return "Rongzeed"
            case 93:
                return "Runnybabbit"
            case 94:
                return "Rytegg"
            case 95:
                return "Wrongegg"
            case 96:
                return "Sapiosuant"
            case 97:
                return "Satinella"
            case 98:
                return "Scarbecue"
            case 99:
                return "Schlorkupine"
            case 100:
                return "Schmodozer"
            case 101:
                return "Schorp"
            case 102:
                return "Scorphibian"
            case 103:
                return "Slamelion"
            case 104:
                return "Sluggernaut"
            case 105:
                return "Sorba"
            case 106:
                return "Sortsand"
            case 107:
                return "Sparvae"
            case 108:
                return "Spikegul"
            case 109:
                return "Strachid"
            case 110:
                return "Sudakleez"
            case 111:
                return "Swogharnler"
            case 112:
                return "Tacroach"
            case 113:
                return "Tafantula"
            case 114:
                return "Takobie"
            case 115:
                return "Tankgolin"
            case 116:
                return "Toobapath"
            case 117:
                return "Missleaneous"
            case 118:
                return "Triaural"
            case 119:
                return "Tutewtoo"
            case 120:
                return "Uggnawb"
            case 121:
                return "Urcaria"
            case 122:
                return "Vamprey"
            case 123:
                return "Vellup"
            case 124:
                return "Wheeliosbop"
            case 125:
                return "Whumpump"
            case 126:
                return "Wochem"
            case 127:
                return "Xaltoxis"
            case 128:
                return "Xlitch"
            case 129:
                return "Yallod"
            case 130:
                return "Yuggle"
            case 131:
                return "Zaum"
            case 132:
                return "Zeen"
            case 133:
                return "Zentipede"
            case 134:
                return "Xrachnid"
            case 135:
                return "Zubgondrakter"
            case 136:
                return "Pomao"
        }
    }

    function getTextWidth(text, font) {
        // re-use canvas object for better performance
        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }
})