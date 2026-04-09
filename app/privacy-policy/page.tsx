import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy | TenantVoice",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-900 px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>

        <p className="text-slate-300">
          TenantVoice collects the minimum information needed to let people sign
          in, post reviews, and keep the site safe.
        </p>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">What we collect</h2>
          <p className="text-slate-300">
            We may collect your email address through Supabase authentication,
            your review content, selected issue tags, rating, and basic technical
            information needed to run the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">How we use data</h2>
          <p className="text-slate-300">
            We use this information to authenticate users, display housing
            reviews, moderate abuse, investigate reports, and improve the
            service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">User content</h2>
          <p className="text-slate-300">
            Reviews are public. Do not include private information such as full
            names, phone numbers, email addresses, or details about someone’s
            private life.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Reports and removals</h2>
          <p className="text-slate-300">
            If you believe content is inaccurate, unlawful, defamatory, or
            contains personal data, contact{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="text-blue-400 hover:underline"
            >
              {siteConfig.supportEmail}
            </a>{" "}
            with the review details and we will review it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-slate-300">
            For privacy requests or content complaints, email{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="text-blue-400 hover:underline"
            >
              {siteConfig.supportEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
