import express from "express";
import ExpressRedisCache from "express-redis-cache";
import { getBridgeData } from "./api.js";

const app = express();
const port = +process.env.EXPRESS_PORT;

const cache = ExpressRedisCache({
  host: process.env.CACHE_HOST,
  port: +process.env.CACHE_PORT,
});

async function returnBridgeData(req, res) {
  const startTime = Date.now(); 
  const data = await getBridgeData();
  const msElapsed = Date.now() - startTime;
  console.log(`Async function took ${msElapsed / 1000} seconds to complete.`);
  res.json(data);
}

app.get("/cache", cache.route(), returnBridgeData);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
