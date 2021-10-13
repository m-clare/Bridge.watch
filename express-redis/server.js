import express from "express";
import ExpressRedisCache from "express-redis-cache";
import { getBridgeData } from "./api.js";

const app = express();
const port = 3000;

const cache = ExpressRedisCache({
  host: "redis",
  port: 6379,
});

async function returnBridgeData(req, res) {
  const data = await getBridgeData();
  res.json(data);
}

app.get("/", cache.route(), returnBridgeData);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
