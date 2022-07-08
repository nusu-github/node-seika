var _a;
import path from "node:path";
import { promisify } from "node:util";
import edge from "edge-js";
import { z } from "zod";
import { Validates } from "../util.js";
export default class WCFClient {
    constructor(dll_path) {
        this.validates = new Validates();
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
    /*
     * ~~~ public ~~~
     */
    async Version() {
        const data = await this.func_list.Version("");
        return this.validates.Version.parse(data);
    }
    async ProductScan() {
        const data = await this.func_list.ProductScan("");
        return this.validates.ProductScan.parse(data);
    }
    async BootHttpService() {
        const data = await this.func_list.BootHttpService("");
        return this.validates.BootHttpService.parse(data);
    }
    async AvatorList() {
        const data = z.string().parse(await this.func_list.AvatorList(""));
        return this.validates.AvatorList.transform((a) => new Map(a.map(({ Key, Value }) => [Key, Value]))).parse(JSON.parse(data));
    }
    async AvatorList2() {
        const data = z.string().parse(await this.func_list.AvatorList2(""));
        const object = this.validates.AvatorList2.parse(JSON.parse(data));
        return new Map(object.map((a) => [a.Key, new Map(a.Value.map((b) => [b.Key, b.Value]))]));
    }
    async AvatorListDetail2() {
        const data = z.string().parse(await this.func_list.AvatorListDetail2(""));
        const object = this.validates.AvatorListDetail2.parse(JSON.parse(data));
        return new Map(object.map((a) => [a.Key, new Map(a.Value.map((b) => [b.Key, b.Value]))]));
    }
    async GetDefaultParams2(cid) {
        const data = z.string().parse(await this.func_list.GetDefaultParams2(cid));
        const object = this.validates.GetDefaultParams2.parse(JSON.parse(data));
        return new Map(object.map(({ Key, Value }) => [
            Key,
            new Map(Value.map((a) => [
                a.Key,
                new Map(a.Value.map((b) => [b.Key, b.Value])),
            ])),
        ]));
    }
    async GetCurrentParams2(cid) {
        const data = z.string().parse(await this.func_list.GetCurrentParams2(cid));
        const object = this.validates.GetCurrentParams2.parse(JSON.parse(data));
        return new Map(object.map(({ Key, Value }) => [
            Key,
            new Map(Value.map((a) => [
                a.Key,
                new Map(a.Value.map((b) => [b.Key, b.Value])),
            ])),
        ]));
    }
    async Talk(cid, talktext, option = {}) {
        const { filepath = "", effects = [], emotions = [] } = option;
        return z.number().parse(Number(await this.func_list.Talk({
            cid,
            talktext,
            filepath,
            effects,
            emotions,
        })));
    }
    async TalkAsync(cid, talktext, option = {}) {
        const { effects = [], emotions = [] } = option;
        return z.number().parse(Number(await this.func_list.TalkAsync({
            cid,
            talktext,
            effects,
            emotions,
        })));
    }
    gen_func(methodName) {
        return promisify(edge.func({
            source: path.join(WCFClient.AssistantSeika_wrapper, "main.csx"),
            methodName,
            references: [
                this.dll_path,
                "System.Runtime.Serialization.dll",
                "System.Xml.dll",
            ],
        }));
    }
}
_a = WCFClient;
WCFClient.project_dirname = path.resolve("./");
WCFClient.AssistantSeika_wrapper = path.join(_a.project_dirname, "src");
//# sourceMappingURL=WCFClient.js.map