using Microsoft.AspNetCore.Identity;

namespace ManagementSystem.Models.ViewModels
{
    public class UserVM
    {
        public IdentityUser User { get; set; }
        public IEnumerable<string> Roles { get; set; }
    }
}
