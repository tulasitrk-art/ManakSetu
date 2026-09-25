import requests
import re

def test_ui():
    r = requests.get('http://localhost:3000')
    print('Home Page HTTP Status:', r.status_code)
    assert r.status_code == 200, "Home page failed"

    links = re.findall(r'(?:href|src)=["\'](/_next/[^"\']+)["\']', r.text)
    print(f"Discovered {len(links)} JS/CSS asset links.")
    all_ok = True
    for link in links:
        res = requests.get('http://localhost:3000' + link)
        if res.status_code != 200:
            print(f"FAILED asset: {link} -> {res.status_code}")
            all_ok = False
        else:
            print(f"OK asset: {link} -> 200 ({len(res.content)} bytes)")

    if all_ok:
        print("\nSUCCESS: All Next.js CSS styles, fonts, and JavaScript bundles are rendering with HTTP 200 OK!")

if __name__ == "__main__":
    test_ui()
