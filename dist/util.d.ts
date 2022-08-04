import { z } from "zod";
export declare class Validates {
    readonly effect_list: z.ZodEnum<["volume", "speed", "pitch", "prephoneme", "postphoneme", "intonation", "alpha", "shortpause", "longpause"]>;
    readonly cid: z.ZodNumber;
    readonly Version: z.ZodString;
    readonly Version_http: z.ZodObject<{
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
    }, {
        version: string;
    }>;
    readonly ProductScan: z.ZodBoolean;
    readonly BootHttpService: z.ZodBoolean;
    readonly AvatorList: z.ZodArray<z.ZodObject<{
        Key: z.ZodNumber;
        Value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        Key: number;
        Value: string;
    }, {
        Key: number;
        Value: string;
    }>, "many">;
    readonly AvatorList2: z.ZodArray<z.ZodObject<{
        Key: z.ZodNumber;
        Value: z.ZodArray<z.ZodObject<{
            Key: z.ZodString;
            Value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            Key: string;
            Value: string;
        }, {
            Key: string;
            Value: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        Key: number;
        Value: {
            Key: string;
            Value: string;
        }[];
    }, {
        Key: number;
        Value: {
            Key: string;
            Value: string;
        }[];
    }>, "many">;
    readonly AvatorListDetail2: z.ZodArray<z.ZodObject<{
        Key: z.ZodNumber;
        Value: z.ZodArray<z.ZodObject<{
            Key: z.ZodString;
            Value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            Key: string;
            Value: string;
        }, {
            Key: string;
            Value: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        Key: number;
        Value: {
            Key: string;
            Value: string;
        }[];
    }, {
        Key: number;
        Value: {
            Key: string;
            Value: string;
        }[];
    }>, "many">;
    readonly AvatorListDetail2_http: z.ZodArray<z.ZodObject<{
        cid: z.ZodNumber;
        isalias: z.ZodBoolean;
        name: z.ZodString;
        platform: z.ZodString;
        prod: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        cid: number;
        isalias: boolean;
        platform: string;
        prod: string;
    }, {
        name: string;
        cid: number;
        isalias: boolean;
        platform: string;
        prod: string;
    }>, "many">;
    readonly GetDefaultParams2: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        Key: z.ZodLiteral<"effect">;
        Value: z.ZodArray<z.ZodObject<{
            Key: z.ZodEnum<["volume", "speed", "pitch", "prephoneme", "postphoneme", "intonation", "alpha", "shortpause", "longpause"]>;
            Value: z.ZodArray<z.ZodObject<{
                Key: z.ZodString;
                Value: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                Key: string;
                Value: number;
            }, {
                Key: string;
                Value: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            Key: "volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause";
            Value: {
                Key: string;
                Value: number;
            }[];
        }, {
            Key: "volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause";
            Value: {
                Key: string;
                Value: number;
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        Key: "effect";
        Value: {
            Key: "volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause";
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }, {
        Key: "effect";
        Value: {
            Key: "volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause";
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }>, z.ZodObject<{
        Key: z.ZodLiteral<"emotion">;
        Value: z.ZodArray<z.ZodObject<{
            Key: z.ZodString;
            Value: z.ZodArray<z.ZodObject<{
                Key: z.ZodString;
                Value: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                Key: string;
                Value: number;
            }, {
                Key: string;
                Value: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }, {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        Key: "emotion";
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }, {
        Key: "emotion";
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }>]>, "many">;
    readonly GetDefaultParams2_http: z.ZodObject<{
        effect: z.ZodRecord<z.ZodEnum<["volume", "speed", "pitch", "prephoneme", "postphoneme", "intonation", "alpha", "shortpause", "longpause"]>, z.ZodObject<{
            value: z.ZodNumber;
            min: z.ZodNumber;
            max: z.ZodNumber;
            step: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            value: number;
            min: number;
            max: number;
            step: number;
        }, {
            value: number;
            min: number;
            max: number;
            step: number;
        }>>;
        emotion: z.ZodRecord<z.ZodString, z.ZodObject<{
            value: z.ZodNumber;
            min: z.ZodNumber;
            max: z.ZodNumber;
            step: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            value: number;
            min: number;
            max: number;
            step: number;
        }, {
            value: number;
            min: number;
            max: number;
            step: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        effect: Partial<Record<"volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause", {
            value: number;
            min: number;
            max: number;
            step: number;
        }>>;
        emotion: Record<string, {
            value: number;
            min: number;
            max: number;
            step: number;
        }>;
    }, {
        effect: Partial<Record<"volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause", {
            value: number;
            min: number;
            max: number;
            step: number;
        }>>;
        emotion: Record<string, {
            value: number;
            min: number;
            max: number;
            step: number;
        }>;
    }>;
    readonly GetCurrentParams2: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        Key: z.ZodLiteral<"effect">;
        Value: z.ZodArray<z.ZodObject<{
            Key: z.ZodEnum<["volume", "speed", "pitch", "prephoneme", "postphoneme", "intonation", "alpha", "shortpause", "longpause"]>;
            Value: z.ZodArray<z.ZodObject<{
                Key: z.ZodString;
                Value: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                Key: string;
                Value: number;
            }, {
                Key: string;
                Value: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            Key: "volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause";
            Value: {
                Key: string;
                Value: number;
            }[];
        }, {
            Key: "volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause";
            Value: {
                Key: string;
                Value: number;
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        Key: "effect";
        Value: {
            Key: "volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause";
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }, {
        Key: "effect";
        Value: {
            Key: "volume" | "speed" | "pitch" | "prephoneme" | "postphoneme" | "intonation" | "alpha" | "shortpause" | "longpause";
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }>, z.ZodObject<{
        Key: z.ZodLiteral<"emotion">;
        Value: z.ZodArray<z.ZodObject<{
            Key: z.ZodString;
            Value: z.ZodArray<z.ZodObject<{
                Key: z.ZodString;
                Value: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                Key: string;
                Value: number;
            }, {
                Key: string;
                Value: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }, {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        Key: "emotion";
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }, {
        Key: "emotion";
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }>]>, "many">;
}
//# sourceMappingURL=util.d.ts.map