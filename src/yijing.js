

//#region bagua operators
export function bagua_flip(value = 0) {
  value = value | 0;
  return (value & 1) << 2 + (value & 2) + (value & 4) >> 2;
}
export function bagua_invert(value = 0) {
  value = value | 0;
  return ((value & 7) ^ 7) & 7;
}
export function bagua_lineCount(value = 0) {
  value = value | 0;
  return ((value & 1)
    + ((value >> 1) & 1)
    + ((value >> 2) & 1))|0;
}
export function bagua_isAbstract(value = 0) {
  value = value | 0;
  return value === 0 || value === 7 || value === 5 || value === 2;
}

export function bagua_toSixiang(value = 0) {
  value = value | 0;
  return (value >> 1) & 3;
}
export function bagua_fromSixiang(value = 0) {
  value = value | 0;
  value &= 3;
  return (value === 3 ? 7 : (value === 2 ? 5 : (value === 1 ? 2 : 0)))|0;
}
//#endregion

//#region yijing.sixiang functions 
// get top sixiang from hexagram
export function yijing_blue(value = 0) {
  value = value | 0;
  return (value & 3) | 0;
}

// get middle sixiang from hexagram
export function yijing_white(value = 0) {
  value = value | 0;
  return ((value >> 2) & 3) | 0;
}

// get bottom sixiang from hexagram
export function yijing_red(value = 0) {
  value = value | 0;
  return ((value >> 4) & 3) | 0; 
}

export function yijing_toSixiang(value = 0) {
  return yijing_root(value) & 3;
}
export function yijing_fromSixiang(value = 0) {
  switch(value) { 
     case 0: return 0; 
     case 1: return 21; 
     case 2: return 42;
     case 3: return 63;
  }
}

//#endregion

//#region yijing.bagua functions

// get upper trigram
export function yijing_upper(value = 0) {
  value = value | 0;
  return value & 7;
}
// get lower trigram
export function yijing_lower(value = 0) {
  value = value | 0;
  return (value >> 3) & 7;
}

//#endregion

//#region yijing operators

// invert hexagram
export function yijing_invert(value = 0) {
  value = value | 0;
  return ((value ^ -1) & 63)|0;
}
  
// get center hexagram
export function yijing_center(value = 0) {
  value = value | 0;
  return ((value << 1) & 56 | (value >> 1) & 7)|0;
}

// get root trigram from hexagram
export function yijing_isRoot(value = 0) {
  value = value | 0;
  return (value === 0 || value === 63 || value === 21 || value === 42);
}
export function yijing_root(value = 0) {
  value = value | 0;
  while(!yijing_isroot(value)) {
    value = yijing_center(c);
  }
  return value | 0;
}
export function yijing_opposite(value = 0) {
  value = value | 0;
  const lower = yijing_upper(value);
  const upper = yijing_lower(value);
  return (upper << 3) | lower;
}
export function yijing_flip(value = 0) {
  value = value | 0;
  return (value & 1) << 5
    + (value & 2) << 3
    + (value & 4) << 1
    + (value & 8) >> 1
    + (value & 16) >> 3
    + (value & 32) >> 5;
}
export function yijing_lineCount(value = 0) {
  value = value | 0;
  return (value & 1)
    + ((value >> 1) & 1)
    + ((value >> 2) & 1)
    + ((value >> 3) & 1)
    + ((value >> 4) & 1)
    + ((value >> 5) & 1);
}

//#endregion

//#region yijing symmetry comparators

export function yijing_isCosmic(value = 0) {
  return yijing_isRoot(value);
}
export function yijing_isKarmic(value = 0) {
  return !yijing_isCosmic(value) && yijing_isCosmic(yijing_center(value));
}

export function yijing_isBalanced(value = 0) {
  return (yijing_lineCount(value) === 3);
}
export function yijing_isBreath(value = 0) {
  return yijing_center(value) === yijing_invert(value);
}
export function yijing_isMother(value = 0) {
  return yijing_isBalanced(value) && yijing_upper(value) === yijing_lower(yijing_invert(value));
}
export function yijing_isDirection(value = 0) {
  return yijing_isBalanced(value) && !yijing_isMother(value) && !yijing_isBreath(value);
}

export function yijing_isPrinciple(value = 0) {
  return yijing_lower(value) === yijing_upper(value);
}
export function yijing_isBeginning(value = 0) {
  return yijing_isPrinciple(value) && (yijing_upper(value) == 0 || yijing_upper(value) == 7);
}
export function yijing_isTitan(value = 0) {
  const c = yijing_lineCount(value) | 0;
  return (c === 1 || c === 5) ? true : false;
}
export function yijing_isGigante(value = 0) {
  return !yijing_isBalanced(value) && !yijing_isPrinciple(value) && !yijing_isTitan(value);
}


//#endregion

//#region yijing string operators
export function yijing_symmetryName(value) {
  if (yijing_isBreath(value)) return 'breath';
  if (yijing_isMother(value)) return 'mother';
  if (yijing_isDirection(value)) return 'direction';
  if (yijing_isBeginning(value)) return 'beginning';
  if (yijing_isPrinciple(value)) return 'principle';
  if (yijing_isTitan(value)) return 'titan'; 
  if (yijing_isGigante(value)) return 'gigante';
  throw new Error("value is out of range");
}
export function yijing_mantraName(value) {
  if (yijing_isCosmic(value)) return 'cosmic';
  if (yijing_isKarmic(value)) return 'karmic';
  return '';
}

export function yijing_operatorSymbol(dlower, dupper) {
  // TODO: this is lost in translation somewhere, we need to fix this!
  if (yijing_center(dlower) == dupper) 
    return 'C';
  else if (yijing_opposite(dlower) == dupper) 
    return 'O';
  else if (yijing_flip(dlower) == dupper) {
    if (yijing_lower(dlower) == yijing_upper(dlower))
      return 'S';
    else
      return 'M';
  }
  else if (yijing_invert(dlower) == dupper) {
    if (yijing_lower(dlower) == yijing_upper(dlower))
      return 'A';
    else
      return 'I';
  }
  else return '?';
}

export function yijing_symmetryGroups() {
  const dbb = new Array(); // balanced breath		- 1
  const dbm = new Array(); // balanced mothers		- 3
  const dbd = new Array(); // balanced directions	- 6
  const dub = new Array(); // unbalanced beginning	- 1
  const dup = new Array(); // unbalanced principle	- 3
  const dut = new Array(); // unbalanced titan		- 6
  const dug = new Array(); // unbalanced gigantes	- 12
  for (var i=0; i < 64; i++) {
    if (yijing_isBalanced(i)) {
      if (yijing_isBreath(i))
        dbb[dbb.length] = i;
      else if (yijing_isMother(i))
        dbm[dbm.length] = i;
      else
        dbd[dbd.length] = i; // direction
    }
    else { // unbalanced
      if (yijing_isBeginning(i))
        dub[dub.length] = i;
      else if (yijing_isPrinciple(i))
        dup[dup.length] = i;
      else if (yijing_isTitan(i))
        dut[dut.length] = i;
      else
        dug[dug.length] = i; // gigante
    }
  }
  return { dbb, dbm, dbd, dub, dup, dut, dug };
}
	
//#endregion

//#region yijing sequences

// REMEMBER: The root sequence is binary! (Early Heaven)

//
// KINGWEN
//

export function yijing_newFromSequence(src) {
  const len = 64; // src.length; // 64!
  const others = new Array(len);
  for (let i = 0; i < len; i++) {
    others[src[i]] = i;
  }
  return others;
}

export const yijing_toKingWenSequence = Array.freeze(Array.seal([ 
  2,	23,	8,	20,	16,	35,	45,	12,	// earth
  15,	52, 39,	53,	62, 56,	31,	33,	// mountain
  7,	4,	29, 59,	40,	64,	47, 6,	// water
  46,	18, 48,	57,	32,	50,	28,	44,	// wind
  24,	27,	3,	42,	51,	21,	17,	25,	// thunder
  36,	22,	63,	37,	55,	30,	49,	13,	// fire
  19,	41,	60,	61,	54,	38,	58,	10,	// lake
  11,	26,	5,	9,	34,	14,	43,	1,	// heaven
]));

export const yijing_fromKingWenSequence = Array.freeze(Array.seal(
  yijing_newFromSequence(yijing_toKingWenSequence)
));

export function yijing_toKingWen(value) {
  return yijing_toKingWenSequence[value & 63]
}
export function yijing_fromKingWen(value) {
  return yijing_fromKingWenSequence[value & 63];  
}

export const yijing_toKingWenHousesSequence = Array.freeze(Array.seal([
  2,24,19,11, 34,43,5,8,	// aarde
  52,22,26,41, 38,10,61,53, // berg
  29,60,3,63, 49,55,36,7, 	// water
  57,9,37,42, 25,21,27,18,	// wind
  51,16,40,32, 46,48,28,17, // donder
  30,56,50,64, 4,59,6,13,	// vuur
  58,47,45,31, 39,15,62,54,	// meer
  1,44,33,12, 20,23,35,14, 	// hemel
]));

///
/// GRAY
///

export function yijing_fromGray(/*unsigned short*/grayval) {
  let temp = grayval ^ (grayval >> 8) | 0;
  temp ^= temp >> 4;
  temp ^= temp >> 2;
  temp ^= temp >> 1;
  return temp;
}

export function yijing_toGray(binval) {
  binval = Math.abs(binval|0)|0;
  return ((binval >> 1) ^ binval) | 0;
}

export const yijing_toGraySequence = Array.freeze(Array.seal((function () {
  const gray = new Array(64);
  for (let i = 0; i < 64; ++i) {
    gray[i] = yijing_toGray(i);
  }
  return gray;
})(undefined)));

export const yijing_fromGraySequence = Array.freeze(Array.seal(
  yijing_newFromSequence(yijing_toGraySequence)
));

//#endregion

//#region translations
	
export const yijing_lang = {
  nl: {
    sixiang: [
      ["taiyin", { t: "Aarde", o: "-" }],
      ["shaoyin", { t: "Water", o: "=" }],
      ["shaoyang", { t: "Vuur", o: "|" }],
      ["taiyang", { t: "Lucht", o: "+" }],
    ],

    bagua: [
      ["earth", { t:"Aarde", l:"Het Ontvangende", a:"is toegewijd", f:"de moeder" }],
      ["mountain", { t:"Berg", l:"Het Stilhouden", a:"is stilhouden", f:"de jongste zoon" }],
      ["water", { t:"Water", l:"Het Onpeilbare", a:"is gevaar", f:"de middelste zoon" }],
      ["wind", { t:"Wind", l:"Het Zachtmoedige", a:"is indringen", f:"de oudste dochter" }],
      ["thunder", { t:"Donder", l:"Het Opwindende", a:"is beweging, is de schok", f:"de oudste zoon" }],
      ["fire", { t:"Vuur", l:"Het Zich-Hechtende", a:"is verhelderend", f:"de middelste dochter" }],
      ["lake", { t:"Meer", l:"Het Blijmoedige", a:"is vreugde", f:"de jongste dochter" }],
      ["heaven", { t:"Hemel", l:"Het Scheppende", a:"is sterk", f:"de vader" }]
    ],
    
    kua: [
      // Deel 1 - Het Universum
      "Het Scheppende",	"Het Ontvangende",
      "De Aanvangsmoeilijkheid",	"De Jeugddwaasheid",
      "Het Wachten",				"De Strijd",
      "Het Leger",				"De Aaneengeslotenheid",
      "De Temmende Kracht van het Kleine", "Het Optreden",
      "De Vrede",				"De Stilstand",
      "Gemeenschap met Mensen",	"Het Bezit van het Grote",
      "De Bescheidenheid",		"De Geestdrift",
      "Het Navolgen",			"Het Werk aan het Bedorvene",
      "De Toenadering",			"De Beschouwing (De Aanblik)",
      "Het Doorbijten",			"De Bekoorlijkheid",
      "De Versplintering",		"De Terugkeer (Het Keerpunt)",
      "De Onschuld (Het Onverwachte)", "De Temmende Kracht van het Grote",
      "De Mondhoeken (De Voeding)", "Het Overwicht van het Grote",
      "Het Onpeilbare",	"Het Zich-Hechtende",
      // Deel 2 - Socio-economisch
      "De Inwerking (Het Hofmaken)", "De Duurzaamheid",
      "De Terugtocht",			"De Macht van het Grote",
      "De Vooruitgang",			"De Verduistering van het Licht",
      "Het Gezin (De Clan)",	"De Tegenstelling",
      "De Hindernis",			"De Bevrijding",
      "De Vermindering",		"De Vermeedering",
      "De Doorbraak (De Vastberadenheid)", "Het Tegemoetkomen",
      "Het Verzamelen",			"Het Omhoogdringen",
      "De Benauwenis (De Uitputting)", "De Waterput",
      "De Omwenteling (Het Ruien)", "De Spijspot",
      "Het Opwindende",	"Het Stilhouden",
      "De Ontwikkeling (Geleidelijke Vooruitgang)", "Het Huwende Meisje",
      "De Volheid",				"De Zwerver",
      "Het Zachtmoedige",	"Het Blijmoedige",
      "De Oplossing",			"De Beperking",
      "Innerlijke Waarheid",	"Het Overwicht van het Kleine",
      "Na de Voleinding",		"Voor de Voleinding"
    ],     
  }
};

yijing_lang.current = yijing_lang.nl;
alert("wow")
//#endregion

