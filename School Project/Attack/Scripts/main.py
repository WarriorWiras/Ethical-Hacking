#!/usr/bin/env python3
"""
Argon2 password derivation + XOR decryption script for secret_link.enc.

This script:
1. Decodes a base64/base58 blob.
2. Extracts the salt (first 16 bytes).
3. Derives a key using Argon2id.
4. XOR-decrypts the remaining data using the derived key.
5. Prints the plaintext result.
"""

import base64
import sys
from typing import Optional
from argon2.low_level import hash_secret_raw, Type

try:
    import base58
except ImportError:
    base58 = None

# ---------------- HARD-CODED CONFIG ----------------
BLOB = 'FFWQ0RK8VMN5YX962L0VCikzfZnX2iqb7Vk5q58zovIj'
PASSWORD = 'IT-M4n4g3r1sAw3s0me'
TIME_COST = 4
MEMORY_COST = 65536  # KiB
PARALLELISM = 2
SALT_LEN = 16
OUTLEN = 17  # derived key length in bytes
# --------------------------------------------------


def decode_blob(blob: str) -> Optional[bytes]:
    """Attempt to decode the blob from base64 or base58."""
    try:
        return base64.b64decode(blob + '==='[:(-len(blob) % 4)])
    except Exception:
        if base58 is not None:
            try:
                return base58.b58decode(blob)
            except Exception:
                return None
    return None


def derive_argon2(password: bytes, salt: bytes, time_cost: int,
                  memory_cost: int, parallelism: int, outlen: int) -> bytes:
    """Derive an Argon2id key."""
    return hash_secret_raw(secret=password,
                           salt=salt,
                           time_cost=time_cost,
                           memory_cost=memory_cost,
                           parallelism=parallelism,
                           hash_len=outlen,
                           type=Type.ID)


def xor_decrypt(encrypted_data: bytes, key_bytes: bytes) -> str:
    """Simple XOR decryption using repeating key."""
    decrypted_bytes = bytes(encrypted_data[i] ^ key_bytes[i % len(key_bytes)]
                            for i in range(len(encrypted_data)))

    try:
        plaintext = decrypted_bytes.decode('utf-8')
    except UnicodeDecodeError:
        plaintext = decrypted_bytes.hex()  # fallback if binary
    return plaintext


def main():
    decoded = decode_blob(BLOB)
    if decoded is None:
        print('Failed to decode blob.', file=sys.stderr)
        sys.exit(1)

    print(f'Decoded blob length: {len(decoded)} bytes')

    salt = decoded[:SALT_LEN]
    encrypted_data = decoded[SALT_LEN:]

    print(f'Salt (hex): {salt.hex()}')
    print(f'Encrypted data length: {len(encrypted_data)} bytes')

    key_bytes = derive_argon2(PASSWORD.encode(), salt, TIME_COST, MEMORY_COST,
                              PARALLELISM, OUTLEN)

    print(f'Derived key length: {len(key_bytes)} bytes')
    print(f'Key bytes (hex): {key_bytes.hex()}')

    plaintext = xor_decrypt(encrypted_data, key_bytes)
    print(f'\n[+] Decrypted plaintext:\n{plaintext}')


if __name__ == '__main__':
    main()
