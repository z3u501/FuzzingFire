# FuzzingFire 🔥 – Firestore Collection Fuzzer (Web SDK Edition)

**FuzzingFire** is an open-source command-line tool written in JavaScript using the Firebase Web SDK. It helps security researchers and developers discover publicly accessible Firestore collections by fuzzing collection names using a wordlist. It's ideal for recon, access auditing, and security testing of Firebase apps with open rules.

---

## 🔍 Key Features

- Detects **publicly accessible** Firestore collections (readable without authentication).
- Uses **multi-threaded concurrency** to scan faster.
- Displays collection status live in the terminal.
- Optional export to a JSON file.
- Clean CLI interface with helpful flags and feedback.
- Written in **JavaScript (Node.js)**, no compilation required.

---

## ⚙️ Installation & Setup (Node.js + Firebase Web SDK)

### Prerequisites

- Node.js 16+
- A Firebase project with **Firestore rules allowing public read** access *(temporarily for testing only)*

### Install dependencies

```bash
npm install
````

---

## 🚀 Usage

```bash
node fuzzingfire-web.js -c firebaseConfig.json -w collections.txt -t 20 -o output.json
```

### Command-Line Options

| Flag | Description                                       | Required |
| ---- | ------------------------------------------------- | -------- |
| `-c` | Path to Firebase Web SDK config JSON file         | ✅        |
| `-w` | Path to dictionary (wordlist) of collection names | ✅        |
| `-t` | Number of concurrent threads (default: 10)        | ❌        |
| `-o` | Output results to a JSON file                     | ❌        |
| `-h` | Show help message                                 | ❌        |

---

## 📤 Output Format

Only collections that **exist and contain documents** will be shown:

```text
🟢 users       (124 documents)
🟢 messages    (54 documents)
```

If output is saved with `-o`, the file will contain:

```json
[
  { "name": "users", "documents": 124 },
  { "name": "messages", "documents": 54 }
]
```

---

## 📁 Example Project Structure

```
├── collections.txt         # Your dictionary of collection names
├── firebaseConfig.json     # Web config from Firebase Console
├── fuzzingfire-web.js      # Main script
├── package.json
```

---

## 🔐 Ethical Use Disclaimer

This tool is for **educational and authorized testing only**. Do **not** use FuzzingFire against Firebase projects that you do not own or have explicit permission to test. Misuse may be illegal and unethical.

---

## 👨‍💻 Author

Created by **@z3u501**
Version: `v1.0.0`
Feedback, contributions, and forks are welcome.

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 🔗 References

* [Firebase Firestore documentation](https://firebase.google.com/docs/firestore)
* [Firebase security rules guide](https://firebase.google.com/docs/rules)
* [Node.js](https://nodejs.org/)

