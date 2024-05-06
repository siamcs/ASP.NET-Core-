using Microsoft.EntityFrameworkCore;
using Test.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<StudentDbContext>(op => op.UseSqlServer(builder.Configuration.GetConnectionString("StudentCon")));


var app = builder.Build();
app.UseStaticFiles();
app.UseRouting();
app.MapControllerRoute(name: "Default", pattern: "{controller=Student}/{action=Index}/{id?}");
app.Run();