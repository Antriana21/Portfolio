/* ====================== APP ====================== */
function App() {
  const [loaded, setLoaded] = useState(true);
  const [gridOn, setGridOn] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [active, setActive] = useState("top");

  const index = openId ? PROJECTS.findIndex((p) => p.id === openId) : -1;
  const project = index >= 0 ? PROJECTS[index] : null;

  const open = useCallback((id) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);
  const nav = useCallback((dir) => {
    setOpenId((cur) => { const i = PROJECTS.findIndex((p) => p.id === cur); return PROJECTS[(i + dir + PROJECTS.length) % PROJECTS.length].id; });
  }, []);

  /* custom-cursor delegation */
  useEffect(() => {
    if (window.matchMedia("(max-width: 820px)").matches) return;
    const label = document.getElementById("curLabel");
    const onOver = (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) { const mode = t.getAttribute("data-cursor"); document.body.setAttribute("data-cur", mode); if (mode === "link" && label) label.textContent = t.getAttribute("data-label") || "View"; }
      else document.body.removeAttribute("data-cur");
    };
    document.addEventListener("mouseover", onOver);
    return () => document.removeEventListener("mouseover", onOver);
  }, []);

  /* grid trigger from hero word */
  useEffect(() => {
    const el = document.querySelector("[data-grid-trigger]"); if (!el) return;
    const on = () => setGridOn(true), off = () => setGridOn(false);
    el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off);
    return () => { el.removeEventListener("mouseenter", on); el.removeEventListener("mouseleave", off); };
  }, [loaded]);

  /* active-section tracking for side nav */
  useEffect(() => {
    if (!loaded) return;
    const ids = ["top", "work", "about", "contact"];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [loaded]);

  /* theme the fixed chrome to the section underneath (avoids off-palette blends) */
  useEffect(() => {
    document.body.dataset.theme = (active === "about" || active === "contact") ? "dark" : "light";
  }, [active]);

  const navItems = [{ id: "top", n: "00", l: "Intro" }, { id: "work", n: "01", l: "Work" }, { id: "about", n: "02", l: "About" }, { id: "contact", n: "03", l: "Contact" }];

  return (
    <>
      <Cursor />
      <div className="grain"></div>
      <div className={"grid-overlay" + (gridOn ? " on" : "")} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => <span key={i}></span>)}
      </div>

      {/* editorial chrome */}
      <div className="rail" aria-hidden="true"><div className="rail-v"></div><div className="rail-tag">Antriana Panagi © {new Date().getFullYear()}</div></div>
      <nav className="sidenav" aria-label="Sections">
        {navItems.map((it) => (
          <a key={it.id} href={"#" + (it.id === "top" ? "top" : it.id)} className={active === it.id ? "on" : ""} data-cursor="hover">
            <span className="sn-l">{it.n} {it.l}</span><span className="sn-d"></span>
          </a>
        ))}
      </nav>
      <Header onToggleGrid={() => setGridOn((v) => !v)} gridOn={gridOn} />
      <main>
        <Hero />
        <Marquee />
        <Work onOpen={open} />
        <About />
        <Contact />
      </main>

      <Overlay project={project} index={index} total={PROJECTS.length} onClose={close} onNav={nav} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
