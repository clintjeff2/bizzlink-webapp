import countries from 'world-countries'

export interface Country {
  name: string
  code: string
  flag: string
  dialCode: string
  region: string
}

// Transform world-countries data to our format
export const allCountries: Country[] = countries.map(country => ({
  name: country.name.common,
  code: country.cca2,
  flag: country.flag,
  dialCode: country.idd.root + (country.idd.suffixes?.[0] || ''),
  region: country.region
})).sort((a, b) => a.name.localeCompare(b.name))

// Get country by code
export const getCountryByCode = (code: string): Country | undefined => {
  return allCountries.find(country => country.code === code)
}

// Get country by dial code
export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return allCountries.find(country => country.dialCode === dialCode)
}

// Popular countries (can be shown at top)
export const popularCountries = [
  'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI', 'CH'
].map(code => allCountries.find(country => country.code === code)).filter(Boolean) as Country[]
