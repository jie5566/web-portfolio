//the following structure are from Jerome, based on his portfolio, I adepted it to mine version

// loads several packages
const express = require("express");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");

const session = require("express-session");
const connectSqlite3 = require("connect-sqlite3");
const cookieParser = require("cookie-parser");

const sqlite3 = require("sqlite3");


// MODEL (DATA)
const db = new sqlite3.Database("projects-jie.db");
// defines the port
const port = 8080;
// creates the Express app
const app = express();

// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// define static directory "public"
app.use(express.static("public"));

//*************** MIDDLEWARES *******************/

//post forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//session

//store sessions in the database
const SQLiteStore = connectSqlite3(session);

//defines the session
app.use(
  session({
    store: new SQLiteStore({ db: "session-db.db" }),
    saveUninitialized: false,
    resave: false,
    secret: "lallalalladjakjdkasjdasjd",
  })
);

// defines a middleware to log all the incoming requests' URL
app.use((req, res, next) => {
  console.log("Req. URL: ", req.url);
  next();
});

/***
ROUTES
***/

//check the login and password of a user
app.post("/login", (req, res) => {
  const un = req.body.un;
  const pw = req.body.pw;

  if (un == "jie" && pw == "123") {
    console.log("jie here");
    req.session.isAdmin = true;
    req.session.isLoggedIn = true;
    req.session.name = "Jie";
    res.redirect("/");
  } else {
    console.log("bad user");
    req.session.isAdmin = false;
    req.session.isLoggedIn = false;
    req.session.name = "";
    res.redirect("/login");
  }
});

// renders a view with DATA, reder in homepage
app.get("/", (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("home.handlebars", model);
});

// renders a view with DATA, render in about
// app.get("/about", (req, res) => {
//   const model = {
//     isLoggedIn: req.session.isLoggedIn,
//     name: req.session.name,
//     isAdmin: req.session.isAdmin,
//   };
//   res.render("about.handlebars", model);
//   console.log("SESSION:", session);
// });

app.get("/about", (req, res) => {
  db.all("SELECT * FROM skills", function (error, theSkills) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        skills: [],
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };
      // renders the page with the model
      res.render("about.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        skills: theSkills,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };
      // renders the page with the model
      res.render("about.handlebars", model);
    }
  });
});

// renders a view with DATA, render in contact
app.get("/contact", (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("contact.handlebars", model);
});

// renders a view with DATA, render in login page
app.get("/login", (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("login.handlebars", model);
});

// renders a view WITH peoject DATA in projects
app.get("/projects", (req, res) => {
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        projects: [],
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };
      // renders the page with the model
      res.render("projects.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        projects: theProjects,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };
      // renders the page with the model
      res.render("projects.handlebars", model);
    }
  });
});

//modify a project
app.get("/projects/update/:id", (req, res) => {
  const id = req.params.id;

  db.get(
    "SELECT * FROM projects WHERE pid=?",
    [id],
    function (error, theproject) {
      if (error) {
        console.log("ERROR: ", error);
        const model = {
          dbError: true,
          theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        // renders the page with the model
        res.render("modifyproject.handlebars", model);
      } else {
        const model = {
          project: theproject,
          dbError: false,
          theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
          helpers: {
            theTypeG(value) {
              return value == "Game";
            },
            theTypeD(value) {
              return value == "Design";
            },
            theTypeW(value) {
              return value == "Website";
            },
            theTypeO(value) {
              return value == "Other";
            },
          },
        };
        // renders the page with the model
        res.render("modifyproject.handlebars", model);
      }
    }
  );
});

//modify an existing project
app.post("/projects/update/:id", (req, res) => {
  const id = req.params.id; //gets the id from the dynamic parameter in the route
  const newp = [
    req.body.projname,
    req.body.projdesc,
    req.body.projtype,
    req.body.projimg,
    id,
  ];
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run(
      "UPDATE projects SET pname =?, pdesc=?, ptype=?,pimgURL=? WHERE pid=?",
      newp,
      (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Project updated!");
        }
        // res.render("home.handlebars", model);
        res.redirect("/projects");
      }
    );
  } else {
    res.redirect("/login");
  }
});

//delete a project
app.get("/projects/delete/:id", (req, res) => {
  const id = req.params.id;
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run(
      "DELETE FROM projects WHERE pid=?",
      [id],
      function (error, theProjects) {
        if (error) {
          const model = {
            dbError: true,
            theError: error,
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin,
          };
          // renders the page with the model
          res.render("home.handlebars", model);
        } else {
          const model = {
            dbError: false,
            theError: "",
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin,
          };
          // renders the page with the model
          res.render("home.handlebars", model);
          res.redirect("/projects");
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

//sends the form for a new project
app.get("/projects/new", (req, res) => {
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    };
    res.render("newproject.handlebars", model);
  } else {
    res.redirect("/login");
  }
});

//create a new project
app.post("/projects/new", (req, res) => {
  const newp = [
    req.body.projname,
    req.body.projdesc,
    req.body.projtype,
    req.body.projimg,
  ];

  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run(
      "Insert into PROJECTS (pname, pdesc, ptype,pimgURL) VALUES (?, ?, ?, ?)",
      newp,
      (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Line added into the projects table!");
        }
        res.render("home.handlebars");
        res.redirect("/projects");
      }
    );
  } else {
    res.redirect("/login");
  }
});

// renders a view WITH peoject DATA in projects
// app.get("/projects", (req, res) => {
//   db.all("SELECT * FROM projects", function (error, theProjects) {
//     if (error) {
//       const model = {
//         dbError: true,
//         theError: error,
//         projects: [],
//         isLoggedIn: req.session.isLoggedIn,
//         name: req.session.name,
//         isAdmin: req.session.isAdmin,
//       };
//       // renders the page with the model
//       res.render("projects.handlebars", model);
//     } else {
//       const model = {
//         dbError: false,
//         theError: "",
//         projects: theProjects,
//         isLoggedIn: req.session.isLoggedIn,
//         name: req.session.name,
//         isAdmin: req.session.isAdmin,
//       };
//       // renders the page with the model
//       res.render("projects.handlebars", model);
//     }
//   });
// });

// In route handler for /about
// Add this route after other routes in app.js
app.get("/projects/skills/:id", (req, res) => {
  const skillId = req.params.id;

  // Query the database to get projects related to the selected skill
  db.all(
    "SELECT projects.* FROM projectsSkills JOIN projects ON projectsSkills.pid = projects.pid WHERE projectsSkills.sid = ?",
    [skillId],
    function (error, theProjects) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render("projectsBySkills.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          projects: theProjects,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render("projectsBySkills.handlebars", model);
      }
    }
  );
});

app.get("/skills/project/:id", (req, res) => {
  const projectId = req.params.id;

  // Query the database to get projects related to the selected skill
  db.all(
    "SELECT skills.* FROM projectsSkills JOIN skills ON projectsSkills.sid = skills.sid WHERE projectsSkills.pid = ?",
    [projectId],
    function (error, theSkills) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render("skillsforproject.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          skills: theSkills,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render("skillsforproject.handlebars", model);
      }
    }
  );
});

// sends back a SVG image if asked for "/favicon.ico"
app.get("/favicon.ico", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.sendFile(__dirname + "/img/jl.svg");
});

// run the server and make it listen to the port
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`);
});

module.exports = {
  db
}