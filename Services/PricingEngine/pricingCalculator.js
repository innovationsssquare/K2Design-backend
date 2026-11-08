const pricingMatrix = require('./pricingMatrix');

function normalizeCategory(cat) {
  if (!cat) return "";
  const key = String(cat).toLowerCase().replace(/[-_ ]/g, "");
  const map = {
    visitingcards: "visitingCards",
    visitingcard: "visitingCards",
    digitalprints: "digitalPrints",
    digitalprint: "digitalPrints",
    digitalprintproduct: "digitalPrints",
    weddingcards: "weddingCards",
    weddingcard: "weddingCards",
    billbooks: "billBooks",
    billbook: "billBooks",
    pavatibooks: "pavatiBooks",
    pavatibook: "pavatiBooks",
    brochures: "brochures",
    brochure: "brochures",
    brochurecover: "brochures",
    booklets: "booklets",
    booklet: "booklets",
    bookleta4a5: "booklets",
    brochuresbooklets: "brochuresBooklets",
    pamphlets: "pamphlets",
    pamphlet: "pamphlets",
    envelopes: "envelopes",
    envelope: "envelopes",
    filesfolders: "filesFolders",
    filesandfolders: "filesFolders",
    invitationcards: "invitationCards",
    invitationcard: "invitationCards",
    letterheads: "letterheads",
    letterhead: "letterheads",
    paperbags: "paperBags",
    paperbag: "paperBags",
    stickerslabels: "stickersLabels",
    stickerlabel: "stickersLabels",
    stickerandlabel: "stickersLabels",
    stickers: "stickersLabels",
    sticker: "stickersLabels",
    tags: "tags",
    tag: "tags",
    stamps: "stamps",
    stamp: "stamps",
    wallcalendars: "wallCalendars",
    wallcalendar: "wallCalendars",
    calendar: "wallCalendars",
    calendars: "wallCalendars"
  };
  return map[key] || cat;
}

/**
 * Universal Print Pricing Calculator
 * Computes exact quote based on category rules and client rate matrices
 */
function calculateProductPrice(categoryInput, params = {}) {
  const category = normalizeCategory(categoryInput);
  const result = {
    category,
    quantity: 0,
    unitPrice: 0,
    baseCost: 0,
    addons: [],
    totalAddonCost: 0,
    subtotal: 0,
    gstPercentage: 18,
    gstAmount: 0,
    finalTotal: 0
  };

  switch (category) {
    // 1. VISITING CARDS
    case 'visitingCards': {
      const { materialId, sides = 1, lamination = 'none', spotUV = 'none', qty = 1000 } = params;
      const mat = pricingMatrix.visitingCards.materials.find(m => m.id === materialId) || pricingMatrix.visitingCards.materials[0];
      const count = Number(qty) || 1000;
      result.quantity = count;

      let unitRate = mat.baseRate1Side;
      result.addons.push({ name: `${mat.name} (1-Side Print)`, rate: mat.baseRate1Side, total: mat.baseRate1Side * count });

      if (Number(sides) === 2) {
        unitRate += mat.side2Addon;
        result.addons.push({ name: '2-Side Printing Surcharge', rate: mat.side2Addon, total: mat.side2Addon * count });
      }

      if (lamination === 'glossFront' || lamination === 'glossBoth') {
        unitRate += mat.glossFront;
        result.addons.push({ name: 'Gloss Lamination (Front)', rate: mat.glossFront, total: mat.glossFront * count });
      }
      if (lamination === 'glossBoth') {
        unitRate += mat.glossBack;
        result.addons.push({ name: 'Gloss Lamination (Back)', rate: mat.glossBack, total: mat.glossBack * count });
      }

      if (spotUV === 'front' || spotUV === 'both') {
        unitRate += mat.uvFront;
        result.addons.push({ name: 'Spot UV (Front)', rate: mat.uvFront, total: mat.uvFront * count });
      }
      if (spotUV === 'both') {
        unitRate += mat.uvBack;
        result.addons.push({ name: 'Spot UV (Back)', rate: mat.uvBack, total: mat.uvBack * count });
      }

      result.unitPrice = Number(unitRate.toFixed(2));
      result.subtotal = Number((result.unitPrice * count).toFixed(2));
      break;
    }

    // 2. DIGITAL PRINTS (12x18 & A4)
    case 'digitalPrints': {
      const { size = '12x18', paperType = '250gsm', sides = 1, lamination = false, qty = 1 } = params;
      const sizeDef = pricingMatrix.digitalPrints.sizes[size] || pricingMatrix.digitalPrints.sizes['12x18'];
      const count = Math.max(1, Number(qty));
      result.quantity = count;

      const slab = sizeDef.slabs.find(s => count >= s.min && count <= s.max) || sizeDef.slabs[sizeDef.slabs.length - 1];
      const isTexture = paperType.toLowerCase().includes('texture') || paperType.toLowerCase().includes('metallic');
      let baseRate = isTexture ? slab.paperTexture : slab.paper250;

      if (Number(sides) === 2) {
        baseRate *= 2; // For all paper 2 side print rate are Double
      }

      result.unitPrice = baseRate;
      let cost = baseRate * count;
      result.addons.push({ name: `${sizeDef.name} Digital Print (${paperType}, ${sides}-Side)`, rate: baseRate, total: cost });

      if (lamination && !isTexture) {
        cost += slab.laminationTotal;
        result.addons.push({ name: `Lamination Flat Charge (${count} sheets)`, rate: slab.laminationTotal, total: slab.laminationTotal });
      }

      result.subtotal = Number(cost.toFixed(2));
      break;
    }

    // 3. WEDDING CARDS
    case 'weddingCards': {
      const { size = '10x15', qty = 500, lamination = false, envelope = false } = params;
      const sizeDef = pricingMatrix.weddingCards.sizes[size] || pricingMatrix.weddingCards.sizes['10x15'];
      const count = Number(qty);
      result.quantity = count;

      const slab = sizeDef.slabs.find(s => s.qty === count) || sizeDef.slabs[0];
      let perUnit = slab.rate;
      result.addons.push({ name: `Wedding Card (${size}, 2-Side Multicolour)`, rate: slab.rate, total: slab.rate * count });

      if (lamination && slab.laminationUnit > 0) {
        perUnit += slab.laminationUnit;
        result.addons.push({ name: '1-Side Lamination', rate: slab.laminationUnit, total: slab.laminationUnit * count });
      }

      if (envelope && slab.envelopeUnit > 0) {
        perUnit += slab.envelopeUnit;
        result.addons.push({ name: 'Matching Envelope', rate: slab.envelopeUnit, total: slab.envelopeUnit * count });
      }

      result.unitPrice = Number(perUnit.toFixed(2));
      result.subtotal = Number((perUnit * count).toFixed(2));
      break;
    }

    // 4. BILL BOOKS
    case 'billBooks': {
      const { bookType = '1_16_wnp_100pg', qty = 12 } = params;
      const typeDef = pricingMatrix.billBooks.types[bookType] || pricingMatrix.billBooks.types['1_16_wnp_100pg'];
      const count = Number(qty);
      result.quantity = count;

      const ratePerBook = typeDef.rates[count] || Object.values(typeDef.rates)[0];
      result.unitPrice = ratePerBook;
      result.subtotal = Number((ratePerBook * count).toFixed(2));
      result.addons.push({ name: typeDef.name, rate: ratePerBook, total: result.subtotal });
      break;
    }

    // 5. PAVATI BOOKS
    case 'pavatiBooks': {
      const { bookType = 'multicolour_100pg', qty = 10 } = params;
      const typeDef = pricingMatrix.pavatiBooks.types[bookType] || pricingMatrix.pavatiBooks.types['multicolour_100pg'];
      const count = Number(qty);
      result.quantity = count;

      const ratePerBook = typeDef.rates[count] || Object.values(typeDef.rates)[0];
      result.unitPrice = ratePerBook;
      result.subtotal = Number((ratePerBook * count).toFixed(2));
      result.addons.push({ name: typeDef.name, rate: ratePerBook, total: result.subtotal });
      break;
    }

    // 6. BROCHURES & BOOKLETS
    case 'brochuresBooklets':
    case 'brochures':
    case 'booklets': {
      let subType = params.subType;
      if (!subType) {
        if (category === 'booklets') subType = 'booklet';
        else subType = 'brochure';
      }
      const productKey = params.productKey || (subType === 'booklet' ? 'A4_4side_170gsm' : 'A4_250gsm');
      const count = Number(params.qty) || 500;
      const lamination = !!params.lamination;
      result.quantity = count;

      if (subType === 'booklet') {
        const item = pricingMatrix.brochuresBooklets.booklets[productKey] || pricingMatrix.brochuresBooklets.booklets['A4_4side_170gsm'];
        const rate = item.rates[count] || Object.values(item.rates)[0];
        result.unitPrice = rate;
        result.subtotal = Number((rate * count).toFixed(2));
        result.addons.push({ name: item.name, rate, total: result.subtotal });
      } else {
        const item = pricingMatrix.brochuresBooklets.brochures[productKey] || pricingMatrix.brochuresBooklets.brochures['A4_250gsm'];
        let rate = item.rates[count] || Object.values(item.rates)[0];
        result.addons.push({ name: item.name, rate, total: rate * count });

        if (lamination && item.laminationUnit && item.laminationUnit[count]) {
          const lamiRate = item.laminationUnit[count];
          rate += lamiRate;
          result.addons.push({ name: 'Lamination Finish', rate: lamiRate, total: lamiRate * count });
        }
        result.unitPrice = Number(rate.toFixed(2));
        result.subtotal = Number((rate * count).toFixed(2));
      }
      break;
    }

    // 7. PAMPHLETS / FLYERS
    case 'pamphlets': {
      const { colourType = 'multicolour', size = 'A5', sides = 1, qty = 1000 } = params;
      const count = Number(qty);
      result.quantity = count;

      const group = colourType === 'oneColour' ? pricingMatrix.pamphlets.oneColour : pricingMatrix.pamphlets.multicolour;
      const sizeDef = group.sizes[size] || group.sizes['A5'];

      let rate = 0;
      if (Number(sides) === 2 && sizeDef.rates2Side) {
        rate = sizeDef.rates2Side[count] || Object.values(sizeDef.rates2Side)[0];
      } else {
        rate = sizeDef.rates1Side[count] || Object.values(sizeDef.rates1Side)[0];
      }

      result.unitPrice = rate;
      result.subtotal = Number((rate * count).toFixed(2));
      result.addons.push({ name: `${group.paper} (${size}, ${sides}-Side, ${colourType})`, rate, total: result.subtotal });
      break;
    }

    // 8. ENVELOPES
    case 'envelopes': {
      const { categoryType = 'multi_100gsm_bond', size = '9x4', qty = 500 } = params;
      const count = Number(qty);
      result.quantity = count;

      const cat = pricingMatrix.envelopes.categories[categoryType] || pricingMatrix.envelopes.categories['multi_100gsm_bond'];
      const sizeRates = cat.sizes[size] || Object.values(cat.sizes)[0];
      const rate = sizeRates[count] || Object.values(sizeRates)[0];

      result.unitPrice = rate;
      result.subtotal = Number((rate * count).toFixed(2));
      result.addons.push({ name: `${cat.name} (${size})`, rate, total: result.subtotal });
      break;
    }

    // 9. FILES & FOLDERS
    case 'filesFolders': {
      const { fileType = 'paper_250gsm', qty = 1000, lamination = 'none', innerPrint = false } = params;
      const count = Number(qty);
      result.quantity = count;

      const typeDef = pricingMatrix.filesFolders.types[fileType] || pricingMatrix.filesFolders.types['paper_250gsm'];
      const slab = typeDef.rates[count] || Object.values(typeDef.rates)[0];

      let unitCost = slab.base;
      result.addons.push({ name: `${typeDef.name} Base`, rate: slab.base, total: slab.base * count });

      if (lamination === 'gloss' && slab.gloss) {
        unitCost += slab.gloss;
        result.addons.push({ name: 'Gloss Lamination', rate: slab.gloss, total: slab.gloss * count });
      } else if (lamination === 'matt' && slab.matt) {
        unitCost += slab.matt;
        result.addons.push({ name: 'Matt Lamination', rate: slab.matt, total: slab.matt * count });
      } else if (lamination === 'spotUV' && slab.spotUV) {
        unitCost += slab.spotUV;
        result.addons.push({ name: 'Matt + Spot UV', rate: slab.spotUV, total: slab.spotUV * count });
      }

      if (innerPrint) {
        const innerRate = slab.innerMulti || slab.innerGrey || 0;
        if (innerRate > 0) {
          unitCost += innerRate;
          result.addons.push({ name: 'Inner Side Print', rate: innerRate, total: innerRate * count });
        }
      }

      result.unitPrice = Number(unitCost.toFixed(2));
      result.subtotal = Number((unitCost * count).toFixed(2));
      break;
    }

    // 10. INVITATION CARDS
    case 'invitationCards': {
      const { size = '6x4', sides = 1, lamination = false, qty = 100 } = params;
      const count = Number(qty);
      result.quantity = count;

      const sizeDef = pricingMatrix.invitationCards.sizes[size] || pricingMatrix.invitationCards.sizes['6x4'];
      let unitCost = sizeDef.rates1Side[count] || Object.values(sizeDef.rates1Side)[0];

      if (Number(sides) === 2) {
        unitCost *= 2; // 2 side-Double rate
      }

      result.unitPrice = unitCost;
      let total = unitCost * count;
      result.addons.push({ name: `Invitation Card (${size}, ${sides}-Side)`, rate: unitCost, total });

      if (lamination && sizeDef.laminationTotal) {
        const lamiTotal = sizeDef.laminationTotal[count] || 400;
        total += lamiTotal;
        result.addons.push({ name: 'Lamination Finish', rate: lamiTotal, total: lamiTotal });
      }

      result.subtotal = Number(total.toFixed(2));
      break;
    }

    // 11. LETTERHEADS
    case 'letterheads': {
      const { qty = 100, binding = 'none' } = params;
      const count = Number(qty);
      result.quantity = count;

      const slab = pricingMatrix.letterheads.rates[count] || pricingMatrix.letterheads.rates[100];
      let total = slab.ratePerUnit * count;
      result.unitPrice = slab.ratePerUnit;
      result.addons.push({ name: 'A4 100gsm Bond Letterheads (Multicolour)', rate: slab.ratePerUnit, total });

      if (binding === '100sheet') {
        total += slab.binding100Total;
        result.addons.push({ name: 'Pad Binding (100 Sheets / Pad)', rate: slab.binding100Total, total: slab.binding100Total });
      } else if (binding === '50sheet') {
        total += slab.binding50Total;
        result.addons.push({ name: 'Pad Binding (50 Sheets / Pad)', rate: slab.binding50Total, total: slab.binding50Total });
      }

      result.subtotal = Number(total.toFixed(2));
      break;
    }

    // 12. PAPER BAGS
    case 'paperBags': {
      const { sizeCode = 'PB-1', finish = 'gloss', qty = 100 } = params;
      const count = Number(qty);
      result.quantity = count;

      const sizeDef = pricingMatrix.paperBags.sizes[sizeCode] || pricingMatrix.paperBags.sizes['PB-1'];
      let unitRate = sizeDef.rates[count] || Object.values(sizeDef.rates)[0];
      result.addons.push({ name: `${sizeCode} (${sizeDef.dimensions} in) - Gloss Lami`, rate: unitRate, total: unitRate * count });

      if (finish === 'matt') {
        unitRate += sizeDef.mattAddon;
        result.addons.push({ name: 'Matt Lamination Upgrade', rate: sizeDef.mattAddon, total: sizeDef.mattAddon * count });
      } else if (finish === 'spotUV') {
        unitRate += sizeDef.spotUVAddon;
        result.addons.push({ name: 'Matt + Spot UV Upgrade', rate: sizeDef.spotUVAddon, total: sizeDef.spotUVAddon * count });
      }

      if (params.foil) {
        unitRate += sizeDef.foilAddon;
        result.addons.push({ name: 'Silver / Gold Foil Stamping', rate: sizeDef.foilAddon, total: sizeDef.foilAddon * count });
      }

      result.unitPrice = Number(unitRate.toFixed(2));
      result.subtotal = Number((unitRate * count).toFixed(2));
      break;
    }

    // 13. STICKERS & LABELS
    case 'stickersLabels': {
      const { type = '49x41mm', qty = 48, lamination = false } = params;
      const count = Number(qty);
      result.quantity = count;

      const typeDef = pricingMatrix.stickersLabels.types[type] || pricingMatrix.stickersLabels.types['49x41mm'];
      let total = 0;

      if (typeDef.slabs) {
        // Custom slabs (A4 / A3)
        const slab = typeDef.slabs.find(s => count >= s.min && count <= s.max) || typeDef.slabs[0];
        result.unitPrice = slab.rate;
        total = slab.rate * count;
        result.addons.push({ name: typeDef.name, rate: slab.rate, total });
        if (lamination) {
          total += slab.laminationTotal;
          result.addons.push({ name: 'Lamination Finish', rate: slab.laminationTotal, total: slab.laminationTotal });
        }
      } else {
        // Fixed die cut
        const rate = typeDef.rates[count] || Object.values(typeDef.rates)[0];
        result.unitPrice = rate;
        total = rate * count;
        result.addons.push({ name: typeDef.name, rate, total });
        if (lamination) {
          let lamiCost = 200;
          if (typeof typeDef.laminationTotal === 'object') {
            lamiCost = typeDef.laminationTotal[count] || typeDef.laminationTotal.default || 200;
          } else if (typeof typeDef.laminationTotal === 'number') {
            lamiCost = typeDef.laminationTotal;
          }
          total += lamiCost;
          result.addons.push({ name: 'Lamination Finish', rate: lamiCost, total: lamiCost });
        }
      }

      result.subtotal = Number(total.toFixed(2));
      break;
    }

    // 14. TAGS
    case 'tags': {
      const { materialId = 'art_250_f_no_lam', stringTie = false, perforation = false, qty = 1000 } = params;
      const count = Number(qty) || 1000;
      result.quantity = count;

      const mat = pricingMatrix.tags.materials.find(m => m.id === materialId) || pricingMatrix.tags.materials[0];
      let perUnit = mat.baseRate;
      result.addons.push({ name: mat.name, rate: mat.baseRate, total: mat.baseRate * count });

      if (stringTie) {
        perUnit += mat.stringUnit;
        result.addons.push({ name: 'String for tie with hole punch', rate: mat.stringUnit, total: mat.stringUnit * count });
      }

      if (perforation) {
        perUnit += mat.perforationUnit;
        result.addons.push({ name: 'Perforation Line', rate: mat.perforationUnit, total: mat.perforationUnit * count });
      }

      result.unitPrice = Number(perUnit.toFixed(2));
      result.subtotal = Number((perUnit * count).toFixed(2));
      break;
    }

    // 15. STAMPS
    case 'stamps': {
      const { stampType = 'basic_nylon_rect_1line', qty = 1 } = params;
      const count = Math.max(1, Number(qty));
      result.quantity = count;

      const item = pricingMatrix.stamps.types[stampType] || pricingMatrix.stamps.types['basic_nylon_rect_1line'];
      result.unitPrice = item.price;
      result.subtotal = item.price * count;
      result.addons.push({ name: item.name, rate: item.price, total: result.subtotal });
      break;
    }

    // 16. WALL CALENDARS
    case 'wallCalendars': {
      const { calendarType = 'regular_130gsm', qty = 1000 } = params;
      const count = Number(qty);
      result.quantity = count;

      const item = pricingMatrix.wallCalendars.types[calendarType] || pricingMatrix.wallCalendars.types['regular_130gsm'];
      const rate = item.rates[count] || Object.values(item.rates)[0];
      result.unitPrice = rate;
      result.subtotal = Number((rate * count).toFixed(2));
      result.addons.push({ name: item.name, rate, total: result.subtotal });
      break;
    }

    default:
      throw new Error(`Unsupported product category: ${category}`);
  }

  // Calculate GST & Final Total
  result.totalAddonCost = result.addons.reduce((sum, a) => sum + (a.total || 0), 0);
  result.gstAmount = Number((result.subtotal * (result.gstPercentage / 100)).toFixed(2));
  result.finalTotal = Number((result.subtotal + result.gstAmount).toFixed(2));

  return result;
}

module.exports = {
  calculateProductPrice,
  pricingMatrix,
  normalizeCategory
};
