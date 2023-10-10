// creates table projects at startup

const { db } = require("./app");
db.run(
  "CREATE TABLE IF NOT EXISTS projects (pid INTEGER PRIMARY KEY, pname TEXT NOT NULL, ptype TEXT NOT NULL, pdesc TEXT NOT NULL, pimgURL TEXT NOT NULL, pURL TEXT)",
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
        {
          id: "8",
          name: "Portfolio website",
          type: "Website",
          desc: "This is an individual project in Web development fundatmentals.",
          url: "/img/portfolio.png",
        },
      ];
      // inserts projects
      projects.forEach((oneProject) => {
        db.run(
          "INSERT or REPLACE INTO projects (pid, pname, pdesc, ptype, pimgURL) VALUES (?, ?, ?, ?, ?)",
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
  "CREATE TABLE IF NOT EXISTS skills (sid INTEGER PRIMARY KEY, sname TEXT NOT NULL, stype TEXT NOT NULL, spro TEXT NOT NULL)",
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
        {
          id: "8",
          name: "Node.js",
          type: "Programming language",
          proficiency: "Competent",
        },
        {
          id: "9",
          name: "Handlebars",
          type: "Programming language",
          proficiency: "Competent",
        },
        {
          id: "10",
          name: "Express",
          type: "Programming language",
          proficiency: "Competent",
        },
        {
          id: "11",
          name: "SQLite 3",
          type: "Programming language",
          proficiency: "Basic",
        },
      ];

      // inserts skills
      skills.forEach((oneSkill) => {
        db.run(
          "INSERT or REPLACE INTO skills (sid, sname, stype, spro) VALUES (?, ?, ?, ?)",
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
  "CREATE TABLE IF NOT EXISTS projectsSkills (psid INTEGER PRIMARY KEY, pid INTEGER, sid INTEGER, FOREIGN KEY (pid) REFERENCES projects (pid), FOREIGN KEY (sid) REFERENCES skills (sid))",
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
        { id: "20", pid: "8", sid: "1" },
        { id: "21", pid: "8", sid: "2" },
        { id: "22", pid: "8", sid: "3" },
        { id: "23", pid: "8", sid: "8" },
        { id: "24", pid: "8", sid: "9" },
        { id: "25", pid: "8", sid: "10" },
        { id: "26", pid: "8", sid: "11" },
      ];
      // inserts projectsSkills
      projectsSkills.forEach((oneProjectSkill) => {
        db.run(
          "INSERT or REPLACE INTO projectsSkills (psid, pid, sid) VALUES (?, ?, ?)",
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