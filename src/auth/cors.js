// Origin allow-list with simple "*" wildcards (matching letters, digits and
// hyphens only, so a pattern can't be stretched across dots or schemes).
function compile(patterns) {
  return patterns.map((p) => {
    const escaped = p.replace(/[.+?^${}()|[\]\\/]/g, "\\$&").replace(/\*/g, "[a-z0-9-]+");
    return new RegExp(`^${escaped}$`, "i");
  });
}

function makeOriginCheck(patterns, { allowLocalhost = false } = {}) {
  const rules = compile(patterns);
  return (origin) => {
    if (!origin) return true; // same-origin, curl, server-to-server
    if (allowLocalhost && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
    return rules.some((r) => r.test(origin));
  };
}

module.exports = { makeOriginCheck };
