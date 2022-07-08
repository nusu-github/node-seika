import { z } from "zod";
export declare class Validates {
    readonly Version: z.ZodString;
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
    readonly GetDefaultParams2: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        Key: z.ZodString;
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
        Key: string;
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }, {
        Key: string;
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }>, z.ZodObject<{
        Key: z.ZodString;
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
        Key: string;
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }, {
        Key: string;
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }>]>, "many">;
    readonly GetCurrentParams2: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        Key: z.ZodString;
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
        Key: string;
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }, {
        Key: string;
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }>, z.ZodObject<{
        Key: z.ZodString;
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
        Key: string;
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }, {
        Key: string;
        Value: {
            Key: string;
            Value: {
                Key: string;
                Value: number;
            }[];
        }[];
    }>]>, "many">;
}
export declare class Util {
    static gen_func(exe_path: string, arg: string[]): Promise<string>;
}
//# sourceMappingURL=util.d.ts.map