import type { Metadata } from 'next';
import { DoDont, List, PageIntro, Prose, Section } from '@/components/kit';

export const dynamic = 'force-static';
export const metadata: Metadata = { title: 'Tone of Voice — Content' };

const attributes = [
  {
    name: 'Clear',
    desc: 'Say exactly what you mean. Cut filler. Use simple words where possible: not "utilise", just "use".',
    do: '"Your payment failed. Check your card details and try again."',
    dont: '"Unfortunately, we were unable to process the transaction at this time."',
  },
  {
    name: 'Direct',
    desc: "Get to the point fast. Users scan, they don't read. Put the most important thing first.",
    do: '"Save changes": short, action-oriented.',
    dont: '"Click here to go ahead and save your recent changes."',
  },
  {
    name: 'Human',
    desc: 'Write like a smart colleague, not a corporate manual. Contractions are fine. Warmth matters.',
    do: '"You\'re all set." / "Something went wrong. We\'re on it."',
    dont: '"The operation completed successfully." / "An error has been encountered."',
  },
  {
    name: 'Confident',
    desc: "Don't over-apologise or hedge. Trust the user to handle real information.",
    do: '"Delete account" (with a clear confirmation step)',
    dont: '"Are you absolutely sure you want to maybe delete your account?"',
  },
];

export default function ToneOfVoicePage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Content"
        title="Tone of Voice"
        lead="Nexub products speak with one voice across every surface, from button labels to error messages to onboarding flows. This is how we sound: clear, direct, human, and confident."
      />

      <Section
        id="voice-attributes"
        title="Voice attributes"
        description="Four qualities define how Nexub products communicate. Every piece of UI copy should embody all four."
      >
        <div className="grid gap-4">
          {attributes.map((a) => (
            <DoDont key={a.name} title={a.name} description={a.desc} good={a.do} bad={a.dont} />
          ))}
        </div>
      </Section>

      <Section id="what-we-are-not" title="What we are not">
        <Prose>
          The voice is <strong>not</strong> overly formal, robotic, or corporate. It is also <strong>not</strong> casual to
          the point of being flippant, especially in error states or when money is involved.
        </Prose>
        <DoDont good="“Your session expired. Sign in again.”" bad="“Please be advised that your session has expired.”" />
        <DoDont good="“Payment didn’t go through. Try another card.”" bad="“Oops! Something went totally bonkers 🙈” for a payment failure" />
        <DoDont good="Active voice: “We sent you a code.”" bad="Passive voice: “A code has been sent.”" />
      </Section>

      <Section id="adapt-by-context" title="Adapt by context" description="The four attributes stay constant, but the register adapts to the moment:">
        <List
          items={[
            <><strong>Error states</strong>: calm and helpful, never alarming</>,
            <><strong>Success states</strong>: warm and affirming, brief</>,
            <><strong>Empty states</strong>: encouraging, action-focused</>,
            <><strong>Destructive actions</strong>: clear and honest, no softening of consequences</>,
            <><strong>Onboarding</strong>: welcoming, confidence-building</>,
          ]}
        />
      </Section>
    </div>
  );
}
