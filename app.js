const express = require("express"); // loads the express package
const { engine } = require("express-handlebars"); // loads handlebars for Express

//sqlite3
const sqlite3 = require("sqlite3");

// MODEL (DATA)
const db = new sqlite3.Database("projects-jie.db");

// creates table projects at startup
db.run(
  "CREATE TABLE projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, pyear INTEGER NOT NULL, pdesc TEXT NOT NULL, ptype TEXT NOT NULL, pimgURL TEXT NOT NULL)",
  (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error);
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table projects created!");

      const projects = [
        {
          id: "1",
          name: "Counting people with a camera",
          type: "research",
          desc: "The purpose of this project is to count people passing through a corridor and to know how many are in the room at a certain time.",
          year: 2022,
          dev: "Python and OpenCV (Computer vision) library",
          url: "/img/counting.png",
        },
        {
          id: "2",
          name: "Visualisation of 3D medical images",
          type: "research",
          desc: "The project makes a 3D model of the analysis of the body of a person and displays the detected health problems. It is useful for doctors to view in 3D their patients and the evolution of a disease.",
          year: 2012,
          url: "/img/medical.png",
        },
        {
          id: "3",
          name: "Multiple questions system",
          type: "teaching",
          desc: "During the lockdowns in France, this project was useful to test the students online with a Quizz system.",
          year: 2021,
          url: "/img/qcm07.png",
        },
        {
          id: "4",
          name: "Image comparison with the Local Dissmilarity Map",
          desc: "The project is about finding and quantifying the differences between two images of the same size. The applications were numerous: satallite imaging, medical imaging,...",
          year: 2020,
          type: "research",
          url: "/img/diaw02.png",
        },
        {
          id: "5",
          name: "Management system for students' internships",
          desc: "This project was about the creation of a database to manage the students' internships.",
          year: 2012,
          type: "teaching",
          url: "/img/management.png",
        },
      ];
      // inserts projects
      projects.forEach((oneProject) => {
        db.run(
          "INSERT INTO projects (pid, pname, pyear, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?, ?)",
          [
            oneProject.id,
            oneProject.name,
            oneProject.year,
            oneProject.desc,
            oneProject.type,
            oneProject.url,
          ],
          (error) => {
            if (error) {
              console.log("ERROR: ", error);
            } else {
              console.log("Line added into the projects table!");
            }
          }
        );
      });
    }
  }
);

// creates skills projects at startup
db.run(
  "CREATE TABLE skills (sid INTEGER PRIMARY KEY, sname TEXT NOT NULL, sdesc TEXT NOT NULL, stype TEXT NOT NULL)",
  (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error);
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table skills created!");

      const skills = [
        {
          id: "1",
          name: "PHP",
          type: "Programming language",
          desc: "Programming with PHP on the server side.",
        },
        {
          id: "2",
          name: "Python",
          type: "Programming language",
          desc: "Programming with Python.",
        },
        {
          id: "3",
          name: "Java",
          type: "Programming language",
          desc: "Programming with Java.",
        },
        {
          id: "4",
          name: "ImageJ",
          type: "Framework",
          desc: "Java Framework for Image Processing.",
        },
        {
          id: "5",
          name: "Javascript",
          type: "Programming language",
          desc: "Programming with Javascript on the client side.",
        },
        {
          id: "6",
          name: "Node",
          type: "Programming language",
          desc: "Programming with Javascript on the server side.",
        },
        {
          id: "7",
          name: "Express",
          type: "Framework",
          desc: "A framework for programming Javascript on the server side.",
        },
        {
          id: "8",
          name: "Scikit-image",
          type: "Library",
          desc: "A library for Image Processing with Python.",
        },
        {
          id: "9",
          name: "OpenCV",
          type: "Library",
          desc: "A library for Image Processing with Python.",
        },
      ];

      // inserts skills
      skills.forEach((oneSkill) => {
        db.run(
          "INSERT INTO skills (sid, sname, sdesc, stype) VALUES (?, ?, ?, ?)",
          [oneSkill.id, oneSkill.name, oneSkill.desc, oneSkill.type],
          (error) => {
            if (error) {
              console.log("ERROR: ", error);
            } else {
              console.log("Line added into the skills table!");
            }
          }
        );
      });
    }
  }
);

// creates table projectsSkills at startup
db.run(
  "CREATE TABLE projectsSkills (psid INTEGER PRIMARY KEY, pid INTEGER, sid INTEGER, FOREIGN KEY (pid) REFERENCES projects (pid), FOREIGN KEY (sid) REFERENCES skills (sid))",
  (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error);
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table projectsSkills created!");

      const projectsSkills = [
        { id: "1", pid: "1", sid: "2" },
        { id: "2", pid: "1", sid: "8" },
        { id: "3", pid: "1", sid: "9" },
        { id: "4", pid: "2", sid: "3" },
        { id: "5", pid: "2", sid: "4" },
        { id: "6", pid: "3", sid: "1" },
        { id: "7", pid: "4", sid: "2" },
        { id: "8", pid: "4", sid: "8" },
        { id: "9", pid: "4", sid: "9" },
        { id: "10", pid: "5", sid: "1" },
      ];
      // inserts projectsSkills
      projectsSkills.forEach((oneProjectSkill) => {
        db.run(
          "INSERT INTO projectsSkills (psid, pid, sid) VALUES (?, ?, ?)",
          [oneProjectSkill.id, oneProjectSkill.pid, oneProjectSkill.sid],
          (error) => {
            if (error) {
              console.log("ERROR: ", error);
            } else {
              console.log("Line added into the projectsSkills table!");
            }
          }
        );
      });
    }
  }
);

const port = 8080; // defines the port
const app = express(); // creates the Express application

// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// define static directory "public" to access css/ and img/
app.use(express.static("public"));

// MODEL (DATA)
const humans = [
  { id: "0", name: "Jerome" },
  { id: "1", name: "Mira" },
  { id: "2", name: "Linus" },
  { id: "3", name: "Susanne" },
  { id: "4", name: "Jasmin" },
];

// CONTROLLER (THE BOSS)
// defines route "/"
app.get("/", function (request, response) {
  response.render("home.handlebars");
});

// defines route "/humans"
app.get("/humans", function (request, response) {
  const model = { listHumans: humans }; // defines the model
  // in the next line, you should send the abovedefined
  // model to the page and not an empty object {}...
  response.render("humans.handlebars", model);
});

// defines route "/humans/1"
app.get("/humans/:id", function (request, response) {
  const humanId = request.params.id;
  const model = humans[humanId]; // defines the model
  // in the next line, you should send the abovedefined
  // model to the page and not an empty object {}...
  response.render("human.handlebars", model);
});

// defines the final default route 404 NOT FOUND
app.use(function (req, res) {
  res.status(404).render("404.handlebars");
});

// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`);
});
