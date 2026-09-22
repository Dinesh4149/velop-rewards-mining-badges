import { Toaster } from "sonner";
import { Route, Switch } from "wouter";
import Home from "./pages/Home";

function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#161827", color: "#f5f1e8", fontFamily: "DM Sans, sans-serif", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: "#d7a94b" }}>404</div>
        <h1 style={{ margin: "0 0 10px" }}>Page not found</h1>
        <p style={{ color: "#9296ab", marginBottom: 24 }}>The page you requested does not exist.</p>
        <a href="/" style={{ color: "#161827", background: "#d7a94b", padding: "11px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>Back to Mine &amp; Earn</a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Toaster theme="dark" position="bottom-right" />
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
