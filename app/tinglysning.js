function getEtageKeyElem(key) {
    var etageElem = "";
    if (key != '000000') {
        etageElem = ([0] == '0' ? "" : key[0])
            + key[1] + " ";
    }
    return etageElem;
}

function retrieveTinglysningAdresser() {
    var etageElem = getEtageKeyElem(currentAdresseKey);
    retrieveTinglysningAdresserEtage(etageElem);
}

function retrieveTinglysningAdresserEtage(etageElem) {
    var url = "http://www.tinglysning.dk/rest/soeg/" + adgangsAdresseData.vejstykke.navn + " "
        + adgangsAdresseData.husnr + " "
        + etageElem + " "
        + adgangsAdresseData.postnummer.nr + " "
        + adgangsAdresseData.postnummer.navn;
    //    + " " + adgangsAdresseData.moltkesvej%2032%202000%20frederiksberg
    $.ajax({
        url: url,
        async: true,
        dataType: 'jsonp',
        beforeSend: function () {
        },
        type: "GET",
        //            data: data,
        cache: false,
        success: getTinglysningAdresserSuccess,
        error: function (xhr, textStatus, errorThrown) {
            //document.getElementById('personer').innerHTML += "Tinglysning failed</br>";
        }
    });
}

function getTinglysningAdresserSuccess(data) {
    var adresser = data.items;
    if (typeof adresser !== 'undefined' && adresser != null) {
        for (var i = 0; i < adresser.length; i++) {
            var adresse = adresser[i];
            var bog;
            if (adresse.bog == "Tingbog") {
                bog = "ejendom";
            }
            if (adresse.bog == "Andelsboligbog") {
                bog = "andelsbolig";
            }
            // https://www.tinglysning.dk/m/#/ejendomme/efc6c23a-e426-4eb0-9586-081a82f507f1
            // https://www.tinglysning.dk/m/#/ejendom/efc6c23a-e426-4eb0-9586-081a82f507f1
            //        https://www.tinglysning.dk/m/#/andelsbolig/60465dca-fd93-4139-bc30-b56db12f670a
            //var url = "https://www.tinglysning.dk/m/#/" + bog + "/" + adresse.uuid;
            var restUrl = "http://www.tinglysning.dk/rest/" + bog + "/" + adresse.uuid;
            var key = getKeyFromTinglysningsData(adresse);
            //document.getElementById('personer').innerHTML += "<a href='" + restUrl + "' target='_blank'>" + adresse.adresse + " " +key+"</a> </br>";
            retrieveTinglysningEjendom(restUrl);
        }
        //        document.getElementById('personer').innerHTML += JSON.stringify(data, null, 2);
    }
}

function retrieveTinglysningEjendom(url) {
    $.ajax({
        url: url,
        async: true,
        dataType: 'jsonp',
        beforeSend: function () {
        },
        type: "GET",
        //            data: data,
        cache: false,
        success: getTinglysningEjendomSuccess,
        error: function (xhr, textStatus, errorThrown) {
            //document.getElementById('personer').innerHTML += "Tinglysning failed</br>";
        }
    });
}

function getTinglysningEjendomSuccess(data) {
    if (data.statuskode == 0) {
        var adresse = data.adresse;
        key = getKeyFromTinglysningsData(data);
        document.getElementById('personer').innerHTML += key + "</br>";
        if (data.ejere != null) {
            for (var i = 0; i < data.ejere.length; i++) {
                document.getElementById('personer').innerHTML += data.ejere[i].navn + " andel: " + data.ejere[i].andel + "</br>";
            }
        }
        else if (data.haeftelser != null && data.haeftelser.length > 0) {
            if (data.haeftelser[0].kreditorer != null && data.haeftelser[0].kreditorer.length > 0) {
                for (var i = 0; i < data.haeftelser[0].kreditorer.length; i++) {
                    document.getElementById('personer').innerHTML += data.haeftelser[0].kreditorer[i] + "</br>";
                }

            }
        }
    }
}

function getKeyFromTinglysningsData(adresse) {
    if (adresse.adresse != null) {
        var adresseElem = adresse.adresse.toUpperCase();
        var baseAdresse = (adgangsAdresseData.vejstykke.navn + " "
        + adgangsAdresseData.husnr).toUpperCase();
        var basePostnrBy = (adgangsAdresseData.postnummer.nr + " "
         + adgangsAdresseData.postnummer.navn).toUpperCase();
        var suppByNavn = (adgangsAdresseData.supplerendebynavn == null) ? "" : adgangsAdresseData.supplerendebynavn.toUpperCase();
        var etageDoerPart = adresseElem.replace(baseAdresse, "").replace(suppByNavn, "").replace(basePostnrBy, "").trim().split(' ');

        var key = keyifySideDoer(etageDoerPart[0], etageDoerPart[1]);
        return key;
    }
}
