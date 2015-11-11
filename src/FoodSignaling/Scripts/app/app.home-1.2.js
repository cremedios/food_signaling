function FSAPI(apiBasePath, map, filter) {
    this.markers = [];
    var self = this;
    this.mapService = new MapService(map, function (searchArea) {
        this.searchArea = searchArea;
        self.refreshMarkers();
    });
    this.filter = filter;
    this.apiBasePath = apiBasePath;
}

FSAPI.prototype = {
    pushMarker: function (metadata) {

        var marker = new Marker(metadata);
        var pin = this.mapService.addMarker(
            metadata.Lat,
            metadata.Lng,
            metadata.Organization,
            marker.render(),
            marker.getOperationsSelector(),
            function (operation) {
                marker.processOperation(operation);
            }
        );
        marker.pin = pin;
        this.markers.push(marker);
    },

    saveMarker: function (markerData, onSuccess, onError) {
        var self = this;
        $.post(this.apiBasePath, markerData, function (result) {
            if (!result.Error) {
                self.pushMarker(result);
                onSuccess();
            }
            else {
                onError(result.Error);
            }
        });
    },

    refreshMarkers: function () {
        for (var i = 0; i < this.markers.length; i++) {
            this.mapService.removeMarker(this.markers[i].pin);
        }
        this.markers.length = 0;
        var self = this;

        $.get(this.apiBasePath + this.filter, this.searchArea, function (result) {
            for (var i = 0; i < result.length; i++) {
                self.pushMarker(result[i]);
            }
        });
    },

    filterChanged: function (filter) {
        this.filter = filter;
        this.refreshMarkers();
    },

    getMapCoordinatesFromOffset: function (left, top) {
        return this.mapService.getMapCoordinatesFromOffset(left, top);
    }
}