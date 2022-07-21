import { performance } from "perf_hooks";
import { z } from "zod";
import { Util } from "../util.js";
export default class SeikaSay2 {
    constructor(exe_path) {
        this.exe_path = z
            .string()
            .min(1)
            .regex(/^.*SeikaSay2\.exe$/)
            .parse(exe_path);
    }
    /*
     * ~~~ private ~~~
     */
    static stdout_parser(a) {
        return a.split(/\r\n|\n/).map((b) => b.trim());
    }
    static list_parser(stdout) {
        const ver_std = SeikaSay2.stdout_parser(stdout)
            .filter((a) => a.match(/^\d{4}.+?$/))
            .map((a) => a
            .replace(/^(\d{4}) (.+) {2,}- (.+)\((\d{2})\)$/, "$1/$2/$3/$4")
            .split("/"))
            .sort();
        return z
            .array(z.tuple([
            z.string().min(4),
            z.string().min(1),
            z.string().min(1),
            z.enum(["64", "32"]),
        ]))
            .parse(ver_std);
    }
    static param_parser(stdout) {
        const param_list = new Map();
        const ver_std = SeikaSay2.stdout_parser(stdout)
            .filter((a) => a.match(/^(effect|emotion).+$/))
            .map((a) => a
            .replace(/^(effect|emotion) +: (\S+) += (-?\d+(.\d+)?) \[(.+)\]$/, "$1/$2/$3/.$4/$5")
            .replace("/./", "/null/")
            .split("/"));
        ver_std.forEach(([type, name, value, _decimal, range]) => {
            const param_type = z.enum(["effect", "emotion"]).parse(type);
            const [min, max, step] = z
                .string()
                .parse(range)
                .split(/～|, step /)
                .map((b) => Number(b));
            const data = param_list.get(param_type) ?? new Map();
            data.set(name, new Map([
                ["value", Number(value)],
                ["min", min],
                ["max", max],
                ["step", step],
            ]));
            param_list.set(param_type, data);
        });
        return param_list;
    }
    async Version() {
        const stdout = await this.gen_func([""]);
        const ver_std = SeikaSay2.stdout_parser(stdout).filter((a) => a.match(/^seikasay command Version.+?$/));
        return z
            .string()
            .transform((a) => a.replace(/^.+, SystemVersion:(\d{8}\/..?)$/, "$1"))
            .parse(ver_std[0]);
    }
    async AvatorList() {
        const avator_list = new Map();
        const stdout = await this.gen_func(["-list"]);
        const ver_std = SeikaSay2.list_parser(stdout);
        ver_std.forEach(([cid, name]) => {
            avator_list.set(z
                .string()
                .transform((a) => Number(a))
                .parse(cid), z.string().parse(name));
        });
        return avator_list;
    }
    async gen_func(arg) {
        return Util.gen_func(this.exe_path, arg);
    }
    /*
     * ~~~ public ~~~
     */
    async AvatorList2() {
        const avator_list = new Map();
        const stdout = await this.gen_func(["-list"]);
        const ver_std = SeikaSay2.list_parser(stdout);
        ver_std.forEach(([cid, name, prod, platform]) => {
            avator_list.set(z
                .string()
                .transform((a) => Number(a))
                .parse(cid), new Map([
                ["name", z.string().parse(name)],
                ["prod", z.string().parse(prod)],
                ["platform", z.string().parse(platform)],
            ]));
        });
        return avator_list;
    }
    async AvatorListDetail2() {
        const tmp = [];
        const avator_list = new Map();
        const stdout = await this.gen_func(["-list"]);
        const ver_std = SeikaSay2.list_parser(stdout);
        ver_std.forEach(([cid, name, prod, platform]) => {
            avator_list.set(z
                .string()
                .transform((a) => Number(a))
                .parse(cid), new Map([
                ["name", z.string().parse(name)],
                ["prod", z.string().parse(prod)],
                ["platform", z.string().parse(platform)],
                ["isalias", "False"],
            ]));
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
    async GetDefaultParams2(cid) {
        const stdout = await this.gen_func(["-cid", String(cid), "-params"]);
        return SeikaSay2.param_parser(stdout);
    }
    async GetCurrentParams2(cid) {
        const stdout = await this.gen_func(["-cid", String(cid), "-current"]);
        return SeikaSay2.param_parser(stdout);
    }
    async Talk(cid, talktext, option = {}) {
        const { filepath = "", effects = [], emotions = [] } = option;
        const arg = ["-cid", String(cid)];
        return this.execute_talk(talktext, arg, filepath, effects, emotions);
    }
    async TalkAsync(cid, talktext, option = {}) {
        const { effects = [], emotions = [] } = option;
        const arg = ["-cid", String(cid), "-async"];
        return this.execute_talk(talktext, arg, "", effects, emotions);
    }
    async execute_talk(talktext, arg, filepath, effects, emotions) {
        if (filepath) {
            arg.push("-save", filepath);
        }
        if (effects) {
            effects.forEach(([name, value]) => {
                if (name === "prephoneme" || name === "postphoneme") {
                    arg.push("-emotion", name, String(value));
                }
                else {
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
        }
        else {
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
//# sourceMappingURL=SeikaSay2.js.map