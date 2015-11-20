//var kmsticket = new VisStedet.Ticket(); 
var map;
var ajaxRequest;
var plotlist;
var plotlayers = [];
var marker;
var coords;
var adgangsAdresseData;
var adresseData;

function initmap() {
    // set up the map
    map = new L.Map('map');

    //// create the tile layer with correct attribution
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 1, maxZoom: 18, attribution: osmAttrib });

    //crs = new L.Proj.CRS.TMS('EPSG:25832',
    //'+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs', [120000, 5900000, 1000000, 6500000], {
    //    resolutions: [1638.4, 819.2, 409.6, 204.8, 102.4, 51.2, 25.6, 12.8, 6.4, 3.2, 1.6, 0.8, 0.4, 0.2, 0.1]
    //});
    //map = new L.Map('map', {
    //    crs: crs
    //});

    // start the map in South-East England
    map.setView(new L.LatLng(55.8, 12), 7);
    map.addLayer(osm);

    //    marker = L.marker([55.8, 12]);
    //    marker.addTo(map);
    //var skaermkort = L.tileLayer('http://{s}.kortforsyningen.kms.dk/topo_skaermkort?ticket=' + kmsticket + '&request=GetTile&version=1.0.0&service=WMTS&Layer=dtk_skaermkort&style=default&format=image/jpeg&TileMatrixSet=View1&TileMatrix={zoom}&TileRow={y}&TileCol={x}', {
    //    attribution: 'Geodatastyrelsen',
    //    continuousWorld: true,
    //    maxZoom: 14,
    //    zoom: function () {
    //        var zoom = map.getZoom();
    //        if (zoom < 10)
    //            return 'L0' + zoom;
    //        else
    //            return 'L' + zoom;
    //    }
    //}).addTo(map);

    map.on('click', onMapClick);
}



function onMapClick(e) {
    if (typeof marker !== 'undefined') {
        map.removeLayer(marker);
    }
    //    map.removeLayer(marker);
    coords = [e.latlng.lat, e.latlng.lng];
    var geojsonFeature = {

        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": coords
        }
    }


    L.geoJson(geojsonFeature, {

        pointToLayer: function (feature, latlng) {

            marker = L.marker(e.latlng, {

                title: "Resource Location",
                alt: "Resource Location",
                riseOnHover: true,
                draggable: true,

            }).bindPopup("<div id='adgangsadresse'></div><div id='adresser'>add</div><div id='personer'></div><div id='person'></div>", {
                minWidth: 400,
                maxWidth: 400
            });

            marker.on("popupopen", onPopupOpen);

            return marker;
        }
    }).addTo(map);
    marker.openPopup();
}

function onPopupOpen() {
    if (typeof coords !== 'undefined') {
        retrieveAdgangsAdresse();
    }
}

function retrieveAdgangsAdresse() {
    url = "http://dawa.aws.dk/adgangsadresser/reverse?x=" + coords[1] + "&y=" + coords[0];
    //document.getElementById('foo').innerHTML = "<a href='" + url + "'>" + url + "</a>";

    $.ajax({
        url: url,
        async: true,
        dataType: 'json',
        beforeSend: function () {
        },
        type: "GET",
        //            data: data,
        cache: false,
        success: getAdgangsAdresseSuccess,
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}

function getAdgangsAdresseSuccess(data) {
    adgangsAdresseData = data;
    updateAdgangsAdresseHtml();
    moveMarker();
    retrieveAdresser();
    retrieveTinglysningAdresser();
}

function retrieveTinglysningAdresser() {
    var url = "http://www.tinglysning.dk/rest/soeg/" + adgangsAdresseData.vejstykke.navn + " "
        + adgangsAdresseData.husnr + " "
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
        }
    });
}

function getTinglysningAdresserSuccess(data) {
    var adresser = data.items;

    for (var i = 0; i < adresser.length; i++) {
        var adresse = adresser[i];
        var bog;
        if (adresse.bog == "Tingbog") {
            bog = "ejendomme";
        }
        if (adresse.bog == "Andelsboligbog") {
            bog = "andelsbolig";
        }
        // https://www.tinglysning.dk/m/#/ejendomme/efc6c23a-e426-4eb0-9586-081a82f507f1
        // https://www.tinglysning.dk/m/#/ejendom/efc6c23a-e426-4eb0-9586-081a82f507f1
        //        https://www.tinglysning.dk/m/#/andelsbolig/60465dca-fd93-4139-bc30-b56db12f670a
        var url = "https://www.tinglysning.dk/m/#/" + bog + "/" + adresse.uuid;
        document.getElementById('personer').innerHTML += "<a href='" + url + "'>" + adresse.adresse + "</a> </br>";
    }
    document.getElementById('personer').innerHTML += JSON.stringify(data, null, 2);

}

function updateAdgangsAdresseHtml() {
    var dgsLink = "<a href='http://www.degulesider.dk/person/resultat/"
        + adgangsAdresseData.vejstykke.navn + "+"
        + adgangsAdresseData.husnr + "+"
        + adgangsAdresseData.postnummer.nr + "'>dgs</a></br>";
    document.getElementById('adgangsadresse').innerHTML = "<h1>"
        + adgangsAdresseData.vejstykke.navn + " "
        + adgangsAdresseData.husnr + ", "
        + adgangsAdresseData.postnummer.nr + " "
        + adgangsAdresseData.postnummer.navn + "</h1>"+dgsLink;
    //http://www.degulesider.dk/person/resultat/moltkesvej+34+2000
    //document.getElementById('adgangsadresse').innerHTML += dgsLink;

}

function retrieveAdresser() {
    if (typeof adgangsAdresseData !== 'undefined') {
        url = "http://dawa.aws.dk/adresser?adgangsadresseid=" + adgangsAdresseData.id;
        $.ajax({
            url: url,
            async: true,
            dataType: 'json',
            beforeSend: function () {
            },
            type: "GET",
            //            data: data,
            cache: false,
            success: getAdresserSuccess,
            error: function (xhr, textStatus, errorThrown) {
            }
        });
    }
}

function getAdresserSuccess(data) {
    adresseData = data;
    updateAdresseHtml();
}

function updateAdresseHtml() {
    document.getElementById('adresser').innerHTML = "adresser: " + adresseData.length + "</br>";
    var adresseDatalength = adresseData.length;
    if (adresseDatalength > 1) {
        var adresseArray = [];
        for (var i = 0; i < adresseDatalength; i++) {
            var indexAdd = adresseArray[adresseData[i].etage];
            if (typeof indexAdd == 'undefined') {
                adresseArray[adresseData[i].etage] = [];
            }
            adresseArray[adresseData[i].etage].push(adresseData[i]);
        }
        for (var j = 0; j <= 40; j++) {
            var key = "" + j;
            if (j == 0)
                key = 'st';
            var indexAddArr = adresseArray[key];
            if (typeof indexAddArr != 'undefined') {
                var disseAdresser = adresseArray[key];
                document.getElementById('adresser').innerHTML += key + ": ";
                for (var k = 0; k < disseAdresser.length; k++) {
                    document.getElementById('adresser').innerHTML += " " + disseAdresser[k].dør;
                }
                document.getElementById('adresser').innerHTML += "</br>";
            }
        }
    }
}

function moveMarker() {
    if (typeof adgangsAdresseData !== 'undefined') {

        var lat = adgangsAdresseData.adgangspunkt.koordinater[1];
        var lng = adgangsAdresseData.adgangspunkt.koordinater[0];
        var newLatLng = new L.LatLng(lat, lng);
        marker.setLatLng(newLatLng);
        map.setView(newLatLng, 17, { animate: true });
    }
}

function compareAdresses(a, b) {
    return compareFloor(a.etage, b.etage);
}
function compareFloor(a, b) {
    if (a == null || a === '')
        return -1;
    if (b == null || b === '')
        return 1;
    if (a == b)
        return 0;
    if (a[0] == b[0] && a[1] == b[1])
        return a > b;
    if (stringStartsWith(a, 'kl'))
        return -1;
    if (stringStartsWith(b, 'kl'))
        return 1;
    if (stringStartsWith(a, 'st'))
        return -1;
    if (stringStartsWith(b, 'st'))
        return 1;
    return a > b;
}
function compareDoorNumber(a, b) {

}

function stringStartsWith(string, prefix) {
    if (prefix.length <= string.length) {
        for (var p = 0; p < prefix.length; p++) {
            if (prefix[p] != string[p])
                return false;
        }
        return true;
    }
    return false;
}