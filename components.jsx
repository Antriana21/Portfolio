/* ====================== COMPONENTS · part 1 ====================== */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------- smart image with placeholder fallback ---------- */
function SmartImg({ src, alt, label, imgStyle, eager }) {
  const isMp4 = !!(src && (src.toLowerCase().includes('.mp4') || src.toLowerCase().includes('.mov')));
  const isGif = !!(src && src.toLowerCase().includes('.gif'));
  const isHtml = !!(src && src.toLowerCase().endsWith('.html'));
  const [failed, setFailed] = useState(!src);
  const [playing, setPlaying] = useState(false);
  const [htmlPlaying, setHtmlPlaying] = useState(false);
  const [htmlPaused, setHtmlPaused] = useState(false);
  const videoRef = useRef(null);
  const htmlWrapRef = useRef(null);
  const htmlFrameRef = useRef(null);

  useEffect(() => {
    if (!isHtml) return;
    const FRAME_W = 1920, FRAME_H = 1124;
    const apply = () => {
      const wrap = htmlWrapRef.current;
      const frame = htmlFrameRef.current;
      if (!wrap || !frame) return;
      const h = wrap.offsetHeight;
      const scale = h / FRAME_H;
      frame.style.transform = `scale(${scale})`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    if (htmlWrapRef.current) ro.observe(htmlWrapRef.current);
    return () => ro.disconnect();
  }, [isHtml, htmlPlaying]);

  const toggleVideo = () => {
    const v = videoRef.current; if (!v) return;
    playing ? v.pause() : v.play();
    setPlaying(p => !p);
  };

  const sendWt = (type) => {
    if (htmlFrameRef.current) htmlFrameRef.current.contentWindow.postMessage({ type }, '*');
  };
  const pauseWalkthrough = (e) => { e.stopPropagation(); sendWt('wt-pause'); setHtmlPaused(true); };
  const resumeWalkthrough = (e) => { e.stopPropagation(); sendWt('wt-play'); setHtmlPaused(false); };

  if (failed) return <div className="ph" aria-label={alt}><span className="pht">{label || alt}</span></div>;

  if (isHtml) {
    if (!htmlPlaying) {
      return (
        <div className="vid-wrap html-embed-poster" onClick={e => { e.stopPropagation(); setHtmlPlaying(true); }}>
          <div className="vid-overlay"><span className="vid-play-btn">▶</span></div>
        </div>
      );
    }
    return (
      <div className="html-embed-wrap" ref={htmlWrapRef}>
        <iframe ref={htmlFrameRef} src={src} className="html-embed-frame" scrolling="no" />
        <div className={`html-embed-controls${htmlPaused ? ' is-paused' : ''}`} onClick={htmlPaused ? resumeWalkthrough : pauseWalkthrough}>
          <span className="vid-play-btn">{htmlPaused ? '▶' : '⏸'}</span>
        </div>
      </div>
    );
  }

  if (isMp4) {
    return (
      <div className="vid-wrap" onClick={toggleVideo}>
        <video ref={videoRef} src={src} loop muted playsInline onError={() => setFailed(true)} />
        {!playing && <div className="vid-overlay"><span className="vid-play-btn">▶</span></div>}
      </div>
    );
  }

  if (isGif) {
    return (
      <div className="gif-wrap" onClick={() => setPlaying(p => !p)}>
        {playing
          ? <img src={src} alt={alt} onError={() => setFailed(true)} style={imgStyle} />
          : <div className="gif-poster"><span className="gif-play-btn">▶</span><span className="gif-label">GIF</span></div>
        }
      </div>
    );
  }

  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setFailed(true)} style={imgStyle} />;
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
