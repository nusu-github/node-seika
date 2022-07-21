import type { HTTP_interface } from "../type/type";
export default class HTTP implements HTTP_interface {
    private readonly url;
    private readonly id;
    private readonly password;
    private readonly validates;
    constructor(url: string, id: string, password: string);
    private param_parser;
    private gen_option;
    Version(): Promise<string>;
    AvatorList(): Promise<Map<number, string>>;
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
}
//# sourceMappingURL=HTTP.d.ts.map