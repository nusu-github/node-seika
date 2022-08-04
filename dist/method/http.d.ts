export default class Http {
    private readonly url;
    private readonly id;
    private readonly password;
    private readonly validates;
    constructor(url: string, id: string, password: string);
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
    }): Promise<-1 | 0>;
    TalkAsync(cid: number, talktext: string | string[], option?: {
        effects?: Array<[string, number]>;
        emotions?: Array<[string, number]>;
    }): Promise<number>;
    private param_parser;
    private gen_option;
}
//# sourceMappingURL=http.d.ts.map