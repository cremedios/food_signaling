function Marker(metadata, pin) {
    this.Id = metadata.Id;
    this.Organization = metadata.Organization;
    this.WeekDays = metadata.WeekDays;
    this.TimeHour = metadata.TimeHour;
    this.TimeMinute = metadata.TimeMinute;
    this.Votes = metadata.Votes;

    for (var i = 0; i < metadata.Links.length; i++) {
        var href = metadata.Links[i].href;
        switch (metadata.Links[i].rel) {
            case "upvote": this.UpVoteHref = href; break;
            case "downvote": this.DownVoteHref = href; break;
        }
    }

    this.pin = pin;
}

Marker.prototype = {
    processOperation: function (operation) {
        switch (operation) {
            case "upvote": this.upVote(); break;
            case "downvote": this.downVote(); break;
        }
    },

    getOperationsSelector: function () {
        return "#markerOperations a";
    },

    upVote: function () {
        if (this.UpVoteHref) {
            $.post(this.UpVoteHref, null, function (result) {
                $("#markerOperations span.votes").html(result.Votes);
            });
        }
    },

    downVote: function () {
        if (this.DownVoteHref) {
            $.post(this.DownVoteHref, null, function (result) {
                $("#markerOperations span.votes").html(result.Votes);
            });
        }
    },

    render: function () {
        var tpl = "<h3>{{Organization}}</h3> \
                <p><span class='glyphicon glyphicon-calendar'></span> {{getWeekDaysDescription}}</p> \
                <span class='glyphicon glyphicon-time'></span> {{TimeHour}} : {{TimeMinute}} \
                <div id='markerOperations' class='pull-right'>\
                    {{#UpVoteHref}}<a href='#' data-id='{{Id}}' data-operation='upvote'><span class='glyphicon glyphicon-upload'></span></a>{{/UpVoteHref}} \
                    <span class='votes'>{{Votes}}</span> \
                    <a href='#' data-id='{{Id}}' data-operation='downvote'> <span class='glyphicon glyphicon-download'></span> </a> \
                </div>";

        return Mustache.to_html(tpl, this);
    },

    getWeekDaysDescription: function () {
        var weekdayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        var result = [];
        for (var i = 0; i < this.WeekDays.length; i++) {
            result.push(weekdayName[this.WeekDays[i]]);
        }

        return result;
    }
}