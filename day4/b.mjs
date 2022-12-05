import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const input = createReadStream(path.join(__dirname, "input.txt"), "utf-8");
const reader = createInterface({ input, crlfDelay: Infinity });

/**
 * @typedef {[number, number]} Section
 */

/**
 * @param  {...string} args
 * @returns {Section[]}
 */
const toSections = (...args) => {
  return args.map((arg) => {
    const sections = arg.split("-").map((s) => parseInt(s, 10));
    const start = sections[0];
    const end = sections[1];

    if (typeof start !== "number" || typeof end !== "number") {
      throw new Error(`assertion error: received invalid section: ${arg}`);
    }

    /** @type {Section} */
    const out = [start, end];

    return out;
  });
};

/**
 * @param {Section} a
 * @param {Section} b
 */
const overlaps = (a, b) => {
  const left = a[0] <= b[0] && a[1] >= b[1] ? a : b;
  const right = left === a ? b : a;

  return left[0] <= right[1] && right[0] <= left[1];
};

let total = 0;
for await (const line of reader) {
  const ranges = toSections(...line.split(","));
  if (ranges.length !== 2) {
    throw new Error(
      `assertion error: expected to section ranges but got ${ranges.length}: ${line}`
    );
  }

  const a = ranges[0];
  const b = ranges[1];
  if (!a || !b) {
    throw new Error(
      `assertion error: one or more ranges were undefined: ${a} - ${b}`
    );
  }

  if (overlaps(a, b)) {
    total += 1;
  }
}

console.log(`total is: ${total}`);
