"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { allCountries, popularCountries, type Country } from "@/lib/countries"
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  onCountryChange?: (country: Country) => void
  placeholder?: string
  className?: string
}

export default function PhoneInput({ 
  value, 
  onChange, 
  onCountryChange, 
  placeholder = "Enter phone number",
  className 
}: PhoneInputProps) {
  const [open, setOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    allCountries.find(c => c.code === 'US') || allCountries[0]
  )
  const [phoneNumber, setPhoneNumber] = useState("")

  // Parse existing value if any
  const handleValueChange = useCallback((newValue: string) => {
    setPhoneNumber(newValue)
    const fullNumber = selectedCountry.dialCode + newValue
    onChange(fullNumber)
  }, [selectedCountry.dialCode, onChange])

  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country)
    setOpen(false)
    onCountryChange?.(country)
    
    // Update the full phone number with new country code
    const fullNumber = country.dialCode + phoneNumber
    onChange(fullNumber)
  }, [phoneNumber, onChange, onCountryChange])

  const isValid = phoneNumber ? isValidPhoneNumber(selectedCountry.dialCode + phoneNumber) : true

  return (
    <div className={cn("flex", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[180px] justify-between rounded-r-none border-r-0 h-12"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm text-gray-600">{selectedCountry.dialCode}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup heading="Popular">
                {popularCountries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.dialCode}`}
                    onSelect={() => handleCountrySelect(country)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="mr-2 text-lg">{country.flag}</span>
                    <span className="flex-1">{country.name}</span>
                    <span className="text-sm text-gray-500">{country.dialCode}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="All Countries">
                {allCountries.filter(country => !popularCountries.some(p => p.code === country.code)).map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.dialCode}`}
                    onSelect={() => handleCountrySelect(country)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="mr-2 text-lg">{country.flag}</span>
                    <span className="flex-1">{country.name}</span>
                    <span className="text-sm text-gray-500">{country.dialCode}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <div className="relative flex-1">
        <Input
          type="tel"
          placeholder={placeholder}
          value={phoneNumber}
          onChange={(e) => handleValueChange(e.target.value)}
          className={cn(
            "rounded-l-none h-12 pl-10",
            !isValid && phoneNumber && "border-red-500 focus:border-red-500"
          )}
        />
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        {!isValid && phoneNumber && (
          <p className="text-xs text-red-500 mt-1">Please enter a valid phone number</p>
        )}
      </div>
    </div>
  )
}
