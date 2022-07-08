import { execa } from "execa";
import iconv from "iconv-lite";
import { z } from "zod";
export class Validates {
    constructor() {
        this.Version = z.string();
        this.ProductScan = z.boolean();
        this.BootHttpService = z.boolean();
        this.AvatorList = z.array(z.object({ Key: z.number(), Value: z.string() }));
        this.AvatorList2 = z.array(z.object({
            Key: z.number(),
            Value: z.array(z.object({ Key: z.string(), Value: z.string() })),
        }));
        this.AvatorListDetail2 = z.array(z.object({
            Key: z.number(),
            Value: z.array(z.object({ Key: z.string(), Value: z.string() })),
        }));
        this.GetDefaultParams2 = z.array(z.union([
            z.object({
                Key: z.string(),
                Value: z.array(z.object({
                    Key: z.string(),
                    Value: z.array(z.object({ Key: z.string(), Value: z.number() })),
                })),
            }),
            z.object({
                Key: z.string(),
                Value: z.array(z.object({
                    Key: z.string(),
                    Value: z.array(z.object({ Key: z.string(), Value: z.number() })),
                })),
            }),
        ]));
        this.GetCurrentParams2 = this.GetDefaultParams2;
    }
}
export class Util {
    static async gen_func(exe_path, arg) {
        const { decode } = iconv;
        const data = await execa(exe_path, arg, {
            encoding: null,
        });
        const stderr = decode(data.stderr, "Windows-31j");
        const stdout = decode(data.stdout, "Windows-31j");
        if (stderr)
            throw new Error(stderr);
        return stdout;
    }
}
//# sourceMappingURL=util.js.map