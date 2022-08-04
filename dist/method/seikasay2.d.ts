export default class Seikasay2 {
    private readonly exe_path;
    constructor(exe_path: string);
    private static stdout_parser;
    private static list_parser;
    private static param_parser;
    Version(): Promise<string>;
    AvatorList(): Promise<Map<number, string>>;
    AvatorList2(): Promise<Map<number, Map<string, string>>>;
    AvatorListDetail2(): Promise<Map<number, Map<string, string>>>;
    GetDefaultParams2(cid: number): Promise<Map<string, Map<string, Map<string, number>>>>;
    GetCurrentParams2(cid: number): Promise<Map<string, Map<string, Map<string, number>>>>;
    Talk(cid: number, talktext: string | string[], option?: {
        filepath?: string;
        effects?: Array<[string, number]>;
        emotions?: Array<[string, number]>;
    }): Promise<number>;
    TalkAsync(cid: number, talktext: string | string[], option?: {
        effects?: Array<[string, number]>;
        emotions?: Array<[string, number]>;
    }): Promise<number>;
    private execute_talk;
    private gen_func;
}
//# sourceMappingURL=seikasay2.d.ts.map