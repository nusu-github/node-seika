import { z } from "zod";

import { Validates } from "../util";

const validates = new Validates();

export interface Version {
  version: string;
}

export interface Avator2 {
  cid: number;
  isalias: boolean;
  name: string;
  platform: string;
  prod: string;
}

export type AvatorList = z.infer<typeof validates.AvatorList>;
export type AvatorList2 = z.infer<typeof validates.AvatorList2>;

export type AvatorListDetail2 = z.infer<typeof validates.AvatorListDetail2>;

export interface Json_Param {
  effect: Effect;
  emotion: Record<string, ParamData>;
}

export interface Effect {
  volume: ParamData;
  speed?: ParamData;
  pitch?: ParamData;
  prephoneme?: ParamData;
  postphoneme?: ParamData;
  intonation?: ParamData;
  alpha?: ParamData;
  shortpause?: ParamData;
  longpause?: ParamData;
}

export interface ParamData {
  value: number;
  min: number;
  max: number;
  step: number;
}
