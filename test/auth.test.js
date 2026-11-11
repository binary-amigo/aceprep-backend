const test = require("node:test");
const assert = require("node:assert/strict");
const { sign, verify } = require("../src/auth/jwt");
const { verifyGoogleCredential } = require("../src/auth/google");
const { makeOriginCheck } = require("../src/auth/cors");

const SECRET = "test-secret-please-ignore";

test("jwt: round trip", () => {
  const t = sign({ sub: "u1" }, SECRET, 60);
  const p = verify(t, SECRET);
  assert.equal(p.sub, "u1");
  assert.ok(p.exp > p.iat);
});

test("jwt: rejects wrong secret, tampering, expiry and junk", () => {
  const t = sign({ sub: "u1" }, SECRET, 60);
  assert.equal(verify(t, "other-secret"), null);

  const [h, b, s] = t.split(".");
  const forged = Buffer.from(JSON.stringify({ sub: "admin", iat: 0, exp: 9e9 })).toString("base64url");
  assert.equal(verify(`${h}.${forged}.${s}`, SECRET), null);

  const old = sign({ sub: "u1" }, SECRET, 60, 1000);
  assert.equal(verify(old, SECRET, 2000), null);

  const none = Buffer.from(JSON.stringify({ alg: "none" })).toString("base64url");
  assert.equal(verify(`${none}.${b}.`, SECRET), null);
  for (const junk of [undefined, "", "a.b", "a.b.c.d", 42]) assert.equal(verify(junk, SECRET), null);
});

test("jwt: refuses to sign without a secret", () => {
  assert.throws(() => sign({ sub: "u1" }, "", 60));
});

const CLIENT = "client-123.apps.googleusercontent.com";
const fakeFetch = (body, ok = true) => async (url) => {
  assert.match(url, /^https:\/\/oauth2\.googleapis\.com\/tokeninfo\?id_token=/);
  return { ok, json: async () => body };
};
const good = {
  aud: CLIENT,
  iss: "https://accounts.google.com",
  sub: "g-1",
  email: "Imran@Example.com",
  email_verified: "true",
  exp: String(Math.floor(Date.now() / 1000) + 600),
  given_name: "Imran",
  family_name: "Khan",
  picture: "https://example.com/p.png",
};
const cred = "x".repeat(40);

test("google: accepts a valid token and normalises the profile", async () => {
  const p = await verifyGoogleCredential(cred, CLIENT, { fetchImpl: fakeFetch(good) });
  assert.deepEqual(p, {
    googleId: "g-1",
    email: "imran@example.com",
    firstName: "Imran",
    lastName: "Khan",
    picture: "https://example.com/p.png",
  });
});

test("google: rejects wrong audience, issuer, unverified email, expiry, Google errors", async () => {
  const cases = [
    { ...good, aud: "someone-else" },
    { ...good, iss: "evil.example.com" },
    { ...good, email_verified: "false" },
    { ...good, exp: "1" },
    { ...good, sub: "" },
  ];
  for (const body of cases) {
    assert.equal(await verifyGoogleCredential(cred, CLIENT, { fetchImpl: fakeFetch(body) }), null);
  }
  assert.equal(await verifyGoogleCredential(cred, CLIENT, { fetchImpl: fakeFetch({}, false) }), null);
  assert.equal(await verifyGoogleCredential("short", CLIENT, { fetchImpl: fakeFetch(good) }), null);
  await assert.rejects(() => verifyGoogleCredential(cred, "", { fetchImpl: fakeFetch(good) }));
});

test("cors: exact origins, preview wildcard, localhost only when allowed", () => {
  const check = makeOriginCheck(
    ["https://aceprep-phi.vercel.app", "https://aceprep-*-imran-khans-projects-bb3f275b.vercel.app"],
    { allowLocalhost: false },
  );
  assert.ok(check("https://aceprep-phi.vercel.app"));
  assert.ok(check("https://aceprep-m4noptje0-imran-khans-projects-bb3f275b.vercel.app"));
  assert.ok(check(undefined));
  assert.ok(!check("https://evil.com"));
  assert.ok(!check("https://aceprep-phi.vercel.app.evil.com"));
  assert.ok(!check("https://aceprep-a.evil.com-imran-khans-projects-bb3f275b.vercel.app"));
  assert.ok(!check("http://aceprep-phi.vercel.app"));
  assert.ok(!check("http://localhost:5173"));
  assert.ok(makeOriginCheck([], { allowLocalhost: true })("http://localhost:5173"));
});
