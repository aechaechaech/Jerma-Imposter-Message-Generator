const substringsArray = [' ','!', 'a', 'b', 'c', 'd', 'e', 'h', 'i', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', '😳', '򜰀🐀', '🐀򜰀', '򜰀', '🐀', '🐀'];

let masterXDict = {
    "w": [[7,29]],
    "h": [[29,43], [83,98]],
    "e": [[43,56], [98,111], [192,205]],
    "n": [[56,69]],
    " ": [[69,75], [111,116], [213,220], [238,244]],
    "t": [[75,83], [183,192]],
    "i": [[116,122], [220,225]],
    "m": [[122,143]],
    "p": [[143,157]],
    "o": [[157,171]],
    "s": [[171,183], [225,238], [244,257], [270,283]],
    "r": [[205,213]],
    "u": [[257,270]],
    "!": [[282,289]],
    "😳": [[289,312]],
}

// [should flip over x axis, should flip over y axis], [x1, x2]
const bootlegXDict = {
    "a": [[true, false], [146, 155]],
    "q": [[true, false], [143, 155]],
    "b": [[false, true], [143, 157]],
    "d": [[true, true], [143, 157]],
    "c": [[false, false], [157,167]]
}

// the y coord where text and face meet
const yCoordSplit = 22;

let cypherMode = false;
let cheatingMode = false;
const cypherBox = document.getElementById("cypher");
const cheatBox = document.getElementById("cheating");

const canvas = document.getElementById("sustext");
const ctx = canvas.getContext("2d");

const crispTextCanvas = document.getElementById("lilstupidasstextcanvas");
const crispCtx = crispTextCanvas.getContext("2d");
crispTextCanvas.width = 30;
crispTextCanvas.height = 30;
crispCtx.textAlign = "center";
crispCtx.fillStyle = "black";
crispCtx.font = 'bold 11px Arial';
crispCtx.canvas.hidden = true;

const cypherCanvas = document.createElement('canvas');

const susInput = document.getElementById("susInput");
const errorOutput = document.getElementById("dumbassAlert");

const templateImage = new Image();   
templateImage.src = 'imposter.jpg';

templateImage.addEventListener('load', function() {
    canvas.width = templateImage.width;
    canvas.height = templateImage.height;

    canvas.style.width = "50%";

    ctx.drawImage(templateImage, 0, 0);
})

for (const property in masterXDict) {
    let rand = Math.random();
    rand *= masterXDict[property].length;
    rand = Math.floor(rand);
    
    masterXDict[property] = masterXDict[property][rand]
}

let pastData = ["", cypherMode, cheatingMode];

// a function that gets the width of the current susmsg
function getWidth(susMsg) {
    let totalWidth = 0;

    for (const char of susMsg) {
        let x_choords;

        if (char in masterXDict) {
            x_coords = masterXDict[char];
            totalWidth += x_coords[1] - x_coords[0];
        } else if (char in bootlegXDict) {
            x_coords = bootlegXDict[char][1];
            totalWidth += x_coords[1] - x_coords[0];
        } else if (cheatingMode) {
            totalWidth += crispCtx.measureText(char).width * 1.5 + 2;
        }
    }

    return totalWidth;
}

function getCharImage(char) { 
    crispCtx.fillStyle = "white";
    crispCtx.fillRect(0,0,1000,1000);

    crispCtx.fillStyle = "black";
    crispCtx.fillText(char, 3.5, 10);

    retImage = new Image();
    retImage.src = crispTextCanvas.toDataURL("image/jpeg", .5);

    return [retImage, crispCtx.measureText(char).width];
}

setInterval( function() {  
    susMsg = susInput.value;
    cheatingMode = cheatBox.checked;
    cypherMode = cypherBox.checked;

    // exit function if we dont need to update the canvas
    if (susMsg == pastData[0] && cypherMode == pastData[1] && cheatingMode == pastData[2]) {
        return;
    } else {
        pastData = [susMsg, cypherMode, cheatingMode]
        console.log("asjhdbasjd")
    }

    canvas.height = templateImage.height;

    // if theres no value there then just make it the default image
    if (!susMsg) {
        canvas.width = templateImage.width;
        canvas.height = templateImage.height;

        ctx.drawImage(templateImage, 0, 0);
        canvas.style.width = `50%`;
        errorOutput.innerHTML = "";
        return;
    }

    susMsg = susMsg.toLowerCase();
    susMsg = susMsg.split("");

    // yell at user for using bad letters
    let processedMsg = [];
    let unknownLetters = [];

    for (const char of susMsg) {
        if (substringsArray.includes(char)) {
            processedMsg.push(char);
        } else {
            unknownLetters.push(char);
        }
    }

    if (unknownLetters.length > 0 && !cheatingMode) {
        errorOutput.innerHTML = `Hey dumbass, default mode doesnt support ${unknownLetters}`;
    } else {
        errorOutput.innerHTML = "";
    }

    // get and set width, this is a dumb way to do it but i cant think of a better way to do it
    let totalWidth = getWidth(susMsg);

    const newWidth = (50*totalWidth)/320;
    canvas.style.width = `${newWidth}%`;

    canvas.width = totalWidth;

    // draw it to the canvas
    totalWidth = 0;
    width = 0;
    let flipArr = [];
    for (const char of susMsg ) {
        if (char in masterXDict) {
            // normal default characters
            x_coords = masterXDict[char]
            width = x_coords[1] - x_coords[0]

            ctx.drawImage(templateImage, x_coords[0], 0, width, canvas.height, totalWidth, 0 , width, canvas.height);
        } else if (char in bootlegXDict) {
            // drawing bootleg characters (chars that you can get to by flipping default chars)
            flipArr = bootlegXDict[char][0]
            x_coords = bootlegXDict[char][1]

            width = x_coords[1] - x_coords[0]
            
            // 1 if no flip, -1 if yes flip
            // when doing flipping like this, you gotta make shit negative for whatever god forsaken reason
            // go read the documentation man idk: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale
            flipX = 1 - (2 * flipArr[0])
            flipY = 1 - (2 * flipArr[1])

            ctx.scale(flipX, flipY);

            // draw letter
            lCanvasX = flipX * totalWidth 
            lCanvasY = 0
            lCanvasWidth = flipX * width
            lCanvasHeight = flipY * yCoordSplit
            ctx.drawImage(templateImage, x_coords[0], 0, width, yCoordSplit, lCanvasX, lCanvasY, lCanvasWidth, lCanvasHeight);

            //draw face
            fCanvasX = flipX * totalWidth 
            fCanvasY = flipY * yCoordSplit
            fCanvasWidth = flipX * width
            fCanvasHeight = flipY * canvas.height-yCoordSplit
            ctx.drawImage(templateImage, x_coords[0], yCoordSplit, width, canvas.height-yCoordSplit, fCanvasX, fCanvasY, fCanvasWidth, fCanvasHeight);

            ctx.setTransform(1, 0, 0, 1, 0, 0);

            if (char == "a") {
                ctx.fillStyle = "white";
                ctx.fillRect(totalWidth + 7, 13, 3, 3)
            }

        } else {
            // cheating mode
            if (!cheatingMode) {
                continue;
            }
            
            // draw the letter
            values = getCharImage(char);
            image = values[0];
            genWidth = values[1];
            width = genWidth*1.5 + 2;
            ctx.drawImage(image, 0, 0, width, 15, totalWidth, 0, genWidth*3, 20);

            //draw the face sliver
            randX = Math.floor(Math.random() * Math.floor(320-width));
            ctx.drawImage(templateImage, randX, yCoordSplit, width, canvas.height-yCoordSplit, totalWidth, yCoordSplit, width, canvas.height-yCoordSplit);
        }
    
        totalWidth += width;
    }

    if (cypherMode) {
        cypherCanvas.width = canvas.width;
        cypherCanvas.height = templateImage.height - yCoordSplit;

        cypherCanvas.getContext("2d").drawImage(canvas, 0, -yCoordSplit);
        
        canvas.height = cypherCanvas.height;

        ctx.drawImage(cypherCanvas, 0, 0, cypherCanvas.width, cypherCanvas.height, 0, 0, canvas.width, cypherCanvas.height);
    }
}, 100);

function show_cheating() {
	document.getElementById("options-help-cheating").style.display = "flex";
}

function hide_cheating() {
	document.getElementById("options-help-cheating").style.display = "none";
}
function show_cypher() {
	document.getElementById("options-help-cypher").style.display = "flex";
}

function hide_cypher() {
	document.getElementById("options-help-cypher").style.display = "none";
}