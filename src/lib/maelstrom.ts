// Game data from the Maelstrom General Rules, 2.5th Edition (MyLARP).
// This module is the single source of truth for rulebook-derived options
// used across character creation, event posting, and the rules/lore pages.

export const RULEBOOK_URL =
  "https://drive.google.com/file/d/1fbMmv-Vlq7oAdTAY4lks5p9B35ra8PPH/view";

export const CORE_CLASSES = [
  "Fighter",
  "Rogue",
  "Arcane Caster",
  "Divine Caster",
  "Trader",
] as const;

export type CoreClass = (typeof CORE_CLASSES)[number];

export const CORE_CLASS_DESCRIPTIONS: Record<CoreClass, string> = {
  Fighter:
    "The fundamentals of combat: precise strikes, disciplined defense, and exploiting an opponent's weaknesses. Grants two Combat Stamina.",
  Rogue:
    "Precision and positioning — striking when it matters and avoiding direct confrontation. Grants two Combat Stamina.",
  "Arcane Caster":
    "The Arcanist studies and commands the six elements, shaping elemental energy to support allies and disrupt enemies.",
  "Divine Caster":
    "Chosen by a god, you wield divine power: heal, protect, or strike down your enemies as your patron wills.",
  Trader:
    "The backbone of commerce and crafting — gathering resources, forging, brewing, and scribing to keep adventurers equipped.",
};

export const ARCANE_ELEMENTS = ["Earth", "Wood", "Air", "Metal", "Fire", "Water"] as const;

export const DIVINE_SPHERES = [
  "Life",
  "Death",
  "Chaos",
  "Order",
  "Darkness",
  "Light",
  "Knowledge",
  "Nature",
] as const;

// Attunement values are stored as "Arcane: Fire" / "Divine: Life" / "".
export const ARCANE_ATTUNEMENTS = ARCANE_ELEMENTS.map((e) => `Arcane: ${e}`);
export const DIVINE_ATTUNEMENTS = DIVINE_SPHERES.map((s) => `Divine: ${s}`);

export function attunementsForClass(coreClass: string): string[] {
  if (coreClass === "Arcane Caster") return ARCANE_ATTUNEMENTS;
  if (coreClass === "Divine Caster") return DIVINE_ATTUNEMENTS;
  return [];
}

export const FACTIONS = [
  "Tuscan Empire",
  "Cottontail League",
  "He Guo",
  "Independent / Own Faction",
] as const;

export const FACTION_LORE: { name: string; motto: string; description: string }[] = [
  {
    name: "The Tuscan Empire",
    motto: "Servitude is Virtue",
    description:
      "A sprawling empire of Human purists, all loyal to their all-powerful God Emperor. Nobody has seen the elusive emperor, but all are true believers of their power. The Empire is an authoritarian regime — cross the Inquisitors and you may be sent to the Salt Mines, a labour prison from which none return. In the colonies, most Tuscans are Second Sons: second-class citizens kept safe as long as they stay subservient.",
  },
  {
    name: "The Cottontail League",
    motto: "For the Betterment of All",
    description:
      "Disillusioned by the average post-apocalyptic fascist regime, these decentralised people work together to make the shattered Armis a better place. With no real leadership or governance, their network of individuals frees those under authoritative rule and brings aid to the oppressed. Their sense of community is great — they will die for you, and they expect the same of you.",
  },
  {
    name: "He Guo",
    motto: "Unity Through Prosperity",
    description:
      "A trade-driven monarchy founded by Lord He, who united the fractured Shattered States through diplomacy rather than conquest. Each province governs its own domain — mining, agriculture, lumber, livestock — so the Kingdom's needs are met without internal rivalry. Society is bound by deep-rooted cultural values: respect for elders, loyalty to family, and adherence to shared customs. Outsiders may trade, but true trust is reserved for those who honour these traditions.",
  },
];

// Events on the platform are sessions of the Maelstrom campaign world.
export const EVENT_TYPES = [
  "Main Campaign",
  "One-Shot Adventure",
  "Skirmish Night",
  "Tavern Social",
  "Training & Weapon Check",
  "Other",
] as const;

// What an event's organisers provide on site, per the rulebook's
// safety/equipment expectations.
export const EVENT_AMENITIES = [
  "Props provided",
  "Costume rental",
  "Loaner weapons",
  "Weapon & costume inspection",
  "Spell packets provided",
  "On-site camping",
  "Meals included",
  "First aiders on site",
] as const;
