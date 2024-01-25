using Microsoft.AspNetCore.Identity;

namespace ManagementSystem.Models.ViewModels
{
    public class EditUserVM
    {
        public IdentityUser User { get; set; }
        public string Role { get; set; }
    }
}
