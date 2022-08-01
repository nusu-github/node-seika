import { z } from "zod";
export class Validates {
    constructor() {
        this.effect_list = z.enum([
            "volume",
            "speed",
            "pitch",
            "prephoneme",
            "postphoneme",
            "intonation",
            "alpha",
            "shortpause",
            "longpause",
        ]);
        this.cid = z.number().min(4);
        this.Version = z.string();
        this.Version_http = z.object({ version: z.string() });
        this.ProductScan = z.boolean();
        this.BootHttpService = z.boolean();
        this.AvatorList = z.array(z.object({ Key: this.cid, Value: z.string().min(1) }));
        this.AvatorList2 = z.array(z.object({
            Key: this.cid,
            Value: z.array(z.object({ Key: z.string(), Value: z.string() })),
        }));
        this.AvatorListDetail2 = z.array(z.object({
            Key: this.cid,
            Value: z.array(z.object({ Key: z.string(), Value: z.string() })),
        }));
        this.AvatorListDetail2_http = z.array(z.object({
            cid: this.cid,
            isalias: z.boolean(),
            name: z.string(),
            platform: z.string(),
            prod: z.string(),
        }));
        this.GetDefaultParams2 = z.array(z.union([
            z.object({
                Key: z.literal("effect"),
                Value: z.array(z.object({
                    Key: this.effect_list,
                    Value: z.array(z.object({ Key: z.string(), Value: z.number() })),
                })),
            }),
            z.object({
                Key: z.literal("emotion"),
                Value: z.array(z.object({
                    Key: z.string(),
                    Value: z.array(z.object({ Key: z.string(), Value: z.number() })),
                })),
            }),
        ]));
        this.GetDefaultParams2_http = z.object({
            effect: z.record(this.effect_list, z.object({
                value: z.number(),
                min: z.number(),
                max: z.number(),
                step: z.number(),
            })),
            emotion: z.record(z.string().min(1), z.object({
                value: z.number(),
                min: z.number(),
                max: z.number(),
                step: z.number(),
            })),
        });
        this.GetCurrentParams2 = this.GetDefaultParams2;
    }
}
//# sourceMappingURL=util.js.map