import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const input = createReadStream(path.join(__dirname, "input.txt"), "utf-8");
const reader = createInterface({ input, crlfDelay: Infinity });

const rps = "ABC";

/**
 * @param {string} a
 * @param {string} b
 */
const decide = (a, b) => {
  switch (`${a}${b}`) {
    case "AA":
      return 1 + 3;
    case "AB":
      return 2 + 6;
    case "AC":
      return 3 + 0;
    case "BA":
      return 1 + 0;
    case "BB":
      return 2 + 3;
    case "BC":
      return 3 + 6;
    case "CA":
      return 1 + 6;
    case "CB":
      return 2 + 0;
    case "CC":
      return 3 + 3;
    default:
      throw new Error(`unexpected choices: ${a} vs ${b}`);
  }
};

/**
 * @param {string} opponent
 * @param {string} strategy
 */
const getPlay = (opponent, strategy) => {
  switch (strategy) {
    case "X":
      return rps.at(rps.indexOf(opponent) - 1);
    case "Y":
      return opponent;
    case "Z":
      return rps.at(rps.indexOf(opponent) + 1) || rps[0];
    default:
      throw new Error(`unrecognized strategy: ${strategy}`);
  }
};

let total = 0;

for await (const line of reader) {
  const segments = line.split(" ");
  const opponent = segments[0];
  const strategy = segments[1];

  if (typeof opponent !== "string" || typeof strategy !== "string") {
    throw new Error(`unexpected line: ${line}`);
  }

  const play = getPlay(opponent, strategy);
  if (typeof play !== "string") {
    throw new Error(`failed to resolve strategy: ${line}`);
  }

  const outcome = decide(opponent, play);

  total += outcome;
}

console.log(`total is: ${total}`);
