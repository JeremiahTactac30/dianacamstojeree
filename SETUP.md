# Turn on sync (about 10 minutes, free)

After this, your phone, laptop and your partner's device all show the same planner.

## 1. Upload the new files to GitHub
In your repo, the top level must contain:

- index.html
- style.css
- script.js
- api/planner.js   (a folder named `api` with one file inside)

Easiest way: on your repo page click **Add file > Upload files**, drag in `index.html`,
`style.css`, `script.js` and the whole `api` folder, then **Commit changes**.
These replace the old versions.

## 2. Add a free database in Vercel
1. Open your project on vercel.com and click the **Storage** tab.
2. Choose **Upstash for Redis** (free plan) and create it. Accept the defaults.
3. When asked, connect it to your project for all environments.
   This adds the database keys for you.
   Check under **Settings > Environment Variables**: you should see `KV_REST_API_URL`
   and `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`).

## 3. Choose your passcode
1. Go to **Settings > Environment Variables**.
2. Add a new variable named exactly `PLANNER_PASSCODE`.
3. For the value, type a long passphrase only you and your partner know,
   for example four random words. Do not reuse a password from another site.
4. Save.

## 4. Redeploy
Environment variables only apply to new deployments.
Open the **Deployments** tab, click the three dots on the latest deployment, and choose **Redeploy**.

## 5. Open the site
Open your Vercel link. Enter the passcode once on each device.
The left panel will show "Synced" with the time.

- The first device you open uploads its current plan. Other devices then load it.
- Changes sync within seconds. Other open devices refresh about every 20 seconds.
- If two people edit the same section at the same moment, the last save wins.
- **Sign out** (left panel) removes the passcode and this device's local copy.
- Keep using **Download backup** now and then as a safety copy.
