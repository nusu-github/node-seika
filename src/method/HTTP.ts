import fs from "node:fs/promises";

import got from "got";
import { z } from "zod";

import { Validates } from "../util.js";

import type { Effect, Json_Param, ParamData } from "../type/Json";
import type {
  Details,
  HTTP_interface,
  Param,
  ParamType,
  SpeakerList,
} from "../type/type";
import type { OptionsInit } from "got";

export default class HTTP implements HTTP_interface {
  private readonly url;

  private readonly id;

  private readonly password;

  private readonly validates = new Validates();

  constructor(url: string, id: string, password: string) {
    this.url = new URL(z.string().url().parse(url));
    this.id = id;
    this.password = password;
  }

  /*
   * ~~~ private ~~~
   */

  private static param_parser(data: Json_Param) {
    const param_list = new Map<ParamType, Map<string, Map<string, number>>>();
    Object.entries(data).forEach(([type, params]) => {
      Object.entries(<Effect | Record<string, ParamData>>params).forEach(
        ([name, value]) => {
          const a = param_list.get(<"effect" | "emotion">type) ?? new Map();
          a.set(name, new Map(Object.entries(value)));
          param_list.set(<"effect" | "emotion">type, a);
        }
      );
    });
    return param_list;
  }

  public async Version(): Promise<string> {
    const url = new URL("/VERSION", this.url);
    const data = await got.get(url, this.gen_option());
    if (!this.validates.Version(data)) throw new Error();
    return data.version;
  }

  /*
   * ~~~ public ~~~
   */

  public async AvatorList(): Promise<SpeakerList> {
    const avator_list = new Map<number, string>();
    const url = new URL("/AVATOR2", this.url);
    const data = await got.get(url, this.gen_option());
    if (!this.validates.AVATORLISTDETAIL2(data)) throw new Error();
    data
      .sort((a, b) => (a.cid < b.cid ? -1 : 1))
      .forEach(({ cid, name, prod }) => {
        avator_list.set(cid, name.replace(new RegExp(`_${prod}.+`), ""));
      });
    return avator_list;
  }

  public async AvatorList2(): Promise<SpeakerList> {
    const avator_list = new Map<number, Details>();
    const url = new URL("/AVATOR2", this.url);
    const data = await got.get(url, this.gen_option());
    if (!this.validates.AVATORLISTDETAIL2(data)) throw new Error();
    data
      .sort((a, b) => (a.cid < b.cid ? -1 : 1))
      .forEach(({ cid, name, prod, platform }) => {
        avator_list.set(
          cid,
          new Map([
            ["name", name.replace(new RegExp(`_${prod}.+`), "")],
            ["prod", prod],
            ["platform", platform],
          ])
        );
      });
    return avator_list;
  }

  public async AvatorListDetail2(): Promise<SpeakerList> {
    const avator_list = new Map<number, Details>();
    const url = new URL("/AVATOR2", this.url);
    const data = await got.get(url, this.gen_option());
    if (!this.validates.AVATORLISTDETAIL2(data)) throw new Error();
    data
      .sort((a, b) => (a.cid < b.cid ? -1 : 1))
      .forEach(({ cid, name, prod, platform, isalias }) => {
        avator_list.set(
          cid,
          new Map([
            ["name", name.replace(new RegExp(`_${prod}.+`), "")],
            ["prod", prod],
            ["platform", platform],
            ["isalias", isalias ? "True" : "False"],
          ])
        );
      });
    return avator_list;
  }

  public async GetDefaultParams2(cid: number): Promise<Param> {
    const url = new URL(`/AVATOR2/${cid}`, this.url);
    const data = await got.get(url, this.gen_option());
    if (!this.validates.Param(data)) throw new Error();
    return HTTP.param_parser(data);
  }

  public async GetCurrentParams2(cid: number): Promise<Param> {
    const url = new URL(`/AVATOR2/${cid}/current`, this.url);
    const data = await got.get(url, this.gen_option());
    if (!this.validates.Param(data)) throw new Error();
    return HTTP.param_parser(data);
  }

  public async Talk(
    cid: number,
    talktext: string | string[],
    option: {
      filepath?: string;
      effects?: [string, number][];
      emotions?: [string, number][];
    } = {}
  ): Promise<number> {
    const { filepath = "", effects = [], emotions = [] } = option;
    const url = (() => {
      if (filepath) return new URL(`/SAVE2/${cid}`, this.url);
      return new URL(`/PLAY2/${cid}`, this.url);
    })();
    const req_option = this.gen_option();
    req_option.responseType = "buffer";
    req_option.body = JSON.stringify({
      talktext: Array.isArray(talktext) ? talktext.join("") : talktext,
      effects: Object.fromEntries(effects),
      emotions: Object.fromEntries(emotions),
    });
    const data = await got.post(url, req_option);
    if (!Buffer.isBuffer(data)) throw new Error();
    if (filepath) {
      await fs.writeFile(filepath, data);
      return 0;
    }
    return data.readInt8();
  }

  public async TalkAsync(
    cid: number,
    talktext: string | string[],
    option: { effects?: [string, number][]; emotions?: [string, number][] } = {}
  ): Promise<number> {
    const { effects = [], emotions = [] } = option;
    const url = new URL(`/PLAYASYNC2/${cid}`, this.url);
    const req_option = this.gen_option();
    req_option.responseType = "buffer";
    req_option.body = JSON.stringify({
      talktext: Array.isArray(talktext) ? talktext.join("") : talktext,
      effects: Object.fromEntries(effects),
      emotions: Object.fromEntries(emotions),
    });
    const data = await got.post(url, req_option);
    if (!Buffer.isBuffer(data)) throw new Error();
    return data.readInt8();
  }

  private gen_option(): OptionsInit {
    return {
      username: this.id,
      password: this.password,
      resolveBodyOnly: true,
      responseType: "json",
    };
  }
}
