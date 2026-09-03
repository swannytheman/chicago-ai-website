import { Link } from 'react-router-dom';
import { LegalPage, Section, Bullets } from './LegalPage.jsx';
import { CONTACT_EMAIL } from './siteConfig.js';

const mailto = `mailto:${CONTACT_EMAIL}`;

export default function Terms() {
  return (
    <LegalPage
      docTitle="Terms of Use — Chicago AI Group"
      title="Terms of Use"
      intro="These terms cover your use of this website. They are short on purpose. Paid work is a separate agreement and is not governed by this page."
    >
      <Section n={1} title="About these terms">
        <p>
          This website is operated by The Chicago AI Group. By using it you agree to what is on this page. If you do
          not, please stop using the site.
        </p>
      </Section>

      <Section n={2} title="What this site is">
        <p>
          It is an informational site for our AI sales-agent service, and a way for interested businesses to get in
          touch. Everything on it — the descriptions, the plan pricing, the timelines — is here to tell you what we do
          and help you decide whether to talk to us.
        </p>
      </Section>

      <Section n={3} title="No account, and nothing here is the paid product">
        <p>
          Browsing the site does not create an account. Neither does requesting the free email demo or booking a
          strategy call: they are ways to see how we work and to talk to us, not the service itself.
        </p>
        <p>
          <strong>Paid work begins only after a separate written agreement or invoice</strong> between us. That agreement,
          not this page, sets out what we deliver, what it costs, and any commitments we make about the work.
        </p>
      </Section>

      <Section n={4} title="Using the site responsibly">
        <p>Please do not:</p>
        <Bullets items={[
          'Submit our forms repeatedly or automatically, or use them to send anyone unsolicited email.',
          "Enter someone else's personal details, or an email address you are not entitled to use.",
          'Try to break, overload, probe or gain unauthorised access to the site or the services behind it.',
          'Scrape or copy the site to reproduce it elsewhere.',
        ]} />
        <p>We may block access if the site is being misused.</p>
      </Section>

      <Section n={5} title="Our content">
        <p>
          The text, design, graphics and logo on this site belong to The Chicago AI Group, except where they belong to
          someone else — client names and logos are the property of those companies and appear with permission. You may
          read and share the pages. You may not republish them as your own or use our name or branding to suggest a
          relationship that does not exist.
        </p>
      </Section>

      <Section n={6} title="The site is provided as it is">
        <p>
          We work to keep this site accurate and available, but we provide it <strong>as is</strong>, without warranties of
          any kind. We do not promise it will always be up, error-free, or that any figure or example on it will match
          your own results.
        </p>
        <p>
          Any commitment about outcomes applies only to paid work and only as written into the agreement we sign with
          you. The 60-day Results Guarantee described on our homepage works that way too: the terms are as published
          there, and they are confirmed in your client agreement.
        </p>
      </Section>

      <Section n={7} title="Limitation of liability">
        <p>
          To the extent the law allows, The Chicago AI Group is not liable for indirect, incidental, or consequential
          losses arising from your use of this website, or from your inability to use it.
        </p>
        <p>
          This section is about the website. It does not limit anything we owe you under a signed agreement for paid
          work, which has its own terms.
        </p>
      </Section>

      <Section n={8} title="Links to other services">
        <p>
          Some links take you off this site, most notably to Calendly for scheduling. We do not control those services
          and are not responsible for them. Their own terms and privacy policies apply once you are there.
        </p>
      </Section>

      <Section n={9} title="Changes">
        <p>
          We may update these terms. The date at the top of this page will change when we do, and the current version
          is the one that applies.
        </p>
      </Section>

      <Section n={10} title="Governing law">
        <p>
          These terms are governed by the laws of the State of Illinois, USA, without regard to its conflict-of-law
          rules.
        </p>
      </Section>

      <Section n={11} title="How to reach us">
        <p>
          Questions about these terms: email{' '}
          <a href={mailto} className="text-emerald-300 hover:text-emerald-200 underline">{CONTACT_EMAIL}</a> or use the{' '}
          <Link to="/contact" className="text-emerald-300 hover:text-emerald-200 underline">Contact page</Link>.
        </p>
        <p className="text-zinc-400">See also our <Link to="/privacy" className="text-emerald-300 hover:text-emerald-200 underline">Privacy Policy</Link>.</p>
      </Section>
    </LegalPage>
  );
}
