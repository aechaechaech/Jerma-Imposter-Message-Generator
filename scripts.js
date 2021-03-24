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

const canvas = document.getElementById("sustext");
const ctx = canvas.getContext("2d");

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

function getWidth(susMsg) {
    let totalWidth = 0;

    for (const char of susMsg) {
        let x_choords;

        if (char in masterXDict) {
            x_coords = masterXDict[char]
        } else if (char in bootlegXDict) {
            x_coords = bootlegXDict[char][1]
        } else {
            continue;
        }

        totalWidth += x_coords[1] - x_coords[0];
    }

    return totalWidth;
}

setInterval( function() {  
    susMsg = susInput.value;
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

    if (unknownLetters.length > 0) {
        errorOutput.innerHTML = `Hey dumbass, default mode doesnt support ${unknownLetters}`;
    } else {
        errorOutput.innerHTML = "";
    }

    susMsg = processedMsg;

    // get and set width, this is a dumb way to do it but i cant think of a better way to do it
    let totalWidth = getWidth(susMsg);

    const newWidth = (50*totalWidth)/320;
    canvas.style.width = `${newWidth}%`;

    canvas.width = totalWidth;

    // make it
    totalWidth = 0;
    width = 0;
    let flipArr = [];
    for (const char of susMsg) {
        if (char in masterXDict) {
            x_coords = masterXDict[char]
            width = x_coords[1] - x_coords[0]

            ctx.drawImage(templateImage, x_coords[0], 0, width, canvas.height, totalWidth, 0 , width, canvas.height);
        } else if (char in bootlegXDict) {
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

        } else {
            // theoretically this should never happen, but you can never be too sure
            continue;
        }

        totalWidth += width;
    }
}, 60);

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