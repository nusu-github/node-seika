import fs from "node:fs/promises";
import got from "got";
import { z } from "zod";
import { Validates } from "../util.js";
export default class HTTP {
    constructor(url, id, password) {
        this.validates = new Validates();
        this.url = new URL(z.string().url().parse(url));
        this.id = id;
        this.password = password;
    }
    /*
     * ~~~ private ~~~
     */
    static param_parser(data) {
        const param_list = new Map();
        Object.entries(data).forEach(([type, params]) => {
            Object.entries(params).forEach(([name, value]) => {
                const a = param_list.get(type) ?? new Map();
                a.set(name, new Map(Object.entries(value)));
                param_list.set(type, a);
            });
        });
        return param_list;
    }
    async Version() {
        const url = new URL("/VERSION", this.url);
        const data = await got.get(url, this.gen_option());
        if (!this.validates.Version(data))
            throw new Error();
        return data.version;
    }
    /*
     * ~~~ public ~~~
     */
    async AvatorList() {
        const avator_list = new Map();
        const url = new URL("/AVATOR2", this.url);
        const data = await got.get(url, this.gen_option());
        if (!this.validates.AVATORLISTDETAIL2(data))
            throw new Error();
        data
            .sort((a, b) => (a.cid < b.cid ? -1 : 1))
            .forEach(({ cid, name, prod }) => {
            avator_list.set(cid, name.replace(new RegExp(`_${prod}.+`), ""));
        });
        return avator_list;
    }
    async AvatorList2() {
        const avator_list = new Map();
        const url = new URL("/AVATOR2", this.url);
        const data = await got.get(url, this.gen_option());
        if (!this.validates.AVATORLISTDETAIL2(data))
            throw new Error();
        data
            .sort((a, b) => (a.cid < b.cid ? -1 : 1))
            .forEach(({ cid, name, prod, platform }) => {
            avator_list.set(cid, new Map([
                ["name", name.replace(new RegExp(`_${prod}.+`), "")],
                ["prod", prod],
                ["platform", platform],
            ]));
        });
        return avator_list;
    }
    async AvatorListDetail2() {
        const avator_list = new Map();
        const url = new URL("/AVATOR2", this.url);
        const data = await got.get(url, this.gen_option());
        if (!this.validates.AVATORLISTDETAIL2(data))
            throw new Error();
        data
            .sort((a, b) => (a.cid < b.cid ? -1 : 1))
            .forEach(({ cid, name, prod, platform, isalias }) => {
            avator_list.set(cid, new Map([
                ["name", name.replace(new RegExp(`_${prod}.+`), "")],
                ["prod", prod],
                ["platform", platform],
                ["isalias", isalias ? "True" : "False"],
            ]));
        });
        return avator_list;
    }
    async GetDefaultParams2(cid) {
        const url = new URL(`/AVATOR2/${cid}`, this.url);
        const data = await got.get(url, this.gen_option());
        if (!this.validates.Param(data))
            throw new Error();
        return HTTP.param_parser(data);
    }
    async GetCurrentParams2(cid) {
        const url = new URL(`/AVATOR2/${cid}/current`, this.url);
        const data = await got.get(url, this.gen_option());
        if (!this.validates.Param(data))
            throw new Error();
        return HTTP.param_parser(data);
    }
    async Talk(cid, talktext, option = {}) {
        const { filepath = "", effects = [], emotions = [] } = option;
        const url = (() => {
            if (filepath)
                return new URL(`/SAVE2/${cid}`, this.url);
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
        if (!Buffer.isBuffer(data))
            throw new Error();
        if (filepath) {
            await fs.writeFile(filepath, data);
            return 0;
        }
        return data.readInt8();
    }
    async TalkAsync(cid, talktext, option = {}) {
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
        if (!Buffer.isBuffer(data))
            throw new Error();
        return data.readInt8();
    }
    gen_option() {
        return {
            username: this.id,
            password: this.password,
            resolveBodyOnly: true,
            responseType: "json",
        };
    }
}
//# sourceMappingURL=HTTP.js.map