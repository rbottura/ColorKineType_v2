class DataSet {
    constructor(name, jsondata, offsetX, offsetY) {
        this.name = name;
        this.jsondata = jsondata;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}

const ListNameFonts = ['Alphabet', 'Raleway Dots', 'Egyptienne Large', 'Garamond Italic', 'PeaceSans', 'Pilow', 'Mainz', "Destra", "Minipax", "custom"];
const ListOffsetX = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const ListOffsetY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

function getScreenCenter(){
    return 0.26 * WiW;
}

for (let i = 0; i < ListOffsetX.length; i++) {
    ListOffsetX[i] += getScreenCenter();
    ListOffsetY[i] += 50;
}

const nbrDataSets = ListNameFonts.length - 1;
let ListDataSets = [];

let currentSetValue = 1 - (1);

let dataSetIndex = 0;

loadDataSets();
function loadDataSets() {
    // for (let i = 0; i < nbrDataSets; i++) {
    let url = './data/json_data_' + (1 + dataSetIndex) + '.json';
    if (dataSetIndex < nbrDataSets) {
        fetch(url)
            .then(response => response.json())
            .then(jsondata => {
                ListDataSets.push(new DataSet(ListNameFonts[dataSetIndex], jsondata, ListOffsetX[dataSetIndex], ListOffsetY[dataSetIndex]))
                dataSetIndex++;
                loadDataSets();
            });
    } else {
        // creaParticules2(19);
        showLetter('start');
        ListDataSets.push(jsonCstSet)
    }
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

Render.run(render);

let spriteItems = document.getElementsByClassName("spriteItem");
let arrSprites = [].slice.call(spriteItems);
arrSprites.forEach(element => { element.addEventListener("click", (event) => changeSprite(event)) });

let currentLetter;
let first_loop = true;

let mainBodies = [];

let mainConz = [];

let letterSet = [mainBodies, mainConz];

let radioSets = document.getElementsByClassName("radioSets");

let caracterIndex;

// const globalOffsetX = WiW / 3;
const globalOffsetX = 0;

for (let i = 0; i < radioSets.length; i++) {
    radioSets[i].addEventListener("change", (event) => {
        if (event.target.checked) {
            currentSetValue = parseInt(event.target.value);
            caracterIndex = 0;
            creaParticules2(caracterIndex);
        }
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

let checkReload;
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

let textBalls = document.getElementById("textBalls");
let posBalls = 1;

var index_cnt = 0;

function creaParticules2(caracter) {
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
        let body = Bodies.circle(ListDataSets[currentSetValue].jsondata[caracter][point][posX] + globalOffsetX + ListDataSets[currentSetValue].offsetX, ListDataSets[currentSetValue].jsondata[caracter][point][posY] + 50 + ListDataSets[currentSetValue].offsetY, 1, {
            render: {
                fillStyle: "rgba(0,0,0,0)",
                sprite: {
                    xScale: 0.3,
                    yScale: 0.3,
                }
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
            pointA: { x: ListDataSets[currentSetValue].jsondata[caracter][point][posX] + globalOffsetX + ListDataSets[currentSetValue].offsetX, y: ListDataSets[currentSetValue].jsondata[caracter][point][posY] + 0 + ListDataSets[currentSetValue].offsetY },
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
            upadateRotation();
        }
        first_loop = false;
    }

    caracterIndex = caracter;

    currentLetter = ListDataSets[currentSetValue].jsondata[caracter];
    if (checkReload) {
        fullReload();
    }

}

function dropBalls() {
    for (var i = 0; i < conz.length; i++) {
        Matter.Composite.remove(world, conz[i]);
        letterSet[0][i].render.fillStyle = "red";
        letterSet[0][i].collisionFilter.group = -1;
        letterSet[0][i].frictionAir = 0.001;
    }
    Matter.Composite.remove(world, attractiveBody);
    engine.gravity.y = 1;
    engine.gravity.x = -0.35;
}

function upadateRotation() {
    for (let i = 0; i < letterSet[0].length; i++) {
        let AX = (letterSet[0][i].position.x / posBalls + 0);
        let AY = (letterSet[0][i].position.y / posBalls + 0);
        let angleRadian = Math.atan2(attractiveBody.position.y - AY, attractiveBody.position.x - AX);
        letterSet[0][i].angle = angleRadian + Math.PI * 0.9;
    }
    requestAnimationFrame(upadateRotation);
}

// fit the render viewport to the scene
let zoomVP = 1.0;
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: canvasWidth * zoomVP, y: canvasHeight * zoomVP }
});

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
        particleFill();
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
    }
}

function fullReload() {
    showBalls();
    scaleParticle()
    changeAirFriction()
    changeRadius()
    changeDensity()
    showConstrains()
    // showAnchors()
    changeStiffness()
    constrainLength()
}

let itemInterfaces = document.getElementsByClassName("itemInterface");
let interface_automate = document.querySelector("#interface_automate")
let htmlInterface = document.querySelector("#htmlInterface")

let interface = document.getElementById("interface");
function hideInterface() {
    // interface.style.boxShadow == "none" ? interface.style.boxShadow = "0px 0px 8px rgb(147, 147, 147)" : interface.style.boxShadow = "none";
    for (let i = 1; i < itemInterfaces.length; i++) {
        itemInterfaces[i].style.display == "none" ? itemInterfaces[i].style.display = "inline-block" : itemInterfaces[i].style.display = "none";
    }

    htmlInterface.style.display == "none" ? htmlInterface.style.display = "block" : htmlInterface.style.display = "none"
    interface_automate.style.display == "none" ? interface_automate.style.display = "block" : interface_automate.style.display = "none"
}

function setLightMode() {
    backgroundWall.render.fillStyle == "black" ? backgroundWall.render.fillStyle = "white" : backgroundWall.render.fillStyle = "black"

    attractiveBody.render.fillStyle == "rgba(255,255,255,0.1)" ? attractiveBody.render.fillStyle = "rgba(0,0,0,0.1)" : attractiveBody.render.fillStyle = "rgba(255,255,255,0.1)"

    document.body.style.backgroundColor == "black" ? document.body.style.backgroundColor = "white" : document.body.style.backgroundColor = "black";

    interface.style.color == "white" ? interface.style.color = "black" : interface.style.color = "white";
    interface.style.border == "solid white 1px" ? interface.style.border = "solid black 1px" : interface.style.border = "solid white 1px";

    htmlInterface.style.color == "white" ? htmlInterface.style.color = "black" : htmlInterface.style.color = "white";

    interface_automate.style.color == "white" ? interface_automate.style.color = "black" : interface_automate.style.color = "white";
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
        let offX = rectHandle.width / 2 + 16
        let offY = rectHandle.height / 2 + 16
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
    rotateVal += 0.02;
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





// document.querySelector("#saveImgBtn").addEventListener("click", () => {
    // console.log(document.querySelector("#render_matter").getContext("2d").filter)
    // saveCurrentSet();
// })

function saveCurrentSet() {
    console.log("caracter index : " + caracterIndex);
    console.log(ListDataSets[currentSetValue])

    let i = 0;
    
    document.querySelector("#render_matter").getContext("2d").filter = "saturate(1) contrast(3) hue-rotate(0deg) grayScale(1)"
    const renderCanvas = document.querySelector("#render_matter");

    var id = setInterval(() => {

        if (i >= ListDataSets[currentSetValue].jsondata.length) {
            clearInterval(id);
            return;
        }

        const dataURL = renderCanvas.toDataURL();

        const image = document.createElement("img");
        image.style.filter = "blur(0px) saturate(2) contrast(2) hue-rotate(0deg) grayScale(1);"
        image.src = dataURL;
        var a = document.createElement('a');
        // console.log(image)
        a.href = image.src
        a.download = i
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        i++;

        showLetter(38);

    }, 300)

}