
//#region sixiang operators
export const sixiang_NAMES = Array.freeze(Array.seal(["taiyin", "shaoyin", "shaoyang", "taiyang"]));

//#endregion

//#region bagua operators
export function bagua_flip(value) {
  return (value & 1) << 2 + (value & 2) + (value & 4) >> 2;
}
export function bagua_linecount(value) {
  value = value | 0;
  return (value & 1) + ((value >> 1)) & 1 + ((value >> 2) & 1);
}
export function bagua_isabstract(value) {
  return value === 0 || value === 7 || value === 5 || value === 2;
}

export const bagua_NAMES = Array.freeze(Array.seal(["earth", "mountain", "water", "wind", "thunder", "fire", "lake", "heaven"]));
export const bagua_ELM5NAMES = Array.freeze(Array.seal(["earth", "earth", "water", "wood", "wood", "fire", "metal", "metal"]));

//#endregion

//#region yijing.sixiang functions 
// get top sixiang from hexagram
export function yijing_blue(value) {
  value = value | 0;
  return (value & 3) | 0;
}

// get middle sixiang from hexagram
export function yijing_white(value) {
  value = value | 0;
  return ((value >> 2) & 3) | 0;
}

// get bottom sixiang from hexagram
export function yijing_red(value) {
  value = value | 0;
  return ((value >> 4) & 3) | 0; 
}

export function yijing_sixiang(value) {
  return yijing_root(value) & 3;
}
export function yijing_fromsixiang(value) {
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
export function yijing_isroot(value) {
  return (value === 0 || value === 63 || value === 21 || value === 42);
}
export function yijing_root(value = 0) {
  value = value | 0;
  while(!yijing_isroot(value)) {
    value = yijing_center(c);
  }
  return value;
}
export function yijing_opposite(value) {
  const lower = yijing_upper(value);
  const upper = yijing_lower(value);
  return (upper << 3) | lower;
}
export function yijing_flip(value) {
  return (value & 1) << 5
    + (value & 2) << 3
    + (value & 4) << 1
    + (value & 8) >> 1
    + (value & 16) >> 3
    + (value & 32) >> 5;
}
export function yijing_linecount(value) {
  value = value | 0;
  return (value & 1)
    + ((value >> 1) & 1)
    + ((value >> 2) & 1)
    + ((value >> 3) & 1)
    + ((value >> 4) & 1)
    + ((value >> 5) & 1);
}

//#endregion

//#region yijing symmetry operators

export function yijing_iscosmic(value) {
  return yijing_isroot(value);
}
export function yijing_iskarmic(value) {
  return !yijing_iscosmic(value) && yijing_iscosmic(yijing_center(value));
}

export function yijing_isbalanced(value) {
  return (yijing_linecount(value) === 3);
}
export function yijing_isbreath(value) {
  return yijing_center(value) === yijing_invert(value);
}
export function yijing_ismother(value) {
  return yijing_isbalanced(value) && yijing_upper(value) === yijing_lower(yijing_invert(value));
}
export function yijing_isdirection(value) {
  return yijing_isbalanced(value) && !yijing_ismother(value) && !yijing_isbreath(value);
}

export function yijing_isprinciple(value) {
  return yijing_lower(value) === yijing_upper(value);
}
export function yijing_isbeginning(value) {
  return yijing_isprinciple(value) && (yijing_upper(value) == 0 || yijing_upper(value) == 7);
}
export function yijing_istitan(value) {
  const c = yijing_linecount(value);
  return (c == 1 || c == 5)?true:false;
}
export function yijing_isgigante(value) {
  return !yijing_isbalanced(value) && !yijing_isprinciple(value) && !yijing_istitan(value);
}


//#endregion

//#region yijing string operators
export function yijing_symmetryName(value) {
  if (yijing_isbreath(value)) return 'breath';
  if (yijing_ismother(value)) return 'mother';
  if (yijing_isdirection(value)) return 'direction';
  if (yijing_isbeginning(value)) return 'beginning';
  if (yijing_isprinciple(value)) return 'principle';
  if (yijing_istitan(value)) return 'titan'; 
  if (yijing_isgigante(value)) return 'gigante';
  throw new Error("value is out of range");
}
export function yijing_mantraName(value) {
  if (yijing_iscosmic(value)) return 'cosmic';
  if (yijing_iskarmic(value)) return 'karmic';
  return '';
}

export const yijing_WHITENAMES = Array.freeze(Array.seal([ "-", "*", "+", "|" ]));
export function yijing_whiteName(value) {
  return yijing_WHITENAMES[yijing_white(value)];
}

export function yijing_operatorSymbol(dlower, dupper) {
  if (yijing_center(dlower) == dupper) 
    return 'C';
  else if (yijing_opposite(dlower) == dupper) 
    return 'O';
  else if (yijing_other(dlower) == dupper) {
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

export function yijing_actionName(value = 0) {
  switch(value) {
    case 0: return "-";
    case 63: return "|";
    case 21: return "*";
    case 42: return "+";
    default: return "!not root!";
  }
}
	
export function yijing_tobinarystring(value) {
  return (((value & 1) == 1) ? "1" : "0")
    + (((value & 2) == 2) ? "1" : "0")
    + (((value & 4) == 4) ? "1" : "0")
    + (((value & 8) == 8) ? "1" : "0")
    + (((value & 16) == 16) ? "1" : "0")
    + (((value & 32) == 32) ? "1" : "0");
}

//#endregion

//#region yijing king wen senquence
export const yijing_KINGWEN_TOSEQUENCE = Array.freeze(Array.seal([ 
  2,	23,	8,	20,	16,	35,	45,	12,	// earth
  15,	52, 39,	53,	62, 56,	31,	33,	// mountain
  7,	4,	29, 59,	40,	64,	47, 6,	// water
  46,	18, 48,	57,	32,	50,	28,	44,	// wind
  24,	27,	3,	42,	51,	21,	17,	25,	// thunder
  36,	22,	63,	37,	55,	30,	49,	13,	// fire
  19,	41,	60,	61,	54,	38,	58,	10,	// lake
  11,	26,	5,	9,	34,	14,	43,	1,	// heaven
]));

export const yijing_KINGWEN_FROMSEQUENCE = (function () {
  const wendec = new Array(65);
  for (var i=0; i < 64; i++) {
    wendec[decwen[i]] = i;
  }
  return Array.freeze(Array.seal(wendec));
})();

export function yijing_tokingwen(value) {
  return yijing_KINGWEN_TOSEQUENCE[value & 63]

}
export function yijing_fromkingwen(value) {
  return yijing_KINGWEN_FROMSEQUENCE[value & 63];  
}
//#endregion

//#region translations
var yi = function() {

	var _binwen = [ 
		2,	23,	8,	20,	16,	35,	45,	12,	// earth
		15,	52, 39,	53,	62, 56,	31,	33,	// mountain
		7,	4,	29, 59,	40,	64,	47, 6,	// water
		46,	18, 48,	57,	32,	50,	28,	44,	// wind
		24,	27,	3,	42,	51,	21,	17,	25,	// thunder
		36,	22,	63,	37,	55,	30,	49,	13,	// fire
		19,	41,	60,	61,	54,	38,	58,	10,	// lake
		11,	26,	5,	9,	34,	14,	43,	1,	// heaven
	];
	var _wenbin = new Array(65);
	for (var i=0; i < 64; i++) {
		_wenbin[_binwen[i]] = i;
	}

	var _wen_houses = [
		[2,24,19,11, 34,43,5,8],	// aarde
		[52,22,26,41, 38,10,61,53], // berg
		[29,60,3,63, 49,55,36,7], 	// water
		[57,9,37,42, 25,21,27,18],	// wind
		[51,16,40,32, 46,48,28,17], // donder
		[30,56,50,64, 4,59,6,13],	// vuur
		[58,47,45,31, 39,15,62,54],	// meer
		[1,44,33,12, 20,23,35,14] 	// hemel
	];
	
	
	var _lang = {
		nl:(function() {
			var _oer = [
				{s:"Aarde", l:"Het Ontvangende",a:"is toegewijd",f:"de moeder"},
				{s:"Berg", l:"Het Stilhouden",a:"is stilhouden",f:"de jongste zoon"},
				{s:"Water", l:"Het Onpeilbare",a:"is gevaar",f:"de middelste zoon"},
				{s:"Wind", l:"Het Zachtmoedige",a:"is indringen",f:"de oudste dochter"},
				{s:"Donder", l:"Het Opwindende",a:"is beweging, is de schok",f:"de oudste zoon"},
				{s:"Vuur", l:"Het Zich-Hechtende",a:"is lichtend of afhankelijk, is de zon of de bliksem, het vuur",f:"de middelste dochter"},
				{s:"Meer", l:"Het Blijmoedige",a:"is vreugde",f:"de jongste dochter"},
				{s:"Hemel", l:"Het Scheppende",a:"is sterk",f:"de vader"}
			];
			
			var _gua = [
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
			];
			
			return {
				gua:function(wenval) {
					return _gua[(wenval-1)&63];
				}
			};
			
		})()
	};

	var _bin = {
		inc:function(binval) {
			return (binval+1)&63;
		},
		dec:function(binval) {
			return (binval-1)&63;
		},
		fromGray:function(/*unsigned short*/grayval) {
			var temp = grayval ^ (grayval>>8)
			temp ^= (temp>>4);
			temp ^= (temp>>2);
			temp ^= (temp>>1);
			return temp;
		},
		fromWen:function(wenval) {
			return _wenbin[wenval];
		}
	};
	
	var _gray = {
		inc:function(grayval) {
			return _gray.fromBin(_bin.fromGray(grayval)+1);
		},
		dec:function(grayval) {
			return _gray.fromBin(_bin.fromGray(grayval)-1);
		},
		fromBin:function(binval) {
			binval = Math.abs(binval);
			return (binval>>1)^binval;
		},
		fromWen:function(wenval) {
			return _gray.fromBin(_bin.fromWen(wenval));
		}
	};
	
	var _wen = {
		inc:function(wenval) {
			return wenval+1;
		},
		dec:function(binval) {
			return wenval-1;
		},
		fromBin:function(binval) {
			return _binwen[binval&63];
		},
		fromGray:function(grayval) {
			return _wen.fromBin(_bin.fromGray(grayval));
		}
	};
  
  function getgroups() {
    var dbb = new Array(); // balanced breath		- 1
    var dbm = new Array(); // balanced mothers		- 3
    var dbd = new Array(); // balanced directions	- 6
    var dub = new Array(); // unbalanced beginning	- 1
    var dup = new Array(); // unbalanced principle	- 3
    var dut = new Array(); // unbalanced titan		- 6
    var dug = new Array(); // unbalanced gigantes	- 12
    for (var i=0; i < 32; i++) {
      if (yijing_isbalanced(i)) {
        if (yijing_isbreath(i))
          dbb[dbb.length] = i;
        else if (yijing_ismother(i))
          dbm[dbm.length] = i;
        else
          dbd[dbd.length] = i; // direction
      }
      else { // unbalanced
        if (yijing_isbeginning(i))
          dub[dub.length] = i;
        else if (yijing_isprinciple(i))
          dup[dup.length] = i;
        else if (yijing_istitan(i))
          dut[dut.length] = i;
        else
          dug[dug.length] = i; // gigante
      }
    }
  }

	return {
		bin:_bin,
		gray:_gray,
		wen:_wen,
		lang:_lang.nl
	}
}();

//#endregion
