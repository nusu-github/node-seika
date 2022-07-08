import type { WCFClient_interface } from "../type/type";
export default class WCFClient implements WCFClient_interface {
    private static readonly project_dirname;
    private static readonly AssistantSeika_wrapper;
    private readonly dll_path;
    private readonly func_list;
    private readonly validates;
    constructor(dll_path: string);
    Version(): Promise<string>;
    ProductScan(): Promise<boolean>;
    BootHttpService(): Promise<boolean>;
    AvatorList(): Promise<Map<number, string>>;
    AvatorList2(): Promise<Map<number, Map<string, string>>>;
    AvatorListDetail2(): Promise<Map<number, Map<string, string>>>;
    GetDefaultParams2(cid: number): Promise<Map<"effect" | "emotion", Map<string, Map<string, number>>>>;
    GetCurrentParams2(cid: number): Promise<Map<"effect" | "emotion", Map<string, Map<string, number>>>>;
    Talk(cid: number, talktext: string | string[], option?: {
        filepath?: string;
        effects?: [string, number][];
        emotions?: [string, number][];
    }): Promise<number>;
    TalkAsync(cid: number, talktext: string | string[], option?: {
        effects?: [string, number][];
        emotions?: [string, number][];
    }): Promise<number>;
    private gen_func;
}
//# sourceMappingURL=WCFClient.d.ts.map