import {useEffect, useState, useCallback} from 'react';

export type QuestionStatus = 'new' | 'learning' | 'learned';

type ProgressData = {
  [questionId: string]: QuestionStatus;
};

type ExamHistoryEntry = {
  date: string;
  score: number;
  total: number;
  timeSeconds: number;
};

const getProgressKey = (subjectCode: string) => `practice_progress_v1_${subjectCode}`;
const getHistoryKey = (subjectCode: string) => `exam_history_v1_${subjectCode}`;
const getChainRewardKey = (subjectCode: string) => `chain_reward_v1_${subjectCode}`;
const getExamRewardKey = (subjectCode: string) => `exam_reward_v1_${subjectCode}`;

function loadProgress(subjectCode: string): ProgressData {
  try {
    const raw = localStorage.getItem(getProgressKey(subjectCode));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}

function saveProgress(subjectCode: string, data: ProgressData) {
  try {
    localStorage.setItem(getProgressKey(subjectCode), JSON.stringify(data));
  } catch {}
}

function loadHistory(subjectCode: string): ExamHistoryEntry[] {
  try {
    const raw = localStorage.getItem(getHistoryKey(subjectCode));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

function saveHistory(subjectCode: string, data: ExamHistoryEntry[]) {
  try {
    localStorage.setItem(getHistoryKey(subjectCode), JSON.stringify(data));
  } catch {}
}

function hasChainRewardBeenClaimed(subjectCode: string): boolean {
  try {
    return localStorage.getItem(getChainRewardKey(subjectCode)) === 'true';
  } catch {
    return false;
  }
}

function markChainRewardClaimed(subjectCode: string) {
  try {
    localStorage.setItem(getChainRewardKey(subjectCode), 'true');
  } catch {}
}

function hasExamRewardBeenClaimed(subjectCode: string, examKey: string): boolean {
  try {
    return localStorage.getItem(getExamRewardKey(subjectCode) + examKey) === 'true';
  } catch {
    return false;
  }
}

function markExamRewardClaimed(subjectCode: string, examKey: string) {
  try {
    localStorage.setItem(getExamRewardKey(subjectCode) + examKey, 'true');
  } catch {}
}

export function usePracticeProgress(subjectCode: string) {
  const [progress, setProgress] = useState<ProgressData>({});
  const [history, setHistory] = useState<ExamHistoryEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress(subjectCode));
    setHistory(loadHistory(subjectCode));
    setReady(true);
  }, [subjectCode]);

  const updateQuestionStatus = useCallback((questionId: string, status: QuestionStatus) => {
    setProgress(prev => {
      const next = {...prev, [questionId]: status};
      saveProgress(subjectCode, next);
      return next;
    });
  }, [subjectCode]);

  const getQuestionStatus = useCallback((questionId: string): QuestionStatus => {
    return progress[questionId] || 'new';
  }, [progress]);

  const getLearnedCount = useCallback((): number => {
    return Object.values(progress).filter(s => s === 'learned').length;
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress({});
    saveProgress(subjectCode, {});
  }, [subjectCode]);

  const addHistoryEntry = useCallback((entry: ExamHistoryEntry) => {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 5);
      saveHistory(subjectCode, next);
      return next;
    });
  }, [subjectCode]);

  const markWrongInProgress = useCallback((questionIds: string[]) => {
    setProgress(prev => {
      const next = {...prev};
      questionIds.forEach(id => {
        if (next[id] !== 'learned') {
          next[id] = 'learning';
        }
      });
      saveProgress(subjectCode, next);
      return next;
    });
  }, [subjectCode]);

  const claimChainReward = useCallback((): boolean => {
    if (hasChainRewardBeenClaimed(subjectCode)) return false;
    markChainRewardClaimed(subjectCode);
    return true;
  }, [subjectCode]);

  const claimExamReward = useCallback((examKey: string): boolean => {
    if (hasExamRewardBeenClaimed(subjectCode, examKey)) return false;
    markExamRewardClaimed(subjectCode, examKey);
    return true;
  }, [subjectCode]);

  return {
    progress,
    history,
    ready,
    updateQuestionStatus,
    getQuestionStatus,
    getLearnedCount,
    resetProgress,
    addHistoryEntry,
    markWrongInProgress,
    claimChainReward,
    claimExamReward,
  };
}
