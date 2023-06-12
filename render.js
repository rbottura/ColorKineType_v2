class DataSet {
    constructor(name, jsondata) {
        this.name = name;
        this.jsondata = jsondata;
    }
}

const ListNameFonts = ['alphabet', 'raleway', 'egypt', 'garam', 'peace', 'pilow', 'mainz', "destra", "minipax", "custom"];

const nbrDataSets = ListNameFonts.length - 1;
let ListDataSets = [];
let globalConstLength = 150;
let currentSetValue = 1 - (1);
let dataSetIndex = 0;

let mainBodies = [];
let mainConz = [];
let letterSet = [mainBodies, mainConz];

let globalSprite, globalSize = 1;
let globalCaracter;
let dots = []
let localLtrSet;
let sprites = []

let currentLetter;
let first_loop = true;

let textBalls = document.getElementById("textBalls");
let posBalls = 1;

let spriteItems = document.getElementsByClassName("spriteItem");
let arrSprites = [].slice.call(spriteItems);
arrSprites.forEach(element => { element.addEventListener("click", (event) => changeSprite(event)) });

let caracterIndex;
let checkReload;

loadDataSets();
function loadDataSets() {
    // for (let i = 0; i < nbrDataSets; i++) {
    let url = './data/json_data_' + (1 + dataSetIndex) + '.json';
    if (dataSetIndex < nbrDataSets) {
        fetch(url)
            .then(response => response.json())
            .then(jsondata => {
                ListDataSets.push(new DataSet(ListNameFonts[dataSetIndex], jsondata))
                gen(jsondata, ListNameFonts[dataSetIndex])

                dataSetIndex++;
                loadDataSets();
            });
    } else {
        // creaParticules2(19);
        showLetter('start');
        ListDataSets.push(jsonCstSet)
    }
}

// i0 : { name : "A", points : { pt1 : [20, 50] }}

const sets = {}
function gen(dataset, name) {
    const obj = {};
    for (let i = 0; i < dataset.length; i++) {
        // console.log(dataset[i].length)
        let indexProp = 'i' + (i + 1);
        obj[indexProp] = {};

        const points = {};
        for (let j = 0; j < dataset[i].length; j++) {
            let char = (65 + i);
            let nameProp = char;
            let newindex = obj[Object.keys(obj)[i]]
            newindex.charHtmlIndex = nameProp;

            let ptProp = 'pt' + (j + 1);
            points[ptProp] = dataset[i][j]
            newindex.points = points;
        }
    }
    sets[name] = obj;
    boundingBox(sets[name])
}

function boundingBox(dataset) {
    // min & max val on X
    // min & max val on Y

    const currentDataSet = Object.values(dataset)
    for (const elem of currentDataSet) {
        if (elem) {
            const indexPts = Object.values(elem.points)
            let arrX = [], arrY = [];

            for (const elem2 of indexPts) {
                arrX.push(elem2[0])
                arrY.push(elem2[1])
            }
            let maxX = Math.max(...arrX)
            let minX = Math.min(...arrX)
            let maxY = Math.max(...arrY)
            let minY = Math.min(...arrY)

            // console.log('X(min, max) : (' +minX+', '+ maxX +') ' + ' Y(min, max) : (' + minY + ', ' + maxY+').')

            let tlc = [minX, maxY]
            let trc = [maxX, maxY]
            let blc = [minX, minY]
            let brc = [maxX, minY]

            let centerPoint = [(tlc[0] + brc[0]) / 2, (tlc[1] + brc[1]) / 2]

            elem.offsetX = WiW / 2 - centerPoint[0]
            elem.offsetY = WiH / 2 - centerPoint[1]
        }

    }
    console.log(sets)
}

Matter.use(MatterAttractors);
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Body = Matter.Body,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine = Engine.create(), world = engine.world;

let render = Render.create({
    engine: engine,
    canvas: document.querySelector("#render_matter"),
    context: document.querySelector("#render_matter").getContext('2d'),
    // setPixelRatio: 10,
    options: {
        // width: Math.trunc(WiH/1.414),
        width: canvasWidth,
        height: canvasHeight,
        showAngleIndicator: false,
        wireframes: false,
        background: 'rgba(0,0,0,0)',
        pixelRatio: 1,
    }
});

// Render.run(render);

const dotProfil = {
    'img': sprites[9],
    'scale': 1,
}

function addP5render() {
    const canvasP5 = p => {
        let gScale;
        class Dot {
            constructor(x, y, img, scale) {
                this.x = x;
                this.y = y;
                this.img = img;

                this.scale = scale;
                this.filter = p.GRAY;

                this.rotation = 0;
            }
            show() {
                p.push()
                p.translate(this.x - WiW / 2, this.y - WiH / 2)
                p.rotate(this.rotation)
                p.scale(this.scale)
                p.image(this.img, 0, 0)
                p.pop()
            }
            update(x, y) {
                this.x = x;
                this.y = y;
            }
            upscale(){ 
                this.scale = gScale
            }
            rot(r) {
                this.rotation = r
            }
        }

        let spriteItems = document.querySelectorAll('.spriteItem')

        p.preload = function () {
            for (let i = 0; i < spriteItems.length; i++) {
                let img = p.loadImage(spriteItems[i].src)
                sprites.push(img)
            }
            console.log(sprites)
        }

        let canvas;
        p.setup = function () {
            canvas = p.createCanvas(WiW, WiH)
            // p.background(p.color('brown'))
            p.imageMode(p.CENTER)
            p.pixelDensity(1)
            p.rectMode(p.CENTER)

            globalSprite = sprites[8];
            for (let i = 0; i < letterSet[0].length; i++) {
                let dot = new Dot(letterSet[0][i].position.x, letterSet[0][i].position.y, globalSprite, globalSize)
                dots.push(dot)
            }
        }

        let x = 0;
        p.draw = function () {
            gScale = Math.cos(p.millis()/4500) * .85
            // p.clear()
            p.push()
            p.translate(WiW / 2, WiH / 2)
            p.scale(document.querySelector('#input_zoom_range').value)

            if (dots.length == letterSet[0].length) {
                for (const elem of dots) {
                    elem.show()
                }
                // console.log(offsetValX)
                for (let i = 0; i < dots.length; i++) {
                    dots[i].update(letterSet[0][i].position.x, letterSet[0][i].position.y)
                    // dots[i].upscale()
                }
            } else {
                genDots()
            }
            p.pop()
        }

        p.keyPressed = function (e) {
            console.log(e)
            if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
                genDots()
            }
        }

        p.mousePressed = function (e) {
            let trg = e.target
            // console.log(trg)
            if (trg.classList.contains('radioSets')) {
                genDots()
            }
        }

        function genDots() {
            console.log('gen dots')
            p.clear()
            dots = []
            for (let i = 0; i < letterSet[0].length; i++) {
                let dot = new Dot(letterSet[0][i].position.x, letterSet[0][i].position.y, globalSprite, globalSize)
                dots.push(dot)
            }
        }
    }

    if (letterSet.length != 0) {
        new p5(canvasP5, 'render_p5_container')
    }

    upadateRotation();

}

radioInputEvent()
function radioInputEvent() {
    document.querySelectorAll('.radioSets').forEach(elem => {
        elem.addEventListener('change', (e) => {
            if (e.target.checked) {
                currentSetValue = parseInt(event.target.value);
                caracterIndex = 0;
                creaParticules2(caracterIndex);
                e.target.blur()
            }
        })
    })
}

let speed1 = 0.2;
engine.gravity.y = 0;

var attractiveBody = Bodies.circle(
    render.options.width / 2,
    render.options.height / 2,
    10,
    {
        isStatic: true,
        render: {
            fillStyle: "transparent",
            // fillStyle: "rgba(0,0,0,0.1)",
        },
        collisionFilter: {
            category: mouseCategory,
            group: -1
        },
        // example of an attractor function that 
        // returns a force vector that applies to bodyB
        plugin: {
            attractors: [
                function (bodyA, bodyB) {
                    return {
                        x: (bodyA.position.x - bodyB.position.x) * 2e-5,
                        y: (bodyA.position.y - bodyB.position.y) * 2e-5,
                    };
                }
            ]
        }
    });

World.add(world, attractiveBody);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            // allow bodies on mouse to rotate
            angularStiffness: 0,
            render: {
                visible: false
            }
        }
    });

// add mouse control
World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;


var ballsCategory = 0x0001,
    mouseCategory = 0x0002;

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

document.addEventListener("keydown", showLetter);

function showLetter(e) {

    if (e == 'start') {
        creaParticules2(18);
        fullReload()
    }
    checkReload = document.getElementById("checkReload").checked;

    if (e.keyCode == 38 || e == 38) {
        console.log("UP")
        if (caracterIndex == ListDataSets[currentSetValue].jsondata.length - 1) {
            caracterIndex = 0;
            creaParticules2(caracterIndex)
        } else {
            console.log(caracterIndex)
            caracterIndex++;
            creaParticules2(caracterIndex)
        }
    } else if (e.keyCode == 40) {
        console.log("DOWN")
        if (caracterIndex == 0) {
            caracterIndex = ListDataSets[currentSetValue].jsondata.length - 1;
            creaParticules2(caracterIndex)
        } else {
            caracterIndex--;
            creaParticules2(caracterIndex)
        }
    }
}

var index_cnt = 0;

function creaParticules2(caracter) {
    globalCaracter = caracter
    let posX = 0;
    let posY = 1;
    // A data set 1 = ListDataSets[currentSetValue].jsondata[caracter][point][x]
    if (!first_loop) {
        console.log(caracter);
        for (let i = 0; i < currentLetter.length; i += 1) {
            Matter.Composite.remove(world, [letterSet[0][i], letterSet[1][i]])
        }
        letterSet[0] = [];
        letterSet[1] = [];
    }
    console.log(ListDataSets[currentSetValue])
    for (let point = 0; point < ListDataSets[currentSetValue].jsondata[caracter].length; point++) {

        let indexOff = sets[ListDataSets[currentSetValue].name];
        let offsetValX = 0;
        let offsetValY = 0;
        if (currentSetValue < 9) {
            offsetValX = indexOff['i' + (caracter + 1)].offsetX;
            offsetValY = indexOff['i' + (caracter + 1)].offsetY;
        } else {
            offsetValX = 0
            offsetValY = 0
        }
        let body = Bodies.circle(ListDataSets[currentSetValue].jsondata[caracter][point][posX] + offsetValX + globalConstLength, ListDataSets[currentSetValue].jsondata[caracter][point][posY] + offsetValY + globalConstLength, 1, {
            render: {
                fillStyle: "rgba(0,0,0,0)",
                // sprite: {
                // xScale: 0.3,
                // yScale: 0.3,
                // }
            },
            frictionAir: 0.01,
            restitution: 0.9,
            density: 0.01,
            collisionFilter: {
                category: ballsCategory,
                group: -1
            }

        });
        letterSet[0].push(body);
        let constraint = Constraint.create({
            // pointA: { x: dataSets[currentSet][key][i][0] / posBalls + offset_sets[currentSet], y: dataSets[currentSet][key][i][1] / posBalls + (offset_sets[currentSet] / 3) },
            pointA: { x: ListDataSets[currentSetValue].jsondata[caracter][point][posX] + offsetValX, y: ListDataSets[currentSetValue].jsondata[caracter][point][posY] + offsetValY },
            bodyB: body,
            pointB: { x: 0, y: 0 },
            stiffness: 1,
            damping: 0.1,
            render: {
                anchors: false,
                strokeStyle: "rgba(0,0,0,0.1)",
                lineWidth: 5,
            }
        })
        letterSet[1].push(constraint);

        World.add(world, [body, constraint]);
        if (first_loop) {
            console.log("first")
            addP5render()
        }
        first_loop = false;
    }

    caracterIndex = caracter;

    currentLetter = ListDataSets[currentSetValue].jsondata[caracter];
    if (checkReload) {
        fullReload();
    }

}

document.querySelectorAll("#input_zoom_range, #op_zoom_val").forEach(elem => {
    elem.addEventListener("change", (e) => {
        let value = parseFloat(e.target.value);
        document.querySelector("#op_zoom_val").value = value;
        document.querySelector("#input_zoom_range").value = value;
        offZoom = value;

        Render.lookAt(render, {
            min: { x: -offZoom, y: -offZoom },
            max: { x: canvasWidth + offZoom, y: canvasHeight + offZoom }
        });

    })
})

function upadateRotation() {
    for (let i = 0; i < letterSet[0].length; i++) {
        let AX = (letterSet[0][i].position.x / posBalls + 0);
        let AY = (letterSet[0][i].position.y / posBalls + 0);
        let angleRadian = Math.atan2(attractiveBody.position.y - AY, attractiveBody.position.x - AX);
        letterSet[0][i].angle = angleRadian + Math.PI * 0.9;
        if (dots.length != 0 && i <= dots.length - 1) {
            dots[i].rot(angleRadian + Math.PI * 0.9)
        }
    }
    requestAnimationFrame(upadateRotation);
}

// fit the render viewport to the scene
let zoomVP = 1.0, offZoom = 0;
let backgroundWall = Bodies.rectangle(WiW * zoomVP / 2, WiH * zoomVP / 2, WiW * zoomVP, WiH * zoomVP, {
    render: {
        fillStyle: "white",
    },
    isStatic: true,
    isSensor: true,
})
World.add(world, backgroundWall)


function showBalls() {
    let checkParticles = document.getElementById("checkParticles").checked;
    //console.log(e.target.checked);
    if (!checkParticles) {
        for (let i = 0; i < letterSet[0].length; i++) {
            // letterSet[0][i].render.fillStyle = "rgba(0,0,0,0)";
            // letterSet[0][i].render.sprite.texture = "";

            letterSet[0][i].render.fillStyle = "rgba(0,0,0,0)";
            letterSet[0][i].render.sprite.texture = "";
        }
    } else {
        // particleFill();
    }
}

function particleFill() {
    let checkFill = document.getElementById("checkFill");
    if (checkFill.checked) {
        loadColor();
    } else {
        loadSprite();
    }
}

function changeSprite(e) {
    for (i = 0; i < spriteItems.length; i++) {
        if (spriteItems[i].classList.contains("activeSprite")) {
            spriteItems[i].classList.remove("activeSprite");
        }
    }
    e.target.classList.add("activeSprite");
    loadSprite();
}

function loadSprite() {
    let spriteSrc;
    for (i = 0; i < spriteItems.length; i++) {
        if (spriteItems[i].classList.contains("activeSprite")) {
            spriteSrc = spriteItems[i].src;
            for (const elem of dots) {
                elem.img = sprites[i]
                globalSprite = sprites[i]
            }
        }
    }
    for (let i = 0; i < letterSet[0].length; i++) {
        letterSet[0][i].render.sprite.texture = spriteSrc;
    }
}

function loadColor() {
    let fillColor = document.getElementById("particlesColor").value;
    for (let i = 0; i < letterSet[0].length; i++) {
        letterSet[0][i].render.sprite.texture = "";
        letterSet[0][i].render.fillStyle = fillColor;
    }
}

function scaleParticle() {
    let ballSize = document.getElementById("particleSize").value;
    for (let i = 0; i < letterSet[0].length; i++) {
        letterSet[0][i].render.sprite.xScale = ballSize;
        letterSet[0][i].render.sprite.yScale = ballSize;
        if (dots.length != 0 && i < dots.length) {
            dots[i].scale = ballSize
            globalSize = ballSize
        }
    }
}

function changeAirFriction() {
    let airFric = document.getElementById("airFric").value;
    for (let i = 0; i < letterSet[0].length; i++) {
        letterSet[0][i].frictionAir = airFric;
    }
}

function changeRadius() {
    let circRadius = document.getElementById("circRadius").value;
    for (let i = 0; i < letterSet[0].length; i++) {
        letterSet[0][i].circleRadius = circRadius;
    }
    console.log(circRadius);
}

function changeDensity() {
    let density = document.getElementById("density").value;
    for (let i = 0; i < letterSet[0].length; i++) {
        Matter.Body.setDensity(letterSet[0][i], density);
    }
    console.log(density);
}

function showConstrains() {
    let checkConstrain = document.getElementById("checkConstrains").checked;
    console.log(checkConstrain);
    if (!checkConstrain) {
        for (let i = 0; i < letterSet[1].length; i++) {
            letterSet[1][i].render.strokeStyle = "rgba(0,0,0,0)";
        }
    } else if (checkConstrain) {
        let strokeColor = document.getElementById("constrainStyle").value;
        console.log(strokeColor);
        constrainStyle();
    }
}

function constrainStyle() {
    let constrainStyle = document.getElementById("constrainStyle").value;
    let constStrokeWidth = document.getElementById("constStrokeWidth").value;
    for (let i = 0; i < letterSet[1].length; i++) {
        letterSet[1][i].render.strokeStyle = constrainStyle;
        letterSet[1][i].render.lineWidth = constStrokeWidth;
    }
}

function showAnchors() {
    let checkAnchors = document.getElementById("checkAnchors").checked;
    if (checkAnchors) {
        for (let i = 0; i < letterSet[1].length; i++) {
            letterSet[1][i].render.anchors = true;
        }
    } else {
        for (let i = 0; i < letterSet[1].length; i++) {
            letterSet[1][i].render.anchors = false;
        }
    }
}

function changeStiffness() {
    let getStiffness = document.getElementById("constStifness").value;
    for (let i = 0; i < letterSet[1].length; i++) {
        letterSet[1][i].stiffness = getStiffness;
    }
    console.log(getStiffness);
}

function constrainLength() {
    let constLength = document.getElementById("constLength").value;
    for (let i = 0; i < letterSet[1].length; i++) {
        letterSet[1][i].length = constLength;
        globalConstLength = parseFloat(constLength);
    }
}

function fullReload() {
    console.log("full reload")
    showBalls();
    scaleParticle()
    changeAirFriction()
    // changeRadius()
    changeDensity()
    // showConstrains()
    // showAnchors()
    changeStiffness()
    constrainLength()
}

let itemInterfaces = document.getElementsByClassName("itemInterface");
let animation_window = document.querySelector("#animation_window")
let styling_window = document.querySelector("#styling_window")

let interface = document.getElementById("interface");
function hideInterface() {
    // interface.style.boxShadow == "none" ? interface.style.boxShadow = "0px 0px 8px rgb(147, 147, 147)" : interface.style.boxShadow = "none";
    for (let i = 1; i < itemInterfaces.length; i++) {
        itemInterfaces[i].style.display == "none" ? itemInterfaces[i].style.display = "inline-block" : itemInterfaces[i].style.display = "none";
    }

    styling_window.style.display == "none" ? styling_window.style.display = "block" : styling_window.style.display = "none"
    animation_window.style.display == "none" ? animation_window.style.display = "block" : animation_window.style.display = "none"
}

function setLightMode() {
    backgroundWall.render.fillStyle == "black" ? backgroundWall.render.fillStyle = "white" : backgroundWall.render.fillStyle = "black"

    attractiveBody.render.fillStyle == "rgba(255,255,255,0.1)" ? attractiveBody.render.fillStyle = "rgba(0,0,0,0.1)" : attractiveBody.render.fillStyle = "rgba(255,255,255,0.1)"

    document.body.style.backgroundColor == "black" ? document.body.style.backgroundColor = "white" : document.body.style.backgroundColor = "black";

    interface.style.color == "white" ? interface.style.color = "black" : interface.style.color = "white";
    interface.style.backgroundColor == "black" ? interface.style.backgroundColor = "white" : interface.style.backgroundColor = "black";
    // styling_window.style.color == "white" ? styling_window.style.color = "black" : styling_window.style.color = "white";
    // animation_window.style.color == "white" ? animation_window.style.color = "black" : animation_window.style.color = "white";
}

let displayStatus = true;
function fireInterfaceDisplay() {
    if (displayStatus) {
        interface.style.display = "none"
        displayStatus = false;
    } else {
        interface.style.display = "flex"
        displayStatus = true;
    }
}









let globalGrabStat = true;
let globalDragTarget;

let allDragElem;
let allHandleElem;
setTimeout(() => { loadDragElements() }, 2000);
function loadDragElements() {
    allDragElem = undefined;
    allHandleElem = undefined;
    allDragElem = document.querySelectorAll(".drag")
    allHandleElem = document.querySelectorAll(".handle")
    for (const elem of allHandleElem) {
        elem.onmousedown = (event) => {
            globalGrabStat = false;
            globalDragTarget = event.target;
            // console.log(event)
        }
    }
    for (const elem of allDragElem) {
        elem.onmouseup = () => {
            globalGrabStat = true;
        }
    }
}

document.onmousemove = (event) => {
    // console.log(globalDragTarget.parentNode) ;
    if (!globalGrabStat) {
        let rectHandle = globalDragTarget.getBoundingClientRect();
        let offX = rectHandle.width / 2 + 8
        let offY = rectHandle.height / 2 + 8
        globalDragTarget.parentNode.style.left = event.clientX - offX + "px";
        globalDragTarget.parentNode.style.top = event.pageY - offY + "px";
    }
}



let animMode = 1;
let rotateVal = 0;
// gravCircle();
function gravCircle() {
    Body.translate(attractiveBody, {
        x: (((WiW * zoomVP / 2.2) + (Math.cos(rotateVal) * WiW / 2.5)) - attractiveBody.position.x) * 0.1,
        y: ((WiH * zoomVP / 2.2) + Math.sin(rotateVal) * WiH / 1.5 - attractiveBody.position.y) * 0.1
    })
    rotateVal += 0.03;
}

let stepEight = 0, nbrNoeuds = 2, xval = 0;
// gravEight()
function gravEight() {
    let ampX = WiW * 1.2;
    let ampY = 600;
    Body.translate(attractiveBody, {
        x: (((WiW * zoomVP / 2) + Math.cos(xval) * ampX) - attractiveBody.position.x) * 0.01,
        y: (((WiH * zoomVP / 2.5) + Math.sin(stepEight) * ampY) - attractiveBody.position.y) * 0.01
    })
    xval += 5 / nbrNoeuds * 0.05;
    stepEight += 0.008;
}

let indexPt = 0, smIndex = 0;
fastSquare()
function fastSquare() {
    let pt1 = [0, 0]
    let pt2 = [WiW * zoomVP, 0]
    let pt3 = [WiW * zoomVP, WiH * zoomVP]
    let pt4 = [0, WiH * zoomVP]
    let pts = [pt1, pt2, pt3, pt4];

    Body.translate(attractiveBody, {
        x: (pts[indexPt][0] - attractiveBody.position.x) * 0.02,
        y: (pts[indexPt][1] - attractiveBody.position.y) * 0.02
    })

    if (smIndex >= 130) {
        smIndex = 0;
        indexPt++;
        if (indexPt == 4) {
            indexPt = 0;
        }
    }
    smIndex++
}

function mouseCtrl() {
    //smoothly move the attractor body towards the mouse
    Body.translate(attractiveBody, {
        x: (mouse.position.x - attractiveBody.position.x) * 0.3,
        y: (mouse.position.y - attractiveBody.position.y) * 0.3
    });
}

let animReq;
animateMode()
function animateMode() {
    if (animMode == 1) {
        gravCircle()
    }
    if (animMode == 2) {
        gravEight()
    }
    if (animMode == 3) {
        fastSquare()
    }
    if (animMode == 4) {
        mouseCtrl()
    }
    animReq = requestAnimationFrame(animateMode)
}

function easeIn(from, to, ease) {
    return from + (to - from) * ease;
}

let inputs_anim_btns = document.querySelectorAll(".inputs_anim_btns")
for (const elem of inputs_anim_btns) {
    elem.addEventListener("click", (e) => { animMode = e.target.value })
}

deleteOneCapture()
function deleteOneCapture() {
    let capture = document.querySelectorAll('.p5c-container')[0]
    console.log(capture)
    capture.remove();
    reshapeCapture()
}

function reshapeCapture() {
    let lc = document.body.lastChild
    console.log(lc.tagName)
    let sibNode = document.querySelector('#capture_window').lastChild
    let capWindow = document.querySelector('#capture_window')
    if (lc.tagName == "DIV") {
        console.log(lc.classList)
        if (lc.classList.contains('p5c-container')) {
            lc.classList.remove('p5c-container')
            sibNode.after(lc)
            let recBtn = document.querySelectorAll(".p5c-btn")[0]
            recBtn.style.display = 'none'

            let newRecBtn = document.createElement('div')
            newRecBtn.id = 'recBtn'
            newRecBtn.innerHTML = 'start/stop rec'
            newRecBtn.addEventListener('click', () => {
                recBtn.click()
            })
            capWindow.appendChild(newRecBtn)
        }
    } else {
        setTimeout(() => {
            reshapeCapture()
        }, 300)
    }
}