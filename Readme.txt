::Project Food Signaling
This project consists on a SPA using jQuery for client side interactions, ASP.NET WebAPI for the backend and MongoDB for the database.
The idea is to signal locations where organizations distribute food for the homeless. I came up with this because there is no cooperation between these private organizations. Volunteers will have a global visualization of these hotspots and help to better distribute by day and location.

::Usage
Just drag the marker to the map and fill the form

::Technologies
jQuery, Javascript, C#, ASP.NET MVC, ASP.NET WebApi, MongoDB, Bootstrap

::Folders
1.src - ASP.Net4 MVC application
2.dump - MongoDB dump of the collection 'markers'

::Setup
1.Create MongoDB database 'test'
2.Restore markers.json to the 'markers' collection
3.Create index: db.markers.createIndex( { Location : "2dsphere" } )
4.Edit Web.config with the connection string
5.Build the ASP.NET MVC solution to restore nuget packages
6.Run the application