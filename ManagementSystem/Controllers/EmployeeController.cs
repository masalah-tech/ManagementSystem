using ManagementSystem.Data;
using ManagementSystem.Models;
using ManagementSystem.Models.ViewModels;
using ManagementSystem.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ManagementSystem.Controllers
{
    [Authorize(Roles = SD.Role_Admin)]
    public class EmployeeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            IEnumerable<SelectListItem> departmentList =
                _context.Departments.Select(d => new SelectListItem
                {
                    Text = d.Name,
                    Value = d.Id.ToString()
                });


            return View(departmentList);
        }

        #region API_CALLs

        public IActionResult GetAll()
        {
            var employees =
                _context.Employees
                .Include(e => e.Department)
                .ToList();


            return Json(new { data = employees });
        }

        public IActionResult Get(int empId)
        {

            var employee =
                _context.Employees
                .Include(e => e.Department)
                .FirstOrDefault(e => e.Id == empId);

            if (employee == null)
            {
                return NotFound();
            }

            return Json(new { data = employee });
        }

        public IActionResult Edit(int empId, string empName, double empSalary, int empDeptId)
        {
            var employee =
                _context.Employees
                .Include(e => e.Department)
                .FirstOrDefault(e => e.Id == empId);

            if (employee == null)
            {
                return NotFound();
            }

            employee.Name = empName;
            employee.Salary = empSalary;
            employee.DepartmentId = empDeptId;

            _context.Employees.Update(employee);
            _context.SaveChanges();

            return Json(new { success = true, message = "Employee Updated Successfully" });
        }

        public IActionResult Delete(int empId)
        {
            var employee =
                _context.Employees
                .FirstOrDefault(e => e.Id == empId);

            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            _context.SaveChanges();

            return Json(new { success = true, message = "Employee Deleted Successfully" });
        }

        public IActionResult AddNew(string empName, double empSalary, int empDeptId)
        {

            var employee = new Employee
            {
                DepartmentId = empDeptId,
                Name = empName,
                Salary = empSalary
            };

            _context.Employees.Add(employee);
            _context.SaveChanges();


            return Json(new { success = true, message = "Employee added successfully" });
        }


        #endregion
    }
}
