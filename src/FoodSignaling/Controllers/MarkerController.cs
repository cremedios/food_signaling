using FoodSignaling.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Driver.GeoJsonObjectModel;

namespace FoodSignaling.Controllers
{
    public class MarkerController : ApiController
    {
        public async Task<IHttpActionResult> Post(MarkerDto markerDto)
        {
            if (!ModelState.IsValid)
                return Json(new { Error = "Please input all fields" });

            var context = new FoodSignalingContext(); //could use dependency injection here

            var marker = new Marker()
            {
                Organization = markerDto.Organization,
                Hour = markerDto.TimeHour,
                Minute = markerDto.TimeMinute,
                WeekDays = markerDto.WeekDays,
                Location = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(
                    new GeoJson2DGeographicCoordinates(markerDto.Lng, markerDto.Lat))
            };

            await context.Markers.InsertOneAsync(marker);
            markerDto.Id = marker.Id;

            return Json(markerDto);
        }

        [Route("api/marker/{weekday}")]
        public async Task<IHttpActionResult> Get(int weekday, double lng = 0, double lat = 0, double radius = 0)
        {
            var context = new FoodSignalingContext();
            FilterDefinition<Marker> filter = null;

            if (weekday >= 0)
                filter = Builders<Marker>.Filter.Eq("WeekDays", weekday);
            else
                filter = new BsonDocument();

            if (lat != 0 && lng != 0 && radius > 0)
                filter &= Builders<Marker>.Filter.Near(p => p.Location, GeoJson.Point(GeoJson.Geographic(lng, lat)), radius);


            var markers = await context.Markers.Find(filter).Limit(100).ToListAsync();

            var result = new List<MarkerDto>();

            foreach (var marker in markers)
            {
                result.Add(new MarkerDto() //could use a mapper to do this
                {
                    Id = marker.Id,
                    Lat = marker.Location.Coordinates.Latitude,
                    Lng = marker.Location.Coordinates.Longitude,
                    Organization = marker.Organization,
                    TimeHour = marker.Hour,
                    TimeMinute = marker.Minute,
                    WeekDays = marker.WeekDays,
                    Votes = marker.Votes,
                    Links = new List<Link> { 
                        new Link { rel = "upvote", href = string.Format("/api/marker/{0}/upvote", marker.Id) },
                        new Link { rel = "downvote", href = string.Format("/api/marker/{0}/downvote", marker.Id) }
                    }
                });
            }


            return Json(result);
        }

        [Route("api/marker/{id}/upvote")]
        public async Task<IHttpActionResult> UpVote(string id)
        {
            var context = new FoodSignalingContext();

            var marker = await context.Markers.FindOneAndUpdateAsync(
                Builders<Marker>.Filter.Eq(p => p.Id, id),
                Builders<Marker>.Update.Inc(p => p.Votes, 1));

            return Json(new { Votes = marker.Votes + 1 });
        }

        [Route("api/marker/{id}/downvote")]
        public async Task<IHttpActionResult> DownVote(string id)
        {
            var context = new FoodSignalingContext();

            var marker = await context.Markers.FindOneAndUpdateAsync(
                Builders<Marker>.Filter.And(Builders<Marker>.Filter.Eq(p => p.Id, id), Builders<Marker>.Filter.Gt(p => p.Votes, 0)),
                Builders<Marker>.Update.Inc(p => p.Votes, -1));

            int votes = 0;
            if (marker != null)
                votes = marker.Votes - 1;

            return Json(new { Votes = votes });
        }
    }
}
