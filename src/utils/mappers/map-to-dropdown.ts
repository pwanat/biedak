import { DropdownOption } from "~/models/dropdown-option"

export const mapToDropdownOption = (label: string, value: string): DropdownOption => {
  return { label, value }
}

type DropdownKeysConfig<T> = {
  labelKey: keyof T
  valueKey: keyof T
}

export const mapToDropdownOptions = <T>(
  options: T[],
  { labelKey, valueKey }: DropdownKeysConfig<T>
): DropdownOption[] => {
  return options.map(option => mapToDropdownOption(
    String(option[labelKey]),
    String(option[valueKey])
  ))
}