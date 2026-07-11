import { RULEBOOK_URL } from "@/lib/maelstrom";

export const metadata = { title: "Rules — Guildhall" };

export default function RulesPage() {
  return (
    <div className="rules">
      <h1>Maelstrom General Rules — quick reference</h1>
      <p className="muted">
        A condensed reference of the Maelstrom General Rules, 2.5th Edition (MyLARP). It does not
        replace the <a href={RULEBOOK_URL}>full rulebook</a> — read that before your first event.
        Game Masters have final say on all rules disputes.
      </p>

      <section>
        <h2>Safety first</h2>
        <ul className="list">
          <li>
            <strong>Consent above all.</strong> Establish clear, spoken consent before anything
            beyond normal gameplay contact. Consent can be withdrawn at any time, by either side,
            for any reason — failing to respect this is a bannable offence.
          </li>
          <li>
            <strong>Age limit:</strong> 16+ without parental consent; under-16s case by case.
          </li>
          <li>
            <strong>&lsquo;Are you OK?&rsquo; sign:</strong> make a circle with index finger and
            thumb held at your chest with eye contact. The other player must return the sign; if
            not, go out of character and check verbally.
          </li>
          <li>
            <strong>MAN DOWN:</strong> the emergency call for a real injury. The game stops
            immediately — freeze, put your weapon on your head, repeat the call until a First Aider
            arrives. Resume only on the GM&apos;s &ldquo;TIME IN&rdquo;.
          </li>
          <li>
            <strong>Red &amp; white ribbon:</strong> ribboned players must never be touched or
            attacked under any circumstances, and stay out of combat themselves.
          </li>
          <li>
            <strong>Restricted hit zones:</strong> head, neck, hands, feet, and groin. Strikes
            there are invalid and deal no damage — and you must actively protect these zones.
          </li>
          <li>
            <strong>No excessive force:</strong> a light tap suffices; harder hits do not deal more
            damage. No punching, kicking, grappling, or shield bashing. Only hit with the padded
            striking surface of an approved weapon.
          </li>
          <li>
            <strong>No physical restraining:</strong> roleplay it instead — drape a rope loosely
            over hands and state they are bound.
          </li>
          <li>
            <strong>Out-of-Character sign:</strong> a fist held in the air. Ignore that person
            in-game.
          </li>
        </ul>
      </section>

      <section>
        <h2>Hit points, armour &amp; combat</h2>
        <ul className="list">
          <li>Every character has a base of <strong>3 Hit Points (HP)</strong>.</li>
          <li>
            A hit to a limb deals <strong>1 damage</strong>; a hit to the torso deals{" "}
            <strong>DOUBLE</strong>.
          </li>
          <li>
            Damage priority: <strong>TAP → AP → THP → HP</strong> (temporary armour, armour,
            temporary hit points, hit points).
          </li>
          <li>
            <strong>Combat Stamina (CS)</strong> powers combat skills and refreshes after 1 minute
            out of combat.
          </li>
          <li>
            At 0 HP you enter <strong>Bleedout</strong>: lie down, no talking. If not healed within{" "}
            <strong>10 minutes</strong>, your character dies.
          </li>
          <li>
            <strong>Death is permanent.</strong> Leave your in-game items where you fell, report to
            a GM, then join the NPC crew or create a new character — no clones, twins, descendants,
            or resurrections of the deceased.
          </li>
          <li>
            Damage and armour reset each morning: you start every day at full HP and AP.
          </li>
          <li>
            Swing with at least 45° of range — no &ldquo;drumming&rdquo;. Drummed hits count as one.
          </li>
          <li>
            <strong>PvP is allowed</strong> with in-character cause — inform a GM beforehand.
          </li>
        </ul>

        <h3>Armour points</h3>
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Light armour (leather, hide, padded)</th>
              <th>Heavy armour (metal, scale)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Torso</td><td>1</td><td>2</td></tr>
            <tr><td>Arms</td><td>1</td><td>2</td></tr>
            <tr><td>Legs</td><td>1</td><td>1</td></tr>
            <tr><td>Helmet</td><td>1</td><td>1</td></tr>
            <tr><td><strong>Maximum AP</strong></td><td><strong>4</strong></td><td><strong>6</strong></td></tr>
          </tbody>
        </table>
        <p className="muted">
          Armour must cover at least 50% of a location to grant its AP. Foam armour is allowed but
          must be painted to read as its material. Shields (max 60 × 120 cm) block arrows, thrown
          weapons, and spell packets — but not Targeted spells.
        </p>

        <h3>Weapon sizes</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Striking-surface length</th>
              <th>Special rules</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Thrown</td><td>&lt; 30 cm</td><td>Coreless, throw only, one at a time</td></tr>
            <tr><td>Small</td><td>31–45 cm</td><td>Only this size or smaller may be dual-wielded</td></tr>
            <tr><td>Medium</td><td>46–110 cm</td><td>—</td></tr>
            <tr><td>Large</td><td>111–150 cm</td><td>Two hands at all times</td></tr>
            <tr><td>Staff</td><td>151–215 cm</td><td>Two hands at all times, no wobbling</td></tr>
          </tbody>
        </table>
        <p className="muted">
          All weapons must pass inspection (twist and compression tests; thrust test to clear
          stabbing). Max bow poundage 28 lbs, half-draws only. Arrows deal PIERCE SINGLE.
        </p>
      </section>

      <section>
        <h2>Calls</h2>
        <p>
          A call is a single word signalling that something special is happening. Calls are heard
          by the player; effects are felt by the character.{" "}
          <strong>
            If you hear a call you don&apos;t know, drop to 0 HP and enter Bleedout
          </strong>{" "}
          — then ask after the fight.
        </p>
        <h3>Damage calls</h3>
        <table>
          <tbody>
            <tr><td><strong>SINGLE</strong></td><td>Deals 1 damage</td></tr>
            <tr><td><strong>DOUBLE</strong></td><td>Deals 2 damage</td></tr>
            <tr><td><strong>PIERCE</strong></td><td>Ignores Armour Points</td></tr>
            <tr><td><strong>FATAL</strong></td><td>Set HP to 0, enter Bleedout</td></tr>
            <tr><td><strong>BLUNT / SHARP / MAGIC</strong></td><td>Damage types (hammers &amp; staves / blades / spells)</td></tr>
            <tr><td><strong>&ldquo;No Effect&rdquo;</strong></td><td>Called by the receiver when immune</td></tr>
          </tbody>
        </table>
        <h3>Condition calls</h3>
        <table>
          <tbody>
            <tr><td><strong>CRUSH</strong></td><td>Affected limb unusable until you HEAL 1</td></tr>
            <tr><td><strong>DISABLE</strong></td><td>Close your eyes, no movement (15 s)</td></tr>
            <tr><td><strong>DISARM X</strong></td><td>Drop the named item fully to the ground</td></tr>
            <tr><td><strong>ENTHRALL</strong></td><td>Focus entirely on the source, non-hostile unless attacked (15 s)</td></tr>
            <tr><td><strong>FATIGUE</strong></td><td>No combat skills (15 s)</td></tr>
            <tr><td><strong>FEAR</strong></td><td>Flee and avoid the source; you may defend (15 s)</td></tr>
            <tr><td><strong>HEAL X</strong></td><td>Heal X damage</td></tr>
            <tr><td><strong>REFLECT X</strong></td><td>Spell bounces back to the caster</td></tr>
            <tr><td><strong>ROOT</strong></td><td>Your legs cannot move (15 s)</td></tr>
            <tr><td><strong>SHATTER X</strong></td><td>Breaks a non-weapon object; shattered armour loses all AP until repaired</td></tr>
            <tr><td><strong>SILENCE</strong></td><td>No speaking or spellcasting (15 s)</td></tr>
            <tr><td><strong>SLOW</strong></td><td>Walking pace only (15 s)</td></tr>
            <tr><td><strong>STRIKE</strong></td><td>Pushed 5 steps from the source; fall if safe</td></tr>
          </tbody>
        </table>
        <h3>GM calls</h3>
        <table>
          <tbody>
            <tr><td><strong>MASS</strong></td><td>If you hear it, it affects you</td></tr>
            <tr><td><strong>TIME STOP</strong></td><td>Stand still, eyes closed, until &ldquo;TIME IN&rdquo;</td></tr>
            <tr><td><strong>TIME IN</strong></td><td>Resume play</td></tr>
            <tr><td><strong>TIME OUT</strong></td><td>Extended stop — go out of character</td></tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Spellcasting</h2>
        <ul className="list">
          <li>
            Roleplay the incantation for <strong>10 seconds</strong>, draw a stone from your{" "}
            <strong>spell pouch</strong> (7 success + 1 fail stones, visually distinct), and on a
            success throw the spell packet or point at your target and make the effect call.
          </li>
          <li>
            Feet planted while casting; one hand free. Damage or movement fizzles the spell.
          </li>
          <li>
            Armour penalties: light armour <strong>−3</strong> success stones, heavy armour{" "}
            <strong>−4</strong>. A magical conduit (staff, wand, grimoire, orb) in your off hand
            gives <strong>+1</strong>. Minimum 1 success and 1 fail stone.
          </li>
          <li>
            Ranges: <strong>Targeted</strong> (3 m, guaranteed by pointing), <strong>Spell
            Packet</strong> (thrown; blocked by shields), <strong>Touch</strong>, and{" "}
            <strong>Self</strong>.
          </li>
          <li>
            Players carry at most <strong>3 spell packets</strong>; hoarding others&apos; packets
            is not allowed.
          </li>
          <li>
            Scrolls cast instantly when read and destroyed; tomes teach spells to those with the
            prerequisite attunements.
          </li>
        </ul>
      </section>

      <section>
        <h2>Items, coin &amp; looting</h2>
        <ul className="list">
          <li>
            Game objects need an <strong>Item Card</strong> to function and a{" "}
            <strong>physrep</strong> (physical representation) to be used. Cards can be traded
            without the physrep.
          </li>
          <li>
            Currency: <strong>1 Gold = 10 Silver</strong>; 1 Silver buys a hot, basic tavern meal.
            New characters start with <strong>3 Silver</strong>.
          </li>
          <li>
            Looting downed characters: kneel, place a hand over a non-sensitive area, call{" "}
            <em>&ldquo;LOOTING 1… LOOTING 2… LOOTING 3…&rdquo;</em> and the character hands over
            items. No physical searching without spoken consent.
          </li>
          <li>
            You can steal <strong>game objects</strong>, never personal property — and inform a GM
            when you do. Damaged stolen physreps are compensated by the thief.
          </li>
          <li>
            Potions work only with their slip present; opening and reading the slip counts as
            drinking it (unless you have Trader Alchemy). If an effect is uninterpretable, assume{" "}
            <strong>FATAL</strong>.
          </li>
        </ul>
      </section>

      <section>
        <h2>Character creation</h2>
        <ul className="list">
          <li>
            Start with <strong>3 HP, 3 Silver, basic gear, and one Core Class skill</strong>{" "}
            (Fighter, Rogue, Arcane Caster, Divine Caster, or Trader). Maximum of two Core
            Classes, ever.
          </li>
          <li>
            The setting is <strong>high fantasy</strong> — no guns, no electricity, no sci-fi or
            modern backgrounds, and no characters lifted from existing media.
          </li>
          <li>
            <strong>Humanoid races only</strong> (human, elf, dwarf, orc…) — and show, don&apos;t
            tell: elves need pointed ears, orcs need tusks.
          </li>
          <li>
            Backstories grant no powers, and you may not write other player characters into your
            backstory without their consent.
          </li>
          <li>
            Everyone knows the basic skills: <strong>Stabilise Wound</strong>, <strong>Carry
            Person</strong>, the <strong>Magic Orb</strong> packet spell, and the once-per-day{" "}
            <strong>Life Pulse</strong> heal.
          </li>
          <li>
            Costume minimum: era-appropriate attire — a plain tunic and belt will do. No logo tees.
          </li>
        </ul>
      </section>

      <section>
        <h2>The spirit of the game</h2>
        <ul className="list">
          <li>Assume malice last; don&apos;t count other people&apos;s HP.</li>
          <li>No griefing, trolling, or settling out-of-character disputes in game.</li>
          <li>Maelstrom runs on the honour system — follow the letter and the spirit of the rules.</li>
          <li>Winning is not the point. Loss, including character death, gives victory meaning.</li>
          <li>Act out your injuries, fight with flair, and respect the crew.</li>
        </ul>
      </section>
    </div>
  );
}
