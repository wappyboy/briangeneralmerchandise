import { pbkdf2Sync, randomBytes } from "crypto";

const password = process.argv[2];

if (!password || password.length < 8) {
  console.error('Usage: npm run auth:hash -- "your-password-with-8-plus-characters"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const iterations = 120000;
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");

console.log(`pbkdf2_sha256$${iterations}$${salt}$${hash}`);
