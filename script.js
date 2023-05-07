// matter viewport at 1.0 zoom

const WiW = window.innerWidth, WiH = window.innerHeight;

const canvasWidth = WiW, canvasHeight = WiH;

// | datasets | physiques et aspect des particules et liens + bck | viewPort zoom and move | animation attractor | canvas filtering |

// passage du text en input et calcul des tailles pour p5

let input_text = document.querySelector("#input_text")
let output_text = document.querySelector("#output_infos")

let p5text = "Custom txt";
let fs = 250, lh = 50, mt = 250, indexTxtStyle = 0, ft_families = [], ft_family = "Garamond", last_ft_family = "Garamond";


input_text.addEventListener("change", (e) => {
    p5text = e.target.value;
})

document.querySelectorAll("#fs_range, #op_val_fs").forEach(elem => {
    elem.addEventListener("change", (e) => {
        fs = parseInt(e.target.value)
        document.querySelector("#op_val_fs").value = e.target.value;
    })
})

document.querySelectorAll("#lh_range, #op_val_lh").forEach(elem => {
    elem.addEventListener("change", (e) => {
        lh = parseInt(e.target.value)
        document.querySelector("#op_val_lh").value = e.target.value;
    })
})

document.querySelectorAll("#mt_range, #op_val_mt").forEach(elem => {
    elem.addEventListener("change", (e) => {
        mt = parseInt(e.target.value)
        document.querySelector("#op_val_mt").value = e.target.value;
    })
})

document.querySelector("#fontfamily_menu").addEventListener("change", (e) => {
    ft_family = e.target.value;
    last_ft_family = ft_family;
})

document.querySelectorAll(".ft_style_btn").forEach((e) => {
    e.addEventListener("change", (e) => {
        indexTxtStyle = e.target.value;
    })
});

//prevent the menu to be fill or empty on focus and unfocused
document.addEventListener("click", (e) => {
    if ((document.querySelector("#fontfamily_menu").value == "") && (e.target != document.querySelector("#fontfamily_menu"))) {
        document.querySelector("#fontfamily_menu").value = last_ft_family;
    }
    if (e.target == document.querySelector("#fontfamily_menu")) {
        e.target.value = "";
    }
})

//GRID INPUTS 
let lt = 3, st = 3, rot_val = 45;

document.querySelectorAll("#lt_range, #op_val_lt").forEach(elem => {
    elem.addEventListener("change", (e) => {
        lt = parseInt(e.target.value)
        document.querySelector("#op_val_lt").value = e.target.value;
    })
})


document.querySelectorAll("#st_range, #op_val_st").forEach(elem => {
    elem.addEventListener("change", (e) => {
        st = parseInt(e.target.value)
        document.querySelector("#op_val_st").value = e.target.value;
    })
})


document.querySelectorAll("#rot_range, #op_val_rot").forEach(elem => {
    elem.addEventListener("change", (e) => {
        rot_val = parseInt(e.target.value)
        document.querySelector("#op_val_rot").value = e.target.value;
    })
})


// put grid
// Use of P5 instanced mode to be abale to target a specific canvas container
const s = p => {

    let myGrid;
    let showGrid = true;
    let sizeX = 4, spaceX = 4, sizeY = sizeX, spaceY = spaceX, colorX = 'white', colorY = 'white';

    let textStyle = [p.NORMAL, p.ITALIC, p.BOLD, p.BOLDITALIC]

    p.setup = function () {
        p.createCanvas(canvasWidth, canvasHeight);
        p.pixelDensity(1);
        p.angleMode(p.DEGREES)
        let offsetGrid = 450;

        class dotGrid {
            constructor(sizeX, spaceX, sizeY, spaceY, colorX, colorY) {

                this.sizeX = sizeX;
                this.sizeY = sizeY;

                this.spaceX = spaceX;
                this.spaceY = spaceY;

                this.colorX = colorX;
                this.colorY = colorY;

                this.gridH = canvasHeight + offsetGrid;
                this.gridW = canvasWidth + offsetGrid;

                this.grid = WiH;

                //rows
                this.nbrLinesH = this.gridH / (this.sizeY + this.spaceY);

                //cols
                this.nbrLinesW = this.gridW / (this.sizeX + this.spaceX);

                this.nbrLines = this.grid / (this.width + this.space);
            }
            update() {
                this.nbrLinesH = this.gridH / (this.sizeY + this.spaceY);
                this.nbrLinesW = this.gridW / (this.sizeX + this.spaceX);
            }
            show() {
                //rows 
                p.push()
                for (let i = -offsetGrid; i < this.nbrLinesH; i++) {
                    p.stroke(p.color(this.colorY));
                    p.strokeWeight(this.sizeY);
                    p.line(-offsetGrid, i * (this.sizeY + this.spaceY), this.gridW, i * (this.sizeY + this.spaceY));
                }

                //cols
                for (let i = -offsetGrid; i < this.nbrLinesW; i++) {
                    p.stroke(p.color(this.colorX))
                    p.strokeWeight(this.sizeX);
                    p.line(i * (this.sizeX + this.spaceX), -offsetGrid, i * (this.sizeX + this.spaceX), this.gridH);
                }
                p.pop()
            }
        }
        myGrid = new dotGrid(sizeX, spaceX, sizeY, spaceY, colorX, colorY)
    };

    //PAUSE the draw loop for better performances
    document.querySelectorAll("#matter_disp_btn, #p5_disp_btn").forEach(elem => {
        elem.addEventListener("click", (e) => {
            if (displayLayer(e.target, "p5")) {
                console.log("PLAYYYYY")
                console.log(e.target)
            } else {
                console.log("STOOOOP")
                console.log(e.target)
            }
        })
    })

    p.draw = function () {

        myGrid.sizeX = lt;
        myGrid.sizeY = lt;

        myGrid.spaceX = st;
        myGrid.spaceY = st;

        myGrid.update()

        p.textFont(ft_family);
        p.textAlign(p.CENTER);
        p.background(255);
        p.textLeading(lh)
        p.textWrap(p.CHAR)
        p.textSize(fs)
        p.textStyle(textStyle[indexTxtStyle])
        p.text(p5text, canvasWidth / 2, fs - (fs / 4) + mt)

        if (showGrid) {
            p.translate(canvasWidth / 2, canvasHeight / 2)
            p.push()
            p.rotate(rot_val)
            p.translate(-canvasWidth / 2, -canvasHeight / 2)
            myGrid.show()
            p.pop()
        }
    };
};

new p5(s, P5_container); // invoke p5

let P5_container_elem = document.querySelector("#P5_container");
let p5canvas_loadingScreen = document.querySelector("#p5canvas_loadingScreen");

waitCanvas(false);
function waitCanvas(load) {
    if (!load) {
        if (P5_container_elem.children.length != 0) {
            waitCanvas(true);
            p5canvas_loadingScreen.style.display = "none";
        } else {
            console.log("not laoded")
            setTimeout(() => { waitCanvas(false) }, 250)
        }
        // if(P5_container_elem.children)
    } else {
        console.log("canvas loaded")
    }
}

//

let ui_overlay = document.querySelectorAll(".ui_overlay");
ui_overlay.forEach((e) => {
    e.addEventListener("click", (e) => {
        displayLayer(e.target)
    })
})

function displayLayer(node, loop) {
    const layerP5 = document.querySelector("#p5_setup_wrapper");
    const layerMt = document.querySelector("#render_matter");
    const layerRy = document.querySelector("#rythme_setup_wrapper");
    let currentDisp;
    if (loop == "p5") {
        if (currentDisp == "P5") {
            cancelAnimationFrame(animReq)
            return true
        } else if (currentDisp == "MT" || currentDisp == "RY") {
            animateMode()
            return false
        }
    } else {
        console.log(node.classList[2])
        if (node.id == "p5_disp_btn") {
            if (node.classList.contains("activ_display")) {
                node.classList.remove("activ_display");
                layerP5.style.display = "none";
                currentDisp = "MT";
            } else {
                if (ui_overlay[2].classList.contains("activ_display")) {
                    ui_overlay[2].classList.remove("activ_display");
                    layerRy.style.display = "none";
                }
                node.classList.add("activ_display");
                layerP5.style.display = "block";
                currentDisp = "P5";
            }
        } else if (node.id == "ry_disp_btn") {
            if (node.classList.contains("activ_display")) {
                node.classList.remove("activ_display");
                layerRy.style.display = "none";
                currentDisp = "MT"
            } else {
                if (ui_overlay[0].classList.contains("activ_display")) {
                    ui_overlay[0].classList.remove("activ_display");
                    layerP5.style.display = "none";
                }
                node.classList.add("activ_display");
                layerRy.style.display = "block";
                currentDisp = "RY"
            }
        } else if (node.id == "matter_disp_btn") {
            ui_overlay.forEach((e) => {
                // console.log(e)
                if (e.classList.contains("activ_display")) {
                    e.classList.remove("activ_display")
                    layerP5.style.display = "none";
                    layerRy.style.display = "none";
                    currentDisp = "MT"
                }
            })
        }
    }
}

let parameters_btns = document.querySelectorAll(".toggle_parameters");
parameters_btns.forEach((e) => {
    e.addEventListener("click", (e) => {
        showParameters(e.target)
    })
})

function showParameters(node) {
    const parametersNodes = document.querySelectorAll(".parameters");
    const matterParam = parametersNodes[0];
    const p5Param = parametersNodes[1];
    const rythmeParam = parametersNodes[2];
    if (node.id == "p5_param") {
        if (node.classList.contains("activ_parameters")) {
            node.classList.remove("activ_parameters");
            p5Param.style.display = "none";
        } else {
            node.classList.add("activ_parameters");
            p5Param.style.display = "block";
        }
    } else if (node.id == "matter_param") {
        if (node.classList.contains("activ_parameters")) {
            node.classList.remove("activ_parameters");
            matterParam.style.display = "none";
        } else {
            node.classList.add("activ_parameters");
            matterParam.style.display = "flex";
        }
    } else if (node.id == "rythme_param") {

    }
}
