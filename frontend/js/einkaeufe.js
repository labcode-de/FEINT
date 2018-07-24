$(function () {
    $.ajax({
        url: "https://kbb-server.labcode.tech/getEinkaeufe",
        success: (data) => {
            data = data.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            if (data.length === 0) {
                $('#collapsible-einkaeufe').html('Bisher wurde nichts eingekauft!')
            } else {
                for (let dataI in data) {
                    if (data.hasOwnProperty(dataI)) {
                        const einkauf = data[dataI];
                        const dateObj = new Date(einkauf.timestamp);
                        console.log(dateObj.getDate())
                        const datum = dateObj.getDate().toString() + '.' + dateObj.getMonth().toString() + ".";
                        if(einkauf.bon === "") {
                            $('#collapsible-einkaeufe').append(
                                '<li>' +
                                '  <div class="collapsible-header">Am ' + datum + ' bei ' + einkauf.ort + ' (<b>' + einkauf.betrag + ' &euro; / ' + einkauf.familienName + '</b>)</div>' +
                                '  <div class="collapsible-body">Familie ' + einkauf.familienName + ' hat bei ' + einkauf.ort + ' f&uuml;r <b>' + einkauf.betrag + '€</b> eingekauft.</div>' +
                                '</li>')
                        } else {
                            $('#collapsible-einkaeufe').append(
                                '<li>' +
                                '  <div class="collapsible-header">Am ' + datum + ' bei ' + einkauf.ort + ' (<b>' + einkauf.betrag + ' &euro; / ' + einkauf.familienName + '</b>)</div>' +
                                '  <div class="collapsible-body">' +
                                //'   Familie ' + einkauf.familienName + ' hat bei ' + einkauf.ort + ' f&uuml;r <b>' + einkauf.betrag + '€</b> eingekauft.' +
                                '   <br><br><a href="https://kbb-server.labcode.tech/bonImages/' + einkauf.bon + '"><img src="https://kbb-server.labcode.tech/bonImages/' + einkauf.bon + '" width="75%" style="margin: auto; display: block;" /></a>' +
                                '</div>' +
                                '</li>')
                        }
                        if(parseInt(dataI) + 1 === data.length) {
                            $('.collapsible').collapsible();
                        }
                    }
                }
            }
        }
    })
})