import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import ExpressRedisCache from "express-redis-cache";
import { getBridgeData } from "./api.js";

dotenv.config();

const app = express();
const port = +process.env.EXPRESS_PORT;

const cache = ExpressRedisCache({
  host: process.env.CACHE_HOST,
  port: +process.env.CACHE_PORT,
});

async function returnBridgeData(req, res) {
  const qs = req.originalUrl.substring(1);
  const startTime = Date.now();
  const data = await getBridgeData(qs);
  const msElapsed = Date.now() - startTime;
  console.log(`Async function took ${msElapsed / 1000} seconds to complete.`);
  res.json(data);
}

app.use(cors())

// app.get("/", returnBridgeData);
app.get("/", cache.route(), returnBridgeData);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
