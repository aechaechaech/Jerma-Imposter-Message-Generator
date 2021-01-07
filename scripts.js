var substringsArray = [' ','!', 'a', 'b', 'c', 'd', 'e', 'h', 'i', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', '😳', '򜰀🐀', '🐀򜰀', '򜰀', '🐀', '🐀'];

function search() {
	if(document.getElementById('usernameInput').value.length > 0 && document.getElementById('usernameInput').value.slice(-2) != '😳')
	{
		if(substringsArray.some(substring=>document.getElementById('usernameInput').value.slice(-1).includes(substring)))
		{
			document.getElementById("imposter").style.opacity = "0";
			// userAction(document.getElementById('usernameInput').value);
			// console.log("valid jerma venus");
			// break;
		} else {
			console.log("invalid monkuh ess" + document.getElementById('usernameInput').value.slice(-1))
			document.getElementById("error-message").innerHTML = "Ooops! " + document.getElementById('usernameInput').value.slice(-1) + " is not a valid character.";
			document.getElementById('usernameInput').value = document.getElementById('usernameInput').value.substring(0, document.getElementById('usernameInput').value.length - 1);
			document.getElementById("error-message").style.opacity = "1";
			setTimeout(function(){ 
				document.getElementById("error-message").style.opacity = "0";
			}, 1000);
		}
	}
}

/*
    Source: http://jsfiddle.net/ruisoftware/ddZfV/7/
    Updated by: Mohammad M. AlBanna
    Website: MBanna.info 
    Facebook: FB.com/MBanna.info
*/

//-----------------------------------------//
function removeImageBlanks(imageObject) {
    imgWidth = imageObject.width;
    imgHeight = imageObject.height;
    var canvas = document.createElement('canvas');
    canvas.setAttribute("width", imgWidth);
    canvas.setAttribute("height", imgHeight);
    var context = canvas.getContext('2d');
    context.drawImage(imageObject, 0, 0);

    var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
        data = imageData.data,
        getRBG = function(x, y) {
            var offset = imgWidth * y + x;
            return {
                red:     data[offset * 4],
                green:   data[offset * 4 + 1],
                blue:    data[offset * 4 + 2],
                opacity: data[offset * 4 + 3]
            };
        },
        isWhite = function (rgb) {
            // many images contain noise, as the white is not a pure #fff white
            return rgb.red < 10 && rgb.green < 10 && rgb.blue < 10;
        },
                scanY = function (fromTop) {
        var offset = fromTop ? 1 : -1;

        // loop through each row
        for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

            // loop through each column
            for(var x = 0; x < imgWidth; x++) {
                var rgb = getRBG(x, y);
                if (!isWhite(rgb)) {
                    if (fromTop) {
                        return y;
                    } else {
                        return Math.min(y + 1, imgHeight);
                    }
                }
            }
        }
        return null; // all image is white
    },
    scanX = function (fromLeft) {
        var offset = fromLeft? 1 : -1;

        // loop through each column
        for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

            // loop through each row
            for(var y = 0; y < imgHeight; y++) {
                var rgb = getRBG(x, y);
                if (!isWhite(rgb)) {
                    if (fromLeft) {
                        return x;
                    } else {
                        return Math.min(x + 1, imgWidth);
                    }
                }      
            }
        }
        return null; // all image is white
    };

    var cropTop = scanY(true),
        cropBottom = scanY(false),
        cropLeft = scanX(true),
        cropRight = scanX(false),
        cropWidth = cropRight - cropLeft,
        cropHeight = cropBottom - cropTop;

    canvas.setAttribute("width", cropWidth);
    canvas.setAttribute("height", cropHeight);
    // finally crop the guy
    canvas.getContext("2d").drawImage(imageObject,
        cropLeft, cropTop, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight);

    return canvas.toDataURL();
}

const userAction = async (inputText) => {
  console.log(inputText);
  const response = await fetch('https://sustext.herokuapp.com/api/' + inputText, {
	method: 'GET',
	headers: {
	  'Content-Type': 'application/json'
	}
  });
  const myJson = await response.json(); //extract JSON from the http response
  // console.log(myJson);
	var myImage = new Image();
	myImage.crossOrigin = "Anonymous";
	myImage.onload = function(){
		
		document.getElementById("imposter").src = removeImageBlanks(myImage)
	}
	myImage.src = myJson.image;
	document.getElementById("input-container-container").style.transform = "translate(0%, 15vh)";
	document.getElementById("imposter").style.display = "flex";
	setTimeout(function(){ 
		document.getElementById("imposter").style.opacity = "1";
	}, 1000);
}

// userAction("asdasdsd");
