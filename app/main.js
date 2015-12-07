//var kmsticket = new VisStedet.Ticket(); 
var map;
var ajaxRequest;
var plotlist;
var plotlayers = [];
var marker;
var coords;
var adgangsAdresseData;
var adresseData;
var dgspage;
var allAddressPersons = [];
var currentAdresseKey = "000000";

function initmap() {
    // set up the map
    map = new L.Map('map');

    //// create the tile layer with correct attribution
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, { minZoom: 1, maxZoom: 19, attribution: osmAttrib });

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

            });
            //    .bindPopup("<div id='adgangsadresse'></div><div id='adresser'>add</div><div id='personer'></div><div id='person'></div>", {
            //    minWidth: 400,
            //    //                maxWidth: 400
            //});

            //            marker.on("popupopen", onPopupOpen);
            onPopupOpen();
            return marker;
        }
    }).addTo(map);
    marker.openPopup();
}

function onPopupOpen() {
    var divs = "<div id='adgangsadresse'></div><div id='adresser'></div><div id='personer'></div><div id='person'>";
    document.getElementById('content').innerHTML = divs;
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
    dgspage = 1;
    currentAdresseKey = "000000";
    allAddressPersons = [];
    retrieveDGSPersons();
}

function updateAdgangsAdresseHtml() {

    var dgsUrl = "<a href='http://www.degulesider.dk/person/resultat/"
        + adgangsAdresseData.vejstykke.navn + "+"
        + adgangsAdresseData.husnr + "+"
        + adgangsAdresseData.postnummer.nr + "'>dgs</a></br>";

    document.getElementById('adgangsadresse').innerHTML = "<h1>"
        + adgangsAdresseData.vejstykke.navn + " "
        + adgangsAdresseData.husnr + "</br>"
        + adgangsAdresseData.postnummer.nr + " "
        + adgangsAdresseData.postnummer.navn + "</h1>"
    //    document.getElementById('adgangsadresse').innerHTML += dgsUrl;
    //http://www.degulesider.dk/person/resultat/moltkesvej+34+2000
    //document.getElementById('adgangsadresse').innerHTML += dgsLink;

}

function extractKey(addr) {
    var targetAddr = adgangsAdresseData.vejstykke.navn + " "
        + adgangsAdresseData.husnr;
    var splitAddr = addr.replace(/(\r\n|\n|\r)/gm, "").split(',');
    if (splitAddr[0].trim() == targetAddr.trim() && splitAddr[1] != null) {
        var splitSideDoer = splitAddr[1].replace(/\s/g, '').split('.');
        var key = keyifySideDoer(splitSideDoer[0], splitSideDoer[1]);
        return key;
    } else if (splitAddr[0].trim() == targetAddr.trim()) {
        return "000000";
    }
    return "";
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
function adresseTableCellClick(td) {
    currentAdresseKey = td.id;
    //retrieveTinglysningAdresser();
    refreshPersonView();
}

function addAdressElements(td) {
    var spanPersonCount = document.createElement("span");
    spanPersonCount.className = "personCount";
    spanPersonCount.className += " adressElement";
    spanPersonCount.innerHTML = "0";
    td.appendChild(spanPersonCount);

    var spanPersonText = document.createElement("span");
    spanPersonText.className = "personText";
    spanPersonText.className += " adressElement";
    spanPersonText.innerHTML = " personer" + "</br>";
    td.appendChild(spanPersonText);

    var spanCompanyCount = document.createElement("span");
    spanCompanyCount.className = "companyCount";
    spanCompanyCount.className += " adressElement";
    spanCompanyCount.innerHTML = "0";
    td.appendChild(spanCompanyCount);

    var spanCompanyText = document.createElement("span");
    spanCompanyText.className = "companyText";
    spanCompanyText.className += " adressElement";
    spanCompanyText.innerHTML = " firmaer";
    td.appendChild(spanCompanyText);

}

function updateAdresseHtml() {
    var insertDiv = document.getElementById('adresser');// = "adresser: " + adresseData.length + "</br>";
    var tbl = document.createElement('table');
    tbl.className = "buildingTable";
    tbl.style.border = '1px solid black';

    var adresseDatalength = adresseData.length;
    if (adresseDatalength == 1) {
        var tr = tbl.insertRow();
        var td = tr.insertCell();
        td.id = "000000";
        td.appendChild(document.createTextNode("    "));
        td.style.border = '1px solid black';
        td.onclick = function () { adresseTableCellClick(this); }
        addAdressElements(td);
        retrieveTinglysningAdresser();
    }

    if (adresseDatalength > 1) {
        var adresseArray = [];
        for (var i = 0; i < adresseDatalength; i++) {
            var indexAdd = adresseArray[adresseData[i].etage];
            if (typeof indexAdd == 'undefined') {
                adresseArray[adresseData[i].etage] = [];
            }
            adresseArray[adresseData[i].etage][adresseData[i].dør] = adresseData[i];
        }
        var doerTyper = [];
        for (var j = 40; j >= 0; j--) {
            var key = "" + j;
            if (j == 0)
                key = 'st';
            var indexEtageArr = adresseArray[key];
            if (typeof indexEtageArr != 'undefined') {
                var etageAdresser = adresseArray[key];
                for (var etageAdresse in etageAdresser) {
                    if (doerTyper.indexOf(etageAdresse) < 0) {
                        doerTyper.push(etageAdresse);
                    }
                }
            }
        }
        //for (var dt = 0; dt < doerTyper.length; dt++) {
        //    document.getElementById('personer').innerHTML += doerTyper[dt]+" ";
        //}
        doerTyper.sort(doerSorter);
        console.log(doerTyper);
        //        document.getElementById('personer').innerHTML += "</br>";
        for (var j = 40; j >= 0; j--) {
            var key = "" + j;
            if (j == 0)
                key = 'st';
            var indexAddArr = adresseArray[key];
            if (typeof indexAddArr != 'undefined') {
                var tr = tbl.insertRow();

                retrieveTinglysningAdresserEtage(key);

                var disseAdresser = adresseArray[key];
                for (var k = 0; k < doerTyper.length; k++) {
                    var doerKey = doerTyper[k];
                    var indexDoerArr = disseAdresser[doerKey];
                    if (typeof indexDoerArr != 'undefined') {
                        var td = tr.insertCell();
                        td.id = keyifySideDoer(key, disseAdresser[doerKey].dør);
                        var doer = disseAdresser[doerKey].dør != null ? disseAdresser[doerKey].dør : "";

                        var spanHeader = document.createElement("span");
                        spanHeader.className = "adresseElementHeader";
                        spanHeader.innerHTML = key + ". " + doer + "</br>";

                        td.appendChild(spanHeader);

                        addAdressElements(td);

                        td.style.border = '1px solid black';
                        td.onclick = function () { adresseTableCellClick(this); }
                    }
                }
            }
        }
    }
    insertDiv.appendChild(tbl);
}

function doerSorter(a, b) {
    if (a == null)
        return -1;
    if (b == null)
        return 1;
    if (a == 'null')
        return -1;
    if (b == 'null')
        return 1;
    var nameA = a.toLowerCase(), nameB = b.toLowerCase();
    if (nameA == 'tv')
        return -1;
    if (nameB == 'tv')
        return 1;
    if (nameA == 'mf')
        return -1;
    if (nameB == 'mf')
        return 1;
    if (nameA == 'mftv')
        return -1;
    if (nameB == 'mftv')
        return 1;
    if (nameA == 'mfth')
        return -1;
    if (nameB == 'mfth')
        return 1;
    if (nameA == 'th')
        return -1;
    if (nameB == 'th')
        return 1;
    if (nameA < nameB)
        return -1;
    if (nameA > nameB)
        return 1;
    return 0;
}

function moveMarker() {
    if (typeof adgangsAdresseData !== 'undefined') {

        var lat = adgangsAdresseData.adgangspunkt.koordinater[1];
        var lng = adgangsAdresseData.adgangspunkt.koordinater[0];
        var newLatLng = new L.LatLng(lat, lng);
        marker.setLatLng(newLatLng);
        var newZoom = 17;
        if (map.getZoom() > newZoom)
            newZoom = map.getZoom();
        map.setView(newLatLng, newZoom, { animate: true });
    }
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

function keyifySideDoer(etage, doer) {
    var key;
    if (etage == null || etage == "") {
        key = "00";
    } else if (etage.length == 1) {
        key = "0" + etage;
    } else {
        key = etage[0] + etage[1];
    }
    if (doer == null || doer == "") {
        key += "0000";
    } else if (doer.length == 1) {
        key += "000" + doer;
    } else if (doer.length == 2) {
        key += "00" + doer;
    } else if (doer.length == 3) {
        key += "0" + doer;
    } else {
        key += doer[0] + doer[1] + doer[2] + doer[3];
    }
    return key.toUpperCase();
}

//function doAjax(url, msg, container) {
function doAjax(url) {
    // if the URL starts with http
    if (url.match('^http')) {
        // assemble the YQL call
        //msg.removeClass('error');
        //msg.html(' (loading...)');
        var queryUrl = "http://query.yahooapis.com/v1/public/yql?" +
            "q=select%20*%20from%20html%20where%20url%3D%22" +
            encodeURIComponent(url) +
            "%22&format=xml'&callback=?";
        $.getJSON(queryUrl,
          function (data) {
              if (data.results[0]) {
                  data = filterData(data.results[0]);
                  //msg.html(' (ready.)');
                  //container.
                  //  html(data).
                  //    focus().
                  //      effect("highlight", {}, 1000);
              } else {
                  //msg.html(' (error!)');
                  //msg.addClass('error');
                  //var errormsg = '<p>Error: could not load the page.</p>';
                  //container.
                  //  html(errormsg).
                  //    focus().
                  //      effect('highlight', { color: '#c00' }, 1000);
              }
          }
        );
    } else {
        $.ajax({
            url: url,
            timeout: 5000,
            success: function (data) {
                //msg.html(' (ready.)');
                //container.
                //  html(data).
                //    focus().
                //      effect("highlight", {}, 1000);
            },
            error: function (req, error) {
                //msg.html(' (error!)');
                //msg.addClass('error');
                //if (error === 'error') { error = req.statusText; }
                //var errormsg = 'There was a communication error: ' + error;
                //container.
                //  html(errormsg).
                //    focus().
                //      effect('highlight', { color: '#c00' }, 1000);
            },
            beforeSend: function (data) {
                //msg.removeClass('error');
                //msg.html(' (loading...)');
            }
        });
    }
}
function filterData(data) {
    // filter all the nasties out
    // no body tags
    data = data.replace(/<?\/body[^>]*>/g, '');
    // no linebreaks
    data = data.replace(/[\r|\n]+/g, '');
    // no comments
    data = data.replace(/<--[\S\s]*?-->/g, '');
    // no noscript blocks
    data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g, '');
    // no script blocks
    data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g, '');
    // no self closing scripts
    data = data.replace(/<script.*\/>/, '');
    // [... add as needed ...]
    return data;
}
