/**
 * Mobile Money Phone Number Validation Utility
 * Validates MTN and Orange Money phone numbers by country
 */

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  countryCode: string;
  mtnPrefixes: string[];
  orangePrefixes: string[];
  phoneLength: number;
  format: string;
  example: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  formattedNumber?: string;
  provider?: "mtn" | "orange";
}

// Country configurations for mobile money validation
export const MOBILE_MONEY_COUNTRIES: Record<string, CountryConfig> = {
  "+237": {
    code: "+237",
    name: "Cameroon",
    flag: "🇨🇲",
    countryCode: "CM",
    mtnPrefixes: ["67", "68", "650", "651", "652", "653", "654"],
    orangePrefixes: ["69", "655", "656", "657", "658", "659"],
    phoneLength: 9,
    format: "X XX XX XX XX",
    example: "6 71 23 45 67",
  },
  "+225": {
    code: "+225",
    name: "Ivory Coast",
    flag: "🇨🇮",
    countryCode: "CI",
    mtnPrefixes: ["05", "06", "46", "47", "48", "49", "56", "57"],
    orangePrefixes: ["07", "08", "09", "67", "68", "69", "77", "78", "79"],
    phoneLength: 10,
    format: "XX XX XX XX XX",
    example: "05 12 34 56 78",
  },
  "+233": {
    code: "+233",
    name: "Ghana",
    flag: "🇬🇭",
    countryCode: "GH",
    mtnPrefixes: ["024", "054", "055", "059"],
    orangePrefixes: [], // Orange doesn't operate in Ghana
    phoneLength: 9,
    format: "XXX XXX XXX",
    example: "024 123 456",
  },
  "+256": {
    code: "+256",
    name: "Uganda",
    flag: "🇺🇬",
    countryCode: "UG",
    mtnPrefixes: ["077", "078", "039"],
    orangePrefixes: ["030", "031"], // Orange Uganda
    phoneLength: 9,
    format: "XXX XXX XXX",
    example: "077 123 456",
  },
  "+250": {
    code: "+250",
    name: "Rwanda",
    flag: "🇷🇼",
    countryCode: "RW",
    mtnPrefixes: ["078", "079"],
    orangePrefixes: [], // Orange doesn't operate in Rwanda
    phoneLength: 9,
    format: "XXX XXX XXX",
    example: "078 123 456",
  },
  "+234": {
    code: "+234",
    name: "Nigeria",
    flag: "🇳🇬",
    countryCode: "NG",
    mtnPrefixes: [
      "0803",
      "0806",
      "0813",
      "0816",
      "0903",
      "0906",
      "0913",
      "0916",
      "07025",
      "07026",
    ],
    orangePrefixes: [], // Orange doesn't operate in Nigeria
    phoneLength: 10,
    format: "XXXX XXX XXX",
    example: "0803 123 456",
  },
  "+260": {
    code: "+260",
    name: "Zambia",
    flag: "🇿🇲",
    countryCode: "ZM",
    mtnPrefixes: ["096", "097"],
    orangePrefixes: [], // Orange doesn't operate in Zambia
    phoneLength: 9,
    format: "XXX XXX XXX",
    example: "096 123 456",
  },
  "+27": {
    code: "+27",
    name: "South Africa",
    flag: "🇿🇦",
    countryCode: "ZA",
    mtnPrefixes: ["083", "084"],
    orangePrefixes: [], // Orange doesn't operate in South Africa
    phoneLength: 9,
    format: "XXX XXX XXX",
    example: "083 123 456",
  },
  "+221": {
    code: "+221",
    name: "Senegal",
    flag: "🇸🇳",
    countryCode: "SN",
    mtnPrefixes: [], // MTN doesn't operate in Senegal
    orangePrefixes: ["77", "78", "70"],
    phoneLength: 9,
    format: "XX XXX XX XX",
    example: "77 123 45 67",
  },
  "+226": {
    code: "+226",
    name: "Burkina Faso",
    flag: "🇧🇫",
    countryCode: "BF",
    mtnPrefixes: [], // MTN doesn't operate in Burkina Faso
    orangePrefixes: ["70", "76", "77", "78"],
    phoneLength: 8,
    format: "XX XX XX XX",
    example: "70 12 34 56",
  },
  "+223": {
    code: "+223",
    name: "Mali",
    flag: "🇲🇱",
    countryCode: "ML",
    mtnPrefixes: [], // MTN doesn't operate in Mali
    orangePrefixes: ["77", "78", "79"],
    phoneLength: 8,
    format: "XX XX XX XX",
    example: "77 12 34 56",
  },
  "+227": {
    code: "+227",
    name: "Niger",
    flag: "🇳🇪",
    countryCode: "NE",
    mtnPrefixes: [], // MTN doesn't operate in Niger
    orangePrefixes: ["96", "97", "98"],
    phoneLength: 8,
    format: "XX XX XX XX",
    example: "96 12 34 56",
  },
  "+33": {
    code: "+33",
    name: "France",
    flag: "🇫🇷",
    countryCode: "FR",
    mtnPrefixes: [], // MTN doesn't operate in France
    orangePrefixes: ["06", "07"], // Orange mobile prefixes in France
    phoneLength: 9,
    format: "X XX XX XX XX",
    example: "6 12 34 56 78",
  },
};

/**
 * Get available countries for a specific provider
 */
export function getAvailableCountries(
  provider: "mtn_momo" | "orange_momo"
): CountryConfig[] {
  return Object.values(MOBILE_MONEY_COUNTRIES).filter((country) => {
    if (provider === "mtn_momo") {
      return country.mtnPrefixes.length > 0;
    } else {
      return country.orangePrefixes.length > 0;
    }
  });
}

/**
 * Check if a provider is available in a specific country
 */
export function isProviderAvailableInCountry(
  countryCode: string,
  provider: "mtn_momo" | "orange_momo"
): boolean {
  const country = MOBILE_MONEY_COUNTRIES[countryCode];
  if (!country) return false;

  if (provider === "mtn_momo") {
    return country.mtnPrefixes.length > 0;
  } else {
    return country.orangePrefixes.length > 0;
  }
}

/**
 * Validate phone number for mobile money payment
 */
export function validateMobileMoneyPhone(
  phoneNumber: string,
  countryCode: string,
  provider: "mtn_momo" | "orange_momo"
): ValidationResult {
  // Get country configuration
  const country = MOBILE_MONEY_COUNTRIES[countryCode];
  if (!country) {
    return {
      isValid: false,
      error: "Unsupported country code",
    };
  }

  // Check if provider is available in this country
  if (!isProviderAvailableInCountry(countryCode, provider)) {
    const providerName =
      provider === "mtn_momo" ? "MTN Mobile Money" : "Orange Money";
    return {
      isValid: false,
      error: `${providerName} is not available in ${country.name}`,
    };
  }

  // Clean phone number (remove spaces, dashes, etc.)
  const cleanedPhone = phoneNumber.replace(/\D/g, "");

  // Check length
  if (cleanedPhone.length !== country.phoneLength) {
    return {
      isValid: false,
      error: `Phone number must be ${country.phoneLength} digits for ${country.name}. Example: ${country.example}`,
    };
  }

  // Get appropriate prefixes
  const prefixes =
    provider === "mtn_momo" ? country.mtnPrefixes : country.orangePrefixes;

  // Check if phone number starts with valid prefix
  const hasValidPrefix = prefixes.some((prefix) =>
    cleanedPhone.startsWith(prefix)
  );

  if (!hasValidPrefix) {
    const providerName = provider === "mtn_momo" ? "MTN" : "Orange";
    const validPrefixes = prefixes.join(", ");
    return {
      isValid: false,
      error: `Invalid ${providerName} number for ${country.name}. Valid prefixes: ${validPrefixes}`,
    };
  }

  // Format the phone number for display
  const formattedNumber = formatPhoneNumber(cleanedPhone, country);

  return {
    isValid: true,
    formattedNumber,
    provider: provider === "mtn_momo" ? "mtn" : "orange",
  };
}

/**
 * Format phone number according to country format
 */
export function formatPhoneNumber(
  phoneNumber: string,
  country: CountryConfig
): string {
  const cleaned = phoneNumber.replace(/\D/g, "");
  let formatted = "";
  let phoneIndex = 0;

  for (
    let i = 0;
    i < country.format.length && phoneIndex < cleaned.length;
    i++
  ) {
    if (country.format[i] === "X") {
      formatted += cleaned[phoneIndex];
      phoneIndex++;
    } else {
      formatted += country.format[i];
    }
  }

  return formatted;
}

/**
 * Get suggested phone format for a country
 */
export function getPhoneFormat(countryCode: string): string {
  const country = MOBILE_MONEY_COUNTRIES[countryCode];
  return country ? country.format : "XXX XXX XXX";
}

/**
 * Get example phone number for a country and provider
 */
export function getExamplePhoneNumber(
  countryCode: string,
  provider: "mtn_momo" | "orange_momo"
): string {
  const country = MOBILE_MONEY_COUNTRIES[countryCode];
  if (!country) return "";

  const prefixes =
    provider === "mtn_momo" ? country.mtnPrefixes : country.orangePrefixes;
  if (prefixes.length === 0) return "";

  // Use the first available prefix to create an example
  const prefix = prefixes[0];
  const remainingDigits = country.phoneLength - prefix.length;
  const exampleSuffix = "123456789".substring(0, remainingDigits);
  const exampleNumber = prefix + exampleSuffix;

  return formatPhoneNumber(exampleNumber, country);
}

/**
 * Auto-detect provider based on phone number and country
 */
export function detectProvider(
  phoneNumber: string,
  countryCode: string
): "mtn_momo" | "orange_momo" | null {
  const country = MOBILE_MONEY_COUNTRIES[countryCode];
  if (!country) return null;

  const cleanedPhone = phoneNumber.replace(/\D/g, "");

  // Check MTN prefixes first
  const isMtn = country.mtnPrefixes.some((prefix) =>
    cleanedPhone.startsWith(prefix)
  );
  if (isMtn) return "mtn_momo";

  // Check Orange prefixes
  const isOrange = country.orangePrefixes.some((prefix) =>
    cleanedPhone.startsWith(prefix)
  );
  if (isOrange) return "orange_momo";

  return null;
}

/**
 * Get full international phone number
 */
export function getFullPhoneNumber(
  phoneNumber: string,
  countryCode: string
): string {
  const cleaned = phoneNumber.replace(/\D/g, "");
  return `${countryCode}${cleaned}`;
}

/**
 * Validate and format mobile money payment details
 */
export function validateMobileMoneyPayment(
  phoneNumber: string,
  countryCode: string,
  provider: "mtn_momo" | "orange_momo"
): {
  isValid: boolean;
  error?: string;
  formattedPhone?: string;
  fullPhoneNumber?: string;
  detectedProvider?: "mtn_momo" | "orange_momo";
} {
  const validation = validateMobileMoneyPhone(
    phoneNumber,
    countryCode,
    provider
  );

  if (!validation.isValid) {
    return {
      isValid: false,
      error: validation.error,
    };
  }

  const cleanedPhone = phoneNumber.replace(/\D/g, "");
  const detectedProvider = detectProvider(phoneNumber, countryCode);

  return {
    isValid: true,
    formattedPhone: validation.formattedNumber,
    fullPhoneNumber: getFullPhoneNumber(cleanedPhone, countryCode),
    detectedProvider: detectedProvider || provider,
  };
}
