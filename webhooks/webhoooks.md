## Running ngrok with Request Header Rewrite

To expose your local webhook endpoint and rewrite incoming requests, configure `ngrok` as shown below. This setup forwards HTTPS traffic to your local server on port 2024 and injects a custom header into each request.

> **Note:** You can find your ngrok authtoken at [https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).

**~/.ngrok/ngrok.yml:**
```sh
mkdir -p .ngrok
cat > ~/.ngrok/ngrok.yml <<'EOF'
version: 2
authtoken: <YOUR_NGROK_AUTHTOKEN>
tunnels:
  webhook:
    proto: http
    addr: 2024
    request_header:
      add:
        - "X-Rewritten-URL: /webhooks/github"
EOF
```

Start ngrok with:
```bash
ngrok start --all --config ~/.ngrok/ngrok.yml
```

## Testing GitHub Webhook Payloads with `curl`

You can replay GitHub webhook deliveries using `curl`. Update the signature headers with values from your GitHub App settings ([Advanced settings](https://github.com/settings/apps/backstage-agent-app/advanced)).

Payload files are located in `/home/izlobin/wb/open-swe/webhooks/payloads/`.

**Example: Replay an `issues` event:**
```bash
cd /home/izlobin/wb/open-swe/webhooks

curl -X POST https://<YOUR_NGROK_DOMAIN>/webhooks/github \
  -H "Accept: */*" \
  -H "Content-Type: application/json" \
  -H "User-Agent: GitHub-Hookshot/2444035" \
  -H "X-GitHub-Delivery: <REPLACE_WITH_DELIVERY_ID>" \
  -H "X-GitHub-Event: issues" \
  -H "X-GitHub-Hook-ID: <REPLACE_WITH_HOOK_ID>" \
  -H "X-GitHub-Hook-Installation-Target-ID: <REPLACE_WITH_TARGET_ID>" \
  -H "X-GitHub-Hook-Installation-Target-Type: integration" \
  -H "X-Hub-Signature: sha1=<REPLACE_WITH_SIGNATURE>" \
  -H "X-Hub-Signature-256: sha256=<REPLACE_WITH_SIGNATURE_256>" \
  --data-binary @issues-labeld-payload.json
```

> **Tip:** Update the signature headers (`X-Hub-Signature`, `X-Hub-Signature-256`) with values from your GitHub App's advanced settings page.
