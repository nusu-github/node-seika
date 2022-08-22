import path from "node:path";
import url from "node:url";
import { promisify } from "node:util";
import fs from "node:fs";

import { Validates } from "../util.js";

import { z } from "zod";
import edge from "edge-js";

export default class Wcfclient {
  private readonly project_path = path.join(
    url.fileURLToPath(new URL(".", import.meta.url)),
    "../../"
  );

  public readonly csharp_code = fs.readFileSync(
    path.join(this.project_path, "./src/main.csx"),
    "utf8"
  );

  private readonly validates = new Validates();

  private readonly echo_seika = promisify(
    edge.func({
      source: this.csharp_code,
      methodName: "Main",
      references: [
        "System.Runtime.Serialization.dll",
        "System.Xml.dll",
        "System.ServiceModel.dll",
      ],
    })
  );

  private api_entry!: (method: string, Arguments: unknown) => Promise<unknown>;

  constructor() {
    this.gen_func();
  }

  /*
   * ~~~ private ~~~
   */

  private static error_handing(error: unknown) {
    const { Message } = z.object({ Message: z.string() }).parse(error);

    if (
      Message.includes("でリッスンしているエンドポイントがありませんでした。")
    ) {
      throw new Error(
        "[エラー] AssistantSeikaが起動していないか、接続できませんでした。"
      );
    }

    if (
      Message.includes(
        "内部エラーのため、クライアントは要求を処理できませんでした。"
      )
    ) {
      throw new Error(
        "[エラー] 製品スキャンが行われてないか、その他のエラーが発生しました。"
      );
    }

    // その他のエラー
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("[エラー] 不明なエラーが発生しました");
  }

  private gen_func() {
    this.api_entry = async (method: string, Arguments: unknown) => {
      return await this.echo_seika({ method, args: Arguments });
    };
  }

  /*
   * ~~~ public ~~~
   */

  public async Version() {
    const data = await this.api_entry("Version", "").catch((error) =>
      Wcfclient.error_handing(error)
    );
    return this.validates.Version.parse(data);
  }

  public async ProductScan() {
    const data = await this.api_entry("ProductScan", "").catch((error) =>
      Wcfclient.error_handing(error)
    );
    return this.validates.ProductScan.parse(data);
  }

  public async BootHttpService() {
    const data = await this.api_entry("BootHttpService", "").catch((error) =>
      Wcfclient.error_handing(error)
    );
    return this.validates.BootHttpService.parse(data);
  }

  public async AvatorList() {
    const data = z
      .string()
      .parse(
        await this.api_entry("AvatorList", "").catch((error) =>
          Wcfclient.error_handing(error)
        )
      );
    return this.validates.AvatorList.transform(
      (a) => new Map(a.map(({ Key, Value }) => [Key, Value]))
    ).parse(JSON.parse(data));
  }

  public async AvatorList2() {
    const data = z
      .string()
      .parse(
        await this.api_entry("AvatorList2", "").catch((error) =>
          Wcfclient.error_handing(error)
        )
      );
    const object = this.validates.AvatorList2.parse(JSON.parse(data));
    return new Map(
      object.map((a) => [a.Key, new Map(a.Value.map((b) => [b.Key, b.Value]))])
    );
  }

  public async AvatorListDetail2() {
    const data = z
      .string()
      .parse(
        await this.api_entry("AvatorListDetail2", "").catch((error) =>
          Wcfclient.error_handing(error)
        )
      );
    const object = this.validates.AvatorListDetail2.parse(JSON.parse(data));
    return new Map(
      object.map((a) => [a.Key, new Map(a.Value.map((b) => [b.Key, b.Value]))])
    );
  }

  public async GetDefaultParams2(cid: number) {
    const data = z
      .string()
      .parse(
        await this.api_entry("GetDefaultParams2", { cid }).catch((error) =>
          Wcfclient.error_handing(error)
        )
      );
    const object = this.validates.GetDefaultParams2.parse(JSON.parse(data));
    return new Map(
      object.map(({ Key, Value }) => [
        Key,
        new Map(
          Value.map((a) => [
            a.Key,
            new Map(a.Value.map((b) => [b.Key, b.Value])),
          ])
        ),
      ])
    );
  }

  public async GetCurrentParams2(cid: number) {
    const data = z
      .string()
      .parse(
        await this.api_entry("GetCurrentParams2", { cid }).catch((error) =>
          Wcfclient.error_handing(error)
        )
      );
    const object = this.validates.GetCurrentParams2.parse(JSON.parse(data));
    return new Map(
      object.map(({ Key, Value }) => [
        Key,
        new Map(
          Value.map((a) => [
            a.Key,
            new Map(a.Value.map((b) => [b.Key, b.Value])),
          ])
        ),
      ])
    );
  }

  public async Talk(
    cid: number,
    talktext: string | string[],
    option: {
      filepath?: string;
      effects?: Array<[string, number]>;
      emotions?: Array<[string, number]>;
    } = {}
  ) {
    const { filepath = "", effects = [], emotions = [] } = option;
    return z.number().parse(
      Number(
        await this.api_entry("Talk", {
          cid,
          talktext,
          filepath,
          effects,
          emotions,
        }).catch((error) => Wcfclient.error_handing(error))
      )
    );
  }

  public async TalkAsync(
    cid: number,
    talktext: string | string[],
    option: {
      effects?: Array<[string, number]>;
      emotions?: Array<[string, number]>;
    } = {}
  ) {
    const { effects = [], emotions = [] } = option;
    return z.number().parse(
      Number(
        await this.api_entry("TalkAsync", {
          cid,
          talktext,
          effects,
          emotions,
        }).catch((error) => Wcfclient.error_handing(error))
      )
    );
  }
}
