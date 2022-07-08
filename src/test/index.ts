import fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import os from "os";

import { each } from "async";

import NodeSeika from "../index.js";

import type HTTP from "../method/HTTP";
import type SeikaSay2 from "../method/SeikaSay2.js";
import type WCFClient from "../method/WCFClient.js";

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

  await each(avatar_list.entries(), async ([cid]) => {
    const param = await client.GetDefaultParams2(cid);
    console.log(`デフォルトパラメーター`);
    console.table(param);
  });

  await each(avatar_list.entries(), async ([cid]) => {
    const param = await client.GetCurrentParams2(cid);
    console.log(`現在のパラメーター`);
    console.table(param);
  });

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

  await each(
    [...avatar_list.entries()].map(
      ([cid, name]): [[number, string, string], Promise<number>] => {
        const data =
          string_list[Math.floor(Math.random() * (string_list.length - 1))]!;
        return [
          [cid, name as string, data],
          client.Talk(cid, data, {
            filepath: `${tmp_path}/${cid}_${data}.wav`,
          }),
        ];
      }
    ),
    async ([avatar_data, func_Talk]) => {
      const [cid, name, data] = avatar_data;
      await func_Talk;
      console.log(`${name}(${cid}) ${data}`);
    }
  );
};

const main = async () => {
  const seikasay2 = <SeikaSay2>await NodeSeika({ access_method: "SeikaSay2" });
  const wcfclient = <WCFClient>await NodeSeika({ access_method: "WCFClient" });
  const http = <HTTP>await NodeSeika({ access_method: "HTTP" });

  const wcfclient_startTime = performance.now();
  await test(wcfclient);
  const wcfclient_endTime = performance.now();
  console.log("wcfclient", wcfclient_endTime - wcfclient_startTime);

  const seikasay2_startTime = performance.now();
  await test(seikasay2);
  const seikasay2_endTime = performance.now();
  console.log("seikasay2", seikasay2_endTime - seikasay2_startTime);

  const http_startTime = performance.now();
  await test(http);
  const http_endTime = performance.now();
  console.log("http", http_startTime - http_endTime);
};

await main();
