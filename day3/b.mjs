import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const input = createReadStream(path.join(__dirname, "input.txt"), "utf-8");
const reader = createInterface({ input, crlfDelay: Infinity });
const letters = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .map((l, i) => [l, i + 1])
);

/**
 * @type {string[]}
 */
const buffer = [];
let total = 0;

for await (const line of reader) {
  buffer.push(line);

  if (buffer.length !== 3) {
    continue;
  }

  const group = buffer.slice(0);
  buffer.length = 0;

  const b0 = group[0]?.split("");
  const b1 = group[1]?.split("");
  const b2 = group[2]?.split("");

  if (!b0 || !b1 || !b2) {
    throw new Error("assertion error: unexpectedly missing item in group");
  }

  const s1 = new Set(b1);
  const s2 = new Set(b2);

  const badges = new Set([...b0].filter((v) => s1.has(v) && s2.has(v)));

  if (badges.size !== 1) {
    throw new Error(`assertion error: expected 1 item in common: ${badges}`);
  }

  const badge = [...badges][0];
  if (typeof badge !== "string") {
    throw new Error(`assertion error: badge is missing: ${badge}`);
  }

  const score = letters[badge];
  if (typeof score !== "number") {
    throw new Error(`no priority score for item: ${badge}`);
  }

  total += score;
}

console.log(`total is: ${total}`);
