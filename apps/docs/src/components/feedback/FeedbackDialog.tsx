'use client';

import * as React from 'react';
import { Dialog, Button, Textarea, Select, FormField, toast, Input } from '@nexub/react';
import { Turnstile, type TurnstileHandle } from './Turnstile';
import { ScreenshotPicker } from './ScreenshotPicker';
import {
  submitFeedback,
  readBrowserContext,
  type FeedbackCategory,
} from './submit';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_MESSAGE = 2000;
const MIN_MESSAGE = 10;

const CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: 'bug', label: '🐞 Bug' },
  { value: 'suggestion', label: '💡 Suggestion' },
  { value: 'question', label: '❓ Question' },
  { value: 'other', label: '📝 Other' },
];

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

export function FeedbackDialog({ open, onOpenChange }: Props) {
  const [category, setCategory] = React.useState<FeedbackCategory>('bug');
  const [message, setMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [screenshot, setScreenshot] = React.useState<Blob | File | null>(null);
  const [website, setWebsite] = React.useState(''); // honeypot — should stay empty
  const [token, setToken] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{ message?: string; email?: string }>({});

  const turnstileRef = React.useRef<TurnstileHandle | null>(null);

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setMessage('');
      setEmail('');
      setScreenshot(null);
      setWebsite('');
      setToken('');
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const validate = (): boolean => {
    const next: typeof errors = {};
    const trimmed = message.trim();
    if (trimmed.length < MIN_MESSAGE) {
      next.message = `Tell us a bit more — at least ${MIN_MESSAGE} characters.`;
    } else if (trimmed.length > MAX_MESSAGE) {
      next.message = `Too long — keep it under ${MAX_MESSAGE} characters.`;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'That email looks off.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const turnstileToken = token || turnstileRef.current?.getToken() || '';
    if (!turnstileToken && TURNSTILE_SITE_KEY) {
      toast.error('Please wait — verifying you’re human.');
      return;
    }

    setSubmitting(true);
    const result = await submitFeedback({
      category,
      message: message.trim(),
      email: email.trim() || undefined,
      screenshot,
      turnstileToken,
      website,
      context: readBrowserContext(),
    });
    setSubmitting(false);

    if (result.ok) {
      toast.success('Sent — thanks for the feedback!');
      onOpenChange(false);
      return;
    }

    // Failure path — give the user something actionable.
    turnstileRef.current?.reset();
    setToken('');

    if (result.status === 429) {
      toast.error('Too many submissions. Try again in a minute.');
    } else if (result.error === 'turnstile_failed') {
      toast.error('Verification failed. Please retry.');
    } else if (result.error === 'bad_image' || result.error === 'too_large') {
      toast.error('That image was rejected. Try a smaller PNG/JPEG.');
    } else if (result.error === 'invalid' || result.error === 'too_long') {
      toast.error('Some fields look off. Please review and resubmit.');
    } else {
      toast.error('Couldn’t send right now. Please try again later.');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content size="md" aria-describedby={undefined}>
          <Dialog.Header>
            <Dialog.Title>Send feedback</Dialog.Title>
            <Dialog.Description>
              Bug, suggestion, or question — we read everything that lands in our inbox.
            </Dialog.Description>
          </Dialog.Header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Honeypot — visually hidden, off-screen, aria-hidden, autocomplete off.
                Real users never type into it; bots usually do. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="pointer-events-none absolute -start-[9999px] h-px w-px opacity-0"
            />

            <FormField.Root required>
              <FormField.Label>Category</FormField.Label>
              <Select.Root
                value={category}
                onValueChange={(v) => setCategory(v as FeedbackCategory)}
              >
                <Select.Trigger aria-label="Category">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {CATEGORIES.map((c) => (
                    <Select.Item key={c.value} value={c.value}>
                      {c.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </FormField.Root>

            <FormField.Root required invalid={Boolean(errors.message)}>
              <FormField.Label>What’s on your mind?</FormField.Label>
              <FormField.Control>
                <Textarea
                  rows={5}
                  placeholder="Describe the bug, your suggestion, or your question…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={MAX_MESSAGE + 200}
                />
              </FormField.Control>
              <FormField.Description>
                {message.length}/{MAX_MESSAGE} characters
              </FormField.Description>
              <FormField.Error>{errors.message}</FormField.Error>
            </FormField.Root>

            <FormField.Root invalid={Boolean(errors.email)}>
              <FormField.Label>Email (optional)</FormField.Label>
              <FormField.Control>
                <Input
                  type="email"
                  size="sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormField.Control>
              <FormField.Description>
                Leave it if you’d like a reply.
              </FormField.Description>
              <FormField.Error>{errors.email}</FormField.Error>
            </FormField.Root>

            <FormField.Root>
              <FormField.Label>Screenshot (optional)</FormField.Label>
              <ScreenshotPicker
                value={screenshot}
                onChange={setScreenshot}
                onError={(msg) => toast.error(msg)}
              />
            </FormField.Root>

            {/* Turnstile widget — invisible/interaction-only, mounts only when site key exists. */}
            {TURNSTILE_SITE_KEY && open ? (
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                onToken={setToken}
                onError={() => setToken('')}
              />
            ) : null}

            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button variant="ghost" type="button">Cancel</Button>
              </Dialog.Close>
              <Button type="submit" loading={submitting}>
                Send feedback
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
