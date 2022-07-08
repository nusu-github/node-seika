import { performance } from "perf_hooks";

import { z } from "zod";

import { Util } from "../util.js";

import type {
  Details,
  Param,
  ParamType,
  SeikaSay2_interface,
  SpeakerList,
} from "../type/type";

export default class SeikaSay2 implements SeikaSay2_interface {
  private readonly exe_path;

  constructor(exe_path: string) {
    this.exe_path = exe_path;
  }

  /*
   * ~~~ private ~~~
   */

  private static stdout_parser(stdout: string) {
    return stdout.split(/\r\n|\n/).map((a) => a.trim());
  }

  private static list_parser(stdout: string) {
    const ver_std = SeikaSay2.stdout_parser(stdout)
      .filter((a) => a.match(/^\d{4}.+?$/))
      .map((a) =>
        a
          .replace(/^(\d{4}) (.+) {2,}- (.+)\((\d{2})\)$/, "$1/$2/$3/$4")
          .split("/")
      )
      .sort();
    if (!ver_std) throw new Error("");
    return ver_std;
  }

  private static param_parser(stdout: string) {
    const param_list = new Map<ParamType, Map<string, Map<string, number>>>();
    const ver_std = SeikaSay2.stdout_parser(stdout)
      .filter((a) => a.match(/^(effect|emotion).+$/))
      .map((a) =>
        a
          .replace(
            /^(effect|emotion) +: (\S+) += (-?\d+(.\d+)?) \[(.+)\]$/,
            "$1/$2/$3/.$4/$5"
          )
          .replace("/./", "/null/")
          .split("/")
      );

    ver_std.forEach(([type, name, value, _decimal, range]) => {
      const param_type = z
        .string()
        .regex(/"effect" | "emotion"/)
        .parse(type) as ParamType;
      const [min, max, step] = z
        .string()
        .transform((a) => a.split(/～|, step /).map((b) => Number(b)))
        .parse(range);
      const data = param_list.get(param_type) ?? new Map();

      data.set(
        name,
        new Map([
          ["value", Number(value)],
          ["min", min],
          ["max", max],
          ["step", step],
        ])
      );
      param_list.set(param_type, data);
    });

    return param_list;
  }

  public async Version() {
    const stdout = await this.gen_func([""]);
    const ver_std = SeikaSay2.stdout_parser(stdout).filter((a) =>
      a.match(/^seikasay command Version.+?$/)
    );
    return z
      .string()
      .transform((a) => a.replace(/^.+, SystemVersion:(\d{8}\/..?)$/, "$1"))
      .parse(ver_std[0]);
  }

  public async AvatorList(): Promise<SpeakerList> {
    const avator_list = new Map<number, string>();

    const stdout = await this.gen_func(["-list"]);
    const ver_std = SeikaSay2.list_parser(stdout);

    ver_std.forEach(([cid, name]) => {
      avator_list.set(
        z
          .string()
          .transform((a) => Number(a))
          .parse(cid),
        z.string().parse(name)
      );
    });

    return avator_list;
  }

  /*
   * ~~~ public ~~~
   */

  public async AvatorList2(): Promise<SpeakerList> {
    const avator_list = new Map<number, Details>();

    const stdout = await this.gen_func(["-list"]);
    const ver_std = SeikaSay2.list_parser(stdout);

    ver_std.forEach(([cid, name, prod, platform]) => {
      avator_list.set(
        z
          .string()
          .transform((a) => Number(a))
          .parse(cid),
        new Map<string, string>([
          ["name", z.string().parse(name)],
          ["prod", z.string().parse(prod)],
          ["platform", z.string().parse(platform)],
        ])
      );
    });

    return avator_list;
  }

  public async AvatorListDetail2(): Promise<SpeakerList> {
    const tmp: string[] = [];
    const avator_list = new Map<number, Details>();

    const stdout = await this.gen_func(["-list"]);
    const ver_std = SeikaSay2.list_parser(stdout);

    ver_std.forEach(([cid, name, prod, platform]) => {
      avator_list.set(
        z
          .string()
          .transform((a) => Number(a))
          .parse(cid),
        new Map<string, string>([
          ["name", z.string().parse(name)],
          ["prod", z.string().parse(prod)],
          ["platform", z.string().parse(platform)],
          ["isalias", "False"],
        ])
      );
    });

    avator_list.forEach((details) => {
      details.forEach((data, name) => {
        if (name === "prod" && !tmp.some((a) => a === data)) {
          tmp.push(data);
          details.set("isalias", "True");
        }
      });
    });

    return avator_list;
  }

  public async GetDefaultParams2(cid: number): Promise<Param> {
    const stdout = await this.gen_func(["-cid", String(cid), "-params"]);
    return SeikaSay2.param_parser(stdout);
  }

  public async GetCurrentParams2(cid: number): Promise<Param> {
    const stdout = await this.gen_func(["-cid", String(cid), "-current"]);
    return SeikaSay2.param_parser(stdout);
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
    const arg = ["-cid", String(cid)];
    return this.execute_talk(talktext, arg, filepath, effects, emotions);
  }

  public async TalkAsync(
    cid: number,
    talktext: string | string[],
    option: { effects?: [string, number][]; emotions?: [string, number][] } = {}
  ): Promise<number> {
    const { effects = [], emotions = [] } = option;
    const arg = ["-cid", String(cid), "-async"];
    return this.execute_talk(talktext, arg, "", effects, emotions);
  }

  private async gen_func(arg: string[]) {
    return Util.gen_func(this.exe_path, arg);
  }

  private async execute_talk(
    talktext: string | string[],
    arg: string[],
    filepath: string,
    effects: [string, number][],
    emotions: [string, number][]
  ) {
    if (filepath) {
      arg.push("-save", filepath);
    }
    if (effects) {
      effects.forEach(([name, value]) => {
        if (name === "prephoneme" || name === "postphoneme") {
          arg.push("-emotion", name, String(value));
        } else {
          arg.push(`-${name}`, String(value));
        }
      });
    }
    if (emotions) {
      effects.forEach(([name, value]) => {
        arg.push("-emotion", name, String(value));
      });
    }

    if (Array.isArray(talktext)) {
      arg.push("-t", talktext.join(""));
    } else {
      arg.push("-t", talktext);
    }

    const startTime = performance.now(); // 開始時間
    const stdout = await this.gen_func(arg);
    const endTime = performance.now();

    if (!filepath) {
      return endTime - startTime;
    }
    if (!stdout) {
      return 0;
    }
    return -1;
  }
}
