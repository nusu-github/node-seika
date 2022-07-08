import fs from "node:fs/promises";

import got from "got";
import { z } from "zod";

import { Validates } from "../util.js";

import type { HTTP_interface } from "../type/type";
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

  private param_parser(data: unknown) {
    const param_list = new Map<string, Map<string, Map<string, number>>>();
    Object.entries(this.validates.GetDefaultParams2_http.parse(data)).forEach(
      ([type, params]) => {
        Object.entries(params).forEach(([name, value]) => {
          const a = param_list.get(type) ?? new Map();
          a.set(name, new Map(Object.entries(value)));
          param_list.set(type, a);
        });
      }
    );
    return param_list;
  }

  private gen_option(): OptionsInit {
    return {
      username: this.id,
      password: this.password,
      resolveBodyOnly: true,
      responseType: "json",
    };
  }

  /*
   * ~~~ public ~~~
   */

  public async Version() {
    const url = new URL("/VERSION", this.url);
    const data = await got.get(url, this.gen_option());
    return this.validates.Version_http.parse(data).version;
  }

  public async AvatorList() {
    const avator_list = new Map<number, string>();
    const url = new URL("/AVATOR2", this.url);
    const data = await got.get(url, this.gen_option());
    this.validates.AvatorListDetail2_http.parse(data)
      .sort((a, b) => (a.cid < b.cid ? -1 : 1))
      .forEach(({ cid, name, prod }) => {
        avator_list.set(cid, name.replace(new RegExp(`_${prod}.+`), ""));
      });
    return avator_list;
  }

  public async AvatorList2() {
    const avator_list = new Map<number, Map<string, string>>();
    const url = new URL("/AVATOR2", this.url);
    const data = await got.get(url, this.gen_option());
    this.validates.AvatorListDetail2_http.parse(data)
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

  public async AvatorListDetail2() {
    const avator_list = new Map<number, Map<string, string>>();
    const url = new URL("/AVATOR2", this.url);
    const data = await got.get(url, this.gen_option());
    this.validates.AvatorListDetail2_http.parse(data)
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

  public async GetDefaultParams2(cid: number) {
    const url = new URL(`/AVATOR2/${cid}`, this.url);
    const data = await got.get(url, this.gen_option());
    return this.param_parser(this.validates.GetDefaultParams2_http.parse(data));
  }

  public async GetCurrentParams2(cid: number) {
    const url = new URL(`/AVATOR2/${cid}/current`, this.url);
    const data = await got.get(url, this.gen_option());
    return this.param_parser(this.validates.GetDefaultParams2_http.parse(data));
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
  ) {
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
}
