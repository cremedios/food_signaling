using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace FoodSignaling.Models
{
    public class Marker
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public List<int> WeekDays { get; set; }

        public string Organization { get; set; }

        public int Hour { get; set; }

        public int Minute { get; set; }

        public int Votes { get; set; }

        public GeoJsonPoint<GeoJson2DGeographicCoordinates> Location { get; set; }
    }
}