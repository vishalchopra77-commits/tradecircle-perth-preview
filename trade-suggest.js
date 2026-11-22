/* v2.2.2 Tailored Services + Referral partner suggestions for all 456 business types.
   Lookup order: exact trade override > group list (from TC_BUSINESS_CATEGORIES).
   Partner names are real business types from the 456 list. Used by v158.js. */
(function (root) {
  "use strict";
  var G = {
    building: {
      s: ["New builds", "Renovations", "Repairs", "Residential work", "Commercial work", "Quotes and site visits", "Maintenance", "Emergency call-outs", "Insurance work", "Strata work"],
      p: ["Builder", "Electrician", "Plumber", "Carpenter", "Painter", "Plasterer", "Tiler", "Roofer", "Building Designer", "Real Estate Agent", "Property Manager", "Skip Bin Hire"]
    },
    home: {
      s: ["Home visits", "Repairs", "Installations", "Maintenance", "Emergency call-outs", "Quotes and inspections", "Rental properties", "Strata work", "Insurance work", "Same-day service"],
      p: ["Handyman", "Electrician", "Plumber", "Property Manager", "Real Estate Agent", "Cleaner", "Builder", "Painter", "Removalist", "Interior Designer", "Strata Manager", "Locksmith"]
    },
    outdoor: {
      s: ["Garden makeovers", "Garden maintenance", "Paving", "Retaining walls", "Lawn care", "Tree work", "Decks and pergolas", "Fencing", "Irrigation", "Site clean-ups"],
      p: ["Landscaper", "Fencer", "Arborist", "Pool Builder", "Paving Contractor", "Irrigation Technician", "Electrician", "Builder", "Real Estate Agent", "Property Manager", "Concreter", "Bobcat Operator"]
    },
    cleaning: {
      s: ["Regular cleans", "Deep cleans", "End of lease cleans", "Office cleaning", "Carpet cleaning", "Window cleaning", "Pressure washing", "After builders cleans", "Move-in cleans", "One-off cleans"],
      p: ["Real Estate Agent", "Property Manager", "Removalist", "Builder", "Carpet Cleaner", "Window Cleaner", "Pest Control", "Rubbish Removal", "Strata Manager", "Painter", "Handyman", "Gardener"]
    },
    beauty: {
      s: ["Cuts and styling", "Colour", "Bridal and events", "Treatments", "Packages", "Gift vouchers", "Walk-ins", "Late appointments", "Men's grooming", "Consultations"],
      p: ["Hairdresser", "Makeup Artist", "Nail Salon", "Lash & Brow Bar", "Day Spa", "Photographer", "Wedding Planner", "Bridal Shop", "Skin Clinic", "Personal Trainer", "Beauty Supply Store", "Tanning Salon"]
    },
    health: {
      s: ["Initial consultations", "Follow-up appointments", "Treatment plans", "Telehealth", "Home visits", "Health fund rebates", "NDIS clients", "Workplace programs", "Seniors care", "Referrals welcome"],
      p: ["GP Clinic", "Physiotherapist", "Chiropractor", "Massage Therapist", "Pharmacy", "Personal Trainer", "Dietitian", "Psychologist", "Podiatrist", "Gym", "Pilates Studio", "Health Food Store"]
    },
    fitness: {
      s: ["Personal training", "Group classes", "Beginner programs", "Memberships", "Kids' classes", "Online coaching", "Strength training", "Weight loss", "Casual visits", "Corporate wellness"],
      p: ["Physiotherapist", "Dietitian", "Massage Therapist", "Chiropractor", "Health Food Store", "Sporting Goods Store", "Juice Bar", "Personal Trainer", "Gym", "Osteopath", "Health Coach", "Workwear Store"]
    },
    food: {
      s: ["Dine-in", "Takeaway", "Delivery", "Catering", "Functions", "Breakfast", "Lunch", "Dinner", "Special orders", "Gift vouchers"],
      p: ["Caterer", "Event Planner", "Function Venue", "Coffee Roaster", "Bakery", "Butcher", "Grocer", "Brewery", "Florist", "Photographer", "DJ", "Party Hire"]
    },
    retail: {
      s: ["In-store shopping", "Online orders", "Click and collect", "Local delivery", "Gift vouchers", "Special orders", "Product advice", "Trade accounts", "Lay-by", "Repairs and servicing"],
      p: ["Gift Shop", "Florist", "Cafe", "Picture Framer", "Homewares Store", "Interior Designer", "Hardware Store", "Newsagency", "Signwriter", "Printer", "Courier", "Marketing Agency"]
    },
    auto: {
      s: ["Servicing", "Repairs", "Diagnostics", "Mobile service", "Fleet work", "Roadworthy checks", "Insurance work", "Parts and accessories", "Logbook servicing", "Emergency call-outs"],
      p: ["Mechanic", "Panel Beater", "Tyre Shop", "Auto Electrician", "Car Detailing", "Towing", "Windscreen Repair", "Car Dealer", "Auto Parts Store", "Insurance Broker", "Finance Broker", "Vehicle Wrap"]
    },
    pets: {
      s: ["Dog care", "Cat care", "Home visits", "Puppy care", "Senior pets", "Regular bookings", "Holiday bookings", "Pick-up and drop-off", "Gift vouchers", "Packages"],
      p: ["Vet", "Dog Groomer", "Dog Trainer", "Dog Walker", "Pet Shop", "Pet Boarding", "Dog Daycare", "Pet Sitter", "Photographer", "Fence Builder", "Cleaner", "Real Estate Agent"]
    },
    kids: {
      s: ["Weekly lessons", "Holiday programs", "Trial lessons", "Small groups", "One-on-one", "Online lessons", "Beginners", "Exam preparation", "After school", "Term enrolments"],
      p: ["Tutor", "Music Teacher", "Dance School", "Swim School", "Art School", "Childcare Centre", "After School Care", "Sports Coach", "Martial Arts School", "Bookshop", "Toy & Hobby Shop", "Photographer"]
    },
    events: {
      s: ["Weddings", "Birthdays", "Corporate events", "Engagements", "Packages", "Consultations", "Venue visits", "Custom quotes", "Same-day setup", "Gift vouchers"],
      p: ["Photographer", "Videographer", "Celebrant", "DJ", "Wedding Planner", "Event Planner", "Function Venue", "Caterer", "Florist", "Makeup Artist", "Party Hire", "Cake Maker"]
    },
    professional: {
      s: ["Free first consult", "Small business clients", "Individuals", "Ongoing support", "Online meetings", "After-hours appointments", "Fixed-fee packages", "Compliance", "Advice", "Referrals welcome"],
      p: ["Accountant", "Bookkeeper", "Lawyer", "Mortgage Broker", "Financial Planner", "Insurance Broker", "Business Consultant", "Marketing Agency", "Web Designer", "Real Estate Agent", "Tax Agent", "Recruitment Agency"]
    },
    property: {
      s: ["Sales", "Leasing", "Appraisals", "Property management", "Investment property", "First home buyers", "Settlements", "Inspections", "Market reports", "Off-market deals"],
      p: ["Mortgage Broker", "Conveyancer", "Building Inspector", "Pest Control", "Home Stager", "Removalist", "Cleaner", "Photographer", "Handyman", "Property Valuer", "Lawyer", "Accountant"]
    },
    other: {
      s: ["Walk-ins", "Bookings", "Same-day service", "Pick-up and delivery", "Business accounts", "Quotes", "Repairs", "Gift vouchers", "After-hours", "Regular customers"],
      p: ["Courier", "Printer", "Signwriter", "IT Support", "Accountant", "Marketing Agency", "Web Designer", "Self Storage", "Removalist", "Cleaner", "Security Guard Service", "Equipment Hire"]
    }
  };

  /* Specific overrides for common trades (s = services, p = partners). */
  var O = {
    "Pool Builder": { s: ["Concrete pools", "Fibreglass pools", "Plunge pools", "Pool renovations", "Pool heating", "Pool fencing", "Paving and coping", "Pool lighting"], p: ["Pool Fencing", "Landscaper", "Paving Contractor", "Electrician", "Excavator", "Pool Technician", "Pool Shop", "Fencer", "Concreter", "Real Estate Agent"] },
    "Decking Builder": { s: ["Timber decks", "Composite decks", "Deck repairs", "Deck oiling", "Pergolas", "Steps and stairs", "Balustrades", "Pool decks"], p: ["Landscaper", "Pergola Builder", "Balustrade Installer", "Electrician", "Painter", "Paving Contractor", "Builder", "Shade Sail Installer", "Pool Builder", "Real Estate Agent"] },
    "Pergola Builder": { s: ["Pergolas", "Patios", "Carports", "Gable roofs", "Insulated roofs", "Louvre roofs", "Council approvals", "Outdoor lighting"], p: ["Landscaper", "Decking Builder", "Electrician", "Paving Contractor", "Roofer", "Builder", "Shade Sail Installer", "Concreter", "Painter", "Real Estate Agent"] },
    "Shed Builder": { s: ["Garden sheds", "Garages", "Workshops", "Farm sheds", "Slab preparation", "Council approvals", "Shed repairs", "Kit sheds"], p: ["Concreter", "Electrician", "Bobcat Operator", "Builder", "Earthmoving", "Roller Door Installer", "Fencer", "Plumber", "Landscaper", "Real Estate Agent"] },
    "Waterproofing": { s: ["Bathroom waterproofing", "Balcony waterproofing", "Shower leak repairs", "Membranes", "Basement sealing", "Roof decks", "Planter boxes", "Compliance certificates"], p: ["Tiler", "Plumber", "Bathroom Renovator", "Builder", "Shower Repairer", "Roofer", "Damp Specialist", "Concreter", "Strata Manager", "Property Manager"] },
    "Pest Control": { p: ["Builder", "Carpenter", "Real Estate Agent", "Property Manager", "Building Inspector", "Termite Inspector", "Cleaner", "Strata Manager", "Roofer", "Handyman", "Conveyancer", "Gardener"] },
    "Termite Inspector": { s: ["Termite inspections", "Pre-purchase inspections", "Termite barriers", "Thermal imaging", "Annual inspections", "Termite treatments", "Reports for buyers", "New build protection"], p: ["Pest Control", "Building Inspector", "Real Estate Agent", "Conveyancer", "Builder", "Carpenter", "Mortgage Broker", "Property Manager", "Buyer's Agent", "Strata Manager"] },
    "Carpenter": { p: ["Electrician", "Plumber", "Painter", "Tiler", "Builder", "Plasterer", "Cabinet Maker", "Kitchen Installer", "Flooring Installer", "Handyman", "Interior Designer", "Real Estate Agent"] },
    "Electrician": { p: ["Builder", "Air Conditioning", "Carpenter", "Plumber", "Solar Installer", "Security Installer", "Home Automation", "Kitchen Renovator", "Property Manager", "Real Estate Agent", "Antenna Installer", "EV Charger Installer"] },
    "Plumber": { p: ["Tiler", "Electrician", "Carpenter", "Builder", "Bathroom Renovator", "Gas Fitter", "Waterproofing", "Kitchen Renovator", "Hot Water Installer", "Property Manager", "Drainage Camera Inspection", "Real Estate Agent"] },
    "Painter": { p: ["Carpenter", "Plasterer", "Builder", "Interior Designer", "Colour Consultant", "Real Estate Agent", "Property Manager", "Cleaner", "Handyman", "Home Stager", "Floor Sander", "Paint Store"] },
    "Landscaper": { p: ["Fencer", "Carpenter", "Electrician", "Irrigation Technician", "Paving Contractor", "Pool Builder", "Arborist", "Concreter", "Retaining Wall Builder", "Bobcat Operator", "Builder", "Real Estate Agent"] },
    "Fencer": { p: ["Landscaper", "Builder", "Carpenter", "Pool Builder", "Gate Installer", "Retaining Wall Builder", "Concreter", "Paving Contractor", "Real Estate Agent", "Property Manager", "Bobcat Operator", "Dog Trainer"] },
    "Air Conditioning": { p: ["Electrician", "Builder", "Plumber", "Carpenter", "Insulation Installer", "Solar Installer", "Ceiling Installer", "Property Manager", "Real Estate Agent", "Roofer", "Home Automation", "Energy Assessor"] },
    "Roofer": { p: ["Builder", "Guttering", "Electrician", "Carpenter", "Solar Installer", "Skylight Installer", "Insulation Installer", "Roof Restorer", "Painter", "Building Inspector", "Scaffolding", "Real Estate Agent"] },
    "Tiler": { p: ["Plumber", "Waterproofing", "Builder", "Carpenter", "Bathroom Renovator", "Kitchen Renovator", "Shower Screen Installer", "Electrician", "Plasterer", "Interior Designer", "Flooring Store", "Kitchen & Bathroom Showroom"] },
    "Handyman": { p: ["Plumber", "Electrician", "Carpenter", "Painter", "Property Manager", "Real Estate Agent", "Cleaner", "Gardener", "Removalist", "Rubbish Removal", "Locksmith", "Strata Manager"] },
    "Builder": { p: ["Electrician", "Plumber", "Carpenter", "Painter", "Building Designer", "Architect", "Concreter", "Roofer", "Plasterer", "Tiler", "Mortgage Broker", "Real Estate Agent"] },
    "Mortgage Broker": {
      s: ["Home loans", "First home buyers", "Refinancing", "Investment loans", "Construction loans", "Pre-approvals", "Self-employed loans", "Debt consolidation", "Car and equipment finance", "Loan health checks"],
      p: ["Real Estate Agent", "Conveyancer", "Accountant", "Financial Planner", "Buyer's Agent", "Building Inspector", "Insurance Broker", "Lawyer", "Property Valuer", "Builder", "Home Builder", "Tax Agent"]
    },
    "Finance Broker": { s: ["Car loans", "Equipment finance", "Business loans", "Personal loans", "Home loans", "Refinancing", "Pre-approvals", "Low-doc loans"], p: ["Car Dealer", "Accountant", "Mortgage Broker", "Insurance Broker", "Real Estate Agent", "Business Consultant", "Motorcycle Dealer", "Equipment Hire", "Bookkeeper", "Lawyer"] },
    "Accountant": { s: ["Tax returns", "BAS and GST", "Business setup", "Bookkeeping", "Payroll", "SMSF", "Tax planning", "Company accounts", "Cash flow advice", "Xero setup"], p: ["Bookkeeper", "Mortgage Broker", "Financial Planner", "Lawyer", "Business Consultant", "Insurance Broker", "Real Estate Agent", "Web Designer", "Marketing Agency", "HR Consultant", "Recruitment Agency", "Finance Broker"] },
    "Bookkeeper": { s: ["BAS lodgement", "Payroll", "Xero and MYOB", "Accounts payable", "Invoicing", "Bank reconciliations", "Superannuation", "Catch-up bookkeeping"], p: ["Accountant", "Tax Agent", "Business Consultant", "Mortgage Broker", "Financial Planner", "Web Designer", "Marketing Agency", "HR Consultant", "Lawyer", "IT Support"] },
    "Lawyer": { s: ["Wills and estates", "Family law", "Property law", "Business law", "Contracts", "Conveyancing", "Employment law", "Disputes", "Free first chat"], p: ["Accountant", "Conveyancer", "Mortgage Broker", "Financial Planner", "Real Estate Agent", "Counsellor", "Business Consultant", "Insurance Broker", "Migration Agent", "Funeral Director", "Notary", "Psychologist"] },
    "Real Estate Agent": { p: ["Mortgage Broker", "Conveyancer", "Building Inspector", "Pest Control", "Home Stager", "Removalist", "End of Lease Cleaner", "Photographer", "Painter", "Handyman", "Landscaper", "Property Valuer"] },
    "Property Manager": { p: ["Handyman", "Plumber", "Electrician", "End of Lease Cleaner", "Pest Control", "Locksmith", "Gardener", "Painter", "Carpet Cleaner", "Real Estate Agent", "Mortgage Broker", "Air Conditioning"] },
    "Conveyancer": { s: ["Buying property", "Selling property", "Contract reviews", "Settlements", "Title transfers", "Off-the-plan", "Strata titles", "Subdivisions"], p: ["Real Estate Agent", "Mortgage Broker", "Buyer's Agent", "Building Inspector", "Lawyer", "Accountant", "Property Valuer", "Pest Control", "Removalist", "Financial Planner"] },
    "Buyer's Agent": { s: ["Property search", "Negotiation", "Auction bidding", "Investment property", "First home buyers", "Off-market deals", "Suburb reports", "Interstate buyers"], p: ["Mortgage Broker", "Conveyancer", "Building Inspector", "Property Valuer", "Accountant", "Financial Planner", "Pest Control", "Removalist", "Lawyer", "Property Manager"] },
    "Financial Planner": { s: ["Retirement planning", "Super advice", "Investments", "Insurance advice", "Wealth plans", "Estate planning", "Budgeting", "Free first consult"], p: ["Accountant", "Mortgage Broker", "Lawyer", "Insurance Broker", "Tax Agent", "Real Estate Agent", "Buyer's Agent", "Funeral Director", "Bookkeeper", "Business Consultant"] },
    "Insurance Broker": { s: ["Business insurance", "Home and contents", "Public liability", "Car insurance", "Trade insurance", "Income protection", "Fleet insurance", "Claims help"], p: ["Mortgage Broker", "Accountant", "Financial Planner", "Lawyer", "Finance Broker", "Real Estate Agent", "Car Dealer", "Builder", "Business Consultant", "Panel Beater"] },
    "Dog Groomer": {
      s: ["Full grooms", "Bath and brush", "Nail clipping", "Puppy grooms", "Hand stripping", "De-shedding", "Flea treatments", "Mobile grooming", "Teeth cleaning", "Breed cuts"],
      p: ["Vet", "Dog Trainer", "Dog Walker", "Pet Shop", "Dog Daycare", "Pet Boarding", "Pet Sitter", "Photographer", "Cleaner", "Carpet Cleaner", "Fence Builder", "Real Estate Agent"]
    },
    "Vet": { s: ["Check-ups", "Vaccinations", "Desexing", "Dental care", "Surgery", "Microchipping", "Emergency care", "Senior pet care"], p: ["Dog Groomer", "Dog Trainer", "Pet Shop", "Pet Boarding", "Dog Daycare", "Dog Walker", "Pet Sitter", "Photographer", "Fence Builder", "Funeral Director"] },
    "Dog Trainer": { s: ["Puppy school", "Obedience", "Behaviour help", "Private lessons", "Group classes", "Lead training", "Recall training", "Home visits"], p: ["Vet", "Dog Groomer", "Dog Walker", "Pet Shop", "Dog Daycare", "Pet Boarding", "Pet Sitter", "Fence Builder", "Photographer", "Real Estate Agent"] },
    "Dog Walker": { s: ["Solo walks", "Group walks", "Puppy visits", "Pet sitting", "Weekend walks", "Feeding visits", "Beach runs", "Regular bookings"], p: ["Dog Groomer", "Vet", "Dog Trainer", "Pet Shop", "Dog Daycare", "Pet Sitter", "Pet Boarding", "Cleaner", "Real Estate Agent", "Photographer"] },
    "Barber": { p: ["Hairdresser", "Tattoo Studio", "Clothing Store", "Gym", "Personal Trainer", "Photographer", "Skin Clinic", "Beauty Supply Store", "Shoe Shop", "Bridal Shop"] },
    "Hairdresser": { s: ["Cuts and styling", "Colour", "Balayage", "Blow-dries", "Bridal hair", "Treatments", "Extensions", "Kids' cuts", "Men's cuts", "Up-dos"], p: ["Makeup Artist", "Nail Salon", "Lash & Brow Bar", "Photographer", "Wedding Planner", "Bridal Shop", "Day Spa", "Skin Clinic", "Beauty Supply Store", "Celebrant", "Personal Trainer", "Tanning Salon"] },
    "Cleaner": { p: ["Real Estate Agent", "Property Manager", "Removalist", "Carpet Cleaner", "Window Cleaner", "Pest Control", "Handyman", "Gardener", "Rubbish Removal", "Painter", "Strata Manager", "Builder"] },
    "End of Lease Cleaner": { s: ["Bond cleans", "Carpet steam cleaning", "Oven cleaning", "Window cleaning", "Wall washing", "Move-out cleans", "Agent re-cleans", "Pest treatments"], p: ["Property Manager", "Real Estate Agent", "Removalist", "Carpet Cleaner", "Pest Control", "Rubbish Removal", "Handyman", "Painter", "Self Storage", "Gardener"] },
    "Removalist": { s: ["House moves", "Office moves", "Interstate moves", "Packing", "Piano moves", "Furniture removals", "Storage", "Small moves"], p: ["Real Estate Agent", "End of Lease Cleaner", "Self Storage", "Property Manager", "Conveyancer", "Mortgage Broker", "Rubbish Removal", "Handyman", "Piano Mover", "Cleaner", "Furniture Assembler", "Skip Bin Hire"] },
    "Mechanic": { s: ["Logbook servicing", "Brakes", "Repairs", "Diagnostics", "Roadworthy checks", "Air conditioning", "Clutch and gearbox", "Pre-purchase inspections"], p: ["Panel Beater", "Tyre Shop", "Auto Electrician", "Car Detailing", "Towing", "Windscreen Repair", "Car Dealer", "Auto Parts Store", "Finance Broker", "Insurance Broker", "Car Battery Shop", "Exhaust & Brake Specialist"] },
    "Personal Trainer": { s: ["One-on-one sessions", "Small group training", "Weight loss", "Strength training", "Online coaching", "Outdoor sessions", "Nutrition plans", "Beginners"], p: ["Physiotherapist", "Dietitian", "Massage Therapist", "Chiropractor", "Gym", "Health Food Store", "Sporting Goods Store", "Pilates Studio", "Yoga Studio", "Juice Bar", "Health Coach", "Osteopath"] },
    "Physiotherapist": { s: ["Sports injuries", "Back and neck pain", "Rehab", "Dry needling", "Clinical Pilates", "Post-surgery care", "Workplace injuries", "Health fund rebates"], p: ["GP Clinic", "Personal Trainer", "Massage Therapist", "Chiropractor", "Podiatrist", "Gym", "Pilates Studio", "Osteopath", "Dietitian", "Sporting Goods Store", "Medical Imaging Clinic", "Occupational Therapist"] },
    "Photographer": { s: ["Weddings", "Family portraits", "Headshots", "Real estate photos", "Events", "Product photos", "Newborns", "Pets"], p: ["Wedding Planner", "Celebrant", "Makeup Artist", "Hairdresser", "Videographer", "Florist", "Function Venue", "Real Estate Agent", "Event Planner", "Bridal Shop", "Picture Framer", "Marketing Agency"] },
    "Cafe": { s: ["Coffee", "Breakfast", "Lunch", "Takeaway", "Catering", "Cakes and treats", "Functions", "Gift vouchers"], p: ["Coffee Roaster", "Bakery", "Florist", "Gift Shop", "Caterer", "Grocer", "Butcher", "Event Planner", "Coworking Space", "Bookshop", "Photographer", "Printer"] },
    "Web Designer": { s: ["New websites", "Website updates", "Online shops", "SEO", "Hosting", "Logos and branding", "Google Business setup", "Landing pages"], p: ["Graphic Designer", "Marketing Agency", "Photographer", "Accountant", "Bookkeeper", "Printer", "Signwriter", "IT Support", "Business Consultant", "Videographer"] },
    "Electrical Supplier": { p: ["Electrician", "Commercial Electrician", "Solar Installer", "Air Conditioning", "Builder", "Lighting Store", "Home Automation", "Security Installer", "EV Charger Installer", "Hardware Store"] },
    "Paint Store": { p: ["Painter", "Colour Consultant", "Interior Designer", "Builder", "Plasterer", "Hardware Store", "Home Stager", "Carpenter", "Wallpaper Installer", "Handyman"] }
  };

  var index = null;
  function build() {
    index = {};
    var cats = root.TC_BUSINESS_CATEGORIES;
    (cats && cats.groups || []).forEach(function (g) {
      (g.items || []).forEach(function (it) {
        index[String(it.name).toLowerCase()] = { name: it.name, group: g.id };
        (it.aliases || []).forEach(function (a) { index[String(a).toLowerCase()] = { name: it.name, group: g.id }; });
      });
    });
  }
  function find(trade) {
    if (!index) build();
    return index[String(trade || "").trim().toLowerCase()] || null;
  }
  function uniqNot(arr, self) {
    var out = [];
    arr.forEach(function (x) { if (x && x !== self && out.indexOf(x) === -1) out.push(x); });
    return out;
  }
  /* Returns { group, name, services:[], partners:[] } or null if unknown. */
  function forTrade(trade) {
    var hit = find(trade);
    if (!hit) return null;
    var o = O[hit.name] || {};
    var g = G[hit.group] || G.other;
    return {
      group: hit.group,
      name: hit.name,
      override: !!O[hit.name],
      services: uniqNot((o.s || []).concat(o.s ? [] : g.s), null),
      partners: uniqNot((o.p || g.p).concat(g.p), hit.name).slice(0, 12)
    };
  }
  root.RBTradeSuggest = { forTrade: forTrade, groups: G, overrides: O };
})(typeof window !== "undefined" ? window : this);
