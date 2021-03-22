var substringsArray = [' ','!', 'a', 'b', 'c', 'd', 'e', 'h', 'i', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', '😳', '򜰀🐀', '🐀򜰀', '򜰀', '🐀', '🐀'];

masterXDict = {
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