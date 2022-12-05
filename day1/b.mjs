import { readFileSync } from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const content = readFileSync(path.join(__dirname, "input.txt"), "utf-8");

/**
 * @typedef {import("./schema").Elf} Elf
 */

/**
 * @param {Elf} elfA
 * @param {Elf} elfB
 * @returns {number}
 */
const compareElfCalories = (elfA, elfB) => {
  return elfB.calories - elfA.calories;
};

/**
 * @type {import("./schema").Elf}
 */
const initElf = { id: -1, calories: 0 };

const output = content
  .split("\n\n")
  .reduce(
    (acc, val, elfId) => {
      const raw = val.split("\n");
      const calories = raw.reduce((sum, cal) => sum + parseInt(cal, 10), 0);
      const candidate = { id: elfId, calories };

      return [...acc, candidate];
    },
    [initElf]
  )
  .sort(compareElfCalories);

console.log(output.slice(0, 3).reduce((acc, v) => acc + v.calories, 0));
