$(function () {
    $('.modal').modal();
    $('.datepicker').datepicker({
        defaultDate: new Date,
        setDefaultDate: true,
        format: "dd.mm.yyyy",
        firstDay: 1,
        i18n: {
            months: [
                'Januar',
                'Februar',
                'März',
                'April',
                'Mai',
                'Juni',
                'Juli',
                'August',
                'September',
                'Oktober',
                'November',
                'Dezember'
            ],
            monthsShort: [
                'Jan',
                'Feb',
                'Mär',
                'Apr',
                'Mai',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Okt',
                'Nov',
                'Dez'
            ],
            weekdays:
                [
                    'Sonntag',
                    'Mondag',
                    'Dienstag',
                    'Mittwoch',
                    'Downnerstag',
                    'Freitag',
                    'Samstag'
                ],
            weekdaysShort: [
                'So',
                'Mo',
                'Di',
                'Mi',
                'Do',
                'Fr',
                'Sa'
            ],
            weekdaysAbbrev: [
                "S",
                "M",
                "D",
                "M",
                "D",
                "F",
                "S"
            ]
        }
    });
    $('.orig_url').val(window.location.href);
    $.ajax({
        url: "https://kbb-server.labcode.tech/getFamilien",
        success: (data) => {
            data = data.sort();
            for (let dataI in data) {
                $('.select-familien').append('<option value="' + data[dataI] + '">' + data[dataI] + '</option>');
                if (parseInt(dataI) + 1 === parseInt(data.length)) {
                    $('select').formSelect();
                }
            }
        }
    })
});