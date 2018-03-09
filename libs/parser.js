var canteenAlias = {
    "Mensa WUeins / Sportsbar": "Mensa WUeins",
    "BioMensa U-Boot (Bio-Code-Nummer: DE-ÖKO-021)": "BioMensa U-Boot"
}

module.exports = {
    // parse the website from the canteen's urlMeals, return incomplete meals
    parseMenu: function (doc, base_url) {
        // not sure if type needs to be checked or not
        // console.log(doc)
        var meals = []

        var tables = doc.getElementById('spalterechtsnebenmenue').getElementsByTagName('table')
        // console.log(tables)
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i]
            if (table.id != 'aktionen') {
                var dateString = table.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[0].textContent
                if (!dateString.startsWith("Angebot")) {
                    continue
                }
                var dateJSON = parseTime2(dateString)
                var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr')
                for (var j = 0; j < rows.length; j++) {
                    var row = rows[j]
                    var iskeinangebot = row.getElementsByClassName('keinangebot').length != 0
                    if (iskeinangebot) {
                        // no meals to be parsed (should)
                        // console.debug("No meals today")
                    } else {
                        var infos = row.getElementsByClassName('info')
                        if (infos.length != 0) {
                            var meal = {
                                name: infos[0].textContent,
                                date: dateJSON.dateString,
                                dateObject: dateJSON.dateObject,
                                category: 'Information',
                                slot: 'Information',
                                urlDetail: null
                            }
                            meals.push(meal)
                        } else {
                            // parsing meal item starts
                            var item = row.getElementsByClassName('text')[0]
                            if (item) {
                                var meal = {
                                    name: item.textContent,
                                    date: dateJSON.dateString,
                                    dateObject: dateJSON.dateObject,
                                }

                                // parse urlDetail
                                var urlDetail = row.getElementsByTagName('a')[0]
                                if (urlDetail) {
                                    var url = rel2abs(base_url, urlDetail.getAttribute('href'))
                                    if (url.includes('?')) {
                                        url = url.substring(0, url.indexOf('?'))
                                    }
                                    meal.urlDetail = url
                                }

                                // parse urlImages
                                let vectorImages = ["alkohol.png", "fleischlos.png", "knoblauch.png", "rindfleisch.png", "schweinefleisch.png", "vegan.png"]
                                let json = []
                                let urlImages = row.getElementsByClassName('stoffe')[0]
                                if (urlImages) {
                                    let a = urlImages.getElementsByTagName('a')[0]
                                    if (a) {
                                        let imgs = a.getElementsByTagName('img')
                                        for (let i = 0; i < imgs.length; i++) {
                                            let img = imgs[i]
                                            let url = rel2abs(base_url, img.getAttribute('src'))
                                            for (let i = 0; i < vectorImages.length; i++) {
                                                let vector = vectorImages[i]
                                                if (url.includes(vector)) {
                                                    url = vector
                                                    break
                                                }
                                            }
                                            json.push(url)
                                        }
                                    }
                                }

                                meal.urlImages = json
                                // parse price information
                                var price = row.getElementsByClassName('preise')[0]
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
    },
    // parse the website from the meal's urlDetail, return complete meal information (ideal)
    parseMeal: function (doc, base_url, base_meal) {
        var meal = base_meal

// parse slot information
        var slot = doc.getElementById('speiseplandetails').getElementsByTagName('h1')[0].textContent
        if (slot.includes('Abendangebot')) {
            meal.slot = 'Abendangebot'
        } else if (slot.includes('Sonntagsangebot')) {
            meal.slot = 'Sonntagsangebot'
        } else {
            var startIndex = slot.indexOf('Angebot')
            if (slot.includes(base_meal.canteenName)) {
                startIndex = slot.indexOf(base_meal.canteenName) + base_meal.canteenName.length
            }
            var endIndex = slot.indexOf('vom')
            if (startIndex != -1 && endIndex != -1) {
                meal.slot = slot.substring(startIndex, endIndex).trim()
            }
        }

// parse picture
        var urlPicture = doc.getElementById('essenfoto')
        if (urlPicture) {
            urlPicture = urlPicture.getAttribute('href')
            let url = rel2abs(base_url, urlPicture);
            if (url.includes('?')) {
                url = url.substring(0, url.indexOf('?'))
            }
            meal.urlPicture = url
        }

// parse notes information
        let div = doc.getElementById('speiseplandetailsrechts')
        if (div) {
            let json = {}
            let h2s = div.getElementsByTagName('h2')
            let uls = div.getElementsByTagName('ul')
            for (let i = 0; i < h2s.length; i++) {
                if (uls[i]) {
                    let lis = uls[i].getElementsByTagName('li')
                    let h2 = h2s[i].textContent
                    let list = []
                    for (let j = 0; j < lis.length; j++) {
                        list.push(lis[j].textContent)
                    }
                    json[h2] = list
                }
            }
            meal.notes = json
        } else {
            meal.notes = {}
        }

// parsing ends
        return meal
    },

    parseToday: function (doc) {
        var meals = {}

        var tables = doc.getElementById('spalterechtsnebenmenue').getElementsByTagName('table')
        // console.log(tables)
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i]
            if (table.id != 'aktionen') {
                var canteenName = table.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[0].textContent
                if (!canteenName.startsWith("Angebot")) {
                    continue
                }
                var canteen = canteenName.substring(8).trim()
                if (canteen in canteenAlias) {
                    canteen = canteenAlias[canteen]
                }
                var rows = table.getElementsByTagName('tbody')
                var count = 0
                for (var j = 0; j < rows.length; j++) {
                    var row = rows[j]
                    var iskeinangebot = row.getElementsByClassName('keinangebot').length != 0
                    if (iskeinangebot) {
                        // no meals to be parsed (should)
                        break
                    } else {
                        var texts = row.getElementsByClassName('text')
                        count += texts.length
                    }
                }
                meals[canteen] = count
            }
        }
        return meals
    },

}

function parseTime2(dateString) {
    let moment = require("moment")
    moment.locale("de");
    let format = "dddd, DD. MMMM YYYY"
    let date = moment(dateString, format)
    date = date.locale("zh-cn")
    return {dateString: date.format('L'), dateObject: date}
}

function parseTime(dateString) {
    var format = "dddd, DD. MMMM YYYY"
    var fecha = require("fecha")
    fecha.i18n = {
        dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        amPm: ['am', 'pm'],
        // D is the day of the month, function returns something like...  3rd or 11th
        DoFn: function (D) {
            return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
        }
    }
    var daysInChinese = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    var date = fecha.parse(dateString, format)
    return {
        dateString: (date.getMonth() + 1) + "月" + date.getDate() + "日" + "（" + daysInChinese[date.getDay()] + "）",
        dateObject: date
    }
}

function rel2abs(base, relative) {
    if (relative.startsWith('//')) {
        return "https:" + relative
    }
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
    // (omit if "base" is the current folder without trailing slash)
    for (var i = 0; i < parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}