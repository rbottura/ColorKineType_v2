// Fonction p5 pour passer la grille, creer l'image, passer l'image dans opencv

let data13 = [[[0,0]]]
let jsondata13 = new DataSet("custom", data13, 0, 0);

let images = [], previewImage;

function onOpenCvReady() {

    document.querySelector('#imagesInputs').addEventListener('change', function () {

        images = [];

        for (let i = 0; i < this.files.length; i++) {

            const file = this.files[i];
            if (!file.type.match('image.*')) continue;
            const reader = new FileReader();
            reader.onload = function (event) {
                const imgElement = document.createElement('img');
                imgElement.src = event.target.result;
                images.push(imgElement);
            };
            reader.readAsDataURL(file);
        }
    }, false);

    document.querySelector("#btn_count_dots").addEventListener("click", (e) => {
        
        const reader = new FileReader();
        reader.onload = (e) => {
            
            const currentImg = document.createElement("img")
            currentImg.src = e.target.result;
            images.push(currentImg)
            processImages("preview");
        }
        document.querySelector("#defaultCanvas0").toBlob((blob) => {
            reader.readAsDataURL(blob);
        });
    })
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

            console.log(data)

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
    Promise.all(promises).then(() => {
        console.log(jsondata)
        if (method == "preview") {
            const output = document.querySelector("#op_nbr_dots");
            output.innerHTML = " "+countDots;
            images = [];
            // document.querySelector("#op_data").innerHTML = jsondata[0];
            if(jsondata.length != 0){
                data13.push(jsondata[0]);
                jsondata = [];
                createNewDotCharacter(data13)
            }

        } else {
            const output = document.getElementById('output');
            // output.innerHTML = `Found ${JSON.stringify(data)} white blobs in ${images.length}`
            output.innerHTML = `Found ${JSON.stringify(jsondata)} white blobs in ${images.length}`
        }
    })
}

function createNewDotCharacter(data){
    jsondata13.jsondata = data;
}