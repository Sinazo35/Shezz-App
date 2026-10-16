import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import QRCode from "qrcode";
import {
  CalendarDays,
  Clock3,
  Gift,
  Menu,
  X,
  CheckCircle2,
  Scissors,
  Star,
  ArrowRight,
  MapPin,
  Phone,
  Instagram,
  MessageCircle,
  Send,
  ShieldCheck,
  Wallet,
  ChevronLeft,
  ChevronRight,
  UserRound,
  LockKeyhole,
  Plus,
  Minus,
} from "lucide-react";
import "./style.css";
import "./theme.css";
const portfolio = Array.from(
  { length: 18 },
  (_, i) =>
    "/images/portfolio/style-" + String(i + 1).padStart(2, "0") + ".jpg",
);
const pics = [
  "IMG_0155.jpeg",
  "IMG_0154.jpeg",
  "IMG_0153.jpeg",
  "IMG_0156.jpeg",
  "IMG_0157.jpeg",
  "IMG_0158.jpeg",
].map((x) => "/images/" + x);
const services = [
  ["Goddess Cornrows", "Braids", 450, 180, pics[0], "Detailed feed-in braids with a polished finish."],
  ["Bohemian Braids", "Braids", 650, 240, pics[1], "Long, free-flowing braids with a soft, relaxed finish."],
  ["Salon Style Consultation", "Beauty", 150, 30, pics[3], "Talk through the style, length, and finish you have in mind."],
  ["Creative Cornrows", "Braids", 350, 150, pics[4], "Neat cornrows with a pattern made to stand out."],
  ["Soft Locs & Extensions", "Hair", 600, 210, pics[2], "Protective loc styling with a soft, natural finish."],
  ["Gel Manicure", "Nails", 250, 75, pics[5], "Nail shaping, cuticle care and a glossy gel finish."],
  ["Braids & Nail Combo", "Beauty", 950, 300, portfolio[6], "A head-turning braid and nail pairing, shown at R950."],
  ["Brow Shape & Finish", "Beauty", 180, 45, portfolio[0], "A clean, defined brow finish to frame your features."],
  ["Braided Ponytail", "Braids", 500, 180, portfolio[1], "Sculpted braids gathered into a statement ponytail."],
  ["Patterned Feed-in Braids", "Braids", 450, 180, portfolio[2], "Intricate feed-in braids with a custom pattern."],
  ["Loc Retwist & Style", "Hair", 500, 180, portfolio[3], "A tidy retwist and considered finish for your locs."],
  ["Braided Bun Ponytail", "Braids", 600, 210, portfolio[4], "A high braided ponytail finished in a full, elegant bun."],
  ["Soft Twist Locs", "Hair", 650, 240, portfolio[5], "Textured loc styling with a relaxed, wearable shape."],
  ["Beauty Treatment Combo", "Beauty", 680, 210, portfolio[7], "A coordinated hair and beauty treatment combo, shown at R680."],
  ["Extension Installation", "Hair", 750, 240, portfolio[8], "A tailored extension install for added length and volume."],
  ["Sculpted Cornrows", "Braids", 400, 150, portfolio[9], "Smooth, detailed cornrows shaped to your style."],
  ["Long Passion Twists", "Hair", 700, 270, portfolio[10], "Long, soft twists with a beautifully full finish."],
  ["Braids, Nails & Brows Combo", "Beauty", 950, 300, portfolio[11], "A complete beauty look with braids, nails and brow styling."],
  ["Kids' Cornrows", "Braids", 300, 120, portfolio[12], "Gentle, neat cornrows for a fresh everyday style."],
  ["Glam Braided Updo", "Braids", 650, 180, portfolio[13], "An elevated braided updo with a camera-ready finish."],
  ["Sleek Ponytail", "Hair", 350, 90, portfolio[14], "A smooth, sleek ponytail for an effortlessly polished look."],
  ["Braided Bun Updo", "Braids", 500, 150, portfolio[15], "A graceful braided updo styled into a neat bun."],
  ["Classic Ponytail", "Hair", 350, 90, portfolio[16], "A clean, smooth ponytail with a soft, glossy finish."],
  ["Signature Ponytail", "Hair", 450, 120, portfolio[17], "A salon-finished ponytail styled for your next occasion."],
].map(([name, category, price, duration, img, desc], index) => ({
  id: index + 1,
  name,
  category,
  price,
  duration,
  img,
  desc,
}));
const stylists = [
  {
    id: "s1",
    name: "Braiding Specialist",
    role: "Braids & cornrows",
    days: [1, 2, 3, 4, 5, 6],
  },
  {
    id: "s2",
    name: "Hair Specialist",
    role: "Locs & protective styling",
    days: [2, 3, 4, 5, 6],
  },
  {
    id: "s3",
    name: "Nail Technician",
    role: "Manicures & nail art",
    days: [1, 2, 3, 4, 5, 6],
  },
];
const load = (k, f) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? f;
  } catch {
    return f;
  }
};
const money = (n) => "R" + n.toLocaleString("en-ZA");
const fmt = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const daynum = (d) => new Date(d + "T12:00:00").getDay();
const dateISO = (d) => {
  let y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    a = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${a}`;
};
const customerAccount = (user) => ({
  role: "customer",
  id: user.id,
  email: user.email || "",
  name: user.user_metadata?.full_name || "",
  phone: user.user_metadata?.phone || "",
});
function App() {
  const [chatOpen, setChatOpen] = useState(false),
    [chatInput, setChatInput] = useState(""),
    [chatBusy, setChatBusy] = useState(false),
    [chatMessages, setChatMessages] = useState([
      {
        role: "assistant",
        content:
          "Hi, welcome to SHEZZ. Tell me what look you have in mind, or ask about services, bookings, and rewards.",
      },
    ]),
    [page, setPage] = useState("home"),
    [menu, setMenu] = useState(false),
    [category, setCategory] = useState("All"),
    [chosen, setChosen] = useState(services[0].id),
    [stylist, setStylist] = useState("s1"),
    [date, setDate] = useState(dateISO(new Date())),
    [time, setTime] = useState(""),
    [customer, setCustomer] = useState(""),
    [phone, setPhone] = useState(""),
    [email, setEmail] = useState(""),
    [account, setAccount] = useState(null),
    [loginRole, setLoginRole] = useState("customer"),
    [customerAuthMode, setCustomerAuthMode] = useState("signin"),
    [loginEmail, setLoginEmail] = useState(""),
    [loginPhone, setLoginPhone] = useState(""),
    [loginName, setLoginName] = useState(""),
    [loginPassword, setLoginPassword] = useState(""),
    [authClient, setAuthClient] = useState(null),
    [authStatus, setAuthStatus] = useState("loading"),
    [authBusy, setAuthBusy] = useState(false),
    [bookings, setBookings] = useState(() => load("shezz_bookings", [])),
    [notice, setNotice] = useState(""),
    [rewardPhone, setRewardPhone] = useState(""),
    [qr, setQr] = useState(""),
    [staffPin, setStaffPin] = useState(""),
    [staffMode, setStaffMode] = useState(false),
    [staffAuth, setStaffAuth] = useState(false),
    [rewardCode, setRewardCode] = useState(""),
    [payment, setPayment] = useState("Pay at salon"),
    [rewardDiscount, setRewardDiscount] = useState(10);
  useEffect(() => {
    let active = true;
    let authSubscription;
    async function connectAuth() {
      try {
        const response = await fetch("/api/config");
        if (!response.ok) throw new Error("Supabase configuration unavailable.");
        const config = await response.json();
        if (!config.enabled || !config.supabaseUrl || !config.supabaseAnonKey) {
          if (active) setAuthStatus("unavailable");
          return;
        }
        const { createClient } = await import("@supabase/supabase-js");
        const client = createClient(config.supabaseUrl, config.supabaseAnonKey);
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        if (!active) return;
        setAuthClient(client);
        setAuthStatus("ready");
        if (data.session?.user) {
          const profile = customerAccount(data.session.user);
          setAccount(profile);
          setCustomer(profile.name);
          setEmail(profile.email);
          setPhone(profile.phone);
          setRewardPhone(profile.phone);
          setPage("appointments");
        }
        const { data: authState } = client.auth.onAuthStateChange((_event, session) => {
          if (!active) return;
          if (session?.user) {
            setAccount(customerAccount(session.user));
          } else {
            setAccount((current) =>
              current?.role === "customer" ? null : current,
            );
          }
        });
        authSubscription = authState.subscription;
      } catch {
        if (active) setAuthStatus("unavailable");
      }
    }
    connectAuth();
    return () => {
      active = false;
      authSubscription?.unsubscribe();
    };
  }, []);
  useEffect(
    () => localStorage.setItem("shezz_bookings", JSON.stringify(bookings)),
    [bookings],
  );
  useEffect(() => {
    if (!notice) return;
    let t = setTimeout(() => setNotice(""), 5500);
    return () => clearTimeout(t);
  }, [notice]);
  const go = (p) => {
    setPage(p);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  async function signOut() {
    if (account?.role === "customer" && authClient) {
      const { error } = await authClient.auth.signOut();
      if (error) {
        setNotice("Could not sign out. Please try again.");
        return;
      }
    }
    setAccount(null);
    setStaffAuth(false);
    setStaffPin("");
    setNotice("You have signed out.");
    go("home");
  }
  async function signIn(event) {
    event.preventDefault();
    if (loginRole === "staff") {
      if (staffPin !== "2468") {
        setNotice("Incorrect demo PIN.");
        return;
      }
      setAccount({ role: "staff" });
      setStaffAuth(true);
      setNotice("Welcome to the SHEZZ staff dashboard.");
      go("admin");
      return;
    }
    if (!authClient) {
      setNotice("Customer accounts are unavailable until Supabase is configured.");
      return;
    }
    setAuthBusy(true);
    try {
      if (customerAuthMode === "signup") {
        if (!loginName.trim()) {
          setNotice("Enter your full name to create an account.");
          return;
        }
        if (loginPhone.replace(/\D/g, "").length < 9) {
          setNotice("Enter a valid mobile number to create an account.");
          return;
        }
        const { data, error } = await authClient.auth.signUp({
          email: loginEmail.trim(),
          password: loginPassword,
          options: {
            data: {
              full_name: loginName.trim(),
              phone: loginPhone.trim(),
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        if (!data.session || !data.user) {
          setCustomerAuthMode("signin");
          setNotice("Account created. Check your email to confirm, then sign in.");
          return;
        }
        const profile = customerAccount(data.user);
        setAccount(profile);
        setCustomer(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
        setRewardPhone(profile.phone);
        setNotice("Your SHEZZ account is ready.");
      } else {
        const { data, error } = await authClient.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        });
        if (error) throw error;
        const profile = customerAccount(data.user);
        setAccount(profile);
        setCustomer(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
        setRewardPhone(profile.phone);
        setNotice("Welcome back. You are signed in.");
      }
      setStaffAuth(false);
      setLoginPassword("");
      go("appointments");
    } catch (error) {
      setNotice(error.message || "Could not sign in. Please try again.");
    } finally {
      setAuthBusy(false);
    }
  }
  const service = services.find((s) => s.id === chosen);
  const filtered =
    category === "All"
      ? services
      : services.filter((s) => s.category === category);
  const relevant = bookings.filter(
    (b) => b.date === date && b.stylist === stylist && b.status !== "Cancelled",
  );
  const slots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];
  const staff = stylists.find((s) => s.id === stylist);
  const available = staff.days.includes(daynum(date))
    ? slots.filter(
        (t) =>
          !relevant.some((b) => b.time === t) &&
          new Date(date + "T" + t) > new Date(),
      )
    : [];
  const clientBookings = bookings.filter(
    (b) =>
      b.phone.replace(/\D/g, "") === rewardPhone.replace(/\D/g, "") &&
      rewardPhone.replace(/\D/g, "").length >= 9,
  );
  const completed = clientBookings.filter(
    (b) => b.status === "Completed",
  ).length;
  const redeemed = clientBookings.filter((b) => b.rewardRedeemed).length;
  const eligible = completed >= 3 * (redeemed + 1);
  const pending = clientBookings.filter((b) => b.status === "Pending");
  async function sendChat() {
    const question = chatInput.trim();
    if (!question || chatBusy) return;
    setChatInput("");
    setChatMessages((v) => [...v, { role: "user", content: question }]);
    setChatBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await r.json();
      setChatMessages((v) => [
        ...v,
        { role: "assistant", content: data.reply || "Please try again." },
      ]);
    } catch {
      setChatMessages((v) => [
        ...v,
        {
          role: "assistant",
          content:
            "I can help with bookings, braids, nails and rewards. Our address is Delft South, Cape Town, 7100.",
        },
      ]);
    } finally {
      setChatBusy(false);
    }
  }
  function book() {
    if (!customer.trim() || phone.replace(/\D/g, "").length < 9 || !time) {
      setNotice(
        "Please enter your name, valid phone number and an available time.",
      );
      return;
    }
    if (!available.includes(time)) {
      setNotice("That time is no longer available. Please choose another.");
      return;
    }
    const id = "SHZ-" + Date.now().toString(36).toUpperCase();
    setBookings((v) => [
      ...v,
      {
        id,
        name: customer.trim(),
        phone: phone.trim(),
        email,
        service: chosen,
        stylist,
        date,
        time,
        status: "Pending",
        payment,
        rewardRedeemed: false,
      },
    ]);
    setRewardPhone(phone);
    setNotice(
      "Booking request saved! Your appointment is pending salon confirmation.",
    );
    go("appointments");
  }
  async function generateQR() {
    if (!eligible) {
      setNotice("You need three verified visits to unlock your reward.");
      return;
    }
    let code =
      "SHZ-REWARD-" +
      rewardPhone.replace(/\D/g, "").slice(-6) +
      "-" +
      (redeemed + 1);
    setRewardCode(code);
    setQr(
      await QRCode.toDataURL(code, {
        width: 220,
        margin: 2,
        color: { dark: "#102a80", light: "#ffffff" },
      }),
    );
  }
  function updateBooking(id, status) {
    setBookings((v) => v.map((b) => (b.id === id ? { ...b, status } : b)));
    setNotice("Appointment updated.");
  }
  function redeem() {
    if (!staffAuth) return;
    let match = bookings.filter(
      (b) =>
        b.phone.replace(/\D/g, "") === rewardPhone.replace(/\D/g, "") &&
        b.status === "Completed",
    );
    let used = match.filter((b) => b.rewardRedeemed).length;
    if (
      match.length < 3 * (used + 1) ||
      rewardCode !==
        `SHZ-REWARD-${rewardPhone.replace(/\D/g, "").slice(-6)}-${used + 1}`
    ) {
      setNotice("Invalid or ineligible reward code.");
      return;
    }
    let target = match.filter((b) => !b.rewardRedeemed).at(-1);
    setBookings((v) =>
      v.map((b) => (b.id === target.id ? { ...b, rewardRedeemed: true } : b)),
    );
    setQr("");
    setRewardCode("");
    setNotice("Reward marked redeemed! Apply the discount at checkout.");
  }
  const btn = (label, action, cls = "primary") => (
    <button className={"btn " + cls} onClick={action}>
      {label}
      <ArrowRight size={17} />
    </button>
  );
  return (
    <>
      <div className="topbar">
        YOUR BEAUTY. YOUR TIME. YOUR SHEZZ. <span>✦</span> BOOKINGS MADE EASY
      </div>
      <header>
        <div className="container nav">
          <button className="brand" onClick={() => go("home")}>
            SHEZZ<span>BEAUTY STUDIO</span>
          </button>
          <nav className={menu ? "open" : ""}>
            {[
              ["home", "Home"],
              ["services", "Services"],
              ["book", "Book Appointment"],
              ["appointments", "My Bookings"],
              ["rewards", "Rewards"],
              ...(account?.role === "staff" ? [["admin", "Dashboard"]] : []),
              ["login", account ? "Sign out" : "Sign in"],
            ].map(([p, t]) => (
              <button
                className={page === p ? "active" : ""}
                key={p}
                onClick={() =>
                  p === "login" && account ? signOut() : go(p)
                }
              >
                {t}
              </button>
            ))}
          </nav>
          <button
            className="navcta"
            onClick={() =>
              account?.role === "staff"
                ? go("admin")
                : account?.role === "customer"
                  ? go("appointments")
                  : go("login")
            }
          >
            {account?.role === "staff"
              ? "Dashboard"
              : account?.role === "customer"
                ? "My bookings"
                : "Sign in"} <ArrowRight size={16} />
          </button>
          <button className="hamburger" onClick={() => setMenu(!menu)}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {notice && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {notice}
          <button onClick={() => setNotice("")}>
            <X size={15} />
          </button>
        </div>
      )}
      {page === "login" && (
        <main className="container section loginPage">
          <div className="loginLayout">
            <div className="loginWelcome">
              <span className="kicker">YOUR SHEZZ ACCOUNT</span>
              <h1>Good to see you <em>again.</em></h1>
              <p>
                Sign in to keep your appointments and your SHEZZ visits close
                at hand.
              </p>
              <img
                src={pics[1]}
                alt="Braided style created at SHEZZ Beauty Studio"
              />
            </div>
            <section className="loginPanel" aria-labelledby="login-title">
              <h2 id="login-title">
                {loginRole === "staff"
                  ? "Staff sign in"
                  : customerAuthMode === "signup"
                    ? "Create your account"
                    : "Sign in"}
              </h2>
              <p className="loginSubheading">
                {loginRole === "staff"
                  ? "Sign in to manage salon appointments."
                  : customerAuthMode === "signup"
                    ? "Create an account to keep your appointments together."
                    : "Welcome back to SHEZZ Beauty Studio."}
              </p>
              <div className="loginRoles" aria-label="Choose account type">
                <button
                  type="button"
                  className={loginRole === "customer" ? "selected" : ""}
                  aria-pressed={loginRole === "customer"}
                  onClick={() => setLoginRole("customer")}
                >
                  Customer
                </button>
                <button
                  type="button"
                  className={loginRole === "staff" ? "selected" : ""}
                  aria-pressed={loginRole === "staff"}
                  onClick={() => setLoginRole("staff")}
                >
                  Staff
                </button>
              </div>
              <form className="loginForm" onSubmit={signIn}>
                {loginRole === "customer" ? (
                  <>
                    {customerAuthMode === "signup" && (
                      <>
                        <label>
                          Full name
                          <input
                            type="text"
                            autoComplete="name"
                            placeholder="Your full name"
                            value={loginName}
                            onChange={(event) => setLoginName(event.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Mobile number
                          <input
                            type="tel"
                            autoComplete="tel"
                            placeholder="e.g. 082 123 4567"
                            value={loginPhone}
                            onChange={(event) => setLoginPhone(event.target.value)}
                            minLength={9}
                            required
                          />
                        </label>
                      </>
                    )}
                    <label>
                      Email address
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(event) => setLoginEmail(event.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Password
                      <input
                        type="password"
                        autoComplete={
                          customerAuthMode === "signup"
                            ? "new-password"
                            : "current-password"
                        }
                        placeholder={
                          customerAuthMode === "signup"
                            ? "Create a password"
                            : "Enter your password"
                        }
                        value={loginPassword}
                        onChange={(event) =>
                          setLoginPassword(event.target.value)
                        }
                        minLength={6}
                        required
                      />
                    </label>
                    {authStatus === "loading" ? (
                      <small className="authNotice" role="status">
                        Connecting to the customer account service...
                      </small>
                    ) : authStatus === "unavailable" ? (
                      <small className="authNotice" role="status">
                        Customer accounts are unavailable until Supabase is
                        configured on the server.
                      </small>
                    ) : customerAuthMode === "signup" ? (
                      <small>
                        Your account is saved securely with Supabase. Passwords
                        are handled by Supabase Auth.
                      </small>
                    ) : null}
                    <button
                      className="btn primary full"
                      type="submit"
                      disabled={authBusy || authStatus !== "ready"}
                    >
                      {authBusy
                        ? "Please wait..."
                        : customerAuthMode === "signup"
                          ? "Create account"
                          : "Sign in"} <ArrowRight size={17} />
                    </button>
                    <p className="accountModeSwitch">
                      {customerAuthMode === "signup"
                        ? "Already have an account?"
                        : "New to SHEZZ?"}{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setCustomerAuthMode((mode) =>
                            mode === "signup" ? "signin" : "signup",
                          );
                          setNotice("");
                        }}
                      >
                        {customerAuthMode === "signup"
                          ? "Sign in"
                          : "Create an account"}
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <label>
                      Staff PIN
                      <input
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter staff PIN"
                        value={staffPin}
                        onChange={(event) => setStaffPin(event.target.value)}
                        required
                      />
                    </label>
                    <small>
                      Demo staff access uses PIN 2468. This is not secure
                      production authentication.
                    </small>
                    <button className="btn primary full" type="submit">
                      Sign in to dashboard <ArrowRight size={17} />
                    </button>
                  </>
                )}
              </form>
            </section>
          </div>
        </main>
      )}
      {page === "home" && (
        <>
          <section className="hero">
            <div className="container heroGrid">
              <div className="heroCopy">
                <div className="eyebrow">
                  <span className="dot" /> WELCOME TO SHEZZ BEAUTY STUDIO
                </div>
                <h1>
                  Come as you are.
                  <br />
                  <em>Leave glowing.</em>
                </h1>
                <p>
                  Take a breath, settle in, and let us care for your style. From
                  thoughtful braids to beautiful little details, your next SHEZZ
                  moment starts with a warm welcome.
                </p>
                <div className="heroButtons">
                  {btn("Book Your Appointment", () => go("book"))}
                  {btn("Explore Services", () => go("services"), "outline")}
                </div>
                <div className="heroPerks">
                  <span>
                    <CheckCircle2 size={17} /> Made for your texture
                  </span>
                  <span>
                    <CheckCircle2 size={17} /> A little time just for you
                  </span>
                </div>
              </div>
              <div className="heroVisual">
                <img
                  className="heroMainImage"
                  src={pics[1]}
                  alt="Long braids styled at SHEZZ Beauty Studio"
                />
                <img
                  className="heroInsetImage"
                  src={portfolio[14]}
                  alt="Sleek ponytail finished at SHEZZ"
                />
                <div className="floatCard">
                  <div className="circleIcon">
                    <Star size={19} fill="currentColor" />
                  </div>
                  <div>
                    <strong>Your next favourite look</strong>
                    <small>Made with care at SHEZZ</small>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="featureStrip">
            <div className="container stripGrid">
              <div>
                <CalendarDays />
                <span>
                  <strong>Easy Booking</strong>
                  <small>Your schedule, your choice</small>
                </span>
              </div>
              <div>
                <Scissors />
                <span>
                  <strong>Expert Styling</strong>
                  <small>Beauty crafted with care</small>
                </span>
              </div>
              <div>
                <Gift />
                <span>
                  <strong>Rewards That Matter</strong>
                  <small>Every visit brings more</small>
                </span>
              </div>
              <div>
                <ShieldCheck />
                <span>
                  <strong>Reward Validation</strong>
                  <small>Staff-confirmed redemption</small>
                </span>
              </div>
            </div>
          </section>
          <section className="section container">
            <div className="sectionHead">
              <div>
                <span className="kicker">DISCOVER YOUR NEXT LOOK</span>
                <h2>
                  Services you'll <em>love.</em>
                </h2>
                <p>
                  Find your signature style from our favourite salon services.
                </p>
              </div>
              <button className="textlink" onClick={() => go("services")}>
                View all services <ArrowRight size={18} />
              </button>
            </div>
            <div className="serviceGrid">
              {services.slice(0, 4).map((s) => (
                <ServiceCard
                  key={s.id}
                  s={s}
                  onClick={() => {
                    setChosen(s.id);
                    go("book");
                  }}
                />
              ))}
            </div>
          </section>
          <section className="rewardsBanner">
            <div className="container rewardSplit">
              <div>
                <span className="kicker light">THE SHEZZ LOYALTY CLUB</span>
                <h2>
                  A little love.
                  <br />
                  <em>A lovely reward.</em>
                </h2>
                <p>
                  Every completed visit counts. Visit us three times and unlock
                  a little thank-you from the SHEZZ team.
                </p>
                {btn("Explore Rewards", () => go("rewards"), "white")}
              </div>
              <div className="stampCard">
                <div className="stampTop">
                  <Gift />
                  <span>SHEZZ REWARDS</span>
                </div>
                <h3>3 visits = a treat for you</h3>
                <div className="stamps">
                  {[1, 2, 3].map((n) => (
                    <div key={n}>
                      <Star size={28} />
                      <small>VISIT {n}</small>
                    </div>
                  ))}
                </div>
                <div className="stampBottom">
                  YOUR BEAUTY DESERVES REWARDS <Star size={16} />
                </div>
              </div>
            </div>
          </section>
          <section className="welcomeSection">
            <div className="container welcomeSectionInner">
              <div>
                <span className="kicker">YOUR CHAIR IS WAITING</span>
                <h2>
                  Beauty feels better when you <em>feel at home.</em>
                </h2>
                <p>
                  Come in for a fresh style, stay for the care. We’ll help you
                  find a look that feels like you.
                </p>
                <button className="textlink" onClick={() => go("services")}>
                  Find your look <ArrowRight size={18} />
                </button>
              </div>
              <div className="welcomeImagePair">
                <img src={portfolio[9]} alt="Detailed cornrow styling" />
                <img src={pics[5]} alt="A fresh manicure at SHEZZ" />
              </div>
            </div>
          </section>
        </>
      )}
      {page === "services" && (
        <main className="container section">
          <PageHead
            tag="OUR BEAUTY MENU"
            title={
              <>
                Find your next <em>favourite.</em>
              </>
            }
            subtitle="Browse our services, get inspired, and book your look."
          />
          <div className="chips">
            {["All", "Braids", "Hair", "Nails", "Beauty"].map((c) => (
              <button
                className={category === c ? "selected" : ""}
                key={c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="serviceGrid">
            {filtered.map((s) => (
              <ServiceCard
                key={s.id}
                s={s}
                onClick={() => {
                  setChosen(s.id);
                  go("book");
                }}
              />
            ))}
          </div>
          <p className="fineprint">
            Prices are illustrative starting prices. Confirm exact pricing and
            service duration with the salon before payment.
          </p>
        </main>
      )}
      {page === "book" && (
        <main className="container section">
          <PageHead
            tag="YOUR BEAUTY APPOINTMENT"
            title={
              <>
                Book your <em>moment.</em>
              </>
            }
            subtitle="A few quick steps and you're on your way to your next favourite look."
          />
          <div className="bookingLayout">
            <div className="formCard">
              <h3>
                <span className="step">01</span> Choose your service
              </h3>
              <div className="serviceSelect">
                {services.map((s) => (
                  <button
                    key={s.id}
                    className={chosen === s.id ? "chosen" : ""}
                    onClick={() => {
                      setChosen(s.id);
                      setTime("");
                    }}
                  >
                    <span>
                      {s.name}
                      <small>{s.duration} min</small>
                    </span>
                    <b>{money(s.price)}</b>
                  </button>
                ))}
              </div>
              <h3>
                <span className="step">02</span> Select a stylist
              </h3>
              <div className="stylistGrid">
                {stylists.map((s) => (
                  <button
                    key={s.id}
                    className={stylist === s.id ? "chosen" : ""}
                    onClick={() => {
                      setStylist(s.id);
                      setTime("");
                    }}
                  >
                    <UserRound size={23} />
                    <strong>{s.name}</strong>
                    <small>{s.role}</small>
                  </button>
                ))}
              </div>
              <h3>
                <span className="step">03</span> Date & available time
              </h3>
              <label className="fieldLabel">Appointment date</label>
              <input
                type="date"
                min={dateISO(new Date())}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                }}
              />
              <p className="fieldLabel">Available time slots</p>
              <div className="slots">
                {available.length ? (
                  available.map((t) => (
                    <button
                      key={t}
                      className={time === t ? "selected" : ""}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </button>
                  ))
                ) : (
                  <p className="muted">
                    No available slots on this date for this stylist. Try
                    another day.
                  </p>
                )}
              </div>
              <h3>
                <span className="step">04</span> Your details
              </h3>
              <div className="twoFields">
                <label>
                  Full name *
                  <input
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Your full name"
                  />
                </label>
                <label>
                  Phone number *
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 082 123 4567"
                  />
                </label>
              </div>
              <label>
                Email (optional)
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <h3>
                <span className="step">05</span> Payment preference
              </h3>
              <div className="paymentChoices">
                <button
                  className={payment === "Pay at salon" ? "chosen" : ""}
                  onClick={() => setPayment("Pay at salon")}
                >
                  <Wallet /> Pay at salon
                </button>
                <button
                  className={
                    payment === "Online payment requested" ? "chosen" : ""
                  }
                  onClick={() => setPayment("Online payment requested")}
                >
                  <LockKeyhole /> Request online payment
                </button>
              </div>
              <p className="fineprint">
                Online payment is not yet connected to a payment gateway. No
                card details will be collected or charged.
              </p>
              <button className="btn primary full" onClick={book}>
                Request Booking <ArrowRight size={18} />
              </button>
            </div>
            <aside className="summary">
              <img src={service.img} />
              <div className="summaryInner">
                <span className="kicker">YOUR APPOINTMENT</span>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
                <div className="summaryLine">
                  <Scissors size={17} /> {staff.name}
                </div>
                <div className="summaryLine">
                  <CalendarDays size={17} /> {fmt(date)}
                </div>
                <div className="summaryLine">
                  <Clock3 size={17} /> {time || "Select a time"} ·{" "}
                  {service.duration} min
                </div>
                <hr />
                <div className="total">
                  <span>Starting from</span>
                  <strong>{money(service.price)}</strong>
                </div>
                <small>Booking requests require salon confirmation.</small>
              </div>
            </aside>
          </div>
        </main>
      )}
      {page === "appointments" && (
        <main className="container section narrow">
          <PageHead
            tag="STAY ON TOP OF YOUR PLANS"
            title={
              <>
                My <em>appointments.</em>
              </>
            }
            subtitle="Check the status of your booking or cancel a pending appointment."
          />
          <div className="formCard">
            <label>
              Enter your booking phone number
              <input
                value={rewardPhone}
                onChange={(e) => setRewardPhone(e.target.value)}
                placeholder="e.g. 082 123 4567"
              />
            </label>
          </div>
          {clientBookings.length ? (
            clientBookings
              .slice()
              .reverse()
              .map((b) => (
                <div className="bookingItem" key={b.id}>
                  <div>
                    <small>{b.id}</small>
                    <h3>{services.find((s) => s.id === b.service)?.name}</h3>
                    <p>
                      {fmt(b.date)} at {b.time} ·{" "}
                      {stylists.find((s) => s.id === b.stylist)?.name}
                    </p>
                    <span className={"status " + b.status.toLowerCase()}>
                      {b.status}
                    </span>
                  </div>
                  {b.status === "Pending" && (
                    <button
                      className="btn outline"
                      onClick={() => updateBooking(b.id, "Cancelled")}
                    >
                      Cancel booking
                    </button>
                  )}
                </div>
              ))
          ) : (
            <div className="empty">
              {account?.role === "customer" ? (
                <>
                  <p>No appointments found for this number yet.</p>
                  <button className="textlink" onClick={() => go("book")}>
                    Book your first appointment <ArrowRight size={17} />
                  </button>
                </>
              ) : (
                "Enter your phone number to find your appointments."
              )}
            </div>
          )}
        </main>
      )}
      {page === "rewards" && (
        <main className="container section narrow">
          <PageHead
            tag="SHEZZ LOYALTY CLUB"
            title={
              <>
                Your beauty <em>pays off.</em>
              </>
            }
            subtitle="Three verified salon visits unlock a reward. Present your QR code or reward code to our team."
          />
          <div className="rewardPanel">
            <div className="rewardPanelHead">
              <Gift size={32} />
              <div>
                <span>YOUR REWARDS CARD</span>
                <h3>Every visit is worth it.</h3>
              </div>
            </div>
            <label>
              Phone number used for bookings
              <input
                value={rewardPhone}
                onChange={(e) => {
                  setRewardPhone(e.target.value);
                  setQr("");
                  setRewardCode("");
                }}
                placeholder="Enter your phone number"
              />
            </label>
            <div className="progressStamps">
              {[1, 2, 3].map((n) => (
                <div
                  className={completed - 3 * redeemed >= n ? "filled" : ""}
                  key={n}
                >
                  <Star
                    size={25}
                    fill={
                      completed - 3 * redeemed >= n ? "currentColor" : "none"
                    }
                  />
                  <small>VISIT {n}</small>
                </div>
              ))}
            </div>
            <div className="rewardStats">
              <span>
                <b>{completed}</b> verified visits
              </span>
              <span>
                <b>{redeemed}</b> rewards redeemed
              </span>
            </div>
            <p className="rewardMessage">
              {eligible
                ? "Congratulations! Your reward is unlocked. Generate your QR code to redeem at the salon."
                : `${Math.max(0, 3 - (completed - 3 * redeemed))} more verified visit(s) until your next reward.`}
            </p>
            <button
              className="btn primary full"
              disabled={!eligible}
              onClick={generateQR}
            >
              <Gift size={18} /> Generate Reward QR
            </button>
            {qr && (
              <div className="qrBox">
                <img src={qr} alt="Reward QR code" />
                <strong>{rewardCode}</strong>
                <p>
                  Show this to an authorised salon staff member. The staff
                  member must validate and redeem it.
                </p>
              </div>
            )}
          </div>
          <div className="infoBox">
            <ShieldCheck />
            <div>
              <strong>How does verification work?</strong>
              <p>
                Only staff can mark visits completed. After every third verified
                visit, a reward becomes available. Staff must verify and redeem
                your single-use reward code. This prototype uses local browser
                storage; production rewards require a secure server.
              </p>
            </div>
          </div>
        </main>
      )}
      {page === "admin" && (
        <main className="container section">
          <PageHead
            tag="SHEZZ TEAM PORTAL"
            title={
              <>
                Salon <em>dashboard.</em>
              </>
            }
            subtitle="Manage bookings and confirm completed appointments."
          />
          {!staffAuth ? (
            <div className="formCard narrow adminLogin">
              <LockKeyhole size={36} />
              <h3>Staff access required</h3>
              <p>Sign in with your staff PIN to manage appointments.</p>
              <button
                className="btn primary full"
                onClick={() => {
                  setLoginRole("staff");
                  go("login");
                }}
              >
                Continue to staff sign-in <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <>
              <div className="adminStats">
                <div>
                  <CalendarDays />
                  <strong>{bookings.length}</strong>
                  <small>Total bookings</small>
                </div>
                <div>
                  <Clock3 />
                  <strong>
                    {bookings.filter((b) => b.status === "Pending").length}
                  </strong>
                  <small>Pending requests</small>
                </div>
                <div>
                  <CheckCircle2 />
                  <strong>
                    {bookings.filter((b) => b.status === "Completed").length}
                  </strong>
                  <small>Completed visits</small>
                </div>
              </div>
              <div className="adminGrid">
                <div className="formCard">
                  <h3>Manage appointments</h3>
                  {bookings.length ? (
                    bookings
                      .slice()
                      .reverse()
                      .map((b) => (
                        <div className="adminBooking" key={b.id}>
                          <div>
                            <strong>{b.name}</strong>
                            <small>
                              {b.phone} ·{" "}
                              {services.find((s) => s.id === b.service)?.name}
                            </small>
                            <small>
                              {fmt(b.date)} {b.time} · {b.payment}
                            </small>
                            <span
                              className={"status " + b.status.toLowerCase()}
                            >
                              {b.status}
                            </span>
                          </div>
                          <div className="adminActions">
                            {b.status === "Pending" && (
                              <button
                                onClick={() => updateBooking(b.id, "Confirmed")}
                              >
                                Confirm
                              </button>
                            )}
                            {b.status === "Confirmed" && (
                              <button
                                onClick={() => updateBooking(b.id, "Completed")}
                              >
                                Complete visit
                              </button>
                            )}
                            {!["Cancelled", "Completed"].includes(b.status) && (
                              <button
                                className="danger"
                                onClick={() => updateBooking(b.id, "Cancelled")}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="muted">No bookings yet.</p>
                  )}
                </div>
                <div className="formCard">
                  <h3>
                    <ShieldCheck size={22} /> Redeem a reward
                  </h3>
                  <p className="muted">
                    Enter the customer's phone and single-use reward code. A
                    verified reward must be available.
                  </p>
                  <label>
                    Customer phone
                    <input
                      value={rewardPhone}
                      onChange={(e) => setRewardPhone(e.target.value)}
                      placeholder="Customer phone"
                    />
                  </label>
                  <label>
                    Reward code
                    <input
                      value={rewardCode}
                      onChange={(e) => setRewardCode(e.target.value)}
                      placeholder="SHZ-REWARD-..."
                    />
                  </label>
                  <button className="btn primary full" onClick={redeem}>
                    Validate & Redeem
                  </button>
                  <p className="fineprint">
                    The demo validates typed QR payloads. Camera scanning and
                    server-side single-use validation are production upgrades.
                  </p>
                  <button
                    className="textlink"
                    onClick={signOut}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      )}
      <footer>
        <div className="container footerGrid">
          <div>
            <div className="footerBrand">
              SHEZZ<span>BEAUTY STUDIO</span>
            </div>
            <p>
              More than a look. It's a feeling.
              <br />
              Your beauty journey starts here.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            {[
              ["services", "Our Services"],
              ["book", "Book Appointment"],
              ["rewards", "Loyalty Rewards"],
            ].map(([p, t]) => (
              <button key={p} onClick={() => go(p)}>
                {t}
              </button>
            ))}
          </div>
          <div>
            <h4>Get in touch</h4>
            <p>
              <MapPin size={16} /> Delft South, Cape Town, 7100
            </p>
            <p>
              <Phone size={16} /> Contact number to be added
            </p>
            <p>
              <Instagram size={16} /> Follow SHEZZ on social media
            </p>
          </div>
        </div>
        <div className="container footerBottom">
          © {new Date().getFullYear()} SHEZZ Beauty Studio. Made for beautiful
          moments.{" "}
           <span>
             Demo bookings and rewards are saved on this device
           </span>
        </div>
      </footer>
      <button
        className="chatLauncher"
        onClick={() => setChatOpen((v) => !v)}
        aria-label="Open SHEZZ chat"
      >
        <MessageCircle size={24} />
      </button>
      {chatOpen && (
        <div className="chatPanel">
          <div className="chatHeader">
            <div>
              <strong>SHEZZ Beauty Assistant</strong>
              <small>Ask about services, appointments & rewards</small>
            </div>
            <button onClick={() => setChatOpen(false)} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>
          <div className="chatMessages">
            {chatMessages.map((m, i) => (
              <div key={i} className={"chatBubble " + m.role}>
                {m.content}
              </div>
            ))}
            {chatBusy && <div className="chatBubble assistant">Typing…</div>}
          </div>
          <form
            className="chatForm"
            onSubmit={(e) => {
              e.preventDefault();
              sendChat();
            }}
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask SHEZZ anything…"
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={chatBusy || !chatInput.trim()}
              aria-label="Send"
            >
              <Send size={19} />
            </button>
          </form>
          <small className="chatNote">
            AI replies may be inaccurate. Confirm prices and availability with
            the salon.
          </small>
        </div>
      )}
    </>
  );
}
function ServiceCard({ s, onClick }) {
  return (
    <article className="serviceCard">
      <div className="serviceImage">
        <img src={s.img} alt={s.name} />
        <span>{s.category}</span>
      </div>
      <div className="serviceBody">
        <h3>{s.name}</h3>
        <p>{s.desc}</p>
        <div className="serviceMeta">
          <span>
            <Clock3 size={14} /> {s.duration} min
          </span>
          <strong>From {money(s.price)}</strong>
        </div>
        <button onClick={onClick}>
          Book this look <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}
function PageHead({ tag, title, subtitle }) {
  return (
    <div className="pageHead">
      <span className="kicker">{tag}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
