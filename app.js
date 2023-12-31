//the following structure are from Jerome, based on his portfolio, I adepted it to mine version

// loads several packages
const express = require("express");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");

const session = require("express-session");
const connectSqlite3 = require("connect-sqlite3");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

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

// check the login and password of a user
// app.post("/login", (req, res) => {
//   const un = req.body.un;
//   const pw = req.body.pw;

//   if (un == "jie" && pw == "123") {
//     console.log("jie here");
//     req.session.isAdmin = true;
//     req.session.isLoggedIn = true;
//     req.session.name = "Jie";
//     res.redirect("/");
//   } else {
//     console.log("bad user");
//     req.session.isAdmin = false;
//     req.session.isLoggedIn = false;
//     req.session.name = "";
//     res.redirect("/login");
//   }
// });

app.post("/login", (req, res) => {
  const un = req.body.un;
  const pw = req.body.pw;

  db.get("SELECT * FROM users WHERE username = ?", [un], (err, user) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.redirect("/login"); // Handle the error by redirecting to the login page
    } else if (user) {
      // User found in the database, now compare passwords
      bcrypt.compare(pw, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          res.redirect("/login"); // Handle the error by redirecting to the login page
        } else if (result) {
          // Passwords match
          req.session.userId = user.uid;
          req.session.username = user.username;
          req.session.isAdmin = user.isAdmin;
          req.session.isLoggedIn = true;
          req.session.name = user.uname;
          req.session.profile_id = user.profile_id;
          res.redirect("/");
        } else {
          // Passwords do not match
          req.session.isAdmin = false;
          req.session.isLoggedIn = false;
          req.session.name = "";
          res.redirect("/login");
        }
      });
    } else {
      // User not found
      req.session.isAdmin = false;
      req.session.isLoggedIn = false;
      req.session.name = "";
      res.redirect("/login");
    }
  });
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

//security
app.get("/", (req, res) => {
  console.log("SESSION: ", req.session);

  // saltRound = 12;
  // bcrypt.hash("123", saltRound, function (err, hash) {
  //   if (err) {
  //     console.log("Error encrypting the password: ", err);
  //   } else {
  //     console.log("Hashed password (GENERATE only ONCE): ", hash);
  //   }
  // });

  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin,
  };
  res.render("home.handlebars", model);
});

//reder about page, which contains my skills
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

// logout
app.get("/logout", function (req, res) {
  const model = {
    isAdmin: false,
    isLoggedIn: false,
  };
  req.session.destroy();
  res.render("home.handlebars", model);
});

//projects part,it is a page show all my projects
//pagination
// Update the /projects route
app.get("/projects", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the current page from the query parameter
  const itemsPerPage = 3; // Number of items to display per page

  const startIndex = (page - 1) * itemsPerPage;

  // Query the database to get the total count of projects
  db.get("SELECT COUNT(*) AS count FROM projects", [], (error, result) => {
    if (error) {
      const model = {
        dbError: true,
        theError: error,
        projects: [],
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      };
      res.render("projects.handlebars", model);
    } else {
      const totalProjectsCount = result.count;

      // Query the database to get a subset of projects based on pagination
      db.all(
        "SELECT * FROM projects LIMIT ? OFFSET ?",
        [itemsPerPage, startIndex],
        function (error, theProjects) {
          if (error) {
            const model = {
              dbError: true,
              theError: error,
              projects: [],
              isLoggedIn: req.session.isLoggedIn,
              name: req.session.name,
              isAdmin: req.session.isAdmin,
            };
            res.render("projects.handlebars", model);
          } else {
            const model = {
              dbError: false,
              theError: "",
              projects: theProjects,
              isLoggedIn: req.session.isLoggedIn,
              name: req.session.name,
              isAdmin: req.session.isAdmin,
              totalPages: Math.ceil(totalProjectsCount / itemsPerPage),
              notFirstPage: page > 1,
              notLastPage: page < Math.ceil(totalProjectsCount / itemsPerPage),
              prevPage: page > 1 ? page - 1 : null,
              nextPage:
                page < Math.ceil(totalProjectsCount / itemsPerPage)
                  ? page + 1
                  : null,
              pageNumbers: Array.from(
                { length: Math.ceil(totalProjectsCount / itemsPerPage) },
                (_, i) => ({ page: i + 1, isCurrentPage: i + 1 === page })
              ),
            };
            res.render("projects.handlebars", model);
          }
        }
      );
    }
  });
});

// // renders a view WITH project DATA in projects
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

app.get("/projects/details/:id", (req, res) => {
  const projectId = req.params.id;

  // Query the database to get project details
  db.get(
    "SELECT * FROM projects WHERE pid = ?",
    [projectId],
    function (error, project) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render("projectDetails.handlebars", model);
      } else if (project) {
        // Query the database to get skills associated with the project
        db.all(
          "SELECT skills.* FROM projectsSkills JOIN skills ON projectsSkills.sid = skills.sid WHERE projectsSkills.pid = ?",
          [projectId],
          function (error, skills) {
            if (error) {
              const model = {
                dbError: true,
                theError: error,
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin,
              };
              res.render("projectDetails.handlebars", model);
            } else {
              const model = {
                dbError: false,
                theError: "",
                project: project,
                skills: skills,
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin,
              };
              res.render("projectDetails.handlebars", model);
            }
          }
        );
      } else {
        // Project not found
        const model = {
          dbError: false,
          theError: "",
          project: null,
          skills: [],
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        };
        res.render("project-details.handlebars", model);
      }
    }
  );
});

//--------------------------skills parts-------------------------------------

// deleting a skill
app.get("/skills/delete/:sid", (req, res) => {
  if (req.session.isLoggedIn && req.session.isAdmin) {
    const skillId = req.params.sid; // Extract the skill ID from the URL
    // Add code to query your database and delete the skill based on the skillId
    db.run("DELETE FROM skills WHERE sid = ?", [skillId], (error) => {
      if (error) {
        console.log("Error deleting skill: ", error);
      } else {
        console.log("Skill deleted!");
      }
      // Redirect to the /about page or any other appropriate page
      res.redirect("/about");
    });
  } else {
    res.redirect("/login");
  }
});

//adding a skill
// Create a new route handler for /skills/new
app.get("/skills/new", (req, res) => {
  if (req.session.isLoggedIn && req.session.isAdmin) {
    // If the user is logged in as an admin, render a page for adding new skills
    const model = {
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    };
    res.render("newSkill.handlebars", model); // Create a newSkill.handlebars view for this page
  } else {
    res.redirect("/login");
  }
});

// Handle the form submission to save the new skill
app.post("/skills/new", (req, res) => {
  if (req.session.isLoggedIn && req.session.isAdmin) {
    // Extract data from the form submission
    const skillName = req.body.skillName; // Make sure you have a corresponding input field in your newSkill.handlebars
    const skillPro = req.body.skillPro;

    // Save the new skill to your database (you may need to adapt this part based on your database structure)
    db.run(
      "INSERT INTO skills (sname, spro) VALUES (?, ?)",
      [skillName, skillPro],
      (error) => {
        if (error) {
          console.log("Error adding a new skill: ", error);
        } else {
          console.log("New skill added!");
        }
        // Redirect to the /about page or any other appropriate page
        res.redirect("/about");
      }
    );
  } else {
    res.redirect("/login");
  }
});

//modify a skill

app.get("/skills/update/:id", (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM skills WHERE sid=?", [id], function (error, theSkill) {
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
      res.render("modifyskill.handlebars", model);
    } else {
      const model = {
        skill: theSkill,
        dbError: false,
        theError: "",
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        helpers: {
          theTypeB(value) {
            return value == "Basic";
          },
          theTypeC(value) {
            return value == "Competent";
          },
          theTypeS(value) {
            return value == "Skilled";
          },
          theTypeP(value) {
            return value == "Professional";
          },
        },
      };
      // renders the page with the model
      res.render("modifyskill.handlebars", model);
    }
  });
});

//modify an existing skill
app.post("/skills/update/:id", (req, res) => {
  const id = req.params.id; //gets the id from the dynamic parameter in the route
  const newSkill = [req.body.skillName, req.body.skillPro, id];
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run(
      "UPDATE skills SET sname =?, spro=? WHERE sid=?",
      newSkill,
      (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Skill updated!");
        }
        // res.render("home.handlebars", model);
        res.redirect("/about");
      }
    );
  } else {
    res.redirect("/login");
  }
});

//--------------------User manager board---------------------------------------

// Add a route to display user data
app.get("/user-manager", function (req, res) {
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.all("SELECT * FROM users", function (error, theUsers) {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          users: [],
          name: req.session.name,
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
        };

        res.render("userManager.handlebars", model);
      } else {
        const model = {
          dbError: false,
          theError: "",
          users: theUsers,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
          isLoggedIn: req.session.isLoggedIn,
        };

        res.render("userManager.handlebars", model);
      }
    });
  } else {
    console.log("You are not Logged In");
    // Redirect to the login page or display an error message
    res.redirect("/login");
  }
});
app.post("/user-manager/:uid", function (req, res) {
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run(
      "UPDATE users SET uname = ?, isAdmin = ? WHERE uid = ?",
      [req.body.uname, req.body.isAdmin, req.params.uid],
      (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("User management info updated!");
        }
        res.redirect("/user-manager");
      }
    );
  } else {
    console.log("You are not Logged In");
    // Redirect to the login page or display an error message
    res.redirect("/login");
  }
});
app.get("/user-manager/delete/:uid", function (req, res) {
  const id = req.params.id;
  if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
    db.run("DELETE FROM users WHERE uid=?", [req.params.uid], (error) => {
      if (error) {
        console.log("ERROR deleting user manager: ", error);
      } else {
        console.log("User management info deleted!");
      }
      res.redirect("/user-manager");
    });
  } else {
    res.redirect("/login");
  }
});

//change users profile

app.get("/profile", function (req, res) {
  if (req.session.isLoggedIn == true) {
    db.all(
      "SELECT * FROM profiles WHERE id = ?",
      [req.session.profile_id],
      function (error, profile) {
        if (error) {
          const model = {
            dbError: true,
            theError: error,
            profile: [],
            isAdmin: req.session.isAdmin,
            name: req.session.name,
            isLoggedIn: req.session.isLoggedIn,
          };

          res.render("profile.handlebars", model);
        } else {
          const model = {
            dbError: false,
            theError: "",
            profile: profile,
            isAdmin: req.session.isAdmin,
            name: req.session.name,
            isLoggedIn: req.session.isLoggedIn,
          };

          res.render("profile.handlebars", model);
        }
      }
    );
  } else {
    console.log("You are not Logged In");
    //alert user here
    res.redirect("/login");
  }
});

app.post("/profile", (req, res) => {
  if (req.session.isLoggedIn) {
    // Get user data from the form
    const updatedPhone = req.body.phone;
    const updatedEmail = req.body.email;

    // Update user's phone and email in the database
    db.run(
      "UPDATE profiles SET phone = ?, email = ? WHERE id = ?",
      [updatedPhone, updatedEmail, req.session.profile_id],
      (error) => {
        if (error) {
          console.log("ERROR: ", error);
        } else {
          console.log("Profile updated!");
        }
        // res.render("home.handlebars", model);
        res.redirect("/profile");
      }
    );
  } else {
    // User is not logged in, handle this case accordingly
    res.redirect("/login");
  }
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
  db,
};
