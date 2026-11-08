/**
 * K2 Sign - Centralized Product & Pricing Matrix
 * Source: Client specifications extracted from official Google Sheets & PDF rate slots
 */

const pricingMatrix = {
  // 1. Visiting Cards (Fixed Qty: 1000)
  visitingCards: {
    name: "Visiting Cards",
    fixedQty: 1000,
    materials: [
      { id: "art_card_250", name: "Art Card 250gsm", baseRate1Side: 0.60, side2Addon: 0.30, glossFront: 0.10, glossBack: 0.05, uvFront: 0, uvBack: 0 },
      { id: "art_card_350", name: "Art Card 350gsm (Matt)", baseRate1Side: 0.90, side2Addon: 0.30, glossFront: 0, glossBack: 0, uvFront: 0.20, uvBack: 0.15, supportsSpotUV: true },
      { id: "non_tearable", name: "Non-Tearable", baseRate1Side: 0.95, side2Addon: 0.30, glossFront: 0, glossBack: 0, uvFront: 0.20, uvBack: 0.15, supportsSpotUV: true },
      { id: "ivory_matt", name: "IVORY (Matt Lamination)", baseRate1Side: 1.15, side2Addon: 0.30, glossFront: 0, glossBack: 0, uvFront: 0.20, uvBack: 0.15, supportsSpotUV: true },
      { id: "ivory_velvet", name: "IVORY (Velvet Lamination)", baseRate1Side: 1.60, side2Addon: 0.30, glossFront: 0, glossBack: 0, uvFront: 0.20, uvBack: 0.15, supportsSpotUV: true },
      { id: "fine_handmade", name: "Fine Handmade Matt", baseRate1Side: 1.90, side2Addon: 0.30, glossFront: 0, glossBack: 0, uvFront: 0, uvBack: 0 }
    ]
  },

  // 2. Digital Prints (12x18 & A4)
  digitalPrints: {
    name: "Digital Prints",
    sizes: {
      "12x18": {
        name: "12 x 18",
        slabs: [
          { min: 1, max: 15, paper250: 40, paperTexture: 80, laminationTotal: 400 },
          { min: 16, max: 20, paper250: 30, paperTexture: 70, laminationTotal: 400 },
          { min: 21, max: 50, paper250: 25, paperTexture: 55, laminationTotal: 400 },
          { min: 51, max: 100, paper250: 18, paperTexture: 45, laminationTotal: 600 },
          { min: 101, max: 300, paper250: 15, paperTexture: 40, laminationTotal: 900 },
          { min: 301, max: 500, paper250: 15, paperTexture: 40, laminationTotal: 1200 },
          { min: 501, max: 1000, paper250: 15, paperTexture: 40, laminationTotal: 2400 }
        ]
      },
      "A4": {
        name: "A4",
        slabs: [
          { min: 1, max: 5, paper250: 25, paperTexture: 55, laminationTotal: 400 },
          { min: 6, max: 20, paper250: 20, paperTexture: 40, laminationTotal: 400 },
          { min: 21, max: 50, paper250: 15, paperTexture: 35, laminationTotal: 400 },
          { min: 51, max: 100, paper250: 12, paperTexture: 30, laminationTotal: 600 },
          { min: 101, max: 300, paper250: 12, paperTexture: 25, laminationTotal: 900 },
          { min: 301, max: 500, paper250: 12, paperTexture: 25, laminationTotal: 1200 },
          { min: 501, max: 1000, paper250: 12, paperTexture: 25, laminationTotal: 2400 }
        ]
      }
    }
  },

  // 3. Wedding Cards (Multicolour 2-Side)
  weddingCards: {
    name: "Wedding Cards",
    sizes: {
      "10x15": {
        paper: "210 gsm art",
        slabs: [
          { qty: 500, rate: 10.60, laminationUnit: 1.20, envelopeUnit: 0 },
          { qty: 700, rate: 8.29, laminationUnit: 0.71, envelopeUnit: 0 },
          { qty: 1000, rate: 6.20, laminationUnit: 0.80, envelopeUnit: 3.00 }
        ]
      },
      "11.5x18": {
        paper: "250 gsm art",
        slabs: [
          { qty: 500, rate: 13.40, laminationUnit: 0.60, envelopeUnit: 0 },
          { qty: 700, rate: 10.00, laminationUnit: 0.71, envelopeUnit: 0 },
          { qty: 1000, rate: 7.50, laminationUnit: 1.00, envelopeUnit: 6.00 },
          { qty: 2000, rate: 7.00, laminationUnit: 1.00, envelopeUnit: 4.00 }
        ]
      },
      "12.5x18": {
        paper: "250 gsm art",
        slabs: [
          { qty: 500, rate: 14.00, laminationUnit: 1.00, envelopeUnit: 0 },
          { qty: 700, rate: 10.71, laminationUnit: 1.00, envelopeUnit: 0 },
          { qty: 1000, rate: 8.50, laminationUnit: 1.00, envelopeUnit: 5.50 },
          { qty: 2000, rate: 7.75, laminationUnit: 0.75, envelopeUnit: 4.00 }
        ]
      },
      "15x20": {
        paper: "250 gsm art",
        slabs: [
          { qty: 1000, rate: 11.50, laminationUnit: 1.50, envelopeUnit: 7.00 },
          { qty: 2000, rate: 10.00, laminationUnit: 1.00, envelopeUnit: 7.50 }
        ]
      }
    }
  },

  // 4. Bill Books (One Colour & Multi Colour)
  billBooks: {
    name: "Bill Books",
    types: {
      "1_16_wnp_100pg": { name: "1/16, W+NP, 1 Colour, 1+1, Cover (100pg)", rates: { 12: 92, 24: 80, 52: 72 } },
      "1_16_wpy_50pg": { name: "1/16, W+P+Y, 1 Colour, 1+2, Cover (50pg)", rates: { 12: 85, 24: 73, 52: 65 } },
      "1_8_wnp_100pg": { name: "1/8, W+NP, 1 Colour, 1+1, Cover (100pg)", rates: { 6: 165, 10: 125, 20: 110, 50: 96 } },
      "1_8_wpy_50pg": { name: "1/8, W+P+Y, 1 Colour, 1+2, Cover (50pg)", rates: { 6: 160, 10: 120, 20: 100, 50: 90 } },
      "1_8_wnp_double_100pg": { name: "1/8, W+NP, 1 Colour, 1+1, Double (100pg)", rates: { 6: 175, 10: 135, 20: 120, 50: 106 } },
      "1_8_wpy_double_50pg": { name: "1/8, W+P+Y, 1 Colour, 1+2, Double (50pg)", rates: { 6: 170, 10: 130, 20: 110, 50: 100 } },
      "1_6_wnp_cover_100pg": { name: "1/6, W+NP, 1 Colour, 1+1/1+2, Cover (100pg)", rates: { 5: 280, 10: 210, 20: 185, 50: 130 } },
      "1_6_wnp_double_100pg": { name: "1/6, W+NP, 1 Colour, 1+1/1+2, Double (100pg)", rates: { 5: 295, 10: 225, 20: 200, 50: 145 } },
      "1_5_wnp_cover_100pg": { name: "1/5, W+NP, 1 Colour, 1+1/1+2, Cover (100pg)", rates: { 5: 320, 10: 230, 20: 205, 50: 150 } },
      "1_5_wnp_double_100pg": { name: "1/5, W+NP, 1 Colour, 1+1/1+2, Double (100pg)", rates: { 5: 335, 10: 240, 20: 215, 50: 160 } },
      "1_4_wnp_cover_100pg": { name: "1/4, W+NP, 1 Colour, 1+1/1+2, Cover (100pg)", rates: { 5: 350, 10: 250, 20: 220, 50: 165 } },
      "1_4_wnp_double_100pg": { name: "1/4, W+NP, 1 Colour, 1+1/1+2, Double (100pg)", rates: { 5: 370, 10: 270, 20: 240, 50: 185 } },
      // Multicolour
      "1_8_multicolour_double_100pg": { name: "1/8, W+NP, 4 Colour, 1+1, Double (100pg)", rates: { 10: 390 } },
      "1_4_multicolour_double_100pg": { name: "1/4, W+NP, 4 Colour, 1+1/1+2, Double (100pg)", rates: { 5: 780, 10: 550 } }
    }
  },

  // 5. Pavati Books (Receipt / Voucher Books)
  pavatiBooks: {
    name: "Pavati Books",
    types: {
      "multicolour_50pg": { name: "Multi Colour - 50 Pages", rates: { 2: 425, 4: 363, 6: 333, 10: 230 } },
      "multicolour_100pg": { name: "Multi Colour - 100 Pages", rates: { 10: 280, 20: 175, 50: 98 } },
      "onecolour_100pg": { name: "One Colour - 100 Pages", rates: { 10: 120, 20: 95, 50: 66 } }
    }
  },

  // 6. Brochures & Booklets
  brochuresBooklets: {
    name: "Brochures & Booklets",
    brochures: {
      "A5_300gsm": { name: "A5 Brochure - 300 gsm", rates: { 500: 9.54, 1000: 6.34, 2000: 5.41, 4000: 4.60 }, laminationUnit: { 500: 1.00, 1000: 0.80, 2000: 0.70, 4000: 0.63 } },
      "A5_250gsm": { name: "A5 Brochure - 250 gsm", rates: { 500: 8.57, 1000: 5.66, 2000: 4.77, 4000: 3.92 }, laminationUnit: { 500: 1.00, 1000: 0.80, 2000: 0.70, 4000: 0.63 } },
      "A4_300gsm": { name: "A4 Brochure - 300 gsm", rates: { 500: 15.74, 1000: 11.53, 2000: 9.83, 4000: 8.30 }, laminationUnit: { 500: 2.00, 1000: 1.50, 2000: 1.25, 4000: 1.13 } },
      "A4_250gsm": { name: "A4 Brochure - 250 gsm", rates: { 500: 11.32, 1000: 8.21, 2000: 7.32, 4000: 6.60 }, laminationUnit: { 500: 2.00, 1000: 1.50, 2000: 1.25, 4000: 1.13 } }
    },
    booklets: {
      "A5_4side_250gsm": { name: "A5 Booklet - 4 Pages (250gsm Inner)", rates: { 500: 10.95, 1000: 7.70, 2000: 6.72, 4000: 5.41 } },
      "A5_4side_170gsm": { name: "A5 Booklet - 4 Pages (170gsm Inner)", rates: { 500: 10.47, 1000: 7.19, 2000: 6.26, 4000: 4.98 } },
      "A5_8side_170gsm": { name: "A5 Booklet - 8 Pages (170gsm Inner)", rates: { 500: 15.74, 1000: 11.02, 2000: 9.40, 4000: 7.45 } },
      "A5_12side_170gsm": { name: "A5 Booklet - 12 Pages (170gsm Inner)", rates: { 500: 25.09, 1000: 17.14, 2000: 13.23, 4000: 10.63 } },
      "A4_4side_250gsm": { name: "A4 Booklet - 4 Pages (250gsm Inner)", rates: { 500: 12.06, 1000: 8.53, 2000: 8.18, 4000: 7.13 } },
      "A4_4side_170gsm": { name: "A4 Booklet - 4 Pages (170gsm Inner)", rates: { 500: 15.57, 1000: 11.53, 2000: 9.40, 4000: 7.87 } },
      "A4_8side_170gsm": { name: "A4 Booklet - 8 Pages (170gsm Inner)", rates: { 500: 27.64, 1000: 20.11, 2000: 16.80, 4000: 14.33 } }
    }
  },
  brochures: {
    name: "Brochures",
    items: {
      "A5_300gsm": { name: "A5 Brochure - 300 gsm", rates: { 500: 9.54, 1000: 6.34, 2000: 5.41, 4000: 4.60 }, laminationUnit: { 500: 1.00, 1000: 0.80, 2000: 0.70, 4000: 0.63 } },
      "A5_250gsm": { name: "A5 Brochure - 250 gsm", rates: { 500: 8.57, 1000: 5.66, 2000: 4.77, 4000: 3.92 }, laminationUnit: { 500: 1.00, 1000: 0.80, 2000: 0.70, 4000: 0.63 } },
      "A4_300gsm": { name: "A4 Brochure - 300 gsm", rates: { 500: 15.74, 1000: 11.53, 2000: 9.83, 4000: 8.30 }, laminationUnit: { 500: 2.00, 1000: 1.50, 2000: 1.25, 4000: 1.13 } },
      "A4_250gsm": { name: "A4 Brochure - 250 gsm", rates: { 500: 11.32, 1000: 8.21, 2000: 7.32, 4000: 6.60 }, laminationUnit: { 500: 2.00, 1000: 1.50, 2000: 1.25, 4000: 1.13 } }
    }
  },
  booklets: {
    name: "Booklets",
    items: {
      "A5_4side_250gsm": { name: "A5 Booklet - 4 Pages (250gsm Inner)", rates: { 500: 10.95, 1000: 7.70, 2000: 6.72, 4000: 5.41 } },
      "A5_4side_170gsm": { name: "A5 Booklet - 4 Pages (170gsm Inner)", rates: { 500: 10.47, 1000: 7.19, 2000: 6.26, 4000: 4.98 } },
      "A5_8side_170gsm": { name: "A5 Booklet - 8 Pages (170gsm Inner)", rates: { 500: 15.74, 1000: 11.02, 2000: 9.40, 4000: 7.45 } },
      "A5_12side_170gsm": { name: "A5 Booklet - 12 Pages (170gsm Inner)", rates: { 500: 25.09, 1000: 17.14, 2000: 13.23, 4000: 10.63 } },
      "A4_4side_250gsm": { name: "A4 Booklet - 4 Pages (250gsm Inner)", rates: { 500: 12.06, 1000: 8.53, 2000: 8.18, 4000: 7.13 } },
      "A4_4side_170gsm": { name: "A4 Booklet - 4 Pages (170gsm Inner)", rates: { 500: 15.57, 1000: 11.53, 2000: 9.40, 4000: 7.87 } },
      "A4_8side_170gsm": { name: "A4 Booklet - 8 Pages (170gsm Inner)", rates: { 500: 27.64, 1000: 20.11, 2000: 16.80, 4000: 14.33 } }
    }
  },

  // 7. Pamphlets / Flyers / Leaflets
  pamphlets: {
    name: "Pamphlets / Flyers",
    multicolour: {
      paper: "130 gsm Art Paper",
      sizes: {
        "A5": { rates1Side: { 1000: 3.00, 2000: 1.75, 4000: 1.40, 8000: 1.20 }, rates2Side: { 1000: 3.30, 2000: 2.00, 4000: 1.85, 8000: 1.40 } },
        "A4": { rates1Side: { 1000: 3.50, 2000: 2.75, 4000: 2.40, 8000: 1.80 }, rates2Side: { 1000: 4.00, 2000: 3.50, 4000: 2.75, 8000: 2.00 } },
        "A3_12x18": { rates1Side: { 500: 8.00, 1000: 5.60 }, rates2Side: { 500: 10.00, 1000: 6.80 } },
        "A2_18x23": { rates1Side: { 500: 13.40, 1000: 8.80 }, rates2Side: { 500: 19.00, 1000: 12.00 } },
        "7x10": { rates1Side: { 1000: 3.00, 2000: 2.25, 4000: 1.95, 8000: 1.50 }, rates2Side: { 1000: 4.00, 2000: 2.90, 4000: 2.40, 8000: 1.68 } },
        "10x15": { rates1Side: { 500: 7.90, 1000: 4.80, 2000: 3.90, 4000: 3.00, 8000: 2.37 }, rates2Side: { 500: 8.40, 1000: 5.00, 2000: 4.75, 4000: 3.25, 8000: 2.62 } },
        "15x20": { rates1Side: { 500: 11.00, 1000: 7.50, 2000: 6.00 }, rates2Side: { 500: 16.00, 1000: 11.00, 2000: 7.50 } },
        "20x30": { rates1Side: { 500: 19.00, 1000: 12.50 }, rates2Side: null }
      }
    },
    oneColour: {
      paper: "70 gsm White Paper",
      sizes: {
        "A5": { rates1Side: { 1000: 0.95, 2000: 0.72, 4000: 0.55, 8000: 0.46 }, rates2Side: { 1000: 1.10, 2000: 0.87, 4000: 0.70, 8000: 0.60 } },
        "A4": { rates1Side: { 1000: 1.50, 2000: 1.12, 4000: 1.00, 8000: 0.81 }, rates2Side: { 1000: 1.75, 2000: 1.25, 4000: 1.25, 8000: 0.93 } },
        "A3_12x18": { rates1Side: { 500: 3.70, 1000: 2.75, 2000: 2.40 }, rates2Side: { 500: 5.00, 1000: 3.65, 2000: 2.60 } },
        "A2_18x23": { rates1Side: { 300: 7.30, 500: 5.00, 1000: 4.00, 2000: 3.90 }, rates2Side: null },
        "15x20": { rates1Side: { 500: 4.60, 1000: 3.65, 2000: 3.25 }, rates2Side: null }
      }
    }
  },

  // 8. Envelopes
  envelopes: {
    name: "Envelopes",
    categories: {
      "multi_100gsm_bond": {
        name: "Multicolour - 100gsm Bond / Sunshine",
        sizes: {
          "9x4": { 500: 6.40, 1000: 3.80, 2000: 2.65 },
          "7x5": { 500: 6.40, 1000: 3.80, 2000: 2.65 },
          "6x9": { 500: 7.08, 1000: 4.25, 2000: 2.93 },
          "A4": { 500: 10.40, 1000: 6.70, 2000: 5.05 }
        }
      },
      "one_colour_100gsm_bond": {
        name: "One Colour - 100gsm Bond / Sunshine",
        sizes: {
          "9x4": { 500: 3.60, 1000: 2.13, 2000: 1.68 },
          "7x5": { 500: 3.70, 1000: 2.25, 2000: 1.85 },
          "6x9": { 500: 3.80, 1000: 2.35, 2000: 1.98 },
          "A4": { 500: 6.60, 1000: 4.50, 2000: 3.93 }
        }
      },
      "one_colour_70gsm_maplitho": {
        name: "One Colour - 70gsm Maplitho",
        sizes: {
          "6x4": { 100: 6.00, 200: 4.00, 300: 3.33, 500: 3.00, 1000: 1.80 }
        }
      },
      "multi_130gsm_art": {
        name: "Multicolour - 130gsm Art Paper",
        sizes: {
          "9x4": { 500: 6.50, 1000: 3.90, 2000: 2.73 },
          "7x5": { 500: 6.50, 1000: 3.90, 2000: 2.73 },
          "6x9": { 500: 7.50, 1000: 4.95, 2000: 3.60 },
          "A4": { 500: 11.60, 1000: 7.80, 2000: 6.20 }
        }
      }
    }
  },

  // 9. Files & Folders
  filesFolders: {
    name: "Files & Folders",
    types: {
      "paper_250gsm": {
        name: "Paper Files (250 gsm)",
        rates: {
          1000: { base: 10.17, gloss: 2.50, innerMulti: 4.00 },
          2000: { base: 8.58, gloss: 2.50, innerMulti: 3.00 },
          3000: { base: 8.04, gloss: 2.50, innerMulti: 2.50 },
          4000: { base: 7.79, gloss: 2.50, innerMulti: 2.50 },
          5000: { base: 7.62, gloss: 2.50, innerMulti: 2.50 }
        }
      },
      "premium_board_320gsm": {
        name: "Premium Board Files (320 gsm)",
        rates: {
          250: { base: 26.69, gloss: 2.50, matt: 2.50, spotUV: 4.50, innerGrey: 3.50 },
          500: { base: 18.19, gloss: 2.50, matt: 2.50, spotUV: 4.50, innerGrey: 2.00 },
          1000: { base: 13.05, gloss: 2.50, matt: 2.50, spotUV: 4.50, innerGrey: 0.80 },
          2000: { base: 12.83, gloss: 2.50, matt: 2.50, spotUV: 4.50, innerGrey: 0.80 },
          3000: { base: 12.60, gloss: 2.50, matt: 2.50, spotUV: 4.50, innerGrey: 0.80 },
          4000: { base: 12.38, gloss: 2.50, matt: 2.50, spotUV: 4.50, innerGrey: 0.80 },
          5000: { base: 12.15, gloss: 2.50, matt: 2.50, spotUV: 4.50, innerGrey: 0.80 }
        }
      },
      "plastic_pp_03mm": {
        name: "Plastic Files (PP 0.3mm Plastic)",
        rates: {
          250: { base: 38.25, gloss: 2.50, innerGrey: 3.50 },
          500: { base: 26.35, gloss: 2.50, innerGrey: 2.00 },
          1000: { base: 20.25, gloss: 2.50, innerGrey: 0.80 },
          2000: { base: 19.50, gloss: 2.50, innerGrey: 0.80 },
          3000: { base: 19.13, gloss: 2.50, innerGrey: 0.80 },
          4000: { base: 18.75, gloss: 2.50, innerGrey: 0.80 },
          5000: { base: 18.00, gloss: 2.50, innerGrey: 0.80 }
        }
      }
    }
  },

  // 10. Invitation Cards (250gsm Multicolour)
  invitationCards: {
    name: "Invitation Cards",
    paper: "250 gsm Multicolour",
    sizes: {
      "6x4": {
        rates1Side: { 100: 4.50, 200: 3.30, 300: 3.20, 500: 2.40, 1000: 2.15 },
        laminationTotal: { 100: 400, 200: 400, 300: 400, 500: 400, 1000: 600, 2000: 900 }
      },
      "7x5": {
        rates1Side: { 100: 5.80, 200: 5.25, 300: 4.83, 500: 4.30, 1000: 3.20, 2000: 2.10 },
        laminationTotal: { 100: 400, 200: 400, 300: 400, 500: 600, 1000: 900, 2000: 1200 }
      },
      "6x9": {
        rates1Side: { 100: 7.50, 200: 6.25, 300: 6.00, 500: 4.60, 1000: 3.60, 2000: 2.40 },
        laminationTotal: { 100: 400, 200: 400, 300: 400, 500: 600, 1000: 900, 2000: 1200 }
      }
    }
  },

  // 11. Letterheads
  letterheads: {
    name: "Letterheads",
    paper: "100 gsm Bond / Maplitho",
    size: "A4",
    rates: {
      100: { ratePerUnit: 9.80, binding100Total: 50, binding50Total: 100 },
      200: { ratePerUnit: 9.50, binding100Total: 50, binding50Total: 100 },
      300: { ratePerUnit: 8.67, binding100Total: 50, binding50Total: 100 },
      500: { ratePerUnit: 5.60, binding100Total: 50, binding50Total: 100 },
      1000: { ratePerUnit: 3.40, binding100Total: 100, binding50Total: 200 },
      2000: { ratePerUnit: 2.25, binding100Total: 200, binding50Total: 400 },
      4000: { ratePerUnit: 2.00, binding100Total: 400, binding50Total: 800 },
      8000: { ratePerUnit: 1.63, binding100Total: 800, binding50Total: 1600 },
      10000: { ratePerUnit: 1.50, binding100Total: 1000, binding50Total: 2000 }
    }
  },

  // 12. Paper Bags (20 Sizes: PB-1 to PB-20)
  paperBags: {
    name: "Paper Bags",
    sizes: {
      "PB-1": { dimensions: "8.25 x 13.75 x 2.5", mattAddon: 2, spotUVAddon: 4.5, foilAddon: 18, rates: { 100: 86.45, 250: 46.75, 500: 36.55, 1000: 27.75, 2000: 26.25, 3000: 25.50, 4000: 24.75, 5000: 24.00 } },
      "PB-2": { dimensions: "7.75 x 13.5 x 3", mattAddon: 2, spotUVAddon: 4.5, foilAddon: 18, rates: { 100: 86.45, 250: 46.75, 500: 36.55, 1000: 27.75, 2000: 26.25, 3000: 25.50, 4000: 24.75, 5000: 24.00 } },
      "PB-3": { dimensions: "8.25 x 5.5 x 2.5", mattAddon: 1, spotUVAddon: 4, foilAddon: 10, rates: { 100: 43.23, 250: 23.38, 500: 18.28, 1000: 13.88, 2000: 13.13, 3000: 12.75, 4000: 12.38, 5000: 12.00 } },
      "PB-4": { dimensions: "7.75 x 5 x 3", mattAddon: 1, spotUVAddon: 4, foilAddon: 10, rates: { 100: 43.23, 250: 23.38, 500: 18.28, 1000: 13.88, 2000: 13.13, 3000: 12.75, 4000: 12.38, 5000: 12.00 } },
      "PB-5": { dimensions: "11.25 x 16.25 x 3", mattAddon: 3, spotUVAddon: 7.5, foilAddon: 25, rates: { 100: 93.10, 250: 53.55, 500: 43.35, 1000: 33.75, 2000: 32.25, 3000: 31.50, 4000: 30.75, 5000: 30.00 } },
      "PB-6": { dimensions: "10.25 x 15.75 x 4", mattAddon: 3, spotUVAddon: 7.5, foilAddon: 25, rates: { 100: 93.10, 250: 53.55, 500: 43.35, 1000: 33.75, 2000: 32.25, 3000: 31.50, 4000: 30.75, 5000: 30.00 } },
      "PB-7": { dimensions: "9.25 x 14.75 x 5", mattAddon: 3, spotUVAddon: 7.5, foilAddon: 25, rates: { 100: 93.10, 250: 53.55, 500: 43.35, 1000: 33.75, 2000: 32.25, 3000: 31.50, 4000: 30.75, 5000: 30.00 } },
      "PB-8": { dimensions: "8.25 x 13.75 x 6", mattAddon: 3, spotUVAddon: 7.5, foilAddon: 25, rates: { 100: 93.10, 250: 53.55, 500: 43.35, 1000: 33.75, 2000: 32.25, 3000: 31.50, 4000: 30.75, 5000: 30.00 } },
      "PB-9": { dimensions: "11.75 x 7.25 x 2.5", mattAddon: 2, spotUVAddon: 5, foilAddon: 13, rates: { 100: 46.55, 250: 26.78, 500: 21.68, 1000: 16.88, 2000: 16.13, 3000: 15.75, 4000: 15.38, 5000: 15.00 } },
      "PB-10": { dimensions: "11.25 x 6.5 x 3", mattAddon: 2, spotUVAddon: 5, foilAddon: 13, rates: { 100: 46.55, 250: 26.78, 500: 21.68, 1000: 16.88, 2000: 16.13, 3000: 15.75, 4000: 15.38, 5000: 15.00 } },
      "PB-11": { dimensions: "10.25 x 6 x 4", mattAddon: 2, spotUVAddon: 5, foilAddon: 13, rates: { 100: 46.55, 250: 26.78, 500: 21.68, 1000: 16.88, 2000: 16.13, 3000: 15.75, 4000: 15.38, 5000: 15.00 } },
      "PB-12": { dimensions: "9.25 x 5 x 5", mattAddon: 2, spotUVAddon: 5, foilAddon: 13, rates: { 100: 46.55, 250: 26.78, 500: 21.68, 1000: 16.88, 2000: 16.13, 3000: 15.75, 4000: 15.38, 5000: 15.00 } },
      "PB-13": { dimensions: "13 x 7.75 x 3", mattAddon: 2, spotUVAddon: 5, foilAddon: 18, rates: { 100: 88.35, 250: 48.45, 500: 38.25, 1000: 29.25, 2000: 27.75, 3000: 27.00, 4000: 26.25, 5000: 25.50 } },
      "PB-14": { dimensions: "13.5 x 8.25 x 2.25", mattAddon: 2, spotUVAddon: 5, foilAddon: 18, rates: { 100: 88.35, 250: 48.45, 500: 38.25, 1000: 29.25, 2000: 27.75, 3000: 27.00, 4000: 26.25, 5000: 25.50 } },
      "PB-15": { dimensions: "12 x 7.25 x 4", mattAddon: 2, spotUVAddon: 5, foilAddon: 18, rates: { 100: 88.35, 250: 48.45, 500: 38.25, 1000: 29.25, 2000: 27.75, 3000: 27.00, 4000: 26.25, 5000: 25.50 } },
      "PB-16": { dimensions: "11 x 6.25 x 5", mattAddon: 2, spotUVAddon: 5, foilAddon: 18, rates: { 100: 88.35, 250: 48.45, 500: 38.25, 1000: 29.25, 2000: 27.75, 3000: 27.00, 4000: 26.25, 5000: 25.50 } },
      "PB-17": { dimensions: "16 x 11 x 3", mattAddon: 3, spotUVAddon: 7.5, foilAddon: 25, rates: { 100: 95.00, 250: 55.25, 500: 45.05, 1000: 35.25, 2000: 33.75, 3000: 33.00, 4000: 32.25, 5000: 31.50 } },
      "PB-18": { dimensions: "15 x 10.5 x 4", mattAddon: 3, spotUVAddon: 7.5, foilAddon: 25, rates: { 100: 95.00, 250: 55.25, 500: 45.05, 1000: 35.25, 2000: 33.75, 3000: 33.00, 4000: 32.25, 5000: 31.50 } },
      "PB-19": { dimensions: "14 x 9.5 x 5", mattAddon: 3, spotUVAddon: 7.5, foilAddon: 25, rates: { 100: 95.00, 250: 55.25, 500: 45.05, 1000: 35.25, 2000: 33.75, 3000: 33.00, 4000: 32.25, 5000: 31.50 } },
      "PB-20": { dimensions: "13 x 8.5 x 6", mattAddon: 3, spotUVAddon: 7.5, foilAddon: 25, rates: { 100: 95.00, 250: 55.25, 500: 45.05, 1000: 35.25, 2000: 33.75, 3000: 33.00, 4000: 32.25, 5000: 31.50 } }
    }
  },

  // 13. Stickers & Labels
  stickersLabels: {
    name: "Stickers & Labels",
    types: {
      "49x41mm": {
        name: "49 x 41 mm Sticker",
        rates: { 48: 4.06, 96: 2.50, 144: 1.98, 192: 1.72, 288: 1.46, 384: 1.33, 576: 1.35, 768: 1.25, 960: 1.19 },
        laminationTotal: 200
      },
      "vcard_size": {
        name: "Visiting Card Size (94 x 54 mm)",
        rates: { 24: 8.13, 48: 5.00, 96: 3.44, 144: 2.92, 216: 2.57, 312: 2.64, 408: 2.46, 504: 2.35, 888: 2.15, 1296: 2.06 },
        laminationTotal: 200
      },
      "4x3_inch": {
        name: "4 x 3 inch (3.8 x 2.8 in)",
        rates: { 12: 16.25, 24: 10.00, 48: 6.88, 96: 5.31, 144: 4.79, 216: 4.86, 360: 4.42, 552: 3.49, 828: 2.96, 1104: 2.64 },
        laminationTotal: { default: 200, 828: 350, 1104: 350 }
      },
      "5.8x3.8_inch": {
        name: "5.8 x 3.8 inch",
        rates: { 6: 32.50, 12: 20.00, 24: 13.75, 48: 10.63, 96: 10.00, 144: 9.17, 282: 8.35, 426: 6.72, 564: 5.28, 846: 5.19, 1128: 5.14 },
        laminationTotal: { default: 200, 564: 350, 846: 350, 1128: 350 }
      },
      "A5": {
        name: "A5 (8.6 x 5.6 inch)",
        rates: { 4: 48.75, 8: 30.00, 12: 23.75, 24: 17.50, 48: 14.38, 96: 13.75, 192: 12.50, 384: 7.92, 576: 7.78, 768: 7.00, 1000: 5.20, 2000: 3.70, 4000: 2.80 },
        laminationTotal: { 4: 200, 8: 200, 12: 200, 24: 200, 48: 200, 96: 200, 192: 200, 384: 200, 576: 500, 768: 500, 1000: 1000, 2000: 1400, 4000: 2000 }
      },
      "A4_custom": {
        name: "A4 Sticker (8.2 x 11.6 inch)",
        slabs: [
          { min: 1, max: 5, rate: 40.0, laminationTotal: 200 },
          { min: 6, max: 20, rate: 30.0, laminationTotal: 200 },
          { min: 21, max: 50, rate: 25.0, laminationTotal: 400 },
          { min: 51, max: 100, rate: 20.0, laminationTotal: 600 },
          { min: 101, max: 300, rate: 15.0, laminationTotal: 1000 },
          { min: 301, max: 999, rate: 10.4, laminationTotal: 1000 },
          { min: 1000, max: 1500, rate: 7.4, laminationTotal: 1400 },
          { min: 1501, max: 2000, rate: 5.6, laminationTotal: 2000 }
        ]
      },
      "A3_custom": {
        name: "A3 Sticker (12 x 18 inch)",
        slabs: [
          { min: 1, max: 5, rate: 80.0, laminationTotal: 200 },
          { min: 6, max: 20, rate: 70.0, laminationTotal: 200 },
          { min: 21, max: 50, rate: 40.0, laminationTotal: 400 },
          { min: 51, max: 299, rate: 30.0, laminationTotal: 1000 },
          { min: 300, max: 499, rate: 18.33, laminationTotal: 1000 },
          { min: 500, max: 999, rate: 14.8, laminationTotal: 1400 },
          { min: 1000, max: 1000, rate: 11.2, laminationTotal: 2000 }
        ]
      }
    }
  },

  // 14. Tags (Fixed Qty: 1000)
  tags: {
    name: "Tags",
    fixedQty: 1000,
    materials: [
      { id: "art_250_f_no_lam", name: "Art Card 250gsm - 1 Side No Lamg", baseRate: 0.60, stringUnit: 1.00, perforationUnit: 0.05 },
      { id: "art_250_fb_no_lam", name: "Art Card 250gsm - 2 Side No Lamg", baseRate: 0.90, stringUnit: 1.00, perforationUnit: 0.05 },
      { id: "art_250_f_gloss", name: "Art Card 250gsm - 1 Side Gloss Lamg", baseRate: 0.70, stringUnit: 1.00, perforationUnit: 0.05 },
      { id: "art_250_fb_gloss", name: "Art Card 250gsm - 2 Side Gloss Lamg", baseRate: 1.05, stringUnit: 1.00, perforationUnit: 0.05 },
      { id: "art_350_f_spot_matt", name: "Art Card 350gsm - 1 Side Spot UV Matt Lamg", baseRate: 1.10, stringUnit: 1.00, perforationUnit: 0.05 },
      { id: "art_350_fb_spot_matt", name: "Art Card 350gsm - 2 Side Spot UV Matt Lamg", baseRate: 1.55, stringUnit: 1.00, perforationUnit: 0.05 },
      { id: "art_350_f_matt", name: "Art Card 350gsm - 1 Side Matt Lamg", baseRate: 0.90, stringUnit: 1.00, perforationUnit: 0.05 },
      { id: "art_350_fb_matt", name: "Art Card 350gsm - 2 Side Matt Lamg", baseRate: 1.20, stringUnit: 1.00, perforationUnit: 0.05 }
    ]
  },

  // 15. Stamps
  stamps: {
    name: "Rubber & Self-Ink Stamps",
    types: {
      "basic_nylon_rect_1line": { name: "Basic Nylon Stamp - Rectangular (1 Line)", price: 90 },
      "basic_nylon_rect_2line": { name: "Basic Nylon Stamp - Rectangular (2 Lines)", price: 100 },
      "basic_nylon_rect_3line": { name: "Basic Nylon Stamp - Rectangular (3 Lines)", price: 120 },
      "basic_nylon_rect_4line": { name: "Basic Nylon Stamp - Rectangular (4 Lines)", price: 140 },
      "basic_nylon_round": { name: "Basic Nylon Stamp - Round or Oval Shape", price: 150 },
      "sun_stamp_rect": { name: "Sun Stamp - Rectangular or Oval Shape", price: 450 },
      "sun_stamp_round": { name: "Sun Stamp - Round or Square Shape", price: 400 },
      "dater_basic_self_ink": { name: "Dater Stamp - Basic Self Ink Date Stamp", price: 250 },
      "dater_premium_2col_small": { name: "Dater Stamp - Premium 2 Colour (Small)", price: 570 },
      "dater_premium_2col_big": { name: "Dater Stamp - Premium 2 Colour (Big)", price: 690 }
    }
  },

  // 16. Wall Calendars
  wallCalendars: {
    name: "Wall Calendars",
    types: {
      "regular_130gsm": { name: "Regular Size (11.5 x 18) - 130gsm Art Paper (Front/Back)", rates: { 1000: 38.20, 2000: 28.13, 4000: 22.22 } },
      "regular_80gsm": { name: "Regular Size (11.5 x 18) - 80gsm Maplitho (Front/Back)", rates: { 1000: 34.42, 2000: 24.28, 4000: 18.72 } },
      "small_130gsm": { name: "Small Size (10 x 15) - 130gsm Art Paper (Front/Back)", rates: { 1000: 32.60, 2000: 24.28, 4000: 19.77 } },
      "small_80gsm": { name: "Small Size (10 x 15) - 80gsm Maplitho (Front/Back)", rates: { 1000: 28.82, 2000: 20.43, 4000: 16.27 } }
    }
  }
};

module.exports = pricingMatrix;
