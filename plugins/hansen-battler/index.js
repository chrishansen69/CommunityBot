'use strict';
/*
Chris Hansen's Pro Battler
 */

const typeChart = require('./typeChart.json');
const types = require('./types.json');

function calcMove(attacker, defender, attackerMoveset, move) {
  if (!move.type)
    move.type = types[move.type_id].name;
  move.isCrit = Math.random() > (1 - (1 / attacker.bs.sp) * 8);
  move.bp = move.power;

  return calcDamage(
    attackerMoveset.level,
    attacker.bs.at, attacker.bs.sa,
    defender.bs.df, defender.bs.sd,
    attacker.t1, attacker.t2,
    defender.t1, defender.t2,
    move,
    false, false
  );
}

function calcDamage(attackerLevel, attackerAttack, attackerSA, defenderDefense, defenderSD, attackerType1, attackerType2, defenderType1, defenderType2, move, field_isReflect, field_isLightScreen) {
  if (move.bp === 0) {
    return [0];
  }

  let lv = attackerLevel;
  if (move.name === "Seismic Toss" || move.name === "Night Shade") {
    return [lv];
  }
  let typeEffect1 = typeChart[move.type][defenderType1];
  let typeEffect2 = defenderType2 ? typeChart[move.type][defenderType2] : 1;
  let typeEffectiveness = typeEffect1 * typeEffect2;

  if (typeEffectiveness === 0) {
    return [0];
  }

  //if (move.hits > 1) {
  //    description.hits = move.hits;
  //}

  //let desc_hits = move.hits;
  //let desc_isCritical = move.isCrit;
  //let desc_isReflect = field_isReflect;
  //let desc_isLightScreen = field_isLightScreen;

  let isPhysical = typeChart[move.type].category === "Physical";
  let at = isPhysical ? attackerAttack : attackerSA;
  let df = isPhysical ? defenderDefense : defenderSD;

  if (move.isCrit) {
    lv *= 2;
  }

  if (move.name === "Explosion" || move.name === "Self-Destruct") {
    df = Math.floor(df / 2);
  }

  if (!move.isCrit) {
    if (isPhysical && field_isReflect) {
      df *= 2;
    } else if (!isPhysical && field_isLightScreen) {
      df *= 2;
    }
  }

  if (at > 255 || df > 255) {
    at = Math.floor(at / 4) % 256;
    df = Math.floor(df / 4) % 256;
  }
  let baseDamage = Math.min(997, Math.floor(Math.floor(Math.floor(2 * lv / 5 + 2) * Math.max(1, at) * move.bp / Math.max(1, df)) / 50)) + 2;
  if (move.type === attackerType1 || move.type === attackerType2) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }
  baseDamage = Math.floor(baseDamage * typeEffectiveness);
  // If baseDamage >= 768, don't apply random factor? upokecenter says this, but nobody else does
  let damage = [];
  for (let i = 217; i <= 255; i++) {
    damage[i - 217] = Math.floor(baseDamage * i / 255);
  }
  return damage;
}

///// https://pokemonshowdown.com/damagecalc/
///// http://bulbapedia.bulbagarden.net/wiki/Damage#Damage_formula
///
///function CALCULATE_ALL_MOVES_RBY(p1, p2, field) {
///    p1.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[AT], p1.boosts[AT])));
///    p1.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[DF], p1.boosts[DF])));
///    p1.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[SL], p1.boosts[SL])));
///    p2.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[AT], p2.boosts[AT])));
///    p2.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[DF], p2.boosts[DF])));
///    p2.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[SL], p2.boosts[SL])));
///    let side1 = field.getSide(1);
///    let side2 = field.getSide(0);
///    let results = [[],[]];
///    for (let i = 0; i < 4; i++) {
///        results[0][i] = CALCULATE_DAMAGE_RBY(p1, p2, p1.moves[i], side1);
///        results[1][i] = CALCULATE_DAMAGE_RBY(p2, p1, p2.moves[i], side2);
///    }
///    return results;
///}
///
///function CALCULATE_MOVES_OF_ATTACKER_RBY(attacker, defender, field) {
///    attacker.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[AT], attacker.boosts[AT])));
///    attacker.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[SL], attacker.boosts[SL])));
///    defender.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[DF], defender.boosts[DF])));
///    defender.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[SL], defender.boosts[SL])));
///    let defenderSide = field.getSide( ~~(mode === "one-vs-all") );
///    let results = [];
///    for (let i = 0; i < 4; i++) {
///        results[i] = CALCULATE_DAMAGE_RBY(attacker, defender, attacker.moves[i], defenderSide);
///    }
///    return results;
///}
///
///function CALCULATE_DAMAGE_RBY(attacker, defender, move, field) {
///    let description = {
///        "attackerName": attacker.name,
///        "moveName": move.name,
///        "defenderName": defender.name
///    };
///    
///    if (move.bp === 0) {
///        return {"damage":[0], "description":buildDescription(description)};
///    }
///    
///    let lv = attacker.level;
///    if (move.name === "Seismic Toss" || move.name === "Night Shade") {
///        return {"damage":[lv], "description":buildDescription(description)};
///    }
///
///    let typeEffect1 = typeChart[move.type][defender.type1];
///    let typeEffect2 = defender.type2 ? typeChart[move.type][defender.type2] : 1;
///    let typeEffectiveness = typeEffect1 * typeEffect2;
///    
///    if (typeEffectiveness === 0) {
///        return {"damage":[0], "description":buildDescription(description)};
///    }
///    
///    if (move.hits > 1) {
///        description.hits = move.hits;
///    }
///    
///    let isPhysical = typeChart[move.type].category === "Physical";
///    let attackStat = isPhysical ? AT : SL;
///    let defenseStat = isPhysical ? DF : SL;
///    let at = attacker.stats[attackStat];
///    let df = defender.stats[defenseStat];
///    
///    if (move.isCrit) {
///        lv *= 2;
///        at = attacker.rawStats[attackStat];
///        df = defender.rawStats[defenseStat];
///        description.isCritical = true;
///    } else {
///        if (attacker.boosts[attackStat] !== 0) {
///            description.attackBoost = attacker.boosts[attackStat];
///        }
///        if (defender.boosts[defenseStat] !== 0) {
///            description.defenseBoost = defender.boosts[defenseStat];
///        }
///        if (isPhysical && attacker.status === "Burned") {
///            at = Math.floor(at / 2);
///            description.isBurned = true;
///        }
///    }
///    
///    if (move.name === "Explosion" || move.name === "Self-Destruct") {
///        df = Math.floor(df / 2);
///    }
///    
///    if (!move.isCrit) {
///        if (isPhysical && field.isReflect) {
///            df *= 2;
///            description.isReflect = true;
///        } else if (!isPhysical && field.isLightScreen) {
///            df *= 2;
///            description.isLightScreen = true;
///        }
///    }
///    
///    if (at > 255 || df > 255) {
///        at = Math.floor(at / 4) % 256;
///        df = Math.floor(df / 4) % 256;
///    }
///
///    let baseDamage = Math.min(997, Math.floor(Math.floor(Math.floor(2 * lv / 5 + 2) * Math.max(1, at) * move.bp / Math.max(1, df)) / 50)) + 2;
///    if (move.type === attacker.type1 || move.type === attacker.type2) {
///        baseDamage = Math.floor(baseDamage * 1.5);
///    }
///    baseDamage = Math.floor(baseDamage * typeEffectiveness);
///    // If baseDamage >= 768, don't apply random factor? upokecenter says this, but nobody else does
///    let damage = [];
///    for (let i = 217; i <= 255; i++) {
///        damage[i-217] = Math.floor(baseDamage * i / 255);
///    }
///    return {"damage":damage, "description":buildDescription(description)};
///}
