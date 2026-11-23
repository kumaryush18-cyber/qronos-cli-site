import {
  Brain,
  Check,
  Code2,
  KeyRound,
  ReceiptText,
  ShieldCheck,
  Terminal,
  TextQuote,
  Timer,
  Workflow,
} from "lucide-react";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { Section, Shell } from "@/components/layout/Shell";
import { TerminalMock } from "@/components/terminal/TerminalMock";
import { StarBorder } from "@/components/ui/StarBorder";
import { WorkflowPanelMock } from "@/components/workflow/WorkflowPanelMock";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { CodePanel } from "@/components/ui/CodePanel";
import { CompareTable } from "@/components/ui/CompareTable";
import { CopyButton } from "@/components/ui/CopyButton";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { Tabs } from "@/components/ui/Tabs";
import {
  CLOSING,
  COMPARISON,
  FAQ,
  FEATURES,
  HERO,
  HERO_TERMINAL,
  PROOF,
  QUICKSTART,
  WORKFLOWS,
} from "@/lib/copy";
import { SITE } from "@/lib/site";

const FEATURE_ICONS = [Workflow, ReceiptText, TextQuote, Brain, Code2, ShieldCheck] as const;
const PROOF_ICONS = { tick: Check, clock: Timer, key: KeyRound, terminal: Terminal } as const;

interface Headline {
  readonly before: string;
  readonly accent: string;
  readonly after: string;
}

/** The one-word serif accent inside a headline. */
function Headline({ headline, className }: { headline: Headline; className?: string }) {
  return (
    <h2 className={className}>
      {headline.before}
      <em>{headline.accent}</em>
      {headline.after}
    </h2>
  );
}

export function Home() {
  return (
    <>
      {/* --- Hero ---------------------------------------------------------- */}
      <Shell>
        <div className="relative grid items-start gap-12 pt-14 pb-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-[66px] lg:pt-20">
          {/* Soft orange light behind the hero. Decoration only: it is aria-hidden,
              it never carries meaning, and it stops under reduced motion. The
              wrapper clips it: a 520px glow on a 390px screen made the whole page
              scroll sideways by 46px until it did. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="glow-drift -top-[120px] left-[-90px] h-[520px] w-[520px] rounded-full opacity-70" />
            {/* The turning disc of light, the same idea as the Qronos AI landing
                page. It sits behind the headline and turns once every 20 s. */}
            <div className="aurora-disc -top-[180px] left-[-160px]" />
            <div className="aurora-disc -bottom-[220px] right-[-140px] hidden opacity-20 lg:block" style={{ animationDirection: "reverse" }} />
          </div>
          {/* The hero rises but never fades: an opacity-0 headline moves the
              largest-contentful-paint time to the end of its animation. */}
          <div className="hero-rise relative flex flex-col items-start gap-6">
            <Eyebrow dot>{HERO.eyebrow}</Eyebrow>
            <h1 className="display">
              {HERO.headline.before}
              <em>{HERO.headline.accent}</em>
              {HERO.headline.after}
            </h1>
            <p className="lead">{HERO.sub}</p>

            <div className="flex w-full max-w-[420px] flex-col gap-2">
              <div className="flex items-center gap-2 rounded-[9px] border border-line bg-card px-3 py-2">
                <span aria-hidden className="font-mono text-[12px] text-orange">
                  $
                </span>
                <code className="font-mono text-[12.5px] text-ink">{SITE.install}</code>
                <CopyButton text={SITE.install} className="ml-auto border-transparent px-2 py-1" live={false} />
              </div>
              <p className="font-mono text-[11px] text-muted">{HERO.installNote}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button href="/docs">Read the docs →</Button>
              <Button href={SITE.repo} variant="ghost" external>
                Star on GitHub
              </Button>
            </div>
          </div>

          {/* No entrance animation on the terminal box: a translate on a block
              this large is counted as a layout shift, and it has its own typing. */}
          <StarBorder className="w-full" duration={9} width={190}>
            <TerminalMock lines={HERO_TERMINAL} className="w-full" animate />
          </StarBorder>
        </div>
      </Shell>

      {/* --- Proof strip --------------------------------------------------- */}
      <Shell>
        <ul className="grid gap-3 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF.map((item, index) => {
            const Icon = PROOF_ICONS[item.icon];
            return (
              <Reveal
                key={item.text}
                as="li"
                index={index}
                className="flex items-start gap-2.5 text-[12.5px] text-muted"
              >
                <Icon size={15} strokeWidth={2} aria-hidden className="mt-[2px] shrink-0 text-orange" />
                {item.text}
              </Reveal>
            );
          })}
        </ul>
      </Shell>

      {/* --- Features ------------------------------------------------------ */}
      <Section id="features" labelledBy="features-heading">
        <Reveal className="flex flex-col gap-4">
          <Eyebrow>What it does</Eyebrow>
          <h2 id="features-heading" className="heading">
            Six things you can watch it <em className="serif-accent">do</em>.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.id} index={index % 3} className="h-full">
              <FeatureCard
                step={feature.id}
                title={feature.title}
                body={feature.body}
                icon={FEATURE_ICONS[index] ?? Workflow}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --- Workflows ----------------------------------------------------- */}
      <Section id="workflows" labelledBy="workflows-heading" className="border-t border-line">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-[66px]">
          <Reveal className="flex min-w-0 flex-col gap-5">
            <Eyebrow>{WORKFLOWS.eyebrow}</Eyebrow>
            <Headline headline={WORKFLOWS.headline} className="heading" />
            <p className="lead">{WORKFLOWS.body}</p>

            <ul className="mt-2 flex flex-col gap-5">
              {WORKFLOWS.bullets.map((bullet) => (
                <li key={bullet.title} className="border-l border-line pl-4">
                  <p className="text-[14px] font-bold text-ink">{bullet.title}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{bullet.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal index={1}>
            <WorkflowPanelMock className="self-start" />
          </Reveal>
        </div>
      </Section>

      {/* --- Comparison ---------------------------------------------------- */}
      <Section labelledBy="compare-heading" className="border-t border-line">
        <Reveal className="flex flex-col gap-4">
          <Eyebrow>How it compares</Eyebrow>
          <h2 id="compare-heading" className="heading">
            Different in <em className="serif-accent">four</em> ways that matter.
          </h2>
        </Reveal>
        <Reveal index={1}>
          <CompareTable rows={COMPARISON.rows} footnote={COMPARISON.footnote} className="mt-10" />
        </Reveal>
      </Section>

      {/* --- Quickstart ---------------------------------------------------- */}
      <Section labelledBy="quickstart-heading" className="border-t border-line">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[66px]">
          <Reveal className="flex min-w-0 flex-col gap-5">
            <Eyebrow>Quickstart</Eyebrow>
            <Headline headline={QUICKSTART.headline} className="heading" />
            <p className="lead">{QUICKSTART.body}</p>

            <ol className="mt-2 flex flex-col gap-4">
              {QUICKSTART.steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="mt-[1px] grid size-6 shrink-0 place-items-center rounded-full border border-orange-line font-mono text-[11px] text-orange">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-bold text-ink">{step.title}</p>
                    <p className="font-mono text-[11.5px] leading-relaxed break-words text-muted">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal index={1} className="flex min-w-0 flex-col gap-4">
            <Tabs
              label="How to start"
              tabs={[
                {
                  id: "first-run",
                  label: "First run",
                  panel: <CodePanel code={SITE.install} label="shell" />,
                },
                {
                  id: "byok",
                  label: "Bring your own key",
                  panel: <CodePanel code={QUICKSTART.byok.join("\n")} label="providers" />,
                },
              ]}
            />
            <Callout tone="honest">{QUICKSTART.keyNote}</Callout>
          </Reveal>
        </div>
      </Section>

      {/* --- FAQ ----------------------------------------------------------- */}
      <Section labelledBy="faq-heading" className="border-t border-line">
        <Reveal className="flex flex-col gap-4">
          <Eyebrow>Questions</Eyebrow>
          <h2 id="faq-heading" className="heading">
            The things people <em className="serif-accent">ask</em>.
          </h2>
        </Reveal>

        <Reveal index={1} as="div" className="mt-10 flex flex-col divide-y divide-line border-y border-line">
          {FAQ.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer items-center gap-3 py-1 text-[14.5px] font-bold text-ink marker:content-none">
                <span
                  aria-hidden
                  className="font-mono text-[13px] leading-none text-orange transition-transform duration-[160ms] group-open:rotate-45"
                >
                  +
                </span>
                {item.question}
              </summary>
              <p className="mt-3 max-w-[68ch] pl-6 text-[13.5px] leading-[1.75] text-muted">{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </Section>

      {/* --- Closing CTA --------------------------------------------------- */}
      <Section className="border-t border-line" spacing="tight">
        <Reveal className="flex flex-col items-center gap-5 py-8 text-center">
          <div aria-hidden className="flex gap-1.5">
            <span className="size-1.5 rounded-full bg-orange-pale/90" />
            <span className="size-1.5 rounded-full bg-orange-pale/60" />
            <span className="size-1.5 rounded-full bg-orange-pale/30" />
          </div>
          <Eyebrow>{CLOSING.eyebrow}</Eyebrow>
          <Headline headline={CLOSING.headline} className="heading max-w-[18ch]" />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CopyButton
              text={SITE.install}
              label="Install Qronos CLI"
              className="border-orange-line bg-orange-soft px-6 py-3.5 text-[13px] font-extrabold text-orange hover:text-orange-pale"
              live={false}
            />
            <Button href="/docs" variant="ghost">
              Read the docs
            </Button>
          </div>
          <p className="font-mono text-[11px] text-muted">{CLOSING.micro}</p>
        </Reveal>
      </Section>
    </>
  );
}
