import type { HTTP_interface, Param, SpeakerList } from "../type/type";
export default class HTTP implements HTTP_interface {
    private readonly url;
    private readonly id;
    private readonly password;
    private readonly validates;
    constructor(url: string, id: string, password: string);
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
    private gen_option;
}
//# sourceMappingURL=HTTP.d.ts.map