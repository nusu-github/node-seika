import { execa } from "execa";
import iconv from "iconv-lite";
import { z } from "zod";

export class Validates {
  public readonly effect_list = z.enum([
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

  public readonly cid = z.number().min(4);

  public readonly Version = z.string();

  public readonly Version_http = z.object({ version: z.string() });

  public readonly ProductScan = z.boolean();

  public readonly BootHttpService = z.boolean();

  public readonly AvatorList = z.array(
    z.object({ Key: this.cid, Value: z.string().min(1) })
  );

  public readonly AvatorList2 = z.array(
    z.object({
      Key: this.cid,
      Value: z.array(z.object({ Key: z.string(), Value: z.string() })),
    })
  );

  public readonly AvatorListDetail2 = z.array(
    z.object({
      Key: this.cid,
      Value: z.array(z.object({ Key: z.string(), Value: z.string() })),
    })
  );

  public readonly AvatorListDetail2_http = z.array(
    z.object({
      cid: this.cid,
      isalias: z.boolean(),
      name: z.string(),
      platform: z.string(),
      prod: z.string(),
    })
  );

  public readonly GetDefaultParams2 = z.array(
    z.union([
      z.object({
        Key: z.literal("effect"),
        Value: z.array(
          z.object({
            Key: this.effect_list,
            Value: z.array(z.object({ Key: z.string(), Value: z.number() })),
          })
        ),
      }),
      z.object({
        Key: z.literal("emotion"),
        Value: z.array(
          z.object({
            Key: z.string(),
            Value: z.array(z.object({ Key: z.string(), Value: z.number() })),
          })
        ),
      }),
    ])
  );

  public readonly GetDefaultParams2_http = z.object({
    effect: z.record(
      this.effect_list,
      z.object({
        value: z.number(),
        min: z.number(),
        max: z.number(),
        step: z.number(),
      })
    ),
    emotion: z.record(
      z.string().min(1),
      z.object({
        value: z.number(),
        min: z.number(),
        max: z.number(),
        step: z.number(),
      })
    ),
  });

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
