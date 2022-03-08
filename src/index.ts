export { IEmotional } from "./interfaces";
export { EffectDirection, EffectKind, EffectStrength, EffectReaction } from "./enumerations";
export { EffectComponent } from "./components";

function hello(name: string = "Ivan"): string {
  return `Hello, ${name}`;
}

export default hello;