using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(FoodSignaling.Startup))]

namespace FoodSignaling
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
