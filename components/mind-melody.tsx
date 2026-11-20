'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, Brain, Cat, ChevronRight, Disc3, FlaskConical, Heart, Music2, Rabbit, Sparkles, Volume2, VolumeX, X } from 'lucide-react'

type Mood = { name: string; face: string; sound: string; note: string; description: string; frequencies: number[]; color: string }
const moods: Mood[] = [
  { name: 'Sad', face: '〰', sound: 'A slow, tender minor-key piano phrase with descending notes, spacious pauses, and a soft ending.', note: 'Saat Kata Belum Sampai', description: 'Untuk saat sedihnya ada, tapi kata-katanya belum ketemu.', frequencies: [440,392,349,330,392,349,294,330,349,294,262,294,330,294,262,220], color: 'mood-sad' },
  { name: 'Happy', face: '☼', sound: 'A bright major-key piano melody, light rhythmic movement, and a playful but gentle character.', note: 'Hari Ini, Aku Ringan', description: 'Untuk senang kecil yang ingin dinikmati sedikit lebih lama.', frequencies: [523,659,784,659,587,698,880,784,659,784,988,880,784,659,587,523], color: 'mood-happy' },
  { name: 'Calm', face: '☾', sound: 'Warm, unhurried piano chords, open voicings, and long, soft releases.', note: 'Pelan Juga Sampai', description: 'Tidak semuanya harus selesai sekarang.', frequencies: [392,523,659,523,440,587,698,587,349,523,659,523,392,523,587,523], color: 'mood-calm' },
  { name: 'Stressed', face: '✳', sound: 'Sparse, steady piano notes over a very quiet ambient texture. No tense alarms, sudden impacts, or harsh sounds.', note: 'Ramai di Kepala', description: 'Kalau banyak yang datang sekaligus, kita dengarkan satu nada dulu.', frequencies: [392,392,440,392,349,392,440,392,392,349,392,440,392,349,330,392], color: 'mood-stressed' },
  { name: 'Motivated', face: '↗', sound: 'A gently building piano pattern, a clear pulse, and an uplifting resolution.', note: 'Coba Sekali Lagi', description: 'Untuk keinginan kecil yang belum mau kamu lepaskan.', frequencies: [392,494,587,494,440,554,659,554,494,587,698,587,523,659,784,1047], color: 'mood-motivated' },
  { name: 'Curious', face: '✳', sound: 'A playful piano motif with unexpected pauses and a lightly unresolved ending.', note: 'Kalau Ternyata…', description: 'Untuk pertanyaan kecil yang mengajakmu mencoba.', frequencies: [523,659,622,784,698,523,880,784,622,740,659,523,698,831,622,740], color: 'mood-curious' },
]
const thoughts = [
  { title: 'Psychology', icon: Brain, text: 'Why do we feel the things we feel? I keep coming back to that question.' },
  { title: 'Music', icon: Music2, text: 'A song can hold a whole feeling without needing to explain it.' },
  { title: 'Research', icon: FlaskConical, text: 'I like following a small “what if” until it becomes something real.' },
  { title: 'History', icon: Disc3, text: 'The stories we carry say more about us than we think.' },
  { title: 'Coding', icon: Sparkles, text: 'A blank page can become a tiny world someone else can visit.' },
  { title: 'Writing', icon: Heart, text: 'Sometimes a sentence is the gentlest way to understand a thought.' },
]
const questions = [
  { title: 'Does music affect mood?', text: 'We could compare the same moment with different tempos, lyrics, and silences. What changes—and what stays yours?', color: 'room-blue' },
  { title: 'Can singing help regulate emotions?', text: 'Maybe making a sound gives a feeling somewhere to go. I wonder how it feels to sing alone, or together.', color: 'room-coral' },
  { title: 'What does your favorite genre say about you?', text: 'Not a personality test. More like a little map of memory, identity, and the songs that feel like home.', color: 'room-lilac' },
]

export function MindMelody() {
  const [pianoPlaying, setPianoPlaying] = useState(false)
  const [volume, setVolume] = useState(0.62)
  const [pianoError, setPianoError] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [repeat, setRepeat] = useState(false)
  const playbackStartedAt = useRef(0)
  const playbackOffset = useRef(0)
  const playbackTick = useRef<number | null>(null)
  const masterGain = useRef<GainNode | null>(null)
  const playbackGeneration = useRef(0)
  const [catMood, setCatMood] = useState('rest')
  const [toyVisible, setToyVisible] = useState(false)
  const [toyPosition, setToyPosition] = useState({ x: 78, y: 75 })
  const toyArea = useRef<HTMLDivElement>(null)
  const toyDragged = useRef(false)
  const customCursor = useRef<HTMLSpanElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [room, setRoom] = useState<string | null>(null)
  const [mood, setMood] = useState<Mood | null>(moods[0])
  const [impact, setImpact] = useState(62)
  const [muted, setMuted] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [motionPaused, setMotionPaused] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  const [openingIntro, setOpeningIntro] = useState(true)
  const [introReady, setIntroReady] = useState(false)
  const [introEntering, setIntroEntering] = useState(false)
  const [heroEntered, setHeroEntered] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [bunnyMove, setBunnyMove] = useState('rest')
  const [catMove, setCatMove] = useState('rest')
  const [catPushing, setCatPushing] = useState(false)
  const [catEasing, setCatEasing] = useState(false)
  const carousel = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const introButtonRef = useRef<HTMLButtonElement>(null)
  const introTimer = useRef<number | null>(null)
  const introTransitionTimer = useRef<number | null>(null)
  const bunnyTimer = useRef<number | null>(null)
  const bunnyBusy = useRef(false)
  const catBusy = useRef(false)
  const catQueued = useRef(false)
  const catTimer = useRef<number | null>(null)
  const catStageTimer = useRef<number | null>(null)
  const catTriggerRef = useRef<() => void>(() => {})
  const audio = useRef<AudioContext | null>(null)
  const oscillators = useRef<{ oscillator: OscillatorNode; gain: GainNode }[]>([])
  const stopTimer = useRef<number | null>(null)

  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); setRoom(null) } }
    window.addEventListener('keydown', key)
      return () => { window.removeEventListener('keydown', key); if (stopTimer.current) window.clearTimeout(stopTimer.current); if (playbackTick.current) window.clearInterval(playbackTick.current); oscillators.current.forEach(({ oscillator }) => { try { oscillator.stop() } catch {} }); if (audio.current) void audio.current.close() }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (openingIntro || !heroEntered || reducedMotion || motionPaused || !heroVisible || !tabVisible) return
    let sequenceTimer = 0
    const run = () => {
      if (catBusy.current) {
        bunnyTimer.current = window.setTimeout(run, 600)
        return
      }
      setBunnyMove('playful')
      bunnyBusy.current = true
      sequenceTimer = window.setTimeout(() => {
        setBunnyMove('rest')
        bunnyBusy.current = false
        bunnyTimer.current = window.setTimeout(run, 8000 + Math.random() * 6000)
      }, 2300)
    }
    bunnyTimer.current = window.setTimeout(() => {
      if (catBusy.current) {
        bunnyTimer.current = window.setTimeout(run, 600)
        return
      }
      setBunnyMove('greeting')
      bunnyBusy.current = true
      sequenceTimer = window.setTimeout(() => {
        setBunnyMove('rest')
        bunnyBusy.current = false
        bunnyTimer.current = window.setTimeout(run, 8000 + Math.random() * 6000)
      }, 1200)
    }, 3900)
    return () => {
      if (bunnyTimer.current) window.clearTimeout(bunnyTimer.current)
      if (sequenceTimer) window.clearTimeout(sequenceTimer)
      bunnyBusy.current = false
    }
  }, [openingIntro, heroEntered, reducedMotion, motionPaused, heroVisible, tabVisible])

  useEffect(() => {
    if (reducedMotion) {
      setIntroReady(true)
      if (introTimer.current) window.clearTimeout(introTimer.current)
      return
    }
    if (!openingIntro) return
    introTimer.current = window.setTimeout(() => setIntroReady(true), 1800)
    return () => { if (introTimer.current) window.clearTimeout(introTimer.current) }
  }, [openingIntro, reducedMotion])

  useEffect(() => {
    if (openingIntro && introReady) introButtonRef.current?.focus()
  }, [openingIntro, introReady])

  useEffect(() => {
    if (openingIntro || !heroEntered || reducedMotion || motionPaused || !heroVisible || !tabVisible) return
    catTimer.current = window.setTimeout(() => catTriggerRef.current(), 950)
    return () => {
      if (catTimer.current) window.clearTimeout(catTimer.current)
      if (catStageTimer.current) window.clearTimeout(catStageTimer.current)
      catBusy.current = false
      catQueued.current = false
      setCatMove('rest')
      setCatPushing(false)
      setCatEasing(false)
    }
  }, [openingIntro, heroEntered, reducedMotion, motionPaused, heroVisible, tabVisible])

  useEffect(() => () => {
    if (introTimer.current) window.clearTimeout(introTimer.current)
    if (introTransitionTimer.current) window.clearTimeout(introTransitionTimer.current)
    if (catTimer.current) window.clearTimeout(catTimer.current)
    if (catStageTimer.current) window.clearTimeout(catStageTimer.current)
  }, [])

  useEffect(() => {
    const updateVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    const updateCursor = (event: PointerEvent) => {
      if (!customCursor.current) return
      if (event.pointerType === 'touch') {
        customCursor.current.style.opacity = '0'
        document.documentElement.classList.remove('note-cursor-active')
        return
      }
      document.documentElement.classList.add('note-cursor-active')
      const interactive = event.target instanceof Element && Boolean(event.target.closest('a,button,input,select,textarea,summary,p,h1,h2,h3,h4,li,label,small,[role="slider"]'))
      customCursor.current.style.opacity = interactive ? '0' : '1'
      customCursor.current.style.transform = `translate3d(${event.clientX + 12}px, ${event.clientY + 10}px, 0)`
    }
    window.addEventListener('pointermove', updateCursor, { passive: true })
    document.documentElement.classList.add('note-cursor-ready')
    return () => { window.removeEventListener('pointermove', updateCursor); document.documentElement.classList.remove('note-cursor-ready', 'note-cursor-active') }
  }, [])

  useEffect(() => {
    if (masterGain.current && audio.current) masterGain.current.gain.setTargetAtTime(muted ? 0 : volume, audio.current.currentTime, 0.025)
  }, [muted, volume])

  const lookAtPointer = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-3, Math.min(3, ((event.clientX - bounds.left) / bounds.width - 0.5) * 6))
    const y = Math.max(-2, Math.min(2, ((event.clientY - bounds.top) / bounds.height - 0.5) * 4))
    event.currentTarget.style.setProperty('--gaze-x', `${x}px`)
    event.currentTarget.style.setProperty('--gaze-y', `${y}px`)
  }

  const petCat = () => {
    if (catBusy.current) return
    if (catTimer.current) window.clearTimeout(catTimer.current)
    if (catStageTimer.current) window.clearTimeout(catStageTimer.current)
    setToyVisible(false)
    catBusy.current = true
    setCatMood('petted')
    setCatMove('blink')
    catStageTimer.current = window.setTimeout(() => {
      setCatMood('rest')
      setCatMove('rest')
      catBusy.current = false
    }, 1500)
  }

  const pushRecord = () => triggerCat()

  const playToy = () => {
    if (catBusy.current && !toyVisible) return
    if (toyVisible) {
      if (catStageTimer.current) window.clearTimeout(catStageTimer.current)
      catBusy.current = false
      setToyVisible(false)
      setCatMood('rest')
      setCatMove('rest')
      return
    }
    if (catStageTimer.current) window.clearTimeout(catStageTimer.current)
    catBusy.current = true
    setToyPosition({ x: 77, y: 77 })
    setToyVisible(true)
    setCatMood('curious')
    catStageTimer.current = window.setTimeout(() => {
      setCatMood('playing')
      setToyPosition({ x: 86, y: 67 })
      catStageTimer.current = window.setTimeout(() => {
        setToyPosition({ x: 74, y: 72 })
        catStageTimer.current = window.setTimeout(() => { setToyVisible(false); setCatMood('rest'); setCatMove('rest'); catBusy.current = false }, 700)
      }, 650)
    }, 650)
  }

  const moveToy = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!toyArea.current) return
    const bounds = toyArea.current.getBoundingClientRect()
    setToyPosition({ x: Math.max(8, Math.min(92, ((event.clientX - bounds.left) / bounds.width) * 100)), y: Math.max(8, Math.min(92, ((event.clientY - bounds.top) / bounds.height) * 100)) })
    setCatMood('curious')
    setCatMove('reaching')
    if (catStageTimer.current) window.clearTimeout(catStageTimer.current)
    catStageTimer.current = window.setTimeout(() => { setToyVisible(false); setCatMove('rest'); setCatMood('rest'); catBusy.current = false }, 1600)
  }

  const happyHop = () => {
    if (reducedMotion || bunnyBusy.current || catBusy.current) return
    bunnyBusy.current = true
    setBunnyMove('happy')
    window.setTimeout(() => { setBunnyMove('rest'); bunnyBusy.current = false }, 900)
  }

  const triggerCat = useCallback(() => {
    if (!heroEntered || reducedMotion || catBusy.current || catQueued.current) return
    if (bunnyBusy.current) {
      catQueued.current = true
      catTimer.current = window.setTimeout(() => {
        catQueued.current = false
        catTriggerRef.current()
      }, 500)
      return
    }
    if (catTimer.current) window.clearTimeout(catTimer.current)
    catBusy.current = true
    setCatMove('look')
    const stage = (delay: number, action: () => void) => {
      catStageTimer.current = window.setTimeout(action, delay)
    }
    stage(260, () => {
      setCatMove('reaching')
      stage(320, () => {
        setCatMove('pushing')
        setCatPushing(true)
        setCatEasing(false)
        stage(260, () => {
          setCatPushing(false)
          setCatEasing(true)
          setCatMove('withdrawing')
          stage(640, () => {
            setCatEasing(false)
            setCatMove('blink')
            stage(220, () => {
              setCatMove('rest')
              catBusy.current = false
              catTimer.current = window.setTimeout(() => catTriggerRef.current(), 8000 + Math.random() * 6000)
            })
          })
        })
      })
    })
  }, [heroEntered, reducedMotion])

  useEffect(() => { catTriggerRef.current = triggerCat }, [triggerCat])

  const enterHero = (skip = false) => {
    if (!openingIntro || introEntering || (!skip && !introReady)) return
    if (introTimer.current) window.clearTimeout(introTimer.current)
    setHeroEntered(true)
    if (skip) {
      setOpeningIntro(false)
      requestAnimationFrame(() => heroRef.current?.focus())
      return
    }
    setIntroEntering(true)
    introTransitionTimer.current = window.setTimeout(() => {
      setOpeningIntro(false)
      setIntroEntering(false)
      requestAnimationFrame(() => heroRef.current?.focus())
    }, reducedMotion ? 180 : 720)
  }

  const stopSound = useCallback(() => {
    if (stopTimer.current) window.clearTimeout(stopTimer.current)
    if (playbackTick.current) window.clearInterval(playbackTick.current)
    const nodes = [...oscillators.current]
    oscillators.current = []
    nodes.forEach(({ oscillator, gain }) => {
      try {
        const now = audio.current?.currentTime ?? 0
        gain.gain.cancelScheduledValues(now)
        gain.gain.setTargetAtTime(0.0001, now, 0.04)
        oscillator.stop(now + 0.2)
      } catch {}
    })
  }, [])

  const playMood = useCallback((selected: Mood) => {
    playbackGeneration.current += 1
    stopSound()
    playbackOffset.current = 0
    setElapsed(0)
    setMood(selected)
    setPianoPlaying(false)
    setPianoError(false)
  }, [stopSound])

  const startPlayback = useCallback(async (offset = playbackOffset.current, selectedTrack = mood) => {
    if (!selectedTrack || muted) return
    setPianoError(false)
    const generation = ++playbackGeneration.current
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) throw new Error('Web Audio is unavailable')
      const context = audio.current ?? new AudioContextClass()
      audio.current = context
      if (context.state === 'suspended') await context.resume()
      if (generation !== playbackGeneration.current) return
      if (!masterGain.current) {
        masterGain.current = context.createGain()
        masterGain.current.connect(context.destination)
      }
      const master = masterGain.current
      master.gain.setTargetAtTime(muted ? 0 : volume, context.currentTime, 0.025)
      const beat = selectedTrack.name === 'Motivated' || selectedTrack.name === 'Happy' ? 0.82 : selectedTrack.name === 'Stressed' ? 1.08 : 0.96
      const duration = 16
      const start = context.currentTime
      playbackStartedAt.current = start - offset
      const notes = selectedTrack.frequencies
      Array.from({ length: Math.ceil(duration / beat) }, (_, index) => {
        const at = index * beat
        const frequency = notes[index % notes.length]
        if (at < offset || at >= duration) return
        const noteStart = start + at - offset
        const oscillator = context.createOscillator()
        const envelope = context.createGain()
        const noteLength = selectedTrack.name === 'Calm' || selectedTrack.name === 'Sad' ? 0.76 : 0.52
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(frequency, noteStart)
        oscillator.detune.setValueAtTime(index % 3 === 0 ? -4 : 3, noteStart)
        envelope.gain.setValueAtTime(0.0001, noteStart)
        envelope.gain.exponentialRampToValueAtTime(0.055, noteStart + 0.035)
        envelope.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteLength)
        oscillator.connect(envelope)
        envelope.connect(master)
        oscillator.start(noteStart)
        oscillator.stop(noteStart + noteLength + 0.02)
        oscillators.current.push({ oscillator, gain: envelope })
      })
      setPianoPlaying(true)
      playbackTick.current = window.setInterval(() => {
        if (generation !== playbackGeneration.current || !audio.current) return
        const time = Math.min(duration, Math.max(0, audio.current.currentTime - playbackStartedAt.current))
        playbackOffset.current = time
        setElapsed(time)
      }, 100)
      stopTimer.current = window.setTimeout(() => {
        if (generation !== playbackGeneration.current) return
        stopSound()
        setPianoPlaying(false)
        setElapsed(duration)
        playbackOffset.current = repeat ? 0 : duration
        if (repeat) { setElapsed(0); void startPlayback(0, selectedTrack) }
      }, Math.max(0, duration - offset) * 1000)
    } catch {
      stopSound()
      setPianoPlaying(false)
      setPianoError(true)
    }
  }, [mood, muted, repeat, stopSound, volume])

  const togglePlayback = () => {
    if (pianoPlaying) {
      const position = audio.current ? Math.min(16, audio.current.currentTime - playbackStartedAt.current) : playbackOffset.current
      playbackOffset.current = position
      setElapsed(position)
      playbackGeneration.current += 1
      stopSound()
      setPianoPlaying(false)
      return
    }
    if (!mood) setMood(moods[0])
    void startPlayback(playbackOffset.current >= 16 ? 0 : playbackOffset.current)
  }

  const changeTrack = (direction: number) => {
    const currentIndex = Math.max(0, moods.findIndex(item => item.name === mood?.name))
    const next = moods[(currentIndex + direction + moods.length) % moods.length]
    const wasPlaying = pianoPlaying
    playMood(next)
    if (wasPlaying) { playbackOffset.current = 0; window.setTimeout(() => void startPlayback(0, next), 0) }
  }

  const toggleMute = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    if (masterGain.current && audio.current) masterGain.current.gain.setTargetAtTime(nextMuted ? 0 : volume, audio.current.currentTime, 0.02)
  }
  const response = impact > 70 ? 'Musik jelas jadi bagian penting dari dunia emosimu.' : impact > 35 ? 'Kamu tahu kapan sebuah lagu bisa menemanimu.' : 'Mungkin kamu peneliti psikologi musik masa depan.'
  const enterRoom = (next: string) => { setMenuOpen(false); setRoom(next) }

  return <>
    <span ref={customCursor} className="custom-cursor" aria-hidden="true"><svg viewBox="0 0 20 24" width="17" height="20" fill="none"><path d="M12.8 3v12.1a3.1 3.1 0 1 1-1.5-2.7V6.2l6.1-1.5v8.1a3.1 3.1 0 1 1-1.5-2.7V3.7L12.8 4.3" fill="#9b81ba" stroke="#2f4858" strokeWidth=".8" strokeLinejoin="round"/><path d="M4 20c1.4-.3 2.3-1.1 2.7-2.3" stroke="#e88c7d" strokeWidth="1.1" strokeLinecap="round"/></svg></span>
    {openingIntro && <div className={`opening-intro ${introEntering ? 'opening-leaving' : ''}`} data-ready={introReady} role="dialog" aria-modal="true" aria-labelledby="opening-title"><div className="opening-content"><div className="opening-mark"><svg className="opening-wave" viewBox="0 0 330 52" fill="none" aria-hidden="true"><path d="M2 27h73c10 0 11-17 20-17s10 33 20 33 10-25 20-25 10 15 20 15 10-23 20-23 11 17 21 17h132"/></svg><span className="opening-bunny" aria-hidden="true"><svg viewBox="0 0 48 54" fill="none"><path className="opening-ears" d="M17 23C9 12 12 2 16 3s8 11 8 18m5 1c0-11 7-19 11-16s-1 13-6 20"/><path d="M10 37c0-9 6-15 14-15s15 6 15 15-6 14-15 14S10 45 10 37Z"/><path d="M19 36v2m10-2v2m-5 3v2m0 0-2 1m2-1 2 1"/></svg></span></div><h1 id="opening-title">Mind <em>Melody</em></h1><p>a little music, a little curiosity — by Syan</p><p className="opening-meaning">Mind Melody adalah caraku mempertemukan pikiran dan nada—sebab tidak semua yang kita rasakan mudah menjadi kata, kadang ia lebih dulu menemukan bentuknya dalam musik.</p><p className="opening-supporting">Kalau hari ini rasamu belum punya nama, kamu boleh masuk tanpa harus menjelaskannya.</p><div className={`opening-actions ${introReady ? 'is-ready' : ''}`}><button ref={introButtonRef} className="opening-enter" type="button" disabled={!introReady || introEntering} onClick={() => enterHero()}><span>Enter</span><ArrowRight size={15} aria-hidden="true"/></button><span className="opening-support">come on in.</span></div><button className="opening-skip" type="button" disabled={introEntering} onClick={() => enterHero(true)}>Skip intro</button></div></div>}
    <main className="mind-app" data-opening={openingIntro} data-entered={heroEntered} inert={openingIntro}>
    <div className="grain" aria-hidden="true" />

    <header className="site-header"><a className="wordmark" href="#home" aria-label="Syan, home">syan<span>✳</span></a><div className="header-note">A MIND IN PROGRESS <span>·</span> ALWAYS CURIOUS</div><button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(true)}><span>EXPLORE</span><Music2 size={16}/></button></header>

    <section ref={heroRef} tabIndex={-1} className="hero" id="home" data-motion-active={!motionPaused && heroVisible && tabVisible && !reducedMotion} onPointerMove={(event)=>{if(event.pointerType==='touch')return;const box=event.currentTarget.getBoundingClientRect();event.currentTarget.style.setProperty('--scene-x',`${((event.clientX-box.left)/box.width-.5)*7}px`);event.currentTarget.style.setProperty('--scene-y',`${((event.clientY-box.top)/box.height-.5)*7}px`)}}>
      <div className="hero-copy"><div className="section-number"><span>01</span><i/> MIND MELODY</div><p className="hero-overline">A small study of big feelings</p><h1 className="hero-title"><span>Mind</span><em>Melody</em></h1><p className="hero-subtitle">Exploring humans through psychology,<br/>music, and research.</p><p className="hero-personal-note">Some feelings arrive before the words do. I’m curious about the music that meets us there.</p><div className="hero-bottom"><button className="hero-explore" onClick={()=>enterRoom('explore')}>Explore <ArrowDown size={15}/></button></div></div>
      <div className={`hero-art ${catPushing ? 'cat-pushing' : catEasing ? 'cat-easing' : ''}`}><svg className="scene-thread" viewBox="0 0 560 260" fill="none" aria-hidden="true"><path d="M8 160 C72 160 74 102 112 132 S164 186 202 126 S245 105 270 121 C298 140 310 162 342 150 S397 116 423 126 S467 138 545 66"/></svg><div className="record-sleeve"><span className="sleeve-mark" aria-hidden="true"/><button className={`sleeve-bunny bunny-${bunnyMove}`} type="button" aria-label="Say hello to the little bunny" onClick={happyHop} onPointerEnter={() => { if (!bunnyBusy.current && !reducedMotion) setBunnyMove('look') }} onPointerLeave={() => { if (!bunnyBusy.current) setBunnyMove('rest') }} onFocus={() => { if (!bunnyBusy.current && !reducedMotion) setBunnyMove('look') }} onBlur={() => { if (!bunnyBusy.current) setBunnyMove('rest') }}><svg viewBox="0 0 72 76" aria-hidden="true"><g className="bunny-ears"><path d="M27 34C18 22 18 4 25 4c8 0 9 17 10 28M42 31C43 17 52 4 57 8c6 5-2 20-9 29"/></g><g className="bunny-body"><path className="bunny-outline" d="M18 49c0-11 8-18 19-18s20 7 20 18-8 18-20 18S18 60 18 49Z"/><path className="bunny-face" d="M25 46c1-7 6-11 12-11s12 4 13 11c1 8-5 13-13 13s-13-5-12-13Z"/><path className="bunny-eye" d="M33 46v2m9-2v2"/><path className="bunny-nose" d="m36 51 2 1-2 2-2-2Z"/><path className="bunny-mouth" d="M36 54v2m0 0-3 1m3-1 3 1"/><path className="bunny-foot" d="M23 63c4 2 8 2 11 0m8 0c4 2 8 2 11 0"/></g></svg></button></div><div className="vinyl-record" aria-hidden="true"><div className="record-spin"><span className="record-grooves"/><span className="record-label"><span className="label-hole"/></span><span className="record-detail"/></div></div><button className={`hero-cat cat-${catMove} cat-${catMood}`} type="button" aria-label="Pet the little cat" onClick={petCat} onPointerEnter={()=>{if(!catBusy.current)setCatMove('look')}} onPointerLeave={()=>{if(!catBusy.current)setCatMove('rest')}} onPointerMove={lookAtPointer}><svg viewBox="0 0 132 125" aria-hidden="true"><path className="cat-tail" d="M94 94c14 7 24 5 28-5 3-7-2-13-8-11-4 1-4 5-2 7"/><path className="cat-body" d="M52 67c-7 8-9 26-5 37 4 10 16 13 31 13 16 0 27-4 29-14 2-9-2-27-10-36"/><path className="cat-head" d="M42 53c-5-9-5-24 1-37l15 14c8-4 18-4 27 0l14-14c6 13 6 27 0 38-6 11-16 16-29 16S48 63 42 53Z"/><g className="cat-eyes"><path d="M53 45v2m17-2v2"/><path className="cat-nose" d="m64 51 3 2-3 3-3-3Z"/><path d="M64 56v3m0 0-3 2m3-2 3 2"/><path className="cat-whiskers" d="m54 53-9-2m9 5-9 2m31-5 9-2m-9 5 9 2"/></g><path className="cat-ear-detail" d="m48 25 8 7m34-7-8 7"/><g className="cat-paw"><path d="M84 70c5 4 8 10 9 15 0 4-4 6-9 5l-8-2c-4-1-5-4-3-7l7-10"/><path d="M78 87c2-2 3-4 3-5m5 7c2-2 3-4 3-5"/></g><path className="cat-rest-paw" d="M57 108c4 2 9 2 13 0m11 0c4 2 8 2 12 0"/><path className="cat-tail-tip" d="M118 82c4 0 6 4 4 7"/></svg></button><div className="cat-play-area" ref={toyArea} aria-label="Small play area for the paper ball">{toyVisible && <button className="paper-ball" type="button" aria-label="Drag the paper ball for the cat" style={{left:`${toyPosition.x}%`,top:`${toyPosition.y}%`}} onPointerDown={event=>{toyDragged.current=false;event.currentTarget.setPointerCapture(event.pointerId)}} onPointerMove={event=>{if(event.buttons===1){toyDragged.current=true;moveToy(event)}}} onClick={()=>{if(toyDragged.current){toyDragged.current=false;return}setCatMood('playing');setCatMove('reaching');if(catStageTimer.current)window.clearTimeout(catStageTimer.current);catStageTimer.current=window.setTimeout(()=>{setCatMove('rest');setCatMood('curious')},700)}}><span className="paper-ball-crease" aria-hidden="true"/></button>}</div><div className={`cat-controls cat-${catMood}`}><button type="button" onClick={petCat}>Elus</button><button type="button" onClick={playToy} aria-pressed={toyVisible}>Main</button><button type="button" onClick={pushRecord}>Dorong</button></div><button className="motion-toggle" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? 'Resume motion' : 'Pause motion'}</button><span className="scene-greeting">hey, I’m Syan.</span><section className="hero-mixtape" aria-label="Original instrumental mixtape"><p className="mixtape-heading">a mixtape for being human</p><p className="mixtape-original">Original synthesized piano-like instrumental sketches · no sampled piano</p><label className="mixtape-track-label" htmlFor="mixtape-track">Track {String(moods.findIndex(item=>item.name===mood?.name)+1).padStart(2,'0')} · {mood?.name}</label><select id="mixtape-track" className="mixtape-select" value={mood?.name ?? ''} onChange={event=>{const selected=moods.find(item=>item.name===event.target.value);if(selected)playMood(selected)}}>{moods.map(item=><option key={item.name} value={item.name}>{item.note}</option>)}</select><p className="mixtape-description">{mood?.description}</p><div className="mixtape-controls"><button type="button" aria-label="Previous track" onClick={()=>changeTrack(-1)}><ArrowLeft size={15}/></button><button type="button" className="mixtape-play" aria-label={pianoPlaying?'Pause':'Play'} onClick={togglePlayback}>{pianoPlaying?'Pause':'Play'}</button><button type="button" aria-label="Next track" onClick={()=>changeTrack(1)}><ArrowRight size={15}/></button><span className="mixtape-time">{`0:${String(Math.floor(elapsed)).padStart(2,'0')} / 0:16`}</span><button type="button" aria-label={muted?'Unmute':'Mute'} aria-pressed={muted} onClick={toggleMute}>{muted?<VolumeX size={15}/>:<Volume2 size={15}/>}</button></div><input className="mixtape-progress" aria-label="Track progress" type="range" min="0" max="16" step="0.1" value={elapsed} onChange={event=>{const position=Number(event.target.value);playbackOffset.current=position;setElapsed(position);if(pianoPlaying){playbackGeneration.current+=1;stopSound();setPianoPlaying(false);window.setTimeout(()=>void startPlayback(position),0)}}}/><label className="mixtape-volume">Volume <input type="range" aria-label="Volume" min="0" max="1" step="0.01" value={volume} onChange={event=>setVolume(Number(event.target.value))}/></label><button type="button" className="mixtape-repeat" aria-pressed={repeat} onClick={()=>setRepeat(!repeat)}>Repeat {repeat?'on':'off'}</button><span className="piano-status" role="status" aria-live="polite">{pianoError?'Audio could not start in this browser. Try again or check device audio.':pianoPlaying?'Original synthesized instrumental playing.':''}</span><details className="song-suggestions"><summary>Want a song with words?</summary><p>Suggestions only—not guaranteed emotional matches or mental-health treatment.</p><ul><li>When sad or discouraged: <a href="https://open.spotify.com/search/Life%20Goes%20On%20BTS" target="_blank" rel="noreferrer">“Life Goes On” — BTS</a><small>Kalau kamu ingin ditemani saat hari tidak berjalan sesuai harapan.</small></li><li>When overwhelmed: <a href="https://open.spotify.com/search/breathin%20Ariana%20Grande" target="_blank" rel="noreferrer">“breathin” — Ariana Grande</a><small>Tentang merasa kewalahan; musiknya tetap punya dorongan pop yang cukup kuat.</small></li><li>When tired of being hard on yourself: <a href="https://open.spotify.com/search/Magic%20Shop%20BTS" target="_blank" rel="noreferrer">“Magic Shop” — BTS</a><small>Untuk saat kamu ingin mendengar sesuatu yang menawarkan penghiburan.</small></li></ul><p>Tidak semua lagu terasa sama untuk semua orang. Pilih yang paling dekat dengan rasamu.</p></details></section></div><a className="hero-scroll" href="#about">SCROLL A LITTLE <ArrowDown size={13}/></a><span className="hero-edition">VOL. 01 · A PERSONAL STUDY</span>
    </section>


    <section className="about-section section-pad" id="about"><div className="section-number"><span>02</span><i/> INSIDE SYAN’S MIND</div><div className="about-layout"><div className="about-title"><p className="section-label">A curious human, first</p><h2>Inside Syan’s<br/><em>mind.</em></h2><div className="about-stamp"><Cat size={18}/><span>currently collecting<br/>little things that matter</span></div></div><div className="about-story"><p className="about-lede">Hi, I’m Isyana Arlisya. You can call me Syan—or Musyi, sometimes. Musyi is a playful twist on ‘musisi’, the Indonesian word for musician. It’s another name I go by, and the pen name I use when I write.</p><p>I’m curious about people, stories, emotions, music, and the way small moments can shape how we feel. I tend to save little observations like other people save ticket stubs.</p><span className="identity-annotation">Syan or Musyi—still me.</span></div></div><div className="thoughts-row">{thoughts.map((item,index)=>{const Icon=item.icon;return <motion.article className={`thought thought-${index+1}`} key={item.title} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.55,delay:index*.07}} whileHover={{y:-5,rotate:index%2?1:-1}}><span className="thought-num">0{index+1}</span><Icon size={19} strokeWidth={1.5}/><h3>{item.title}</h3><p>{item.text}</p><span className="thought-scribble">{index===1?'♪':index===3?'little note ↗':'·'}</span></motion.article>})}</div><div className="about-bottom"><span>ISYANA ARLISYA</span><i/><span>ASPIRING S1 PSYCHOLOGY STUDENT</span><i/><span>FUTURE RESEARCHER</span></div></section>

    <section className="music-section section-pad" id="music"><div className="section-number"><span>03</span><i/> WHY I LOVE MUSIC</div><div className="music-layout"><div className="music-story"><p className="section-label">A feeling with a melody</p><h2>Some songs<br/>feel like <em>being known.</em></h2><p>Music has always helped me understand emotions, stories, and people. I grew up loving BTS—especially Jungkook—and Ariana Grande. Their music made me wonder how a song can shift a mood, bring comfort, or make an ordinary moment stay with you.</p><p>Not because every feeling needs a soundtrack. Sometimes it just helps to know someone else has felt something like it.</p><motion.div className="music-dream" initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.65}}><p>I love listening, but I also dream of making music of my own. Of giving a feeling a melody, then letting someone else find their own meaning in it.</p></motion.div></div><div className="music-art"><div className="music-cloud cloud-one"/><div className="music-cloud cloud-two"/><div className="music-disc"><span>♫</span></div><div className="music-staff">{Array.from({length:5},(_,i)=><i key={i}/>)}<span className="staff-note">♪</span><span className="staff-note second">♫</span></div><div className="music-sparkle">✳</div><span className="music-pet pet-rabbit"><Rabbit size={18}/></span><span className="music-pet pet-cat"><Cat size={16}/></span><span className="music-heart">♥</span><span className="music-jk">just a tiny nod · JK</span></div></div></section>

    <section className="psych-section section-pad" id="psychology"><div className="section-number"><span>04</span><i/> WHY I CHOOSE PSYCHOLOGY</div><div className="psych-layout"><div className="psych-art"><div className="mind-shape"><span/><i/><i/><i/></div><span className="psych-orbit orbit-1"/><span className="psych-orbit orbit-2"/><span className="psych-note note-psych">♫</span><span className="psych-note note-heart">♥</span><span className="psych-note note-spark">✳</span><span className="psych-caption">the mind is a whole universe</span></div><div className="psych-story"><p className="section-label">A question I keep coming back to</p><h2>People are<br/><em>worth understanding.</em></h2><p>I want to study psychology because I’m deeply curious about people—their feelings, thoughts, and the small moments that shape them. I believe understanding ourselves can help us feel less alone and find gentler ways to grow.</p><p>And music keeps finding its way into that question: how do sound, emotion, and well-being shape one another? Someday, I hope to explore that as a psychology researcher.</p><motion.p className="psych-reflection" initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.65}}>I want to learn how to listen without rushing to an answer. To ask better questions, and to remember that there is always more to a person than what we first see.</motion.p><button className="psych-link" onClick={()=>enterRoom('experiment')}>A question I’m carrying <ArrowUpRight size={14}/></button></div></div><motion.div className="about-closing" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.35}} transition={{duration:.75}}><p>Maybe that’s where music and psychology meet for me:<br/>wanting to understand what we feel,<br/>and finding a way to give it room.</p><span>— Musyi</span></motion.div></section>

    <footer className="contact-section section-pad" id="contact"><div className="section-number"><span>05</span><i/> CONTACT</div><div className="contact-layout"><div className="contact-copy"><p className="section-label">And that’s me, for now</p><h2>Let’s make<br/>something <em>matter.</em></h2><span className="contact-doodle">no perfect words needed <span>↘</span></span></div><div className="contact-links"><p className="contact-invitation">If something here reminded you of a song, a question, or a story of your own, I’d love to hear it.</p><p className="contact-thanks">Thank you for spending a little of your day in my world.</p><a href="mailto:isyanaarlisya315@gmail.com"><span>Email</span><span>isyanaarlisya315@gmail.com</span><ArrowUpRight size={16}/></a><a href="https://github.com/isyanaarlisya315-source" target="_blank" rel="noreferrer"><span>GitHub</span><span>isyanaarlisya315-source</span><ArrowUpRight size={16}/></a><a href="https://instagram.com" target="_blank" rel="noreferrer"><span>Instagram</span><span>Say hello over there</span><ArrowUpRight size={16}/></a><div className="contact-last"><Cat size={17}/><span>Let’s create something meaningful together.</span><Rabbit size={17}/></div></div></div><div className="footer-bottom"><a className="wordmark" href="#home">syan<span>✳</span></a><p>Made with curiosity, care, and a good playlist.</p><span>© 2026 ISYANA ARLISYA</span></div></footer>

    {menuOpen && <div className="menu-backdrop" onClick={()=>setMenuOpen(false)}><motion.aside className="menu-panel" role="dialog" aria-modal="true" aria-label="Explore Syan’s mind" onClick={event=>event.stopPropagation()} initial={{x:35,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:.35,ease:[.2,.75,.2,1]}}><div className="panel-top"><span>ROOMS IN MY MIND</span><button onClick={()=>setMenuOpen(false)} aria-label="Close navigation"><X/></button></div><div className="panel-title">Where to<br/><em>next?</em><span>♫</span></div><nav className="panel-nav">{[{label:'Mind Melody',href:'#home',number:'01'},{label:'Inside Syan’s Mind',href:'#about',number:'02'},{label:'Why I Love Music',href:'#music',number:'03'},{label:'Why I Choose Psychology',href:'#psychology',number:'04'},{label:'Explore',action:'explore',number:'✳'},{label:'Contact',href:'#contact',number:'05'}].map(item=>item.action?<button key={item.label} onClick={()=>enterRoom('explore')}><small>{item.number}</small>{item.label}<ArrowUpRight size={17}/></button>:<a key={item.label} href={item.href} onClick={()=>setMenuOpen(false)}><small>{item.number}</small>{item.label}<ArrowUpRight size={17}/></a>)}</nav><span className="panel-foot">take what you need, stay as long as you like</span></motion.aside></div>}

    {room && <div className="room-backdrop" onClick={()=>setRoom(null)}><motion.section className="room-panel" role="dialog" aria-modal="true" aria-label="Explore room" onClick={event=>event.stopPropagation()} initial={{y:14,scale:.985,opacity:0}} animate={{y:0,scale:1,opacity:1}} transition={{duration:.32,ease:[.2,.75,.2,1]}}><div className="room-top"><span><i/> A ROOM IN SYAN’S MIND</span><button onClick={()=>setRoom(null)} aria-label="Close room"><X/></button></div>{room==='explore' ? <><div className="room-heading"><p className="section-label">Wander wherever you like</p><h2>Pick a little<br/><em>something.</em></h2></div><div className="room-menu">{[{name:'Little Experiment',detail:'A tiny music & feelings lab',key:'experiment',icon:'♫'},{name:'Things I Carry',detail:'A pocketful of curiosities',key:'things',icon:'✳'},{name:'Projects',detail:'Small worlds, made with care',key:'projects',icon:'↗'},{name:'Research Playground',detail:'Questions in progress',key:'research',icon:'?' }].map((item,index)=><button key={item.key} onClick={()=>setRoom(item.key)}><small>0{index+1}</small><span className="room-menu-icon">{item.icon}</span><span className="room-menu-copy"><strong>{item.name}</strong><em>{item.detail}</em></span><ChevronRight size={17}/></button>)}</div></> : <><div className="room-heading room-inner-heading"><button className="room-back" onClick={()=>setRoom('explore')}><ArrowLeft size={14}/> ALL ROOMS</button><p className="section-label">{room==='experiment'?'PLAY A LITTLE':room==='things'?'A POCKET COLLECTION':room==='projects'?'SMALL WORLDS':room==='research'?'QUESTIONS, NO ANSWERS YET':''}</p><h2>{room==='experiment'?<>Little <em>Experiment</em></>:room==='things'?<>Things I <em>Carry</em></>:room==='projects'?<>Made with <em>meaning</em></>:<>Research <em>Playground</em></>}</h2></div>
      {room==='experiment' && <div className="experiment-room"><div className="experiment-intro"><h3>How are you feeling today?</h3><p>Pick a mood to select its matching original mixtape sketch. Use the shared player in the hero whenever you’re ready; choosing a mood won’t start audio.</p></div><div className="mood-grid" role="group" aria-label="Choose a mood">{moods.map(item=><button key={item.name} className={`mood-chip ${item.color} ${mood?.name===item.name?'selected':''}`} onClick={()=>void playMood(item)} aria-pressed={mood?.name===item.name}><span>{item.face}</span>{item.name}</button>)}</div><div className={`mood-result ${mood?'visible':''}`} aria-live="polite">{mood?<><div className="result-top"><span className="result-label">{mood.note}</span><span className={`mini-eq ${pianoPlaying?'playing':''}`} aria-hidden="true">{[1,2,3,4,5,6,7].map(n=><i key={n}/>)}</span></div><p className="result-sound">{mood.description}</p><p className="result-sound">{mood.sound}</p><span className="explore-playback-status" role="status">{pianoPlaying?'This selected sketch is playing.':'Selected in the shared player; audio is paused.'}</span></>:<div className="result-empty"><AudioLines/><span>Your little soundtrack will find its way here.</span></div>}</div><div className="sound-control"><span>ORIGINAL SYNTHESIZED SKETCHES · 16 SECONDS</span><button onClick={toggleMute} aria-pressed={muted}>{muted?<VolumeX size={15}/>:<Volume2 size={15}/>} {muted?'Sound off':'Sound on'}</button></div><div className="slider-lab"><div><span className="lab-label"><Sparkles size={13}/> YOUR TURN TO WONDER</span><h3>How much does music affect your mood?</h3><p className="slider-response" aria-live="polite">“{response}”</p></div><div className="slider-control"><div className="slider-value"><span>NOT MUCH</span><strong>{impact}<small>/ 100</small></strong><span>A LOT</span></div><input aria-label="How much does music affect your mood, from zero to one hundred" type="range" min="0" max="100" value={impact} onChange={event=>setImpact(Number(event.target.value))} style={{'--range':`${impact}%`} as React.CSSProperties}/><div className="wave-visual" aria-hidden="true">{Array.from({length:25},(_,i)=><i key={i} style={{'--wave':`${Math.round(7+Math.abs(Math.sin((i+impact/12)*.52))*34)}px`} as React.CSSProperties}/>)}</div></div></div><div className="research-cards experiment-questions">{questions.map((item,index)=><button className={`research-question ${item.color} ${activeQuestion===index?'question-open':''}`} key={item.title} onClick={()=>setActiveQuestion(activeQuestion===index?null:index)} aria-expanded={activeQuestion===index}><span>QUESTION 0{index+1}</span><strong>{item.title}</strong><i>{activeQuestion===index?'−':'+'}</i>{activeQuestion===index&&<p>{item.text}</p>}</button>)}</div></div>}
      {room==='things' && <div className="carry-room"><p className="carry-intro">Little things I keep in my pockets (metaphorically; I lose my actual pockets).</p>{thoughts.map((item,index)=>{const Icon=item.icon;return <article className={`carry-note carry-${index+1}`} key={item.title}><span>0{index+1} / A THING I CARRY</span><Icon size={20}/><h3>{item.title}</h3><p>{item.text}</p></article>})}</div>}
      {room==='projects' && <div className="projects-room"><div className="project-carousel" ref={carousel} onPointerDown={event=>{const node=event.currentTarget;node.setPointerCapture(event.pointerId);node.dataset.startX=String(event.clientX);node.dataset.scrollX=String(node.scrollLeft)}} onPointerMove={event=>{const node=event.currentTarget;if(event.buttons===1&&node.dataset.startX)node.scrollLeft=Number(node.dataset.scrollX)-(event.clientX-Number(node.dataset.startX))}}><article className="chapter-card"><div className="chapter-art"><div className="chapter-orbit"/><span className="chapter-rabbit"><Rabbit size={19}/></span><span className="chapter-mark">18</span><span className="chapter-note">a page, not the whole story</span></div><div className="chapter-info"><span className="chapter-label">A PRIVATE LITTLE UNIVERSE</span><h3>Chapter 18</h3><p>A small digital world made with intention, warmth, and a little bit of mystery.</p><a href="https://v0-chapter-18.vercel.app/" target="_blank" rel="noreferrer">Enter Chapter 18 <ArrowUpRight size={14}/></a></div></article><article className="upcoming-card"><span className="coming-label"><i/> COMING SOON</span><span className="upcoming-icon">♫</span><h3>MoodMusic</h3><p>Music, feelings, and the patterns between them.</p><span className="upcoming-num">01</span></article><article className="upcoming-card upcoming-alt"><span className="coming-label"><i/> COMING SOON</span><span className="upcoming-icon">✳</span><h3>Psychology of Music</h3><p>Exploring emotions through data.</p><span className="upcoming-num">02</span></article></div><div className="carousel-controls"><span>DRAG TO WANDER</span><button aria-label="Scroll projects left" onClick={()=>carousel.current?.scrollBy({left:-250,behavior:'smooth'})}><ArrowLeft size={15}/></button><button aria-label="Scroll projects right" onClick={()=>carousel.current?.scrollBy({left:250,behavior:'smooth'})}><ArrowRight size={15}/></button></div></div>}
      {room==='research' && <div className="research-room"><div className="research-cards">{questions.map((item,index)=><button className={`research-question ${item.color} ${activeQuestion===index?'question-open':''}`} key={item.title} onClick={()=>setActiveQuestion(activeQuestion===index?null:index)} aria-expanded={activeQuestion===index}><span>QUESTION 0{index+1}</span><strong>{item.title}</strong><i>{activeQuestion===index?'−':'+'}</i>{activeQuestion===index&&<p>{item.text}</p>}</button>)}</div><div className="research-footnote"><FlaskConical size={17}/><span>These are starting points, not conclusions. The interesting part is learning how to ask.</span></div></div>}
    </>}</motion.section></div>}
  </main></>
}
