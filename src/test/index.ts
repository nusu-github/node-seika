import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";

import { Http, Seikasay2, Wcfclient } from "../index.js";

const test = async (client: Wcfclient | Seikasay2 | Http) => {
  const temporary_path = await fs.mkdtemp(path.join(os.tmpdir(), "NodeSeika-"));
  const version = await client.Version();
  console.log(`AssistantSeikaバージョン ${version}`);

  const avatar_list = await client.AvatorList();
  console.log(`話者一覧`);
  console.table(avatar_list);

  const avatar2_list = await client.AvatorList2();
  console.log(`話者一覧`);
  console.table(avatar2_list);

  const avatar2_detail_list = await client.AvatorListDetail2();
  console.log(`話者一覧`);
  console.table(avatar2_detail_list);

  for (const [cid] of avatar_list.entries()) {
    const parameter = await client.GetDefaultParams2(cid);
    console.log(`デフォルトパラメーター`);
    console.table(parameter);
  }

  for (const [cid] of avatar_list.entries()) {
    const parameter = await client.GetCurrentParams2(cid);
    console.log(`現在のパラメーター`);
    console.table(parameter);
  }

  for (const [cid, name] of avatar_list.entries()) {
    const text = "こんにちは、こんばんわ、おはようございます。";
    await client.Talk(cid, text, {
      filepath: `${temporary_path}/${cid}_${text}.wav`,
    });
    console.log(`${name}(${cid}) OK`);
  }
};

const wcfclient_startTime = performance.now();
const wcfclient = new Wcfclient();
await test(wcfclient);
const wcfclient_endTime = performance.now();

const seikasay2_startTime = performance.now();
const seikasay2 = new Seikasay2("./AssistantSeika/SeikaSay2/SeikaSay2.exe");
await test(seikasay2);
const seikasay2_endTime = performance.now();

const http_startTime = performance.now();
const http = new Http(
  "http://localhost:7180/",
  "SeikaServerUser",
  "SeikaServerPassword"
);
await test(http);
const http_endTime = performance.now();

console.log(
  "total：",
  wcfclient_endTime -
    wcfclient_startTime +
    seikasay2_endTime -
    seikasay2_startTime +
    http_endTime -
    http_startTime
);
console.log("wcfclient", wcfclient_endTime - wcfclient_startTime);
console.log("seikasay2", seikasay2_endTime - seikasay2_startTime);
console.log("http", http_endTime - http_startTime);
