/* TradeCircle Perth — review and comment idea engine v1.5.4
   Original fragments only. Not copied from real reviews. See REVIEW-IDEAS-RESEARCH.md. */
(function (root) {
  "use strict";

  var MONTHS = ["July", "August", "September", "October", "November", "December", "January", "February", "March"];
  var SUBURBS = ["Midland", "Ellenbrook", "Joondalup", "Mundaring", "Kwinana", "Rockingham", "Fremantle", "Armadale", "Morley", "Osborne Park", "Whitfords", "Byford"];

  var CATEGORY_JOBS = {
    pest: ["a termite inspection", "a general pest treatment", "rodent control", "a cockroach treatment", "a pre-purchase inspection", "a termite treatment", "a spider treatment", "a routine pest check"],
    electrical: ["a safety switch upgrade", "a power point install", "a lighting install", "a switchboard upgrade", "a smoke alarm install", "a fault-finding call-out", "a ceiling fan install", "an EV charger install"],
    plumbing: ["a blocked drain", "a hot water system swap", "a leak repair", "a tap replacement", "a toilet repair", "bathroom plumbing", "a burst pipe repair", "a gas fitting job"],
    painting: ["an interior repaint", "exterior painting", "a room refresh", "a ceiling paint", "fence painting", "a full house paint", "prep and paint work", "a feature wall"],
    carpentry: ["a decking job", "a kitchen install", "door hanging", "custom cabinetry", "skirting and architraves", "a wardrobe build", "a staircase repair", "home renovation carpentry"],
    building: ["a home renovation", "an extension", "a bathroom renovation", "a kitchen renovation", "repair work", "a new build stage", "a verandah", "structural repairs"],
    landscaping: ["garden design", "turf laying", "paving", "a retaining wall", "garden maintenance", "an irrigation install", "lawn care", "a tree prune"],
    roofing: ["a roof repair", "gutter replacement", "a roof restoration", "a leak repair", "roof tiling", "a whirlybird install", "a downpipe repair", "guttering work"],
    hvac: ["a split-system install", "a service and clean", "a repair call-out", "ducted heating service", "an air-con install", "a filter and coil clean", "a gas heating service", "a breakdown call-out"],
    tiling: ["bathroom tiling", "a kitchen splashback", "floor tiling", "tile and grout repair", "a shower retile", "balcony tiling", "waterproofing and tiling", "a laundry splashback"],
    fencing: ["a Colorbond fence", "a timber fence", "a gate install", "pool fencing", "a fence repair", "a boundary fence", "a sliding gate", "a palisade fence"],
    cleaning: ["a deep clean", "an end-of-lease clean", "a carpet clean", "a window clean", "a pressure clean", "an after-builders clean", "a oven clean", "a regular house clean"],
    handyman: ["home repairs", "flat-pack assembly", "general maintenance", "a fix-up job", "odds and ends around the house", "a door adjustment", "shelf and hanging work", "a small repair list"],
    locksmith: ["a lock change", "an emergency call-out", "key cutting", "a lock repair", "security door work", "a rekey", "a lockout call-out", "a deadbolt install"],
    pool: ["a pool service", "a pump repair", "pool cleaning", "leak detection", "pool fencing", "a salt-cell service", "a filter clean", "a seasonal start-up"],
    solar: ["a solar panel install", "a solar service", "a solar hot water install", "a panel clean", "an inverter check", "a system health check", "a battery install", "a shading review"],
    flooring: ["floor sanding", "a timber floor install", "vinyl flooring", "carpet laying", "a laminate install", "an epoxy floor", "a floor refinish", "stair nosing work"],
    concrete: ["a driveway pour", "a concrete slab", "concrete repairs", "a path and paving job", "excavation", "a patio slab", "a crossover", "a shed pad"],
    glazing: ["a window install", "a glass repair", "a shower screen install", "window tinting", "a flyscreen repair", "a smashed pane replacement", "a sliding door repair", "mirror install"],
    design: ["a design consult", "plans for a renovation", "an inspection", "a site assessment", "a concept for our place", "a colour consult", "a measured survey", "a compliance inspection"],
    removal: ["a house move", "a furniture move", "rubbish removal", "a piano move", "a clean-out", "a skip bin drop-off", "an office move", "a same-day pickup"],
    specialist: ["the booked job", "work at our place", "a call-out", "the job we needed done", "a site visit and the work that followed", "a booked service"]
  };

  var CAT_RULES = [
    ["pest", /pest|termite|weed control/i],
    ["electrical", /electric|ev charger|light fitting|antenna|intercom|home automation|smart home|fire alarm|stove installer|rangehood|whitegoods|tv antenna|phone technician/i],
    ["plumbing", /plumb|gas fitter|drain|hot water|septic|sump pump|water pump|water tanks|rainwater|irrigation|jacuzzi|bathtub|shower repair|composting toilet/i],
    ["painting", /paint|wallpaper|colour consultant/i],
    ["carpentry", /carpenter|joiner|cabinet|deck|wardrobe|staircase|skirting|furniture assembl|pergola|gazebo|carport|shed builder|workshop builder|verandah/i],
    ["building", /builder|renovat|extension|kit home|heritage|underpin|demolition|scaffolding|building designer|drafter|architect|structural|surveyor|town planner|renovation manager|conservatory/i],
    ["landscaping", /landscape|garden|lawn|arborist|tree|pond|playground|irrigation technician/i],
    ["roofing", /roof|gutter|downpipe|whirlybird|skylight|cladding|siding|facade|pointing/i],
    ["hvac", /air conditioning|hvac|heating|ducted|ventilation|heat pump|cool room/i],
    ["tiling", /tiler|tiling|grout|splashback|waterproof|stone|granite|marble|epoxy flooring/i],
    ["fencing", /fenc|gate|balustrade|wrought iron/i],
    ["cleaning", /clean|pressure|hydro|strip and polish|brick clean|house washer|grout clean|solar panel clean/i],
    ["locksmith", /lock|security install|security screen|screen door|shutter/i],
    ["pool", /pool|sauna/i],
    ["solar", /solar|energy assessor/i],
    ["flooring", /floor|carpet layer|vinyl|laminate|wood floor|carpet repair/i],
    ["concrete", /concrete|concreter|excav|earthmoving|bobcat|driveway|retaining|line marker|steel fix/i],
    ["glazing", /glazi|glass|window|flyscreen|shower screen|leadlight|tint|awning|blinds|curtain|flyscreen/i],
    ["design", /designer|interior|home stager|inspector|assessor|damp|moisture|mould|flood restoration|water damage/i],
    ["removal", /removal|skip bin|rubbish|piano mover|house relocator/i],
    ["handyman", /handyman|home maintenance|property maintenance|appliance/i]
  ];

  function categoryFor(trade) {
    var t = String(trade || "");
    for (var i = 0; i < CAT_RULES.length; i++) {
      if (CAT_RULES[i][1].test(t)) return CAT_RULES[i][0];
    }
    return "specialist";
  }

  function articleize(job) {
    var j = String(job || "").replace(/^an?\s+/i, "").trim();
    if (!j) return "the job";
    return (/^[aeiou]/i.test(j) ? "an " : "a ") + j;
  }
  function bare(job) {
    return String(job || "").replace(/^an?\s+/i, "").trim();
  }
  function jobFromTrade(trade) {
    var t = String(trade || "").trim();
    if (!t) return "";
    var j = t.replace(/er\b/i, "ing").replace(/or\b/i, "ion").replace(/ist\b/i, "").toLowerCase();
    if (/install/i.test(t)) return articleize(t.replace(/installer/i, "install").toLowerCase());
    if (/repair/i.test(t)) return articleize(t.replace(/repairer/i, "repair").toLowerCase());
    if (/clean/i.test(t)) return articleize(t.toLowerCase().replace(/er\b/, ""));
    return articleize(t.toLowerCase() + " job");
  }
  function jobsFor(trade) {
    var cat = categoryFor(trade);
    var list = (CATEGORY_JOBS[cat] || CATEGORY_JOBS.specialist).slice();
    var derived = jobFromTrade(trade);
    if (derived && list.indexOf(derived) === -1) list.unshift(derived);
    return list;
  }

  /* Openings: original wording. Slots: {job} {business} {name} {first} {suburb} {month} {trade} {perth} */
  var OPENERS = {
    casual: [
      "Had {job} done by {business} in {suburb} this {month}.",
      "Used {business} for {job} in {suburb}.",
      "Used {aTrade} in {suburb} — {business} — for {job}.",
      "Booked {business} in {suburb} this {month} for {job}.",
      "{first} from {business} came out to {suburb} for {job}.",
      "Needed {job} around {suburb} and went with {name} at {business}.",
      "Called {business} when we needed {job} in {suburb}.",
      "Got {business} in for {job} at our place in {suburb}.",
      "We used {business} for {job} here in {suburb} this {month}.",
      "Booked {first} at {business} after we needed {job} in {suburb}.",
      "Our {trade} this {month} was {business}, for {job} in {suburb}.",
      "Went with {business}, {aTrade} in {suburb}, for {job}.",
      "{business} looked after {job} for us in {suburb} this {month}."
    ],
    professional: [
      "We engaged {business} for {job} at our {suburb} property this {month}.",
      "{business} completed {job} in {suburb} in {month}.",
      "Appointed {name} of {business} to carry out {job} in {suburb}.",
      "We booked {business}, {aTrade} in {suburb}, for {job} this {month}.",
      "{first} from {business} attended our {suburb} property for {job}.",
      "Required {job} in {suburb} and instructed {business} to complete the work.",
      "{business} was engaged as our {trade} for {job} in {suburb}.",
      "This {month} {business} carried out {job} at our home in {suburb}.",
      "We arranged {job} with {name} at {business}, based in the {suburb} area.",
      "For {job} in {suburb}, we appointed {business}."
    ],
    warm: [
      "So glad we booked {first} at {business} for {job} in {suburb}.",
      "We finally got {job} done in {suburb} this {month} with {business}, and it was a good experience.",
      "{first} from {business} came out to help with {job} in {suburb} and we felt looked after.",
      "Happy we chose {business} for {job} at our place in {suburb}.",
      "Needed {job} around {suburb} and {name} at {business} made it straightforward.",
      "Our {trade} in {suburb} this {month} was {first} from {business}, for {job}.",
      "Thanks to {business} for taking care of {job} in {suburb} this {month}.",
      "We called {first} at {business} when we needed {job} in {suburb}, and we are glad we did.",
      "Had {job} done in {suburb} by {business} and it took a real load off.",
      "Went with {business} for {job} here in {perth} ({suburb}) and would do the same again."
    ]
  };

  var PRAISE = {
    timeliness: {
      casual: ["Arrived when they said they would.", "Turned up on time.", "Kept to the time they gave us.", "No waiting around on the day.", "Was there at the time we agreed."],
      professional: ["Arrived at the agreed time.", "Attended the booking promptly.", "Kept to the scheduled appointment.", "Punctual throughout.", "Arrived as arranged."],
      warm: ["They were there right when they said, which was a relief.", "Turned up on time, no chasing needed.", "Kept the time they gave us, which we appreciated.", "On time and unhurried.", "Showed up when promised."]
    },
    cleanliness: {
      casual: ["Left the place tidy afterwards.", "Worked cleanly and packed up after.", "No mess left behind.", "Covered the floors and cleaned up properly.", "The site was tidy at the end of the day."],
      professional: ["The work area was left clean and tidy.", "Housekeeping on site was careful.", "The property was protected and cleaned down afterwards.", "No debris was left behind.", "Site presentation was excellent."],
      warm: ["They treated the house with care and left it tidy.", "No mess to deal with when they headed off.", "Floors were protected and everything was packed up.", "It did not feel like a building site at the end of the day.", "Clean and considerate in our home."]
    },
    value: {
      casual: ["The quote felt fair.", "The price was clear from the start.", "No surprise costs.", "Charged what they said they would.", "Good value for the work done."],
      professional: ["The quotation was clear and honoured.", "Pricing was transparent.", "The final invoice matched what was agreed.", "Fairly priced for the scope of work.", "No unexpected variations."],
      warm: ["We felt the price was fair, with no nasty extras.", "Upfront about the cost, which we liked.", "Charged just what they said — no surprises.", "Good value and honest about the numbers.", "The quote was plain and they stuck to it."]
    },
    communication: {
      casual: ["Explained the work in plain words.", "Talked us through the job clearly.", "Answered our questions without the jargon.", "We always knew what was happening.", "Kept us posted as the job went along."],
      professional: ["Explained the scope clearly.", "Communication was prompt and clear.", "Options were discussed before work began.", "We were kept informed throughout.", "Questions were answered in plain language."],
      warm: ["Talked us through everything so we were not guessing.", "Happy to explain things in everyday language.", "Kept in touch, which made the job easier.", "We felt informed the whole way.", "Clear, patient and easy to follow."]
    },
    staff: {
      casual: ["Easy to deal with.", "Friendly and professional on site.", "A pleasure to have at the house.", "Polite, calm and straightforward.", "Good to work with from start to finish."],
      professional: ["Courteous and professional throughout.", "Conduct on site was respectful.", "A professional manner with the household.", "Straightforward and easy to liaise with.", "Presented well and dealt with us courteously."],
      warm: ["Lovely to have in the house.", "Friendly without being in the way.", "Felt like they genuinely cared about getting it right.", "Kind, calm and easy to talk to.", "A really decent manner with us."]
    },
    quality: {
      casual: ["The finish was neat.", "Solid, careful work.", "Happy with the standard of the job.", "Took care with the details.", "Did not rush the work."],
      professional: ["The standard of workmanship was high.", "The finish was neat and even.", "Work was completed with care and attention.", "A thorough, well-executed job.", "Quality was consistent throughout."],
      warm: ["The finish looks great.", "You can tell they took pride in the work.", "Neat, careful and not rushed.", "Really pleased with how it turned out.", "The result is tidy and well done."]
    },
    solved: {
      casual: ["Sorted the problem out properly.", "Got to the cause rather than a quick patch.", "The issue has been fine since.", "Fixed what we asked and checked it before leaving.", "The job did what we needed."],
      professional: ["The issue was diagnosed and resolved.", "The work has performed as required since completion.", "The underlying problem was addressed, not only the symptom.", "Tested the work before leaving site.", "The required outcome was achieved."],
      warm: ["The problem is actually gone, which is a relief.", "They found the cause and fixed it properly.", "Has been fine ever since they finished.", "Checked it over with us before they left.", "Did exactly what we hoped they would."]
    }
  };

  var CLOSERS = {
    casual: [
      "Would book them again.",
      "Happy to recommend them.",
      "Glad we went with them.",
      "I would use them next time.",
      "Easy to recommend from this job.",
      "No issues at all on the day.",
      "A straightforward job from start to finish.",
      "Will call them back if we need this again."
    ],
    professional: [
      "I would engage them again.",
      "I am comfortable recommending their services.",
      "A professional experience overall.",
      "Satisfied with the engagement from start to finish.",
      "We would instruct them again for similar work.",
      "Recommended on the basis of this job."
    ],
    warm: [
      "Would happily have them back.",
      "Really glad we chose them.",
      "Happy to recommend them to anyone nearby.",
      "One we will keep on our list.",
      "Felt well looked after the whole way.",
      "Thanks again — we would use them next time."
    ]
  };

  var ALERT_OPENERS = {
    casual: [
      "I have used {name} at {business} for {job} and would recommend getting in touch.",
      "{business} looked after {job} for us in {suburb}. Happy to recommend from that job.",
      "If you want {aTrade} around {suburb}, I can vouch for {first} from work I have actually seen.",
      "We have had {business} out in {suburb} for {job}. Genuine recommendation from a real job.",
      "{first} at {business} did {job} for us. I would use them again.",
      "For {aTrade} in {suburb} or nearby, we went with {business} and were happy with {job}.",
      "I know {first} from {business} through {job} in {suburb} and would use them again.",
      "Used {business} for {job} here in {perth}. Happy to pass on the name.",
      "If it helps, {business} handled {job} for us in {suburb} and I would recommend them.",
      "{name} at {business} is the {trade} we used for {job}. Worth a call."
    ],
    professional: [
      "I can recommend {business} for {job} in the {suburb} area, based on work they completed for us.",
      "We engaged {name} of {business} as our {trade} for {job} in {suburb} and were satisfied.",
      "For those seeking {aTrade} in {suburb}, {business} completed {job} for us to a good standard.",
      "I have firsthand experience of {business} carrying out {job} in {suburb} and would recommend an enquiry.",
      "{first} at {business} undertook {job} at our property. I am comfortable recommending them.",
      "Based on {job} completed in {suburb}, I would recommend contacting {business}."
    ],
    warm: [
      "If you are after {aTrade} in {suburb}, we were really happy with {first} at {business} for {job}.",
      "Just a genuine plug for {business} — they did {job} for us in {suburb} and we felt well looked after.",
      "We used {first} at {business} for {job} and would happily point anyone in {suburb} their way.",
      "For what it is worth, {business} looked after {job} for us and I would use them again.",
      "Happy to recommend {name} at {business} after {job} in {suburb} — a real job, not just a name drop."
    ]
  };

  function hash(s) {
    var h = 0;
    String(s).split("").forEach(function (c) { h = ((h << 5) - h) + c.charCodeAt(0); h |= 0; });
    return Math.abs(h);
  }
  function fillTpl(tpl, map) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) { return map[k] || ""; }).replace(/\s+/g, " ").trim();
  }
  function similar(a, b) {
    var stop = { with:1, from:1, they:1, them:1, this:1, that:1, have:1, been:1, were:1, was:1, for:1, the:1, and:1, our:1, their:1, your:1, after:1, when:1, what:1, which:1, would:1, could:1, about:1, into:1, just:1, then:1, than:1, also:1, very:1, really:1, happy:1, recommend:1, local:1, place:1, needed:1, booked:1, called:1, used:1, went:1, done:1, work:1, job:1 };
    function toks(s) {
      return String(s).toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3 && !stop[w]; });
    }
    var A = toks(a), B = toks(b);
    if (!A.length || !B.length) return 0;
    var set = {};
    B.forEach(function (w) { set[w] = 1; });
    var hit = A.filter(function (w) { return set[w]; }).length;
    return hit / Math.max(A.length, B.length);
  }
  function isBlocked(text, used, batch, threshold) {
    threshold = threshold || 0.62;
    if (!text) return true;
    var all = (used || []).concat(batch || []);
    for (var i = 0; i < all.length; i++) {
      if (all[i] === text) return true;
      if (similar(text, all[i]) >= threshold) return true;
    }
    return false;
  }
  function pick(arr, seed, n) {
    if (!arr || !arr.length) return [];
    var i = Math.abs(seed) % arr.length;
    var out = [];
    var guard = 0;
    while (out.length < Math.min(n || 1, arr.length) && guard < arr.length * 2) {
      var item = arr[(i + guard) % arr.length];
      if (out.indexOf(item) === -1) out.push(item);
      guard++;
    }
    return out;
  }
  function hasFocus(focuses, key) {
    return (focuses || []).indexOf(key) >= 0;
  }
  function makeMap(opts) {
    var m = opts.member || {};
    var jobRaw = opts.job || jobsFor(m.trade)[0];
    var suburb = opts.suburb || "Midland";
    var month = opts.month || "October";
    var first = m.first || (String(m.name || "").split(" ")[0]) || "the tradie";
    var last = m.last || "";
    var name = (m.first && m.last) ? (m.first + " " + m.last) : (m.name || first);
    return {
      business: m.business || "the business",
      name: name,
      first: first,
      last: last,
      job: articleize(jobRaw),
      jobBare: bare(jobRaw),
      suburb: suburb,
      month: month,
      trade: String(m.trade || "tradie").toLowerCase(),
      aTrade: articleize(String(m.trade || "tradie").toLowerCase()),
      Trade: m.trade || "Tradie",
      perth: "Perth",
      region: opts.region || suburb
    };
  }

  function openerFits(tpl, focuses) {
    var staff = hasFocus(focuses, "staff");
    var area = hasFocus(focuses, "area");
    var service = hasFocus(focuses, "service") || hasFocus(focuses, "seo");
    if (staff && tpl.indexOf("{first}") === -1 && tpl.indexOf("{name}") === -1) return false;
    if (area && tpl.indexOf("{suburb}") === -1 && tpl.indexOf("{perth}") === -1) return false;
    if (service && tpl.indexOf("{job}") === -1) return false;
    return true;
  }

  function ensureFocuses(text, map, focuses, tone) {
    var lower = text.toLowerCase();
    var bits = [];
    if ((hasFocus(focuses, "service") || hasFocus(focuses, "seo")) && lower.indexOf(map.jobBare.toLowerCase()) === -1) {
      bits.push("The work was " + map.jobBare);
    }
    if (hasFocus(focuses, "seo") && lower.indexOf(map.trade) === -1) {
      var seoLine = pick(["Happy to recommend them as a local " + map.trade, "A reliable " + map.trade + " for this kind of work", "Good to have a local " + map.trade + " we can call again"], hash(text + map.jobBare), 1)[0];
      bits.push(seoLine);
    }
    if (hasFocus(focuses, "area") && lower.indexOf(map.suburb.toLowerCase()) === -1) {
      bits.push("This was in " + map.suburb);
    } else if (hasFocus(focuses, "seo") && lower.indexOf(map.suburb.toLowerCase()) === -1 && !/\bperth\b/i.test(text)) {
      bits.push("This was in Perth");
    }
    if (hasFocus(focuses, "staff") && lower.indexOf(String(map.first).toLowerCase()) === -1 && lower.indexOf(String(map.name).toLowerCase()) === -1) {
      var manner = pick(PRAISE.staff[tone] || PRAISE.staff.casual, hash(map.first + tone), 1)[0];
      bits.push(map.first + " was " + manner.replace(/\.$/, "").toLowerCase());
    }
    if (!bits.length) return text;
    var extra = bits.join(". ") + ".";
    var base = String(text || "").trim().replace(/\.$/, "");
    return base + ". " + extra;
  }

  function praiseThemes(focuses, length) {
    var themes = [];
    if (hasFocus(focuses, "timeliness")) themes.push("timeliness");
    if (hasFocus(focuses, "cleanliness")) themes.push("cleanliness");
    if (hasFocus(focuses, "value")) themes.push("value");
    if (hasFocus(focuses, "staff")) themes.push("staff");
    var extras = ["quality", "communication", "solved"];
    var need = length === "short" ? 1 : length === "detailed" ? 3 : 2;
    var i = 0;
    while (themes.length < need && i < extras.length) {
      if (themes.indexOf(extras[i]) === -1) themes.push(extras[i]);
      i++;
    }
    return themes;
  }

  function assemble(opts, index) {
    var tone = opts.tone || "casual";
    var length = opts.length || "medium";
    var focuses = opts.focuses || ["seo", "service", "area"];
    var map = makeMap(opts);
    var seed = hash([opts.viewerId || "jamie", map.business, map.jobBare, map.suburb, map.month, tone, length, (opts.round || 0), index, focuses.join(",")].join("|")) + hash(String(opts.viewerId || "jamie")) * (17 + index * 3);
    var openers = (OPENERS[tone] || OPENERS.casual).filter(function (t) { return openerFits(t, focuses); });
    if (!openers.length) openers = OPENERS[tone] || OPENERS.casual;
    var opener = fillTpl(pick(openers, seed, 1)[0], map);
    var themes = praiseThemes(focuses, length);
    var usedThemeLines = opts._usedLines || [];
    var mids = [];
    themes.forEach(function (th, idx) {
      var bank = (PRAISE[th] && PRAISE[th][tone]) || (PRAISE[th] && PRAISE[th].casual) || [];
      var choices = bank.filter(function (p) { return usedThemeLines.indexOf(p) === -1; });
      if (!choices.length) choices = bank;
      var line = pick(choices, seed + idx * 17 + index * 9, 1)[0];
      if (line) {
        mids.push(line);
        usedThemeLines.push(line);
      }
    });
    opts._usedLines = usedThemeLines;
    var closerBank = CLOSERS[tone] || CLOSERS.casual;
    var closer = pick(closerBank, seed + 41, 1)[0];
    var parts;
    if (length === "short") {
      parts = [opener, mids[0]];
    } else if (length === "detailed") {
      parts = [opener].concat(mids).concat([closer]);
    } else {
      parts = [opener].concat(mids.slice(0, 2));
      if ((seed + index) % 3 === 0) parts.push(closer);
    }
    var text = parts.filter(Boolean).join(" ");
    return ensureFocuses(text, map, focuses, tone);
  }

  function buildReviewIdeas(opts) {
    opts = opts || {};
    var used = opts.used || [];
    var out = [];
    opts._usedLines = [];
    var i = 0;
    var guard = 0;
    var jobs = jobsFor((opts.member && opts.member.trade) || "");
    while (out.length < 3 && guard < 400) {
      var local = Object.assign({}, opts);
      var seen = used.length + out.length;
      var threshold = 0.62;
      if (seen > 12) threshold = 0.78;
      if (seen > 24) threshold = 0.88;
      if (seen > 48 || guard > 150) threshold = 0.96;
      if (guard > 250) threshold = 1.01;
      if (guard > 20) {
        local.job = jobs[(hash((opts.viewerId || "") + String(guard) + String(opts.round || 0)) + guard) % jobs.length];
      }
      local._usedLines = opts._usedLines;
      local.round = (opts.round || 0) * 400 + guard;
      var text = assemble(local, i);
      if (!isBlocked(text, used, out, threshold)) out.push(text);
      i++;
      guard++;
    }
    var fb = 0;
    while (out.length < 3) {
      var map = makeMap(opts);
      fb++;
      var fallback = fillTpl("Write a short note in your own words about {job} with {business} in {suburb}.", map) + " Mention what stood out, then change it so it sounds like you.";
      if (fb > 1 || isBlocked(fallback, used, out, 1.01)) fallback += " (" + (used.length + out.length + fb) + ")";
      if (isBlocked(fallback, used, out, 1.01)) fallback += " #" + fb;
      out.push(fallback);
    }
    return out;
  }

  function assembleAlert(opts, index) {
    var tone = opts.tone || "casual";
    var focuses = opts.focuses || ["seo", "service", "area"];
    var map = makeMap(opts);
    var seed = hash(["alert", opts.viewerId || "jamie", opts.alertId || "", map.business, map.jobBare, tone, (opts.round || 0), index, focuses.join(",")].join("|"));
    var bank = ALERT_OPENERS[tone] || ALERT_OPENERS.casual;
    var fitted = bank.filter(function (t) { return openerFits(t, focuses); });
    if (!fitted.length) fitted = bank;
    var text = fillTpl(pick(fitted, seed, 1)[0], map);
    if ((seed + index) % 2 === 1) {
      var midTheme = hasFocus(focuses, "timeliness") ? "timeliness" : hasFocus(focuses, "value") ? "value" : "quality";
      var line = pick((PRAISE[midTheme][tone] || PRAISE[midTheme].casual), seed + 3, 1)[0];
      if (line) text = text.replace(/\.$/, "") + " " + line;
    }
    return ensureFocuses(text, map, focuses, tone);
  }

  function buildAlertIdeas(opts) {
    opts = opts || {};
    var used = opts.used || [];
    var out = [];
    var i = 0, guard = 0;
    var jobs = jobsFor((opts.member && opts.member.trade) || "");
    while (out.length < 3 && guard < 400) {
      var local = Object.assign({}, opts);
      var seen = used.length + out.length;
      var threshold = 0.62;
      if (seen > 12) threshold = 0.78;
      if (seen > 24) threshold = 0.88;
      if (seen > 48 || guard > 150) threshold = 0.96;
      if (guard > 250) threshold = 1.01;
      if (guard > 20) local.job = jobs[(hash((opts.viewerId || "") + String(guard)) + i) % jobs.length];
      local.round = (opts.round || 0) * 400 + guard;
      var text = assembleAlert(local, i);
      if (!isBlocked(text, used, out, threshold)) out.push(text);
      i++; guard++;
    }
    var fb = 0;
    while (out.length < 3) {
      var map = makeMap(opts);
      fb++;
      var fallback = fillTpl("I have used {business} in {suburb} and would recommend getting in touch, in your own words.", map);
      if (fb > 1 || isBlocked(fallback, used, out, 1.01)) fallback += " (" + (used.length + out.length + fb) + ")";
      out.push(fallback);
    }
    return out;
  }

  function combinationCount(trade) {
    var jobs = jobsFor(trade || "Electrician");
    var tones = ["casual", "professional", "warm"];
    var openerN = tones.reduce(function (n, t) { return n + OPENERS[t].length; }, 0);
    var closerN = tones.reduce(function (n, t) { return n + CLOSERS[t].length; }, 0);
    var praiseN = 0;
    Object.keys(PRAISE).forEach(function (th) {
      tones.forEach(function (t) { praiseN += (PRAISE[th][t] || []).length; });
    });
    var alertN = tones.reduce(function (n, t) { return n + ALERT_OPENERS[t].length; }, 0);
    /* Conservative unique texts for one business, one chosen suburb and month:
       openings × jobs × praise-theme picks (approx 7 themes choose 2) × closers × 3 lengths × 3 tones.
       Suburb/month chosen by the member multiply further in real use. */
    var praisePairs = 7 * 6; /* ordered pairs of different themes, rough */
    var perSetting = openerN * jobs.length * closerN; /* already includes 3 tones in openerN/closerN? openerN is sum across tones */
    /* Better: per tone, openings * jobs * (praise lines ~ 5^2) * closers * 3 lengths */
    var perToneJobs = 0;
    tones.forEach(function (t) {
      perToneJobs += OPENERS[t].length * jobs.length * 25 * CLOSERS[t].length * 3;
    });
    return {
      jobsForTrade: jobs.length,
      openings: openerN,
      closers: closerN,
      praiseLines: praiseN,
      alertOpenings: alertN,
      estimatePerBusinessOneSuburbMonth: perToneJobs,
      suburbsInPicker: SUBURBS.length,
      months: MONTHS.length
    };
  }

  root.TCIdeas = {
    MONTHS: MONTHS,
    SUBURBS: SUBURBS,
    categoryFor: categoryFor,
    jobsFor: jobsFor,
    similar: similar,
    isBlocked: isBlocked,
    buildReviewIdeas: buildReviewIdeas,
    buildAlertIdeas: buildAlertIdeas,
    combinationCount: combinationCount,
    OPENERS: OPENERS,
    PRAISE: PRAISE,
    CLOSERS: CLOSERS
  };
})(typeof window !== "undefined" ? window : global);
