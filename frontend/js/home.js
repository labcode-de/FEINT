$(function () {
    // $('.fixed-action-btn').floatingActionButton();
    $.ajax({
        url: "https://kbb-server.labcode.tech/getFamilyStatistics",
        success: function (data) {
            data.familien.sort(function (a,b) {
                console.log(a)
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            })
            for (let familieI in data.familien) {
                const familie = data.familien[familieI];
                let farbeDiff = "";
                if ((familie.sollAusgaben - familie.istAusgaben) > 0) {
                    farbeDiff = "#b71c1c";
                } else {
                    farbeDiff = '#2e7d32';
                }
                $('#summeSoll').html((Math.round(data.gesSoll * 100) / 100));
                $('#summeIst').html((Math.round(data.gesAusgaben * 100) / 100));
                $('#familientbody').append(
                    '<tr>' +
                    '   <td>' + familie.name + ' (' + familie.anzPersonen + ')</td>' +
                    '   <td>' + familie.tage + '</td>' +
                    '   <td>' + familie.sollAusgaben + '</td>' +
                    '   <td>' + familie.istAusgaben + '</td>' +
                    '   <td style="background-color:' + farbeDiff + '"><span style="color: #fff;">' + (Math.round((familie.istAusgaben - familie.sollAusgaben) * 100) / 100).toString() + '</span></td>' +
                    '</tr>');
            }
        }
    })
})