import { useCallback, useMemo, useState, type ChangeEvent } from 'react';

// A validator receives the field's value (and all form values, for
// cross-field checks) and returns an error message, or '' when valid.
export type Validator<T> = (value: string, values: T) => string;
export type Validators<T> = Partial<Record<keyof T, Validator<T>>>;

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Reusable form state + validation.
 *
 * - `values`   current value of every field (keyed by the input's `name`)
 * - `errors`   message per field, shown only after the user has edited it
 * - `isValid`  true only when EVERY field passes its validator — use it to
 *              keep the submit button disabled
 */
export function useFormWithValidation<T extends Record<string, string>>(
  initialValues: T,
  validators: Validators<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = useCallback(
    (name: keyof T, allValues: T) => validators[name]?.(allValues[name], allValues) ?? '',
    [validators],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<FieldElement>) => {
      const name = event.target.name as keyof T;
      const nextValues = { ...values, [name]: event.target.value } as T;
      setValues(nextValues);
      setErrors((prev) => ({ ...prev, [name]: validateField(name, nextValues) }));
    },
    [values, validateField],
  );

  const isValid = useMemo(
    () => (Object.keys(values) as (keyof T)[]).every((name) => !validateField(name, values)),
    [values, validateField],
  );

  const resetForm = useCallback(
    (nextValues: T = initialValues) => {
      setValues(nextValues);
      setErrors({});
    },
    [initialValues],
  );

  return { values, errors, isValid, handleChange, resetForm };
}
