import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Link, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, ExternalLink, Github, ArrowRight, Play, Shield } from 'lucide-react'

const accents = {
  light: { violet: '#7C3AED', mint: '#10B981', orange: '#F97316' },
  dark: { violet: '#A78BFA', mint: '#34D399', orange: '#FB923C' },
}

function useTheme() {
  const prefersDark = useMemo(() => window.matchMedia('(prefers-color-scheme: dark)').matches, [])
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light'))
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return { theme, setTheme }
}

function Nav({ theme, setTheme }) {
  const [open, setOpen] = useState(false)
  const [scrollUp, setScrollUp] = useState(true)
  const lastY = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrollUp(y < lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const items = [
    { id: 'about', label: 'About' },
    { id: 'stack', label: 'Tech' },
    { id: 'projects', label: 'Projects' },
    { id: 'xp', label: 'Experience' },
    { id: 'blog', label: 'Insights' },
  ]
  const linkCls = 'relative px-2 py-1 text-sm font-medium focus:outline-none focus-visible:ring-2 rounded'
  return (
    <div className={`sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#0D1117]/60 ${scrollUp ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <Link to="#" className="font-bold tracking-tight">FS Engineer</Link>
        <div className="hidden sm:flex items-center gap-4">
          {items.map((it) => (
            <a key={it.id} href={`#${it.id}`} className={`${linkCls} group`}>
              <span className="underline-offset-8 group-hover:underline transition-all">{it.label}</span>
            </a>
          ))}
          <button aria-label="Toggle theme" className="p-2 rounded focus-visible:ring-2" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}      
          </button>
        </div>
        <div className="sm:hidden">
          <button className="p-2" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X/> : <Menu/>}</button>
        </div>
      </nav>
      {open && (
        <div className="sm:hidden border-t border-zinc-200 dark:border-zinc-800 px-4 pb-3">
          {items.map((it) => (
            <a key={it.id} href={`#${it.id}`} className="block py-2" onClick={() => setOpen(false)}>{it.label}</a>
          ))}
          <button className="mt-2 inline-flex items-center gap-2 border px-3 py-2 rounded" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>} Theme
          </button>
        </div>
      )}
    </div>
  )
}

function Hero({ theme }) {
  const code = `const greet = (name) => {\n  return ` + '${' + '`Hello, ${name}!`' + '}' + '\n}\n\nexport default greet\n// TODO: build something great!'
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="[mask-image:linear-gradient(to_bottom,black,transparent)] h-40 overflow-hidden">
          <div className="whitespace-nowrap animate-[scroll_12s_linear_infinite] will-change-transform text-xs font-mono opacity-60">
            {Array.from({length: 20}).map((_,i)=> (
              <pre key={i} className="inline-block px-8 text-left align-top text-zinc-600 dark:text-zinc-300">{code}</pre>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Full‑stack Engineer</h1>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">I craft resilient systems and razor‑clean interfaces. From data to design, I deliver end‑to‑end products with clarity and speed.</p>
        <a href="#projects" className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded border border-slate-300 dark:border-slate-700 relative overflow-hidden group">
          <span className="relative z-10">View Projects</span>
          <ArrowRight size={16} className="relative z-10"/>
          <span className="absolute inset-0 bg-violet-500/10 group-hover:scale-[2] transition-transform duration-300 rounded-full"/>
        </a>
      </div>
    </section>
  )
}

function Chips({ items }){
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="px-3 py-1 rounded-full border text-xs bg-white/60 dark:bg-white/5 border-zinc-200 dark:border-zinc-800 hover:shadow-[0_0_0_2px_#7C3AED] dark:hover:shadow-[0_0_0_2px_#A78BFA] transition" aria-label={t}>{t}</span>
      ))}
    </div>
  )
}

function Projects(){
  const [items, setItems] = useState([])
  useEffect(() => {
    const load = async () => {
      try {
        const base = import.meta.env.VITE_BACKEND_URL || ''
        const res = await fetch(`${base}/api/projects`)
        const data = await res.json()
        setItems(data)
      } catch (e) {}
    }
    load()
  }, [])
  return (
    <section id="projects" className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <article key={p.slug} className="group border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:border-violet-500/70 transition">
            <div className="aspect-video rounded bg-zinc-100 dark:bg-zinc-900 mb-3"/>
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{p.summary}</p>
            <div className="mt-3 flex items-center gap-2">
              {p.demo_url && <a href={p.demo_url} className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:underline"><ExternalLink size={16}/> Live</a>}
              {p.repo_url && <a href={p.repo_url} className="inline-flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:underline"><Github size={16}/> Repo</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Section({ id, title, children }){
  return (
    <section id={id} className="max-w-6xl mx-auto px-4 py-16">
      <header className="mb-6"><h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2></header>
      {children}
    </section>
  )
}

function About(){
  return (
    <Section id="about" title="About">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <div className="aspect-[3/4] rounded bg-zinc-100 dark:bg-zinc-900"/>
        </div>
        <div className="md:col-span-8 text-zinc-700 dark:text-zinc-300 leading-7">
          <p>
            I'm a full‑stack engineer focused on clear architectures and crisp UX. I ship production systems across web and cloud—owning discovery, design, and delivery. My tooling spans TypeScript, React, Node, Python, FastAPI, and cloud infra. I value fast feedback, robust testing, and humane DX.
          </p>
        </div>
      </div>
    </Section>
  )
}

function Tech(){
  const stack = ['TypeScript','React','Vite','Tailwind','Node.js','FastAPI','MongoDB','PostgreSQL','AWS','Docker']
  return (
    <Section id="stack" title="Tech Stack">
      <Chips items={stack}/>
    </Section>
  )
}

function Experience(){
  const [xp, setXp] = useState([])
  const [edu, setEdu] = useState([])
  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_URL || ''
    Promise.all([
      fetch(`${base}/api/experience`).then(r=>r.json()).catch(()=>[]),
      fetch(`${base}/api/education`).then(r=>r.json()).catch(()=>[]),
    ]).then(([a,b])=>{ setXp(a); setEdu(b); })
  }, [])
  return (
    <Section id="xp" title="Experience & Education">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-3">Experience</h3>
          <ul className="space-y-4">
            {xp.map((i)=> (
              <li key={i.id} className="border-l-2 pl-4"> <div className="text-sm">{i.start} – {i.end}</div> <div className="font-medium">{i.role} @ {i.org}</div><p className="text-sm text-zinc-600 dark:text-zinc-400">{i.summary}</p></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Education</h3>
          <ul className="space-y-4">
            {edu.map((i)=> (
              <li key={i.id} className="border-l-2 pl-4"> <div className="text-sm">{i.start} – {i.end}</div> <div className="font-medium">{i.degree} @ {i.school}</div><p className="text-sm text-zinc-600 dark:text-zinc-400">{i.summary}</p></li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

function Blog(){
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const base = import.meta.env.VITE_BACKEND_URL || ''
    fetch(`${base}/api/posts`).then(r=>r.json()).then(setPosts).catch(()=>{})
  }, [])
  return (
    <Section id="blog" title="Insights">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p)=> (
          <article key={p.id} className="border border-zinc-200 dark:border-zinc-800 rounded p-4 bg-white dark:bg-[#0F1218]">
            <h3 className="font-semibold">{p.title}</h3>
            <div className="text-xs text-zinc-500">{p.read_time} min read</div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-3">{p.excerpt}</p>
            <Chips items={p.tags || []}/>
          </article>
        ))}
      </div>
    </Section>
  )
}

function Footer(){
  return (
    <footer className="py-12 text-center text-xs text-zinc-500">© {new Date().getFullYear()} Full‑stack Engineer</footer>
  )
}

export default function App(){
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    const dot = document.createElement('div')
    dot.className = 'pointer-events-none fixed top-0 left-0 w-2 h-2 rounded-full mix-blend-screen'
    document.body.appendChild(dot)
    const move = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      dot.style.background = theme === 'dark' ? '#A78BFA' : '#7C3AED'
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!mq.matches) window.addEventListener('pointermove', move)
    return () => { window.removeEventListener('pointermove', move); dot.remove() }
  }, [theme])

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0D1117] dark:text-slate-200 selection:bg-violet-500/20">
      <Nav theme={theme} setTheme={setTheme}/>
      <Hero theme={theme}/>
      <About/>
      <Tech/>
      <Projects/>
      <Experience/>
      <Blog/>
      <Footer/>
      <style>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}
