using ManagementSystem.Data;
using ManagementSystem.Models;
using ManagementSystem.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ManagementSystem.Controllers
{
    [Authorize(Roles = SD.Role_Admin)]
    public class DepartmentController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DepartmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region API_CALLs

        public IActionResult GetAll()
        {
            var departments =
                _context.Departments
                .ToList();


            return Json(new { data = departments });
        }

        public IActionResult Get(int deptId)
        {
            var department =
                _context.Departments
                .FirstOrDefault(d => d.Id == deptId);

            if (department == null)
            {
                return NotFound();
            }

            return Json(new { data = department });
        }

        public IActionResult Edit(int deptId, string name)
        {
            var department =
                _context.Departments
                .FirstOrDefault(d => d.Id == deptId);

            if (department == null)
            {
                return NotFound();
            }

            department.Name = name;

            _context.Departments.Update(department);
            _context.SaveChanges();

            return Json(new { success = true, message = "Department Updated Successfully" });
        }

        public IActionResult Delete(int deptId)
        {
            var department =
                _context.Departments
                .FirstOrDefault(d => d.Id == deptId);

            if (department == null)
            {
                return NotFound();
            }

            _context.Departments.Remove(department);
            _context.SaveChanges();

            return Json(new { success = true, message = "Department Deleted Successfully" });
        }

        public IActionResult AddNew(string deptName)
        {
            var department = new Department
            {
                Name = deptName,
            };

            _context.Departments.Add(department);
            _context.SaveChanges();


            return Json(new { success = true, message = "Department added successfully" });
        }


        #endregion
    }
}
