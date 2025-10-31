// Verify a Cloudflare API Token and print its scopes
// Usage:
//   CLOUDFLARE_API_TOKEN=... node scripts/verify-cloudflare-token.mjs
// or create a .env.local with CLOUDFLARE_API_TOKEN and run with a loader.

const token = process.env.CLOUDFLARE_API_TOKEN || process.argv[2];

if (!token) {
  console.error("Missing token. Provide via CLOUDFLARE_API_TOKEN env or as argv[2].");
  process.exit(1);
}

async function main() {
  const res = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();
  if (!json.success) {
    console.error('Token verification failed:', JSON.stringify(json, null, 2));
    process.exit(1);
  }

  const { result } = json;
  console.log('Status:', result.status);
  console.log('Issued On:', result.issued_on || 'n/a');
  console.log('Expires On:', result.expires_on || 'n/a');

  // Extract human-readable permissions
  const permissions = new Set();
  for (const policy of result.policies || []) {
    for (const pg of policy.permission_groups || []) {
      permissions.add(pg.name);
    }
  }

  const perms = Array.from(permissions).sort();
  console.log('\nPermissions:');
  for (const p of perms) console.log(`- ${p}`);

  // Quick checks for expected capabilities
  const required = [
    'Pages Read',
    'Pages Write', // aka Pages: Edit
  ];
  const optional = ['Zone DNS Read', 'Zone DNS Edit'];

  const has = (name) => perms.some((p) => p.toLowerCase().includes(name.toLowerCase()));

  console.log('\nChecks:');
  for (const r of required) {
    console.log(`- ${r}: ${has(r) ? 'OK' : 'MISSING'}`);
  }
  for (const o of optional) {
    console.log(`- ${o}: ${has(o) ? 'OK' : '—'}`);
  }
}

main().catch((e) => {
  console.error('Error verifying token:', e);
  process.exit(1);
});
