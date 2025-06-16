import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import pLimit from 'p-limit';
import { Command } from 'commander';

function printBanner() {
  console.log('\n=== FuzzingFire ===');
  console.log('Firestore Collection Fuzzer');
  console.log('Version: v1.0.0');
  console.log('Author : @z3u501\n');
}

function printProgress(processed, total, currentName) {
  const text = `⏳ Processing: ${currentName} (${processed}/${total})`;
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(text);
}


function readDictionary(path) {
  const content = fs.readFileSync(path, 'utf8');
  return content.split('\n').map(line => line.trim()).filter(Boolean);
}

async function main() {
  printBanner();

  const program = new Command();
  program
    .option('-c, --config <path>', 'Firebase web config JSON')
    .option('-w, --wordlist <path>', 'Dictionary file')
    .option('-t, --threads <number>', 'Concurrency (default: 10)', '10')
    .option('-o, --output <file>', 'Output file (JSON)')
    .option('-h, --help', 'Show help');

  program.parse(process.argv);
  const options = program.opts();

  if (options.help || !options.config || !options.wordlist) {
    console.log(`Usage:
				node fuzzingfire-web.js -c firebaseConfig.json -w collections.txt [options]

			Options:
				-c, --config <file>     Firebase config JSON file (required)
				-w, --wordlist <file>   Collection names dictionary (required)
				-t, --threads <num>     Number of concurrent requests (default: 10)
				-o, --output <file>     Save results to a JSON file
				-h, --help              Show this help message
			`);
    process.exit(0);
  }

  const config = JSON.parse(fs.readFileSync(options.config, 'utf8'));
  const wordlist = readDictionary(options.wordlist);
  const threads = parseInt(options.threads, 10);

  const app = initializeApp(config);
  const db = getFirestore(app);

  const results = [];
  const limit = pLimit(threads);

  let processed = 0;
	await Promise.all(
	  wordlist.map((name) =>
		limit(async () => {
		  try {
		    const snapshot = await getDocs(collection(db, name));

		    processed++;
		    printProgress(processed, wordlist.length, name);

		    if (!snapshot.empty) {
		      results.push({ name, documents: snapshot.size });
		    }
		  } catch {
		    processed++;
		    printProgress(processed, wordlist.length, name);
		  }
		})
	  )
	);

  console.log("\n\n✅ Finished.\n");

	if (results.length === 0) {
		console.log("❌ No public collections found.");
	} else {
		console.log("✅ Collections found:");
		for (const col of results) {
		  console.log(` - ${col.name}: ${col.documents} documents`);
		}
	}

  if (options.output) {
    try {
      fs.writeFileSync(options.output, JSON.stringify(results, null, 2), 'utf8');
      console.log(`\n📁 Results saved to: ${options.output}`);
    } catch (err) {
      console.error(`❌ Error saving file: ${err.message}`);
    }
  }
}

main().catch(err => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
