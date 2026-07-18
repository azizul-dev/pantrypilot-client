export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-poppins font-extrabold text-3xl text-secondary mb-6">Terms of Service</h1>
      <div className="flex flex-col gap-4 text-text-brown/80 leading-relaxed text-sm">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          By using PantryPilot, you agree to use the platform responsibly. Content you submit
          (recipes, reviews, blog posts) should be your own original work or content you have the
          right to share.
        </p>
        <p>
          AI-generated suggestions (recipes, descriptions) are provided for inspiration and general
          guidance only. Always use your own judgment regarding food safety, allergies, and dietary
          restrictions.
        </p>
        <p>
          We reserve the right to remove content that is abusive, spam, or violates these terms.
        </p>
        <p>
          This is a student project built for educational purposes and is provided as-is, without
          warranty of any kind.
        </p>
      </div>
    </div>
  );
}
