import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { getCountryData, getStateData, getConditionData } from "./api.js";

dotenv.config();

const app = express();
const port = +process.env.EXPRESS_PORT;

async function returnCountryData(req, res) {
  const qs = req.originalUrl.substring(1);
  const startTime = Date.now();
  const data = await getCountryData(qs);
  const msElapsed = Date.now() - startTime;
  console.log(`Async function took ${msElapsed / 1000} seconds to complete.`);
  res.json(data);
}

async function returnStateData(req, res) {
  const qs = req.originalUrl.substring(1);
  const startTime = Date.now();
  const data = await getStateData(qs);
  const msElapsed = Date.now() - startTime;
  console.log(`Async state function took ${msElapsed / 1000} seconds to complete.`);
  res.json(data);
}

async function returnConditionData(req, res) {
  const qs = req.originalUrl.substring(1);
  const startTime = Date.now();
  const data = await getConditionData(qs);
  const msElapsed = Date.now() - startTime;
  console.log(`Async condition function took ${msElapsed / 1000} seconds to complete.`);
  res.json(data);
}

app.use(cors())

app.get("/national/", returnCountryData);

app.get("/state/", returnStateData);

app.get("/conditions/", returnConditionData)


app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

