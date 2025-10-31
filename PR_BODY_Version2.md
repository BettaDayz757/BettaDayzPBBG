```markdown
Title
chore: remove Vercel deployment artifacts causing failing deploys

Summary
Several Vercel-related repository artifacts were triggering failing deployments on every push. These files are not required for the intended Cloudflare Pages / Wrangler deployment used by this project and were removed to stop the failing deploy attempts.

What I changed
- Removed tracked Vercel artifacts if present:
  - .vercel/ (linking metadata and project.json)
  - vercel.json
  - .vercelignore
- Removed any GitHub Actions workflow files under .github/workflows that referenced "vercel".
- Removed npm script entries in package.json that invoked or referenced the Vercel CLI.
- Created branch: remove-vercel-configs
- Commit message: "chore: remove Vercel deployment files causing failing deploys"

Why
Automatically triggered Vercel deployments were failing on each push. Removing these repository-level Vercel artifacts prevents those failing deploy attempts and keeps CI focused on the intended Cloudflare/Wrangler deployment.

Files removed (if present)
- .vercel/ (directory and any tracked files within)
- vercel.json
- .vercelignore
- .github/workflows/** (files that contained the string "vercel")
- package.json script entries which invoked "vercel"

Notes & recommendations
- Cloudflare-related deployment tooling (wrangler.toml, deploy scripts, etc.) were left intact.
- If you want to use Vercel again, re-add Vercel configs intentionally and test on a branch before merging.
- Verify the GitHub Actions and CI runs after merging to confirm Vercel deploys no longer trigger.
- If needed, restore package.json using package.json.vercel-removal.bak that was created by the script.

If anything here was removed unintentionally, you can revert or restore from the backup commit in this branch or restore package.json from package.json.vercel-removal.bak.
```