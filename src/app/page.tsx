import {readCookie,writeCookie} from '@/lib/cookies';
'use client';
import { createSpinProfile, spinProgress, chooseTieredWithPity, stopFraction } from '@/lib/case-mechanics';
import { quotes, philosopherMap, philosophers, UNLOCK_COST, SHARD_REWARD, type Quote } from '@/lib/quotes';
import { getPhilosopherAvatarUrl, hasPhilosopherImage, getPhilosopherInitials } from '@/lib/philosopher-image';
import { copy, RARITY_COLORS, type Language } from '@/lib/i18n-philosophy';
import { useLocalSpinCount } from '@/hooks/use-local-spin-count';
import { useWisdomShards } from '@/hooks/use-wisdom-shards';
import { CaseAudio } from '@/lib/case-audio';
import { flushSync } from 'react-dom';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AudioLines, Volume2, VolumeX, Sparkles, BookOpen, Globe, Lock, Unlock, Gem, Sparkle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const basePath = '';

const RARITY_COLORS_LIST = ['#3b82f6', '#a855f7', '#eab308'];

function QuotePreview({ quote, philosopher }: { quote: Quote; philosopher: typeof philosophers[number] | undefined }) {
  const color = RARITY_COLORS_LIST[quote.rarity - 3];
  const hasImage = philosopher ? hasPhilosopherImage(philosopher.imageUrl) : false;
  const avatarUrl = philosopher ? getPhilosopherAvatarUrl(philosopher.imageUrl, 'medium') : '';
  const initials = philosopher ? getPhilosopherInitials(philosopher.name) : '??';
  return (
    <div className="food-image quote-preview" style={{
      background: `linear-gradient(135deg, ${color}22, ${color}44)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      gap: '8px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: hasImage ? 'transparent' : `linear-gradient(135deg, ${color}88, ${color})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        color: hasImage ? 'transparent' : '#fff',
        textShadow: hasImage ? 'none' : `0 1px 2px rgba(0,0,0,0.3)`,
        marginBottom: '4px',
        overflow: 'hidden',
        border: `2px solid ${color}`,
        boxShadow: `0 0 8px ${color}44`,
      }}>
        {hasImage ? (
          <img 
            src={avatarUrl} 
            alt={philosopher?.name ?? ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', borderRadius: '50%' }}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.style.background = `linear-gradient(135deg, ${color}88, ${color})`;
                parent.style.color = '#fff';
                parent.textContent = initials;
              }
            }}
          />
        ) : initials}
      </div>
      <div style={{ fontSize: '11px', color: '#c4ccd3', textAlign: 'center', fontStyle: 'italic', lineHeight: '1.3', fontFamily: 'Georgia, serif', maxHeight: '70px', overflow: 'hidden' }}>
        {quote.text.length > 60 ? quote.text.slice(0, 60) + '...' : quote.text}
      </div>
      <div style={{ fontSize: '10px', color, marginTop: '4px', fontWeight: '600' }}>
        — {philosopher?.name ?? 'Unknown'}
      </div>
    </div>
  );
}

function MysteryArt() {
  return <div className="mystery-art" role="img" aria-label="Legendary quote">
    <div className="mystery-rays" />
    <svg className="mystery-emblem" viewBox="0 0 240 150" aria-hidden="true">
      <path className="gold-orbit" d="M120 5 174 27 193 75 174 123 120 145 66 123 47 75 66 27Z" />
      <path fill="#b27a16" d="m120 10 16 38 44-18-18 38 55 7-55 14 18 34-44-16-16 33-16-33-44 16 18-34-55-14 55-7-18-38 44 18Z" />
      <path fill="#ffe59a" d="m120 18 13 41 38-21-23 35 49 2-49 10 23 31-38-18-13 34-13-34-38 18 23-31-49-10 49-2-23-35 38 21Z" />
      <path fill="#372414" stroke="#eac366" strokeWidth="2" d="m120 34 35 20 0 42-35 20-35-20V54Z" />
      <path fill="#fff3ba" d="M104 61c0-22 36-24 36-2 0 10-12 13-13 20v4h-13v-6c0-9 12-12 12-18 0-8-11-7-11 2zm10 28h13v13h-13z" />
      <path fill="#fff5ce" d="m34 29 3 7 8 2-8 3-3 8-2-8-8-3 8-2zm164 66 3 9 10 2-10 3-3 10-3-10-9-3 9-2zM186 19l3 3-3 3-3-3zM52 117l3 3-3 3-3-3z" />
    </svg>
    <div className="mystery-sheen" />
  </div>;
}

const Card = memo(function Card({
  quote,
  language,
  small = false,
  slot,
  isUnlocked,
  onClick,
}: {
  quote: Quote;
  language: Language;
  small?: boolean;
  slot?: number;
  isUnlocked: boolean;
  onClick: () => void;
}) {
  const mystery = !small && quote.rarity === 5;
  const color = RARITY_COLORS_LIST[quote.rarity - 3];
  const displayRarity = quote.rarity;
  const philosopher = philosopherMap.get(quote.philosopherId);
  const t = copy[language];

  return (
    <div
      className={`food-card ${small ? 'small' : ''} ${mystery ? 'mystery-card' : ''} ${!isUnlocked ? 'locked-card' : ''}`}
      data-slot-id={slot}
      data-quote-id={quote.id}
      style={{
        '--rarity': color,
        ...(slot === undefined ? {} : { position: 'absolute', left: `${slot * 254}px` }),
      } as React.CSSProperties}
      onClick={onClick}
    >
      <span className="tier">{t.tiers[displayRarity - 3]}</span>
      {!isUnlocked && <Lock className="lock-icon" size={16} />}
      {mystery ? <MysteryArt /> : <QuotePreview quote={quote} philosopher={philosopher} />}
      <div className="card-copy">
        <strong>{mystery ? t.mystery : quote.text.slice(0, 30) + (quote.text.length > 30 ? '...' : '')}</strong>
        <span>{small ? philosopher?.school ?? '' : philosopher?.name ?? 'Unknown'}</span>
      </div>
    </div>
  );
});

function QuoteResultDialog({
  quote,
  philosopher,
  language,
  shardsGained,
  isNew,
  onClose,
}: {
  quote: Quote;
  philosopher: typeof philosophers[number];
  language: Language;
  shardsGained: number;
  isNew: boolean;
  onClose: () => void;
}) {
  const t = copy[language];
  const color = RARITY_COLORS_LIST[quote.rarity - 3];
  const isVietnamese = /[àáạảãâầấậẩăằắặẳẵèéẹẻẽêềếệểễìíịỉĩĳóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(quote.text);
  const displayText = language === 'vi' && isVietnamese ? quote.text : quote.text;

  return (
    <>
      <span className="winner-label">{isNew ? t.newItem : t.dupe}</span>
      <DialogTitle className="winner-title">{philosopher.name}</DialogTitle>
      <DialogDescription className="winner-description">
        {philosopher.era} · {philosopher.school}
      </DialogDescription>
      <div className="shards-earned">
        <Sparkle size={16} />
        <span>+{shardsGained} {t.wisdomShards}</span>
      </div>
      <div className="quote-dialog-layout">
        <div className="quote-side">
          <div className="quote-text-large" style={{ '--rarity': color } as React.CSSProperties}>
            <span className="quote-mark">&ldquo;</span>
            <p className="main-quote">{displayText}</p>
            <span className="quote-mark right">&rdquo;</span>
            {quote.textOriginal && quote.textOriginal !== quote.text && (
              <p className="original-quote">{quote.textOriginal}</p>
            )}
          </div>
          <div className="meaning-box">
            <span className="meaning-label">{t.meaning}:</span>
            <p className="meaning-text">{quote.meaning}</p>
          </div>
        </div>
          <div className="philosopher-side">
          <div className="philosopher-card" style={{ '--rarity': color } as React.CSSProperties}>
            <div className="philosopher-avatar-large">
              {(() => {
                const hasImage = hasPhilosopherImage(philosopher.imageUrl);
                if (hasImage) {
                  const avatarUrl = getPhilosopherAvatarUrl(philosopher.imageUrl, 'large');
                  return <img src={avatarUrl} alt={philosopher.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', borderRadius: '50%' }} />;
                }
                return getPhilosopherInitials(philosopher.name);
              })()}
            </div>
            <h3 className="philosopher-name">{philosopher.name}</h3>
            {philosopher.nameOriginal && <p className="philosopher-original">{philosopher.nameOriginal}</p>}
            <div className="philosopher-info">
              <div className="info-row">
                <span className="info-label">{t.era}:</span>
                <span className="info-value">{philosopher.era}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t.country}:</span>
                <span className="info-value">{philosopher.country}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t.school}:</span>
                <span className="info-value">{philosopher.school}</span>
              </div>
              {philosopher.notableWorks.length > 0 && (
                <div className="info-row works-row">
                  <span className="info-label">{t.works}:</span>
                  <span className="info-value">{philosopher.notableWorks.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="winner-actions">
        <a className="find-button" href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(philosopher.name)}`} target="_blank" rel="noreferrer">{t.find} <Globe size={16} /></a>
        <button onClick={onClose}>{t.continue}</button>
      </div>
    </>
  );
}

function LockedQuoteDialog({
  quote,
  philosopher,
  language,
  shards,
  onUnlock,
  onClose,
}: {
  quote: Quote;
  philosopher: typeof philosophers[number];
  language: Language;
  shards: number;
  onUnlock: () => void;
  onClose: () => void;
}) {
  const t = copy[language];
  const color = RARITY_COLORS_LIST[quote.rarity - 3];
  const cost = UNLOCK_COST[quote.rarity];
  const canAfford = shards >= cost;

  return (
    <>
      <span className="winner-label">{t.locked}</span>
      <DialogTitle className="winner-title">{t.tiers[quote.rarity - 3]}</DialogTitle>
      <DialogDescription className="winner-description">
        {quote.text}
      </DialogDescription>
      <div className="quote-dialog-layout">
        <div className="quote-side">
          <div className="quote-text-large locked" style={{ '--rarity': color } as React.CSSProperties}>
            <span className="quote-mark">&ldquo;</span>
            <p>{quote.text}</p>
            <span className="quote-mark right">&rdquo;</span>
          </div>
          <div className="meaning-box locked">
            <span className="meaning-label">{t.meaning}:</span>
            <p className="meaning-text">{t.lockedMystery}</p>
          </div>
          <div className="philosopher-info-locked">
            <div className="info-row">
              <span className="info-label">{t.philosopher}:</span>
              <span className="info-value">{t.lockedMystery}</span>
            </div>
            <div className="info-row">
              <span className="info-label">{t.school}:</span>
              <span className="info-value">{t.lockedMystery}</span>
            </div>
          </div>
        </div>
        <div className="philosopher-side">
          <div className="philosopher-card locked" style={{ '--rarity': color } as React.CSSProperties}>
            <div className="philosopher-avatar-large locked">
              <Lock size={32} />
            </div>
            <h3 className="philosopher-name">{t.locked}</h3>
            <div className="unlock-cost">
              <Gem size={18} color={canAfford ? color : '#666'} />
              <span style={{ color: canAfford ? color : '#666' }}>
                {cost} {t.shards}
              </span>
            </div>
            <div className="current-shards">
              <span>{t.wisdomShards}: {shards}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="winner-actions">
        <button className="unlock-button" onClick={onUnlock} disabled={!canAfford}>
          <Unlock size={16} />
          {canAfford ? t.unlockWithCost.replace('{cost}', String(cost)) : t.notEnoughShards}
        </button>
        <button onClick={onClose}>{t.continue}</button>
      </div>
    </>
  );
}

export default function Home() {
  const { count: localSpins, enabled: counterEnabled, recordSpin } = useLocalSpinCount();
  const {
    shards,
    pity4Remaining,
    pity5Remaining,
    pity4Count,
    pity5Count,
    isUnlocked,
    onSpinResult,
    unlockQuote,
    ready: wisdomReady,
    welcomeBonusApplied,
    reloadPity,
  } = useWisdomShards();

  const [language, setLanguage] = useState<Language>('vi');
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

  useEffect(() => {
    if (welcomeBonusApplied) {
      setShowWelcomeToast(true);
      const timer = setTimeout(() => setShowWelcomeToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [welcomeBonusApplied]);
  const [sound, setSound] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Quote | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  const [shardsGained, setShardsGained] = useState(0);
  const [isNewUnlock, setIsNewUnlock] = useState(false);
  const selectedPhilosopher = selectedQuote ? philosopherMap.get(selectedQuote.philosopherId) : null;

  const [reel, setReel] = useState(() => quotes.slice(0, 12).map((quote, id) => ({ quote, id })));
  const [moving, setMoving] = useState(false);
  const busy = useRef(false);
  const viewport = useRef<HTMLDivElement>(null);
  const pity4CountRef = useRef(pity4Count);
  const pity5CountRef = useRef(pity5Count);

  useEffect(() => {
    pity4CountRef.current = pity4Count;
    pity5CountRef.current = pity5Count;
  }, [pity4Count, pity5Count]);

  useEffect(() => {
    let selected: Language = 'vi';
    try { const saved = readCookie<string>('language'); selected = saved === 'en' || saved === 'vi' ? saved : 'vi' } catch {}
    setLanguage(selected);
    document.documentElement.lang = selected;
    document.title = selected === 'en' ? 'Which philosophy quote?' : 'Câu Nói Triết Nào?';
  }, []);

  const changeLanguage = (next: Language) => {
    setLanguage(next);
    document.documentElement.lang = next;
    document.title = next === 'en' ? 'Which philosophy quote?' : 'Câu Nói Triết Nào?';
    try { writeCookie('language', next) } catch {}
  };

  const [preferencesReady, setPreferencesReady] = useState(false);
  const [cookieError, setCookieError] = useState('');
  useEffect(() => {
    const saved = readCookie<Record<string, unknown>>('settings');
    if (saved && typeof saved === 'object') {
      if (typeof saved.sound === 'boolean') setSound(saved.sound);
    }
    setPreferencesReady(true);
  }, []);

  useEffect(() => {
    if (preferencesReady) {
      try { writeCookie('settings', { sound }); setCookieError('') } catch { setCookieError(language === 'vi' ? 'Không thể lưu cookie.' : 'Cookies unavailable.') }
    }
  }, [preferencesReady, sound, language]);

  const population = quotes;
  const eligible = useMemo(() => population, [population]);

  const audio = useRef<CaseAudio | null>(null);
  useEffect(() => {
    const origin = window.location.origin;
    const engine = new CaseAudio(origin);
    audio.current = engine;
    try { engine.preload(); } catch (e) { console.error('Audio preload failed:', e); }
    const hide = () => { if (document.hidden) engine.pause(); else engine.recover() };
    document.addEventListener('visibilitychange', hide);
    return () => { document.removeEventListener('visibilitychange', hide); engine.dispose(); audio.current = null };
  }, []);

  const [visibleStart, setVisibleStart] = useState(0);
  const t = copy[language];

  const inventoryCards = useMemo(() =>
    [...eligible].sort((a, b) => a.rarity - b.rarity || a.id.localeCompare(b.id)).map(q => (
      <Card
        key={q.id}
        quote={q}
        language={language}
        small
        isUnlocked={isUnlocked(q.id)}
        onClick={() => {
          setSelectedQuote(q);
          if (isUnlocked(q.id)) {
            setResult(q);
            setShardsGained(0);
            setRevealed(true);
          } else {
            setShowLockedDialog(true);
          }
        }}
      />
    )), [eligible, language, isUnlocked]);

  const track = useRef<HTMLDivElement>(null);
  const position = useRef(-400);
  const attachTrack = useCallback((node: HTMLDivElement | null) => {
    track.current = node;
    if (node) node.style.transform = `translate3d(${position.current}px,0,0)`;
  }, []);
  const frame = useRef(0);
  useEffect(() => {
    if (spinning || !eligible.length) return;
    setReel(current => current.map(item => ({
      ...item,
      quote: eligible.find((q: Quote) => q.id === item.quote.id) || chooseTieredWithPity(eligible, pity4CountRef.current, pity5CountRef.current).item,
    })));
  }, [eligible, spinning]);

  useEffect(() => () => { cancelAnimationFrame(frame.current) }, []);

  function open() {
    if (busy.current || !eligible.length || !track.current || !viewport.current) return;
    audio.current?.unlock();
    busy.current = true;
    const currentPity4 = pity4CountRef.current;
    const currentPity5 = pity5CountRef.current;
    const { item: winner, pity4Reset, pity5Reset } = chooseTieredWithPity(eligible, currentPity4, currentPity5);
    if (pity4Reset) pity4CountRef.current = 0;
    else pity4CountRef.current = currentPity4 + 1;
    if (pity5Reset) pity5CountRef.current = 0;
    else pity5CountRef.current = currentPity5 + 1;

    const step = 254, tileWidth = 240, width = viewport.current.clientWidth;
    const start = position.current;
    const center = Math.floor((width / 2 - start) / step);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const profile = createSpinProfile(Math.random, reducedMotion);
    const target = center + profile.tiles;
    const end = width / 2 - tileWidth * stopFraction() - target * step;
    const rightEdge = Math.ceil((width - start) / step) + 1;
    const items = reel.filter(item => item.id >= center - Math.ceil(width / step) - 2 && item.id <= rightEdge);
    const last = Math.max(...items.map(item => item.id));
    const recent: Quote[] = [];
    for (let id = last + 1; id <= target + 4; id++) {
      const alternatives = eligible.filter((q: Quote) => !recent.includes(q));
      const quote = id === target ? winner : chooseTieredWithPity(alternatives.length ? alternatives : eligible, pity4CountRef.current, pity5CountRef.current).item;
      items.push({ id, quote });
      recent.push(quote);
      if (recent.length > 8) recent.shift();
    }
    flushSync(() => { setReel(items); setSpinning(true); setMoving(true); setResult(null) });
    audio.current?.play('csgo_ui_crate_open');
    const duration = profile.durationMs;
    const started = performance.now();
    let renderedStart = visibleStart;
    let lastCell = Math.floor((start - width / 2) / step);
    const animate = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - started) / duration));
      const next = start + (end - start) * spinProgress(progress, profile.friction);
      position.current = next;
      const firstVisible = Math.max(0, Math.floor(-next / step));
      if (firstVisible - renderedStart >= 4 || firstVisible < renderedStart) { renderedStart = Math.max(0, firstVisible - 2); setVisibleStart(renderedStart) }
      if (track.current) track.current.style.transform = `translate3d(${next}px,0,0)`;
      const cell = Math.floor((next - width / 2) / step);
      if (cell !== lastCell) { audio.current?.play('csgo_ui_crate_item_scroll'); lastCell = cell }
      if (progress < 1) { frame.current = requestAnimationFrame(animate); return }
      recordSpin(winner);
      const { gainedShards, isNew } = onSpinResult(winner);
      setShardsGained(gainedShards);
      setIsNewUnlock(isNew);
      busy.current = false; setSpinning(false); setMoving(false); setResult(winner); setRevealed(true);
      const soundIndex = winner.rarity - 3;
      audio.current?.play((['item_reveal3_rare', 'item_reveal4_mythical', 'item_reveal5_legendary'] as const)[soundIndex]);
    };
    frame.current = requestAnimationFrame(animate);
  }

  const handleUnlock = () => {
    if (!selectedQuote) return;
    const success = unlockQuote(selectedQuote);
    if (success) {
      setShowLockedDialog(false);
      setResult(selectedQuote);
      setShardsGained(0);
      setRevealed(true);
    }
  };

  if (!wisdomReady) return null;

  return <div className="site-shell">
    <header>
      <a href={`${basePath}/`} className="brand">
        <img src="/brand/logo.png" alt="Câu Nói Triết Nào" className="brand-logo-img" />
        <span className="brand-text">CÂU NÓI TRIẾT NÀO?</span>
      </a>
      <div className="header-actions">
        <div className="shards-display" title={t.wisdomShards}>
          <Gem size={18} />
          <span>{shards}</span>
        </div>
        {pity4Remaining <= 3 && (
          <div className="pity-display pity-4" title={t.pity4Warning.replace('{n}', String(pity4Remaining))}>
            <Sparkle size={14} />
            <span>{pity4Remaining}</span>
          </div>
        )}
        {pity5Remaining <= 5 && (
          <div className="pity-display pity-5" title={t.pity5Warning.replace('{n}', String(pity5Remaining))}>
            <Sparkle size={14} />
            <span>{pity5Remaining}</span>
          </div>
        )}
        <button className="language-button" onClick={() => changeLanguage(language === 'vi' ? 'en' : 'vi')} aria-label={t.language}>
          {language === 'vi' ? 'EN' : 'VI'}
        </button>
        <button className="sound-button" onClick={() => { audio.current?.setMuted(sound); setSound(!sound) }} aria-label={sound ? t.turnSoundOff : t.turnSoundOn}>
          {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>{sound ? t.soundOn : t.soundOff}</span>
        </button>
        <a className="social-button github-button" href="https://www.facebook.com/mid.best.568/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg className="github-mark" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          <span className="github-label">Facebook</span>
        </a>
      </div>
    </header>

    <main>
      {cookieError && <p role="status" className="preferences-message">{cookieError}</p>}
      <div className="intro"><h1>{t.title}</h1></div>
      {!eligible.length && <p className="preferences-message">{language === 'vi' ? 'Pool không có câu nói phù hợp.' : 'No matching quotes.'}</p>}
      {counterEnabled && <p className="local-counter" title={language === 'vi' ? 'Lượt mở trên trình duyệt này' : 'Spins on this browser'}>
        {language === 'vi' ? 'Bạn đã mở' : 'You have opened'} <strong>{localSpins === null ? '—' : new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US').format(localSpins)}</strong> {language === 'vi' ? 'hòm trên trình duyệt này' : 'cases on this browser'}
      </p>}
      {pity4Remaining <= 3 && (
        <p className="pity-warning pity-4-warning">{t.pity4Warning.replace('{n}', String(pity4Remaining))}</p>
      )}
      {pity5Remaining <= 5 && (
        <p className="pity-warning pity-5-warning">{t.pity5Warning.replace('{n}', String(pity5Remaining))}</p>
      )}

      <section className="case-panel" aria-label={t.caseLabel}>
        <div className={`reel-window ${moving ? 'is-spinning' : ''} `} ref={viewport}>
          <div className="selector-line" />
          <div className="reel-track" ref={attachTrack}>
            {reel.filter(({ id }) => id >= visibleStart && id < visibleStart + 12).map(({ quote, id }) => (
              <Card key={id} quote={quote} language={language} slot={id} isUnlocked={isUnlocked(quote.id)} onClick={() => {}} />
            ))}
          </div>
          <div className="reel-fade left" />
          <div className="reel-fade right" />
        </div>
      </section>

      <div className="control-bar">
        <div className="open-wrap">
          <button className="open-button" disabled={spinning || !eligible.length} onClick={open}>
            {spinning ? <AudioLines size={22} /> : <Sparkles size={21} />}
            {spinning ? t.opening : result ? t.openAgain : t.open}
          </button>
        </div>
      </div>

      <Dialog open={revealed} onOpenChange={setRevealed}>
        <DialogContent className={`winner-dialog ${result?.rarity === 5 ? 'rarity-5' : ''}`} showCloseButton={false}>
          {result && (
            <QuoteResultDialog
              quote={result}
              philosopher={philosopherMap.get(result.philosopherId)!}
              language={language}
              shardsGained={shardsGained}
              isNew={isNewUnlock}
              onClose={() => setRevealed(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
        <DialogContent className="locked-dialog" showCloseButton={false}>
          {selectedQuote && selectedPhilosopher && (
            <LockedQuoteDialog
              quote={selectedQuote}
              philosopher={selectedPhilosopher}
              language={language}
              shards={shards}
              onUnlock={handleUnlock}
              onClose={() => setShowLockedDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <section className="inventory">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t.whatsInside}</span>
            <div className="inventory-title-row">
              <h2>{t.items} <span>{eligible.length.toString().padStart(2, '0')}</span></h2>
            </div>
          </div>
          <div className="rarity-legend">
            {t.tiers.map((tier, i) => <span key={tier}><i style={{ background: RARITY_COLORS_LIST[i] }} />{tier}</span>)}
          </div>
        </div>
        <div className="inventory-grid">{inventoryCards}</div>
      </section>

      <footer>
        <span>Câu Nói Triết Nào? · <a href={`${basePath}/privacy.html`}>{language === 'vi' ? 'Quyền riêng tư' : 'Privacy'}</a> · <a href={`${basePath}/terms.html`}>{language === 'vi' ? 'Điều khoản' : 'Terms'}</a></span>
        <span>{t.footer} <a href="https://github.com/sourcesounds/csgo" target="_blank" rel="noreferrer">SourceSounds</a></span>
      </footer>

      {showWelcomeToast && (
        <div className="welcome-toast">
          <Sparkle size={20} />
          <span>Chào mừng! Bạn nhận 20 Mảnh Trí Tuệ miễn phí</span>
        </div>
      )}
    </main>
  </div>;
}
