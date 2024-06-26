// Fonction p5 pour passer la grille, creer l'image, passer l'image dans opencv

let cstSet = [[[]]];
let jsonCstSet = new DataSet("custom", cstSet);

let images = [], previewImage;

function onOpenCvReady(method, gen) {
    if (gen) {
        let i = 0
        let intr = setInterval(() => {
            images = []
            i++
            let data = document.querySelector('#defaultCanvas0')
            images.push(data)
            console.log(indexGenText)
            processImages('gen')
            indexGenText = i;
            if (i == arrTextDataset.length) {
                clearInterval(intr)
                newDataset()
                // console.log(images)
            }
        }, 300)
    } else {
        const data = document.querySelector("#defaultCanvas0");
        images.push(data)
        let prevImage = document.createElement("img")
        prevImage.classList.add("preview_image")
        prevImage.src = data.toDataURL();

        let box_prev = document.querySelector("#preview_dotted_image");
        console.log(box_prev)
        if (box_prev.children.length == 0) {
            box_prev.appendChild(prevImage)
        } else {
            box_prev.innerHTML = "";
            box_prev.appendChild(prevImage)
        }

        if (method == "addNoPrev") {
            processImages("save");
        } else if (method == "addPrev") {
            processImages("save");
        }

        processImages("count");
    }
}

let jsondata = [];
let countDots = 0;

function processImages(method) {
    console.log(images)

    const data = {};
    const promises = [];

    for (let i = 0; i < images.length; i++) {
        promises.push(new Promise((resolve, reject) => {
            const imgElement = images[i];

            let img = [];

            // Load the image and convert it to grayscale
            const src = cv.imread(imgElement);
            const gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

            // Apply a binary threshold to the image
            const thresholded = new cv.Mat();
            cv.threshold(gray, thresholded, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

            // Invert the black and white pixels
            const inverted = new cv.Mat();
            cv.bitwise_not(thresholded, inverted);

            // Find and count the white blobs in the image
            const contours = new cv.MatVector();
            const hierarchy = new cv.Mat();
            cv.findContours(inverted, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
            const numBlobs = contours.size();

            countDots = numBlobs;

            // Store the coordinates of the centroids of the white blobs in an array
            const centroids = [];

            for (let j = 0; j < numBlobs; j++) {
                const moments = cv.moments(contours.get(j));
                const cx = moments.m10 / moments.m00;
                const cy = moments.m01 / moments.m00;
                let pair = [cx, cy];
                if (cx && cy) {
                    img.push(pair);
                    centroids.push({ x: cx, y: cy });
                }
            }

            jsondata.push(img)

            // Store the coordinates of the centroids in the output object
            data[`image${i}`] = centroids;

            // Clean up
            src.delete();
            gray.delete();
            thresholded.delete();
            inverted.delete();
            contours.delete();
            hierarchy.delete();

            resolve();
        }));
    }

    // console.log(data)
    // Wait for all promises to resolve before writing the output to a file
    if (method == 'gen') {
        console.log('hey')
        // Promise.all(promises).then(() => {
        // images = [];
        // newDataset()
        // })
    } else {
        const output = document.querySelector("#op_nbr_dots");
        Promise.all(promises).then(() => {
            images = [];
            if ("count") {
                output.innerHTML = " " + countDots;
            }
        })
    }
}

let nbrSets = 15, setsVal = 10
function newDataset() {
    let list_datasets = document.querySelector('#list_datasets')
    console.log(list_datasets.children)
    let custom = list_datasets.children[list_datasets.children.length - 1]
    let newSet = custom.cloneNode(true)
    console.log(newSet.childNodes[3])
    newSet.childNodes[1].id = 'set' + nbrSets
    newSet.childNodes[1].value = setsVal
    newSet.childNodes[3].innerHTML = setsVal + ' (custom)'
    list_datasets.appendChild(newSet)
    let jsonCstSet = new DataSet("custom" + setsVal, jsondata, 0, 0);
    ListDataSets.push(jsonCstSet)
    nbrSets++
    setsVal++
    jsondata = []
    radioInputEvent()
}

let firstPush = true
function createNewDotCharacter() {
    if (firstPush) {
        ListDataSets[9].jsondata[0] = jsondata[0]
        jsondata = [];
        firstPush = false
    } else if (!firstPush && jsondata.length != 0) {
        cstSet.push(jsondata[0]);
        jsondata = [];
        jsonCstSet.jsondata = cstSet;
    }
}

function showCstSet() {
    createNewDotCharacter();
    document.querySelector("#matter_disp_btn").click();
    document.querySelector("#set14").click();
    showLetter(38);
}

let wordCount = 0;
function loadLyrics() {

    let newWord = input_text.innerHTML = obj[wordCount].word;
    p5text = newWord;

    console.log(document.querySelector("#btn_count_dots"))
    document.querySelector("#btn_count_dots").click()
    document.querySelector("#btn_count_dots").click()

    setTimeout(() => {
        if (cstSet.length >= wordCount + 2) {
            wordCount++;
            loadLyrics()
        }
    }, 220);
}