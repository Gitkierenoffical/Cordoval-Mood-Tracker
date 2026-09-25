export function AppFooter() {
  return (
    <footer className="app-footer">
      <p>
        Cordoval Mood Tracker keeps your entries on this device only. No account
        required.
      </p>
      <nav aria-label="Legal">
        <a
          href="https://scrub.cordoval.co.uk/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy
        </a>
        <span aria-hidden="true"> · </span>
        <a
          href="https://scrub.cordoval.co.uk/terms"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms
        </a>
      </nav>
    </footer>
  );
}
