function truncate(str, num) {
    var newStr;
    if (str.length > num) {
        newStr = str.slice(0, num - 3);
        newStr += '\u2026';
    } else {
        newStr = str;
    }
    return newStr;
}

$(document).ready(function () {
    var id = '?client_id=sykx56dumtvdl03snitn9wnr0zwtlcl&callback=?';
    var $nav = $('.nav'),
        $navItems = $nav.find('ul li > a'),
        $all = $('#all'),
        $online = $('#online'),
        $offline = $('#offline'),
        $activeBar = $('#activeBar'),
        $panel = $('#panel'),
        $search = $('#search'),
        $streamers;

    var twitchName = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    twitchNameLength = twitchName.length;
    twitchName.sort();

    var streams = [],
        channels = [],
        online = [],
        offline = [],
        count = 0;

    function createStreamList(index) {
        $.ajax({
            dataType: 'jsonp',
            url: 'https://api.twitch.tv/kraken/streams/' + twitchName[index] + id
        }).then(function (streamsData) {
            $.ajax({
                dataType: 'jsonp',
                url: 'https://api.twitch.tv/kraken/channels/' + twitchName[index] + id
            }).then(function (channelsData) {
                streams[index] = streamsData;
                channels[index] = channelsData;
                count++;

                if (count === twitchNameLength) {
                    createAll();
                    showAll();
                }
            });
        });
    }

    function createAll() {
        for (var i = 0; i < twitchNameLength; i++) {
            if (streams[i].stream !== null) {
                online[i] = (
                    '<a class="streamLink" href=' + channels[i].url + ' target="_blank">' +
                    '<div class="streamers">' +
                    '<img class="profilePicture left" src=' + channels[i].logo + '>' +
                    '<div class="group left">' +
                    '<h2 class="displayName">' + channels[i].display_name + '<i class="fa fa-circle-thin"></i></h2>' +
                    '<p class="status">' + truncate(channels[i].status, 28) + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</a>'
                );
            } else {
                offline[i] = (
                    '<div class="streamers offline">' +
                    '<img class="profilePicture left" src=' + channels[i].logo + '>' +
                    '<div class="group left">' +
                    '<h2 class="displayName">' + channels[i].display_name + '</h2>' +
                    '</div>' +
                    '</div>'
                );
            }
        }
    }

    function showAll() {
        $(this).addClass('active');
        $online.removeClass('active');
        $offline.removeClass('active');
        $activeBar.removeClass().addClass('activeBar moveLeft');

        $panel.html(online.join('')).append(offline.join(''));
    }

    function showOnline() {
        $(this).addClass('active');
        $all.removeClass('active');
        $offline.removeClass('active');
        $activeBar.removeClass().addClass('activeBar moveCenter');

        $panel.html(online.join(''));
    }

    function showOffline() {
        $(this).addClass('active');
        $all.removeClass('active');
        $online.removeClass('active');
        $activeBar.removeClass().addClass('activeBar moveRight');

        $panel.html(offline.join(''));
    }
    $search.keyup(function (e) {
        $streamers.each(function (index) {
            var text = $(this).text().toUpperCase();
            var input = $search.val().toUpperCase();

            if (text.indexOf(input) === -1) $(this).hide();
            else $(this).show();
        });
        e.preventDefault();
    });

    $navItems.on('click', function (e) {
        var width = $(this).outerWidth();
        var x = e.pageX;
        var y = e.pageY;
        var offsetX = x - $(this).offset().left;
        var offsetY = y - $(this).offset().top;
        var layerX = Math.round(offsetX - (width / 2));
        var layerY = Math.round(offsetY - (width / 2));

        $(this).find('span').remove();
        $(this).append('<span class="layer rippleNav"></span>');
        $('.layer').css({
            top: layerY + 'px',
            left: layerX + 'px',
        }).addClass('animateLayer');
    });

    $all.on('click', showAll);
    $online.on('click', showOnline);
    $offline.on('click', showOffline);

    for (var i = 0; i < twitchNameLength; i++) {
        createStreamList(i);
    }
});