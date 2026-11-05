const policyStyles = `
  .pp-wrap {
    max-width: 760px;
    margin: 0 auto;
    padding: 32px 20px 80px;
  }
  .pp-hero-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: var(--pp-accent-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .pp-hero-icon svg { width: 32px; height: 32px; color: var(--pp-accent); }
  .pp-wrap h1 {
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 4px;
    color: var(--pp-text);
    letter-spacing: -0.5px;
  }
  .pp-updated {
    font-size: 13px;
    color: var(--pp-subtle);
    margin: 0 0 20px;
  }
  .pp-lead {
    font-size: 16px;
    color: var(--pp-lead);
    margin: 0 0 8px;
  }
  .pp-section {
    background: var(--pp-card);
    border: 1px solid var(--pp-border);
    border-radius: 14px;
    padding: 20px;
    margin-top: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .pp-section h2 {
    font-size: 17px;
    font-weight: 700;
    margin: 0 0 10px;
    color: var(--pp-text);
  }
  .pp-section p {
    font-size: 15px;
    color: var(--pp-muted);
    margin: 0;
  }
  .pp-wrap ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .pp-wrap li {
    position: relative;
    padding-left: 18px;
    font-size: 15px;
    color: var(--pp-muted);
    margin-top: 8px;
  }
  .pp-wrap li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 9px;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: var(--pp-accent);
  }
  .pp-wrap a { color: var(--pp-accent); text-decoration: none; }
  .pp-wrap a:hover { text-decoration: underline; }
  .pp-footer {
    text-align: center;
    margin-top: 36px;
  }
  .pp-footer .pp-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--pp-text);
  }
  .pp-footer .pp-sub {
    font-size: 12px;
    color: var(--pp-subtle);
    margin-top: 2px;
  }
  @media (prefers-color-scheme: dark) {
    .pp-scope {
      --pp-bg: #0B1220;
      --pp-card: #111A2C;
      --pp-text: #F1F5F9;
      --pp-muted: #CBD5E1;
      --pp-subtle: #94A3B8;
      --pp-border: #1E293B;
      --pp-accent-soft: rgba(8,145,178,0.18);
    }
  }
`;

const Index = () => {
  return (
    <div
      className="pp-scope"
      style={
        {
          "--pp-bg": "#F8FAFC",
          "--pp-card": "#FFFFFF",
          "--pp-text": "#0F172A",
          "--pp-muted": "#475569",
          "--pp-subtle": "#64748B",
          "--pp-accent": "#0891B2",
          "--pp-accent-soft": "#E0F7FA",
          "--pp-lead": "#334155",
          "--pp-border": "#E2E8F0",
          background: "var(--pp-bg)",
          color: "var(--pp-text)",
          minHeight: "100vh",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif',
          WebkitFontSmoothing: "antialiased",
          lineHeight: 1.55,
          boxSizing: "border-box",
        } as React.CSSProperties
      }
    >
      <style>{policyStyles}</style>
      <main className="pp-wrap">
        <div className="pp-hero-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1>Privacy Policy</h1>
        <p className="pp-updated">Last updated: April 17, 2026</p>

        <p className="pp-lead">
          Your privacy matters to us. This policy explains what information we
          collect, how we use it, and the choices you have. By using JumpStart
          SXM, you agree to the practices described below.
        </p>

        <section className="pp-section">
          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              Account info: name, email, phone number, and profile photo
              (optional).
            </li>
            <li>
              Provider info: business details, ID/passport, business
              license/work permit, and service categories (only if you register
              as a provider).
            </li>
            <li>
              Booking info: services you request, schedules, and messages with
              providers.
            </li>
            <li>
              Device info: device type, operating system, and app version for
              diagnostics.
            </li>
            <li>
              Approximate location (only when you grant permission) to show
              nearby services.
            </li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To create and manage your account.</li>
            <li>
              To connect customers with service providers and process bookings.
            </li>
            <li>To verify provider identity and eligibility.</li>
            <li>
              To send important notifications about your account or bookings.
            </li>
            <li>To improve the app, fix bugs, and prevent fraud or abuse.</li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>3. Sharing Your Information</h2>
          <p>
            We share limited information with service providers when you make a
            booking (e.g., your name, contact info, and booking details). We do
            not sell your personal information. We may share data with trusted
            service providers who help us run the app (hosting, analytics) under
            strict confidentiality agreements, or when required by law.
          </p>
        </section>

        <section className="pp-section">
          <h2>4. Data Storage &amp; Security</h2>
          <p>
            Your data is stored securely using industry-standard encryption in
            transit and at rest. Sensitive documents (ID, business license) are
            accessible only to authorized reviewers. While we work hard to
            protect your information, no system is 100% secure.
          </p>
        </section>

        <section className="pp-section">
          <h2>5. Offline Mode</h2>
          <p>
            JumpStart SXM works offline. Some data (services, bookings, and your
            profile) is cached on your device so you can use the app without a
            connection. Cached data stays on your device and syncs with our
            servers when you go back online.
          </p>
        </section>

        <section className="pp-section">
          <h2>6. Your Rights &amp; Choices</h2>
          <ul>
            <li>
              Access, correct, or update your information at any time from your
              profile.
            </li>
            <li>Disable notifications from the Notifications section.</li>
            <li>Request a copy or deletion of your data (see Section 8).</li>
            <li>
              Withdraw permissions like location at any time in your device
              settings.
            </li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>7. Children's Privacy</h2>
          <p>
            JumpStart SXM is not intended for children under 13. We do not
            knowingly collect personal information from children. If you believe
            a child has provided us with personal data, please contact us so we
            can remove it.
          </p>
        </section>

        <section className="pp-section">
          <h2>8. Account &amp; Data Deletion</h2>
          <p>
            You can request the permanent deletion of your account and all
            associated data at any time from the Profile screen. Requests are
            processed within 30 days. You can also email{" "}
            <a href="mailto:privacy@jumpstartsxm.com">
              privacy@jumpstartsxm.com
            </a>
            .
          </p>
        </section>

        <section className="pp-section">
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Significant changes
            will be communicated through the app. Continued use of JumpStart SXM
            after changes means you accept the updated policy.
          </p>
        </section>

        <section className="pp-section">
          <h2>10. Contact Us</h2>
          <p>
            Questions or concerns? Email us at{" "}
            <a href="mailto:privacy@jumpstartsxm.com">
              privacy@jumpstartsxm.com
            </a>
            . We're based in Sint Maarten and aim to respond within 5 business
            days.
          </p>
        </section>

        <footer className="pp-footer">
          <div className="pp-name">JumpStart SXM</div>
          <div className="pp-sub">Sint Maarten</div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
