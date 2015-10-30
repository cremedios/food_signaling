function initialize() {

    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var initialLocation = new google.maps.LatLng(60, 105);
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var browserSupportFlag = new Boolean();

    // Try W3C Geolocation (Preferred)
    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        }, function () {
            handleNoGeolocation(browserSupportFlag);
        });
    }
        // Browser doesn't support Geolocation
    else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
            alert("Geolocation service failed.");
            initialLocation = newyork;
        } else {
            alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
            initialLocation = siberia;
        }
        map.setCenter(initialLocation);
    }

    var overlay = new google.maps.OverlayView();
    overlay.draw = function () { };
    overlay.setMap(map);

    map.addListener('bounds_changed', function () {
        searchMarkers(map);
    });

    $("#addMarkerForm").submit(function (form) {
        event.preventDefault();
        var form = $("#addMarkerForm");
        var data = form.find(":input").serialize();
        $.post(apiBasePath, data, function (result) {
            if (!result.Error) {
                addMarkerToMap({
                    position: result,
                    map: map
                });
                $("#addMarkerModal").modal('hide');
            }
            else {
                alert(result.Error);
            }
        });
    });

    $("#weekdayFilter").change(function () {
        searchMarkers(map);
    });

    $("#draggable").draggable({
        helper: 'clone',
        stop: function (e, ui) {
            var mOffset = $(map.getDiv()).offset();
            var point = new google.maps.Point(
                ui.offset.left - mOffset.left + (ui.helper.width() / 2),
                ui.offset.top - mOffset.top + (ui.helper.height())
            );
            var latLng = overlay.getProjection().fromContainerPixelToLatLng(point);
            $("#addMarkerForm input[name='lat']").val(latLng.lat);
            $("#addMarkerForm input[name='lng']").val(latLng.lng);
            showMarkerModal();
        }
    });

    function getMapSearchArea(map) {
        var bounds = map.getBounds();
        var nePoint = bounds.getNorthEast();
        var center = bounds.getCenter();

        var proximitymeter = google.maps.geometry.spherical.computeDistanceBetween(center, nePoint);

        return {
            lat: center.lat(),
            lng: center.lng(),
            radius: proximitymeter
        };
    }

    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    function searchMarkers(map) {
        delay(function () {
            searchMarkersDelay(map);
        }, 500);
    }

    function searchMarkersDelay(map) {
        clearMarkers();

        var weekday = $("#weekdayFilter").val();
        $.get(apiBasePath + weekday, getMapSearchArea(map), function (result) {
            for (var i = 0; i < result.length; i++) {
                addMarkerToMap({ position: result[i], map: map });
            }
        });
    }

    function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }

        markers.length = 0;
    }

    function showMarkerModal() {
        var date = new Date();
        $("#timeHour option[value='" + date.getHours() + "']").prop('selected', true);
        if (date.getMinutes() < 30)
            $("#timeMinute option[value='0']").prop('selected', true);
        else
            $("#timeMinute option[value='30']").prop('selected', true);

        $("#addMarkerModal").modal();
    }

    function addMarkerToMap(metadata) {
        var marker = new google.maps.Marker({
            position: { lat: metadata.position.Lat, lng: metadata.position.Lng },
            map: metadata.map,
            title: metadata.position.Organization,
        });
        marker.metadata = metadata.position;

        marker.addListener('click', function () {
            var info = this.metadata;

            var contentString = "<h3>" + info.Organization + "</h3>";

            if (info.WeekDays.length < 7) {
                var tmpWeekDays = [];
                for (var i = 0; i < info.WeekDays.length; i++) {
                    tmpWeekDays.push(weekdayNames[info.WeekDays[i]]);
                }
                contentString += "<p>deliver food every " + tmpWeekDays.join() + "</p>";
            }
            else
                contentString += "<p>deliver food everyday</p>";
            contentString += "<span class='glyphicon glyphicon-time'></span> " + info.TimeHour + ":" + info.TimeMinute;

            if (currentInfoWindow)
                currentInfoWindow.close();

            currentInfoWindow = new google.maps.InfoWindow({
                content: contentString
            });
            currentInfoWindow.open(marker.map, marker);
        });
        markers.push(marker);
    }
}
