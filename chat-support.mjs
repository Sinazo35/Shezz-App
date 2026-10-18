const services = [
  ["Goddess Cornrows", 450, 180], ["Bohemian Braids", 650, 240],
  ["Salon Style Consultation", 150, 30], ["Creative Cornrows", 350, 150],
  ["Soft Locs & Extensions", 600, 210], ["Gel Manicure", 250, 75],
  ["Braids & Nail Combo", 950, 300], ["Brow Shape & Finish", 180, 45],
  ["Braided Ponytail", 500, 180], ["Patterned Feed-in Braids", 450, 180],
  ["Loc Retwist & Style", 500, 180], ["Braided Bun Ponytail", 600, 210],
  ["Soft Twist Locs", 650, 240], ["Beauty Treatment Combo", 680, 210],
  ["Extension Installation", 750, 240], ["Sculpted Cornrows", 400, 150],
  ["Long Passion Twists", 700, 270], ["Braids, Nails & Brows Combo", 950, 300],
  ["Kids' Cornrows", 300, 120], ["Glam Braided Updo", 650, 180],
  ["Sleek Ponytail", 350, 90], ["Braided Bun Updo", 500, 150],
  ["Classic Ponytail", 350, 90], ["Signature Ponytail", 450, 120],
].map(([name, price, minutes]) => ({ name, price, minutes }));

const languageNames = {
  en: "English", xh: "isiXhosa", zu: "isiZulu", af: "Afrikaans", st: "Sesotho",
  nr: "isiNdebele", nso: "Sepedi", tn: "Setswana", ss: "siSwati", ve: "Tshivenda", ts: "itsonga",
};
const answers = {
  en: {
    location: "SHEZZ is in Delft South, Cape Town, 7100. The exact street address has not been provided, so please confirm it with the salon before travelling.",
    saturday: "The demo schedule lists Saturday as a working day for all three stylists, with slots from 09:00 to 16:00. I cannot see live bookings; choose a Saturday and stylist in Book Appointment to check this device's demo availability. The salon must confirm your request.",
    extensions: "The salon has not specified whether extensions are included or what you should bring. Please confirm with SHEZZ before your appointment. Extension Installation is listed at R750 for about 4 hours; confirm the details with the salon.",
    unlisted: "That style is not listed in the current service menu, so I don't have a confirmed price or duration for it. Please ask the salon for a quote.",
    booking: "Choose Book Appointment, select a service, stylist, date and available time, then send a booking request. Bookings are a demo on this device; the salon must confirm the appointment.",
    payment: "You can choose pay at salon when requesting a booking. Online payments are not active. Never send card details, PINs or banking passwords in chat.",
    rewards: "The demo loyalty program shows a reward after three completed visits. Staff validation is required, and the reward amount is not specified.",
    menu: "Current indicative services and prices:\n",
    menuNote: "Prices and durations are examples; confirm with the salon.",
    unknown: "I can help with service prices and durations, Saturday scheduling, what to bring, location, bookings, payments and rewards. What would you like to know?",
  },
  xh: {
    location: "I-SHEZZ iseDelft South, eKapa, 7100. Asinayo idilesi yesitalato okwangoku. Nceda uqhagamshelane nesaluni ukuze ufumane idilesi echanekileyo ngaphambi kokuba uhambe.",
    saturday: "Ngokweshedyuli ekwi-app, abalungisi bobathathu basebenza ngeMigqibelo, ukususela ngo-09:00 ukuya ku-16:00. Andikwazi ukubona ukuba ngawaphi amaxesha asafumanekayo. Khetha uMgqibelo nomlungisi kwicandelo lokubhukisha ukuze ujonge amaxesha akhoyo kule app. Isaluni iza kuqinisekisa idinga lakho.",
    extensions: "Isaluni ayikachazi ukuba iinwele zokongeza zibandakanyiwe na, okanye ukuba kufuneka uze nezakho. Nceda uqinisekise nesaluni ngaphambi kwedinga lakho. Ukufakelwa kweenwele zokongeza kuboniswe nge-R750 kwaye kuthatha malunga neeyure ezi-4.",
    unlisted: "Eso sitayile asikho kuluhlu lweenkonzo zethu, ngoko asinakukunika ixabiso okanye ixesha eliqinisekisiweyo. Nceda uqhagamshelane nesaluni ukuze ubuze ixabiso.",
    booking: "Ukuze ucele idinga, khetha inkonzo, umlungisi, umhla nexesha elikhoyo kwicandelo lokubhukisha, uze uthumele isicelo. Ezi bhukisho zezovavanyo kule app; isaluni iza kuqinisekisa idinga lakho.",
    payment: "Ungakhetha ukuhlawula esalunini xa ucela idinga. Iintlawulo ze-intanethi azikafumaneki. Musa ukuthumela iinkcukacha zekhadi, iPIN okanye igama eliyimfihlo lebhanki kule ncoko.",
    rewards: "Kule nkqubo yovavanyo, ufumana umvuzo emva kotyelelo olugqityiweyo olu-3. Umsebenzi wesaluni kufuneka awuqinisekise; isixa sesaphulelo asikachazwa.",
    menu: "Amaxabiso eenkonzo ezikuluhlu aqala kwi-R150 ukuya kwi-R950. Nika igama lesitayile ukuze ndikuxelele ixabiso nexesha laso.",
    menuNote: "La ngamaxabiso namaxesha aqikelelweyo. Nceda uqinisekise iinkcukacha nesaluni.",
    duration: "Ixesha eliqikelelweyo",
    unknown: "Ndinganceda ngamaxabiso neenkonzo, amaxesha oMgqibelo, izinto omawuze nazo, indawo, iibhukisho, iintlawulo nemivuzo. Ungathanda ukwazi ntoni?",
  },
  zu: {
    location: "I-SHEZZ iseDelft South, eKapa, 7100. Ikheli lomgwaqo eliqondile alikatholakali; sicela uliqinisekise nesaluni ngaphambi kohambo.",
    saturday: "Uhlelo lwedemo luthi ochwepheshe abathathu basebenza ngoMgqibelo, ngezikhathi zika-09:00 kuya ku-16:00. Angikwazi ukubona ukubhukha okubukhoma; khetha uMgqibelo nochwepheshe ngaphansi kokuthi Bhukha ukuze uhlole ukutholakala kwedemo kule divayisi. Isaluni kufanele iqinisekise isicelo sakho.",
    extensions: "Isaluni ayikasho ukuthi izinwele zokwengeza zifakiwe yini noma okufanele uziphathe. Sicela uqinisekise nesaluni ngaphambi kwesikhathi sakho. Ukufakwa kwezandiso kubhalwe ngo-R750 cishe amahora angu-4; qinisekisa imininingwane nesaluni.",
    unlisted: "Leso sitayela asikho ohlwini lwezinsizakalo lwamanje, ngakho anginayo intengo noma isikhathi esiqinisekisiwe. Sicela ubuze isaluni ngentengo.",
    booking: "Khetha Bhukha, isevisi, uchwepheshe, usuku nesikhathi esitholakalayo, bese uthumela isicelo. Ukubhukha kuyidemo kule divayisi; isaluni kufanele iqinisekise isikhathi.",
    payment: "Ungakhetha ukukhokha esaluni uma ucela ukubhukha. Izinkokhelo ze-inthanethi azikasebenzi. Ungathumeli imininingwane yekhadi, iPIN noma amaphasiwedi asebhange.",
    rewards: "Idemo yemiklomelo ibonisa umklomelo ngemva kokuvakasha okuqediwe okuthathu. Abasebenzi kufanele bawuqinisekise; inani lomklomelo alikacaciswa.",
    menu: "Izinsizakalo nezintengo ezikhona manje:\n",
    menuNote: "Izintengo nezikhathi ziyizibonelo; qinisekisa nesaluni.",
    duration: "Isikhathi esilinganisiwe",
    unknown: "Ngingasiza ngezinsizakalo nezintengo, izikhathi zangoMgqibelo, izinto okufanele uzilethe, indawo, ukubhukha, izinkokhelo nemiklomelo. Yini ongathanda ukuyazi?",
  },
  af: {
    location: "SHEZZ is in Delft South, Kaapstad, 7100. Die presiese straatadres is nie gegee nie; bevestig dit asseblief met die salon voordat jy vertrek.",
    saturday: "Die demo-skedule wys dat al drie stiliste op Saterdae werk, met afspraaktye van 09:00 tot 16:00. Ek kan nie regstreekse besprekings sien nie; kies 'n Saterdag en stilis onder Bespreek om hierdie toestel se demo-beskikbaarheid na te gaan. Die salon moet jou versoek bevestig.",
    extensions: "Die salon het nie aangedui of haarverlengings ingesluit is of wat jy moet saambring nie. Bevestig dit asseblief voor jou afspraak. Extension Installation word teen R750 vir ongeveer 4 uur gelys; bevestig die besonderhede met die salon.",
    unlisted: "Daardie styl verskyn nie op die huidige dienslys nie, dus het ek nie 'n bevestigde prys of duur nie. Vra asseblief die salon vir 'n kwotasie.",
    booking: "Kies Bespreek, kies 'n diens, stilis, datum en beskikbare tyd, en stuur dan 'n versoek. Besprekings is 'n demo op hierdie toestel; die salon moet die afspraak bevestig.",
    payment: "Jy kan betaal by die salon kies wanneer jy 'n bespreking versoek. Aanlynbetalings is nie aktief nie. Moet nooit kaartbesonderhede, PINs of bankwagwoorde hier stuur nie.",
    rewards: "Die demo-lojaliteitsprogram wys 'n beloning ná drie voltooide besoeke. Personeel moet dit bevestig; die beloningsbedrag is nie gespesifiseer nie.",
    menu: "Huidige aangeduide dienste en pryse:\n",
    menuNote: "Pryse en duur is voorbeelde; bevestig dit asseblief met die salon.",
    duration: "Geskatte tyd",
    unknown: "Ek kan help met dienspryse en -duur, Saterdag-afsprake, wat om saam te bring, ligging, besprekings, betalings en belonings. Waaroor wil jy meer weet?",
  },
  st: {
    location: "SHEZZ e Delft South, Motse Kapa, 7100. Aterese e nepahetseng ya seterata ha e so fanwe; ka kopo e netefatse le salon pele o tsamaya.",
    saturday: "Lenaneo la demo le bontsha hore ditsebi tse tharo di sebetsa ka Moqebelo, ka dinako tsa 09:00 ho isa 16:00. Ha ke bone dipehelo tsa nnete; kgetha Moqebelo le setsebi tlasa Beha nako ho bona dinako tsa demo. Salon e lokela ho netefatsa kopo ya hao.",
    extensions: "Salon ha e so hlalose hore na meriri ya tlatsetso e kenyeleditswe kapa o lokela ho tla le eng. Ka kopo netefatsa le salon pele ho kopano. Ho kenya meriri ya tlatsetso ho thathamisitswe ka R750, hoo e ka bang dihora tse 4; netefatsa dintlha le salon.",
    unlisted: "Setaele seo ha se hlahe lenaneng la ditshebeletso tsa hajwale, kahoo ha ke na theko kapa nako e netefaditsweng. Ka kopo kopa theko ho salon.",
    booking: "Kgetha Beha nako, tshebeletso, setsebi, letsatsi le nako e fumanehang, ebe o romela kopo. Dipehelo ke demo sesebedisweng sena; salon e lokela ho netefatsa kopano.",
    payment: "O ka kgetha ho lefa salon ha o kopa kopano. Ditefo tsa inthanete ha di sebetse. O se ke wa romela dintlha tsa karete, PIN kapa diphasewete tsa banka mona.",
    rewards: "Lenaneo la demo la meputso le bontsha moputso ka mora maeto a mararo a phethilweng. Basebetsi ba lokela ho o netefatsa; tjhelete ya moputso ha e a hlaloswa.",
    menu: "Ditshebeletso le ditheko tse bontshitsweng hajwale:\n",
    menuNote: "Ditheko le dinako ke mehlala; ka kopo netefatsa le salon.",
    duration: "Nako e hakanyeditsweng",
    unknown: "Nka thusa ka ditheko le dinako tsa ditshebeletso, dipehelo tsa Moqebelo, dintho tseo o lokelang ho tla le tsona, sebaka, dipehelo, ditefo le meputso. O batla ho tseba eng?",
  },
};

function detectLanguage(message) {
  const text = message.toLowerCase();
  if (/\b(molo|molweni|ndicela|nding|ndifuna|ndiy|iphi|ndiza|nceda|ixabiso|iinkonzo|yimalini|ngaba)\b/.test(text)) return "xh";
  if (/\b(sawubona|sanibonani|ngicela|nging|ngifuna|ngiz|ngabe|izinwele|intengo|isevisi|kubiza)\b/.test(text)) return "zu";
  if (/\b(waar|asseblief|beskikbaar|hoeveel|hare|salon toe|het julle|saterdag|prys|diens|koste)\b/.test(text)) return "af";
  if (/\b(ka kopo|ke kopa|ke batla|hokae|o lokela|moqebelo|bokae|ditshebeletso)\b/.test(text)) return "st";
  return "en";
}

function findService(message) {
  const text = message.toLowerCase();
  const aliases = [
    [/\bgoddess cornrows?\b/, "Goddess Cornrows"],
    [/\bbohemian braids?\b/, "Bohemian Braids"],
    [/\bsalon style consultation\b/, "Salon Style Consultation"],
    [/\bcreative cornrows?\b/, "Creative Cornrows"],
    [/\bsoft locs?(?: and| &) extensions\b/, "Soft Locs & Extensions"],
    [/\bgel manicure\b/, "Gel Manicure"],
    [/\bbraids? and nail combo\b/, "Braids & Nail Combo"],
    [/\bbrow shape\b/, "Brow Shape & Finish"],
    [/\bbraided ponytail\b/, "Braided Ponytail"],
    [/\bpatterned feed-in braids?\b/, "Patterned Feed-in Braids"],
    [/\bloc retwist\b/, "Loc Retwist & Style"],
    [/\bbraided bun ponytail\b/, "Braided Bun Ponytail"],
    [/\bsoft twist locs?\b/, "Soft Twist Locs"],
    [/\bbeauty treatment combo\b/, "Beauty Treatment Combo"],
    [/\bextension installation\b|\binstall(?:ing)? extensions?\b/, "Extension Installation"],
    [/\bsculpted cornrows?\b/, "Sculpted Cornrows"],
    [/\blong passion twists?\b/, "Long Passion Twists"],
    [/\bbraids?, nails? and brows? combo\b/, "Braids, Nails & Brows Combo"],
    [/\bkids'? cornrows?\b/, "Kids' Cornrows"],
    [/\bglam braided updo\b/, "Glam Braided Updo"],
    [/\bsleek ponytail\b/, "Sleek Ponytail"],
    [/\bbraided bun updo\b/, "Braided Bun Updo"],
    [/\bclassic ponytail\b/, "Classic Ponytail"],
    [/\bsignature ponytail\b/, "Signature Ponytail"],
  ];
  const alias = aliases.find(([pattern]) => pattern.test(text));
  const name = alias?.[1] || services.find(service => text.includes(service.name.toLowerCase()))?.name;
  return services.find(service => service.name === name);
}

function getFallback(message, requestedLanguage) {
  const language = requestedLanguage === "auto" ? detectLanguage(message) : requestedLanguage;
  const reply = answers[language] || answers.en;
  const text = message.toLowerCase();
  const asksAboutBringingHair = /bring|own hair|hair included|ezandiso|izandiso|haarverlenging|meriri ya tlatsetso|ndize ne|ndizise|ndiphathe|ezam iinwele|iinwele zokongeza/.test(text);
  if (/knotless|silk press/.test(text)) return reply.unlisted;
  if (asksAboutBringingHair && !/extension installation|install(?:ing)? extensions?/.test(text)) return reply.extensions;
  const service = findService(text);
  if (service) {
    const hours = Math.floor(service.minutes / 60);
    const minutes = service.minutes % 60;
    const duration = [hours ? `${hours} h` : "", minutes ? `${minutes} min` : ""].filter(Boolean).join(" ");
    return `${service.name}: R${service.price.toLocaleString("en-ZA")} · ${reply.duration || "Estimated duration"}: ${duration}. ${reply.menuNote}`;
  }
  if (/address|where|location|directions|iphi|indawo|ikheli|ligging|aterese/.test(text)) return reply.location;
  if (/saturday|sater|mgqibelo|moqebelo/.test(text)) return reply.saturday;
  if (/bring|own hair|extension|extensions|hair included|ezandiso|izandiso|haarverlenging|meriri ya tlatsetso|ndize ne|ndizise|ndiphathe|ezam iinwele|iinwele zokongeza/.test(text)) return reply.extensions;
  if (/reward|point|loyal|discount|redeem|qr|umvuzo|umklomelo|beloning/.test(text)) return reply.rewards;
  if (/pay|deposit|card|eft|payment|intlawulo|inkokhelo|betaling|tefo/.test(text)) return reply.payment;
  if (/book|appointment|available|time|cancel|bhuk|bhukish|booking|afspraak|kopano/.test(text)) return reply.booking;
  if (/price|cost|how much|service|menu|braid|cornrow|loc|nail|ponytail|gel|ixabiso|inkonzo|intengo|isevisi|prys|dienste|ditshebeletso/.test(text)) return reply.menu;
  return reply.unknown;
}

export async function chatSupport(message, requestedLanguage = "auto") {
  const languageDirective = new RegExp(`\\n\\[Reply language: (${Object.keys(languageNames).join("|")})\\]$`, "i").exec(message);
  const question = languageDirective ? message.slice(0, languageDirective.index) : message;
  const preferredLanguage = languageDirective?.[1]?.toLowerCase() || requestedLanguage;
  const language = ["auto", ...Object.keys(languageNames)].includes(preferredLanguage) ? preferredLanguage : "auto";
  const fallback = getFallback(question, language);
  if (!process.env.OPENAI_API_KEY) return fallback;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const languages = "English, isiNdebele, isiXhosa, isiZulu, Afrikaans, Sesotho, Sepedi, Setswana, siSwati, Tshivenda, and Xitsonga";
    const instructions = `You are SHEZZ Beauty Studio's customer-support assistant. Reply in the same language as the customer's question, including South African languages such as ${languages}. If a reply language is explicitly selected, use that language instead. Be concise, warm, and accurate. Only quote services and prices from this catalog: ${JSON.stringify(services)}. These prices and durations are examples and must be confirmed by the salon. Knotless braids and silk presses are not listed; never invent their price or duration. Extension hair policy is unknown; advise customers to confirm what to bring. Location: Delft South, Cape Town, 7100; exact street address is unknown. The demo schedule lists all three stylists on Saturdays and slots from 09:00 to 16:00, but bookings are stored only on the customer's device, so never claim live availability. Bookings are requests requiring salon confirmation. Online payments are not enabled. Never request card details, PINs, or banking passwords. Demo rewards appear after three completed visits, require staff validation, and have no specified discount. For medical or scalp concerns, recommend asking a stylist. If information is unknown, say so and suggest confirming with the salon.`;
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: instructions + (language === "auto" ? "" : ` Answer in ${languageNames[language]}.`),
        input: String(question).slice(0, 1200),
        max_output_tokens: 300,
      }),
    });
    clearTimeout(timer);
    if (!response.ok) return fallback;
    const data = await response.json();
    return data.output_text || data.output?.flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text).join("") || fallback;
  } catch {
    return fallback;
  }
}
