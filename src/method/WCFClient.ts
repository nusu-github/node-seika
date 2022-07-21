import path from "node:path";
import { promisify } from "node:util";

import edge from "edge-js";
import { z } from "zod";

import { Validates } from "../util.js";

import type { WCFClient_interface } from "../type/type";

export default class WCFClient implements WCFClient_interface {
  private readonly dll_path;

  private readonly func_list;

  private readonly validates = new Validates();

  constructor(dll_path: string) {
    this.dll_path = dll_path;

    /*
            C#コンパイル
        */
    this.func_list = {
      Version: this.gen_func("Version"),
      ProductScan: this.gen_func("ProductScan"),
      BootHttpService: this.gen_func("BootHttpService"),
      AvatorList: this.gen_func("AvatorList"),
      AvatorList2: this.gen_func("AvatorList2"),
      AvatorListDetail2: this.gen_func("AvatorListDetail2"),
      GetDefaultParams2: this.gen_func("GetDefaultParams2"),
      GetCurrentParams2: this.gen_func("GetCurrentParams2"),
      Talk: this.gen_func("Talk"),
      TalkAsync: this.gen_func("TalkAsync"),
    };
  }

  /*
   * ~~~ private ~~~
   */

  private gen_func(methodName: string) {
    return promisify(
      edge.func({
        source: path.join("./src/", "main.csx"),
        methodName,
        references: [
          this.dll_path,
          "System.Runtime.Serialization.dll",
          "System.Xml.dll",
        ],
      })
    );
  }

  /*
   * ~~~ public ~~~
   */
  public async Version() {
    const data = await this.func_list.Version("");
    return this.validates.Version.parse(data);
  }

  public async ProductScan() {
    const data = await this.func_list.ProductScan("");
    return this.validates.ProductScan.parse(data);
  }

  public async BootHttpService() {
    const data = await this.func_list.BootHttpService("");
    return this.validates.BootHttpService.parse(data);
  }

  public async AvatorList() {
    const data = z.string().parse(await this.func_list.AvatorList(""));
    return this.validates.AvatorList.transform(
      (a) => new Map(a.map(({ Key, Value }) => [Key, Value]))
    ).parse(JSON.parse(data));
  }

  public async AvatorList2() {
    const data = z.string().parse(await this.func_list.AvatorList2(""));
    const object = this.validates.AvatorList2.parse(JSON.parse(data));
    return new Map(
      object.map((a) => [a.Key, new Map(a.Value.map((b) => [b.Key, b.Value]))])
    );
  }

  public async AvatorListDetail2() {
    const data = z.string().parse(await this.func_list.AvatorListDetail2(""));
    const object = this.validates.AvatorListDetail2.parse(JSON.parse(data));
    return new Map(
      object.map((a) => [a.Key, new Map(a.Value.map((b) => [b.Key, b.Value]))])
    );
  }

  public async GetDefaultParams2(cid: number) {
    const data = z.string().parse(await this.func_list.GetDefaultParams2(cid));
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
    const data = z.string().parse(await this.func_list.GetCurrentParams2(cid));
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
      effects?: [string, number][];
      emotions?: [string, number][];
    } = {}
  ) {
    const { filepath = "", effects = [], emotions = [] } = option;
    return z.number().parse(
      Number(
        await this.func_list.Talk({
          cid,
          talktext,
          filepath,
          effects,
          emotions,
        })
      )
    );
  }

  public async TalkAsync(
    cid: number,
    talktext: string | string[],
    option: { effects?: [string, number][]; emotions?: [string, number][] } = {}
  ) {
    const { effects = [], emotions = [] } = option;
    return z.number().parse(
      Number(
        await this.func_list.TalkAsync({
          cid,
          talktext,
          effects,
          emotions,
        })
      )
    );
  }
}
