
function retrieveDGSPersons() {
    //var dgsUrl = "http://www.degulesider.dk/person/resultat/"
    //    + adgangsAdresseData.vejstykke.navn + "+"
    //    + adgangsAdresseData.husnr + "+"
    //    + adgangsAdresseData.postnummer.nr;
    //    doAjax(dgsUrl);
    if (typeof adgangsAdresseData !== 'undefined') {
        var husnr = adgangsAdresseData.husnr;
        if (isNaN(husnr)) {
            husnr = husnr.substring(0, husnr.length - 1);
        }
        var dgsPageElem = dgspage > 1 ? "/" + dgspage : "";
        var dgsUrl = "http://www.degulesider.dk/person/resultat/"
            + adgangsAdresseData.vejstykke.navn.replace("'", "").split(' ').join('+') + "+"
            + husnr + "+"
            + adgangsAdresseData.postnummer.nr
            + dgsPageElem;
        var cssQuery = "div.hit-header-block-center";
        var queryUrl = "http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20data.html.cssselect%20WHERE%20url%3D'"
            + encodeURIComponent(dgsUrl)
            + "'%20AND%20css%3D'"
            + encodeURIComponent(cssQuery)
            + "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json";
        //var queryUrl = "https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20data.html.cssselect%20WHERE%20url%3D'http%3A%2F%2Fwww.degulesider.dk%2Fperson%2Fresultat%2FMoltkesvej%2B20%2B2000'%20AND%20css%3D'div.hit-header-block-center'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        //"http://query.yahooapis.com/v1/public/yql?" +
        //    "q=select%20*%20from%20html%20where%20url%3D%22" +
        //    encodeURIComponent(dgsUrl) +
        //    "%22%20AND%20css%3D%22" + cssQuery + "%22&format=xml'&callback=?";

        $.ajax({
            url: queryUrl,
            async: true,
            dataType: 'jsonp',
            beforeSend: function () {
            },
            type: "GET",
            //                        data: data,
            cache: false,
            success: getDGSPersonsSuccess,
            error: function (xhr, textStatus, errorThrown) {
            }
        });
    }
}

function addPerson(key, name) {
    if (allAddressPersons[key] == null) {
        allAddressPersons[key] = {
            dgspersons: []
        };
    }
    allAddressPersons[key].dgspersons.push(name);
    if (currentAdresseKey == key) {
        refreshPersonView();
    }
}

function refreshPersonView() {
    document.getElementById('person').innerHTML = "";
    if (allAddressPersons != null && typeof allAddressPersons[currentAdresseKey] != 'undefined') {
        var names = allAddressPersons[currentAdresseKey].dgspersons;
        document.getElementById('person').innerHTML += "<h3>Personer fra telefonbogen: </h3>"
        if (names != null && typeof names !== 'undefined') {
            for (var i = 0; i < names.length; i++) {
                document.getElementById('person').innerHTML += names[i] + "</br>";
            }
        } else {
            document.getElementById('person').innerHTML += "Ingen personer fundet på adressen.";
        }
    }
}

function writeDgsNameData(inputName) {
    var name = inputName.h2.span.a.content;
    var addr = adgangsAdresseData.vejstykke.navn + " "
        + adgangsAdresseData.husnr + ", "
        + adgangsAdresseData.postnummer.nr + " "
        + adgangsAdresseData.postnummer.navn;
    if (inputName.div != null && Object.prototype.toString.call(inputName.div) === '[object Array]' && inputName.div[0].div != null) {
        if (Object.prototype.toString.call(inputName.div[0].div) === '[object Array]') {
            addr = inputName.div[0].div[0].span.content;
        }
    } else if (inputName.div != null && inputName.div.div != null) {
        if (Object.prototype.toString.call(inputName.div.div) === '[object Array]') {
            addr = inputName.div.div[0].span.content;
        }
    } else if (inputName.div != null && inputName.div.ul != null && inputName.div.ul.li != null) {
        addr = inputName.div.ul.li.reverse()[0].span[0].content;
    }
    var key = extractKey(addr);
    if (key != "") {
        var cell = document.getElementById(key);
        if (cell != null) {
            cell.getElementsByClassName('personCount')[0].textContent++;
            addPerson(key, name);
            //            cell.innerHTML += "</br>navn: " + name;
        } // + " adresse: " + addr + "</br>";
        else {
            //document.getElementById('person').getElementsByClassName('personCount') ++;//= "</br>navn: " + name + " adresse: " + addr + " " + key;

            document.getElementById('person').innerHTML += "</br>navn: " + name + " adresse: " + addr + " " + key;
        }
    }
    else {
        //var cell = document.getElementById('000000');
        //if (cell != null) {
        //    cell.innerHTML += "</br>navn: " + name;
        //} // + " adresse: " + addr + "</br>";
        //else {
        document.getElementById('person').innerHTML += "</br>navn: " + name + " adresse: " + addr + " " + key;
        //}
        //document.getElementById('person').innerHTML += "</br>navn: " + name + " adresse: " + addr ;
    }
}

function getDGSPersonsSuccess(data) {
    if (data.query != null && data.query.results != null && data.query.results.results != null && data.query.results.results.div != null) {
        // if (data.query.results.results.div) {
        var names = data.query.results.results.div;
        if (names.length >= 25) {
            dgspage++;
            retrieveDGSPersons();
        }
        if (Object.prototype.toString.call(names) === '[object Array]') {

            for (var i = 0; i < names.length; i++) {
                writeDgsNameData(names[i]);
            }
        } else {
            writeDgsNameData(names);

        }
        //    $('a', el) // All the anchor elements
        //}
    }
}
