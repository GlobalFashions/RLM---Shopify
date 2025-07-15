// Get DOM elements
const rlmInput   = document.getElementById('rlm-input');
const cutInput   = document.getElementById('cut-input');
const processBtn = document.getElementById('process');
const exportBtn  = document.getElementById('export');
const output     = document.getElementById('output');
let mappedRows   = [];

// Enable process button only when both files are selected
function checkFilesReady() {
  processBtn.disabled = !(rlmInput.files.length > 0 && cutInput.files.length > 0);
}
rlmInput.addEventListener('change', checkFilesReady);
cutInput.addEventListener('change', checkFilesReady);

// --- Shopify taxonomy: Use only approved taxonomy names, not paths! ---
const shopifyTaxonomyName = {
  "Dresses": "Dresses",
  "Gowns": "Dresses",
  "Coats": "Coats & Jackets",
  "Jackets": "Coats & Jackets",
  "Blazers": "Coats & Jackets",
  "Fur Coats": "Coats & Jackets",
  "Fur Jackets": "Coats & Jackets",
  "Leather Jackets": "Coats & Jackets",
  "Sweaters & Cartigans": "Sweaters",
  "Tops & Shirts": "Tops & Tees",
  "Pants": "Pants",
  "Shorts": "Shorts",
  "Skirts": "Skirts",
  "Beach Towels": "Towels",
  "Backpacks": "Backpacks",
  "Handle Bags": "Top-handle Bags",
  "Top Handle Bags": "Top-handle Bags",
  "Clutch Bags": "Clutches",
  "Cross-Body Bags": "Crossbody Bags",
  "Shoulder Bags": "Shoulder Bags",
  "Tote Bags": "Tote Bags",
  "Totes": "Tote Bags",
  "Wallets": "Wallets",
  "Sandals": "Sandals",
  "Heels": "Heels",
  "Boots": "Boots",
  "Sneakers": "Sneakers",
  "Loafers": "Loafers",
  "Espadrilles": "Espadrilles",
  "Ballet Flats": "Flats",
  "Slip-Ons": "Slip-ons",
  "Hats": "Hats",
  "Caps": "Hats",
  "Belts": "Belts",
  "Bracelets": "Bracelets",
  "Earrings": "Earrings",
  "Necklaces": "Necklaces",
  "Rings": "Rings",
  "Scarves & Shawls": "Scarves & Shawls",
  // added new singular categories
  "Ankle Strap": "Sandals",
  "Pump": "Heels",
  "Loafer": "Loafers",
  "Clog": "Clogs",
  "Slip Espadrilles": "Espadrilles",
  "Wedge Espadrilles": "Espadrilles"
};

// --- Google Shopping path: ---
const googleCategoryPath = {
  "Dresses": "Apparel & Accessories > Clothing > Dresses",
  "Gowns": "Apparel & Accessories > Clothing > Dresses",
  "Coats": "Apparel & Accessories > Clothing > Outerwear > Coats & Jackets",
  "Jackets": "Apparel & Accessories > Clothing > Outerwear > Coats & Jackets",
  "Blazers": "Apparel & Accessories > Clothing > Outerwear > Coats & Jackets",
  "Fur Coats": "Apparel & Accessories > Clothing > Outerwear > Coats & Jackets",
  "Fur Jackets": "Apparel & Accessories > Clothing > Outerwear > Coats & Jackets",
  "Leather Jackets": "Apparel & Accessories > Clothing > Outerwear > Coats & Jackets",
  "Sweaters & Cartigans": "Apparel & Accessories > Clothing > Sweaters",
  "Tops & Shirts": "Apparel & Accessories > Clothing > Tops & Tees",
  "Pants": "Apparel & Accessories > Clothing > Pants",
  "Shorts": "Apparel & Accessories > Clothing > Shorts",
  "Skirts": "Apparel & Accessories > Clothing > Skirts",
  "Beach Towels": "Home & Garden > Linens & Bedding > Towels > Beach Towels",
  "Backpacks": "Apparel & Accessories > Handbags, Wallets & Cases > Backpacks",
  "Handle Bags": "Apparel & Accessories > Handbags, Wallets & Cases > Top Handle Bags",
  "Top Handle Bags": "Apparel & Accessories > Handbags, Wallets & Cases > Top Handle Bags",
  "Clutch Bags": "Apparel & Accessories > Handbags, Wallets & Cases > Clutches",
  "Cross-Body Bags": "Apparel & Accessories > Handbags, Wallets & Cases > Crossbody Bags",
  "Shoulder Bags": "Apparel & Accessories > Handbags, Wallets & Cases > Shoulder Bags",
  "Tote Bags": "Apparel & Accessories > Handbags, Wallets & Cases > Tote Bags",
  "Totes": "Apparel & Accessories > Handbags, Wallets & Cases > Tote Bags",
  "Wallets": "Apparel & Accessories > Handbags, Wallets & Cases > Wallets",
  "Sandals": "Apparel & Accessories > Shoes > Sandals",
  "Heels": "Apparel & Accessories > Shoes > Heels",
  "Boots": "Apparel & Accessories > Shoes > Boots",
  "Sneakers": "Apparel & Accessories > Shoes > Sneakers",
  "Loafers": "Apparel & Accessories > Shoes > Loafers",
  "Espadrilles": "Apparel & Accessories > Shoes > Espadrilles",
  "Ballet Flats": "Apparel & Accessories > Shoes > Ballet Flats",
  "Slip-Ons": "Apparel & Accessories > Shoes > Slip-Ons",
  "Hats": "Apparel & Accessories > Clothing Accessories > Hats",
  "Caps": "Apparel & Accessories > Clothing Accessories > Hats",
  "Belts": "Apparel & Accessories > Clothing Accessories > Belts",
  "Bracelets": "Apparel & Accessories > Jewelry > Bracelets",
  "Earrings": "Apparel & Accessories > Jewelry > Earrings",
  "Necklaces": "Apparel & Accessories > Jewelry > Necklaces",
  "Rings": "Apparel & Accessories > Jewelry > Rings",
  "Scarves & Shawls": "Apparel & Accessories > Clothing Accessories > Scarves & Shawls",
  // added new singular categories
  "Ankle Strap": "Apparel & Accessories > Shoes > Sandals",
  "Pump": "Apparel & Accessories > Shoes > Heels",
  "Loafer": "Apparel & Accessories > Shoes > Loafers",
  "Clog": "Apparel & Accessories > Shoes > Clogs",
  "Slip Espadrilles": "Apparel & Accessories > Shoes > Espadrilles",
  "Wedge Espadrilles": "Apparel & Accessories > Shoes > Espadrilles"
};

// --- CATEGORY-BASED WEIGHT TABLE ---
const weightsByCategory = {
  "Belts": 454,
  "Blazers": 454,
  "Travel Bags": 907,
  "Backpacks": 907,
  "Briefcases": 907,
  "Clutches": 907,
  "Crossbody Bags": 907,
  "Handle Bags": 907,
  "Pouches": 907,
  "Satchels": 907,
  "Shoulder Bags": 907,
  "Totes": 907,
  "Cummerbunds": 454,
  "Cases/Covers": 454,
  "Card Holders": 454,
  "Coats": 907,
  "Cufflinks": 454,
  "Fur Coats": 907,
  "Fur Accessories": 454,
  "Fur Jackets": 907,
  "Fur Apparel": 907,
  "Footwear": 454,
  "General": 454,
  "Gloves": 454,
  "Hats": 454,
  "Intimate Attire": 454,
  "Jackets": 907,
  "Jumpsuits": 907,
  "Bracelets": 454,
  "Earrings": 454,
  "Necklaces": 454,
  "Rings": 454,
  "Key Holders": 454,
  "Leather Apparel": 454,
  "Leather Coats": 454,
  "Leather Jackets": 454,
  "Outerwear": 454,
  "Pants": 454,
  "Pocket Squares": 454,
  "Rtw Apparel": 454,
  "Soft Accessories": 454,
  "Sweaters/Cardigans": 454,
  "Shorts": 454,
  "Skirts": 454,
  "Socks/Stockings": 454,
  "Scarves/Shawls": 454,
  "Suits": 907,
  "Swimwear": 454,
  "Ballerinas": 454,
  "Boots": 454,
  "Espadrillas": 454,
  "Sandals": 454,
  "Sneakers": 454,
  "Slip-Ons": 454,
  "Lace-Ups": 454,
  "Monks": 454,
  "Luggage Tags": 454,
  "Ties": 454,
  "Tops/Shirts": 454,
  "Vests": 454,
  "Wallets": 454,
  "Gown": 907,
  "Dresses": 454
};

// --- COLOR MAPPING TABLE: Italian to Shopify English ---
const colorTranslation = {
  'AVORIO': 'White', 'BIANCO': 'White', 'OFF WHITE': 'White', 'BURRO': 'White', 'LATTE': 'White',
  'MILK': 'White', 'CREMA': 'White', 'CREAM': 'White', 'OYSTER': 'White', 'NERO': 'Black',
  'BLACK': 'Black', 'ANTRACITE': 'Gray', 'ANTRACITE MELANGE': 'Gray', 'GRIGIO': 'Gray',
  'GRIGIO CHIARO': 'Gray', 'GRIGIO SCURO': 'Gray', 'DARK GREY': 'Gray', 'DARK GRAY': 'Gray',
  'PIOMBO': 'Gray', 'SMOKE': 'Gray', 'DOVE GREY': 'Gray', 'STONE': 'Gray', 'SILVER': 'Silver',
  'ARGENTO': 'Silver', 'PLATINO': 'Silver', 'NICKEL': 'Gray', 'CHARCOAL': 'Gray', 'CLOUD': 'Gray',
  'MARRONE': 'Brown', 'BROWN': 'Brown', 'DARK BROWN': 'Brown', 'TESTA DI MORO': 'Brown',
  'T.MORO': 'Brown', 'CACAO': 'Brown', 'CUOIO': 'Brown', 'NOCCIOLA': 'Brown', 'CHESTNUT': 'Brown',
  'CAFFE': 'Brown', 'COGNAC': 'Brown', 'NUT': 'Brown', 'CAMEL': 'Beige', 'CAMMELLO': 'Beige',
  'BEIGE': 'Beige', 'SABBIA': 'Beige', 'SAND': 'Beige', 'TAUPE': 'Beige', 'TORTORA': 'Beige',
  'FANGO': 'Beige', 'LINO': 'Beige', 'CHAMOIS': 'Beige', 'BLU': 'Blue', 'BLUE': 'Blue', 'NAVY': 'Navy',
  'NOTTE': 'Navy', 'BLU NAVY': 'Navy', 'BLU NOTTE': 'Navy', 'AZZURRO': 'Blue', 'AZZURO POLVERE': 'Blue',
  'BLUETTE': 'Blue', 'COBALTO': 'Blue', 'CELESTE': 'Blue', 'DENIM': 'Blue', 'JEANS': 'Blue',
  'SKY BLUE': 'Blue', 'LIGHT BLUE': 'Blue', 'NIGHT BLUE': 'Navy', 'AVIO': 'Blue', 'INDACO': 'Blue',
  'ROSSO': 'Red', 'RED': 'Red', 'BORDEAUX': 'Burgundy', 'BORDO': 'Burgundy', 'BURGUNDY': 'Burgundy',
  'CHERRY': 'Red', 'CILIEGIA': 'Red', 'RUBINO': 'Red', 'CRIMSON': 'Red', 'RUGGINE': 'Brown',
  'ARANCIO': 'Orange', 'ARANCIONE': 'Orange', 'ORANGE': 'Orange', 'OCRA': 'Yellow', 'GIALLO': 'Yellow',
  'YELLOW': 'Yellow', 'MUSTARD': 'Yellow', 'SAFFRON': 'Yellow', 'CURRY': 'Yellow', 'MELON': 'Yellow',
  'SUN': 'Yellow', 'VERDE': 'Green', 'GREEN': 'Green', 'OLIVE': 'Green', 'SAGE': 'Green', 'SALVIA': 'Green',
  'MINT': 'Green', 'MENTA': 'Green', 'LIME': 'Green', 'PISTACHIO': 'Green', 'EMERALD': 'Green',
  'JUNGLE': 'Green', 'FOREST GREEN': 'Green', 'ARMY': 'Green', 'ARMY GREEN': 'Green', 'ACID GREEN': 'Green',
  'CEDRO': 'Green', 'MOSS': 'Green', 'ROSA': 'Pink', 'PINK': 'Pink', 'FUXIA': 'Pink', 'FUCHSIA': 'Pink',
  'CIPRIA': 'Pink', 'BLUSH': 'Pink', 'POWDER': 'Pink', 'HOT PINK': 'Pink', 'SHOCKING PINK': 'Pink',
  'MAGENTA': 'Pink', 'FULL PINK': 'Pink', 'PLUM': 'Purple', 'LILAC': 'Purple', 'LILLA': 'Purple',
  'VIOLET': 'Purple', 'VIOLA': 'Purple', 'MAUVE': 'Purple', 'ORCHID': 'Purple', 'AMETHYST': 'Purple',
  'MELANZANA': 'Purple', 'GOLD': 'Gold', 'ORO': 'Gold', 'BRONZE': 'Bronze', 'BRONZO': 'Bronze',
  'BRICK': 'Brown', 'MULTICOLOR': 'Multicolor', 'MULTI': 'Multicolor', 'ANIMALIER': 'Animal Print',
  'ANIMAL PRINT': 'Animal Print', 'ANIMAL': 'Animal Print', 'LEOPARD': 'Animal Print', 'CRYSTAL': 'Silver',
  'CHAMPAGNE': 'Beige', 'IVORY': 'White', 'ALMOND': 'Beige', 'PEARL': 'White', 'OYSTER': 'White',
  'PETROLIO': 'Blue'
};

function mapBasicColor(desc) {
  if (!desc) return "Other";
  let base = desc.split(/[\/\-]/)[0].trim().toUpperCase();
  if (colorTranslation[base]) return colorTranslation[base];
  let firstWord = base.split(" ")[0];
  if (colorTranslation[firstWord]) return colorTranslation[firstWord];
  if (base.includes('BLUE')) return 'Blue';
  if (base.includes('PINK')) return 'Pink';
  if (base.includes('GREEN')) return 'Green';
  if (base.includes('GREY') || base.includes('GRAY')) return 'Gray';
  if (base.includes('BROWN')) return 'Brown';
  if (base.includes('YELLOW')) return 'Yellow';
  if (base.includes('RED')) return 'Red';
  if (base.includes('PURPLE') || base.includes('LILA') || base.includes('VIOLET')) return 'Purple';
  if (base.includes('ORANGE')) return 'Orange';
  if (base.includes('IVORY')) return 'White';
  if (base.includes('SILVER')) return 'Silver';
  if (base.includes('GOLD')) return 'Gold';
  if (base.includes('MULTI')) return 'Multicolor';
  if (base.includes('ANIMAL')) return 'Animal Print';
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
}

// --- Sub-Division code → Vendor lookup table ---
const vendorMap = {
  VUP: 'VALENTINO',
  VDP: 'VALENTINO',
  VUA: 'VALENTINO GARAVANI',
  VDA: 'VALENTINO GARAVANI',
  RVR: 'RED VALENTINO',
  RVA: 'RED VALENTINO',
  MMA: 'M MISSONI',
  MMR: 'M MISSONI',
  SWA: 'STUART WEITZMANN',
  AHR: 'ANYA HINDMARCH',
  AHA: 'ANYA HINDMARCH',
  MAP: 'MIKAEL AGHAL',
  DBR: 'DOT & BELL',
  EUR: 'ETRO',
  EUA: 'ETRO',
  EDR: 'ETRO',
  EDA: 'ETRO',
  FFR: 'FABIANA FILIPPI',
  FFA: 'FABIANA FILIPPI'
};

function mapVendorBySubDiv(code) {
  if (!code) return null;
  return vendorMap[code.toString().trim().toUpperCase()] || null;
}

function normalizeHandleTitle(val) {
  if (!val) return '';
  return val.toString().toLowerCase().replace(/\s+/g, '');
}

const categoryToProductType = {
  "Airpods Cases": "Airpods Cases",
  "Ankle Strap": "Sandals",
  "Backpacks": "Backpacks",
  "Bag Accessories": "Bag Accessories",
  "Ballet Flats": "Ballet Flats",
  "Beach Towels": "Beach Towels",
  "Belts": "Belts",
  "Boots": "Boots",
  "Clog": "Clogs",                   // ← new
  "Clutch Bags": "Clutch Bags",
  "Coats": "Coats",
  "Cross-Body Bags": "Cross-Body Bags",
  "DAMAGED": "DAMAGED",
  "Dresses": "Dresses",
  "Earrings": "Earrings",
  "Espadrilles": "Espadrilles",
  "Slip Espadrilles": "Espadrilles", // ← new
  "Wedge Espadrilles": "Espadrilles",// ← new
  "Fanny Packs": "Fanny Packs",
  "Gowns": "Gowns",
  "Handle Bags": "Top Handle Bags",
  "Hats": "Hats",
  "Headbands": "Headbands",
  "Heels": "Heels",
  "Pump": "Heels",                   // ← new
  "INDUSTER": "INDUSTER",
  "Jackets": "Jackets",
  "Jumpsuits": "Jumpsuit & Rompers",
  "Key Holders": "Key Holders",
  "Leather Jackets": "Leather Jackets",
  "Loafer": "Loafers",               // ← new
  "Loafers": "Loafers",
  "Maxi Dresses": "Maxi Dresses",
  "Mens Backpacks": "Mens Backpacks",
  "Mens Boots": "Mens Boots",
  "Mens Coats": "Mens Coats",
  "Mens Dress Shoes": "Mens Dress Shoes",
  "Mens Fur Coats": "Mens Fur Coats",
  "Mens Sandals": "Mens Sandals",
  "Mens Scarves": "Mens Scarves",
  "Mens Sneakers": "Mens Sneakers",
  "Mens Sweaters": "Mens Sweaters",
  "Midi Dresses": "Midi Dresses",
  "Mini Dresses": "Mini Dresses",
  "Mobile Phone Cases": "Mobile Phone Cases",
  "Necklaces": "Necklaces",
  "Pajamas": "Pajamas",
  "Pants": "Pants",
  "Phone Accessories": "Phone Accessories",
  "Ponchos": "Ponchos",
  "Pouches": "Pouches",
  "Pre-Owned Clutches": "Pre-Owned Clutches",
  "Pre-Owned Cross-Body Bags": "Pre-Owned Cross-Body Bags",
  "Pre-Owned Handle Bags": "Pre-Owned Handle Bags",
  "Rings": "Rings",
  "Sandals": "Sandals",
  "Scarves & Shawls": "Scarves & Shawls",
  "Shorts": "Shorts",
  "Shoulder Bags": "Shoulder Bags",
  "Skirts": "Skirts",
  "Slip-Ons": "Slip-Ons",
  "Socks & Stockings": "Socks & Stockings",
  "Sunglasses": "Sunglasses",
  "Sweaters & Cartigans": "Sweaters & Cartigans",
  "Swimwear": "Swimwear",
  "Top Handle Bags": "Top Handle Bags",
  "Tops & Shirts": "Tops & Shirts",
  "Totes": "Tote Bags",
  "Wallets": "Wallets",
  "Womens Fur Coats": "Womens Fur Coats",
  "Womens Sneakers": "Womens Sneakers",
  "Womens Stole": "Womens Stole"
};


function getProductType(categoryRaw) {
  if (!categoryRaw) return "";
  const normalized = categoryRaw.toString().toLowerCase().trim();
  for (const [key, val] of Object.entries(categoryToProductType)) {
    if (normalized === key.toLowerCase()) return val;
  }
  for (const [key, val] of Object.entries(categoryToProductType)) {
    if (normalized.includes(key.toLowerCase())) return val;
  }
  return "";
}

function toTitleCase(str) {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const discountTable = {
  "VALENTINO":            { rtw: 0.75, fur: 0.80, boots: 0.60, shoe_others: 0.50 },
  "VALENTINO GARAVANI":   { boots: 0.60, shoe_others: 0.50 },
  "STUART WEITZMANN":     { rtw: 0.80 },
  "ANYA HINDMARCH":       { rtw: 0.80 },
  "MIKAEL AGHAL":         { rtw: 0.50 },
  "ETRO WOMEN":           { rtw: 0.70 },
  "FABIANA":              { rtw: 0.70, shoe_others: 0.70 }
};

function getDiscount(shopifyVendor, category, subcategory) {
  if (!shopifyVendor) return 0.0;
  const v = shopifyVendor.toUpperCase().trim();
  if (!discountTable[v]) return 0.0;
  if (subcategory && subcategory.toLowerCase().includes('fur')) {
    return discountTable[v].fur || discountTable[v].rtw || 0.0;
  }
  if (category && category.toLowerCase().includes('boot')) {
    return discountTable[v].boots || discountTable[v].shoe_others || 0.0;
  }
  if (category && (category.toLowerCase().includes('shoe') || category.toLowerCase().includes('acc'))) {
    return discountTable[v].shoe_others || 0.0;
  }
  return discountTable[v].rtw || 0.0;
}

// --- SHOPIFY CSV HEADERS (with COO) ---
const shopifyHeaders = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Product Type',
  'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
  'Variant SKU', 'Variant Inventory Qty', 'Variant Grams', 'Variant Inventory Tracker',
  'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Requires Shipping', 'Variant Taxable',
  'Variant Price', 'Variant Compare At Price', 'Variant Barcode', 'Image Src', 'Image Position',
  'Gift Card', 'Google Shopping / Google Product Category', 'Google Shopping / Gender',
  'Google Shopping / Age Group', 'Google Shopping / Condition', 'Variant Weight Unit',
  'Included / United States', 'Included / All', 'Country/Region of Origin', 'Published', 'Status'
];

// MAIN PROCESSOR
processBtn.addEventListener('click', async () => {
  output.innerHTML = 'Processing...';
  mappedRows = [];

  // Read both files as ArrayBuffers
  const rlmData = await rlmInput.files[0].arrayBuffer();
  const cutData = await cutInput.files[0].arrayBuffer();

  // Parse workbooks
  const rlmWorkbook = XLSX.read(rlmData, { type: 'array' });
  const cutWorkbook = XLSX.read(cutData, { type: 'array' });
  const rlmSheet = rlmWorkbook.Sheets[rlmWorkbook.SheetNames[0]];
  const cutSheet = cutWorkbook.Sheets[cutWorkbook.SheetNames[0]];
  const rlmJson = XLSX.utils.sheet_to_json(rlmSheet, { header: 1 });
  const cutJson = XLSX.utils.sheet_to_json(cutSheet, { header: 1 });

  // Locate header rows
  const rlmHeaderRow = rlmJson.findIndex(row =>
    (row||[]).some(cell =>
      cell && cell.toString().toLowerCase().replace(/\s+/g,'') === 'body/fabric'
    )
  );
  const cutHeaderRow = cutJson.findIndex(row =>
    (row||[]).some(cell =>
      cell && cell.toString().toLowerCase().replace(/\s+/g,'') === 'upc'
    )
  );
  if (rlmHeaderRow === -1 || cutHeaderRow === -1) {
    output.innerHTML = 'Header row not found in one of the files.';
    return;
  }

  const rlmHeaders = rlmJson[rlmHeaderRow];
  const rlmRows    = rlmJson.slice(rlmHeaderRow + 1);
  const cutHeaders = cutJson[cutHeaderRow];
  const cutRows    = cutJson.slice(cutHeaderRow + 1);

  // Helper to find column index
  function findCol(headers, name) {
    return headers.findIndex(h =>
      h && h.toString().toLowerCase().trim() === name.toLowerCase()
    );
  }

  // Build RLM index — use the three-letter code from "Sub Div"
  const rlmIdx = {
    body:      findCol(rlmHeaders, 'Body/Fabric'),
    desc:      findCol(rlmHeaders, 'Description'),
    category:  findCol(rlmHeaders, 'Category'),
    colorDesc: findCol(rlmHeaders, 'Color Description'),
    size:      findCol(rlmHeaders, 'Size'),
    upc:       findCol(rlmHeaders, 'UPC'),
    openUnits: findCol(rlmHeaders, 'Open Units'),
    division:  findCol(rlmHeaders, 'Sub Div'),           // ← use the code column
    cost:      findCol(rlmHeaders, 'Cost')
  };
  rlmIdx.hsCode          = findCol(rlmHeaders, 'HS Code');
  rlmIdx.countryOfOrigin = findCol(rlmHeaders, 'Country of Origin');

  // Build Cut & Sold index
  const cutIdx = {
    upc:       findCol(cutHeaders, 'UPC'),
    image:     findCol(cutHeaders, 'Image URL'),
    colorName: findCol(cutHeaders, 'Unnamed: 11')
  };

  // Map UPC → Image & Color
  const upcToImage     = {};
  const upcToColorName = {};
  cutRows.forEach(row => {
    const upcVal = row[cutIdx.upc];
    if (!upcVal) return;
    const key = upcVal.toString().trim();
    if (cutIdx.image >= 0 && row[cutIdx.image]) {
      upcToImage[key] = row[cutIdx.image];
    }
    if (cutIdx.colorName >= 0 && row[cutIdx.colorName]) {
      upcToColorName[key] = row[cutIdx.colorName];
    }
  });

  // Seed CSV
  mappedRows.push(shopifyHeaders);
  
  // ——— DEBUG: print out every unique raw category in your RLM sheet ———
{
  const rawCats = Array.from(new Set(
    rlmRows
      .map(r => r[rlmIdx.category])
      .filter(c => c !== undefined && c !== null)
      .map(c => c.toString().trim())
  ));
  console.log('––––– Unique raw RLM categories –––––');
  console.table(rawCats);
}

// ——— DEBUG: warn about any category that doesn’t map ———
function warnIfUnmapped(cat) {
  const shop = getShopifyCategory(cat);
  const pt   = getProductType(cat);
  if (!shop) console.warn('No Shopify category for:', `"${cat}"`);
  if (!pt)   console.warn('No Product Type for:',     `"${cat}"`);
}

  // Map each RLM row
  rlmRows.forEach(row => {
    if (!row[rlmIdx.body] || !row[rlmIdx.upc]) return;

    const upc          = row[rlmIdx.upc].toString().trim();
    const imageUrl     = upcToImage[upc] ||
      'https://cdn.shopify.com/s/files/1/0792/7031/4277/files/IMAGE-COMING-SOON_1_2d99c925-2fca-4b37-98ae-47f773a52161.jpg?v=1747941245';
    const categoryRaw  = row[rlmIdx.category] || '';
    const handleTitle  = normalizeHandleTitle(row[rlmIdx.body]);

    // Vendor from the three-letter Sub Div code
    const subDivCode = row[rlmIdx.division];
    const vendor     = mapVendorBySubDiv(subDivCode) || '';

    const productType  = getProductType(categoryRaw);

    const rawColor     = upcToColorName[upc] || row[rlmIdx.colorDesc];
    const mappedColor  = mapBasicColor(rawColor);

    const cost         = Number(row[rlmIdx.cost]) || 0;
    const discount     = getDiscount(vendor, categoryRaw, '');
    const price        = (cost * (1 - discount)).toFixed(2);
    const compareAtP   = cost.toFixed(2);

    const weight       = weightsByCategory[toTitleCase(categoryRaw)] || 500;

    const shopifyCat   = shopifyTaxonomyName[toTitleCase(categoryRaw)] || "";
    const googlePath   = googleCategoryPath[toTitleCase(categoryRaw)] || "";

    // Option2 logic
    let option2Name  = 'Size';
    let option2Value = row[rlmIdx.size] || 'N/A';
    if (/shoe|boot|sandal|heel|sneaker|loafer|espadrille|flat|slip/i.test(categoryRaw)) {
      option2Name  = 'Shoe Size';
      option2Value = row[rlmIdx.size] || 'N/A';
    } else if (/accessor/i.test(categoryRaw)) {
      option2Name = 'Accessory Size';
      const rawSize = row[rlmIdx.size]
        ? row[rlmIdx.size].toString().trim().toLowerCase()
        : '';
      if (rawSize === 's' || rawSize === 'small')          option2Value = 'Small';
      else if (rawSize === 'm' || rawSize === 'medium')     option2Value = 'Medium';
      else if (rawSize === 'l' || rawSize === 'large')      option2Value = 'Large';
      else if (/^xl|x[- ]large/.test(rawSize))              option2Value = 'Extra Large';
      else                                                  option2Value = toTitleCase(rawSize);
    }

    // Pull the RLM "Country of Origin"
    const coo = row[rlmIdx.countryOfOrigin]
      ? row[rlmIdx.countryOfOrigin].toString().trim()
      : '';

    // Push CSV row
    mappedRows.push([
      handleTitle,             // Handle
      handleTitle,             // Title
      (row[rlmIdx.desc] || '').toLowerCase(), // Body (HTML)
      vendor,                  // Vendor
      shopifyCat,              // Product Category
      productType,             // Product Type
      'Color',                 // Option1 Name
      mappedColor,             // Option1 Value
      option2Name,             // Option2 Name
      option2Value,            // Option2 Value
      upc,                     // Variant SKU
      row[rlmIdx.openUnits] !== undefined ? row[rlmIdx.openUnits] : '', // Variant Inventory Qty
      weight,                  // Variant Grams
      'shopify',               // Variant Inventory Tracker
      'deny',                  // Variant Inventory Policy
      'manual',                // Variant Fulfillment Service
      'TRUE',                  // Variant Requires Shipping
      'TRUE',                  // Variant Taxable
      price,                   // Variant Price
      compareAtP,              // Variant Compare At Price
      upc,                     // Variant Barcode
      imageUrl,                // Image Src
      '1',                     // Image Position
      'FALSE',                 // Gift Card
      googlePath,              // Google Shopping / Google Product Category
      'Female',                // Google Shopping / Gender
      'Adults',                // Google Shopping / Age Group
      'New',                   // Google Shopping / Condition
      'lb',                    // Variant Weight Unit
      'TRUE',                  // Included / United States
      'TRUE',                  // Included / All
      coo,                     // Country/Region of Origin
      'FALSE',                 // Published
      'active'                 // Status
    ]);
  });

  // Render preview & enable export
  output.innerHTML = `<b>${mappedRows.length - 1} variants mapped:</b><br>
    <table>
      <thead><tr>${shopifyHeaders.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${mappedRows.slice(1).map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`;
  exportBtn.classList.remove('hidden');
});

// EXPORT TO CSV
exportBtn.addEventListener('click', () => {
  const csv = mappedRows.map(row =>
    row.map(field =>
      (typeof field === 'string' && /,|"/.test(field))
        ? `"${field.replace(/"/g, '""')}"`
        : field
    ).join(',')
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'shopify_mapped.csv';
  a.click();
  URL.revokeObjectURL(url);
});
