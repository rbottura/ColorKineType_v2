// matter viewport at 1.0 zoom

const WiW = window.innerWidth, WiH = window.innerHeight;

const canvasWidth = WiW, canvasHeight = WiH;

// | datasets | physiques et aspect des particules et liens + bck | viewPort zoom and move | animation attractor | canvas filtering |

// passage du text en input et calcul des tailles pour p5

let input_text = document.querySelector("#input_text")
let output_text = document.querySelector("#output_infos")

let p5text = "Custom txt";
let fs = 250, lh = 50, mt = 250, indexTxtStyle = 0, ft_families = [], ft_family = "Garamond", last_ft_family = "Garamond";

let jsonbox = document.querySelector("#output_json")
document.addEventListener("keydown", (e) => {
    console.log(e.key)
    if (e.key == "j") {
        let allSets = JSON.stringify(sets.alphabet)
        jsonbox.innerHTML = allSets
    }
})

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
    if ((document.querySelector("#fontfamily_menu").value == "") && ((e.target != document.querySelector("#fontfamily_menu")) || e.target == document.querySelector('#gen_fontfamily_menu'))) {
        document.querySelector("#fontfamily_menu").value = last_ft_family;
        document.querySelector('#gen_fontfamily_menu').value = gen_last_ft_family
    }
    if (e.target == document.querySelector("#fontfamily_menu") || e.target == document.querySelector('#gen_fontfamily_menu')) {
        e.target.value = "";
    }
})

//GRID INPUTS 
let lt = 3, st = 3, rot_val = 45;

document.querySelector('#showgrid_chkbox').addEventListener("change", (e) => {
    console.log(e.target.checked)
    if (e.target.checked) {
        showGrid = true;
    } else {
        showGrid = false;
    }
})

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
let showGrid = true, showWordText = true;
let indexGenText = 0;

const s = p => {

    let myGrid;
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

        p.background(255);
        p.textWrap(p.CHAR)
        p.textAlign(p.CENTER);

        if (showGenContent) {
            // let gen_fs = 250, gen_mt = 100, gen_style = 0, gen_ft_family = 'Garamond',  gen_last_ft_family = "Garamond";
            
            p.textFont(gen_ft_family)
            p.textSize(gen_fs)
            p.textStyle(textStyle[gen_style])
            p.text(arrTextDataset[indexGenText], canvasWidth / 2, gen_fs - (gen_fs / 4) + gen_mt)
        } else if (showWordText) {
            p.textFont(ft_family);
            p.textLeading(lh)
            p.textSize(fs)
            p.textStyle(textStyle[indexTxtStyle])
            p.text(p5text, canvasWidth / 2, fs - (fs / 4) + mt)
        }

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

document.addEventListener('click', e => {
    console.log('x : '+e.clientX + ' & y : '+e.clientY)
})

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
        document.querySelector("#book_btn").click()
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

document.querySelector("#book_btn").addEventListener("click", () => {
    let pdf_iframe = document.querySelector("#pdf_iframe")
    console.log(pdf_iframe)
    let bookDiv = document.querySelector("#book_access");
    if (bookDiv.classList.contains("book_fold")) {
        console.log(bookDiv.classList.contains("book_fold"))
        bookDiv.classList.remove('book_fold')
    } else {
        bookDiv.classList.add('book_fold');
    }
})

let test_dataSet = {
    'i1': {
        name: "A",
        points: {
            'pt1': [24, 55],
            'pt2': [44, 85],
        }
    },
    'i2': {
        name: "B",
        points: {
            'pt1': [21, 64],
            'pt2': [87, 46],
        }
    }
}

let first_val, last_val, dataset_string = '', arrTextDataset = []
document.querySelector('#first_char_code').addEventListener('change', (e) => {
    let val = e.target.value;
    first_val = parseInt(val);
    let stgVal = String.fromCharCode(val)
    document.querySelector('#output_first_letter').innerHTML = stgVal;
    console.log(dataset_string)

    genText(first_val, last_val)
})

document.querySelector('#last_char_code').addEventListener('change', (e) => {
    let val = e.target.value;
    last_val = parseInt(val);
    let stgVal = String.fromCharCode(val)
    document.querySelector('#output_last_letter').innerHTML = stgVal;
    console.log(dataset_string)

    genText(first_val, last_val)
})

let displayGenText = true;

function genText(f_val, l_val) {
    let op = document.querySelector('#output_all_letters')
    op.innerHTML = ''
    dataset_string = ''
    arrTextDataset = []
    for (let i = f_val; i < l_val; i++) {
        op.innerHTML += String.fromCodePoint(i)
        dataset_string += String.fromCodePoint(i)
        // console.log(i)
        arrTextDataset = dataset_string.split('')
    }
}

document.querySelectorAll('.tab_button').forEach(elem => {
    elem.addEventListener('click', (e) => {
        changeInputTab(e)
    })
})

let showGenContent = false;
function changeInputTab(e) {
    let btn = e.target
    let p5GridNode = document.querySelector('#layerP5Grid')
    let currentWindow = document.querySelector('#' + btn.getAttribute('name'))
    console.log(currentWindow.children[0])
    if (!btn.classList.contains('activ_tab_p5')) {
        document.querySelectorAll('.tab_button').forEach(elem => {
            if (elem.classList.contains('activ_tab_p5')) {
                elem.classList.remove('activ_tab_p5')
            }
        })
        btn.classList.add('activ_tab_p5')
        document.querySelectorAll('.tabs_input_window').forEach(elem => {
            elem.style.display = 'none'
        })
        currentWindow.style.display = 'block';
        // move p5 grid window to the interface
        currentWindow.children[0].children[0].after(p5GridNode)
        if (btn.id == 'datasetGen_tab_btn') {
            showGenContent = true
            showWordText = false
        } else {
            showGenContent = false
            showWordText = true
        }
    }
}



document.querySelector('#nav_bar_handle').addEventListener('click', (e) => {
    let dir = e.target.innerHTML
    let handle = e.target
    let nav_bar = document.querySelector('#nav_bar_wrapper')
    if (dir == '↓') {
        nav_bar.classList.add('nav_bar_displayed')
        handle.innerHTML = '↑'
    } else if (dir == '↑') {
        nav_bar.classList.remove('nav_bar_displayed')
        handle.innerHTML = '↓'
    }
})


let gen_fs = 250, gen_mt = 100, gen_style = 0, gen_ft_family = 'Garamond',  gen_last_ft_family = "Garamond";

document.querySelectorAll('#gen_fs_range, #gen_op_val_fs').forEach(elem => {
    elem.addEventListener('change', (e) => {
        gen_fs = parseInt(e.target.value) ;
        document.querySelector('#gen_op_val_fs').value = gen_fs
    })
})

document.querySelectorAll('#gen_mt_range, #gen_op_val_mt').forEach(elem => {
    elem.addEventListener('change', (e) => {
        gen_mt = parseInt(e.target.value);
        document.querySelector('#gen_op_val_mt').value = gen_mt
    })
})

document.querySelectorAll('.gen_ft_style_btn').forEach(elem => {
    elem.addEventListener('change', (e) => {
        gen_style = e.target.value;
    })
})

document.querySelector("#gen_fontfamily_menu").addEventListener("change", (e) => {
    gen_ft_family = e.target.value;
    gen_last_ft_family = gen_ft_family;
})

document.querySelector('#indexGenTextInput').addEventListener('change', (e) => {
    indexGenText = parseInt(e.target.value)
})

function generateDataset(){
    onOpenCvReady('', true)
}

document.querySelectorAll('.tools_window_btn').forEach(elem => {
    elem.addEventListener('click', e => {
        showToolWindows(e.target, e.target.id)
    })
})

function showToolWindows(btn, id){
    let wd = document.querySelector('#'+id+'_window')
    if(btn.classList.contains('displayed_tools_window')){
        btn.classList.remove('displayed_tools_window')
        wd.style.display = 'none'
    } else {
        btn.classList.add('displayed_tools_window')
        wd.style.display = 'flex'
    }
}