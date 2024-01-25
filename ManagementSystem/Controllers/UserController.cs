using ManagementSystem.Data;
using ManagementSystem.Models.ViewModels;
using ManagementSystem.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ManagementSystem.Controllers
{
    [Authorize(Roles = SD.Role_Admin)]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserController(ApplicationDbContext context,
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public IActionResult Index()
        {
            IEnumerable<SelectListItem> roleList = _roleManager.Roles.Select(r => new SelectListItem
            {
                Text = r.Name,
                Value = r.Name
            });

            return View(roleList);
        }

        #region
        [HttpGet]
        public IActionResult GetAll()
        {
            var users =
                _context.Users
                .ToList();

            var userVMs = new List<UserVM>();

            foreach (var user in users)
            {
                var roles = _userManager.GetRolesAsync(user).GetAwaiter().GetResult();

                userVMs.Add(new UserVM
                {
                    User = user,
                    Roles = roles
                });
            }


            return Json(new { data = userVMs });
        }

        public IActionResult Delete(string userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            _userManager.DeleteAsync(user);

            return Json(new { success = true, message = "User deleted successfully" } );
        }

        public IActionResult Get(string userId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            var role = _userManager.GetRolesAsync(user).GetAwaiter().GetResult()[0];

            EditUserVM editUserVM = new EditUserVM
            {
                User = user,
                Role = role,
            };

            return Json(new { success = true, data = editUserVM } );
        }

        public IActionResult UpdateUser(string userId, string username, 
            string userEmail, string role)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            user.UserName = username;
            user.Email = userEmail;


            _userManager.RemoveFromRolesAsync(user, _userManager.GetRolesAsync(user).GetAwaiter().GetResult()).GetAwaiter().GetResult();
            _userManager.AddToRoleAsync(user, role).GetAwaiter().GetResult();

            _context.SaveChanges();

            return Json(new { success = true, message = "User Updated successfully" });
        }

        #endregion
    }
}
