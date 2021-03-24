// the y coordinate for where the text and the face split
const YCoordSplit = 22

const substringsArray = [' ','!', 'a', 'b', 'c', 'd', 'e', 'h', 'i', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', '😳', '򜰀🐀', '🐀򜰀', '򜰀', '🐀', '🐀'];

const masterXDict = {
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

//drawImage(image,
//    sx, sy, sw, sh,
//    dx, dy, dw, dh);

const canvas = document.getElementById("sustext");
const ctx = canvas.getContext("2d");

let currentMugshot = new Image();

const templateImage = new Image();   
templateImage.src = 'imposter.jpg';

templateImage.addEventListener('load', function() {
    canvas.width = templateImage.width;
    canvas.height = templateImage.height;

    maxDiscWidth = canvas.width * 0.89;

    ctx.drawImage(templateImage, 0, 0);
})


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