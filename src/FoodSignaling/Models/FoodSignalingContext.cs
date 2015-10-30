using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace FoodSignaling.Models
{
    public class FoodSignalingContext
    {
        public const string CONNECTION_STRING_NAME = "FoodSignaling";
        public const string DATABASE_NAME = "test";
        public const string MARKERS_COLLECTION_NAME = "markers";
		
        // Could be an IoC container.
        private static readonly IMongoClient _client;
        private static readonly IMongoDatabase _database;

        static FoodSignalingContext()
        {
            var connectionString = ConfigurationManager.ConnectionStrings[CONNECTION_STRING_NAME].ConnectionString;
            _client = new MongoClient(connectionString);
            _database = _client.GetDatabase(DATABASE_NAME);
        }

        public IMongoClient Client
        {
            get { return _client; }
        }

        public IMongoCollection<Marker> Markers
        {
            get { return _database.GetCollection<Marker>(MARKERS_COLLECTION_NAME); }
        }
    }
}