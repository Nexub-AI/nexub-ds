import * as React from 'react';
import {
  Alert,
  Button,
  DatePicker,
  DescriptionList,
  FileUpload,
  FormError,
  FormField,
  Input,
  PhoneInput,
  Progress,
  RadioCard,
  RadioCardGroup,
  Select,
  SuccessCheck,
  type PhoneInputProps,
} from '@nexub/react';
import { ErrorSummary, type ErrorSummaryItem } from '../ErrorSummary/index.js';
import { StatusSteps, type StatusStep } from '../StatusSteps/index.js';
import { PageFrame, usePageStrings, useTemplateLocale, type PageFrameProps, type PageTemplateMessages } from '../PageFrame/PageFrame.js';
import { useWizard } from '../OnboardingPage/useWizard.js';
import { sharedMessages } from '../PageFrame/messages/shared.js';
import { kycMessages } from '../PageFrame/messages/kyc.js';

/** The defaults this template shows (11.7: not every template's strings). */
const STRINGS = { ...sharedMessages, ...kycMessages };

type Country = NonNullable<PhoneInputProps['defaultCountry']>;

export type KycStatus = 'draft' | 'submitted' | 'review' | 'approved' | 'rejected';

export interface KycDocumentType {
  id: string;
  label: string;
  description?: string;
  /** Asks for the back as well. */
  twoSided?: boolean;
}

export interface KycValues {
  legalName: string;
  dateOfBirth?: Date;
  /** E.164. */
  phone: string;
  /** ISO 3166-1 alpha-2. */
  country: string;
  /** A `documentTypes` id. */
  documentType: string;
  front?: File;
  /** Only for two-sided documents. */
  back?: File;
}

export interface KycPageProps extends Omit<PageFrameProps, 'title' | 'children' | 'onSubmit'> {
  defaultValues?: Partial<KycValues>;
  /** Sends the application. When it resolves the page shows the status; a rejection shows its message on Review. */
  onSubmit: (values: KycValues) => void | Promise<unknown>;
  /** @default passport, national ID (two-sided), driving licence (two-sided) */
  documentTypes?: KycDocumentType[];
  /** Countries offered for residence and for the phone number. @default a short common list */
  countries?: Country[];
  /** Country the phone field starts on. */
  defaultCountry?: Country;
  /** Where the application stands, from your server. Unset: the form, then "submitted" after `onSubmit`. */
  status?: KycStatus;
  /** Why it was rejected, shown on the failed step. */
  rejectionReason?: string;
  /** Accepted upload types. @default JPG, PNG, PDF */
  accept?: string[];
  /** Largest upload in bytes. @default 10 MB */
  maxSize?: number;
  loading?: boolean;
  /** An error from outside the form (announced). */
  error?: string;
  messages?: Partial<PageTemplateMessages>;
}

// ponytail: a short default list, not every country. Pass `countries` for the markets you serve.
const DEFAULT_COUNTRIES = ['AU', 'CA', 'DE', 'FR', 'GB', 'IN', 'JP', 'MY', 'SG', 'AE', 'US'] as Country[];
const DEFAULT_ACCEPT = ['image/jpeg', 'image/png', 'application/pdf'];

type Field = 'legalName' | 'dateOfBirth' | 'phone' | 'country' | 'documentType' | 'front' | 'back';
const STEP_FIELDS: Field[][] = [['legalName', 'dateOfBirth', 'phone', 'country'], ['documentType', 'front', 'back'], []];

const heading = 'text-headline-sm text-[var(--color-on-surface)] outline-none';

/**
 * Identity verification: personal details, a document with clear photo
 * instructions, a review with links back to each part, then the status of the
 * application. Drive `status` from your server once it is submitted.
 */
export const KycPage = React.forwardRef<HTMLElement, KycPageProps>(function KycPage(
  {
    defaultValues,
    onSubmit,
    documentTypes,
    countries = DEFAULT_COUNTRIES,
    defaultCountry,
    status: statusProp,
    rejectionReason,
    accept = DEFAULT_ACCEPT,
    maxSize = 10 * 1024 * 1024,
    loading,
    error,
    messages,
    ...props
  },
  ref,
) {
  const m = usePageStrings(messages, STRINGS);
  const locale = useTemplateLocale();
  const uid = React.useId();
  const id = (field: Field) => `${uid}-${field}`;
  const types: KycDocumentType[] = documentTypes ?? [
    { id: 'passport', label: m.passport },
    { id: 'national-id', label: m.nationalId, twoSided: true },
    { id: 'driving-licence', label: m.drivingLicence, twoSided: true },
  ];

  const [values, setValues] = React.useState<KycValues>({ legalName: '', phone: '', country: '', documentType: '', ...defaultValues });
  // A prefilled number is taken as checked; PhoneInput reports again on the first edit.
  const [phoneValid, setPhoneValid] = React.useState(Boolean(defaultValues?.phone));
  const [errors, setErrors] = React.useState<Partial<Record<Field, string>>>({});
  const [summary, setSummary] = React.useState<ErrorSummaryItem[]>([]);
  // What this page did since the last `status` from the app: reopened the form, or sent it.
  const [local, setLocal] = React.useState<{ status: KycStatus; since: KycStatus | undefined }>();
  const status = local && local.since === statusProp ? local.status : statusProp ?? 'draft';

  const type = types.find((t) => t.id === values.documentType);
  const set = <K extends Field>(field: K, value: KycValues[K]) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors(({ [field]: _cleared, ...rest }) => rest);
  };

  const check = (step: number) => {
    const all: Partial<Record<Field, string | false>> = {
      legalName: !values.legalName.trim() && m.enterLegalName,
      dateOfBirth: !values.dateOfBirth && m.enterDateOfBirth,
      phone: (!values.phone || !phoneValid) && m.enterValidPhone,
      country: !values.country && m.chooseCountry,
      documentType: !type && m.chooseDocumentType,
      front: !values.front && m.uploadFront,
      back: Boolean(type?.twoSided) && !values.back && m.uploadBack,
    };
    const found = STEP_FIELDS[step]!.flatMap((field) => (all[field] ? [{ id: id(field), field, message: all[field] }] : []));
    setErrors(Object.fromEntries(found.map((f) => [f.field, f.message])));
    setSummary(found.map(({ id, message }) => ({ id, message })));
    return found.length === 0;
  };

  const wizard = useWizard({
    count: 3,
    validate: check,
    onComplete: async () => {
      await onSubmit({ ...values, legalName: values.legalName.trim(), back: type?.twoSided ? values.back : undefined });
      setLocal({ status: 'submitted', since: statusProp });
    },
    invalidMessage: m.stepInvalid,
  });
  const { index } = wizard;
  const busy = wizard.busy || loading;
  const goTo = (step: number) => {
    setSummary([]);
    wizard.goTo(step);
  };

  if (status !== 'draft') {
    const rejected = status === 'rejected';
    const reached = { submitted: 0, review: 1, rejected: 1, approved: 3 }[status];
    const at = (i: number): StatusStep['status'] => (i < reached ? 'done' : i === reached ? 'current' : 'upcoming');
    return (
      <PageFrame ref={ref} width="sm" {...props}>
        <div role="status" className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            {status === 'approved' && <SuccessCheck />}
            <h1 ref={wizard.headingRef} tabIndex={-1} className={heading}>
              {m.verificationStatus}
            </h1>
          </div>
          <StatusSteps
            aria-label={m.verificationStatus}
            steps={[
              { id: 'submitted', title: m.kycSubmitted, status: at(0) },
              rejected
                ? {
                    id: 'review',
                    title: m.kycRejected,
                    description: rejectionReason,
                    status: 'error',
                    action: (
                      <Button
                        variant="tonal"
                        size="sm"
                        onClick={() => {
                          setLocal({ status: 'draft', since: statusProp });
                          wizard.restart();
                        }}
                      >
                        {m.fixAndResubmit}
                      </Button>
                    ),
                  }
                : { id: 'review', title: m.kycUnderReview, status: at(1) },
              { id: 'approved', title: m.kycApproved, status: at(2) },
            ]}
          />
        </div>
      </PageFrame>
    );
  }

  const label = m.stepOf(index + 1, 3);
  const regions = new Intl.DisplayNames(locale, { type: 'region' });
  const countryName = (code: string) => regions.of(code) ?? code;
  const upload = (field: 'front' | 'back', text: string) => (
    <div className="flex flex-col gap-1.5">
      <FileUpload.Root
        id={id(field)}
        tabIndex={-1}
        className="outline-none"
        accept={accept}
        maxSize={maxSize}
        maxFiles={1}
        invalid={Boolean(errors[field])}
        onFilesChange={(files) => set(field, files[0])}
      >
        <FileUpload.Dropzone>
          <span className="text-body-sm font-semibold text-[var(--color-primary)]">{text}</span>
        </FileUpload.Dropzone>
        <FileUpload.List>
          <FileUpload.Item index={0} />
        </FileUpload.List>
      </FileUpload.Root>
      {errors[field] && <FormError>{errors[field]}</FormError>}
    </div>
  );
  const editLink = (step: number, section: string) => (
    <Button variant="link" size="sm" aria-label={`${m.edit}: ${section}`} onClick={() => goTo(step)}>
      {m.edit}
    </Button>
  );

  return (
    <PageFrame ref={ref} width="sm" {...props}>
      <div className="flex flex-col gap-2">
        <Progress value={index + 1} max={3} aria-label={label} />
        <p className="text-label-md text-[var(--color-on-surface-variant)]">{label}</p>
      </div>
      <h1 ref={wizard.headingRef} tabIndex={-1} className={heading}>
        {[m.personalDetails, m.document, m.review][index]}
      </h1>

      <ErrorSummary errors={summary} />
      {(wizard.error ?? error) && summary.length === 0 && (
        <Alert tone="danger" role="alert">
          {wizard.error ?? error}
        </Alert>
      )}

      {/* Steps stay mounted (hidden) so picked files and open fields survive Back and Edit. */}
      <div hidden={index !== 0} className="flex flex-col gap-4">
        <FormField.Root required id={id('legalName')} invalid={errors.legalName ? true : undefined}>
          <FormField.Label>{m.legalName}</FormField.Label>
          <FormField.Control>
            <Input required={false} autoComplete="name" value={values.legalName} onChange={(e) => set('legalName', e.target.value)} />
          </FormField.Control>
          <FormField.Description>{m.legalNameHint}</FormField.Description>
          <FormField.Error>{errors.legalName}</FormField.Error>
        </FormField.Root>
        <FormField.Root required id={id('dateOfBirth')} invalid={errors.dateOfBirth ? true : undefined}>
          <FormField.Label>{m.dateOfBirth}</FormField.Label>
          <FormField.Control>
            <DatePicker typeable sheet="auto" value={values.dateOfBirth} onValueChange={(date) => set('dateOfBirth', date)} />
          </FormField.Control>
          <FormField.Error>{errors.dateOfBirth}</FormField.Error>
        </FormField.Root>
        <FormField.Root required id={id('phone')} invalid={errors.phone ? true : undefined}>
          <FormField.Label>{m.phone}</FormField.Label>
          <FormField.Control>
            <PhoneInput
              required={false}
              sheet="auto"
              defaultCountry={defaultCountry}
              countries={countries}
              value={values.phone}
              onValueChange={(e164, info) => {
                set('phone', e164);
                setPhoneValid(info.valid);
              }}
            />
          </FormField.Control>
          <FormField.Error>{errors.phone}</FormField.Error>
        </FormField.Root>
        <FormField.Root required id={id('country')} invalid={errors.country ? true : undefined}>
          <FormField.Label>{m.country}</FormField.Label>
          <Select.Root value={values.country} onValueChange={(code) => set('country', code)}>
            <FormField.Control>
              <Select.Trigger>
                <Select.Value placeholder={m.chooseCountry} />
              </Select.Trigger>
            </FormField.Control>
            <Select.Content searchable sheet="auto">
              {countries.map((code) => (
                <Select.Item key={code} value={code}>
                  {countryName(code)}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <FormField.Error>{errors.country}</FormField.Error>
        </FormField.Root>
      </div>

      <div hidden={index !== 1} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 id={`${uid}-type`} className="text-title-sm text-[var(--color-on-surface)]">
            {m.documentType}
          </h2>
          <RadioCardGroup
            id={id('documentType')}
            aria-labelledby={`${uid}-type`}
            invalid={Boolean(errors.documentType)}
            value={values.documentType}
            onValueChange={(value) => set('documentType', value)}
          >
            {types.map((t) => (
              <RadioCard key={t.id} value={t.id} title={t.label} description={t.description} />
            ))}
          </RadioCardGroup>
          {errors.documentType && <FormError>{errors.documentType}</FormError>}
        </div>
        <ul className="m-0 flex list-disc flex-col gap-1 ps-5 text-body-sm text-[var(--color-on-surface-variant)]">
          {[...m.documentTips, m.fileRequirements].map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        {upload('front', m.documentFront)}
        <div hidden={!type?.twoSided}>{upload('back', m.documentBack)}</div>
      </div>

      {index === 2 && (
        <div className="flex flex-col gap-4">
          <section aria-labelledby={`${uid}-personal`} className="rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] px-4 py-2">
            <div className="flex items-center justify-between gap-2 pt-2">
              <h2 id={`${uid}-personal`} className="text-title-sm text-[var(--color-on-surface)]">
                {m.personalDetails}
              </h2>
              {editLink(0, m.personalDetails)}
            </div>
            <DescriptionList.Root divided>
              <DescriptionList.Item label={m.legalName}>{values.legalName.trim()}</DescriptionList.Item>
              <DescriptionList.Item label={m.dateOfBirth}>
                {values.dateOfBirth && new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(values.dateOfBirth)}
              </DescriptionList.Item>
              <DescriptionList.Item label={m.phone}>{values.phone}</DescriptionList.Item>
              <DescriptionList.Item label={m.country}>{countryName(values.country)}</DescriptionList.Item>
            </DescriptionList.Root>
          </section>
          <section aria-labelledby={`${uid}-doc`} className="rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-elevated)] px-4 py-2">
            <div className="flex items-center justify-between gap-2 pt-2">
              <h2 id={`${uid}-doc`} className="text-title-sm text-[var(--color-on-surface)]">
                {m.document}
              </h2>
              {editLink(1, m.document)}
            </div>
            <DescriptionList.Root divided>
              <DescriptionList.Item label={m.documentType}>{type?.label}</DescriptionList.Item>
              <DescriptionList.Item label={m.documentFront}>{values.front?.name}</DescriptionList.Item>
              {type?.twoSided && <DescriptionList.Item label={m.documentBack}>{values.back?.name}</DescriptionList.Item>}
            </DescriptionList.Root>
          </section>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {index > 0 && (
          <Button variant="text" size="lg" disabled={busy} onClick={() => goTo(index - 1)}>
            {m.back}
          </Button>
        )}
        <Button className="ms-auto" size="lg" loading={busy} onClick={() => void wizard.next()}>
          {index === 2 ? m.submitVerification : m.continue}
        </Button>
      </div>
    </PageFrame>
  );
});
