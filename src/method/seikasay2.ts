import { performance } from "node:perf_hooks";

import { execa } from "execa";
import iconv from "iconv-lite";
import { z } from "zod";

export default class Seikasay2 {
  private readonly exe_path;

  constructor(exe_path: string) {
    this.exe_path = z
      .string()
      .min(1)
      .regex(/^.*SeikaSay2\.exe$/)
      .parse(exe_path);
  }

  /*
   * ~~~ private ~~~
   */

  private static stdout_parser(a: string) {
    return a.split(/\r\n|\n/).map((b) => b.trim());
  }

  private static list_parser(stdout: string) {
    const avator_list = Seikasay2.stdout_parser(stdout)
      .filter((a) => a.match(/^\d{4}.+?$/))
      .map((a) =>
        a
          .replace(/^(\d{4}) (\S+) +- (\S+)\((64|32)\)$/, "$1/$2/$3/$4")
          .split("/")
      )
      .sort();

    return z
      .array(
        z.tuple([
          z.string().min(4),
          z.string().min(1),
          z.string().min(1),
          z.union([z.literal("64"), z.literal("32")]),
        ])
      )
      .parse(avator_list);
  }

  private static param_parser(stdout: string) {
    const parameter_list = new Map<string, Map<string, Map<string, number>>>();
    const raw_parameter_list = Seikasay2.stdout_parser(stdout)
      .filter((a) => a.match(/^(effect|emotion).+$/))
      .map((a) =>
        a
          .replace(
            /^(effect|emotion) +: (\S+) += (-?[\d.]+) \[(.+)]$/,
            "$1/$2/$3/$4"
          )
          .split("/")
      );

    for (const [type, name, value, range] of raw_parameter_list) {
      const parameter_type = z
        .union([z.literal("effect"), z.literal("emotion")])
        .parse(type);
      const [min, max, step] = z
        .string()
        .parse(range)
        .split(/～|, step /)
        .map(Number);

      const avator_parameters = parameter_list.get(parameter_type);
      const parameter = new Map([
        ["value", z.number().parse(Number(value))],
        ["min", z.number().parse(min)],
        ["max", z.number().parse(max)],
        ["step", z.number().parse(step)],
      ]);

      if (avator_parameters !== undefined) {
        avator_parameters.set(z.string().parse(name), parameter);
        parameter_list.set(parameter_type, avator_parameters);
      } else {
        parameter_list.set(
          parameter_type,
          new Map([[z.string().parse(name), parameter]])
        );
      }
    }

    return parameter_list;
  }

  public async Version() {
    const stdout = await this.gen_func([""]);
    const version_std = Seikasay2.stdout_parser(stdout).find((a) =>
      a.match(/^seikasay command Version.+?$/)
    );
    return z
      .string()
      .transform((a) => a.replace(/^.+, SystemVersion:(\d{8}\/..?)$/, "$1"))
      .parse(version_std);
  }

  public async AvatorList() {
    const avator_list = new Map<number, string>();

    const stdout = await this.gen_func(["-list"]);
    const raw_avator_list = Seikasay2.list_parser(stdout);

    for (const [cid, name] of raw_avator_list) {
      avator_list.set(
        z.string().transform(Number).parse(cid),
        z.string().parse(name)
      );
    }

    return avator_list;
  }

  /*
   * ~~~ public ~~~
   */

  public async AvatorList2() {
    const avator_list = new Map<number, Map<string, string>>();

    const stdout = await this.gen_func(["-list"]);
    const raw_avator_list = Seikasay2.list_parser(stdout);

    for (const [cid, name, production, platform] of raw_avator_list) {
      avator_list.set(
        z.string().transform(Number).parse(cid),
        new Map<string, string>([
          ["name", z.string().parse(name)],
          ["prod", z.string().parse(production)],
          ["platform", z.string().parse(platform)],
        ])
      );
    }

    return avator_list;
  }

  public async AvatorListDetail2() {
    const temporary: string[] = [];
    const avator_list = new Map<number, Map<string, string>>();

    const stdout = await this.gen_func(["-list"]);
    const raw_avator_list = Seikasay2.list_parser(stdout);

    for (const [cid, name, production, platform] of raw_avator_list) {
      avator_list.set(
        z.string().transform(Number).parse(cid),
        new Map<string, string>([
          ["name", z.string().parse(name)],
          ["prod", z.string().parse(production)],
          ["platform", z.string().parse(platform)],
          ["isalias", "False"],
        ])
      );
    }

    for (const [, details] of avator_list) {
      for (const [name, data] of details.entries()) {
        if (name === "prod" && !temporary.includes(data)) {
          temporary.push(data);
          details.set("isalias", "True");
        }
      }
    }

    return avator_list;
  }

  public async GetDefaultParams2(cid: number) {
    const stdout = await this.gen_func(["-cid", String(cid), "-params"]);
    return Seikasay2.param_parser(stdout);
  }

  public async GetCurrentParams2(cid: number) {
    const stdout = await this.gen_func(["-cid", String(cid), "-current"]);
    return Seikasay2.param_parser(stdout);
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
    const argument = ["-cid", String(cid)];
    return await this.execute_talk(
      talktext,
      argument,
      filepath,
      effects,
      emotions
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
    const argument = ["-cid", String(cid), "-async"];
    return await this.execute_talk(talktext, argument, "", effects, emotions);
  }

  private async execute_talk(
    talktext: string | string[],
    argument: string[],
    filepath: string,
    effects: Array<[string, number]>,
    emotions: Array<[string, number]>
  ) {
    if (filepath !== "") {
      argument.push("-save", filepath);
    }

    for (const [name, value] of effects) {
      if (name === "prephoneme" || name === "postphoneme") {
        argument.push("-emotion", name, String(value));
      } else {
        argument.push(`-${name}`, String(value));
      }
    }

    for (const [name, value] of emotions) {
      argument.push("-emotion", name, String(value));
    }

    if (Array.isArray(talktext)) {
      argument.push("-t", talktext.join(""));
    } else {
      argument.push("-t", talktext);
    }

    const startTime = performance.now(); // 開始時間
    const stdout = await this.gen_func(argument);
    const endTime = performance.now();

    if (filepath === "") {
      return endTime - startTime;
    }
    if (stdout === "") {
      return 0;
    }
    return -1;
  }

  private async gen_func(argument: string[]) {
    const { decode } = iconv;
    const data = await execa(this.exe_path, argument, {
      // eslint-disable-next-line unicorn/no-null
      encoding: null,
    });
    const stderr = decode(data.stderr, "Windows-31j");
    const stdout = decode(data.stdout, "Windows-31j");
    if (stderr !== "") throw new Error(stderr);
    return stdout;
  }
}
