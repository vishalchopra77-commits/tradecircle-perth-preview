/* Rate Buddies v1.8.0 — map a place to its city, and work out who is alerted.
   Rule: alert every member in that city, except members of the same trade
   (conflict of interest). A member of the requested trade is featured
   so others can recommend them. Fictional demo data only. */
(function (root) {
  "use strict";

  /* Metro regions in each state belong to one city (the capital, or a
     named second city such as the Gold Coast). Regional areas use the
     main town or city in that region. */
  var METRO_CITY = {
    nsw: "Sydney", vic: "Melbourne", sa: "Adelaide", tas: "Hobart",
    act: "Canberra", wa: "Perth", nt: "Darwin"
  };
  var QLD_METRO_CITY = {
    "gold coast": "Gold Coast",
    "sunshine coast": "Sunshine Coast"
  };
  var REGIONAL_CITY = {
    "wa-peel": "Mandurah",
    "wa-south-west": "Bunbury",
    "wa-great-southern": "Albany",
    "wa-wheatbelt": "Northam",
    "wa-goldfields-esperance": "Kalgoorlie",
    "wa-mid-west": "Geraldton",
    "wa-gascoyne": "Carnarvon",
    "wa-pilbara": "Karratha",
    "wa-kimberley": "Broome",
    "nsw-newcastle-lake-macquarie": "Newcastle",
    "nsw-illawarra": "Wollongong",
    "nsw-central-coast": "Central Coast",
    "vic-geelong-bellarine-surf-coast": "Geelong",
    "vic-ballarat": "Ballarat",
    "vic-bendigo": "Bendigo",
    "qld-cairns-far-north": "Cairns",
    "qld-townsville": "Townsville",
    "qld-toowoomba": "Toowoomba",
    "tas-launceston-north-east": "Launceston",
    "nt-alice-springs-central-australia": "Alice Springs"
  };
  /* Common suburbs and towns used in posts, mapped to a city. */
  var PLACE_CITY = {
    perth: "Perth", joondalup: "Perth", mullaloo: "Perth", midland: "Perth",
    kalamunda: "Perth", fremantle: "Perth", warwick: "Perth", stirling: "Perth",
    "osborne park": "Perth", ellenbrook: "Perth", armadale: "Perth",
    rockingham: "Perth", kwinana: "Perth", mundaring: "Perth", hills: "Perth",
    north: "Perth", south: "Perth", east: "Perth", "central / cbd": "Perth",
    central: "Perth", cbd: "Perth",
    broome: "Broome", bunbury: "Bunbury", albany: "Albany", mandurah: "Mandurah",
    geraldton: "Geraldton", kalgoorlie: "Kalgoorlie", karratha: "Karratha",
    sydney: "Sydney", melbourne: "Melbourne", brisbane: "Brisbane",
    adelaide: "Adelaide", hobart: "Hobart", canberra: "Canberra",
    darwin: "Darwin"
  };
  var WA_METRO_IDS = {
    hills: 1, kwinana: 1, north: 1, south: 1, east: 1, central: 1,
    fremantle: 1, rockingham: 1, joondalup: 1, armadale: 1
  };

  function norm(s) {
    return String(s || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
  }

  function lookupRegion(place) {
    var loc = root.TC_LOCATIONS;
    if (!loc || !loc.states) return null;
    var n = norm(place);
    var i, j, st, r, rn;
    for (i = 0; i < loc.states.length; i++) {
      st = loc.states[i];
      for (j = 0; j < st.regions.length; j++) {
        r = st.regions[j];
        rn = norm(r.name);
        if (r.id === place || rn === n || n.indexOf(rn) !== -1 || rn.indexOf(n) !== -1) {
          return { region: r, state: st };
        }
      }
    }
    return null;
  }

  function cityForPlace(place) {
    var n = norm(place);
    if (!n) return { city: "", place: place || "" };
    if (PLACE_CITY[n]) return { city: PLACE_CITY[n], place: place };
    /* "joondalup home owners", "perth hills" etc. */
    var key;
    for (key in PLACE_CITY) {
      if (n.indexOf(key) !== -1) return { city: PLACE_CITY[key], place: place };
    }
    if (REGIONAL_CITY[n] || REGIONAL_CITY[place]) {
      return { city: REGIONAL_CITY[n] || REGIONAL_CITY[place], place: place };
    }
    var hit = lookupRegion(place);
    if (hit) {
      if (REGIONAL_CITY[hit.region.id]) return { city: REGIONAL_CITY[hit.region.id], place: place, region: hit.region, state: hit.state };
      if (hit.region.type === "metro") {
        if (hit.state.id === "qld") {
          var rn = norm(hit.region.name);
          if (rn.indexOf("gold coast") !== -1) return { city: "Gold Coast", place: place, region: hit.region, state: hit.state };
          if (rn.indexOf("sunshine coast") !== -1) return { city: "Sunshine Coast", place: place, region: hit.region, state: hit.state };
          return { city: "Brisbane", place: place, region: hit.region, state: hit.state };
        }
        if (METRO_CITY[hit.state.id]) return { city: METRO_CITY[hit.state.id], place: place, region: hit.region, state: hit.state };
      }
      /* unnamed regional: use the region name as the city label */
      return { city: hit.region.name, place: place, region: hit.region, state: hit.state };
    }
    return { city: place, place: place };
  }

  function cityForRegionId(id) {
    if (WA_METRO_IDS[id]) return "Perth";
    if (REGIONAL_CITY[id]) return REGIONAL_CITY[id];
    return cityForPlace(id).city;
  }

  /* Canonical fictional circle used to count alerts in the prototype. */
  var CIRCLE = [
    { id: "jamie", first: "Jamie", last: "Hale", business: "Hale Pest Control", trade: "Pest Control", regions: ["hills", "north"], city: "Perth" },
    { id: "sarah", first: "Sarah", last: "Nguyen", business: "Nguyen Carpentry", trade: "Carpenter", regions: ["north", "joondalup"], city: "Perth" },
    { id: "liam", first: "Liam", last: "O’Connor", business: "O’Connor Plumbing", trade: "Plumber", regions: ["south", "fremantle"], city: "Perth" },
    { id: "priya", first: "Priya", last: "Sharma", business: "Sharma Painting Co", trade: "Painter", regions: ["east", "central"], city: "Perth" },
    { id: "jack", first: "Jack", last: "Thompson", business: "Thompson Electrical", trade: "Electrician", regions: ["kwinana", "rockingham"], city: "Perth" },
    { id: "mei", first: "Mei", last: "Chen", business: "West Coast Gardens", trade: "Landscaper", regions: ["hills", "east"], city: "Perth" },
    { id: "daniel", first: "Daniel", last: "Walsh", business: "Walsh Roofing", trade: "Roofer", regions: ["armadale", "south"], city: "Perth" },
    { id: "emma", first: "Emma", last: "Brooks", business: "Brooks Air & Gas", trade: "Air Conditioning", regions: ["north", "central"], city: "Perth" },
    { id: "marcus", first: "Marcus", last: "Adeyemi", business: "Adeyemi Tiling", trade: "Tiler", regions: ["fremantle", "south"], city: "Perth" },
    { id: "tom", first: "Tom", last: "Reeves", business: "Reeves Fencing", trade: "Fencer", regions: ["hills", "armadale"], city: "Perth" },
    { id: "hannah", first: "Hannah", last: "Lewis", business: "Lewis Handyman", trade: "Handyman", regions: ["central", "east"], city: "Perth" },
    { id: "chris", first: "Chris", last: "Patel", business: "Patel Locksmiths", trade: "Locksmith", regions: ["joondalup", "north"], city: "Perth" },
    { id: "noah", first: "Noah", last: "Barrett", business: "Barrett Barbers", trade: "Barber", regions: ["fremantle", "south"], city: "Perth" },
    { id: "michael", first: "Michael", last: "Shaw", business: "Shaw Plumbing", trade: "Plumber", regions: ["joondalup", "north"], city: "Perth" }
  ];

  function firstName(m) {
    if (m.first) return m.first;
    return String(m.name || "").split(" ")[0] || "them";
  }
  function fullName(m) {
    if (m.first) return (m.first + " " + (m.last || "")).trim();
    return m.name || "";
  }
  function tradesMatch(a, b) {
    return norm(a) === norm(b);
  }
  function memberCity(m) {
    if (m.city) return m.city;
    var regs = m.regions || [];
    var i;
    for (i = 0; i < regs.length; i++) {
      var c = cityForRegionId(regs[i]);
      if (c) return c;
    }
    if (m.areas) return cityForPlace(String(m.areas).split(",")[0]).city;
    return "";
  }
  function inCity(m, city) {
    return norm(memberCity(m)) === norm(city);
  }
  function circle() { return CIRCLE.slice(); }
  function membersInCity(city, list) {
    list = list || CIRCLE;
    return list.filter(function (m) { return inCity(m, city); });
  }
  function ofTrade(list, trade) {
    return list.filter(function (m) { return tradesMatch(m.trade, trade); });
  }
  function recipients(city, trade, list) {
    return membersInCity(city, list).filter(function (m) { return !tradesMatch(m.trade, trade); });
  }
  function featuredCandidates(city, trade, list) {
    return ofTrade(membersInCity(city, list), trade);
  }
  /* Fair pick: first candidate who is next in the promotion queue, else first by name. */
  function pickFeatured(city, trade, list, queueIds) {
    var cand = featuredCandidates(city, trade, list);
    if (!cand.length) return null;
    var i, j;
    if (queueIds && queueIds.length) {
      for (i = 0; i < queueIds.length; i++) {
        for (j = 0; j < cand.length; j++) {
          if (cand[j].id === queueIds[i]) return cand[j];
        }
      }
    }
    cand.sort(function (a, b) { return fullName(a).localeCompare(fullName(b)); });
    return cand[0];
  }
  var TRADE_PLURAL = {
    plumber: "plumbers", electrician: "electricians",
    "pest control": "pest controllers", hairdresser: "hairdressers",
    barber: "barbers", carpenter: "carpenters", handyman: "handymen",
    locksmith: "locksmiths", "air conditioning": "air-con technicians",
    painter: "painters", landscaper: "landscapers", roofer: "roofers",
    tiler: "tilers", fencer: "fencers"
  };
  function tradePlural(trade) {
    var key = norm(trade);
    if (TRADE_PLURAL[key]) return TRADE_PLURAL[key];
    return String(trade || "").toLowerCase() + " members";
  }
  function summary(city, trade, featuredId, list) {
    list = list || CIRCLE;
    var inC = membersInCity(city, list);
    var same = ofTrade(inC, trade);
    var recips = recipients(city, trade, list);
    var featured = null;
    if (featuredId) {
      same.forEach(function (m) { if (m.id === featuredId) featured = m; });
    }
    if (!featured) featured = pickFeatured(city, trade, list, ["michael", "liam", "jamie", "hannah", "chris", "emma"]);
    return {
      city: city,
      trade: trade,
      cityCount: inC.length,
      sameTradeCount: same.length,
      alertCount: recips.length,
      featured: featured,
      candidates: same,
      recipients: recips
    };
  }

  root.TCDeviCity = {
    cityForPlace: cityForPlace,
    cityForRegionId: cityForRegionId,
    membersInCity: membersInCity,
    recipients: recipients,
    featuredCandidates: featuredCandidates,
    pickFeatured: pickFeatured,
    summary: summary,
    circle: circle,
    firstName: firstName,
    fullName: fullName,
    tradePlural: tradePlural,
    CIRCLE: CIRCLE
  };
})(window);
