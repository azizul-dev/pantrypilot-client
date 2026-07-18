export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-poppins font-extrabold text-3xl text-secondary mb-6">Cookie Settings</h1>
      <div className="flex flex-col gap-4 text-text-brown/80 leading-relaxed text-sm">
        <p>
          PantryPilot uses only essential cookies required for authentication (keeping you logged in
          via NextAuth session cookies). We do not use tracking or advertising cookies.
        </p>
        <p>
          You can clear these cookies at any time by logging out or clearing your browser's cookies
          for this site, which will end your current session.
        </p>
      </div>
    </div>
  );
}
