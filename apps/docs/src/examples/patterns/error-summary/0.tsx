import * as React from 'react';
import { type FormErrorMap, useFormErrors, ErrorSummary } from '@nexub/patterns';
import { Label, Input, FormError, Button } from '@nexub/react';

export default function Example() {
  const [submitted, setSubmitted] = React.useState<FormErrorMap>({});
  const { errors, fieldProps, errorProps } = useFormErrors(submitted);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitted({
      'es-name': String(data.get('name')).trim() ? undefined : 'Enter your name',
      'es-email': /^\S+@\S+\.\S+$/.test(String(data.get('email'))) ? undefined : 'Enter an email address, like name@example.com',
    });
  };
  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-3 items-stretch w-[340px]">
      <ErrorSummary errors={errors} />
      <div className="flex flex-col gap-1 items-stretch">
        <Label htmlFor="es-name">Name</Label>
        <Input name="name" {...fieldProps('es-name')} invalid={Boolean(submitted['es-name'])} />
        {submitted['es-name'] && <FormError {...errorProps('es-name')}>{submitted['es-name']}</FormError>}
      </div>
      <div className="flex flex-col gap-1 items-stretch">
        <Label htmlFor="es-email">Email</Label>
        <Input name="email" type="email" {...fieldProps('es-email')} invalid={Boolean(submitted['es-email'])} />
        {submitted['es-email'] && <FormError {...errorProps('es-email')}>{submitted['es-email']}</FormError>}
      </div>
      <Button type="submit">Create account</Button>
    </form>
  );
}
