const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

const hbs = require("hbs");

dotenv.config({ path: "./config/dev.env" });

console.log(__dirname);
console.log(path.join(__dirname, ".."));

const output = require("./utils/output.js");
const { default: axios } = require("axios");

const app = express();
const port = process.env.PORT || 3000;

//defining paths for handlebars
const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

//seting up static npfiles. So that
//we don't have to give location
//of whole file present in public folder
app.use(express.static(publicDirectoryPath));
app.use(express.urlencoded());
app.use(express.json());

app.get("", (req, res) => {
  res.render("index");
});

app.post("", async(req, res) => {
  // console.log(req.body);
  var lang;
  switch(req.body["select-language"]){
    case "cpp":
    case "cpp14":
    case "cpp17":
    case "c": lang="c_cpp";
    break;
    case "python2":
    case "python3":lang="python"; break;
    case "java":lang="java"; break;
  }
  var coding={
    code:req.body.description,
    lang,
    input:req.body.input,
  }
  console.log(coding);
  const {data,status}=await axios.post('http://15.206.27.131/compile',coding);
  if(status===200 && data.memoryUsage !== null && data.cpuUsage !== null && data.stderr.length===0){
    res.render("index", {
      description: req.body.description,
      theme: req.body["select-theme"],
      lang: req.body["select-language"],
      stdin: req.body.input,
      stdout: data.stdout,
      msg: "Compiled",
      time: data.cpuUsage,
      memory: data.memoryUsage,
      isError:false,
    });

  }
  else{

    res.render("index", {
      description: req.body.description,
      theme: req.body["select-theme"],
      lang: req.body["select-language"],
      stdin: req.body.input,
      stdout: data.stdout,
      stderr:data.stderr,
      msg: "Compiled",
      time: data.cpuUsage,
      memory: data.memoryUsage,
      isError:true,
          });
  }
  console.log(data,status);
  // output(
  //   req.body.description,
  //   req.body["select-language"],
  //   req.body.input,
  //   (error, result) => {
  //     if (error) {
  //       return res.render("error", {
  //         error: error.code,
  //         errno: error.errno,
  //       });
  //     }
  //     var isError = false;
  //     if (result.body.memory == null && result.body.cpuTime == null) {
  //       isError = true;
  //     }
  //     console.log(result);
  //     res.render("index", {
  //       description: req.body.description,
  //       theme: req.body["select-theme"],
  //       lang: req.body["select-language"],
  //       stdin: req.body.input,
  //       stdout: result.body.output,
  //       msg: "Compiled",
  //       time: result.body.cpuTime,
  //       memory: result.body.memory,
  //       isError,
  //     });
  //   }
  // );
});


app.get("*", (req, res) => {
  res.render("404");
});

app.listen(port, () => {
  console.log("server is up on port " + port);
});
