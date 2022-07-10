const path = require('path');
const fs = require('fs');

/**
 * 读取内容
 */
const privateKey = fs.readFileSync(path.join('config', 'private.key'));
const publicKey = fs.readFileSync(path.join('config', 'public.key'));

/**
 * 转换成base64
 */
const privateKeyBase64 = Buffer.from(privateKey).toString('base64');
const publicKeyBase64 = Buffer.from(publicKey).toString('base64');

console.log("\n privateKey:");
console.log(privateKey);

console.log("\n publicKey:");
console.log(publicKey);