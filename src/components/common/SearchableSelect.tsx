import React from "react";
import Select from "react-select";
import { useField } from "formik";

export type OptionType = {
  value: string;
  label: string;
};

export interface SearchableSelectProps {
  id: string;
  name: string;
  label: string;
  disabled?: boolean;
  options: OptionType[];
  onChange?: (option: OptionType | null) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  name,
  label,
  options,
  disabled = false,
  onChange,
}) => {
  const [field, , helpers] = useField(name);

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 text-sm font-medium">
        {label}
      </label>
      <Select
        inputId={id}
        options={options}
        value={options.find((opt) => opt.value === field.value) || null}
        isDisabled={disabled}
        onChange={(option) => {
          helpers.setValue((option as OptionType)?.value || "");
          if (onChange) onChange(option as OptionType | null);
        }}
        onBlur={() => helpers.setTouched(true)}
      />
    </div>
  );
};
