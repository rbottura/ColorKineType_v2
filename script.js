// matter viewport at 1.0 zoom

const WiW = window.innerWidth, WiH = window.innerHeight;

// passage du text en input et calcul des tailles pour p5

let input_text = document.querySelector("#input_text")
let output_text = document.querySelector("#output_infos")

let p5text = "Custom txt";
let fs = 150, lh = 50, mt = 50, indexTxtStyle = 0, ft_families = [], ft_family = "Garamond", last_ft_family = "Garamond";


input_text.addEventListener("change", (e) => {
    p5text = e.target.value;
})

document.querySelector("#fs_range").addEventListener("change", (e) => {
    fs = parseInt(e.target.value)
    document.querySelector("#op_val_fs").innerHTML = e.target.value;
})

document.querySelector("#lh_range").addEventListener("change", (e) => {
    lh = parseInt(e.target.value)
    document.querySelector("#op_val_lh").innerHTML = e.target.value;
})

document.querySelector("#mt_range").addEventListener("change", (e) => {
    mt = parseInt(e.target.value)
    document.querySelector("#op_val_mt").innerHTML = e.target.value;
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
let lt = 4, st = 4;

document.querySelector("#lt_range").addEventListener("change", (e) => {
    lt = parseInt(e.target.value)
    document.querySelector("#op_val_lt").innerHTML = e.target.value;
})

document.querySelector("#st_range").addEventListener("change", (e) => {
    st = parseInt(e.target.value)
    document.querySelector("#op_val_st").innerHTML = e.target.value;
})



// put grid

const s = p => {

    let myGrid;
    let showGrid = true;
    let sizeX = 4, spaceX = 4, sizeY = sizeX, spaceY = spaceX, colorX = 'white', colorY = 'white';

    let textStyle = [p.NORMAL, p.ITALIC, p.BOLD, p.BOLDITALIC]

    p.setup = function () {
        p.createCanvas(WiW, WiH);

        class dotGrid {
            constructor(sizeX, spaceX, sizeY, spaceY, colorX, colorY) {

                this.sizeX = sizeX;
                this.sizeY = sizeY;

                this.spaceX = spaceX;
                this.spaceY = spaceY;

                this.colorX = colorX;
                this.colorY = colorY;

                this.gridH = WiH;
                this.gridW = WiW;

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
                for (let i = 0; i < this.nbrLinesH; i++) {
                    p.stroke(p.color(this.colorY));
                    p.strokeWeight(this.sizeY);
                    p.line(0, i * (this.sizeY + this.spaceY), this.gridW, i * (this.sizeY + this.spaceY));
                }

                //cols
                for (let i = 0; i < this.nbrLinesW; i++) {
                    p.stroke(p.color(this.colorX))
                    p.strokeWeight(this.sizeX);
                    p.line(i * (this.sizeX + this.spaceX), 0, i * (this.sizeX + this.spaceX), this.gridW);
                }
                p.pop()
            }
        }
        myGrid = new dotGrid(sizeX, spaceX, sizeY, spaceY, colorX, colorY)
    };


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
        p.text(p5text, WiW / 2, fs - (fs / 4) + mt)

        if (showGrid) {
            myGrid.show()
        }
    };
};

new p5(s, P5_container); // invoke p5

let P5_container_elem = document.querySelector("#P5_container");
let p5canvas_loadingScreen = document.querySelector("#p5canvas_loadingScreen");

waitCanvas(false);
function waitCanvas(load){
    if(!load){
        if(P5_container_elem.children.length != 0){
            waitCanvas(true);
            p5canvas_loadingScreen.style.display = "none";
        } else {
            console.log("not laoded")
            setTimeout(() => {waitCanvas(false)}, 250)
        }
        // if(P5_container_elem.children)
    } else {
        console.log("canvas loaded")
    }
}


let ui_overlay = document.querySelectorAll(".ui_overlay");
ui_overlay.forEach((e) => {
    e.addEventListener("click", (e) => {
        displayLayer(e.target)
    })
})

function displayLayer(node) {
    const layerP5 = document.querySelector("#p5_setup_wrapper");
    const layerRy = document.querySelector("#rythme_setup_wrapper");
    if (node.id == "p5_disp_btn") {
        if (node.classList.contains("activ_display")) {
            node.classList.remove("activ_display");
            layerP5.style.display = "none";
        } else {
            if (ui_overlay[2].classList.contains("activ_display")) {
                ui_overlay[2].classList.remove("activ_display");
                layerRy.style.display = "none";
            }
            node.classList.add("activ_display");
            layerP5.style.display = "block";
        }
    } else if (node.id == "ry_disp_btn") {
        if (node.classList.contains("activ_display")) {
            node.classList.remove("activ_display");
            layerRy.style.display = "none";
        } else {
            if (ui_overlay[0].classList.contains("activ_display")) {
                ui_overlay[0].classList.remove("activ_display");
                layerP5.style.display = "none";
            }
            node.classList.add("activ_display");
            layerRy.style.display = "block";
        }
    } else if (node.id == "matter_disp_btn"){
        ui_overlay.forEach((e) => {
            console.log(e)
            if(e.classList.contains("activ_display")){
                e.classList.remove("activ_display")
                layerP5.style.display = "none";
                layerRy.style.display = "none";
            }
        })
    }
}

let parameters_btns = document.querySelectorAll(".toggle_parameters");
parameters_btns.forEach((e) => {
    e.addEventListener("click", (e) => {
        displayParameters(e.target)
    })
})

function displayParameters(node){
    const parametersNodes = document.querySelectorAll(".parameters");
    const matterParam = parametersNodes[0];
    const p5Param = parametersNodes[1];
    const rythmeParam = parametersNodes[2];
    if(node.id == "p5_param"){
        if(node.classList.contains("activ_parameters")){
            node.classList.remove("activ_parameters");
            p5Param.style.display = "none";
        } else {
            node.classList.add("activ_parameters");
            p5Param.style.display = "flex";
        }
    } else if (node.id == "matter_param"){
        if(node.classList.contains("activ_parameters")){
            node.classList.remove("activ_parameters");
            matterParam.style.display = "none";
        } else {
            node.classList.add("activ_parameters");
            matterParam.style.display = "flex";
        }
    } else if (node.id == "rythme_param"){

    }
}

