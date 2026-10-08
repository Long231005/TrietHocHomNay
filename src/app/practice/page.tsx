'use client';
import {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {useSubjects} from '@/hooks/use-subjects';
import {usePracticeProgress} from '@/hooks/use-practice-progress';
import {useWisdomShards} from '@/hooks/use-wisdom-shards';
import {practiceCopy, type Language} from '@/lib/i18n-philosophy';
import {PRACTICE_CONFIG} from '@/lib/practice-config';
import {BookOpen, Lock, Unlock, Check, X, ChevronLeft, ChevronRight, Flag, Sparkle, Clock} from 'lucide-react';
import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog';

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number[];
  multi: boolean;
};

type SubjectData = {
  subject: string;
  title: string;
  count: number;
  questions: Question[];
};

type Screen = 'list' | 'menu' | 'learn' | 'exam' | 'results' | 'chain-complete' | 'learn-complete';

export default function PracticePage() {
  const {shards, isUnlocked, unlockSubject, getSubject, getAvailableSubjects, ready: subjectsReady} = useSubjects();
  const {ready: shardsReady, reloadPity} = useWisdomShards();
  const t = practiceCopy.vi;
  
  const [screen, setScreen] = useState<Screen>('list');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showExamResult, setShowExamResult] = useState(false);
  
  if (!subjectsReady || !shardsReady) return null;
  
  const availableSubjects = getAvailableSubjects();
  
  const handleSelectSubject = (code: string) => {
    setSelectedSubject(code);
    setScreen('menu');
  };
  
  const handleUnlock = (code: string) => {
    const subject = getSubject(code);
    if (!subject) return;
    
    const success = unlockSubject(subject);
    if (success) {
      reloadPity();
      setShowUnlockDialog(false);
    }
  };
  
  const handleStartLearn = () => {
    if (!selectedSubject) return;
    setScreen('learn');
  };
  
  const handleStartExam = () => {
    if (!selectedSubject) return;
    setScreen('exam');
  };
  
  const handleBack = () => {
    if (screen === 'menu') {
      setScreen('list');
      setSelectedSubject(null);
    } else if (screen === 'learn' || screen === 'exam') {
      setScreen('menu');
    }
  };

  return (
    <div className="practice-container">
      <header className="practice-header">
        <button className="back-button" onClick={handleBack}>
          <ChevronLeft size={20} />
          {screen === 'list' ? 'Quay lại' : ''}
        </button>
        <h1>{t.practice}</h1>
        <div className="shards-display" title={t.wisdomShards}>
          <Sparkle size={18} />
          <span>{shards}</span>
        </div>
      </header>

      {screen === 'list' && (
        <SubjectList
          subjects={availableSubjects}
          shards={shards}
          isUnlocked={isUnlocked}
          onSelect={handleSelectSubject}
          onUnlockRequest={(code) => { setSelectedSubject(code); setShowUnlockDialog(true); }}
        />
      )}

      {screen === 'menu' && selectedSubject && (
        <SubjectMenu
          subjectCode={selectedSubject}
          isUnlocked={isUnlocked(selectedSubject)}
          onStartLearn={handleStartLearn}
          onStartExam={handleStartExam}
        />
      )}

      {screen === 'learn' && selectedSubject && (
        <LearnMode
          subjectCode={selectedSubject}
          onExit={() => setScreen('menu')}
          onComplete={() => setScreen('learn-complete')}
          shards={shards}
        />
      )}

      {screen === 'exam' && selectedSubject && (
        <ExamMode
          subjectCode={selectedSubject}
          onExit={() => setScreen('menu')}
          onComplete={() => setShowExamResult(true)}
          shards={shards}
        />
      )}

      {screen === 'learn-complete' && (
        <LearnComplete
          subjectCode={selectedSubject || ''}
          onContinue={() => setScreen('learn')}
          onExit={() => setScreen('menu')}
          onRestart={() => setShowConfirmRestart(true)}
        />
      )}

      {showExamResult && selectedSubject && (
        <ExamResult
          subjectCode={selectedSubject}
          onNewExam={() => { setShowExamResult(false); setScreen('exam'); }}
          onReviewWrong={() => { setShowExamResult(false); setScreen('learn'); }}
          onExit={() => { setShowExamResult(false); setScreen('menu'); }}
          shards={shards}
        />
      )}

      {showUnlockDialog && selectedSubject && (
        <UnlockDialog
          subject={getSubject(selectedSubject)!}
          shards={shards}
          onUnlock={() => handleUnlock(selectedSubject)}
          onClose={() => setShowUnlockDialog(false)}
          onGoToCase={() => window.location.href = '/'}
        />
      )}

      {showConfirmRestart && (
        <ConfirmDialog
          message={t.confirmRestart}
          onConfirm={() => { setShowConfirmRestart(false); }}
          onCancel={() => setShowConfirmRestart(false)}
        />
      )}

      {showConfirmSubmit && (
        <ConfirmDialog
          message={t.confirmSubmit.replace('{n}', '0')}
          onConfirm={() => { setShowConfirmSubmit(false); }}
          onCancel={() => setShowConfirmSubmit(false)}
        />
      )}
    </div>
  );
}

function SubjectList({subjects, shards, isUnlocked, onSelect, onUnlockRequest}: {
  subjects: any[];
  shards: number;
  isUnlocked: (code: string) => boolean;
  onSelect: (code: string) => void;
  onUnlockRequest: (code: string) => void;
}) {
  return (
    <div className="subject-grid">
      {subjects.map(subject => {
        const unlocked = isUnlocked(subject.code);
        return (
          <div
            key={subject.code}
            className={`subject-card ${unlocked ? 'unlocked' : 'locked'}`}
            onClick={() => unlocked ? onSelect(subject.code) : onUnlockRequest(subject.code)}
          >
            <div className="subject-icon">
              {unlocked ? <Unlock size={32} /> : <Lock size={32} />}
            </div>
            <h3>{subject.code}</h3>
            <p>{subject.title}</p>
            {!unlocked && (
              <div className="subject-cost">
                <Sparkle size={14} />
                <span>{subject.unlockCost}</span>
              </div>
            )}
            {!subject.available && (
              <span className="coming-soon-badge">Sắp ra mắt</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SubjectMenu({subjectCode, isUnlocked, onStartLearn, onStartExam}: {
  subjectCode: string;
  isUnlocked: boolean;
  onStartLearn: () => void;
  onStartExam: () => void;
}) {
  return (
    <div className="subject-menu">
      <h2>{subjectCode}</h2>
      <div className="menu-buttons">
        <button className="menu-button learn" onClick={onStartLearn}>
          <BookOpen size={24} />
          <span>Học</span>
        </button>
        <button className="menu-button exam" onClick={onStartExam}>
          <Flag size={24} />
          <span>Kiểm tra</span>
        </button>
      </div>
    </div>
  );
}

function LearnMode({subjectCode, onExit, onComplete, shards}: {
  subjectCode: string;
  onExit: () => void;
  onComplete: () => void;
  shards: number;
}) {
  const [data, setData] = useState<SubjectData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chain, setChain] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [chainCorrect, setChainCorrect] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const {progress, updateQuestionStatus, getQuestionStatus, getLearnedCount, resetProgress, claimChainReward} = usePracticeProgress(subjectCode);
  const {shards: currentShards, reloadPity} = useWisdomShards();

  useEffect(() => {
    import(`@/data/${subjectCode.toLowerCase()}.json`).then(mod => {
      const questions = mod.default.questions;
      initializeChain(questions);
    });
  }, [subjectCode]);

  const initializeChain = useCallback((questions: Question[]) => {
    const newQuestions = questions.filter(q => getQuestionStatus(q.id) !== 'learned');
    const learnedQuestions = questions.filter(q => getQuestionStatus(q.id) === 'learned');
    
    const shuffled = [...newQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, PRACTICE_CONFIG.LEARN_CHAIN_SIZE);
    
    const withShuffledOptions = selected.map(q => ({
      ...q,
      options: shuffleArray([...q.options]),
    }));
    
    setChain(withShuffledOptions);
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setChecked(false);
    setCorrect(null);
    setChainCorrect(0);
  }, [getQuestionStatus]);

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const currentQuestion = chain[currentIndex];

  const handleSelect = (index: number) => {
    if (checked) return;
    
    if (currentQuestion.multi) {
      setSelectedAnswers(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      checkAnswer(index);
    }
  };

  const checkAnswer = (answerIndex: number) => {
    const correctIndices = currentQuestion.answer.map(originalIdx => {
      const correctOption = currentQuestion.options[originalIdx];
      return currentQuestion.options.indexOf(correctOption);
    });
    
    const isCorrect = correctIndices.includes(answerIndex);
    setSelectedAnswers([answerIndex]);
    setChecked(true);
    setCorrect(isCorrect);
    
    if (isCorrect) {
      setChainCorrect(prev => prev + 1);
      updateQuestionStatus(currentQuestion.id, 'learned');
    }
  };

  const handleCheckMulti = () => {
    const correctIndices = currentQuestion.answer;
    const userCorrect = correctIndices.every(idx => selectedAnswers.includes(idx)) &&
                       selectedAnswers.length === correctIndices.length;
    
    setChecked(true);
    setCorrect(userCorrect);
    
    if (userCorrect) {
      setChainCorrect(prev => prev + 1);
      updateQuestionStatus(currentQuestion.id, 'learned');
    }
  };

  const handleNext = () => {
    if (currentIndex < chain.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setChecked(false);
      setCorrect(null);
    } else {
      const allCorrect = chainCorrect === chain.length;
      if (allCorrect && claimChainReward()) {
        setShowReward(true);
        reloadPity();
        setTimeout(() => {
          setShowReward(false);
          onComplete();
        }, 2000);
      } else {
        onComplete();
      }
    }
  };

  if (!currentQuestion) return <div>Loading...</div>;

  const correctIndices = currentQuestion.answer;

  return (
    <div className="learn-mode">
      {showReward && (
        <div className="reward-toast">
          <Sparkle size={20} />
          <span>+1 Mảnh Trí Tuệ</span>
        </div>
      )}
      
      <div className="learn-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{width: `${((currentIndex + 1) / chain.length) * 100}%`}} />
        </div>
        <span className="progress-text">{currentIndex + 1} / {chain.length}</span>
      </div>

      <div className="question-card">
        <p className="question-text">{currentQuestion.question}</p>
        
        {currentQuestion.multi && (
          <p className="multi-hint">Chọn nhiều đáp án</p>
        )}

        <div className="options-list">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers.includes(idx);
            const isCorrectAnswer = correctIndices.includes(idx);
            
            let className = 'option';
            if (checked) {
              if (isCorrectAnswer) className += ' correct';
              else if (isSelected && !isCorrectAnswer) className += ' incorrect';
            } else if (isSelected) {
              className += ' selected';
            }
            
            return (
              <button
                key={idx}
                className={className}
                onClick={() => handleSelect(idx)}
                disabled={checked}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option}</span>
                {checked && isCorrectAnswer && <Check size={18} className="icon-correct" />}
                {checked && isSelected && !isCorrectAnswer && <X size={18} className="icon-incorrect" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="learn-actions">
        {currentQuestion.multi && !checked && (
          <button className="check-button" onClick={handleCheckMulti} disabled={selectedAnswers.length === 0}>
            Kiểm tra
          </button>
        )}
        {checked && (
          <button className="next-button" onClick={handleNext}>
            {currentIndex < chain.length - 1 ? 'Tiếp tục' : 'Kết thúc chuỗi'}
          </button>
        )}
      </div>
    </div>
  );
}

function LearnComplete({subjectCode, onContinue, onExit, onRestart}: {
  subjectCode: string;
  onContinue: () => void;
  onExit: () => void;
  onRestart: () => void;
}) {
  const {getLearnedCount} = usePracticeProgress(subjectCode);
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  useEffect(() => {
    import(`@/data/${subjectCode.toLowerCase()}.json`).then(mod => {
      setTotalQuestions(mod.default.count);
    });
  }, [subjectCode]);

  const learned = getLearnedCount();

  return (
    <div className="learn-complete">
      <div className="complete-icon">
        <Check size={48} />
      </div>
      <h2>Hoàn thành chuỗi!</h2>
      <p className="progress-text">Đã thuộc {learned} / {totalQuestions} câu</p>
      <div className="complete-actions">
        <button onClick={onContinue}>Học chuỗi tiếp theo</button>
        <button onClick={onRestart}>Học lại từ đầu</button>
        <button onClick={onExit}>Thoát</button>
      </div>
    </div>
  );
}

function ExamMode({subjectCode, onExit, onComplete, shards}: {
  subjectCode: string;
  onExit: () => void;
  onComplete: () => void;
  shards: number;
}) {
  const [data, setData] = useState<SubjectData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number[] | null)[]>([]);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const {claimExamReward, addHistoryEntry, markWrongInProgress, getQuestionStatus} = usePracticeProgress(subjectCode);
  const {reloadPity} = useWisdomShards();

  useEffect(() => {
    import(`@/data/${subjectCode.toLowerCase()}.json`).then(mod => {
      const allQuestions = mod.default.questions;
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, PRACTICE_CONFIG.EXAM_QUESTION_COUNT);
      
      const withShuffled = selected.map(q => ({
        ...q,
        options: shuffleArray([...q.options]),
      }));
      
      setQuestions(withShuffled);
      setAnswers(new Array(withShuffled.length).fill(null));
    });
  }, [subjectCode]);

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleSelect = (index: number) => {
    const q = questions[currentIndex];
    if (q.multi) {
      setAnswers(prev => {
        const newAns = [...prev];
        const current = newAns[currentIndex] || [];
        newAns[currentIndex] = current.includes(index)
          ? current.filter(i => i !== index)
          : [...current, index];
        return newAns;
      });
    } else {
      setAnswers(prev => {
        const newAns = [...prev];
        newAns[currentIndex] = [index];
        return newAns;
      });
    }
  };

  const toggleMark = () => {
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  };

  const handleSubmit = () => {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      setShowWarning(true);
      return;
    }
    
    calculateResults();
  };

  const calculateResults = () => {
    let correct = 0;
    const wrongIds: string[] = [];
    
    questions.forEach((q, idx) => {
      const userAns = answers[idx] || [];
      const correctAns = q.answer;
      const isCorrect = correctAns.every(a => userAns.includes(a)) && userAns.length === correctAns.length;
      
      if (isCorrect) correct++;
      else wrongIds.push(q.id);
    });
    
    if (wrongIds.length > 0) {
      markWrongInProgress(wrongIds);
    }
    
    const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
    addHistoryEntry({
      date: new Date().toISOString(),
      score: correct,
      total: questions.length,
      timeSeconds,
    });
    
    const percentage = correct / questions.length;
    const examKey = `${Date.now()}`;
    
    if (percentage >= PRACTICE_CONFIG.EXAM_GOOD_THRESHOLD && claimExamReward(examKey)) {
      reloadPity();
    } else if (percentage >= PRACTICE_CONFIG.EXAM_COMPLETE_THRESHOLD && claimExamReward(examKey)) {
      reloadPity();
    }
    
    onComplete();
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQ = questions[currentIndex];
  const userAns = answers[currentIndex] || [];

  return (
    <div className="exam-mode">
      <div className="exam-header">
        <span>Câu {currentIndex + 1} / {questions.length}</span>
        <button className={`mark-button ${marked.has(currentIndex) ? 'marked' : ''}`} onClick={toggleMark}>
          <Flag size={16} />
        </button>
      </div>

      <div className="exam-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{width: `${((currentIndex + 1) / questions.length) * 100}%`}} />
        </div>
      </div>

      <div className="question-card">
        <p className="question-text">{currentQ.question}</p>
        
        {currentQ.multi && (
          <p className="multi-hint">Chọn nhiều đáp án</p>
        )}

        <div className="options-list">
          {currentQ.options.map((option, idx) => {
            const isSelected = userAns.includes(idx);
            return (
              <button
                key={idx}
                className={`option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(idx)}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="exam-nav">
        <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIndex === questions.length - 1}>
          <ChevronRight size={20} />
        </button>
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Nộp bài
      </button>

      {showWarning && (
        <Dialog open onOpenChange={setShowWarning}>
          <DialogContent>
            <DialogTitle>Xác nhận nộp bài</DialogTitle>
            <p>Còn câu chưa trả lời. Bạn có chắc muốn nộp?</p>
            <div className="dialog-actions">
              <button onClick={() => setShowWarning(false)}>Quay lại</button>
              <button onClick={() => { setShowWarning(false); calculateResults(); }}>Nộp bài</button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function ExamResult({subjectCode, onNewExam, onReviewWrong, onExit, shards}: {
  subjectCode: string;
  onNewExam: () => void;
  onReviewWrong: () => void;
  onExit: () => void;
  shards: number;
}) {
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [correct, setCorrect] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [total, setTotal] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const {history} = usePracticeProgress(subjectCode);

  useEffect(() => {
    if (history.length > 0) {
      const latest = history[0];
      setCorrect(latest.score);
      setTotal(latest.total);
      setTimeSeconds(latest.timeSeconds);
      
      const percentage = latest.score / latest.total;
      if (percentage >= PRACTICE_CONFIG.EXAM_GOOD_THRESHOLD) {
        setShowReward(true);
      } else if (percentage >= PRACTICE_CONFIG.EXAM_COMPLETE_THRESHOLD) {
        setShowReward(true);
      }
      
      import(`@/data/${subjectCode.toLowerCase()}.json`).then(mod => {
        const allQuestions = mod.default.questions;
        const wrongIds = new Set<string>();
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        shuffled.forEach(q => {
          const isWrong = false;
          if (isWrong) wrongIds.add(q.id);
        });
      });
    }
  }, [history, subjectCode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const grade = total > 0 ? ((correct / total) * 10).toFixed(1) : '0';

  return (
    <div className="exam-result">
      {showReward && (
        <div className="reward-toast">
          <Sparkle size={20} />
          <span>
            {correct / total >= PRACTICE_CONFIG.EXAM_GOOD_THRESHOLD
              ? '+10 Mảnh Trí Tuệ!'
              : '+5 Mảnh Trí Tuệ!'}
          </span>
        </div>
      )}
      
      <div className="result-icon">
        <Check size={48} />
      </div>
      <h2>Hoàn thành bài kiểm tra!</h2>
      
      <div className="result-stats">
        <div className="stat">
          <span className="stat-value">{correct}/{total}</span>
          <span className="stat-label">Đúng</span>
        </div>
        <div className="stat">
          <span className="stat-value">{grade}/10</span>
          <span className="stat-label">Điểm</span>
        </div>
        <div className="stat">
          <span className="stat-value"><Clock size={16} /> {formatTime(timeSeconds)}</span>
          <span className="stat-label">Thời gian</span>
        </div>
      </div>

      <div className="result-actions">
        <button onClick={onNewExam}>Làm bộ mới</button>
        <button onClick={onExit}>Thoát</button>
      </div>
    </div>
  );
}

function UnlockDialog({subject, shards, onUnlock, onClose, onGoToCase}: {
  subject: any;
  shards: number;
  onUnlock: () => void;
  onClose: () => void;
  onGoToCase: () => void;
}) {
  const canAfford = shards >= subject.unlockCost;
  const needMore = subject.unlockCost - shards;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Mở khóa {subject.code}</DialogTitle>
        <p>{subject.title}</p>
        
        {canAfford ? (
          <>
            <p>Mở khóa với <strong>{subject.unlockCost} Mảnh Trí Tuệ</strong>?</p>
            <div className="dialog-actions">
              <button onClick={onClose}>Hủy</button>
              <button onClick={onUnlock}>Xác nhận</button>
            </div>
          </>
        ) : (
          <>
            <p className="not-enough">Không đủ Mảnh Trí Tuệ!</p>
            <p>Cần thêm {needMore} Mảnh nữa.</p>
            <div className="dialog-actions">
              <button onClick={onClose}>Đóng</button>
              <button onClick={onGoToCase}>Đi mở hòm</button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialog({message, onConfirm, onCancel}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogTitle>Xác nhận</DialogTitle>
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onCancel}>Hủy</button>
          <button onClick={onConfirm}>Xác nhận</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
