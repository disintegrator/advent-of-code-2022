import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const input = createReadStream(path.join(__dirname, "input.txt"), "utf-8");
const reader = createInterface({ input, crlfDelay: Infinity });

/**
 * @param {string} a
 * @param {string} b
 */
const decide = (a, b) => {
  switch (`${a}${b}`) {
    case "AX":
      return 1 + 3;
    case "AY":
      return 2 + 6;
    case "AZ":
      return 3 + 0;
    case "BX":
      return 1 + 0;
    case "BY":
      return 2 + 3;
    case "BZ":
      return 3 + 6;
    case "CX":
      return 1 + 6;
    case "CY":
      return 2 + 0;
    case "CZ":
      return 3 + 3;
    default:
      throw new Error(`unexpected choices: ${a} vs ${b}`);
  }
};

let total = 0;

for await (const line of reader) {
  const plays = line.split(" ");
  const a = plays[0];
  const b = plays[1];

  if (typeof a !== "string" || typeof b !== "string") {
    throw new Error(`unexpected line: ${line}`);
  }

  const outcome = decide(a, b);

  total += outcome;
}

console.log(`total is: ${total}`);
