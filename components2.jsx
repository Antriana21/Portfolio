/* ====================== COMPONENTS · part 2 ====================== */

/* ---------- WORK: structured index + cursor-trailing preview ---------- */
function Work({ onOpen }) {
  const [filter, setFilter] = useState("all");
  const [hover, setHover] = useState(null);     // hovered project
  const prevEl = useRef(null);
  const target = useRef({ x: innerWidth / 2, y: innerHeight / 2 });
  const pos = useRef({ x: innerWidth / 2, y: innerHeight / 2 });

  const groups = [
    { k: "all", l: "All" }, { k: "branding", l: "Branding" }, { k: "editorial", l: "Editorial" },
    { k: "packaging", l: "Packaging" }, { k: "motion", l: "Motion" },
  ];
  const counts = (k) => k === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.group === k).length;
  const list = PROJECTS.filter((p) => filter === "all" || p.group === filter);

  useEffect(() => {
    if (window.matchMedia("(max-width: 980px)").matches) return;
    let raf;
    const move = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      if (prevEl.current) prevEl.current.style.transform =
        `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%,-50%)` +
        (prevEl.current.classList.contains("on") ? " scale(1) rotate(0deg)" : " scale(.86) rotate(-3deg)");
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move); loop();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="work page" id="work">
      <div className="sechead">
        <div><span className="sh-no">§ 01 | Index</span><h2 className="display">Selected Work</h2></div>
        <div className="sh-r">Branding · Editorial<br />Packaging · Motion<br />({String(list.length).padStart(2, "0")})</div>
      </div>

      <div className="filters">
        {groups.map((g) => (
          <button key={g.k} className={filter === g.k ? "active" : ""} onClick={() => setFilter(g.k)} data-cursor="hover">
            {g.l}<span className="ct">{String(counts(g.k)).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      <div className="windex" onMouseLeave={() => setHover(null)}>
        {list.map((p, i) => (
          <Row key={p.id} p={p} n={i} onOpen={onOpen} onEnter={() => setHover(p)} />
        ))}
      </div>

      {/* floating preview */}
      <div className={"preview" + (hover ? " on" : "")} ref={prevEl} aria-hidden="true">
        {hover && <SmartImg src={hover.img} alt={hover.title} label={hover.cat} eager imgStyle={hover.thumbStyle || (hover.thumbPos ? {objectPosition: hover.thumbPos} : undefined)} />}
      </div>
    </section>
  );
}

function Row({ p, n, onOpen, onEnter }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <article className="wrow reveal" ref={ref} style={{ transitionDelay: (n % 4) * 0.05 + "s" }}
      onMouseEnter={onEnter} onClick={() => onOpen(p.id)} data-cursor="link" data-label="Open">
      <div className="wn">{String(n + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</div>
      <div className="wmid">
        <span className="wt">{p.title}</span>
        <span className="wc">{p.cat}</span>
      </div>
      <div className="wr">
        <span className="wy">{p.year}</span>
        <span className="wgo">↗</span>
      </div>
      <div className="wthumb"><SmartImg src={p.img} alt={p.title} label={p.cat} eager imgStyle={p.thumbStyle || (p.thumbPos ? {objectPosition: p.thumbPos} : undefined)} /></div>
    </article>
  );
}

/* ---------- ABOUT ---------- */
function About() {
  return (
    <section className="about page" id="about">
      <div className="sechead">
        <div><span className="sh-no">§ 02 | Profile</span><h2 className="display">About</h2></div>
        <div className="sh-r">Cyprus University<br />of Technology<br />BA · 2020–24</div>
      </div>
      <div className="about-grid">
        <p className="lead display">Clean, intentional design, <span className="hl">built on a grid,</span> finished with care.</p>
        <p className="bio">{SITE.bio}</p>
        <div className="skills">{SKILLS.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
        <div className="side">
          <div className="blk"><div className="h">Focus</div>
            <ul>
              <li>Brand Identity <span>Marks &amp; systems</span></li>
              <li>Editorial <span>Layout &amp; type</span></li>
              <li>Packaging <span>Print &amp; product</span></li>
              <li>Social Media <span>Content &amp; strategy</span></li>
              <li>Marketing <span>Coordination</span></li>
            </ul>
          </div>
          <div className="blk"><div className="h">Languages</div>
            <ul><li>Greek <span>Native</span></li><li>English <span>Fluent</span></li></ul>
          </div>
          <div className="blk"><div className="h">Tools</div>
            <ul><li>Adobe CC <span>Daily</span></li><li>Figma <span>Daily</span></li></ul>
          </div>
        </div>
      </div>
      <img className="watermark" src="assets/logo.png" alt="" />
    </section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  return (
    <section className="contact page" id="contact">
      <div className="sechead">
        <div><span className="sh-no">§ 03 | Contact</span></div>
        <div className="sh-r">Available for<br />Freelance &amp;<br />Full-time</div>
      </div>
      <div className="ct-top">
        <a className="ct-head display" href={`mailto:${SITE.email}`} data-cursor="link" data-label="Email">Let’s make<br />something.</a>
        <div><a className="ct-email" href={`mailto:${SITE.email}`} data-cursor="hover">{SITE.email} <span className="ar">↗</span></a></div>
      </div>
      <div className="ct-grid">
        <div className="socials">
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" data-cursor="hover">LinkedIn ↗</a>
          <a href={`mailto:${SITE.email}`} data-cursor="hover">Email ↗</a>
        </div>
        <div className="ct-meta">{SITE.name}<br />{SITE.role} · {SITE.location}<br />{SITE.phone}</div>
      </div>
      <div className="footline">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span>Designed on a grid · Built with care</span>
        <span>Electric Blue #2130EB</span>
      </div>
      <img className="bigA" src="assets/logo.png" alt="" />
    </section>
  );
}

/* ---------- PROJECT OVERLAY ---------- */
function Overlay({ project, index, total, onClose, onNav }) {
  const open = !!project;
  const galleryRef = useRef(null);
  useEffect(() => { if (galleryRef.current) galleryRef.current.scrollLeft = 0; }, [project]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  useEffect(() => {
    const onKey = (e) => { if (!open) return; if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") onNav(1); if (e.key === "ArrowLeft") onNav(-1); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onNav]);
  const p = project || {};
  const imgs = p.imgs || (p.img ? [p.img] : []);
  const nextP = project ? PROJECTS[(index + 1) % PROJECTS.length] : null;
  const prevP = project ? PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length] : null;
  const scroll = (dir) => { if (galleryRef.current) galleryRef.current.scrollBy({ left: dir * 480, behavior: "smooth" }); };
  return (
    <div className={"overlay" + (open ? " open" : "")} aria-hidden={!open}>
      {project && (
        <div className="overlay-inner" key={p.id}>
          <div className="ov-bar">
            <button className="close" onClick={onClose} data-cursor="hover"><span className="x">✕</span> Close</button>
            <span className="cnt">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          </div>
          <div className="ov-nav">
            <button onClick={() => onNav(-1)} data-cursor="hover"><div className="lab">← Previous</div><div className="nm display">{prevP && prevP.title}</div></button>
            <button className="nxt" onClick={() => onNav(1)} data-cursor="hover"><div className="lab">Next →</div><div className="nm display">{nextP && nextP.title}</div></button>
          </div>
          <div className="ov-hero">
            <div className="cat">{p.cat} · {p.year}</div>
            <h2 className="display">{p.title}</h2>
            <div className="sub">
              <div><div className="k">Discipline</div><div className="v">{p.cat}</div></div>
              <div><div className="k">Year</div><div className="v">{p.year}</div></div>
              <div><div className="k">Role</div><div className="v">Design · {SITE.name}</div></div>
            </div>
          </div>
          <div className="ov-body">
            <p className="desc display">{p.desc}</p>
            <div className="col2">
              {(p.body || []).map((t, i) => <p key={i}>{t}</p>)}
            </div>
          </div>
          <div className="ov-gallery-wrap">
            <div className="ov-gallery" ref={galleryRef}>
              {imgs.map((src, i) => (
                <div className="ov-gi" key={i}>
                  <SmartImg src={src} alt={`${p.title} ${i + 1}`} label={p.cat} />
                </div>
              ))}
            </div>
            {imgs.length > 1 && (<>
              <button className="ov-arr ov-arr-l" onClick={() => scroll(-1)} data-cursor="hover">‹</button>
              <button className="ov-arr ov-arr-r" onClick={() => scroll(1)} data-cursor="hover">›</button>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Work, Row, About, Contact, Overlay });
