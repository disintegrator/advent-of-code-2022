import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const input = createReadStream(path.join(__dirname, "input.txt"), "utf-8");
const reader = createInterface({ input, crlfDelay: Infinity });

/**
 * @param {string[]} rows
 */
const parseStacks = (rows) => {
  if (rows.length < 2) {
    throw new Error(
      `assertion error: expected at least 2 rows in layout: ${rows}`
    );
  }

  const lastColumnLabel = initialLayout.at(-1)?.trim().split(" ").at(-1);
  if (typeof lastColumnLabel !== "string") {
    throw new Error(
      `assertion error: failed to read last column number: ${initialLayout.at(
        -1
      )}`
    );
  }

  const totalStacks = parseInt(lastColumnLabel, 10);

  /** @type {string[][]} */
  const stacks = Array.from({ length: totalStacks }).map((_) => []);
  rows
    .slice(0, -1)
    .reverse()
    .forEach((row) => {
      for (let i = 0; i < totalStacks; i++) {
        const columnOffset = i * 4;

        const value = row.slice(columnOffset, columnOffset + 3);
        if (!value.trim()) {
          continue;
        }

        stacks[i]?.push(value);
      }
    });

  return stacks;
};

const instructionRE =
  /^move (?<count>\d+) from (?<fromStack>\d+) to (?<toStack>\d+)$/;

/**
 * @param {string[][]} stacks
 * @param {string} line
 */
const processInstruction = (stacks, line) => {
  const groups = line.match(instructionRE)?.groups;
  if (groups == null) {
    throw new Error(
      `assertion error: line does not contain move instruction: ${line}`
    );
  }

  const {
    count: rawCount,
    fromStack: rawFromStack,
    toStack: rawToStack,
  } = groups;
  if (!rawCount || !rawFromStack || !rawToStack) {
    throw new Error(
      `assertion error: line does not contain move instruction parameters: ${line}`
    );
  }

  const count = parseInt(rawCount, 10);
  const fromStack = parseInt(rawFromStack, 10);
  const toStack = parseInt(rawToStack, 10);
  if ([count, fromStack, toStack].find((n) => Number.isNaN(n))) {
    throw new Error(
      `assertion error: move parameters are not numbers: count (${count}), from (${fromStack}), to (${toStack})`
    );
  }

  const src = stacks[fromStack - 1];
  const dst = stacks[toStack - 1];
  if (!src || !dst) {
    throw new Error(
      `assertion error: from and to stack must be defined: ${src} -> ${dst}`
    );
  }

  const itemsToMove = src.splice(Math.max(0, src.length - count), count);
  dst.push(...itemsToMove);
};

/** @type {string[]} */
let initialLayout = [];
/** @type {string[][]} */
let stacks = [];

for await (const line of reader) {
  if (line === "" && stacks.length === 0) {
    stacks = parseStacks(initialLayout);
    continue;
  }

  if (stacks.length === 0) {
    initialLayout.push(line);
  } else {
    processInstruction(stacks, line);
  }
}

console.log(stacks.map((s) => s.at(-1)?.at(1)).join(""));
