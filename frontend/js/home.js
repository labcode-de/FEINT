$(function () {
    $('.fixed-action-btn').floatingActionButton();
    $('.modal').modal();

    $('.orig_url').val(window.location.href);

    $.ajax({
        url: "http://localhost:8081/getFamilyStatistics",
        success: function (data) {
            for (let familieI in data.familien) {
                const familie = data.familien[familieI];
                let farbeDiff = "";
                if((familie.sollAusgaben - familie.istAusgaben) > 0 ) {
                    farbeDiff = "#b71c1c";
                } else {
                    farbeDiff = '#2e7d32';
                }
                $('#familientbody').append(
                    '<tr>' +
                    '   <td>' + familie.name + ' (' + familie.anzPersonen + ')</td>' +
                    '   <td>' + familie.sollAusgaben + '</td>' +
                    '   <td>' + familie.istAusgaben + '</td>' +
                    '   <td style="background-color:' + farbeDiff + '"><span style="color: #fff;">' + (Math.round((familie.istAusgaben - familie.sollAusgaben) * 100) / 100).toString() + '</span></td>' +
                    '</tr>');
            }
        }
    })
    $.ajax({
        url: "http://localhost:8081/getFamilien",
        success: (data) => {
            for (let dataI in data) {
                $('.select-familien').append('<option value="' + data[dataI] + '">' + data[dataI] + '</option>');
                if(parseInt(dataI) + 1 === parseInt(data.length)) {
                    $('select').formSelect();
                }
            }
        }
    })
})