import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Terms of Use | TenantVoice",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-slate-900 px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold">Terms of Use</h1>

        <p className="text-slate-300">
          TenantVoice is a review platform for housing conditions and rental
          experiences. By using the site, you agree to these rules.
        </p>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Allowed content</h2>
          <p className="text-slate-300">
            Reviews must focus on the condition of the property and the rental
            experience, such as cold, mould, noise, maintenance, cleanliness,
            and similar housing issues.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Prohibited content</h2>
          <p className="text-slate-300">
            Do not post full names, phone numbers, email addresses, identity
            documents, threats, harassment, hate speech, private-life details,
            or accusations you cannot support with facts.
          </p>
          <p className="text-slate-300">
            Do not post defamatory statements, criminal allegations, or content
            intended to expose or shame private individuals.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Moderation</h2>
          <p className="text-slate-300">
            We may remove content, suspend access, or restrict accounts when
            content appears unlawful, abusive, misleading, or unrelated to
            housing conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Report a review</h2>
          <p className="text-slate-300">
            To report a review, email{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="text-blue-400 hover:underline"
            >
              {siteConfig.supportEmail}
            </a>{" "}
            with the address, review date if known, and the reason for the
            complaint.
          </p>
        </section>
      </div>
    </main>
  );
}
