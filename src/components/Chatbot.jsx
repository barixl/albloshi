import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ── Helper: chip object factory ──────────────────────────────── */
const chip = (icon, label) => ({ icon, label });

/* ── Shared chip sets ─────────────────────────────────────────── */
const BACK_MAIN   = chip('arrow_back',   'Main Menu');
const CONTACT     = chip('support_agent','Contact Us');
const WHATSAPP    = chip('chat',         'Chat on WhatsApp');
const QUOTE_FORM  = chip('edit_note',    'Go to Contact Form');

/* ── Knowledge base ───────────────────────────────────────────── */
const KB = {
  welcome: {
    text: 'Welcome to <strong>Albloshi Assistant</strong>! I can help you explore our business verticals, products, and services. What would you like to know about?',
    chips: [
      chip('business',               'About Albloshi'),
      chip('restaurant',             'Food Distribution'),
      chip('science',                'Intelligent Chemicals'),
      chip('precision_manufacturing','Industrial Materials'),
      chip('engineering',            'Manpower Supply'),
      chip('support_agent',          'Contact Us'),
    ],
  },

  about_albloshi: {
    text: '<strong>Mohammed Al Bloshi Trading Company</strong> was established in <strong>2017</strong> in Dammam, Eastern Province, Saudi Arabia.<br/><br/>We are a multi-division enterprise specializing in:<br/>• Food Distribution (rice, palm oil, restaurant supplies)<br/>• Intelligent Chemicals (exclusive TELLABS distributor for KSA & UAE)<br/>• Industrial Materials (pipes, valves, cable trays, safety gear)<br/>• Manpower Supply (certified industrial workforce)<br/><br/>Operating across <strong>Dammam, Al Khobar, Qatif, Jubail & Al Hassa</strong> — with 100+ containers imported and ambitious expansion plans across the Kingdom.',
    chips: [
      chip('restaurant',             'Food Distribution'),
      chip('science',                'Intelligent Chemicals'),
      chip('precision_manufacturing','Industrial Materials'),
      chip('engineering',            'Manpower Supply'),
      CONTACT, BACK_MAIN,
    ],
  },

  /* ── FOOD DISTRIBUTION ────────────────────────────────────── */
  food_main: {
    text: '<strong>Food Distribution</strong><br/><br/>We specialize in wholesale and distribution of premium food products across Dammam, Al Khobar, Qatif, Jubail, and Al Hassa. All products are SFDA compliant and Halal certified.<br/><br/>Which product category are you interested in?',
    chips: [
      chip('grain',        'Basmati Rice'),
      chip('opacity',      'Palm Cooking Oil'),
      chip('dining',       'Restaurant Essentials'),
      chip('bakery_dining','Grain & Sugar'),
      chip('eco',          'Pakistani Spices'),
      BACK_MAIN,
    ],
  },
  food_rice: {
    text: '<strong>Premium Basmati Rice</strong><br/><br/>We supply select long-grain, aged Basmati rice imported directly from certified crops in Pakistan and India.<br/><br/><strong>Key features:</strong><br/>• Superior aroma & exceptional grain elongation<br/>• Available in 500gm to 50kg packs<br/>• Packaging options: Jute, Non-woven, BOPP, Jar, Plain PP<br/>• Custom branding available<br/>• SFDA Certified & Halal<br/><br/><em>Serving retailers, supermarkets, hotels & restaurants.</em>',
    chips: [
      chip('opacity',   'Palm Cooking Oil'),
      chip('dining',    'Restaurant Essentials'),
      chip('request_quote','Request Rice Quote'),
      chip('restaurant','Food Division'),
      BACK_MAIN,
    ],
  },
  food_oil: {
    text: '<strong>Refined Palm Cooking Oil</strong><br/><br/>Double fractionated, high-smoke-point palm olein oil with a neutral taste — ideal for deep frying and commercial cooking.<br/><br/><strong>Available formats:</strong><br/>• 5L / 10L / 16L tins for restaurants<br/>• 200L drums for bulk buyers<br/>• Bulk tankers for manufacturers<br/>• Halal Certified<br/><br/><em>Serving food factories, catering groups & hospitality chains.</em>',
    chips: [
      chip('grain',        'Basmati Rice'),
      chip('dining',       'Restaurant Essentials'),
      chip('request_quote','Request Oil Quote'),
      chip('restaurant',   'Food Division'),
      BACK_MAIN,
    ],
  },
  food_restaurant: {
    text: '<strong>Restaurant Essentials</strong><br/><br/>Comprehensive supply for foodservice businesses including:<br/><br/>• Food-safe packaging & disposable containers<br/>• Aluminum foil trays<br/>• Bulk dry spices & condiments<br/>• Food-safe kitchen sanitizers<br/>• Disposable cutlery & serving ware<br/><br/><em>Serving restaurant chains, catering companies & central kitchens across the Eastern Province.</em>',
    chips: [
      chip('bakery_dining','Grain & Sugar'),
      chip('grain',        'Basmati Rice'),
      chip('request_quote','Get a Quote'),
      chip('restaurant',   'Food Division'),
      BACK_MAIN,
    ],
  },
  food_grain: {
    text: '<strong>Wholesale Grain & Sugar</strong><br/><br/>Enterprise-scale supply of bulk food commodities:<br/><br/>• High-grade refined white sugar (25kg / 50kg bags)<br/>• Lentils & Pulses<br/>• Chickpeas<br/>• Assorted grain commodities<br/>• SFDA Certified<br/><br/><em>Designed for central kitchens, food factories & large-scale catering operations.</em>',
    chips: [
      chip('opacity',      'Palm Cooking Oil'),
      chip('dining',       'Restaurant Essentials'),
      chip('request_quote','Get a Quote'),
      chip('restaurant',   'Food Division'),
      BACK_MAIN,
    ],
  },
  food_spices: {
    text: '<strong>Premium Pakistani Spices</strong> — <em>Coming Soon</em><br/><br/>We are expanding our portfolio by introducing an authentic range of premium Pakistani spices into the Saudi market.<br/><br/><strong>Planned range:</strong><br/>• Red Chili, Turmeric, Cumin & Coriander<br/>• Garam Masala blends<br/>• Direct farm-sourced & certified<br/>• Custom packaging: 500gm to 50kg (Jute, BOPP, Plain PP)<br/><br/>Register your interest now and we will contact you when stock is available.',
    chips: [
      chip('request_quote','Register Interest'),
      chip('grain',        'Basmati Rice'),
      chip('restaurant',   'Food Division'),
      BACK_MAIN,
    ],
  },

  /* ── INTELLIGENT CHEMICALS ────────────────────────────────── */
  chemicals_main: {
    text: '<strong>Intelligent Chemicals — TELLABS</strong><br/><br/>Albloshi is the <strong>exclusive regional distributor for TELLABS Specialty Chemicals</strong> across Saudi Arabia, UAE & GCC.<br/><br/>TELLABS leverages advanced technologies from France, the Netherlands & Spain, with ISO 9001-certified manufacturing.<br/><br/>Which chemical vertical can I help you with?',
    chips: [
      chip('water_drop',        'Water Treatment'),
      chip('biotech',           'Polymers'),
      chip('filter_alt',        'Activated Carbon'),
      chip('bubble_chart',      'Defoamers'),
      chip('description',       'Pulp & Paper'),
      chip('cleaning_services', 'Cleaning & Hygiene'),
      BACK_MAIN,
    ],
  },
  chem_iwt: {
    text: '<strong>Industrial Water Treatment (IWT)</strong><br/><br/>Our IWT chemical range prevents scale, corrosion & microbiological growth in:<br/><br/>• Cooling towers<br/>• Reverse Osmosis (RO) systems<br/>• MEE (Multi-Effect Evaporators)<br/>• Boilers & heat exchangers<br/>• Effluent & wastewater systems<br/><br/><strong>Includes:</strong> Corrosion inhibitors, scale inhibitors, biocides, dispersants & pH adjusters.<br/><br/><em>Used by petrochemical plants, desalination facilities & industrial water utilities across KSA.</em>',
    chips: [
      chip('biotech',      'Polymers'),
      chip('filter_alt',   'Activated Carbon'),
      chip('request_quote','Request IWT Quote'),
      chip('science',      'Chemicals Menu'),
      BACK_MAIN,
    ],
  },
  chem_polymer: {
    text: '<strong>Polymers — Coagulants & Flocculants</strong><br/><br/>Our polymer range enables efficient solid-liquid separation to improve water and effluent quality:<br/><br/>• Cationic, anionic & non-ionic polyacrylamides<br/>• Coagulants for suspended solids removal<br/>• Flocculants for sludge dewatering<br/>• Suitable for municipal & industrial wastewater<br/>• Pulp & paper process aids<br/><br/><em>Applied in water treatment plants, sugar mills, paper factories & food processing facilities.</em>',
    chips: [
      chip('water_drop',   'Water Treatment'),
      chip('filter_alt',   'Activated Carbon'),
      chip('request_quote','Request Polymer Quote'),
      chip('science',      'Chemicals Menu'),
      BACK_MAIN,
    ],
  },
  chem_carbon: {
    text: '<strong>Activated Carbon Solutions</strong><br/><br/>High-performance activated carbon for removal of:<br/><br/>• Odour & colour<br/>• COD (Chemical Oxygen Demand)<br/>• Organic impurities from aqueous and gas media<br/><br/><strong>Available grades:</strong><br/>• Granular Activated Carbon (GAC)<br/>• Powdered Activated Carbon (PAC)<br/>• Extruded / Pelletized Carbon<br/><br/><em>Used in water purification, air treatment, food & beverage processing & pharmaceutical applications.</em>',
    chips: [
      chip('bubble_chart',  'Defoamers'),
      chip('cleaning_services','Cleaning & Hygiene'),
      chip('request_quote', 'Request AC Quote'),
      chip('science',       'Chemicals Menu'),
      BACK_MAIN,
    ],
  },
  chem_defoamer: {
    text: '<strong>Defoamers — Silicone & Organic</strong><br/><br/>Our silicone and organic defoamer range prevents and controls foaming in aqueous systems:<br/><br/>• Water treatment processes<br/>• Paper & pulp manufacturing<br/>• Food & beverage processing<br/>• Fermentation & biogas plants<br/>• Textile & coating industries<br/><br/><strong>Formats:</strong> Liquid concentrates, emulsions & powder forms based on application requirements.',
    chips: [
      chip('description',   'Pulp & Paper'),
      chip('cleaning_services','Cleaning & Hygiene'),
      chip('request_quote', 'Request Defoamer Quote'),
      chip('science',       'Chemicals Menu'),
      BACK_MAIN,
    ],
  },
  chem_paper: {
    text: '<strong>Pulp & Paper Solutions</strong><br/><br/>Specialty chemicals to improve paper quality and process efficiency:<br/><br/>• Wet & dry strength agents<br/>• Sizing agents & retention aids<br/>• Drainage & formation aids<br/>• Deposit control chemicals<br/>• Biocides for paper mills<br/><br/><em>Helping paper manufacturers achieve better yield, reduced downtime & improved product consistency.</em>',
    chips: [
      chip('bubble_chart',  'Defoamers'),
      chip('biotech',       'Polymers'),
      chip('request_quote', 'Get a Quote'),
      chip('science',       'Chemicals Menu'),
      BACK_MAIN,
    ],
  },
  chem_cleaning: {
    text: '<strong>Cleaning & Hygiene (C&H)</strong><br/><br/>One-stop shop for industrial cleaning and hygiene chemicals across food-related industries:<br/><br/>• <strong>Dairies</strong> — CIP cleaners, sanitizers & disinfectants<br/>• <strong>Poultries</strong> — Surface disinfectants & boot dips<br/>• <strong>Meat Processing</strong> — Food-contact safe sanitizers<br/>• <strong>Breweries & Beverage</strong> — Rinse aids & fermentation vessel cleaners<br/><br/><em>All products are food-safe, SFDA-compatible & available with full MSDS documentation.</em>',
    chips: [
      chip('water_drop',   'Water Treatment'),
      chip('request_quote','Request C&H Quote'),
      chip('science',      'Chemicals Menu'),
      BACK_MAIN,
    ],
  },

  /* ── INDUSTRIAL MATERIALS ─────────────────────────────────── */
  industrial_main: {
    text: '<strong>Industrial Materials</strong><br/><br/>We supply ASTM/ASME & SASO certified industrial materials to oil & gas, construction & manufacturing facilities across Saudi Arabia. All shipments include full <strong>Mill Test Certificates (MTC)</strong>.<br/><br/>Which product line interests you?',
    chips: [
      chip('plumbing',               'Steel Pipes'),
      chip('settings',               'Valves & Flanges'),
      chip('cable',                  'Cable Trays & Fittings'),
      chip('construction',           'Welding & Safety Gear'),
      BACK_MAIN,
    ],
  },
  ind_pipes: {
    text: '<strong>Steel Pipes</strong><br/><br/>We supply a comprehensive range of certified steel piping for industrial applications:<br/><br/>• Carbon steel pipes (seamless & ERW)<br/>• Stainless steel pipes<br/>• Galvanized steel pipes<br/>• Schedule 40, 80, 160 & XXS<br/>• Sizes: ½" to 24" OD<br/>• Standards: ASTM A106, A53, API 5L<br/><br/><em>Used in oil & gas plants, refineries, water networks & construction projects.</em>',
    chips: [
      chip('settings',     'Valves & Flanges'),
      chip('cable',        'Cable Trays & Fittings'),
      chip('request_quote','Request Pipes Quote'),
      chip('precision_manufacturing','Industrial Menu'),
      BACK_MAIN,
    ],
  },
  ind_valves: {
    text: '<strong>Valves & Flanges</strong><br/><br/>Industrial-grade valves and flanges with full material traceability:<br/><br/><strong>Valves:</strong><br/>• Gate, Globe, Ball & Check valves<br/>• Pressure ratings: Class 150 to 2500<br/>• API 6D, API 600, BS 1414 compliant<br/><br/><strong>Flanges:</strong><br/>• Weld Neck, Slip-on, Blind, Threaded<br/>• ANSI/ASME B16.5 & B16.47<br/>• Carbon & stainless steel<br/><br/><em>Supplied with MTC and third-party inspection reports on request.</em>',
    chips: [
      chip('plumbing',     'Steel Pipes'),
      chip('cable',        'Cable Trays & Fittings'),
      chip('request_quote','Request Valves Quote'),
      chip('precision_manufacturing','Industrial Menu'),
      BACK_MAIN,
    ],
  },
  ind_cable: {
    text: '<strong>Cable Trays & Fittings</strong><br/><br/>Electrical support systems for industrial & commercial projects:<br/><br/>• Perforated & ladder-type cable trays<br/>• Hot-dip galvanized & stainless steel options<br/>• Cable tray fittings: elbows, tees, reducers, covers<br/>• Conduits (rigid & flexible)<br/>• Cable cleats & supports<br/>• IEC & BS standards compliant<br/><br/><em>Supplied to EPC contractors, industrial plants & commercial building projects.</em>',
    chips: [
      chip('construction', 'Welding & Safety Gear'),
      chip('settings',     'Valves & Flanges'),
      chip('request_quote','Get a Quote'),
      chip('precision_manufacturing','Industrial Menu'),
      BACK_MAIN,
    ],
  },
  ind_welding: {
    text: '<strong>Welding & Safety Gear</strong><br/><br/>We supply certified welding consumables and personal protective equipment (PPE):<br/><br/><strong>Welding:</strong><br/>• Electrodes (E6010, E7018, E316L etc.)<br/>• MIG/TIG wires & rods<br/>• Welding machines & accessories<br/><br/><strong>Safety (PPE):</strong><br/>• Hard hats, safety boots, harnesses<br/>• Fire-resistant coveralls<br/>• Gas detectors & respirators<br/>• Safety gloves & eye protection<br/><br/><em>SASO & ANSI compliant. Suitable for plant turnarounds & shutdown projects.</em>',
    chips: [
      chip('plumbing',     'Steel Pipes'),
      chip('request_quote','Get a Safety Gear Quote'),
      chip('precision_manufacturing','Industrial Menu'),
      BACK_MAIN,
    ],
  },

  /* ── MANPOWER ─────────────────────────────────────────────── */
  manpower_main: {
    text: '<strong>Manpower Supply</strong><br/><br/>We supply certified industrial workforce to sustain major plant operations, shutdowns & construction projects across Saudi Arabia.<br/><br/><strong>Available personnel:</strong><br/>• Welders (3G, 4G, 6G certified)<br/>• Pipe fitters & fabricators<br/>• Mechanical technicians<br/>• Civil & structural support teams<br/>• Safety officers (HSE certified)<br/>• Electrical technicians<br/><br/><strong>Compliance:</strong> All personnel meet Saudi Labour Law requirements with valid Iqama, GOSI & necessary trade certifications.',
    chips: [
      chip('request_quote','Submit Manpower Request'),
      CONTACT,
      chip('precision_manufacturing','Industrial Materials'),
      BACK_MAIN,
    ],
  },

  /* ── CONTACT / DOCS ───────────────────────────────────────── */
  contact_main: {
    text: '<strong>Get in Touch</strong><br/><br/>Our team is ready to assist with quotes, technical inquiries & partnership discussions.<br/><br/><strong>Business hours:</strong> Sun–Thu, 8:00 AM – 6:00 PM (AST)<br/>📍 Dammam, Eastern Province, KSA',
    chips: [QUOTE_FORM, WHATSAPP, BACK_MAIN],
  },

  msds_doc: {
    text: '<strong>Documentation & Certifications</strong><br/><br/>Every shipment is supported by full documentation:<br/><br/>• <strong>Mill Test Certificates (MTC)</strong> — ASTM/ASME compliant<br/>• <strong>MSDS / SDS sheets</strong> — for all TELLABS chemical products<br/>• <strong>Halal Certificates</strong> — for all food products<br/>• <strong>SFDA clearance</strong> — for food imports<br/>• <strong>ISO 9001</strong> — TELLABS manufacturing<br/><br/>Request full documentation packages through our contact form.',
    chips: [QUOTE_FORM, WHATSAPP, BACK_MAIN],
  },
};

/* ── Chip label → KB key ──────────────────────────────────────── */
function chipToKey(label) {
  const l = label.toLowerCase();
  if (l.includes('main menu'))                            return '__main_menu';
  if (l.includes('food division') || l === 'food distribution') return 'food_main';
  if (l.includes('chemicals menu') || l.includes('intelligent chemicals') || l.includes('tellabs')) return 'chemicals_main';
  if (l.includes('industrial menu') || l.includes('industrial materials')) return 'industrial_main';
  if (l.includes('manpower'))                             return 'manpower_main';
  if (l.includes('about albloshi'))                       return 'about_albloshi';
  if (l.includes('basmati rice') || l === 'rice')        return 'food_rice';
  if (l.includes('palm') || l.includes('cooking oil'))   return 'food_oil';
  if (l.includes('restaurant essentials'))                return 'food_restaurant';
  if (l.includes('grain') || l.includes('sugar'))        return 'food_grain';
  if (l.includes('spice'))                               return 'food_spices';
  if (l.includes('water treatment'))                     return 'chem_iwt';
  if (l.includes('polymer'))                             return 'chem_polymer';
  if (l.includes('activated carbon') || l.includes(' ac quote')) return 'chem_carbon';
  if (l.includes('defoamer'))                            return 'chem_defoamer';
  if (l.includes('pulp') || l.includes('paper'))        return 'chem_paper';
  if (l.includes('cleaning') || l.includes('hygiene'))  return 'chem_cleaning';
  if (l.includes('steel pipes') || l.includes('pipes quote')) return 'ind_pipes';
  if (l.includes('valves'))                              return 'ind_valves';
  if (l.includes('cable tray'))                          return 'ind_cable';
  if (l.includes('welding') || l.includes('safety gear')) return 'ind_welding';
  if (l.includes('contact us'))                          return 'contact_main';
  if (l.includes('whatsapp'))                            return '__whatsapp';
  if (l.includes('contact form') || l.includes('go to contact')) return '__contact_form';
  if (l.includes('quote') || l.includes('request') || l.includes('register interest') || l.includes('manpower request')) return '__contact_form';
  if (l.includes('documentation') || l.includes('msds')) return 'msds_doc';
  return null;
}

/* ── Free-text → KB key ───────────────────────────────────────── */
function textToKey(l) {
  if (l.match(/hello|hi |hey|greet|menu|start|help/))   return '__main_menu';
  if (l.match(/about|company|who are|albloshi|2017/))   return 'about_albloshi';
  if (l.match(/rice|basmati/))                          return 'food_rice';
  if (l.match(/palm oil|cooking oil/))                  return 'food_oil';
  if (l.match(/restaurant|kitchen|catering|disposable/)) return 'food_restaurant';
  if (l.match(/grain|sugar|lentil|chickpea/))           return 'food_grain';
  if (l.match(/spice|pakistan/))                        return 'food_spices';
  if (l.match(/food|distribut/))                        return 'food_main';
  if (l.match(/water treatment|cooling tower|boiler|ro system|iwt/)) return 'chem_iwt';
  if (l.match(/polymer|coagulant|flocculant|sludge/))  return 'chem_polymer';
  if (l.match(/activated carbon|carbon|cod|odour/))    return 'chem_carbon';
  if (l.match(/defoamer|foam|antifoam/))               return 'chem_defoamer';
  if (l.match(/paper|pulp|tissue/))                    return 'chem_paper';
  if (l.match(/cleaning|hygiene|dairy|poultry|cip|sanitiz/)) return 'chem_cleaning';
  if (l.match(/chemical|tellabs|specialty/))           return 'chemicals_main';
  if (l.match(/steel pipe|piping|carbon steel/))       return 'ind_pipes';
  if (l.match(/valve|flange/))                         return 'ind_valves';
  if (l.match(/cable tray|conduit|electrical/))        return 'ind_cable';
  if (l.match(/weld|fabricat|ppe|safety gear|hard hat/)) return 'ind_welding';
  if (l.match(/industrial|material|astm|asme/))        return 'industrial_main';
  if (l.match(/manpower|welder|labour|workforce/))     return 'manpower_main';
  if (l.match(/doc|msds|sds|certif|mtc|halal/))       return 'msds_doc';
  if (l.match(/whatsapp|phone|mobile|riaz/))           return '__whatsapp';
  if (l.match(/contact|quote|inquiry|price|form/))     return 'contact_main';
  return null;
}

/* ── Component ────────────────────────────────────────────────── */
export default function Chatbot() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [firstOpen, setFirstOpen] = useState(true);
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [isTyping,  setIsTyping]  = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (msg) =>
    setMessages(prev => [...prev, { ...msg, id: Date.now() + Math.random() }]);

  const showMainMenu = () => {
    addMessage({ type: 'bot', text: KB.welcome.text, isHtml: true });
    addMessage({ type: 'chips', chips: KB.welcome.chips });
  };

  const dispatch = (key) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (key === '__main_menu') {
        showMainMenu();
      } else if (key === '__whatsapp') {
        addMessage({ type: 'bot', text: 'Connect directly with our Business Development Manager <strong>Mohammad Riaz</strong> for corporate procurement and technical pricing:', isHtml: true });
        addMessage({ type: 'whatsapp' });
        addMessage({ type: 'chips', chips: [QUOTE_FORM, BACK_MAIN] });
      } else if (key === '__contact_form') {
        addMessage({ type: 'bot', text: 'Taking you to our contact & inquiry form...' });
        setTimeout(() => { setIsOpen(false); navigate('/contact'); }, 700);
      } else if (KB[key]) {
        const entry = KB[key];
        addMessage({ type: 'bot', text: entry.text, isHtml: true });
        addMessage({ type: 'chips', chips: entry.chips });
      } else {
        addMessage({ type: 'bot', text: "I couldn't find an exact match. Our sales team is ready to help directly!" });
        addMessage({ type: 'whatsapp' });
        addMessage({ type: 'chips', chips: [QUOTE_FORM, BACK_MAIN] });
      }
    }, 950);
  };

  const handleChip = (chip) => {
    addMessage({ type: 'user', text: chip.label });
    dispatch(chipToKey(chip.label) ?? '__fallback');
  };

  const handleSend = () => {
    const val = input.trim();
    if (!val) return;
    addMessage({ type: 'user', text: val });
    setInput('');
    dispatch(textToKey(val.toLowerCase()) ?? '__fallback');
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (firstOpen) { setFirstOpen(false); setTimeout(() => { setIsTyping(false); showMainMenu(); }, 900); }
  };

  return (
    <>
      <div className="chatbot-float" id="chatbotBtn" aria-label="Open Help Chat" onClick={handleOpen} style={{ cursor: 'pointer' }}>
        {firstOpen && <span className="chatbot-badge">1</span>}
        <span className="material-icons">chat</span>
      </div>

      {isOpen && (
        <div className="chatbot-window active" id="chatbotWindow">
          <div className="chatbot-header">
            <div className="chatbot-info-wrapper">
              <div className="chatbot-avatar">
                <span className="material-icons" style={{ fontSize: '1.3rem', color: 'white' }}>smart_toy</span>
              </div>
              <div className="chatbot-title-group">
                <h4>Albloshi Assistant</h4>
                <span className="chatbot-status">
                  <span className="chatbot-status-dot"></span> Online
                </span>
              </div>
            </div>
            <button className="chatbot-close" aria-label="Close Chat" onClick={() => setIsOpen(false)}>
              <span className="material-icons">close</span>
            </button>
          </div>

          <div className="chatbot-messages" id="chatbotMessages">
            {messages.map(msg => {
              if (msg.type === 'user') {
                return <div key={msg.id} className="chatbot-bubble user">{msg.text}</div>;
              }
              if (msg.type === 'bot') {
                return msg.isHtml
                  ? <div key={msg.id} className="chatbot-bubble bot" dangerouslySetInnerHTML={{ __html: msg.text }} />
                  : <div key={msg.id} className="chatbot-bubble bot">{msg.text}</div>;
              }
              if (msg.type === 'whatsapp') {
                return (
                  <div key={msg.id} className="chatbot-whatsapp-card">
                    <p>Reach us directly on WhatsApp:</p>
                    <a href="https://wa.me/966549581547" target="_blank" rel="noopener noreferrer" className="chatbot-whatsapp-btn">
                      <span className="material-icons">chat</span> Chat on WhatsApp
                    </a>
                  </div>
                );
              }
              if (msg.type === 'chips') {
                return (
                  <div key={msg.id} className="chatbot-chips-wrapper">
                    <div className="chatbot-chips">
                      {msg.chips.map((c, i) => (
                        <button key={i} className="chatbot-chip" onClick={() => handleChip(c)}>
                          <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '5px' }}>{c.icon}</span>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
            {isTyping && (
              <div className="chatbot-typing">
                <span className="chatbot-dot"></span>
                <span className="chatbot-dot"></span>
                <span className="chatbot-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type a question or click a topic..."
              autoComplete="off"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button className="chatbot-send" aria-label="Send Message" onClick={handleSend}>
              <span className="material-icons">send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
