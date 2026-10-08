import {useEffect, useState, useCallback} from 'react';
import {useWisdomShards} from '@/hooks/use-wisdom-shards';
import {subjects, type Subject} from '@/data/subjects';

const STORAGE_KEY = 'unlocked_subjects_v1';

function loadUnlockedSubjects(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {}
  return [];
}

function saveUnlockedSubjects(codes: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  } catch {}
}

export function useSubjects() {
  const {shards, ready: shardsReady} = useWisdomShards();
  const [unlockedCodes, setUnlockedCodes] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlockedCodes(loadUnlockedSubjects());
    setReady(true);
  }, []);

  const isUnlocked = useCallback((code: string): boolean => {
    return unlockedCodes.includes(code);
  }, [unlockedCodes]);

  const unlockSubject = useCallback((subject: Subject): boolean => {
    if (shards < subject.unlockCost) return false;
    if (unlockedCodes.includes(subject.code)) return false;

    const newCodes = [...unlockedCodes, subject.code];
    setUnlockedCodes(newCodes);
    saveUnlockedSubjects(newCodes);

    return true;
  }, [shards, unlockedCodes]);

  const getSubject = useCallback((code: string): Subject | undefined => {
    return subjects.find(s => s.code === code);
  }, []);

  const getAvailableSubjects = useCallback((): Subject[] => {
    return subjects.filter(s => s.available);
  }, []);

  return {
    shards,
    unlockedCodes,
    isUnlocked,
    unlockSubject,
    getSubject,
    getAvailableSubjects,
    ready: ready && shardsReady,
  };
}
