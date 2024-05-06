Create Table Courses(
	CourseId int primary key identity(1,1) not null,
	CourseName varchar(30) not null,
)

go

Create table Students(
	StudentId int primary key identity(100,1) not null,
	StudentName varchar(30) not null,
	Dob date not null,
	MobileNo varchar(20) not null,
	ImageURL varchar(max) null,
	IsEnrolled bit not null,
	CourseId int references Courses(CourseId) on delete cascade on update cascade not null


)

go

Create Table Modules(
	ModuleId int primary key identity(1,1) not null,
	ModuleName varchar(50) not null,
	Duration int not null,
	StudentId int references Students(StudentId) on delete cascade on update cascade not null
)

