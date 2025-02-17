import type { VersionData } from "$api/types";
import type { Writable } from "svelte/store";
import { get, writable } from "svelte/store";
import { DATA_1_20 } from "./1.20";
import { DATA_1_19 } from "./1.19";
import { DATA_1_18 } from "./1.18";
import { DATA_1_17 } from "./1.17";
import { DATA_1_16 } from "./1.16";
import { localStore } from "$api/api";

export const expSources = ["Mob", "Block Break", "Block Place", "Craft", "Command", "Special", "Exp Bottle", "Smelt", "Quest"];

type Versions = "20" | "19" | "18" | "17" | "16";

const VERSIONS = {
  "20": DATA_1_20,
  "19": DATA_1_19,
  "18": DATA_1_18,
  "17": DATA_1_17,
  "16": DATA_1_16
};
const versionKeys: string[] = Object.keys(VERSIONS).reverse();

export const versionData: Writable<VersionData> = writable(VERSIONS[<Versions>versionKeys[0]]);

export const serverOptions: string[] = [];
versionKeys.forEach((v: string) => serverOptions.push("1." + v));
export const version: Writable<Versions> = localStore<Versions>("server-version", <Versions>versionKeys[0]);
version.subscribe((ver: Versions) => versionData.set(VERSIONS[ver]));

export const getMaterials = () => {
  return get(versionData).MATERIALS;
};

export const getBlocks = () => {
  return get(versionData).BLOCKS;
};

export const getDamageableMaterials = () => {
  return get(versionData).DAMAGEABLE_MATERIALS;
};

export const getAnyMaterials = () => {
  return ["Any", ...get(versionData).MATERIALS];
};

export const getSounds = () => {
  return get(versionData).SOUNDS;
};

export const getEntities = () => {
  return get(versionData).ENTITIES;
};

export const getAnyEntities = () => {
  return ["Any", ...get(versionData).ENTITIES];
};

export const getParticles = () => {
  return get(versionData).PARTICLES || [];
};

export const getBiomes = () => {
  return get(versionData).BIOMES;
};

export const getDamageTypes = () => {
  return get(versionData).DAMAGE_TYPES;
};

export const getPotionTypes = () => {
  return get(versionData).POTIONS;
};

export const getAnyPotion = () => {
  return ["Any", ...get(versionData).POTIONS];
};

export const getAnyConsumable = () => {
  return ["Any", ...get(versionData).CONSUMABLE];
};

export const getGoodPotions = () => {
  const list = get(versionData).POTIONS.filter(type => GOOD_POTIONS.includes(type));
  return ["All", ...list];
};

export const getBadPotions = () => {
  const list = get(versionData).POTIONS.filter(type => BAD_POTIONS.includes(type));
  return ["All", ...list];
};

export const getDyes = () => {
  return DYES;
};

export const getProjectiles = () => {
  return get(versionData).PROJECTILES;
};

export const getAnyProjectiles = () => {
  return ["Any", ...get(versionData).PROJECTILES];
};

export const getMobDisguises = () => {
  return get(versionData).MOB_DISGUISES;
};

export const getMiscDisguises = () => {
  return get(versionData).MISC_DISGUISES;
};

const GOOD_POTIONS: string[] = [
  "Speed",
  "Fast Digging",
  "Increase Damage",
  "Jump",
  "Regeneration",
  "Damage Resistance",
  "Fire Resistance",
  "Water Breathing",
  "Invisibility",
  "Night Vision",
  "Health Boost",
  "Absorption",
  "Saturation",
  "Glowing",
  "Luck",
  "Slow Falling",
  "Conduit Power",
  "Dolphins Grace"
];

const BAD_POTIONS: string[] = [
  "Slow",
  "Slow Digging",
  "Confusion",
  "Blindness",
  "Hunger",
  "Weakness",
  "Poison",
  "Wither",
  "Levitation",
  "Unluck"
];

const DYES: string[] = [
  "BLACK",
  "BLUE",
  "BROWN",
  "CYAN",
  "GRAY",
  "GREEN",
  "LIGHT_BLUE",
  "LIGHT_GRAY",
  "LIME",
  "MAGENTA",
  "ORANGE",
  "PINK",
  "PURPLE",
  "RED",
  "WHITE",
  "YELLOW"
];
