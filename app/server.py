"""
Tsun Ting (James) Wong - tw2686
COMS 4170: User Interface Design
Homework 11
"""

from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from database import brands
app = Flask(__name__)


current_id = 30


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/practice')
def practice():
    return render_template('practice.html')

@app.route('/add_item')
def add_item():
    return render_template('add_item.html', brands=brands)


@app.route('/save_item', methods=['GET', 'POST'])
def save_item():
    global brands, current_id

    json_data = request.get_json()
    name = json_data["Name"]
    logo = json_data["Logo"]
    desc = json_data["Description"]
    found = json_data["Founded"]
    industry = json_data["Industry"]
    hq = json_data["Headquarters"]
    rev = json_data["Revenue"]
    netIn = json_data["NetIncome"]
    rank = json_data["Ranking"]
    percent = json_data["Percent"]
    growth = json_data["Growth"]
    url = json_data["URL"]

    current_id += 1
    new_id = current_id
    newBrand = {
        "Id": current_id,
        "Name": name,
        "Logo": logo,
        "Description": desc,
        "Founded": found,
        "Industry": industry,
        "Headquarters": hq,
        "Revenue": rev,
        "NetIncome": netIn,
        "Ranking": rank,
        "Percent": percent,
        "Growth": growth,
        "URL": url
    }

    brands.append(newBrand)

    return jsonify(brands=brands)


@app.route('/search')
def search():
    return render_template('search.html', brands=brands, recentid=len(brands))


@app.route('/item/<item_id>')
def item(item_id):
    if not item_id:
        return render_template('item.html', brands=brands, brand=brands[0])
    return render_template('item.html', brands=brands, brand=brands[int(item_id) - 1])


if __name__ == '__main__':
    app.run(debug=True)
