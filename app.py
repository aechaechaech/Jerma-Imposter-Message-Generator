from PIL import Image, ImageDraw
import random
import base64
from io import BytesIO

# this codebase is FUCKED

master_im = Image.open("imposter.jpg")
master_string = "when the imposter is sus!"
y_coord_split = 22
master_x_dict = {
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

# [should flip over x axis, should flip over y axis], [x1, x2]
bootleg_x_dict = {
    "a": [[True, False], [146, 155]],
    "q": [[True, False], [143, 155]],
    "b": [[False, True], [143, 157]],
    "d": [[True, True], [143, 157]],
    "c": [[False, False], [157,167]]
}

"""master_x_dict = {
    "w": [7,1],
    "h": [29,43],
    "e": [43,56],
    "n": [56,69],
    " ": [69,75],
    "t": [75,83],
    "h": [83,98],
    "e": [98,111],
    " ": [111,116],
    "i": [116,122],
    "m": [122,143],
    "p": [143,157],
    "o": [157,171],
    "s": [171,183],
    "t": [183,192],
    "e": [192,205],
    "r": [205,213],
    " ": [213,220],
    "i": [220,225],
    "s": [225,238],
    " ": [238,244],
    "s": [244,257],
    "u": [257,270],
    "s": [270,289],
    "!": [282,289],
    ":flushed:": [289,312]
}"""

# input_string = input("Your message here: ").lower()
# input_string = input_string.replace(":flushed:", "😳")

from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/<string:input_string>', methods=['GET'])
@cross_origin()
def get_input_string(input_string):
	new_barcode = Image.new('RGB', (len(input_string)*12, master_im.height))
	total_width = 0

	emoticon_processing = False

	for i in input_string:
		if i in master_x_dict.keys():
			x_coords = master_x_dict[i][random.randint(0, len(master_x_dict[i]) - 1)]
			scan_line = master_im.crop((x_coords[0], 0, x_coords[1], master_im.height))
			new_barcode.paste(scan_line, (total_width, 0))
			total_width += scan_line.width
		elif i in bootleg_x_dict.keys():   
			x_coords = bootleg_x_dict[i][1]
			
			letter = master_im.crop((x_coords[0], 0, x_coords[1], y_coord_split))
			face = master_im.crop((x_coords[0], y_coord_split, x_coords[1], master_im.height))

			# flip over x?
			if bootleg_x_dict[i][0][0]:
				letter = letter.transpose(Image.FLIP_LEFT_RIGHT)
				face = face.transpose(Image.FLIP_LEFT_RIGHT)

			# flip over y?
			if bootleg_x_dict[i][0][1]:
				letter = letter.transpose(Image.FLIP_TOP_BOTTOM)
				face = face.transpose(Image.FLIP_TOP_BOTTOM)

			# epic edge case
			if i == "a":
				draw = ImageDraw.Draw(letter)
				draw.rectangle([5, 13, 8, 16], fill=(255,255,255,255))
			

			scan_line = Image.new('RGB', (letter.width, letter.height + face.height))
			scan_line.paste(letter, (0, 0))
			scan_line.paste(face, (0, y_coord_split))
			new_barcode.paste(scan_line, (total_width, 0))
			total_width += scan_line.width

		else:
			print(i + ": LETTER NOT SUPPORTED")
	buffered = BytesIO()
	new_barcode.save(buffered, format="JPEG")
	img_str = base64.b64encode(buffered.getvalue())
	img_string = str(img_str)
	img_string = img_string[:-1]
	img_string = img_string[2:]
	return jsonify({'image': "data:image/jpeg;base64," + img_string})

if __name__ == "__main__":
    app.run(threaded=True, port=5000)