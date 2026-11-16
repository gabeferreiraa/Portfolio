import type { EffectDef } from "../engine";
import { decode } from "./decode";
import { donut } from "./donut";
import { image } from "./image";
import { jellyfish } from "./jellyfish";
import { lava } from "./lava";
import { plasma } from "./plasma";
import { rain } from "./rain";
import { ripples } from "./ripples";
import { warp } from "./warp";
import { waves } from "./waves";

// Canvas effects, in picker order. Add a new one here and it appears in the playground.
export const effects: EffectDef[] = [jellyfish, waves, plasma, lava, ripples, decode, image, donut, warp, rain];
