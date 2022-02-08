import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // generate random 16 bytes long salt
    const salt = randomBytes(16).toString('hex');

    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

export function validatePassword(password, hash): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      resolve(timingSafeEqual(Buffer.from(key, 'hex'), derivedKey));
    });
  });
}
