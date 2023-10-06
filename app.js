//the following structure are from Jerome, based on his portfolio, I adepted it to mine version

// loads several packages
const express = require("express");
const { engine } = require("express-handlebars");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");

const session = require("express-session");
const connectSqlite3 = require("connect-sqlite3");
const cookieParser = require("cookie-parser");

// MODEL (DATA)
const db = new sqlite3.Database("projects-jie.db");
// creates table projects at startup
db.run(
  "CREATE TABLE projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, ptype TEXT NOT NULL, pdesc TEXT NOT NULL, pimgURL TEXT NOT NULL)",
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
          name: "Lunar Lander",
          type: "Game",
          desc: "It is a fun game, people need to land the rocket before the fuel finishs.",
          url: "/img/lunarlander.png",
        },
        {
          id: "2",
          name: "Chicken survives",
          type: "Game",
          desc: "Try to survive as long as possible, the hen eats worms, and make small chicken, avoid the fox!",
          url: "/img/chickenSurvive.png",
        },
        {
          id: "3",
          name: "Todo list",
          type: "website",
          desc: "It is an useful tool to manage your day.",
          url: "/img/todo.png",
        },
        {
          id: "4",
          name: "Recipe website",
          type: "Website",
          desc: "It is a group project, we build up an Asian food website.",
          url: "/img/recipe.png",
        },
        {
          id: "5",
          name: "Gin branding",
          type: "Design",
          desc: "It is a branding project, I designed the logo, and it is a menu to guide using.",
          url: "/img/logo.png",
        },
        {
          id: "6",
          name: "JTH category cover design",
          type: "Design",
          desc: "I took part in the JTH category cover design, it is a good practice.",
          url: "/img/cover.png",
        },
        {
          id: "7",
          name: "Music magazine",
          type: "Design",
          desc: "This project is a group project, it is a magazine about the aesthetics of different music genre.",
          url: "/img/sound.png",
        },
      ];
      // inserts projects
      projects.forEach((oneProject) => {
        db.run(
          "INSERT INTO projects (pid, pname, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?)",
          [
            oneProject.id,
            oneProject.name,
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
  "CREATE TABLE skills (sid INTEGER PRIMARY KEY, sname TEXT NOT NULL, stype TEXT NOT NULL, spro TEXT NOT NULL)",
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
          name: "HTML",
          type: "Programming language",
          proficiency: "Competent",
        },
        {
          id: "2",
          name: "CSS",
          type: "Programming language",
          proficiency: "Competent",
        },
        {
          id: "3",
          name: "JavaScript",
          type: "Programming language",
          proficiency: "Competent",
        },
        {
          id: "4",
          name: "MidJourney",
          type: "Design",
          proficiency: "Skilled",
        },
        {
          id: "5",
          name: "Indesign",
          type: "Design",
          proficiency: "Competent",
        },
        {
          id: "6",
          name: "Photoshop",
          type: "Design",
          proficiency: "Competent",
        },
        {
          id: "7",
          name: "Illustrator",
          type: "Design",
          proficiency: "Competent",
        },
      ];

      // inserts skills
      skills.forEach((oneSkill) => {
        db.run(
          "INSERT INTO skills (sid, sname, sdesc, stype) VALUES (?, ?, ?, ?)",
          [oneSkill.id, oneSkill.name, oneSkill.type, oneSkill.proficiency],
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
        { id: "1", pid: "1", sid: "3" },
        { id: "2", pid: "2", sid: "1" },
        { id: "3", pid: "2", sid: "2" },
        { id: "4", pid: "2", sid: "3" },
        { id: "5", pid: "2", sid: "6" },
        { id: "6", pid: "3", sid: "1" },
        { id: "7", pid: "3", sid: "2" },
        { id: "8", pid: "3", sid: "2" },
        { id: "9", pid: "3", sid: "7" },
        { id: "10", pid: "4", sid: "1" },
        { id: "11", pid: "4", sid: "2" },
        { id: "12", pid: "4", sid: "3" },
        { id: "13", pid: "5", sid: "5" },
        { id: "14", pid: "5", sid: "6" },
        { id: "15", pid: "5", sid: "7" },
        { id: "16", pid: "6", sid: "4" },
        { id: "17", pid: "6", sid: "5" },
        { id: "18", pid: "7", sid: "4" },
        { id: "19", pid: "7", sid: "5" },
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
    req, (session.isAdmin = true);
    req.session.isLoggedIn = true;
    req.session.name = "Jie";
    res.redirect("/");
  } else {
    console.log("bad user");
    req, (session.isAdmin = false);
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
app.get("/about", (req, res) => {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("about.handlebars", model);
  console.log("SESSION:", session);
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

// renders a view WITH DATA!!!
app.get("/projects", (req, res) => {
  db.all("SELECT * FROM projects", function (error, theProjects) {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        projects: [],
      };
      // renders the page with the model
      res.render("projects.handlebars", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        projects: theProjects,
      };
      // renders the page with the model
      res.render("projects.handlebars", model);
    }
  });

  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("contact.handlebars", model);
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
