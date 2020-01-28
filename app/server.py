"""
Tsun Ting (James) Wong - tw2686
COMS 4170: User Interface Design
Homework 12
"""

from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from database import videos
app = Flask(__name__)


current_id = 2


loop_saves = [{}] * current_id
loop_saves[0] = {
    'Id': 1,
    'L1': (60, 73),
    'L2': (108, 121),
    'L3': (135, 147)
}


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/add_item')
def add_item():
    return render_template('add_item.html', videos=videos)


@app.route('/save_video', methods=['GET', 'POST'])
def save_video():
    global videos, current_id

    json_data = request.get_json()
    name = json_data["Name"]
    url = json_data["URL"]
    artist = json_data["Artist"]
    tuning = json_data["Tuning"]

    current_id += 1
    new_id = current_id
    new_video = {
        "Id": current_id,
        "Name": name,
        "URL": url,
        "Artist": artist,
        "Tuning": tuning,
        "TimeSpent": 0
    }

    videos.append(new_video)
    loop_saves.append({})

    return jsonify(videos=videos)


@app.route('/search')
def search(input=None):
    input = request.args.get('lookup')
    return render_template('search.html', videos=videos, input=input)


@app.route('/practice')
@app.route('/practice/<int:vid_id>')
def practice(vid_id=None):
    if not vid_id:
        return render_template('practice.html', videos=videos, video=videos[0], vid_loops=loop_saves[0])
    try:
        loop_records = loop_saves[vid_id - 1]
        return render_template('practice.html', videos=videos, video=videos[vid_id - 1], vid_loops=loop_records)
    except:
        return render_template('practice.html', videos=videos, video=videos[vid_id - 1], vid_loops=None)


@app.route('/save_loop', methods=['GET', 'POST'])
@app.route('/practice/save_loop', methods=['GET', 'POST'])
def save_loop():
    global loop_saves

    json_data = request.get_json()
    id = json_data["Id"]
    vid_loops = {}
    for k, v in json_data.items():
        vid_loops[k] = v
    loop_saves[id - 1] = vid_loops

    return jsonify(new_vid_loops=loop_saves[id - 1])


@app.route('/del_loop', methods=['GET', 'POST'])
@app.route('/practice/del_loop', methods=['GET', 'POST'])
def del_loop():
    global loop_saves

    json_data = request.get_json()
    id = json_data["vid_id"]
    loop_id = json_data["loop_id"]

    video = loop_saves[id - 1]
    if loop_id in video:
        del video[loop_id]
    loop_saves[id - 1] = video

    return jsonify(new_vid_loops=loop_saves[id - 1])


@app.route('/record')
def record():
    return render_template('record.html')


@app.route('/progress')
def progress():
    global videos
    return render_template('progress.html', videos=videos)


@app.route('/save_time', methods=['GET', 'POST'])
@app.route('/practice/save_time', methods=['GET', 'POST'])
def save_time():
    global videos

    json_data = request.get_json()
    vid_id = json_data["Id"]
    newtime = json_data["TimeSpent"]
    updateVid = videos[vid_id - 1]
    updateVid['TimeSpent'] = newtime
    videos[vid_id - 1] = updateVid
    return jsonify(videos=videos)


if __name__ == '__main__':
    app.run(debug=True)
