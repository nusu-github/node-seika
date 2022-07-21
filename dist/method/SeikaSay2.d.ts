import type { SeikaSay2_interface } from "../type/type";
export default class SeikaSay2 implements SeikaSay2_interface {
    private readonly exe_path;
    constructor(exe_path: string);
    private static stdout_parser;
    private static list_parser;
    private static param_parser;
    Version(): Promise<string>;
    AvatorList(): Promise<Map<number, string>>;
    private gen_func;
    AvatorList2(): Promise<Map<number, Map<string, string>>>;
    AvatorListDetail2(): Promise<Map<number, Map<string, string>>>;
    GetDefaultParams2(cid: number): Promise<Map<string, Map<string, Map<string, number>>>>;
    GetCurrentParams2(cid: number): Promise<Map<string, Map<string, Map<string, number>>>>;
    Talk(cid: number, talktext: string | string[], option?: {
        filepath?: string;
        effects?: [string, number][];
        emotions?: [string, number][];
    }): Promise<number>;
    TalkAsync(cid: number, talktext: string | string[], option?: {
        effects?: [string, number][];
        emotions?: [string, number][];
    }): Promise<number>;
    private execute_talk;
}
//# sourceMappingURL=SeikaSay2.d.ts.map