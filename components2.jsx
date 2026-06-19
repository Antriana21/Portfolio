/* ====================== COMPONENTS · part 2 ====================== */

/* ---------- WORK: structured index + cursor-trailing preview ---------- */
function Work({ onOpen }) {
  const [filter, setFilter] = useState("all");
  const [hover, setHover] = useState(null);     // hovered project
  const prevEl = useRef(null);
  const target = useRef({ x: innerWidth / 2, y: innerHeight / 2 });
  const pos = useRef({ x: innerWidth / 2, y: innerHeight / 2 });

  const groups = [
    { k: "all", l: "All" }, { k: "branding", l: "Branding" }, { k: "motion", l: "Motion" },
    { k: "social", l: "Social · Paid" }, { k: "print", l: "Print" },
    { k: "editorial", l: "Editorial" }, { k: "packaging", l: "Packaging" },
  ];
  const counts = (k) => k === "all" ? PROJECTS.length : PROJECTS.filter((p) => (p.groups || [p.group]).includes(k)).length;
  const list = PROJECTS.filter((p) => filter === "all" || (p.groups || [p.group]).includes(filter));

  useEffect(() => {
    PROJECTS.forEach(p => {
      if (!p.img) return;
      if (/\.(mp4|mov|gif|html)$/i.test(p.img)) return;
      const img = new Image();
      img.src = p.img;
    });
  }, []);

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
        <div><span className="sh-no">01 | Index</span><h2 className="display">Selected Work</h2></div>
        <div className="sh-r">Branding · Motion<br />Social · Print<br />({String(list.length).padStart(2, "0")})</div>
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

/* ---------- CONTACT constants ---------- */
const WEB3FORMS_KEY = "YOUR-ACCESS-KEY-HERE"; // paste your Web3Forms key (web3forms.com)
const CV_FILE = "Antriana_Panagi_CV.pdf";      // place PDF next to index.html
const CONTACT_REASONS = ["Hiring", "Freelance", "Other"];

/* ---------- ABOUT ---------- */
function About() {
  return (
    <section className="about page" id="about">
      <div className="sechead">
        <div><span className="sh-no">02 | Profile</span><h2 className="display">About</h2></div>
      </div>
      <div className="about-grid">

        {/* Left column — bio */}
        <div className="about-col--left">
          <p className="lead display">Clean, intentional design, <span className="hl">built on a grid,</span> finished with care.</p>
          <p className="bio">{SITE.bio}</p>
          <div className="skills">{SKILLS.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
          <div className="side" style={{marginTop:"32px"}}>
            <div className="blk"><div className="h">Focus</div>
              <ul>
                <li>Brand Identity <span>Marks &amp; systems</span></li>
                <li>Editorial <span>Layout &amp; type</span></li>
                <li>Packaging <span>Print &amp; product</span></li>
                <li>Social Media <span>Content &amp; paid media</span></li>
                <li>Marketing <span>Paid media &amp; strategy</span></li>
              </ul>
            </div>
            <div className="blk"><div className="h">Tools</div>
              <ul>
                <li>Adobe CC <span>Daily</span></li>
                <li>Figma <span>Daily</span></li>
                <li>Meta Ads Manager <span>Campaigns</span></li>
                <li>LinkedIn Campaign Manager <span>Campaigns</span></li>
                <li>Google Ads <span>Campaigns</span></li>
                <li>GA4 <span>Analytics</span></li>
                <li>Mailchimp <span>Email</span></li>
                <li>Brevo <span>Email</span></li>
              </ul>
            </div>
            <div style={{paddingTop:"16px"}}>
              <a href={SITE.cv} download="Antriana Panagi – CV.pdf" data-cursor="hover"
                style={{display:"inline-flex",alignItems:"center",gap:"10px",fontSize:".74rem",letterSpacing:".1em",textTransform:"uppercase",background:"#fff",border:"1.5px solid #fff",borderRadius:"999px",padding:"13px 28px",color:"#2130eb",textDecoration:"none",cursor:"none"}}>
                Download CV ↓
              </a>
            </div>
          </div>
        </div>

        {/* Right column — marketing */}
        <div className="about-col--right">
          <div style={{borderTop:"1.5px solid rgba(255,255,255,.25)",paddingTop:"16px"}}>
            <div style={{fontSize:".68rem",letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:"14px"}}>§ Marketing &amp; Paid Media</div>
            <p style={{margin:"0 0 16px",fontSize:"1rem",lineHeight:"1.65",color:"rgba(255,255,255,.78)"}}>Not just the design, the whole engine. I plan, build, run and report the marketing end-to-end, and I do it as the only person on the marketing team.</p>
            {[
              ["Paid media, end-to-end.", "I build the campaigns, write the copy, design the creative to the allocated budget, optimise and report, across LinkedIn, Meta (FB + IG), Google (Search + Display) and X."],
              ["Lead generation → sales.", "I own the loop: generate leads through ads, social and website forms, qualify them, and hand them to sales, then report the full picture (social growth, engagement, impressions, Google Ads and leads) monthly to the CEO, Sales Director and Group Marketing Manager."],
              ["Technical → clear.", "I translate complex maritime and enterprise-tech products into messaging that's actually catchy and easy to follow."],
              ["Brand rollout & web.", "I led a post-merger brand rollout across web, social, email and partner materials, art-directing the new logo to the C-suite's brief and redesigning the company website, plus landing pages."],
              ["Partner & co-marketing.", "I run co-branded campaigns and materials with technology partners, joint social, event sponsorship assets and co-branded content."],
              ["Email & content calendars.", "Email marketing in Mailchimp and Brevo, and monthly content calendars across every social channel, email and articles."],
              ["Analytics & reporting.", "GA4, Meta Ads Manager, LinkedIn Campaign Manager and Google Ads, measurement that feeds the monthly C-level report."],
            ].map(([label, desc]) => (
              <div key={label} style={{marginBottom:"14px"}}>
                <span style={{fontSize:".94rem",color:"#fff",fontWeight:"600"}}>{label}</span>
                <p style={{margin:"3px 0 0",fontSize:".9rem",color:"rgba(255,255,255,.7)",lineHeight:"1.55"}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <img className="watermark" src="assets/logo.png" alt="" />
    </section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = e.target;
    const el = form.elements;
    const data = {
      access_key: WEB3FORMS_KEY,
      subject: `Portfolio enquiry`,
      from_name: "Antriana Panagi – Portfolio",
      name: el.name.value,
      email: el.email.value,
      message: el.message.value,
      botcheck: el.botcheck.checked,
    };
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again or email me directly.");
    }
  }

  return (
    <section className="contact page" id="contact">
      <div className="sechead">
        <div><span className="sh-no">03 | Contact</span></div>
        <div className="sh-r">Available for<br />Freelance &amp;<br />Full-time</div>
      </div>

      <div className="ct-top">
        <span className="ct-head display">Let&rsquo;s make<br />something.</span>
      </div>

      <div className="ct-grid">
        <form className="ct-form" onSubmit={handleSubmit} noValidate>
          <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" style={{display:"none"}} />

          <div className="ct-field">
            <label htmlFor="ct-name">Name</label>
            <input id="ct-name" name="name" type="text" required placeholder="Your name" />
          </div>

          <div className="ct-field">
            <label htmlFor="ct-email">Email</label>
            <input id="ct-email" name="email" type="email" required placeholder="you@email.com" />
          </div>


          <div className="ct-field">
            <label htmlFor="ct-msg">Message</label>
            <textarea id="ct-msg" name="message" rows="4" required placeholder="Tell me a little about it." />
          </div>

          <div className="ct-actions">
            <button type="submit" className="ct-btn" disabled={status === "sending"} data-cursor="hover">
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            <a className="ct-btn ct-btn--ghost" href={CV_FILE} download="Antriana Panagi – CV.pdf" data-cursor="hover">
              Download CV ↓
            </a>
          </div>

          <p className="ct-status" aria-live="polite">
            {status === "success" && "Thanks — your message is on its way. I’ll be in touch."}
            {status === "error" && errorMsg}
          </p>
        </form>

        <div className="ct-side">
          <span className="ct-side-lbl">Elsewhere</span>
          <a className="ct-social" href={SITE.linkedin} target="_blank" rel="noreferrer" data-cursor="hover">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a className="ct-social" href={CV_FILE} download="Antriana Panagi – CV.pdf" data-cursor="hover">
            Download CV <span aria-hidden="true">↓</span>
          </a>
        </div>
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
              <div><div className="k">Role</div><div className="v">{p.role || ('Design · ' + SITE.name)}</div></div>
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
              {imgs.map((item, i) => {
                const src = typeof item === 'string' ? item : item.src;
                const thumb = typeof item === 'object' ? item.thumb : undefined;
                return (
                  <div className="ov-gi" key={i}>
                    <SmartImg src={src} thumb={thumb} alt={`${p.title} ${i + 1}`} label={p.cat} />
                  </div>
                );
              })}
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
