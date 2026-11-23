# Deploying the site

The site is a folder of static files. `npm run build` writes it to `dist/`, and
anything that can serve a folder can host it. Production is **Azure Static Web
Apps** (free tier) at **https://cli.qronos.me**.

## What is already done in this repo

| File | Job |
| :--- | :--- |
| `.github/workflows/site.yml` | On every push and pull request: type check, tests, build, then axe / layout-shift / dead-anchor / motion checks in a real browser. Uploads `dist`. |
| `.github/workflows/deploy.yml` | After `site` passes on `main`: downloads that `dist` and uploads it to Azure. Needs one secret. |
| `public/staticwebapp.config.json` | Clean URLs, a real 404, long cache for hashed assets, and the security headers (including a CSP that allows one hashed inline script and nothing else). |
| `scripts/og.mjs`, `scripts/icons.mjs` | Rebuild `og.png` and the PNG icons from the site's own fonts and logo. `npm run assets`. |

## The one step only you can do

Azure needs an account, and the deployment token is a credential. Two ways:

### A. You create it in the portal (about four minutes)

1. Go to <https://portal.azure.com> → **Create a resource** → search **Static Web App**.
2. Plan type **Free**. Name `qronos-cli-site`. Region **West Europe** (or the one closest to you).
3. **Deployment source: Other.** This repo deploys from GitHub Actions, not from the
   Azure wizard, so do not let Azure create a workflow file.
4. Build details: leave **Build presets** as `Custom` and the app location as `/`.
5. Create. Open the resource → **Manage deployment token** → copy the token.
6. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**.
   Name it exactly `AZURE_STATIC_WEB_APPS_API_TOKEN`, paste the token.
7. Add the value of `default_host_name` (shown in the portal, e.g.
   `nice-name-0123.azurestaticapps.net`) to a comment on this file so the next
   person knows it.

Then run the deploy workflow once by hand: **Actions → deploy → Run workflow**.

### B. Or give the agent an Azure login

A service principal with `Contributor` on one resource group is enough:

```bash
az ad sp create-for-rbac --name qronos-site --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/<group> \
  --sdk-auth
```

That prints a JSON blob. It is a credential: put it in a file the agent can read,
never in a chat message. The agent can then create the app, set the domain and
fetch the deployment token itself.

## The custom domain

1. In the Static Web App: **Custom domains → Add** → `cli.qronos.me`, hostname type
   **CNAME**. Azure shows a validation value.
2. In the DNS for `qronos.me`, add:
   - `CNAME  cli  <default host name>.azurestaticapps.net`
   - `TXT    _dnsauth.cli  <validation value>`
3. Wait for **Validated**, then Azure issues a free managed certificate. This
   usually takes minutes and can take an hour.
4. Optional: redirect `qronos.me/cli` to `cli.qronos.me` with a redirect rule in
   whatever serves the main domain.

Because every route is prerendered, the host needs no rewrite rules: a request for
`/docs/workflows` finds `dist/docs/workflows/index.html` on its own.

## Checking a deploy

```bash
curl -sI https://cli.qronos.me/ | grep -i -e content-security -e cache-control
curl -s  https://cli.qronos.me/docs/workflows | grep -c ultracode
curl -s  https://cli.qronos.me/sitemap.xml | head -5
```

The second command must print a number greater than zero: it proves the HTML
really holds the article, not an empty shell.

## Rolling back

Every deploy is one artifact. In the Static Web App, **Environments → production →
Deployments** lists them; pick an earlier one and **Redeploy**. Rolling back with
git (`git revert`) also works and is preferred, because the repo then matches
production.
