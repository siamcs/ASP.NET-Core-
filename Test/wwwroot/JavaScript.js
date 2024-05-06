//Create Table Courses(
//	CourseId int primary key identity(1,1) not null,
//	CourseName varchar(30) not null,
//)
//go
//Create table Students(
//	StudentId int primary key identity(100,1) not null,
//	StudentName varchar(30) not null,
//	Dob date not null,
//	MobileNo varchar(20) not null,
//	ImageURL varchar(max) null,
//	IsEnrolled bit not null,
//	CourseId int references Courses(CourseId) on delete cascade on update cascade not null


//)
//go
//Create Table Modules(
//	ModuleId int primary key identity(1,1) not null,
//	ModuleName varchar(50) not null,
//	Duration int not null,
//	StudentId int references Students(StudentId) on delete cascade on update cascade not null
//)
//-------------------
//Scaffold-DbContext "Server=DESKTOP-LPHT97F; database=StudentDB; Trusted_Connection=true; TrustServerCertificate=true; Integrated Security=true" Microsoft.EntityframeworkCore.Sqlserver -outputDir Models  
//-------------
//Program:
//var builder = WebApplication.CreateBuilder(args);
//builder.Services.AddControllersWithViews();
//builder.Services.AddDbContext<StudentDbContext>(op => op.UseSqlServer(builder.Configuration.GetConnectionString("StudentCon")));


//var app = builder.Build();
//app.UseStaticFiles();
//app.UseRouting();
//app.MapControllerRoute(name: "Default", pattern: "{controller=Student}/{action=Index}/{id?}");
//app.Run();
//---------
//Layout:
//<!DOCTYPE html>

//<html>
//<head>
//    <meta name="viewport" content="width=device-width" />
//    <title>@ViewBag.Title</title>
//    <link href="~/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
//</head>
//<body>
//    <div class="container">
//        <ul>
//            <a class="nav-link" asp-area="" asp-action="Index" asp-controller="Student" class="nav-link">Home</a>           
//        </ul>
//        @RenderBody()
//    </div>
//</body>
//</html>
//<script src="~/jquery/jquery.min.js"></script>
//<script src="~/bootstrap/js/bootstrap.min.js"></script>

//-----
//Controller:
//    public class StudentController:Controller
//    {
//        private readonly StudentDbContext _db;
//        private readonly IWebHostEnvironment _webHost;

//        public StudentController(StudentDbContext db, IWebHostEnvironment webHost)
//        {
//            _db = db;
//            _webHost = webHost;
//        }
//        public IActionResult Index()
//        {
//            var applicants = _db.Students.Include(i => i.Modules).ToList();
//            applicants = _db.Students.Include(a => a.Course).ToList();
//            return View(applicants);
//        }
//        public JsonResult GetCourses()
//        {
//            List<SelectListItem> cors = (from cor in _db.Courses
//                                         select new SelectListItem
//                                         {
//                                             Value = cor.CourseId.ToString(),
//                                             Text = cor.CourseName
//                                         }).ToList();
//            return Json(cors);
//        }
//        public IActionResult Create()
//        {
//            StudentViewModel student = new StudentViewModel();
//            student.Courses = _db.Courses.ToList();
//            student.Modules.Add(new Module() { ModuleId = 1 });

//            return View(student);
//        }
//        [HttpPost]

//        public IActionResult Create(StudentViewModel student)
//        {
//            string uniqueFileName = GetUploadedFileName(student);
//            student.ImageUrl = uniqueFileName;
//            Student obj = new Student();
//            obj.StudentName = student.StudentName;
//            obj.CourseId = student.CourseId;
//            obj.MobileNo = student.MobileNo;
//            obj.IsEnrolled = student.IsEnrolled;
//            obj.Dob = student.Dob;
//            obj.ImageUrl = student.ImageUrl;
//            _db.Add(obj);
//            _db.SaveChanges();
//            var user = _db.Students.FirstOrDefault(x => x.MobileNo == student.MobileNo);
//            if (user != null)
//            {
//                if (student.Modules.Count > 0)
//                {
//                    foreach (var item in student.Modules)
//                    {
//                        Module objM = new Module();
//                        objM.StudentId = user.StudentId;
//                        objM.Duration = item.Duration;
//                        objM.ModuleName = item.ModuleName;                        
//                        _db.Add(objM);
//                    }
//                }
//            }
//            _db.SaveChanges();
//            return RedirectToAction("index");
//        }


//        public ActionResult Delete(int? id)
//        {
//            var app = _db.Students.Find(id);
//            var existsModules = _db.Modules.Where(e => e.StudentId == id).ToList();
//            foreach (var exp in existsModules)
//            {
//                _db.Modules.Remove(exp);
//            }
//            _db.Entry(app).State = EntityState.Deleted;
//            _db.SaveChanges();
//            return RedirectToAction("Index");
//        }



//        private string GetUploadedFileName(StudentViewModel student)
//        {
//            string uniqueFileName = null;

//            if (student.ProfileFile != null)
//            {
//                string uploadsFolder = Path.Combine(_webHost.WebRootPath, "images");
//                uniqueFileName = Guid.NewGuid().ToString() + "_" + student.ProfileFile.FileName;
//                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
//                using (var fileStream = new FileStream(filePath, FileMode.Create))
//                {
//                    student.ProfileFile.CopyTo(fileStream);
//                }
//            }
//            return uniqueFileName;
//        }        

//        [HttpGet]
//        public ActionResult Edit(int? id)
//        {
//            Student app = _db.Students.Include(a => a.Modules).FirstOrDefault(x => x.StudentId == id);

//            if (app != null)
//            {
//                StudentViewModel aps = new StudentViewModel()
//                {
//                    StudentId = app.StudentId,
//                    StudentName = app.StudentName,
//                    MobileNo = app.MobileNo,
//                    Dob = app.Dob,
//                    ImageUrl = app.ImageUrl,
//                    CourseId = app.CourseId,
//                    IsEnrolled = app.IsEnrolled,
//                    Courses = _db.Courses.ToList(),
//                    Modules = app.Modules.ToList()
//                };

//                return View("Edit", aps);
//            }

//            return View();
//        }

//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public ActionResult Edit(StudentViewModel student)
//        {
//            try
//            {
//                Student existingStudent = _db.Students
//                    .Include(a => a.Modules)
//                    .FirstOrDefault(x => x.StudentId == student.StudentId);

//                if (existingStudent != null)
//                {
//                    existingStudent.StudentName = student.StudentName;
//                    existingStudent.CourseId = student.CourseId;
//                    existingStudent.MobileNo = student.MobileNo;
//                    existingStudent.IsEnrolled = student.IsEnrolled;
//                    existingStudent.Dob = student.Dob;

//                    if (student.ProfileFile != null)
//                    {
//                        string uniqueFileName = GetUploadedFileName(student);
//                        existingStudent.ImageUrl = uniqueFileName;
//                    }

//                    existingStudent.Modules.Clear();
//                    foreach (var item in student.Modules)
//                    {
//                        var newModule = new Module
//                        {
//                            StudentId = existingStudent.StudentId,
//                            ModuleName = item.ModuleName,
//                            Duration = item.Duration
//                        };

//                        existingStudent.Modules.Add(newModule);
//                    }

//                    _db.SaveChanges();

//                    return RedirectToAction("Index");
//                }

//                return NotFound();
//            }
//            catch (DbUpdateConcurrencyException ex)
//            {

//                var entry = ex.Entries.FirstOrDefault();
//                if (entry != null)
//                {
//                    var databaseValues = entry.GetDatabaseValues();
//                    if (databaseValues != null)
//                    {
//                        var databaseStudent = (Student)databaseValues.ToObject();

//                        ModelState.AddModelError("", "The entity you are trying to edit has been modified by another user. Please refresh the page and try again.");

                        
//                        entry.OriginalValues.SetValues(databaseValues);

                        
//                        student.Courses = _db.Courses.ToList();
//                        student.Modules = databaseStudent.Modules.ToList();

//                        return View("Edit", student);
//                    }
//                }

//                ModelState.AddModelError("", "The entity you are trying to edit has been deleted by another user.");
                
//            }

//            return RedirectToAction("Index");
//        }      


//    }

//-------
//Index:
//@model IEnumerable<Student>
//@{
//    Layout = "~/Views/Shared/_Layout.cshtml";
//}

//<p>
//    <a href="@Url.Action("Create", "Student")" id="btnCreate" class="btn btn-primary">Add Student Info</a>
//</p>

//<h4>Student List</h4>
//<div class="row">
//    @foreach (var item in Model)
//    {
//        <div class="card mb-2">
//            <div class="card-header d-flex justify-content-between">
//                <img src="~/Images/@item.ImageUrl" width="50" height="50" class="rounded">
//                <label class="m-2"><b>Name:</b> @Html.DisplayFor(m => item.StudentName)</label><br>
//                <label class="m-2"><b>Mobile:</b> @Html.DisplayFor(m => item.MobileNo)</label><br>
//                <label class="m-2"><b>Date of Birth:</b> @item.Dob.ToShortDateString()</label><br> 
//                <label class="m-2"><b>IsEnrolled?:</b> @Html.DisplayFor(m => item.IsEnrolled)</label><br>
//                <label class="m-2"><b>Course Name:</b> @Html.DisplayFor(m => item.Course.CourseName)</label>
//            </div>
//            <div>
//                <a href="@Url.Action("Edit", "Student", new { id = item.StudentId })" class="btn btn-secondary">Edit Student Info</a>|
//                <a href="@Url.Action("Delete", "Student", new { id = item.StudentId })" class="btn btn-danger">Delete Student Info</a>
//            </div>
//            <div class="card-body">
//                @Html.Partial("_IndexModuleTable", item)
//            </div>
//        </div>
//    }
//</div>


//-----
//Create:


//@model StudentViewModel
//@{
//    Layout = "~/Views/Shared/_Layout.cshtml";
//}
//<hr />
//<div class="card">
//    <div class="card-header bg-primary text-uppercase text-white" style="height:45px">
//        <h4>Add Student Info</h4>
//    </div>
//    <form id="createForm" asp-action="Create" enctype="multipart/form-data">
//        <div class="row">
//            <div class="col-md-6">
//                <div class="form-group">
//                    <label asp-for="StudentName" class="control-label"></label>
//                    <input asp-for="StudentName" class="form-control" />
//                    <span asp-validation-for="StudentName" class="text-danger"></span>
//                </div>
//            </div>
//            <div class="col-md-6">
//                <div class="form-group">
//                    <label asp-for="Dob" class="control-label"></label>
//                    <input asp-for="Dob" class="form-control" />
//                    <span asp-validation-for="Dob" class="text-danger"></span>
//                </div>
//            </div>
//            <div class="col-md-6">
//                <div class="form-group">
//                    <label asp-for="CourseName" class="control-label"></label>
//                    <select class="form-control country" asp-for="CourseId" asp-items="@(new SelectList(Model.Courses,"CourseId","CourseName"))"> <option value="0">---Select One---</option></select>

//                    <span asp-validation-for="CourseId" class="text-danger"></span>
//                </div>
//            </div>
//            <div class="col-md-6">
//                <div class="form-group">
//                    <label asp-for="MobileNo" class="control-label"></label>
//                    <input asp-for="MobileNo" class="form-control" />
//                    <span asp-validation-for="MobileNo" class="text-danger"></span>
//                </div>
//            </div>
//            <div class="col-md-6">
//                <div class="form-group">
//                    <label asp-for="IsEnrolled" class="control-label"></label>
//                    <input type="checkbox" asp-for="IsEnrolled" />
//                    <span asp-validation-for="IsEnrolled" class="text-danger"></span>
//                </div>
//            </div>
//            <div class="col-md-6 btn-group">
//                <div class="form-group col-8 p-0">
//                    <label asp-for="ProfileFile" class="control-label"></label>
//                    <div class="customFile">
//                        <input asp-for="ProfileFile" type="file" class="custom-file-input" id="customFile" onchange="document.getElementById('PreviewPhoto').src= window.URL.createObjectURL(this.files[0])" />
//                        <label class="custom-file-label invisible" for="customFile">Choose File</label>
//                    </div>
//                </div>
//                <div class="form-group col-4">
//                    <img id="PreviewPhoto" src="~/images/noimage.png" width="125" height="125" style="border:1px;margin-top:20px;" />
//                </div>
//            </div>
//            <div class="col-md-12">
//                <div id="modulesTableContainer">
//                    @Html.Partial("_ModulesTable", Model.Modules)
//                </div>
//                <div class="form-group" style="text-align: center;">
//                    <button type="button" class="btn btn-primary" onclick="AddModule()" >Add Module</button>
//                </div>
//            </div>
//            <div class="col-12 btn-group">
//                <div class="col-6 form-group">
//                    <div class="col-6-group text-right p-2">
//                        <a asp-action="Index" class="btn btn-secondary">&nbsp;Back to List&nbsp;</a>
//                        <input id="submitForm" type="submit" value="Add Student Info" class="btn btn-success" />
//                    </div>
//                </div>
//            </div>
//        </div>
//    </form>
//</div>

//<script>
//    $(".custom-file-input").on("change", function () {
//        var fileName = $(this).val().split("\\").pop();
//        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
//    });

//    function DeleteItem(btn) {
//        $(btn).closest('tr').remove();
//    }

//    function AddModule() {
//        var lastRowIndex = parseInt($("#hdnLastIndex").val());
//        var newRow = '<tr>' +
//            '<td><input type="text" class="form-control" name="Modules[' + lastRowIndex + '].ModuleName" /></td>' +
//            '<td><input type="number" class="form-control" name="Modules[' + lastRowIndex + '].Duration" /></td>' +
//            '<td><button type="button" class="btn btn-danger" onclick="DeleteItem(this)">Delete</button></td>' +
//            '</tr>';
//        $("#ExpTable tbody").append(newRow);
//        $("#hdnLastIndex").val(lastRowIndex + 1);
//    }

//    $("#createForm").submit(function (event) {
//        event.preventDefault();
//        var formData = new FormData(this);

//        $.ajax({
//            type: "post",
//            url: "/Student/Create",
//            contentType: false,
//            processData: false,
//            data: formData,
//            success: function (data) {
//                alert("Created");
//            },
//            error: function (err) {
//                alert("Error Occurred");
//            }
//        });
//    });
//</script>

//------

//Edit:

//@model StudentViewModel
//@{
//    Layout = "~/Views/Shared/_Layout.cshtml";
//}
//<hr />
//<div class="card">
//    <div class="card-header">
//        <h4 style="text-align:center">Update Student Info</h4>
//    </div>
//    <form id="editForm" asp-action="Edit" enctype="multipart/form-data">
//        <div class="row">
//            <div class="col-6">
//                @Html.HiddenFor(x => x.StudentId)
//                <div class="form-group">
//                    <label asp-for="StudentName" class="control-label"></label>
//                    <input asp-for="StudentName" class="form-control" />
//                    <span asp-validation-for="StudentName" class="text-danger"></span>
//                </div>
//                <div class="form-group">
//                    <label asp-for="Dob" class="control-label"></label>
//                    <input asp-for="Dob" class="form-control" />
//                    <span asp-validation-for="Dob" class="text-danger"></span>
//                </div>
//                <div class="form-group">
//                    <label asp-for="MobileNo" class="control-label"></label>
//                    <input asp-for="MobileNo" class="form-control" />
//                    <span asp-validation-for="MobileNo" class="text-danger"></span>
//                </div>

//                <div class="form-group">
//                    <label asp-for="IsEnrolled" class="control-label"></label>
//                    <input type="checkbox" asp-for="IsEnrolled" />
//                    <span asp-validation-for="IsEnrolled" class="text-danger"></span>
//                </div>

//                <div class="form-group">
//                    <label>Course</label>
//                    <select class="form-control" asp-for="CourseId" asp-items="@(new SelectList(Model.Courses, "CourseId", "CourseName"))"></select>
//                    <span asp-validation-for="CourseId" class="text-danger"></span>
//                </div>
//                <div class="form-group">
//                    <div>
//                        <img id="PreviewPhoto" src="~/images/@Model.ImageUrl" width="125" height="125" style="border:1px;margin-top:20px;" />
//                    </div>
//                    <label asp-for="ProfileFile" class="control-label"></label>
//                    <div class="customFile">
//                        <input asp-for="ProfileFile" type="file" class="custom-file-input" id="customFile" onchange="document.getElementById('PreviewPhoto').src= window.URL.createObjectURL(this.files[0])" />
//                        <label class="custom-file-label invisible" for="customFile"></label>
//                    </div>
//                </div>
//            </div>
//            <div class="col-6">
//                <div class="col-md-12">
//                    <h5 style="text-align:center">Edit Modules</h5>
//                    <div id="modulesTableContainer">
//                        @Html.Partial("_ModulesTable", Model.Modules)
//                    </div>
//                    <div class="form-group" style="text-align: center;">
//                        <button type="button" class="btn btn-primary" onclick="AddModule()">Add Module</button>
//                    </div>
//                </div>
//                <input type="hidden" id="hdnLastIndex" value="0" />
//            </div>
//            <div class="col-6-group text-right p-2">
//                <a asp-action="Index" class="btn btn-secondary">&nbsp;Back to List&nbsp;</a>
//                <input id="submitForm" type="submit" value="Update Student Info" class="btn btn-primary" />
//            </div>
//        </div>
//    </form>
//</div>
//<script src="~/jquery/jquery.min.js"></script>
//<script>
//    $(".custom-file-input").on("change", function () {
//        var fileName = $(this).val().split("\\").pop();
//        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
//        document.getElementById('PreviewPhoto').src = window.URL.createObjectURL(this.files[0]);
//    });

//    function DeleteItem(btn) {
//        $(btn).closest('tr').remove();
//    }

//    function AddModule() {
//        var lastRowIndex = parseInt($("#hdnLastIndex").val());
//        var newRow =
//            '<tr>' +
//            '<td><input type="text" class="form-control" name="Modules[' + lastRowIndex + '].ModuleName" /></td>' +
//            '<td><input type="number" class="form-control" name="Modules[' + lastRowIndex + '].Duration" /></td>';
//        if (lastRowIndex > 0) {
//            newRow += '<td><button type="button" class="btn btn-danger" onclick="DeleteItem(this)">Remove</button></td>';
//        } else {
//            newRow += '<td></td>'; 
//        }

//        newRow += '</tr>';

//        $("#ExpTable tbody").append(newRow);
//        $("#hdnLastIndex").val(lastRowIndex + 1);

//        if (lastRowIndex === 0) {
//            $(".add-module-button").hide();
//        }
//    }


//    $("#submitForm").click(function () {
//        var formData = new FormData(document.getElementById("editForm"));

//        $.ajax({
//            type: "post",
//            url: "/Student/Edit",
//            contentType: false,
//            processData: false,
//            data: formData,
//            success: function (data) {
//                alert("Edited");
//            },
//            error: function (err) {
//                alert("Error Occurred");
//            }
//        });
//    });
//</script>



//---
//Partial:


//@model List<Module>

//<table id="ExpTable" class="table table-striped table-sm">
//    <thead>
//        <tr>
//            <th>Module Name</th>
//            <th>Module Duration</th>
//            <th></th>
//        </tr>
//    </thead>
//    <tbody>
//        @for (int i = 0; i < Model.Count; i++)
//        {
//            <tr>
//                <td>
//                    <input type="text" class="form-control" name="Modules[@i].ModuleName" value="@Model[i].ModuleName" />
//                </td>
//                <td>
//                    <input type="number" class="form-control" name="Modules[@i].Duration" value="@Model[i].Duration" />
//                </td>
//                <td>
//                    @if (i > 0)
//                    {
//                        <button type="button" class="btn btn-danger" onclick="DeleteItem(this)">Remove</button>
//                    }
                    
//                </td>
//            </tr>
//        }
//    </tbody>
//</table>

//<input type="hidden" id="hdnLastIndex" value="@Model.Count" />



//-------
//@model Student

//<table class="table table-striped">
//    <thead>
//        <tr>
//            <th>Module Name</th>
//            <th>Module Duration</th>
//        </tr>
//    </thead>
//    <tbody>
//        @foreach (var exp in Model.Modules)
//        {
//            <tr>
//                <td>@Html.DisplayFor(e => exp.ModuleName)</td>
//                <td>@Html.DisplayFor(e => exp.Duration)</td>
//            </tr>
//        }
//    </tbody>
//</table>