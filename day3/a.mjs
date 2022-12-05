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

let total = 0;
for await (const line of reader) {
  const compA = new Set(line.slice(0, line.length / 2).split(""));
  const compB = new Set(line.slice(line.length / 2).split(""));
  const intersection = new Set([...compA].filter((x) => compB.has(x)));
  const value = [...intersection][0];

  if (typeof value !== "string") {
    throw new Error(`no common item in rucksack: ${line}`);
  }

  const score = letters[value];
  if (typeof score !== "number") {
    throw new Error(`no priority score for item: ${value}`);
  }

  total += score;
}

console.log(`total is: ${total}`);
