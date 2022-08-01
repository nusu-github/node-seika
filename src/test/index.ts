import fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import os from "os";

import { z } from "zod";

import { WCFClient, SeikaSay2, HTTP } from "../index.js";

const test = async (client: WCFClient | SeikaSay2 | HTTP) => {
  const tmp_path = await fs.mkdtemp(path.join(os.tmpdir(), "NodeSeika-"));
  const ver = await client.Version();
  console.log(`AssistantSeikaバージョン ${ver}`);

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
    const param = await client.GetDefaultParams2(cid);
    console.log(`デフォルトパラメーター`);
    console.table(param);
  }

  for (const [cid] of avatar_list.entries()) {
    const param = await client.GetCurrentParams2(cid);
    console.log(`現在のパラメーター`);
    console.table(param);
  }

  const string_list = (
    await fs.readFile(
      path.join(
        path.resolve("./"),
        "ita-corpus",
        "emotion_transcript_utf8.txt"
      ),
      {
        encoding: "utf8",
      }
    )
  )
    .split(/\r\n|\n|\r/)
    .map((a) => a.trim().replace(/^\w+:(\S+),\S+$/, "$1"));

  for (const [cid, name] of avatar_list.entries()) {
    const data = z
      .string()
      .parse(string_list[Math.floor(Math.random() * (string_list.length - 1))]);
    await client.Talk(cid, data, {
      filepath: `${tmp_path}/${cid}_${data}.wav`,
    });
    console.log(`${name}(${cid}) ${data}`);
  }
};

const main = async () => {
  const wcfclient_startTime = performance.now();
  const wcfclient = new WCFClient("./AssistantSeika/WCFClient/WCFClient.dll");
  await test(wcfclient);
  const wcfclient_endTime = performance.now();

  const seikasay2_startTime = performance.now();
  const seikasay2 = new SeikaSay2("./AssistantSeika/SeikaSay2/SeikaSay2.exe");
  await test(seikasay2);
  const seikasay2_endTime = performance.now();

  const http_startTime = performance.now();
  const http = new HTTP(
    "http://localhost:7180/",
    "SeikaServerUser",
    "SeikaServerPassword"
  );
  await test(http);
  const http_endTime = performance.now();

  console.log(
    "total",
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
};

await main();
