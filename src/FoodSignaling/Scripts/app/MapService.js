function MapService(mapCanvas, onMove) {
    this.currentInfoWindow = null;
    this.overlay = new google.maps.OverlayView();

    this.map = this.initialize(mapCanvas);
    this.attachEventsToMap(this.map, onMove);
}

MapService.prototype.initialize = function (mapCanvas) {
    var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var initialLocation = new google.maps.LatLng(60, 105);
    var map = new google.maps.Map(mapCanvas, mapOptions);

    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        }, function () {
            handleNoGeolocation(browserSupportFlag);
        });
    }
    else
        alert("No geolocation");


    this.overlay.draw = function () { };
    this.overlay.setMap(map);

    return map;
}

MapService.prototype.removeMarker = function (marker) {
    marker.setMap(null);
}

MapService.prototype.addMarker = function (lat, lng, title, contentForInfoWindow, operationSelector, onOperation) {
    var gMarker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: this.map,
        title: title,
    });

    var self = this;

    gMarker.addListener('click', function () {
        if (self.currentInfoWindow)
            self.currentInfoWindow.close();

        self.currentInfoWindow = new google.maps.InfoWindow({
            content: contentForInfoWindow
        });
        self.currentInfoWindow.open(this.map, gMarker);

        google.maps.event.addDomListener(self.currentInfoWindow, 'domready', function () {
            $(operationSelector).click(function () {
                var elem = $(this);
                onOperation(elem.attr("data-operation"))
            });
        });       
    })

    return gMarker;
}

MapService.prototype.attachEventsToMap = function (map, onMove) {
    var self = this;
    map.addListener('bounds_changed', function () {
        delay(function () {
            onMove(self.getSearchArea());
        }, 500);
    });
}

MapService.prototype.getSearchArea = function () {
    var bounds = this.map.getBounds();
    var nePoint = bounds.getNorthEast();
    var center = bounds.getCenter();

    var proximitymeter = google.maps.geometry.spherical.computeDistanceBetween(center, nePoint);

    return {
        lat: center.lat(),
        lng: center.lng(),
        radius: proximitymeter
    };
}

MapService.prototype.getMapCoordinatesFromOffset = function (left, top) {
    var mOffset = $(this.map.getDiv()).offset();
    var point = new google.maps.Point(left - mOffset.left, top - mOffset.top);
    return this.overlay.getProjection().fromContainerPixelToLatLng(point);
}