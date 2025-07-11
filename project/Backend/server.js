import express from "express";
//create app using express:
const app = express();

//port set up:
const PORT = 5000;

//Middleware: tell server to expect json data as incoming req
app.use(express.json());

//setting up app response to send back HTML:
app.get("/", (req, res) => {
  res.send("backend is running");
});

//listen to incoming request:
app.listen(PORT, () => {
  console.log(`server has started at PORT : ${PORT}`);
});
