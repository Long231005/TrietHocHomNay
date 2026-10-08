import {useEffect, useState, useCallback} from 'react';
import type {Quote} from '@/lib/quotes';
import {SHARD_REWARD, SHARD_DUPE_MULTIPLIER, UNLOCK_COST} from '@/lib/quotes';
import {PITY_4_THRESHOLD, PITY_5_THRESHOLD} from '@/lib/case-mechanics';

type WisdomData = {
  shards: number;
  unlockedIds: string[];
  pity4Count: number;
  pity5Count: number;
};

const STORAGE_KEY = 'wisdom-data';
const CURRENT_VERSION = 2;
const WELCOME_BONUS_KEY = 'welcomeBonusClaimed_v1';
const WELCOME_BONUS_AMOUNT = 20;

function loadData(): WisdomData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        const version = parsed._version || 1;
        if (version < CURRENT_VERSION) {
          const migrated: WisdomData = {
            shards: typeof parsed.shards === 'number' ? parsed.shards : 0,
            unlockedIds: Array.isArray(parsed.unlockedIds) ? parsed.unlockedIds : [],
            pity4Count: typeof parsed.pity4Count === 'number' ? parsed.pity4Count : 0,
            pity5Count: typeof parsed.pity5Count === 'number' ? parsed.pity5Count : 0,
          };
          saveData(migrated);
          return migrated;
        }
        return {
          shards: typeof parsed.shards === 'number' ? parsed.shards : 0,
          unlockedIds: Array.isArray(parsed.unlockedIds) ? parsed.unlockedIds : [],
          pity4Count: typeof parsed.pity4Count === 'number' ? parsed.pity4Count : 0,
          pity5Count: typeof parsed.pity5Count === 'number' ? parsed.pity5Count : 0,
        };
      }
    }
  } catch {}
  return { shards: 0, unlockedIds: [], pity4Count: 0, pity5Count: 0 };
}

function saveData(data: WisdomData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, _version: CURRENT_VERSION }));
  } catch {}
}

function hasClaimedWelcomeBonus(): boolean {
  try {
    return localStorage.getItem(WELCOME_BONUS_KEY) === 'true';
  } catch {
    return false;
  }
}

function markWelcomeBonusClaimed() {
  try {
    localStorage.setItem(WELCOME_BONUS_KEY, 'true');
  } catch {}
}

export function useWisdomShards() {
  const [data, setData] = useState<WisdomData>({ shards: 0, unlockedIds: [], pity4Count: 0, pity5Count: 0 });
  const [ready, setReady] = useState(false);
  const [welcomeBonusApplied, setWelcomeBonusApplied] = useState(false);

  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    
    if (!hasClaimedWelcomeBonus()) {
      const updated: WisdomData = {
        ...loaded,
        shards: loaded.shards + WELCOME_BONUS_AMOUNT,
      };
      setData(updated);
      saveData(updated);
      markWelcomeBonusClaimed();
      setWelcomeBonusApplied(true);
    }
    
    setReady(true);
  }, []);

  const save = useCallback((next: WisdomData) => {
    setData(next);
    saveData(next);
  }, []);

  const isUnlocked = useCallback((quoteId: string): boolean => {
    return data.unlockedIds.includes(quoteId);
  }, [data.unlockedIds]);

  const onSpinResult = useCallback((quote: Quote): { gainedShards: number; isNew: boolean } => {
    const alreadyUnlocked = data.unlockedIds.includes(quote.id);
    const baseShards = SHARD_REWARD[quote.rarity];
    const gainedShards = alreadyUnlocked ? baseShards * SHARD_DUPE_MULTIPLIER : baseShards;
    const nextPity4 = quote.rarity >= 4 ? 0 : data.pity4Count + 1;
    const nextPity5 = quote.rarity === 5 ? 0 : data.pity5Count + 1;
    const nextUnlockedIds = alreadyUnlocked
      ? data.unlockedIds
      : [...data.unlockedIds, quote.id];
    save({
      shards: data.shards + gainedShards,
      unlockedIds: nextUnlockedIds,
      pity4Count: nextPity4,
      pity5Count: nextPity5,
    });
    return { gainedShards, isNew: !alreadyUnlocked };
  }, [data, save]);

  const unlockQuote = useCallback((quote: Quote): boolean => {
    const cost = UNLOCK_COST[quote.rarity];
    if (data.shards < cost) return false;
    if (data.unlockedIds.includes(quote.id)) return false;
    save({
      shards: data.shards - cost,
      unlockedIds: [...data.unlockedIds, quote.id],
      pity4Count: data.pity4Count,
      pity5Count: data.pity5Count,
    });
    return true;
  }, [data, save]);

  const pity4Remaining = Math.max(0, PITY_4_THRESHOLD - data.pity4Count);
  const pity5Remaining = Math.max(0, PITY_5_THRESHOLD - data.pity5Count);

  return {
    shards: data.shards,
    unlockedIds: data.unlockedIds,
    pity4Count: data.pity4Count,
    pity5Count: data.pity5Count,
    pity4Remaining,
    pity5Remaining,
    isUnlocked,
    onSpinResult,
    unlockQuote,
    ready,
    welcomeBonusApplied,
    reloadPity: () => {
      const loaded = loadData();
      setData(loaded);
      return { pity4Count: loaded.pity4Count, pity5Count: loaded.pity5Count };
    },
  };
}
