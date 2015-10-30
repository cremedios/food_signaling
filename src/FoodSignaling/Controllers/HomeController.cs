using System.Web.Mvc;

namespace FoodSignaling.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
