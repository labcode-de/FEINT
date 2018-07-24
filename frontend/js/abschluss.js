$(function () {
    $.ajax({
        url: "https://kbb-server.labcode.tech/getSettings",
        success: (data) => {
            if (data.abschlussBerechnet) {
                $('#bereitsBerechnet').removeClass('hidden');
            } else {
                $('#nochzuBerechnen').removeClass('hidden');
            }
        }
    })
    $.ajax({
        url: "https://kbb-server.labcode.tech/getFamilien",
        success: (data) => {
            data = data.sort();
            for (let dataI in data) {
                $('#select-familien').append('<option value="' + data[dataI] + '">' + data[dataI] + '</option>');
                if (parseInt(data.length) === parseInt(dataI) + 1) {
                    $('#select-familien').formSelect();
                }
            }
        }
    })
    $('#erstellen-a').on('click', (e) => {
        e.preventDefault();
        if (confirm("Möchstest du wirklich die Abschlussberechnung erstellen? Danach werden keine Eintragungen mehr möglich sein.")) {
            $.ajax({
                method: 'post',
                url: "https://kbb-server.labcode.tech/abschlussBerechnenDB",
                success: (data) => {
                    $.ajax({
                        method: 'post',
                        url: "https://kbb-server.labcode.tech/abschlussBerechnen",
                        success: (data) => {
                            $('#nochzuBerechnen').addClass('hidden');
                            $('#bereitsBerechnet').removeClass('hidden');
                        }
                    })
                }
            })
        }
    })
    $('#select-familien').on('change', (e) => {
        const selectFamilie = $('#select-familien').val();
        // First Time
        $.ajax({
            url: "https://kbb-server.labcode.tech/getFamilyDetails",
            data: {
                name: selectFamilie
            },
            method: 'post',
            success: (data) => {
                console.log(data);
                if (data.transaktionen[0].bezahlen) {
                    $('#ergebnis').html('<h6 class="center">Soll / Ist / Differenz (' + data.sollAusgaben + ' &euro; / ' + data.istAusgaben + ' &euro; / ' + data.difference + '&euro;)</h6>' +
                        '<h5 class="center thin">Du musst bezahlen!</h5>' +
                        '<table class="centered responsive-table0">' +
                        '                <thead>' +
                        '                    <tr>' +
                        '                        <th>Betrag</th>' +
                        '                        <th>Empf&auml;nger</th>' +
                        '                    </tr>' +
                        '                </thead>' +
                        '<tbody id="ergebnis-table"></tbody>' +
                        '            </table>')
                } else {
                    $('#ergebnis').html('<h6 class="center">Soll / Ist / Differenz (' + data.sollAusgaben + ' &euro; / ' + data.istAusgaben + ' &euro; / ' + data.difference + '&euro;)</h6>' +
                        '<h5 class="center thin">Du bekommst Geld!</h5>' +
                        '<table class="centered responsive-table0">' +
                        '                <thead>' +
                        '                    <tr>' +
                        '                        <th>Betrag</th>' +
                        '                        <th>Absender</th>' +
                        '                    </tr>' +
                        '                </thead>' +
                        '<tbody id="ergebnis-table"></tbody>' +
                        '            </table>')
                }
                for (let dataI in data.transaktionen) {
                    $('#ergebnis-table').append("<tr><td>" + (Math.round(data.transaktionen[dataI].betrag * 100) / 100) + "</td><td>" + data.transaktionen[dataI].partner + "</td></tr>")
                }
            }
        })
    })
})