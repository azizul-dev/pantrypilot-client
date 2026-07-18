export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-poppins font-extrabold text-3xl text-secondary mb-6">Privacy Policy</h1>
      <div className="flex flex-col gap-4 text-text-brown/80 leading-relaxed text-sm">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          PantryPilot collects only the information necessary to provide our service: your name, email
          address, and any recipes, reviews, or blog posts you choose to create. If you sign in with
          Google, we receive your name, email, and profile picture from Google.
        </p>
        <p>
          Your password (for email/password accounts) is stored securely using industry-standard
          hashing and is never visible to us in plain text.
        </p>
        <p>
          We do not sell or share your personal data with third parties for marketing purposes. Your
          data is used solely to operate PantryPilot's features, such as your Wishlist, your recipe
          submissions, and your reviews.
        </p>
        <p>
          This is a student project built for educational purposes. If you have questions about your
          data, contact us at hello@pantrypilot.com.
        </p>
      </div>
    </div>
  );
}
