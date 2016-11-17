
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

function addPerson(key, name) {{"query":{"count":1,"created":"2016-02-11T09:03:25Z","lang":"da-DK","results":{"results":{"div":[{"class":"hit-header-block-center","h2":{"class":"hit-name","span":{"class":"hit-name-ellipsis","a":{"class":"stripped-link lightblue-link profile-page-link addax addax-ps_hl_name_click","href":"/p/anders+emborg/56286356","content":"Anders Emborg"}}},"address":{"class":"hit-address","span":{"class":"hit-phone-number type-phone_normal_land_line","content":"38 19 09 41 "}},"div":{"class":"hit-address-location","data-coordinate":"{\"hitNumber\": 1, \"coordinate\": {\"lat\":55.6865161, \"lon\":12.5090591}}","div":[{"class":"hit-address-line","span":{"class":"hit-street-address","content":"\nMoltkesvej 36, 1. th\n"}},{"class":"hit-address-line","span":[{"class":"hit-postal-code","content":"2000"},{"class":"hit-address-locality","content":"Frederiksberg"}]}]},"ul":{"class":"hit-travel-options clearfix","li":[{"class":"hit-travel-options-item lightblue-link","span":{"class":"e-icon-location2"},"a":{"class":"hit-travel-options-link lightblue-link addax addax-ps_hl_route_plan_click","href":"http://kort.degulesider.dk/?index=wp&id=56286356&query=Moltkesvej%2036%202000 ","title":"Mere info","span":"Vis kort og ruteplan"}},{"class":"hit-travel-options-item","a":{"class":"hit-travel-options-link lightblue-link e-icon-rejseplanen addax addax-ps_hl_rejseplan_click","href":"http://www.rejseplanen.dk/bin/query.exe/mn?ZADR=1&Z=Moltkesvej+36+2000+Frederiksberg","span":"Rejseplan"}}]},"a":{"class":"e-icon-cog addax addax-ps_hl_self_trig_click lightblue-link stripped-link link-with-icon hit-white-self-link","href":"/p/anders+emborg/56286356?whiteself=1","title":"Ret dine oplysninger","span":"Ret dine oplysninger"}},{"class":"hit-header-block-center","h2":{"class":"hit-name","span":{"class":"hit-name-ellipsis","a":{"class":"stripped-link lightblue-link profile-page-link addax addax-ps_hl_name_click","href":"/p/bente+bistrup/51974089","content":"Bente Bistrup"}}},"address":{"class":"hit-address","span":{"class":"hit-phone-number type-phone_normal_mobile","content":"20 65 11 28 "}},"div":{"class":"hit-address-location","data-coordinate":"{\"hitNumber\": 2, \"coordinate\": {\"lat\":55.6865161, \"lon\":12.5090591}}","div":[{"class":"hit-address-line","span":{"class":"hit-street-address","content":"\nMoltkesvej 36, 2. tv\n"}},{"class":"hit-address-line","span":[{"class":"hit-postal-code","content":"2000"},{"class":"hit-address-locality","content":"Frederiksberg"}]}]},"ul":{"class":"hit-travel-options clearfix","li":[{"class":"hit-travel-options-item lightblue-link","span":{"class":"e-icon-location2"},"a":{"class":"hit-travel-options-link lightblue-link addax addax-ps_hl_route_plan_click","href":"http://kort.degulesider.dk/?index=wp&id=51974089&query=Moltkesvej%2036%202000 ","title":"Mere info","span":"Vis kort og ruteplan"}},{"class":"hit-travel-options-item","a":{"class":"hit-travel-options-link lightblue-link e-icon-rejseplanen addax addax-ps_hl_rejseplan_click","href":"http://www.rejseplanen.dk/bin/query.exe/mn?ZADR=1&Z=Moltkesvej+36+2000+Frederiksberg","span":"Rejseplan"}}]},"a":{"class":"e-icon-cog addax addax-ps_hl_self_trig_click lightblue-link stripped-link link-with-icon hit-white-self-link","href":"/p/bente+bistrup/51974089?whiteself=1","title":"Ret dine oplysninger","span":"Ret dine oplysninger"}},{"class":"hit-header-block-center","h2":{"class":"hit-name","span":{"class":"hit-name-ellipsis","a":{"class":"stripped-link lightblue-link profile-page-link addax addax-ps_hl_name_click","href":"/p/britta+etly+buhl/56610187","content":"Britta Etly Buhl"}}},"address":{"class":"hit-address","span":{"class":"hit-phone-number type-phone_normal_mobile","content":"61 26 58 32 "}},"div":{"class":"hit-address-location","data-coordinate":"{\"hitNumber\": 3, \"coordinate\": {\"lat\":55.6865161, \"lon\":12.5090591}}","div":[{"class":"hit-address-line","span":{"class":"hit-street-address","content":"\nMoltkesvej 36, st. th\n"}},{"class":"hit-address-line","span":[{"class":"hit-postal-code","content":"2000"},{"class":"hit-address-locality","content":"Frederiksberg"}]}]},"ul":{"class":"hit-travel-options clearfix","li":[{"class":"hit-travel-options-item lightblue-link","span":{"class":"e-icon-location2"},"a":{"class":"hit-travel-options-link lightblue-link addax addax-ps_hl_route_plan_click","href":"http://kort.degulesider.dk/?index=wp&id=56610187&query=Moltkesvej%2036%202000 ","title":"Mere info","span":"Vis kort og ruteplan"}},{"class":"hit-travel-options-item","a":{"class":"hit-travel-options-link lightblue-link e-icon-rejseplanen addax addax-ps_hl_rejseplan_click","href":"http://www.rejseplanen.dk/bin/query.exe/mn?ZADR=1&Z=Moltkesvej+36+2000+Frederiksberg","span":"Rejseplan"}}]},"a":{"class":"e-icon-cog addax addax-ps_hl_self_trig_click lightblue-link stripped-link link-with-icon hit-white-self-link","href":"/p/britta+etly+buhl/56610187?whiteself=1","title":"Ret dine oplysninger","span":"Ret dine oplysninger"}},{"class":"hit-header-block-center","h2":{"class":"hit-name","span":{"class":"hit-name-ellipsis","a":{"class":"stripped-link lightblue-link profile-page-link addax addax-ps_hl_name_click","href":"/p/flemming+lykke+bistrup/52995030","content":"Flemming Lykke Bistrup"}}},"address":{"class":"hit-address","span":{"class":"hit-phone-number type-phone_normal_mobile","content":"22 16 30 32 "}},"div":{"class":"hit-address-location","data-coordinate":"{\"hitNumber\": 4, \"coordinate\": {\"lat\":55.6865161, \"lon\":12.5090591}}","div":[{"class":"hit-address-line","span":{"class":"hit-street-address","content":"\nMoltkesvej 36, 2. tv\n"}},{"class":"hit-address-line","span":[{"class":"hit-postal-code","content":"2000"},{"class":"hit-address-locality","content":"Frederiksberg"}]}]},"ul":{"class":"hit-travel-options clearfix","li":[{"class":"hit-travel-options-item lightblue-link","span":{"class":"e-icon-location2"},"a":{"class":"hit-travel-options-link lightblue-link addax addax-ps_hl_route_plan_click","href":"http://kort.degulesider.dk/?index=wp&id=52995030&query=Moltkesvej%2036%202000 ","title":"Mere info","span":"Vis kort og ruteplan"}},{"class":"hit-travel-options-item","a":{"class":"hit-travel-options-link lightblue-link e-icon-rejseplanen addax addax-ps_hl_rejseplan_click","href":"http://www.rejseplanen.dk/bin/query.exe/mn?ZADR=1&Z=Moltkesvej+36+2000+Frederiksberg","span":"Rejseplan"}}]},"a":{"class":"e-icon-cog addax addax-ps_hl_self_trig_click lightblue-link stripped-link link-with-icon hit-white-self-link","href":"/p/flemming+lykke+bistrup/52995030?whiteself=1","title":"Ret dine oplysninger","span":"Ret dine oplysninger"}},{"class":"hit-header-block-center","h2":{"class":"hit-name","span":{"class":"hit-name-ellipsis","a":{"class":"stripped-link lightblue-link profile-page-link addax addax-ps_hl_name_click","href":"/p/hanne+dalsgaard+nielsen/57536788","content":"Hanne Dalsgaard Nielsen"}}},"address":{"class":"hit-address","span":{"class":"hit-phone-number type-phone_normal_mobile","content":"20 52 91 10 "}},"div":{"class":"hit-address-location","data-coordinate":"{\"hitNumber\": 5, \"coordinate\": {\"lat\":55.6865161, \"lon\":12.5090591}}","div":[{"class":"hit-address-line","span":{"class":"hit-street-address","content":"\nMoltkesvej 36, 1. th\n"}},{"class":"hit-address-line","span":[{"class":"hit-postal-code","content":"2000"},{"class":"hit-address-locality","content":"Frederiksberg"}]}]},"ul":{"class":"hit-travel-options clearfix","li":[{"class":"hit-travel-options-item lightblue-link","span":{"class":"e-icon-location2"},"a":{"class":"hit-travel-options-link lightblue-link addax addax-ps_hl_route_plan_click","href":"http://kort.degulesider.dk/?index=wp&id=57536788&query=Moltkesvej%2036%202000 ","title":"Mere info","span":"Vis kort og ruteplan"}},{"class":"hit-travel-options-item","a":{"class":"hit-travel-options-link lightblue-link e-icon-rejseplanen addax addax-ps_hl_rejseplan_click","href":"http://www.rejseplanen.dk/bin/query.exe/mn?ZADR=1&Z=Moltkesvej+36+2000+Frederiksberg","span":"Rejseplan"}}]},"a":{"class":"e-icon-cog addax addax-ps_hl_self_trig_click lightblue-link stripped-link link-with-icon hit-white-self-link","href":"/p/hanne+dalsgaard+nielsen/57536788?whiteself=1","title":"Ret dine oplysninger","span":"Ret dine oplysninger"}},{"class":"hit-header-block-center","h2":{"class":"hit-name","span":{"class":"hit-name-ellipsis","a":{"class":"stripped-link lightblue-link profile-page-link addax addax-ps_hl_name_click","href":"/p/knud+eggert+buhl/107908639","content":"Knud Eggert Buhl"}}},"address":{"class":"hit-address","span":{"class":"hit-phone-number type-phone_normal_mobile","content":"21 55 50 79 "}},"div":{"class":"hit-address-location","data-coordinate":"{\"hitNumber\": 6, \"coordinate\": {\"lat\":55.6865161, \"lon\":12.5090591}}","div":[{"class":"hit-address-line","span":{"class":"hit-street-address","content":"\nMoltkesvej 36, st. th\n"}},{"class":"hit-address-line","span":[{"class":"hit-postal-code","content":"2000"},{"class":"hit-address-locality","content":"Frederiksberg"}]}]},"ul":{"class":"hit-travel-options clearfix","li":[{"class":"hit-travel-options-item lightblue-link","span":{"class":"e-icon-location2"},"a":{"class":"hit-travel-options-link lightblue-link addax addax-ps_hl_route_plan_click","href":"http://kort.degulesider.dk/?index=wp&id=107908639&query=Moltkesvej%2036%202000 ","title":"Mere info","span":"Vis kort og ruteplan"}},{"class":"hit-travel-options-item","a":{"class":"hit-travel-options-link lightblue-link e-icon-rejseplanen addax addax-ps_hl_rejseplan_click","href":"http://www.rejseplanen.dk/bin/query.exe/mn?ZADR=1&Z=Moltkesvej+36+2000+Frederiksberg","span":"Rejseplan"}}]},"a":{"class":"e-icon-cog addax addax-ps_hl_self_trig_click lightblue-link stripped-link link-with-icon hit-white-self-link","href":"/p/knud+eggert+buhl/107908639?whiteself=1","title":"Ret dine oplysninger","span":"Ret dine oplysninger"}},{"class":"hit-header-block-center","h2":{"class":"hit-name","span":{"class":"hit-name-ellipsis","a":{"class":"stripped-link lightblue-link profile-page-link addax addax-ps_hl_name_click","href":"/p/lone+holm+christensen/54640488","content":"Lone Holm Christensen"}}},"address":{"class":"hit-address","span":{"class":"hit-phone-number type-phone_normal_mobile","content":"23 96 98 64 "}},"div":{"class":"hit-address-location","data-coordinate":"{\"hitNumber\": 7, \"coordinate\": {\"lat\":55.6865161, \"lon\":12.5090591}}","div":[{"class":"hit-address-line","span":{"class":"hit-street-address","content":"\nMoltkesvej 36, 2. th\n"}},{"class":"hit-address-line","span":[{"class":"hit-postal-code","content":"2000"},{"class":"hit-address-locality","content":"Frederiksberg"}]}]},"ul":{"class":"hit-travel-options clearfix","li":[{"class":"hit-travel-options-item lightblue-link","span":{"class":"e-icon-location2"},"a":{"class":"hit-travel-options-link lightblue-link addax addax-ps_hl_route_plan_click","href":"http://kort.degulesider.dk/?index=wp&id=54640488&query=Moltkesvej%2036%202000 ","title":"Mere info","span":"Vis kort og ruteplan"}},{"class":"hit-travel-options-item","a":{"class":"hit-travel-options-link lightblue-link e-icon-rejseplanen addax addax-ps_hl_rejseplan_click","href":"http://www.rejseplanen.dk/bin/query.exe/mn?ZADR=1&Z=Moltkesvej+36+2000+Frederiksberg","span":"Rejseplan"}}]},"a":{"class":"e-icon-cog addax addax-ps_hl_self_trig_click lightblue-link stripped-link link-with-icon hit-white-self-link","href":"/p/lone+holm+christensen/54640488?whiteself=1","title":"Ret dine oplysninger","span":"Ret dine oplysninger"}},{"class":"hit-header-block-center","h2":{"class":"hit-name","span":{"class":"hit-name-ellipsis","a":{"class":"stripped-link lightblue-link profile-page-link addax addax-ps_hl_name_click","href":"/p/peter+wildenschild/55270210","content":"Peter Wildenschild"}}},"address":{"class":"hit-address","span":{"class":"hit-phone-number type-phone_normal_land_line","content":"38 33 38 50 "}},"div":{"class":"hit-address-location","data-coordinate":"{\"hitNumber\": 8, \"coordinate\": {\"lat\":55.6865161, \"lon\":12.5090591}}","div":[{"class":"hit-address-line","span":{"class":"hit-street-address","content":"\nMoltkesvej 36, 1. tv\n"}},{"class":"hit-address-line","span":[{"class":"hit-postal-code","content":"2000"},{"class":"hit-address-locality","content":"Frederiksberg"}]}]},"ul":{"class":"hit-travel-options clearfix","li":[{"class":"hit-travel-options-item lightblue-link","span":{"class":"e-icon-location2"},"a":{"class":"hit-travel-options-link lightblue-link addax addax-ps_hl_route_plan_click","href":"http://kort.degulesider.dk/?index=wp&id=55270210&query=Moltkesvej%2036%202000 ","title":"Mere info","span":"Vis kort og ruteplan"}},{"class":"hit-travel-options-item","a":{"class":"hit-travel-options-link lightblue-link e-icon-rejseplanen addax addax-ps_hl_rejseplan_click","href":"http://www.rejseplanen.dk/bin/query.exe/mn?ZADR=1&Z=Moltkesvej+36+2000+Frederiksberg","span":"Rejseplan"}}]},"a":{"class":"e-icon-cog addax addax-ps_hl_self_trig_click lightblue-link stripped-link link-with-icon hit-white-self-link","href":"/p/peter+wildenschild/55270210?whiteself=1","title":"Ret dine oplysninger","span":"Ret dine oplysninger"}}]}}}}
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
