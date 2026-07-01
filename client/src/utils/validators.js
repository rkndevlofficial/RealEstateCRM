export const getDigitsOnly = (value) => {
  return String(value || "").replace(/\D/g, "");
};

export const isValidIndianPhone = (phone) => {
  const digits = getDigitsOnly(phone);

  if (digits.length === 10) return true;

  if (digits.length === 12 && digits.startsWith("91")) return true;

  return false;
};

export const isValidEmail = (email) => {
  if (!email) return true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

export const validateLeadForm = (data) => {
  if (!data.name?.trim()) {
    return "Name is required";
  }

  if (data.name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!data.phone?.trim()) {
    return "Phone number is required";
  }

  if (!isValidIndianPhone(data.phone)) {
    return "Enter a valid 10 digit phone number";
  }

  if (data.email && !isValidEmail(data.email)) {
    return "Enter a valid email address";
  }

  if (data.message && data.message.length > 500) {
    return "Message should be less than 500 characters";
  }

  return null;
};

export const validateSiteVisitForm = (data) => {
  const basicError = validateLeadForm(data);

  if (basicError) {
    return basicError;
  }

  if (!data.date) {
    return "Please select site visit date";
  }

  if (!data.time) {
    return "Please select site visit time";
  }

  const selectedDate = new Date(data.date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return "Site visit date cannot be in the past";
  }

  return null;
};

export const validateProjectForm = (data) => {
  if (!data.name?.trim()) {
    return "Project name is required";
  }

  if (!data.location?.trim()) {
    return "Project location is required";
  }

  if (!data.price || Number(data.price) <= 0) {
    return "Enter a valid project price";
  }

  if (data.description && data.description.length > 2000) {
    return "Description should be less than 2000 characters";
  }

  if (data.floors && Number(data.floors) < 0) {
    return "Floors cannot be negative";
  }

  return null;
};