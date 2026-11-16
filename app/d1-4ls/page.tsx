import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/theme';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'The Four-Lens Assessment (D1-4LS) · Discernt',
  description: 'How Discernt assesses stories across four lenses: scriptural grounding, kingdom significance, source credibility, and fruit and edification. An experimental framework still being tested, and your feedback is welcome.',
  alternates: { canonical: SITE_URL + '/d1-4ls' },
};

export default function D14LSPage() {
  return (
    <>
      <Header />
      <main className="shell">
        <article className="docpage">
          <div className="kicker">Methodology</div>
          <h1>The Four-Lens Assessment</h1>
          <p className="lead">Every news story has more than one dimension. We look at each story through four lenses and show you what we see, so you can weigh it for yourself. To learn to use the lenses on anything you read, start with our <a className="ln" href="/discernment">reader&rsquo;s guide to reading the news</a>.</p>

          <div className="pilotcard">
            <strong>This is a work in progress.</strong> D1-4LS is an experimental assessment framework we are actively testing and refining. The scores are meant to support discernment, not replace your own judgment, and the method will keep changing as we learn. We would genuinely value your input: tell us what helps, what confuses, and what you would do differently at <a className="ln" href="mailto:contact@dot1.media?subject=D1-4LS%20feedback">contact@dot1.media</a>.
          </div>

          <h2>The four lenses</h2>
          <p>Each lens is scored from 0 to 10, built from five smaller indicators. The four lens scores are the real result and are meant to be read together. They measure very different things, so a high score on one says nothing about the others.</p>
          <ul className="names">
            <li><span className="role">Scriptural Grounding (SG)</span><span className="person">How clearly the story is illuminated by Scripture and consistent with the historic Christian faith, pointing to Christ rather than to spectacle. A high score does not mean the facts are verified or that every Christian tradition would frame it the same way.</span></li>
            <li><span className="role">Kingdom Significance (KS)</span><span className="person">How visibly God&rsquo;s kingdom is advancing &mdash; the gospel spreading, the church growing, lives redeemed, prayer answered &mdash; held with sober discernment. It is never a prediction, a claim of fulfillment, or date-setting. A low score is normal for ordinary news and does not mean weak journalism.</span></li>
            <li><span className="role">Source Credibility (SC)</span><span className="person">How well the story&rsquo;s factual claims are sourced and checked &mdash; especially testimonies, healings, and miracles. This is about evidence only, and it is separate from the other lenses. When sourcing is thin, we say so plainly.</span></li>
            <li><span className="role">Fruit &amp; Edification (FE)</span><span className="person">Whether the story strengthens faith and bears the fruit of the Spirit &mdash; mercy, reconciliation, and justice &mdash; giving glory to God rather than to people or platforms. A low score can simply mean the fruit is quiet or local, not that the reporting lacks compassion.</span></li>
          </ul>

          <h2>How to read a score</h2>
          <ul>
            <li>Read the four lenses together, not the total. The composite out of 40 is only a rough summary, shown second.</li>
            <li>Two stories can share the same total while being very different. The pattern across the four lenses matters more than the sum.</li>
            <li>A high score does not mean a story is true, morally good, a settled move of God, or endorsed by Discernt. A low score does not mean it is false or unimportant.</li>
            <li>When Source Credibility is low, we show a sourcing notice. Please weigh the factual claims accordingly.</li>
            <li>Our editorial verification status is shown separately from the score. The two are not the same thing.</li>
          </ul>

          <h2>How it is assessed</h2>
          <p>A first-pass assessment is drafted with the help of our newsroom tools, then reviewed by a person before publication. Scores are recorded with the version of the method used to produce them. We do not quietly re-score old articles under a new version; a reassessment is a new, dated round with its own record.</p>

          <h2>Help us improve it</h2>
          <p>D1-4LS is a pilot, and honest outside input is exactly what it needs. If a score seems off, if the labels are unclear, or if you think a lens is measuring the wrong thing, write to us at <a className="ln" href="mailto:contact@dot1.media?subject=D1-4LS%20feedback">contact@dot1.media</a>. We read every note.</p>

          <div className="updated">An experimental framework undergoing review. Dot One Media, Wasilla, Alaska.</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
