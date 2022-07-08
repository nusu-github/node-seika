import { execa } from "execa";
import iconv from "iconv-lite";
import { z } from "zod";

export class Validates {
  public readonly Version = z.string();

  public readonly ProductScan = z.boolean();

  public readonly BootHttpService = z.boolean();

  public readonly AvatorList = z.array(
    z.object({ Key: z.number(), Value: z.string() })
  );

  public readonly AvatorList2 = z.array(
    z.object({
      Key: z.number(),
      Value: z.array(z.object({ Key: z.string(), Value: z.string() })),
    })
  );

  public readonly AvatorListDetail2 = z.array(
    z.object({
      Key: z.number(),
      Value: z.array(z.object({ Key: z.string(), Value: z.string() })),
    })
  );

  public readonly GetDefaultParams2 = z.array(
    z.union([
      z.object({
        Key: z.string(),
        Value: z.array(
          z.object({
            Key: z.string(),
            Value: z.array(z.object({ Key: z.string(), Value: z.number() })),
          })
        ),
      }),
      z.object({
        Key: z.string(),
        Value: z.array(
          z.object({
            Key: z.string(),
            Value: z.array(z.object({ Key: z.string(), Value: z.number() })),
          })
        ),
      }),
    ])
  );

  public readonly GetCurrentParams2 = this.GetDefaultParams2;
}

export class Util {
  public static async gen_func(exe_path: string, arg: string[]) {
    const { decode } = iconv;
    const data = await execa(exe_path, arg, {
      encoding: null,
    });
    const stderr = decode(data.stderr, "Windows-31j");
    const stdout = decode(data.stdout, "Windows-31j");
    if (stderr) throw new Error(stderr);
    return stdout;
  }
}
