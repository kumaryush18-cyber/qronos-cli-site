"""Set a GitHub Actions secret from a local file.

    python3 scripts/set-secret.py NAME /path/to/value.txt

Uses the repository public key and libsodium sealed box, which is what GitHub
expects for `PUT /repos/{owner}/{repo}/actions/secrets/{name}`. The value is never
printed; only its length is echoed.
"""

import base64
import json
import os
import sys
import urllib.request

from nacl import encoding, public


def api(method: str, url: str, token: str, body: dict | None = None) -> dict:
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(url, data=data, method=method)
    request.add_header("Authorization", f"Bearer {token}")
    request.add_header("Accept", "application/vnd.github+json")
    if data is not None:
        request.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = response.read()
        return json.loads(payload) if payload else {}


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__.strip())
        return 2

    name, value_path = sys.argv[1], sys.argv[2]
    token = os.environ["GITHUB_TOKEN"]
    repo = os.environ.get("GITHUB_REPO", "kumaryush18-cyber/qronos-cli-site")

    with open(value_path, "rb") as handle:
        value = handle.read().strip()
    if not value:
        print("refusing to set an empty secret")
        return 1

    key = api("GET", f"https://api.github.com/repos/{repo}/actions/secrets/public-key", token)
    public_key = public.PublicKey(key["key"].encode("utf-8"), encoding.Base64Encoder())
    sealed = public.SealedBox(public_key).encrypt(value)
    encrypted = base64.b64encode(sealed).decode("utf-8")

    api(
        "PUT",
        f"https://api.github.com/repos/{repo}/actions/secrets/{name}",
        token,
        {"encrypted_value": encrypted, "key_id": key["key_id"]},
    )
    print(f"set {name} on {repo} ({len(value)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
