$(function () {
    $.ajax({
        url: "http://localhost:8081/getEinkaeufe",
        success: (data) => {
            if (data.length === 0) {
                $('#collapsible-einkaeufe').html('Bisher wurde nichts eingekauft!')
            } else {
                for (let dataI in data) {
                    if (data.hasOwnProperty(dataI)) {
                        const einkauf = data[dataI];
                        const dateObj = new Date(einkauf.timestamp);
                        console.log(dateObj.getDate())
                        const datum = dateObj.getDate().toString() + '.' + dateObj.getMonth().toString();
                        if(einkauf.bon === "") {
                            $('#collapsible-einkaeufe').append(
                                '<li>' +
                                '  <div class="collapsible-header">' + datum + ' bei ' + einkauf.ort + ' (<b>' + einkauf.betrag + ' &euro;</b>)</div>' +
                                '  <div class="collapsible-body">Familie ' + einkauf.familienName + ' hat bei ' + einkauf.ort + ' f&uuml;r <b>' + einkauf.betrag + '€</b> eingekauft.</div>' +
                                '</li>')
                        } else {
                            $('#collapsible-einkaeufe').append(
                                '<li>' +
                                '  <div class="collapsible-header">' + datum + ' bei ' + einkauf.ort + ' (<b>' + einkauf.betrag + ' &euro;</b>)</div>' +
                                '  <div class="collapsible-body">' +
                                '   Familie ' + einkauf.familienName + ' hat bei ' + einkauf.ort + ' f&uuml;r <b>' + einkauf.betrag + '€</b> eingekauft.' +
                                '   <br><br><a href="http://localhost:8081/bonImages/' + einkauf.bon + '"><img src="http://localhost:8081/bonImages/' + einkauf.bon + '" width="50%" style="margin: auto; display: block;" /></a>' +
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