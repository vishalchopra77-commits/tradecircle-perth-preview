/* Node tests for the v1.5.4 idea engine. Run: node ideas-engine.test.js */
require("./ideas-engine.js");
var assert = require("assert");
var jack = { id: "jack", first: "Jack", last: "Thompson", business: "Thompson Electrical", trade: "Electrician" };

function build(opts) {
  return TCIdeas.buildReviewIdeas(Object.assign({
    member: jack,
    job: "a safety switch upgrade",
    suburb: "Kwinana",
    month: "October",
    length: "medium",
    tone: "casual",
    focuses: ["seo", "service", "area"],
    used: [],
    round: 0
  }, opts));
}

var jamie = build({ viewerId: "jamie" });
var sarah = build({ viewerId: "sarah" });
assert.strictEqual(jamie.length, 3);
assert.strictEqual(sarah.length, 3);
jamie.forEach(function (t, i) {
  assert.ok(sarah.indexOf(t) === -1, "two members must not see the same idea: " + t);
  jamie.forEach(function (u, j) {
    if (i < j) assert.ok(TCIdeas.similar(t, u) < 0.85, "near-duplicate in same batch:\n" + t + "\n" + u);
  });
});

var used = jamie.slice();
var again = build({ viewerId: "mei", used: used });
again.forEach(function (t) {
  assert.ok(used.indexOf(t) === -1, "used idea shown again: " + t);
});

function hasFocus(text, re, label) {
  assert.ok(re.test(text), label + " missing in: " + text);
}
var seo = build({ viewerId: "jamie", focuses: ["seo", "service", "area"], round: 2 });
seo.forEach(function (t) {
  hasFocus(t, /safety switch upgrade/i, "service");
  hasFocus(t, /kwinana|perth/i, "area or Perth");
  hasFocus(t, /electric/i, "trade keyword");
});
var staff = build({ viewerId: "priya", focuses: ["staff", "service"], tone: "warm" });
staff.forEach(function (t) { hasFocus(t, /jack|thompson/i, "staff name"); });
var value = build({ viewerId: "tom", focuses: ["value", "service", "area"], length: "detailed" });
value.forEach(function (t) { hasFocus(t, /quote|price|cost|value|charged|invoice|priced|extras|numbers/i, "value"); });
var time = build({ viewerId: "liam", focuses: ["timeliness", "service"], length: "short" });
time.forEach(function (t) { hasFocus(t, /time|prompt|punctual|agreed|booking|arrived|turned up|on time|when they said|waiting/i, "timeliness"); });
var clean = build({ viewerId: "emma", focuses: ["cleanliness", "service"], length: "medium" });
clean.forEach(function (t) { hasFocus(t, /tidy|clean|mess|floors|debris|housekeeping|packed up/i, "cleanliness"); });

var pool = [];
for (var r = 0; r < 40; r++) {
  var batch = build({ viewerId: "jamie", used: pool, round: r });
  assert.strictEqual(batch.length, 3, "ran out at round " + r);
  batch.forEach(function (t) {
    assert.ok(pool.indexOf(t) === -1, "repeat at round " + r + ": " + t);
    pool.push(t);
  });
}

var alerts = TCIdeas.buildAlertIdeas({
  member: { id: "jamie", first: "Jamie", last: "Hale", business: "Hale Pest Control", trade: "Pest Control" },
  viewerId: "sarah",
  alertId: "a1",
  job: "a termite inspection",
  suburb: "Midland",
  used: ["I have used Jamie at Hale Pest Control for a termite inspection and would recommend getting in touch."],
  focuses: ["seo", "service", "area"]
});
assert.strictEqual(alerts.length, 3);
alerts.forEach(function (t) {
  assert.ok(!/I have used Jamie at Hale Pest Control for a termite inspection and would recommend getting in touch/.test(t));
});

var c = TCIdeas.combinationCount("Electrician");
assert.ok(c.estimatePerBusinessOneSuburbMonth >= 1000, "combination count too low: " + c.estimatePerBusinessOneSuburbMonth);

var banned = /Made the next steps easy to follow/;
jamie.concat(sarah).forEach(function (t) { assert.ok(!banned.test(t)); });

console.log("OK — " + pool.length + " unique jamie ideas over 40 refreshes; ~" + c.estimatePerBusinessOneSuburbMonth + " combos per business (one suburb/month).");
