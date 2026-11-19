'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, AudioLines, Brain, Cat, ChevronRight, Disc3, FlaskConical, Heart, Music2, Rabbit, Sparkles, Volume2, VolumeX, X } from 'lucide-react'

type Mood = { name: string; face: string; sound: string; note: string; frequencies: number[]; color: string }
const moods: Mood[] = [
  { name: 'Happy', face: '☼', sound: 'Upbeat pop, bright melodies, or feel-good songs.', note: 'A little joy, on repeat.', frequencies: [523, 659, 784, 1047, 784, 880], color: 'mood-happy' },
  { name: 'Calm', face: '☾', sound: 'Lo-fi, acoustic, or instrumental music.', note: 'Let the world slow down.', frequencies: [392, 440, 523, 440], color: 'mood-calm' },
  { name: 'Sad', face: '〰', sound: 'Slow melodies, piano, or songs that help you feel understood.', note: 'It’s okay to sit with it.', frequencies: [440, 392, 349, 392], color: 'mood-sad' },
  { name: 'Stressed', face: '✳', sound: 'Gentle ambient sounds, rain, or calming instrumentals.', note: 'One breath at a time.', frequencies: [330, 392, 440, 392], color: 'mood-stressed' },
  { name: 'Motivated', face: '↗', sound: 'Upbeat pop, energetic beats, or empowering songs.', note: 'Your main-character moment.', frequencies: [440, 554, 659, 554, 784, 659], color: 'mood-motivated' },
  { name: 'Curious', face: '✳', sound: 'Experimental sounds, jazz, or something new to discover.', note: 'Follow the interesting thing.', frequencies: [523, 622, 740, 880, 622], color: 'mood-curious' },
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
  const [pianoError, setPianoError] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [room, setRoom] = useState<string | null>(null)
  const [mood, setMood] = useState<Mood | null>(null)
  const [impact, setImpact] = useState(62)
  const [muted, setMuted] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [motionPaused, setMotionPaused] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [bunnyMove, setBunnyMove] = useState('rest')
  const carousel = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const bunnyTimer = useRef<number | null>(null)
  const bunnyBusy = useRef(false)
  const audio = useRef<AudioContext | null>(null)
  const oscillators = useRef<{ oscillator: OscillatorNode; gain: GainNode }[]>([])
  const stopTimer = useRef<number | null>(null)

  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); setRoom(null) } }
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key); oscillators.current.forEach(({ oscillator }) => { try { oscillator.stop() } catch {} }); if (audio.current) void audio.current.close() }
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
    if (reducedMotion || motionPaused || !heroVisible || !tabVisible) return
    let sequenceTimer: number
    const run = () => {
      setBunnyMove('playful')
      bunnyBusy.current = true
      sequenceTimer = window.setTimeout(() => {
        setBunnyMove('rest')
        bunnyBusy.current = false
        bunnyTimer.current = window.setTimeout(run, 8000 + Math.random() * 6000)
      }, 2300)
    }
    bunnyTimer.current = window.setTimeout(() => {
      setBunnyMove('greeting')
      sequenceTimer = window.setTimeout(() => {
        setBunnyMove('rest')
        bunnyTimer.current = window.setTimeout(run, 8000 + Math.random() * 6000)
      }, 1200)
    }, 3900)
    return () => {
      if (bunnyTimer.current) window.clearTimeout(bunnyTimer.current)
      if (sequenceTimer) window.clearTimeout(sequenceTimer)
      bunnyBusy.current = false
    }
  }, [reducedMotion, motionPaused, heroVisible, tabVisible])

  useEffect(() => {
    const updateVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  const happyHop = () => {
    if (reducedMotion || bunnyBusy.current) return
    bunnyBusy.current = true
    setBunnyMove('happy')
    window.setTimeout(() => { setBunnyMove('rest'); bunnyBusy.current = false }, 900)
  }

  const stopSound = useCallback(() => {
    if (stopTimer.current) window.clearTimeout(stopTimer.current)
    const nodes = [...oscillators.current]
    oscillators.current = []
    nodes.forEach(({ oscillator, gain }) => {
      try {
        const now = audio.current?.currentTime ?? 0
        gain.gain.cancelScheduledValues(now)
        gain.gain.setTargetAtTime(0.0001, now, 0.07)
        oscillator.stop(now + 0.32)
      } catch {}
    })
  }, [])

  const playMood = useCallback(async (selected: Mood, force = false) => {
    setMood(selected)
    setPianoPlaying(false)
    setPianoError(false)
    stopSound()
    if (muted && !force) return
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const context = audio.current ?? new AudioContextClass()
    audio.current = context
    if (context.state === 'suspended') await context.resume()
    const now = context.currentTime
    const step = selected.name === 'Motivated' || selected.name === 'Happy' ? 0.42 : 0.68
    selected.frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = selected.name === 'Curious' ? 'sine' : 'triangle'
      oscillator.frequency.setValueAtTime(frequency, now + index * step)
      gain.gain.setValueAtTime(0.0001, now + index * step)
      gain.gain.exponentialRampToValueAtTime(0.045, now + index * step + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * step + 0.44)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(now + index * step)
      oscillator.stop(now + index * step + 0.48)
      oscillators.current.push({ oscillator, gain })
    })
    stopTimer.current = window.setTimeout(() => { oscillators.current = [] }, selected.frequencies.length * step * 1000 + 600)
  }, [muted, stopSound])

  const playPianoPhrase = useCallback(async () => {
    setPianoError(false)
    if (pianoPlaying) { stopSound(); setPianoPlaying(false); return }
    setPianoPlaying(false)
    stopSound()
    if (muted) { setPianoError(true); return }
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) { setPianoError(true); return }
    try {
      const context = audio.current ?? new AudioContextClass()
      audio.current = context
      if (context.state === 'suspended') await context.resume()
      const now = context.currentTime
      const phrase = [659.25, 783.99, 880, 783.99, 659.25, 587.33, 523.25]
      const spacing = 0.31
      phrase.forEach((frequency, index) => {
        const start = now + index * spacing
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(frequency, start)
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.998, start + 0.12)
        gain.gain.setValueAtTime(0.0001, start)
        gain.gain.exponentialRampToValueAtTime(0.055, start + 0.025)
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.27)
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.start(start)
        oscillator.stop(start + 0.29)
        oscillators.current.push({ oscillator, gain })
      })
      setPianoPlaying(true)
      stopTimer.current = window.setTimeout(() => { oscillators.current = []; setPianoPlaying(false) }, phrase.length * spacing * 1000)
    } catch {
      stopSound()
      setPianoError(true)
    }
  }, [muted, pianoPlaying, stopSound])

  const toggleMute = () => {
    if (!muted) { stopSound(); setPianoPlaying(false) }
    setMuted(!muted)
    if (muted && mood) void playMood(mood, true)
  }
  const response = impact > 70 ? 'Musik jelas jadi bagian penting dari dunia emosimu.' : impact > 35 ? 'Kamu tahu kapan sebuah lagu bisa menemanimu.' : 'Mungkin kamu peneliti psikologi musik masa depan.'
  const enterRoom = (next: string) => { setMenuOpen(false); setRoom(next) }

  return <main className="mind-app">
    <div className="grain" aria-hidden="true" />

    <header className="site-header"><a className="wordmark" href="#home" aria-label="Syan, home">syan<span>✳</span></a><div className="header-note">A MIND IN PROGRESS <span>·</span> ALWAYS CURIOUS</div><button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(true)}><span>EXPLORE</span><Music2 size={16}/></button></header>

    <section ref={heroRef} className="hero" id="home" data-motion-active={!motionPaused && heroVisible && tabVisible && !reducedMotion} onPointerMove={(event)=>{if(event.pointerType==='touch')return;const box=event.currentTarget.getBoundingClientRect();event.currentTarget.style.setProperty('--scene-x',`${((event.clientX-box.left)/box.width-.5)*7}px`);event.currentTarget.style.setProperty('--scene-y',`${((event.clientY-box.top)/box.height-.5)*7}px`)}}>
      <div className="hero-copy"><div className="section-number"><span>01</span><i/> MIND MELODY</div><p className="hero-overline">A small study of big feelings</p><h1 className="hero-title"><span>Mind</span><em>Melody</em></h1><p className="hero-subtitle">Exploring humans through psychology,<br/>music, and research.</p><p className="hero-personal-note">Some feelings arrive before the words do. I’m curious about the music that meets us there.</p><div className="hero-bottom"><button className="hero-explore" onClick={()=>enterRoom('explore')}>Explore <ArrowDown size={15}/></button></div></div>
      <div className="hero-art"><svg className="scene-thread" viewBox="0 0 560 260" fill="none" aria-hidden="true"><path d="M8 160 C72 160 74 102 112 132 S164 186 202 126 S245 105 270 121 C298 140 310 162 342 150 S397 116 423 126 S467 138 545 66"/></svg><div className="record-sleeve"><span className="sleeve-mark" aria-hidden="true"/><button className={`sleeve-bunny bunny-${bunnyMove}`} type="button" aria-label="Say hello to the little bunny" onClick={happyHop} onPointerEnter={() => { if (!bunnyBusy.current && !reducedMotion) setBunnyMove('look') }} onPointerLeave={() => { if (!bunnyBusy.current) setBunnyMove('rest') }} onFocus={() => { if (!bunnyBusy.current && !reducedMotion) setBunnyMove('look') }} onBlur={() => { if (!bunnyBusy.current) setBunnyMove('rest') }}><svg viewBox="0 0 72 76" aria-hidden="true"><g className="bunny-ears"><path d="M27 34C18 22 18 4 25 4c8 0 9 17 10 28M42 31C43 17 52 4 57 8c6 5-2 20-9 29"/></g><g className="bunny-body"><path className="bunny-outline" d="M18 49c0-11 8-18 19-18s20 7 20 18-8 18-20 18S18 60 18 49Z"/><path className="bunny-face" d="M25 46c1-7 6-11 12-11s12 4 13 11c1 8-5 13-13 13s-13-5-12-13Z"/><path className="bunny-eye" d="M33 46v2m9-2v2"/><path className="bunny-nose" d="m36 51 2 1-2 2-2-2Z"/><path className="bunny-mouth" d="M36 54v2m0 0-3 1m3-1 3 1"/><path className="bunny-foot" d="M23 63c4 2 8 2 11 0m8 0c4 2 8 2 11 0"/></g></svg></button><span className="sleeve-annotation">a little music,<br/>a lot of feelings.</span></div><div className="vinyl-record" aria-hidden="true"><div className="record-spin"><span className="record-grooves"/><span className="record-label"><span className="label-hole"/></span><span className="record-detail"/></div></div><button className="motion-toggle" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? 'Resume motion' : 'Pause motion'}</button><span className="scene-greeting">hey, I’m Syan.</span><aside className="listening-note">On my playlist:<br/><strong>BTS, especially Jungkook,</strong><br/>and <strong>Ariana Grande.</strong></aside><button className={`piano-invite ${pianoPlaying?'is-playing':''}`} onClick={()=>void playPianoPhrase()} aria-pressed={pianoPlaying}>{pianoPlaying?<><VolumeX size={13}/> stop the piano</>:<><Music2 size={13}/> a little piano?</>}</button><span className="piano-status" role="status" aria-live="polite">{pianoError?'Piano sound isn’t available right now.':pianoPlaying?'A little original piano phrase is playing.':''}</span></div><a className="hero-scroll" href="#about">SCROLL A LITTLE <ArrowDown size={13}/></a><span className="hero-edition">VOL. 01 · A PERSONAL STUDY</span>
    </section>


    <section className="about-section section-pad" id="about"><div className="section-number"><span>02</span><i/> INSIDE SYAN’S MIND</div><div className="about-layout"><div className="about-title"><p className="section-label">A curious human, first</p><h2>Inside Syan’s<br/><em>mind.</em></h2><div className="about-stamp"><Cat size={18}/><span>currently collecting<br/>little things that matter</span></div></div><div className="about-story"><p className="about-lede">Hi, I’m Syan—short for Isyana Arlisya.</p><p>I’m curious about people, stories, emotions, music, and the way small moments can shape how we feel. I tend to save little observations like other people save ticket stubs.</p></div></div><div className="musyi-note"><div className="musyi-note-heading"><span>Why <em>Musyi?</em></span><span className="musyi-wordplay">musisi <i aria-hidden="true">⟶</i> Musyi</span></div><p>Syan is what you can call me. Musyi is the name I write under—a playful twist on the Indonesian word ‘musisi’, meaning musician. A little wordplay that brings my love of writing and music into the same name.</p><span className="musyi-handnote">a little wordplay, a little music, still me.</span></div><div className="thoughts-row">{thoughts.map((item,index)=>{const Icon=item.icon;return <motion.article className={`thought thought-${index+1}`} key={item.title} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.55,delay:index*.07}} whileHover={{y:-5,rotate:index%2?1:-1}}><span className="thought-num">0{index+1}</span><Icon size={19} strokeWidth={1.5}/><h3>{item.title}</h3><p>{item.text}</p><span className="thought-scribble">{index===1?'♪':index===3?'little note ↗':'·'}</span></motion.article>})}</div><div className="about-bottom"><span>ISYANA ARLISYA</span><i/><span>ASPIRING S1 PSYCHOLOGY STUDENT</span><i/><span>FUTURE RESEARCHER</span></div></section>

    <section className="music-section section-pad" id="music"><div className="section-number"><span>03</span><i/> WHY I LOVE MUSIC</div><div className="music-layout"><div className="music-story"><p className="section-label">A feeling with a melody</p><h2>Some songs<br/>feel like <em>being known.</em></h2><p>Music has always helped me understand emotions, stories, and people. I grew up loving BTS—especially Jungkook—and Ariana Grande. Their music made me wonder how a song can shift a mood, bring comfort, or make an ordinary moment stay with you.</p><p>Not because every feeling needs a soundtrack. Sometimes it just helps to know someone else has felt something like it.</p><motion.div className="music-dream" initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.65}}><p>I love listening, but I also dream of making music of my own. Of giving a feeling a melody, then letting someone else find their own meaning in it.</p></motion.div></div><div className="music-art"><div className="music-cloud cloud-one"/><div className="music-cloud cloud-two"/><div className="music-disc"><span>♫</span></div><div className="music-staff">{Array.from({length:5},(_,i)=><i key={i}/>)}<span className="staff-note">♪</span><span className="staff-note second">♫</span></div><div className="music-sparkle">✳</div><span className="music-pet pet-rabbit"><Rabbit size={18}/></span><span className="music-pet pet-cat"><Cat size={16}/></span><span className="music-heart">♥</span><span className="music-jk">just a tiny nod · JK</span></div></div></section>

    <section className="psych-section section-pad" id="psychology"><div className="section-number"><span>04</span><i/> WHY I CHOOSE PSYCHOLOGY</div><div className="psych-layout"><div className="psych-art"><div className="mind-shape"><span/><i/><i/><i/></div><span className="psych-orbit orbit-1"/><span className="psych-orbit orbit-2"/><span className="psych-note note-psych">♫</span><span className="psych-note note-heart">♥</span><span className="psych-note note-spark">✳</span><span className="psych-caption">the mind is a whole universe</span></div><div className="psych-story"><p className="section-label">A question I keep coming back to</p><h2>People are<br/><em>worth understanding.</em></h2><p>I want to study psychology because I’m deeply curious about people—their feelings, thoughts, and the small moments that shape them. I believe understanding ourselves can help us feel less alone and find gentler ways to grow.</p><p>And music keeps finding its way into that question: how do sound, emotion, and well-being shape one another? Someday, I hope to explore that as a psychology researcher.</p><motion.p className="psych-reflection" initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.65}}>I want to learn how to listen without rushing to an answer. To ask better questions, and to remember that there is always more to a person than what we first see.</motion.p><button className="psych-link" onClick={()=>enterRoom('experiment')}>A question I’m carrying <ArrowUpRight size={14}/></button></div></div><motion.div className="about-closing" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.35}} transition={{duration:.75}}><p>Maybe that’s where music and psychology meet for me:<br/>wanting to understand what we feel,<br/>and finding a way to give it room.</p><span>— Musyi</span></motion.div></section>

    <footer className="contact-section section-pad" id="contact"><div className="section-number"><span>05</span><i/> CONTACT</div><div className="contact-layout"><div className="contact-copy"><p className="section-label">And that’s me, for now</p><h2>Let’s make<br/>something <em>matter.</em></h2><span className="contact-doodle">no perfect words needed <span>↘</span></span></div><div className="contact-links"><p className="contact-invitation">If something here reminded you of a song, a question, or a story of your own, I’d love to hear it.</p><p className="contact-thanks">Thank you for spending a little of your day in my world.</p><a href="mailto:isyanaarlisya315@gmail.com"><span>Email</span><span>isyanaarlisya315@gmail.com</span><ArrowUpRight size={16}/></a><a href="https://github.com/isyanaarlisya315-source" target="_blank" rel="noreferrer"><span>GitHub</span><span>isyanaarlisya315-source</span><ArrowUpRight size={16}/></a><a href="https://instagram.com" target="_blank" rel="noreferrer"><span>Instagram</span><span>Say hello over there</span><ArrowUpRight size={16}/></a><div className="contact-last"><Cat size={17}/><span>Let’s create something meaningful together.</span><Rabbit size={17}/></div></div></div><div className="footer-bottom"><a className="wordmark" href="#home">syan<span>✳</span></a><p>Made with curiosity, care, and a good playlist.</p><span>© 2026 ISYANA ARLISYA</span></div></footer>

    {menuOpen && <div className="menu-backdrop" onClick={()=>setMenuOpen(false)}><motion.aside className="menu-panel" role="dialog" aria-modal="true" aria-label="Explore Syan’s mind" onClick={event=>event.stopPropagation()} initial={{x:35,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:.35,ease:[.2,.75,.2,1]}}><div className="panel-top"><span>ROOMS IN MY MIND</span><button onClick={()=>setMenuOpen(false)} aria-label="Close navigation"><X/></button></div><div className="panel-title">Where to<br/><em>next?</em><span>♫</span></div><nav className="panel-nav">{[{label:'Mind Melody',href:'#home',number:'01'},{label:'Inside Syan’s Mind',href:'#about',number:'02'},{label:'Why I Love Music',href:'#music',number:'03'},{label:'Why I Choose Psychology',href:'#psychology',number:'04'},{label:'Explore',action:'explore',number:'✳'},{label:'Contact',href:'#contact',number:'05'}].map(item=>item.action?<button key={item.label} onClick={()=>enterRoom('explore')}><small>{item.number}</small>{item.label}<ArrowUpRight size={17}/></button>:<a key={item.label} href={item.href} onClick={()=>setMenuOpen(false)}><small>{item.number}</small>{item.label}<ArrowUpRight size={17}/></a>)}</nav><span className="panel-foot">take what you need, stay as long as you like</span></motion.aside></div>}

    {room && <div className="room-backdrop" onClick={()=>setRoom(null)}><motion.section className="room-panel" role="dialog" aria-modal="true" aria-label="Explore room" onClick={event=>event.stopPropagation()} initial={{y:14,scale:.985,opacity:0}} animate={{y:0,scale:1,opacity:1}} transition={{duration:.32,ease:[.2,.75,.2,1]}}><div className="room-top"><span><i/> A ROOM IN SYAN’S MIND</span><button onClick={()=>setRoom(null)} aria-label="Close room"><X/></button></div>{room==='explore' ? <><div className="room-heading"><p className="section-label">Wander wherever you like</p><h2>Pick a little<br/><em>something.</em></h2></div><div className="room-menu">{[{name:'Little Experiment',detail:'A tiny music & feelings lab',key:'experiment',icon:'♫'},{name:'Things I Carry',detail:'A pocketful of curiosities',key:'things',icon:'✳'},{name:'Projects',detail:'Small worlds, made with care',key:'projects',icon:'↗'},{name:'Research Playground',detail:'Questions in progress',key:'research',icon:'?' }].map((item,index)=><button key={item.key} onClick={()=>setRoom(item.key)}><small>0{index+1}</small><span className="room-menu-icon">{item.icon}</span><span className="room-menu-copy"><strong>{item.name}</strong><em>{item.detail}</em></span><ChevronRight size={17}/></button>)}</div></> : <><div className="room-heading room-inner-heading"><button className="room-back" onClick={()=>setRoom('explore')}><ArrowLeft size={14}/> ALL ROOMS</button><p className="section-label">{room==='experiment'?'PLAY A LITTLE':room==='things'?'A POCKET COLLECTION':room==='projects'?'SMALL WORLDS':room==='research'?'QUESTIONS, NO ANSWERS YET':''}</p><h2>{room==='experiment'?<>Little <em>Experiment</em></>:room==='things'?<>Things I <em>Carry</em></>:room==='projects'?<>Made with <em>meaning</em></>:<>Research <em>Playground</em></>}</h2></div>
      {room==='experiment' && <div className="experiment-room"><div className="experiment-intro"><h3>How are you feeling today?</h3><p>Pick a mood. I’ll make a tiny original piano phrase just for it. Sound starts only when you choose.</p></div><div className="mood-grid" role="group" aria-label="Choose a mood">{moods.map(item=><button key={item.name} className={`mood-chip ${item.color} ${mood?.name===item.name?'selected':''}`} onClick={()=>void playMood(item)} aria-pressed={mood?.name===item.name}><span>{item.face}</span>{item.name}</button>)}</div><div className={`mood-result ${mood?'visible':''}`} aria-live="polite">{mood?<><div className="result-top"><span className="result-label">{mood.note}</span><span className="mini-eq" aria-hidden="true">{[1,2,3,4,5,6,7].map(n=><i key={n}/>)}</span></div><p className="result-sound">{mood.sound}</p></>:<div className="result-empty"><AudioLines/><span>Your little soundtrack will find its way here.</span></div>}</div><div className="sound-control"><span>ORIGINAL TINY MOTIFS · 4 SECONDS</span><button onClick={toggleMute} aria-pressed={muted}>{muted?<VolumeX size={15}/>:<Volume2 size={15}/>} {muted?'Sound off':'Sound on'}</button></div><div className="slider-lab"><div><span className="lab-label"><Sparkles size={13}/> YOUR TURN TO WONDER</span><h3>How much does music affect your mood?</h3><p className="slider-response" aria-live="polite">“{response}”</p></div><div className="slider-control"><div className="slider-value"><span>NOT MUCH</span><strong>{impact}<small>/ 100</small></strong><span>A LOT</span></div><input aria-label="How much does music affect your mood, from zero to one hundred" type="range" min="0" max="100" value={impact} onChange={event=>setImpact(Number(event.target.value))} style={{'--range':`${impact}%`} as React.CSSProperties}/><div className="wave-visual" aria-hidden="true">{Array.from({length:25},(_,i)=><i key={i} style={{'--wave':`${Math.round(7+Math.abs(Math.sin((i+impact/12)*.52))*34)}px`} as React.CSSProperties}/>)}</div></div></div><div className="research-cards experiment-questions">{questions.map((item,index)=><button className={`research-question ${item.color} ${activeQuestion===index?'question-open':''}`} key={item.title} onClick={()=>setActiveQuestion(activeQuestion===index?null:index)} aria-expanded={activeQuestion===index}><span>QUESTION 0{index+1}</span><strong>{item.title}</strong><i>{activeQuestion===index?'−':'+'}</i>{activeQuestion===index&&<p>{item.text}</p>}</button>)}</div></div>}
      {room==='things' && <div className="carry-room"><p className="carry-intro">Little things I keep in my pockets (metaphorically; I lose my actual pockets).</p>{thoughts.map((item,index)=>{const Icon=item.icon;return <article className={`carry-note carry-${index+1}`} key={item.title}><span>0{index+1} / A THING I CARRY</span><Icon size={20}/><h3>{item.title}</h3><p>{item.text}</p></article>})}</div>}
      {room==='projects' && <div className="projects-room"><div className="project-carousel" ref={carousel} onPointerDown={event=>{const node=event.currentTarget;node.setPointerCapture(event.pointerId);node.dataset.startX=String(event.clientX);node.dataset.scrollX=String(node.scrollLeft)}} onPointerMove={event=>{const node=event.currentTarget;if(event.buttons===1&&node.dataset.startX)node.scrollLeft=Number(node.dataset.scrollX)-(event.clientX-Number(node.dataset.startX))}}><article className="chapter-card"><div className="chapter-art"><div className="chapter-orbit"/><span className="chapter-rabbit"><Rabbit size={19}/></span><span className="chapter-mark">18</span><span className="chapter-note">a page, not the whole story</span></div><div className="chapter-info"><span className="chapter-label">A PRIVATE LITTLE UNIVERSE</span><h3>Chapter 18</h3><p>A small digital world made with intention, warmth, and a little bit of mystery.</p><a href="https://v0-chapter-18.vercel.app/" target="_blank" rel="noreferrer">Enter Chapter 18 <ArrowUpRight size={14}/></a></div></article><article className="upcoming-card"><span className="coming-label"><i/> COMING SOON</span><span className="upcoming-icon">♫</span><h3>MoodMusic</h3><p>Music, feelings, and the patterns between them.</p><span className="upcoming-num">01</span></article><article className="upcoming-card upcoming-alt"><span className="coming-label"><i/> COMING SOON</span><span className="upcoming-icon">✳</span><h3>Psychology of Music</h3><p>Exploring emotions through data.</p><span className="upcoming-num">02</span></article></div><div className="carousel-controls"><span>DRAG TO WANDER</span><button aria-label="Scroll projects left" onClick={()=>carousel.current?.scrollBy({left:-250,behavior:'smooth'})}><ArrowLeft size={15}/></button><button aria-label="Scroll projects right" onClick={()=>carousel.current?.scrollBy({left:250,behavior:'smooth'})}><ArrowRight size={15}/></button></div></div>}
      {room==='research' && <div className="research-room"><div className="research-cards">{questions.map((item,index)=><button className={`research-question ${item.color} ${activeQuestion===index?'question-open':''}`} key={item.title} onClick={()=>setActiveQuestion(activeQuestion===index?null:index)} aria-expanded={activeQuestion===index}><span>QUESTION 0{index+1}</span><strong>{item.title}</strong><i>{activeQuestion===index?'−':'+'}</i>{activeQuestion===index&&<p>{item.text}</p>}</button>)}</div><div className="research-footnote"><FlaskConical size={17}/><span>These are starting points, not conclusions. The interesting part is learning how to ask.</span></div></div>}
    </>}</motion.section></div>}
  </main>
}
