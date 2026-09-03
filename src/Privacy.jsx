import { Link } from 'react-router-dom';
import { LegalPage, Section, Bullets } from './LegalPage.jsx';
import { EXTERNAL_URLS, SECURE_LINK_PROPS, CONTACT_EMAIL } from './siteConfig.js';

const mailto = `mailto:${CONTACT_EMAIL}`;

export default function Privacy() {
  return (
    <LegalPage
      docTitle="Privacy Policy — Chicago AI Group"
      title="Privacy Policy"
      intro="This page explains what we collect when you use this website, why we collect it, and how to get it removed. It covers this site only."
    >
      <Section n={1} title="Who we are">
        <p>
          The Chicago AI Group is a Chicago-based team that builds and runs AI sales agents for other
          businesses. This policy covers <strong>chicagoaigroup.com</strong>. It does not cover work we
          do inside a client&apos;s own systems under a signed agreement, which is governed by that agreement.
        </p>
      </Section>

      <Section n={2} title="What we collect">
        <p>We only collect what you type into this site. There is no tracking pixel and no advertising network on it.</p>
        <p><strong>If you request the free email demo</strong> (the sample sequence page), we receive:</p>
        <Bullets items={[
          'Your first name and business email address, which are required.',
          'Optionally: your company name, industry, biggest bottleneck, the CRM or tools you use now, your website, and anything else you choose to write in the notes box.',
        ]} />
        <p><strong>If you send us a message</strong> from the <Link to="/contact" className="text-emerald-300 hover:text-emerald-200 underline">Contact page</Link>, we receive your name, work email, and the company, website and message you provide.</p>
        <p><strong>With either form</strong>, we also record the time you submitted it, the page you submitted it from, the page you first arrived on, the site that referred you, and any campaign tags in that link — the <code className="text-zinc-400">utm_</code> values and Google or Meta click identifiers that get appended when you arrive from an ad or a newsletter. That is how we know which campaign a lead came from.</p>
        <p><strong>If you book a strategy call</strong>, you leave this site for Calendly and give your details to them directly. We see the booking Calendly passes back to us. We do not control what Calendly collects; their privacy policy applies.</p>
        <p><strong>Server logs.</strong> Our host records ordinary request logs, including IP addresses, for security and reliability. We do not use them to build a profile of you.</p>
      </Section>

      <Section n={3} title="Why we use it">
        <Bullets items={[
          'To write and send the demo email sequence you asked for, personalized with what you told us.',
          'To reply to your message and, if you want one, to arrange a call.',
          'To follow up about working together.',
          'To keep the site running, secure, and to understand which pages and campaigns actually bring people in.',
        ]} />
        <p>We do not use your information to make automated decisions about you, and we do not build advertising profiles.</p>
      </Section>

      <Section n={4} title="Cookies and browser storage">
        <p>
          This site sets <strong>no cookies</strong>. There is no Google Analytics, no Meta pixel, no tag manager,
          and no advertising or cross-site tracking of any kind.
        </p>
        <p>
          We do use your browser&apos;s <strong>session storage</strong>, which holds a small amount of data and is erased
          when you close the tab. It remembers that you already submitted the demo form (so a refresh does not send
          you a second sequence), the first name and email you entered so we can show your confirmation, and the
          campaign tags described above. This never leaves your browser except as part of a form you submit.
        </p>
      </Section>

      <Section n={5} title="The companies that help us run this">
        <p>We keep the list short, and each one only handles what it needs to. As of the date on this page:</p>
        <Bullets items={[
          <><strong>Vercel</strong> hosts the site and serves these pages.</>,
          <><strong>Make.com</strong> receives what you submit through our forms and routes it to us and to our CRM.</>,
          <><strong>Calendly</strong> handles scheduling if you book a call.</>,
          <><strong>Google Fonts</strong> serves the typeface this site uses, which means Google receives your IP address when a page loads.</>,
          <>An <strong>email delivery provider</strong> sends the demo sequence and our replies.</>,
        ]} />
        <p>
          <strong>We do not sell your personal information, and we do not share it for advertising.</strong> We share it with
          the providers above only so they can do the job we hired them for, and where the law requires us to.
        </p>
      </Section>

      <Section n={6} title="How long we keep it">
        <p>
          We keep what you send for as long as we need it to deliver the demo you asked for and to follow up about
          working together, and for as long as we have a business relationship. After that we delete it, or keep the
          minimum needed to honour an unsubscribe or deletion request so we do not contact you again by mistake.
          You can ask us to delete it sooner at any time.
        </p>
      </Section>

      <Section n={7} title="Your choices">
        <p>You can ask us to show you what we hold about you, correct it, or delete it. Email <a href={mailto} className="text-emerald-300 hover:text-emerald-200 underline">{CONTACT_EMAIL}</a> or use the <Link to="/contact" className="text-emerald-300 hover:text-emerald-200 underline">Contact page</Link>. We will not make you jump through hoops, and we will not charge you for it.</p>
      </Section>

      <Section n={8} title="Emails from us">
        <p>
          The demo sequence is three emails over about five days, and you only get it because you asked for it on the
          sample sequence form. Every one has a one-click unsubscribe link, and unsubscribing stops the sequence
          immediately. We may also reply to you directly about your enquiry. We do not send SMS from this site, and we
          do not add you to a general marketing list you did not ask for.
        </p>
      </Section>

      <Section n={9} title="Children">
        <p>
          This site is for people running businesses. It is not directed at children under 13 and we do not knowingly
          collect their information. If you think a child has sent us something, tell us and we will delete it.
        </p>
      </Section>

      <Section n={10} title="Changes to this policy">
        <p>
          If we change how any of this works, we will update this page and change the date at the top. If the change
          is significant and we hold your contact details, we will tell you.
        </p>
      </Section>

      <Section n={11} title="How to reach us">
        <p>
          Questions about this policy, or about anything we hold: email{' '}
          <a href={mailto} className="text-emerald-300 hover:text-emerald-200 underline">{CONTACT_EMAIL}</a>, use the{' '}
          <Link to="/contact" className="text-emerald-300 hover:text-emerald-200 underline">Contact page</Link>, or{' '}
          <a href={EXTERNAL_URLS.appointments} {...SECURE_LINK_PROPS} className="text-emerald-300 hover:text-emerald-200 underline">book a call</a>.
        </p>
        <p className="text-zinc-400">See also our <Link to="/terms" className="text-emerald-300 hover:text-emerald-200 underline">Terms of Use</Link>.</p>
      </Section>
    </LegalPage>
  );
}
