import {Info, Meal, MenuItem} from "./models";

import * as moment from "moment";

var canteenAlias = {
    "Mensa WUeins / Sportsbar": "Mensa WUeins",
    "BioMensa U-Boot (Bio-Code-Nummer: DE-ÖKO-021)": "BioMensa U-Boot",
    "Kantine der Landesanstalt für Landwirtschaft": "Kindertagesstätten"
};

export class Parser {

    doc;
    baseUrl: string;

    canteenName: string;
    date: Date;
    mId: number;

    constructor(doc, baseUrl: string, canteenName: string, date: Date, mId: number) {
        this.doc = doc;
        this.baseUrl = baseUrl;
        this.date = date;
        this.canteenName = canteenName;
        this.mId = mId;
    }

    parseMenu(): MenuItem[] {
        // not sure if type needs to be checked or not
        let doc = this.doc;
        let base_url = this.baseUrl;
        // console.log(doc)
        let meals: MenuItem[] = [];

        let tables = doc.getElementById('spalterechtsnebenmenue').getElementsByTagName('table');
        // console.log(tables)
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            if (table.id !== 'aktionen') {
                let dateString = table.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[0].textContent;
                if (!dateString.startsWith("Angebot")) {
                    continue
                }
                let dateJSON = parseTimeMoment(dateString);
                let rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                for (let j = 0; j < rows.length; j++) {
                    let row = rows[j];
                    let iskeinangebot = row.getElementsByClassName('keinangebot').length !== 0;
                    if (iskeinangebot) {
                        // no meals to be parsed (should)
                        // console.debug("No meals today")
                    } else {
                        let infos = row.getElementsByClassName('info');
                        if (infos.length !== 0) {
                            let info = new Info();
                            info.text = infos[0].textContent;
                            info.date = dateJSON.dateString;
                            info.dateObject = dateJSON.dateObject;
                            info.category = "information";
                            meals.push(info)
                        } else {
                            // parsing meal item starts
                            let item = row.getElementsByClassName('text')[0];
                            if (item) {
                                let meal = new Meal();
                                meal.name = item.textContent;
                                meal.text = meal.name;
                                meal.category = "food";
                                meal.date = dateJSON.dateString;
                                meal.dateObject = dateJSON.dateObject;

                                // parse urlDetail
                                let urlDetail = row.getElementsByTagName('a')[0];
                                if (urlDetail) {
                                    let url = rel2abs(base_url, urlDetail.getAttribute('href'));
                                    if (url.includes('?')) {
                                        url = url.substring(0, url.indexOf('?'))
                                    }
                                    meal.urlDetail = url
                                }

                                // parse urlImages
                                let vectorImages = ["alkohol.png", "fleischlos.png", "knoblauch.png", "rindfleisch.png", "schweinefleisch.png", "vegan.png"];
                                let json: string[] = [];
                                let urlImages = row.getElementsByClassName('stoffe')[0];
                                if (urlImages) {
                                    let a = urlImages.getElementsByTagName('a')[0];
                                    if (a) {
                                        let imgs = a.getElementsByTagName('img');
                                        for (let i = 0; i < imgs.length; i++) {
                                            let img = imgs[i];
                                            let url = rel2abs(base_url, img.getAttribute('src'));
                                            for (let i = 0; i < vectorImages.length; i++) {
                                                let vector = vectorImages[i];
                                                if (url.includes(vector)) {
                                                    url = vector;
                                                    break
                                                }
                                            }
                                            json.push(url)
                                        }
                                    }
                                }

                                meal.urlImages = json;
                                // parse price information
                                let price = row.getElementsByClassName('preise')[0];
                                if (price) {
                                    meal.price = price.textContent.replace('&euro;', '€').replace('&euro;', '€').replace('&nbsp;', '')
                                }
                                meals.push(meal)
                            }
                            // parsing meal item ends
                        }
                    }
                }
            }
        }

        return meals
    }

    parseMeal(baseMeal: Meal): Meal {
        let doc = this.doc;
        let base_url = this.baseUrl;
        let meal = baseMeal;

        // parse slot information
        let slot = doc.getElementById('speiseplandetails').getElementsByTagName('h1')[0].textContent;
        if (slot.includes('Abendangebot')) {
            meal.slot = 'Abendangebot'
        } else if (slot.includes('Sonntagsangebot')) {
            meal.slot = 'Sonntagsangebot'
        } else {
            let startIndex = slot.indexOf('Angebot');
            if (slot.includes(baseMeal.canteenName)) {
                startIndex = slot.indexOf(baseMeal.canteenName) + baseMeal.canteenName.length
            }
            let endIndex = slot.indexOf('vom');
            if (startIndex !== -1 && endIndex !== -1) {
                meal.slot = slot.substring(startIndex, endIndex).trim()
            }
        }

        // parse picture
        let urlPicture = doc.getElementById('essenfoto');
        if (urlPicture) {
            urlPicture = urlPicture.getAttribute('href');
            let url = rel2abs(base_url, urlPicture);
            if (url.includes('?')) {
                url = url.substring(0, url.indexOf('?'));
            }
            meal.urlPicture = url
        }

        // parse notes information
        let div = doc.getElementById('speiseplandetailsrechts');
        if (div) {
            let json = {};
            let h2s = div.getElementsByTagName('h2');
            let uls = div.getElementsByTagName('ul');
            for (let i = 0; i < h2s.length; i++) {
                if (uls[i]) {
                    let lis = uls[i].getElementsByTagName('li');
                    let h2 = h2s[i].textContent;
                    let list: string[] = [];
                    for (let j = 0; j < lis.length; j++) {
                        list.push(lis[j].textContent);
                    }
                    json[h2] = list;
                }
            }
            meal.notes = json;
        } else {
            meal.notes = {};
        }

        // parsing ends
        return meal;
    }

    parseToday(): object {
        let meals = {};

        let tables = this.doc.getElementById('spalterechtsnebenmenue').getElementsByTagName('table');
        // console.log(tables)
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i];
            if (table.id !== 'aktionen') {
                let canteenName = table.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[0].textContent;
                if (!canteenName.startsWith("Angebot")) {
                    continue
                }
                let canteen = canteenName.substring(8).trim();
                if (canteen in canteenAlias) {
                    canteen = canteenAlias[canteen]
                }
                let rows = table.getElementsByTagName('tbody');
                let count = 0;
                for (let j = 0; j < rows.length; j++) {
                    let row = rows[j];
                    let iskeinangebot = row.getElementsByClassName('keinangebot').length !== 0;
                    if (iskeinangebot) {
                        // no meals to be parsed (should)
                        break;
                    } else {
                        let texts = row.getElementsByClassName('text');
                        count += texts.length;
                    }
                }
                meals[canteen] = count
            }
        }
        return meals
    }
}

function parseTimeMoment(dateString) {
    moment.locale("de");
    let format = "dddd, DD. MMMM YYYY";
    let date = moment(dateString, format);
    date = date.locale("zh-cn");
    return {dateString: date.format('L'), dateObject: date}
}

function rel2abs(base: string, relative: string): string {
    if (relative.startsWith('//')) {
        return "https:" + relative
    }
    let stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
    // (omit if "base" is the current folder without trailing slash)
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}