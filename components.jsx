/* ====================== COMPONENTS · part 1 ====================== */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------- smart image with placeholder fallback ---------- */
function SmartImg({ src, alt, label }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <div className="ph" aria-label={alt}><span className="pht">{label || alt}</span></div>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

/* ---------- custom cursor ---------- */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(max-width: 820px)").matches) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; };
    const loop = () => { rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2; if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; raf = requestAnimationFrame(loop); };
    loop(); window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (<>
    <div className="cursor-dot" ref={dot}></div>
    <div className="cursor-ring" ref={ring}><span className="cur-label" id="curLabel">View</span></div>
  </>);
}

/* ---------- header ---------- */
function Header({ onToggleGrid, gridOn }) {
  return (
    <header className="site-head">
      <a className="brand-logo" href="#top" data-cursor="link" data-label="Top">
        <img src="assets/logo.png" alt="Antriana Panagi logo" />
      </a>
      <a className="brand" href="#top" data-cursor="link" data-label="Top">
        <span className="nm">Antriana Panagi</span>
      </a>
      <nav>
        <a className="nav-link" href="#work" data-cursor="hover"><span className="idx">01</span> Work</a>
        <a className="nav-link" href="#about" data-cursor="hover"><span className="idx">02</span> About</a>
        <a className="nav-link" href="#contact" data-cursor="hover"><span className="idx">03</span> Contact</a>
        <button onClick={onToggleGrid} data-cursor="hover" title="Toggle the grid">{gridOn ? "Grid ●" : "I ♥ Grid"}</button>
      </nav>
    </header>
  );
}

/* ---------- hero ---------- */
function Hero() {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => ref.current && ref.current.classList.add("in"), 120); return () => clearTimeout(t); }, []);
  return (
    <section className="hero page" id="top" ref={ref}>
      <div className="hero-meta">
        <div className="m"><div className="k">Designer</div><div className="v">{SITE.role}</div></div>
        <div className="m"><div className="k">Based</div><div className="v">{SITE.location}</div></div>
        <div className="m"><div className="k">Index</div><div className="v">{String(PROJECTS.length).padStart(2, "0")} Projects · ‘23–‘26</div></div>
      </div>
      <div className="hero-name">
        <h1 className="display">
          <span className="ln"><span>Antriana</span></span>
          <span className="ln lined"><span>Panagi</span></span>
        </h1>
        <img className="hero-blob float" src="assets/logo.png" alt="" />
      </div>
      <div className="hero-rule"><div className="ticks">{Array.from({ length: 41 }).map((_, i) => <i key={i}></i>)}</div></div>
      <div className="hero-foot">
        <p className="hf-l">{SITE.intro}</p>
        <div className="hf-c"><a className="scroll-cue" href="#work" data-cursor="hover"><span className="arr">↓</span> Selected Work</a></div>
        <div className="ps-grid">P.S. I love <span className="gridword" data-grid-trigger>grid</span></div>
      </div>
    </section>
  );
}

/* ---------- stats strip ---------- */
function Marquee() {
  const stats = [
    { n: "7",  l: "Projects",    col: 2 },
    { n: "3",  l: "Disciplines", col: 5 },
    { n: "3+", l: "Years",       col: 8 },
    { n: "2",  l: "Internships", col: 11 },
  ];
  return (
    <div className="statsbar">
      {stats.map((s, i) => (
        <div className="sb-item" key={i} style={{gridColumnStart: s.col, gridRow: 1}}>
          <span className="sb-n display">{s.n}</span>
          <span className="sb-l">{s.l}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { SmartImg, Cursor, Header, Hero, Marquee });
