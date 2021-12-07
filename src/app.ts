import express, { Router, Request, Response, Application } from "express";
import bodyParser from "body-parser";
import router from "./api/routes/api-router";

const app: Application = express();
app.disable("x-powered-by");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use("/api", router);

const PORT = process.env.PORT || 8000;

app.listen(PORT, (): void => {
  console.log(`Server Running at: https://localhost:${PORT}`);
});
