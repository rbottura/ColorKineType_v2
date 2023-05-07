// Fonction p5 pour passer la grille, creer l'image, passer l'image dans opencv

let cstSet = [[[0]]];
let jsonCstSet = new DataSet("custom", cstSet, 0, 0);

let images = [], previewImage;

function onOpenCvReady(method) {

    const data = document.querySelector("#defaultCanvas0");
    images.push(data)
    let prevImage = document.createElement("img")
    prevImage.classList.add("preview_image")
    prevImage.src = data.toDataURL();

    let box_prev = document.querySelector("#preview_dotted_image");
    console.log(box_prev) 
    if(box_prev.children.length == 0){
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
    const output = document.querySelector("#op_nbr_dots");
    Promise.all(promises).then(() => {
        images = [];
        if ("count") {
            output.innerHTML = " " + countDots;
        }
    })
}

function createNewDotCharacter() {
    if (jsondata.length != 0) {
        cstSet.push(jsondata[0]);
        jsondata = [];
        jsonCstSet.jsondata = cstSet;
    }
}

function showCstSet(){
    createNewDotCharacter();
    document.querySelector("#matter_disp_btn").click();
    document.querySelector("#set14").click();
    showLetter(38);
}

document.addEventListener("keydown", (e) => {
    if(e.key == "m"){
        // loadLyrics()
    }
})

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