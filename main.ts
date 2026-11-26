// One Line, One Chill — make.fun entry.
// Competition: u-azazex-one-line-one-chill-6d4d5488.
// Node 22, standard library only. The program writes one fixed line to
// entry.txt under /output (or $MAKEFUN_OUTPUT_DIR when set). The line is
// deterministic: the same bytes every run, no trailing newline, so the
// judge reads exactly one chilling sentence and nothing else.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The chill. The bear no longer just "knows" — it whispers. An active,
// auditory threat lands harder than a passive fact, and "my new name"
// implies the speaker changed identity to escape something that found
// them anyway. Buried with the dead sister, returned warm, speaking:
// three escalating horrors in one breath, no cliche, one clean sentence.
const ENTRY =
  "I buried my sister's teddy bear with her — tonight it was back on my bed, still warm, whispering my new name.";

// The gate reads a single sentence of under 200 UTF-8 characters.
// Anything at or over that length, any whitespace-only line, or any
// embedded newline fails the entry before the judge ever sees it.
function validateEntry(text: string): void {
  if (text.length < 1 || text.length >= 200) {
    throw new Error(`entry is ${text.length} characters, cap is under 200`);
  }
  if (!text.trim() || text.includes('\n')) {
    throw new Error('entry must be a single non-empty line');
  }
}

function writeEntry(text: string): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, 'entry.txt');
  writeFileSync(target, text, 'utf8');
  return target;
}

// Read the file back and compare raw bytes, not just the decoded
// string: a trailing newline would add a byte and a second line, and
// the grader reads exactly what is on disk.
function verifyEntry(target: string, text: string): void {
  const written = readFileSync(target);
  if (written.length !== Buffer.byteLength(text, 'utf8')) {
    throw new Error('entry.txt byte length does not match the entry');
  }
  if (written[written.length - 1] === 0x0a) {
    throw new Error('entry.txt must not end with a newline');
  }
  if (written.toString('utf8') !== text) {
    throw new Error('entry.txt does not match the entry after writing');
  }
}

validateEntry(ENTRY);
const target = writeEntry(ENTRY);
verifyEntry(target, ENTRY);
console.log(`wrote entry.txt: ${ENTRY.length} characters`);
