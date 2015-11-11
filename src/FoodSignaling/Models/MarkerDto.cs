using FoodSignaling.Attributes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Web;

namespace FoodSignaling.Models
{
    public class MarkerDto
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [EnsureOneElement(ErrorMessage = "Select at least one weekday")]
        public List<int> WeekDays { get; set; }

        [Required(ErrorMessage="Please input the organization name")]
        public string Organization { get; set; }

        public int TimeHour { get; set; }

        public int TimeMinute { get; set; }

        public double Lat { get; set; }

        public double Lng { get; set; }

        public int Votes { get; set; }

        public List<Link> Links { get; set; }
    }

    public class Link{
        public string rel { get; set; }
        public string href { get; set; }
    }
}