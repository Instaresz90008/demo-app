
import { useState, useEffect } from 'react';

interface ValidationRules {
  name: boolean;
  email: boolean;
  phone: boolean;
}

interface ValidationState {
  isValid: ValidationRules;
  errors: Partial<ValidationRules>;
  isFormValid: boolean;
}

export const useFormValidation = (name: string, email: string, phone: string) => {
  const [validation, setValidation] = useState<ValidationState>({
    isValid: { name: false, email: false, phone: false },
    errors: {},
    isFormValid: false
  });

  useEffect(() => {
    const validateName = (value: string) => value.trim().length >= 2;
    const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const validatePhone = (value: string) => value.replace(/\D/g, '').length >= 10;

    const newValidation = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone)
    };

    const newErrors: Partial<ValidationRules> = {};
    if (name && !newValidation.name) newErrors.name = true;
    if (email && !newValidation.email) newErrors.email = true;
    if (phone && !newValidation.phone) newErrors.phone = true;

    setValidation({
      isValid: newValidation,
      errors: newErrors,
      isFormValid: newValidation.name && newValidation.email && newValidation.phone
    });
  }, [name, email, phone]);

  return validation;
};
