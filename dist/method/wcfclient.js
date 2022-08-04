import path from "node:path";
import url from "node:url";
import { promisify } from "node:util";
import fs from "node:fs";
import { Validates } from "../util.js";
import { z } from "zod";
import edge from "edge-js";
export default class Wcfclient {
    constructor(dll_path) {
        this.project_path = path.join(url.fileURLToPath(new URL(".", import.meta.url)), "../../");
        this.csharp_code = fs.readFileSync(path.join(this.project_path, "./src/main.csx"), "utf8");
        this.validates = new Validates();
        if (!z.literal("WCFClient.dll").safeParse(path.basename(dll_path)).success) {
            throw new Error("[バリデーション エラー] パスが不正です");
        }
        this.dll_path = dll_path;
        /*
         *  C#コンパイル
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
    static error_handing(error) {
        const { Message } = z.object({ Message: z.string() }).parse(error);
        if (Message.includes("でリッスンしているエンドポイントがありませんでした。")) {
            throw new Error("[エラー] AssistantSeikaが起動していないか、接続できませんでした。");
        }
        if (Message.includes("内部エラーのため、クライアントは要求を処理できませんでした。")) {
            throw new Error("[エラー] 製品スキャンが行われてないか、その他のエラーがWCFClient.dllで発生しました。");
        }
        // その他のエラー
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("[エラー] 不明なエラーが発生しました");
    }
    async Version() {
        const data = await this.func_list
            .Version("")
            .catch((error) => Wcfclient.error_handing(error));
        return this.validates.Version.parse(data);
    }
    /*
     * ~~~ public ~~~
     */
    async ProductScan() {
        const data = await this.func_list
            .ProductScan("")
            .catch((error) => Wcfclient.error_handing(error));
        return this.validates.ProductScan.parse(data);
    }
    async BootHttpService() {
        const data = await this.func_list
            .BootHttpService("")
            .catch((error) => Wcfclient.error_handing(error));
        return this.validates.BootHttpService.parse(data);
    }
    async AvatorList() {
        const data = z
            .string()
            .parse(await this.func_list
            .AvatorList("")
            .catch((error) => Wcfclient.error_handing(error)));
        return this.validates.AvatorList.transform((a) => new Map(a.map(({ Key, Value }) => [Key, Value]))).parse(JSON.parse(data));
    }
    async AvatorList2() {
        const data = z
            .string()
            .parse(await this.func_list
            .AvatorList2("")
            .catch((error) => Wcfclient.error_handing(error)));
        const object = this.validates.AvatorList2.parse(JSON.parse(data));
        return new Map(object.map((a) => [a.Key, new Map(a.Value.map((b) => [b.Key, b.Value]))]));
    }
    async AvatorListDetail2() {
        const data = z
            .string()
            .parse(await this.func_list
            .AvatorListDetail2("")
            .catch((error) => Wcfclient.error_handing(error)));
        const object = this.validates.AvatorListDetail2.parse(JSON.parse(data));
        return new Map(object.map((a) => [a.Key, new Map(a.Value.map((b) => [b.Key, b.Value]))]));
    }
    async GetDefaultParams2(cid) {
        const data = z
            .string()
            .parse(await this.func_list
            .GetDefaultParams2(cid)
            .catch((error) => Wcfclient.error_handing(error)));
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
        const data = z
            .string()
            .parse(await this.func_list
            .GetCurrentParams2(cid)
            .catch((error) => Wcfclient.error_handing(error)));
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
        return z.number().parse(Number(await this.func_list
            .Talk({
            cid,
            talktext,
            filepath,
            effects,
            emotions,
        })
            .catch((error) => Wcfclient.error_handing(error))));
    }
    async TalkAsync(cid, talktext, option = {}) {
        const { effects = [], emotions = [] } = option;
        return z.number().parse(Number(await this.func_list
            .TalkAsync({
            cid,
            talktext,
            effects,
            emotions,
        })
            .catch((error) => Wcfclient.error_handing(error))));
    }
    gen_func(methodName) {
        return promisify(edge.func({
            source: this.csharp_code,
            methodName,
            references: [
                this.dll_path,
                "System.Runtime.Serialization.dll",
                "System.Xml.dll",
            ],
        }));
    }
}
//# sourceMappingURL=wcfclient.js.map