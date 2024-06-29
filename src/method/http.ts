import fs from "node:fs/promises";

import { Validates } from "../util.js";

// eslint-disable-next-line import/no-unresolved
import got from "got";
import { z } from "zod";

import type { OptionsInit } from "got";

export default class Http {
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

  public async Version() {
    const url = new URL("/VERSION", this.url);
    const data = await got.get(url, this.gen_option());
    return this.validates.Version_http.parse(data).version;
  }

  public async AvatorList() {
    const avator_list = new Map<number, string>();
    const url = new URL("/AVATOR2", this.url);
    const data = await got.get(url, this.gen_option());
    for (const {
      cid,
      name,
      prod,
    } of this.validates.AvatorListDetail2_http.parse(data).sort((a, b) =>
      a.cid < b.cid ? -1 : 1,
    )) {
      avator_list.set(cid, name.replace(new RegExp(`_${prod}.+`), ""));
    }
    return avator_list;
  }

  /*
   * ~~~ public ~~~
   */

  public async AvatorList2() {
    const avator_list = new Map<number, Map<string, string>>();
    const url = new URL("/AVATOR2", this.url);
    const data = await got.get(url, this.gen_option());
    for (const {
      cid,
      name,
      prod,
      platform,
    } of this.validates.AvatorListDetail2_http.parse(data).sort((a, b) =>
      a.cid < b.cid ? -1 : 1,
    )) {
      avator_list.set(
        cid,
        new Map([
          ["name", name.replace(new RegExp(`_${prod}.+`), "")],
          ["prod", prod],
          ["platform", platform],
        ]),
      );
    }
    return avator_list;
  }

  public async AvatorListDetail2() {
    const avator_list = new Map<number, Map<string, string>>();
    const url = new URL("/AVATOR2", this.url);
    const data = await got.get(url, this.gen_option());
    for (const {
      cid,
      name,
      prod,
      platform,
      isalias,
    } of this.validates.AvatorListDetail2_http.parse(data).sort((a, b) =>
      a.cid < b.cid ? -1 : 1,
    )) {
      avator_list.set(
        cid,
        new Map([
          ["name", name.replace(new RegExp(`_${prod}.+`), "")],
          ["prod", prod],
          ["platform", platform],
          ["isalias", isalias ? "True" : "False"],
        ]),
      );
    }
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
      effects?: Array<[string, number]>;
      emotions?: Array<[string, number]>;
    } = {},
  ) {
    const { filepath = "", effects = [], emotions = [] } = option;
    const url = (() => {
      if (filepath !== "") return new URL(`/SAVE2/${cid}`, this.url);
      return new URL(`/PLAY2/${cid}`, this.url);
    })();

    const request_option = this.gen_option();
    request_option.responseType = "buffer";
    request_option.body = JSON.stringify({
      talktext: Array.isArray(talktext) ? talktext.join("") : talktext,
      effects: Object.fromEntries(effects),
      emotions: Object.fromEntries(emotions),
    });

    const data = await got.post(url, request_option);
    if (!Buffer.isBuffer(data)) throw new Error("Invalid response");

    if (filepath !== "") {
      await fs.writeFile(filepath, data);
      return 0;
    }
    return -1;
  }

  public async TalkAsync(
    cid: number,
    talktext: string | string[],
    option: {
      effects?: Array<[string, number]>;
      emotions?: Array<[string, number]>;
    } = {},
  ) {
    const { effects = [], emotions = [] } = option;
    const url = new URL(`/PLAYASYNC2/${cid}`, this.url);

    const request_option = this.gen_option();
    request_option.responseType = "buffer";
    request_option.body = JSON.stringify({
      talktext: Array.isArray(talktext) ? talktext.join("") : talktext,
      effects: Object.fromEntries(effects),
      emotions: Object.fromEntries(emotions),
    });

    const data = await got.post(url, request_option);

    if (!Buffer.isBuffer(data)) throw new Error("Invalid response");
    return -1;
  }

  private param_parser(data: unknown) {
    const parameter_list = new Map<string, Map<string, Map<string, number>>>();
    for (const [type, parameters] of Object.entries(
      this.validates.GetDefaultParams2_http.parse(data),
    )) {
      for (const [name, value] of Object.entries(parameters)) {
        const a = parameter_list.get(type);
        const b = new Map<string, number>(Object.entries(value));
        if (a === undefined) {
          parameter_list.set(type, new Map([[name, b]]));
        } else {
          a.set(name, b);
          parameter_list.set(type, a);
        }
      }
    }

    return parameter_list;
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
