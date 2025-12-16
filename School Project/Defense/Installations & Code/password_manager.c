#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sqlite3.h>
#include <unistd.h>
#include <stdint.h>

#define DIR_NAME "/var/lib/.password-manager"

// Hardcoded key for XOR encryption
const char *HARDCODED_KEY = "<Hard coded key>";

// --- Simple Base64 implementation ---
static const char b64chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

char *base64_encode(const unsigned char *in, size_t len) {
    char *out = malloc(((len + 2) / 3) * 4 + 1);
    char *p = out;
    for (size_t i = 0; i < len; i += 3) {
        int val = in[i] << 16;
        if (i + 1 < len) val |= in[i + 1] << 8;
        if (i + 2 < len) val |= in[i + 2];
        *p++ = b64chars[(val >> 18) & 0x3F];
        *p++ = b64chars[(val >> 12) & 0x3F];
        *p++ = (i + 1 < len) ? b64chars[(val >> 6) & 0x3F] : '=';
        *p++ = (i + 2 < len) ? b64chars[val & 0x3F] : '=';
    }
    *p = '\0';
    return out;
}

int b64val(char c) {
    if (c >= 'A' && c <= 'Z') return c - 'A';
    if (c >= 'a' && c <= 'z') return c - 'a' + 26;
    if (c >= '0' && c <= '9') return c - '0' + 52;
    if (c == '+') return 62;
    if (c == '/') return 63;
    return 0;
}

unsigned char *base64_decode(const char *in, size_t *out_len) {
    size_t len = strlen(in);
    *out_len = len / 4 * 3;
    if (in[len - 1] == '=') (*out_len)--;
    if (in[len - 2] == '=') (*out_len)--;
    unsigned char *out = malloc(*out_len + 1);
    unsigned char *p = out;

    for (size_t i = 0; i < len; i += 4) {
        int val = b64val(in[i]) << 18 | b64val(in[i + 1]) << 12 | b64val(in[i + 2]) << 6 | b64val(in[i + 3]);
        *p++ = (val >> 16) & 0xFF;
        if (in[i + 2] != '=') *p++ = (val >> 8) & 0xFF;
        if (in[i + 3] != '=') *p++ = val & 0xFF;
    }
    return out;
}

// XOR encryption/decryption
void xor_encrypt_decrypt(unsigned char *data, size_t len, const char *key) {
    size_t key_len = strlen(key);
    for (size_t i = 0; i < len; i++) {
        data[i] ^= key[i % key_len];
    }
}

// Create directory in home if not exists
char* create_directory() {
    char *dir_path = strdup(DIR_NAME);

    if (access(dir_path, F_OK) != 0) {
        if (mkdir(dir_path, 0775) == -1) {
            perror("mkdir");
            exit(1);
        }
    }

    return dir_path;
}

// Initialize database
void init_database(sqlite3 **db, const char *db_path) {
    int rc = sqlite3_open(db_path, db);
    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(*db));
        exit(1);
    }

    chmod(db_path, 0661);

    const char *sql_create = "CREATE TABLE IF NOT EXISTS credentials ("
                             "id INTEGER PRIMARY KEY AUTOINCREMENT,"
                             "username TEXT NOT NULL,"
                             "password TEXT NOT NULL);";
    char *err_msg = 0;
    rc = sqlite3_exec(*db, sql_create, 0, 0, &err_msg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", err_msg);
        sqlite3_free(err_msg);
        exit(1);
    }
}

// Add credential
void add_credential(sqlite3 *db) {
    char username[128];
    char password[128];

    printf("Enter username: ");
    scanf("%127s", username);
    printf("Enter password: ");
    scanf("%127s", password);

    size_t len = strlen(password);
    unsigned char *buf = malloc(len + 1);
    memcpy(buf, password, len);
    xor_encrypt_decrypt(buf, len, HARDCODED_KEY);

    char *b64 = base64_encode(buf, len);
    free(buf);

    const char *sql_insert = "INSERT INTO credentials (username, password) VALUES (?, ?);";
    sqlite3_stmt *stmt;
    sqlite3_prepare_v2(db, sql_insert, -1, &stmt, 0);
    sqlite3_bind_text(stmt, 1, username, -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, b64, -1, SQLITE_STATIC);
    if (sqlite3_step(stmt) != SQLITE_DONE) {
        fprintf(stderr, "Failed to insert data.\n");
    }
    sqlite3_finalize(stmt);
    free(b64);

    printf("Credential added.\n");
}

// Read credentials (requires password)
void read_credentials(sqlite3 *db) {
    char input_key[128];
    printf("Enter password to decrypt credentials: ");
    scanf("%127s", input_key);

    if (strcmp(input_key, HARDCODED_KEY) != 0) {
        printf("Incorrect password! Access denied.\n");
        return;
    }

    const char *sql_select = "SELECT username, password FROM credentials;";
    sqlite3_stmt *stmt;
    sqlite3_prepare_v2(db, sql_select, -1, &stmt, 0);

    printf("\nSaved credentials:\n");
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        const unsigned char *username = sqlite3_column_text(stmt, 0);
        const unsigned char *b64pass = sqlite3_column_text(stmt, 1);

        size_t decoded_len;
        unsigned char *decoded = base64_decode((const char *)b64pass, &decoded_len);
        xor_encrypt_decrypt(decoded, decoded_len, HARDCODED_KEY);
        decoded[decoded_len] = '\0';

        printf("Username: %s, Password: %s\n", username, decoded);
        free(decoded);
    }
    sqlite3_finalize(stmt);
}

int main() {
    char *dir_path = create_directory();

    char db_path[strlen(dir_path) + 13];
    sprintf(db_path, "%s/database.db", dir_path);

    sqlite3 *db;
    init_database(&db, db_path);

    int choice;
    printf("1. Add credential\n2. Read credentials\nChoice: ");
    scanf("%d", &choice);

    if (choice == 1) add_credential(db);
    else if (choice == 2) read_credentials(db);
    else printf("Invalid choice.\n");

    sqlite3_close(db);
    free(dir_path);
    return 0;
}
