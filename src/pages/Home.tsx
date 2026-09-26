import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, Bell, Check, ChevronRight,
  Gem, LayoutDashboard, LockKeyhole, Pickaxe, Search, Settings2,
  Sparkles, Trophy, WalletCards, Clock3, Target, RotateCcw,
  TrendingUp, Coins, X,
} from "lucide-react";
import { toast } from "sonner";

const tierDefinitions = [
  { tier: 1, name: "Bronze", identity: "First Steps", description: "Begin your mining journey.", className: "badge-bronze" },
  { tier: 2, name: "Silver", identity: "Rising Star", description: "Show dedication, rise above.", className: "badge-silver" },
  { tier: 3, name: "Gold", identity: "Reward Hunter", description: "Claim rewards, stay consistent.", className: "badge-gold" },
  { tier: 4, name: "Platinum", identity: "Elite Miner", description: "Mining with skill & strategy.", className: "badge-platinum" },
  { tier: 5, name: "Diamond", identity: "Precious Miner", description: "Rare, consistent, unstoppable.", className: "badge-diamond" },
  { tier: 6, name: "Emerald", identity: "Growth Master", description: "Grow faster, achieve more.", className: "badge-emerald" },
  { tier: 7, name: "Sapphire", identity: "Top Performer", description: "Top ranks, top performance.", className: "badge-sapphire" },
  { tier: 8, name: "Ruby", identity: "Power Legend", description: "Powerful miner, legend in progress.", className: "badge-ruby" },
  { tier: 9, name: "Master", identity: "Mining King", description: "Rule the mines, be the king.", className: "badge-master" },
  { tier: 10, name: "Legend", identity: "Ultimate Legend", description: "The ultimate miner, the legend.", className: "badge-legend" },
] as const;

const badges = Array.from({ length: 30 }, (_, index) => {
  const level = index + 1;
  const tierIndex = Math.floor(index / 3);
  const stage = (index % 3) + 1 as 1 | 2 | 3;
  const tier = tierDefinitions[tierIndex];
  const stageLabel = ["I", "II", "III"][stage - 1];
  const stageName = ["Cracked", "Restoring", "Complete"][stage - 1];
  return {
    level, tier: tier.tier, stage, stageLabel, stageName, name: tier.name,
    identity: tier.identity, description: tier.description, className: tier.className,
    asset: `/assets/badges/badge_${String(level).padStart(2, "0")}.webp`,
    requirement: `Complete the ${tier.name} ${stageLabel} milestone to unlock Level ${String(level).padStart(2, "0")}.`,
  };
});

type Badge = (typeof badges)[number];
type View = "Overview" | "Mine & Earn" | "Badges" | "Wallet" | "Search" | "Settings";

const navItems: { label: View; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Mine & Earn", icon: Pickaxe },
  { label: "Badges", icon: Trophy },
  { label: "Wallet", icon: WalletCards },
];

function BadgeArt({ badge, large = false, unlocked = true }: { badge: Badge; large?: boolean; unlocked?: boolean }) {
  return (
    <div className={`badge-art has-asset ${badge.className} ${large ? "large" : ""} ${unlocked ? "" : "is-locked"} stage-${badge.stage} ${badge.level === 30 ? "capstone" : ""}`} aria-hidden="true">
      <img src={badge.asset} alt="" width={320} height={320} loading={large ? "eager" : "lazy"} decoding="async" sizes={large ? "220px" : "150px"} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail }: { icon: typeof Coins; label: string; value: string; detail: string }) {
  return <div className="dashboard-stat"><div className="dashboard-stat-icon"><Icon size={17} /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>;
}

export default function Home() {
  const [activeNav, setActiveNav] = useState<View>("Mine & Earn");
  const [isMining, setIsMining] = useState(false);
  const [unlockedCount, setUnlockedCount] = useState(badges.length);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [reward, setReward] = useState(0);
  const [balance, setBalance] = useState(2480);
  const [searchTerm, setSearchTerm] = useState("");
  const [settings, setSettings] = useState({ notifications: true, compact: false, reducedMotion: false });

  const selectedBadge = useMemo(() => badges[selectedLevel - 1], [selectedLevel]);
  const selectedUnlocked = selectedBadge.level <= unlockedCount;
  const nextBadge = badges[unlockedCount] ?? null;
  const filteredBadges = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return badges;
    return badges.filter((badge) => `${badge.level} ${badge.name} ${badge.identity} ${badge.stageName}`.toLowerCase().includes(query));
  }, [searchTerm]);

  // Live mining: while active, award +1 VE every second. This is intentionally
  // independent of the button click so the user can see continuous earning.
  useEffect(() => {
    if (!isMining) return;
    const timer = window.setInterval(() => {
      setReward((value) => value + 1);
      setBalance((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isMining]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = settings.reducedMotion ? "true" : "false";
  }, [settings.reducedMotion]);

  const startMining = () => {
    const nextMiningState = !isMining;
    setIsMining(nextMiningState);
    toast(nextMiningState ? "Mining session activated" : "Mining session paused", {
      description: nextMiningState ? "+1 VE is now earned every second while mining is active." : `Session reward saved at ${reward} VE.`,
    });
  };

  const unlockNext = () => {
    if (!nextBadge) return;
    setUnlockedCount((count) => count + 1);
    setSelectedLevel(nextBadge.level);
    toast.success(`Level ${String(nextBadge.level).padStart(2, "0")} unlocked`, {
      description: `${nextBadge.name} ${nextBadge.stageLabel} is now part of your achievement trail.`,
    });
  };

  const resetJourney = () => {
    setIsMining(false);
    setUnlockedCount(badges.length);
    setSelectedLevel(1);
    setReward(0);
    setBalance(2480);
    toast("Journey reset", { description: "Mining, wallet and session counters are back to their starting state. All 30 badges stay unlocked." });
  };

  const openView = (view: View) => {
    setActiveNav(view);
    if (view === "Badges") window.setTimeout(() => document.getElementById("badge-collection")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBadges = () => openView("Badges");

  const renderOverview = () => (
    <div className="product-view">
      <div className="page-hero compact-hero"><div><div className="eyebrow">Dashboard / overview</div><h2 className="section-title">Your mining journey at a glance.</h2><p className="section-copy">Track live mining, badge progression, balance and your next achievement from one clean workspace.</p></div><button className="primary-cta small-cta" onClick={() => openView("Mine & Earn")}>Open mining desk <ArrowUpRight size={15} /></button></div>
      <div className="dashboard-stats"><StatCard icon={Coins} label="Wallet balance" value={`${balance.toLocaleString()} VE`} detail="Available rewards" /><StatCard icon={Trophy} label="Badges unlocked" value={`${unlockedCount} / 30`} detail={nextBadge ? `Next: Level ${nextBadge.level}` : "Journey complete"} /><StatCard icon={TrendingUp} label="Session mined" value={`${reward} VE`} detail={isMining ? "Mining live" : "Paused"} /><StatCard icon={Target} label="Current milestone" value={nextBadge ? `LV ${String(nextBadge.level).padStart(2, "0")}` : "30"} detail={nextBadge ? `${nextBadge.name} ${nextBadge.stageLabel}` : "Legend III"} /></div>
      <div className="overview-grid">
        <section className="panel overview-card"><div className="panel-heading"><div><div className="eyebrow">Live activity</div><h2>Mining status</h2></div><span className={`live-status ${isMining ? "on" : ""}`}><span />{isMining ? "ACTIVE" : "READY"}</span></div><div className="overview-card-body"><div className="big-metric">{reward}<small>VE earned this session</small></div><div className="overview-actions"><button className={`subtle-button ${isMining ? "is-mining" : "is-idle-cta"}`} onClick={startMining} type="button">{isMining ? "Pause mining" : "Start mining"} <Pickaxe size={14} /></button><span>Rate: <strong>+1 VE / sec</strong></span></div></div></section>
        <section className="panel overview-card"><div className="panel-heading"><div><div className="eyebrow">Achievement trail</div><h2>Next unlock</h2></div><Trophy size={18} color="#d7a94b" /></div><div className="overview-card-body"><div className="next-achievement"><div className="mini-badge"><BadgeArt badge={nextBadge ?? badges[29]} unlocked={!!nextBadge} /></div><div><strong>{nextBadge ? `Level ${String(nextBadge.level).padStart(2, "0")} · ${nextBadge.name} ${nextBadge.stageLabel}` : "All 30 levels complete"}</strong><p>{nextBadge ? nextBadge.requirement : "You have completed the complete VELOOP badge journey."}</p></div></div><button className="text-link" onClick={scrollToBadges}>Inspect all badges <ChevronRight size={14} /></button></div></section>
      </div>
    </div>
  );

  const renderMining = () => (
    <>
      <section className="mining-section" aria-labelledby="mining-heading">
        <div className="section-intro mining-section-intro">
          <div>
            <div className="eyebrow">Part A / Mine &amp; Earn</div>
            <h2 id="mining-heading" className="section-title">Make every minute count.</h2>
            <p className="section-copy">Start the mining station and keep your session active. Your counter earns <strong>+1 VE every second</strong> while mining is active.</p>
          </div>
          <button className="text-link journey-link" onClick={scrollToBadges}>View badge journey <ArrowUpRight size={14} /></button>
        </div>

        <div className={`mining-station ${isMining ? "is-active" : ""}`} aria-label="Mine and Earn station">
          <div className="mining-visual">
            <picture className="mining-banner-picture">
              <source srcSet="/assets/velop-mine-earn-banner.webp" type="image/webp" />
              <img src="/assets/velop-mine-earn-banner.png" alt="VELOOP Mine and Earn mining station" className="mining-banner-image" width={1842} height={854} decoding="async" fetchPriority="high" />
            </picture>
            <div className="mining-visual-shade" aria-hidden="true" />
            <div className={`mining-banner-status ${isMining ? "active" : ""}`} aria-live="polite"><span className="live-dot" /> {isMining ? "MINING ACTIVE" : "MINING READY"} <b>·</b> {reward} VE <b>·</b> +1/s</div>
            <div className="mining-energy" aria-label="Mining energy"><span>Mining Energy</span><div className="energy-dots">{Array.from({ length: 8 }, (_, i) => <i key={i} className={i < (isMining ? 8 : 6) ? "filled" : ""} />)}</div></div>
          </div>

          <div className="mining-control-panel">
            <div className="mining-control-top">
              <div className="mining-live-copy"><span className={`control-dot ${isMining ? "active" : ""}`} /> <strong>{isMining ? "Mining in progress" : "Mining station ready"}</strong><span>{isMining ? "Earning +1 VE / sec" : "Start a session when you're ready"}</span></div>
              <div className="mining-session-chip"><Clock3 size={13} /> Session <strong>{reward} VE</strong></div>
            </div>
            <div className="mining-control-main">
              <button className={`mining-primary-button ${isMining ? "pause" : ""}`} onClick={startMining} type="button" aria-pressed={isMining}>
                <span className="mining-primary-icon"><Pickaxe size={19} /></span>
                <span>{isMining ? "Pause Mining" : "Start Mining"}</span>
                <ArrowUpRight size={17} />
              </button>
              <div className="mining-metrics">
                <div><span>Total Mined</span><strong>1,245 VEs</strong></div>
                <div><span>All-time Earnings</span><strong className="positive">+12%</strong></div>
                <div><span>Session Rate</span><strong>+1 VE / sec</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="badge-collection" className="system-grid achievement-section" aria-labelledby="collection-heading">
        <div className="panel collection-panel">
          <div className="panel-heading collection-heading">
            <div><div className="eyebrow">Part B / 30-level journey</div><h2 id="collection-heading">Your achievement trail</h2><p>Start at Level 00 and unlock each milestone in sequence. Every tier evolves from <strong>Cracked</strong> to <strong>Restoring</strong> to <strong>Complete</strong>.</p></div>
            <button className="text-link system-notes" onClick={() => toast("Progression system", { description: "10 tiers × 3 stages: Cracked → Restoring → Complete." })}>System notes <ChevronRight size={14} /></button>
          </div>
          <div className="journey-summary">
            <div className="journey-progress-copy"><span>UNLOCKED</span><strong>{unlockedCount}<small>/30</small></strong></div>
            <div className="journey-meter-wrap"><div className="journey-meter"><div className="journey-meter-fill" style={{ width: `${(unlockedCount / 30) * 100}%` }} /></div><div className="journey-meter-labels"><span>Level 00</span><span>{Math.round((unlockedCount / 30) * 100)}% complete</span><span>Level 30</span></div></div>
            <div className="journey-next">{nextBadge ? <><span>NEXT MILESTONE</span><strong>Level {String(nextBadge.level).padStart(2, "0")} · {nextBadge.name} {nextBadge.stageLabel}</strong></> : <><span>COMPLETE</span><strong>All 30 levels unlocked</strong></>}</div>
          </div>
          <div className="badge-grid badge-grid-30">{badges.map((badge) => { const unlocked = badge.level <= unlockedCount; return <button key={badge.level} className={`badge-card ${unlocked ? "" : "locked"} ${selectedLevel === badge.level ? "selected" : ""} ${badge.stage === 3 ? "complete-card" : ""} ${badge.level === 30 ? "capstone-card" : ""}`} onClick={() => setSelectedLevel(badge.level)} aria-label={`${badge.name} ${badge.stageLabel}, level ${badge.level}, ${unlocked ? "unlocked" : "locked"}`}><div className="badge-level"><span>LEVEL</span> <b>{String(badge.level).padStart(2, "0")}</b></div><BadgeArt badge={badge} unlocked={unlocked} />{!unlocked && <span className="lock-chip"><LockKeyhole size={11} /></span>}<div className="badge-card-identity">{badge.name} <span className="stage-pill">{badge.stageLabel}</span></div><div className="badge-card-description">{badge.identity}</div><div className={`badge-stage-label stage-copy-${badge.stage}`}>{badge.stageName}</div><div className="badge-card-state">{unlocked ? <><Check size={10} /> UNLOCKED</> : <><LockKeyhole size={10} /> LOCKED</>}</div></button>; })}</div>
          <div className="next-unlock"><div><span>Next achievement</span><strong>{nextBadge ? `Level ${String(nextBadge.level).padStart(2, "0")} · ${nextBadge.name} ${nextBadge.stageLabel}` : "All 30 levels unlocked"}</strong></div><div className="unlock-actions"><span className="next-unlock-meter">{unlockedCount} / 30</span><button className="subtle-button compact" onClick={unlockNext} disabled={!nextBadge}><Sparkles size={13} /> {nextBadge ? "Complete milestone" : "Completed"}</button><button className="reset-button" onClick={resetJourney}><RotateCcw size={12} /> Reset</button></div></div>
        </div>

        <aside className="panel detail-panel" aria-live="polite"><div className="panel-heading"><div><div className="eyebrow">Selected achievement</div><p>Inspect any level</p></div><Gem size={18} color="#d7a94b" strokeWidth={1.5} /></div><div className="detail-body"><div className="detail-kicker">Achievement level {String(selectedBadge.level).padStart(2, "0")} · Stage {selectedBadge.stageLabel}</div><div className="detail-title">{selectedBadge.name}</div><div className="detail-subtitle">{selectedBadge.identity} · {selectedBadge.stageName}</div><div className="selected-badge-visual"><BadgeArt badge={selectedBadge} large unlocked={selectedUnlocked} /></div><div className="detail-rule" /><div className="detail-list"><div className="detail-row"><span>Status</span><span className={selectedUnlocked ? "status-unlocked" : "status-locked"}>{selectedUnlocked ? <><Check size={12} /> Unlocked</> : <><LockKeyhole size={12} /> Locked / preview</>}</span></div><div className="detail-row"><span>Badge tier</span><span>{selectedBadge.tier} / 10 · {selectedBadge.name}</span></div><div className="detail-row"><span>Progression</span><span>Stage {selectedBadge.stageLabel} of III</span></div></div><div className="requirement"><p><strong>Unlock requirement</strong><br />{selectedBadge.requirement}</p></div>{!selectedUnlocked && selectedBadge.level === unlockedCount + 1 && <button className="primary-detail-action" onClick={unlockNext}><Sparkles size={14} /> Complete milestone &amp; unlock</button>}<button className="subtle-button" onClick={() => toast(selectedUnlocked ? "Badge details opened" : "Locked badge preview", { description: selectedBadge.description })} style={{ marginTop: 12 }}>Open detail view <ArrowUpRight size={14} /></button></div></aside>
      </section>
    </>
  );

  const renderBadges = () => (
    <div className="product-view"><div className="page-hero compact-hero"><div><div className="eyebrow">Achievement system</div><h2 className="section-title">30 levels. One visible journey.</h2><p className="section-copy">Every tier moves through Cracked, Restoring and Complete so users can clearly feel progression.</p></div><button className="reset-button hero-reset" onClick={resetJourney}><RotateCcw size={13} /> Reset journey</button></div>{renderMining()}</div>
  );

  const renderWallet = () => (
    <div className="product-view"><div className="page-hero compact-hero"><div><div className="eyebrow">Wallet / rewards</div><h2 className="section-title">Your VE balance, clearly accounted for.</h2><p className="section-copy">A working wallet view connected to the live mining counter and reward session.</p></div><div className="wallet-balance-hero"><span>Available balance</span><strong>{balance.toLocaleString()} VE</strong></div></div><div className="wallet-grid"><section className="panel wallet-main"><div className="panel-heading"><div><div className="eyebrow">Balance activity</div><h2>Reward ledger</h2></div><WalletCards size={18} color="#d7a94b" /></div><div className="ledger-row"><div className="ledger-icon positive"><Pickaxe size={15} /></div><div><strong>Mining session</strong><span>Live VE earnings</span></div><b>+{reward} VE</b></div><div className="ledger-row"><div className="ledger-icon"><Trophy size={15} /></div><div><strong>Badge rewards</strong><span>{unlockedCount} milestones unlocked</span></div><b>+{unlockedCount * 10} VE</b></div><div className="ledger-row"><div className="ledger-icon"><GiftIcon /></div><div><strong>Available rewards</strong><span>Redeemable balance</span></div><b>{balance.toLocaleString()} VE</b></div></section><section className="panel wallet-side"><div className="panel-heading"><div><div className="eyebrow">Mining rate</div><h2>Live earning</h2></div><Clock3 size={18} color="#d7a94b" /></div><div className="wallet-rate"><strong>+1</strong><span>VE / second</span></div><button className={`subtle-button ${isMining ? "is-mining" : "is-idle-cta"}`} onClick={startMining} type="button">{isMining ? "Pause mining" : "Start mining"} <Pickaxe size={14} /></button></section></div></div>
  );

  const renderSearch = () => (
    <div className="product-view"><div className="page-hero compact-hero"><div><div className="eyebrow">Search / badge library</div><h2 className="section-title">Find any achievement instantly.</h2><p className="section-copy">Search by level, tier, identity or stage.</p></div><Search size={28} color="#d7a94b" /></div><div className="search-shell"><div className="search-input-wrap"><Search size={17} /><input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search Bronze, Level 12, Complete..." /><button onClick={() => setSearchTerm("")} aria-label="Clear search"><X size={15} /></button></div><div className="search-results-head"><span>{filteredBadges.length} results</span><span>Unlocked: {unlockedCount}/30</span></div><div className="search-results">{filteredBadges.map((badge) => { const unlocked = badge.level <= unlockedCount; return <button key={badge.level} className={`search-result ${!unlocked ? "locked" : ""}`} onClick={() => { setSelectedLevel(badge.level); openView("Badges"); }}><BadgeArt badge={badge} unlocked={unlocked} /><div><strong>Level {String(badge.level).padStart(2, "0")} · {badge.name} {badge.stageLabel}</strong><span>{badge.identity} · {badge.stageName}</span></div><ChevronRight size={15} /></button>; })}</div></div></div>
  );

  const renderSettings = () => (
    <div className="product-view"><div className="page-hero compact-hero"><div><div className="eyebrow">Settings / preferences</div><h2 className="section-title">Tune your rewards workspace.</h2><p className="section-copy">These controls are functional and update the current session immediately.</p></div><Settings2 size={28} color="#d7a94b" /></div><div className="settings-list panel">{[
      ["notifications", "Reward notifications", "Show feedback when mining or unlocking a badge.", settings.notifications],
      ["compact", "Compact badge grid", "Reduce card spacing when reviewing all 30 levels.", settings.compact],
      ["reducedMotion", "Reduce motion", "Disable non-essential transitions and hover movement.", settings.reducedMotion],
    ].map(([key, title, description, enabled]) => <div className="setting-row" key={key as string}><div><strong>{title as string}</strong><span>{description as string}</span></div><button className={`toggle ${enabled ? "on" : ""}`} onClick={() => setSettings((current) => ({ ...current, [key as string]: !current[key as keyof typeof current] }))} aria-pressed={enabled as boolean}><span /></button></div>)}<div className="settings-danger"><div><strong>Reset prototype journey</strong><span>Return mining, wallet and badges to the starting state.</span></div><button className="reset-button" onClick={resetJourney}><RotateCcw size={13} /> Reset all progress</button></div></div></div>
  );

  const renderView = () => {
    if (activeNav === "Overview") return renderOverview();
    if (activeNav === "Wallet") return renderWallet();
    if (activeNav === "Search") return renderSearch();
    if (activeNav === "Settings") return renderSettings();
    if (activeNav === "Badges") return renderBadges();
    return renderMining();
  };

  return (
    <div className={`app-shell ${settings.compact ? "compact-badges" : ""}`}>
      <div className="layout">
        <aside className="sidebar" aria-label="Primary navigation">
          <button className="brand-mark" onClick={() => openView("Overview")} aria-label="VELOOP home"><img src="/assets/velop-mark.png" alt="" className="brand-mark" /></button>
          <div className="nav-stack">{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-btn ${activeNav === label ? "active" : ""}`} aria-label={label} aria-pressed={activeNav === label} onClick={() => openView(label)}><Icon size={17} strokeWidth={1.7} /></button>)}</div>
          <div className="sidebar-bottom"><button className={`nav-btn ${activeNav === "Settings" ? "active" : ""}`} aria-label="Settings" onClick={() => openView("Settings")}><Settings2 size={17} strokeWidth={1.7} /></button><div className="sidebar-avatar" aria-label="User profile">SD</div></div>
        </aside>
        <main className="main">
          <header className="topbar"><div className="topbar-identity"><img src="/assets/velop-mark.png" alt="" className="topbar-brand-mark" /><div><div className="topbar-wordmark"><span>VELOOP</span><small>REWARDS</small></div><h1 className="topbar-title">{activeNav}</h1></div></div><div className="topbar-actions"><button className="topbar-action" aria-label="Search" onClick={() => openView("Search")}><Search size={16} /></button><button className="topbar-action" aria-label="Notifications" onClick={() => toast(settings.notifications ? "No new notifications" : "Notifications are off", { description: settings.notifications ? "Your reward journey is up to date." : "Enable notifications in Settings to receive reward updates." })}><Bell size={16} /></button><button className="balance-pill" aria-label="Open wallet" onClick={() => openView("Wallet")}><span className="coin-dot">V</span><div className="balance-value">{balance.toLocaleString()} <span>VEs balance</span></div></button></div></header>
          <div className="content">{renderView()}<footer className="handoff"><div className="handoff-copy"><strong>VELOOP Rewards / mentor feedback build</strong>30 sequential unlock levels · live +1 VE/sec mining · working Dashboard, Wallet, Search &amp; Settings · responsive UI · WebP badge assets.</div><div className="tag-row"><span className="tag">30 levels</span><span className="tag">Locked → Unlocked</span><span className="tag">+1 VE / sec</span><span className="tag">Responsive</span><span className="tag">WebP</span></div></footer></div>
        </main>
      </div>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map(({ label, icon: Icon }) => (
          <button key={label} className={`nav-btn ${activeNav === label ? "active" : ""}`} aria-label={label} onClick={() => openView(label)}>
            <Icon size={20} strokeWidth={1.7} />
            <span className="nav-btn-label">{label}</span>
          </button>
        ))}
        <button className={`nav-btn ${activeNav === "Settings" ? "active" : ""}`} aria-label="Settings" onClick={() => openView("Settings")}>
          <Settings2 size={20} strokeWidth={1.7} />
          <span className="nav-btn-label">Settings</span>
        </button>
      </nav>
    </div>
  );
}

function GiftIcon() {
  return <span className="gift-icon" aria-hidden="true">✦</span>;
}
