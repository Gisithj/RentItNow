using Microsoft.AspNetCore.Identity;

namespace RentItNow.Helpers
{
    public class RolesHelper
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RolesHelper(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task EnsureRolesExist(params string[] roles)
        {
            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
