export default class Wcfclient {
    private readonly project_path;
    readonly csharp_code: string;
    private readonly dll_path;
    private readonly func_list;
    private readonly validates;
    constructor(dll_path: string);
    private static error_handing;
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
        effects?: Array<[string, number]>;
        emotions?: Array<[string, number]>;
    }): Promise<number>;
    TalkAsync(cid: number, talktext: string | string[], option?: {
        effects?: Array<[string, number]>;
        emotions?: Array<[string, number]>;
    }): Promise<number>;
    private gen_func;
}
//# sourceMappingURL=wcfclient.d.ts.map