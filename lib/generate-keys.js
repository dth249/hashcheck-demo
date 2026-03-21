const crypto = require('crypto');

console.log("Đang tạo cặp khóa RSA 2048-bit...");

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const formatForEnv = (key) => `"${key.replace(/\n/g, '\\n')}"`;

console.log(`RSA_PUBLIC_KEY=${formatForEnv(publicKey)}`);
console.log(`RSA_PRIVATE_KEY=${formatForEnv(privateKey)}`);