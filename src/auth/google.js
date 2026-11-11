// Verifies a Google Sign-In ID token (the `credential` from Google's button)
// with Google's tokeninfo endpoint, then checks it was issued for our app.
const ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);

async function verifyGoogleCredential(credential, clientId, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not set");
  if (typeof credential !== "string" || credential.length < 20) return null;

  const res = await fetchImpl(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
  );
  if (!res.ok) return null; // Google answers 400 for invalid/expired tokens
  const t = await res.json();

  const emailVerified = t.email_verified === true || t.email_verified === "true";
  if (t.aud !== clientId || !ISSUERS.has(t.iss) || !emailVerified || !t.email || !t.sub) return null;
  if (!(Number(t.exp) * 1000 > now)) return null;

  return {
    googleId: t.sub,
    email: String(t.email).toLowerCase(),
    firstName: t.given_name || t.name || String(t.email).split("@")[0],
    lastName: t.family_name || "",
    picture: t.picture || "",
  };
}

module.exports = { verifyGoogleCredential };
