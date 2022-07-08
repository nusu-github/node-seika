import type { Param, SeikaSay2_interface, SpeakerList } from "../type/type";
export default class SeikaSay2 implements SeikaSay2_interface {
    private readonly exe_path;
    constructor(exe_path: string);
    private static stdout_parser;
    private static list_parser;
    private static param_parser;
    Version(): Promise<string>;
    AvatorList(): Promise<SpeakerList>;
    AvatorList2(): Promise<SpeakerList>;
    AvatorListDetail2(): Promise<SpeakerList>;
    GetDefaultParams2(cid: number): Promise<Param>;
    GetCurrentParams2(cid: number): Promise<Param>;
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
    private execute_talk;
}
//# sourceMappingURL=SeikaSay2.d.ts.map