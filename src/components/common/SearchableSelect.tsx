import { useField } from 'formik';
import { capitalize } from 'lodash';
import Select, { Props as SelectProps, SingleValue, MultiValue } from 'react-select';

type OptionType = {
    value: string;
    label: string;
};

interface SearchableSelectProps {
    id: string;
    label: string;
    name: string;
    options: OptionType[];
    selectProps?: Partial<SelectProps<OptionType>>;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ id, label, name, options, selectProps }) => {
    const [field, meta, helpers] = useField<string>(name);

    const handleChange = (option: SingleValue<OptionType> | MultiValue<OptionType>) => {
        if (!option || Array.isArray(option)) {
            helpers.setValue('');
        } else {
            helpers.setValue((option as OptionType).value);
        }
    };

    const selectedOption = options.find((opt) => opt.value === field.value) || null;

    return (
        <>
            <label htmlFor={id} className="block mb-1.5 font-medium">
                {label}
            </label>
            <Select
                inputId={id}
                placeholder="Select an option"
                options={options}
                name={name}
                value={selectedOption}
                onChange={handleChange}
                onBlur={() => helpers.setTouched(true)}
                {...selectProps}
                className={`!mt-0 ${meta.touched && meta.error ? 'border-red-500 bg-red-100' : ''}`}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        border: meta.touched && meta.error ? '1px solid #ef4444' : '1px solid #e0e6ed',
                        borderRadius: '0.375rem',
                        padding: '0px',
                        boxShadow: state.isFocused ? '0 0 0 1px #4361ee' : undefined,
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? '#e0e6ed' : 'white',
                        color: state.isSelected ? '#4361ee' : 'black',
                    }),
                }}
            />
            {meta.touched && meta.error ? <div className="text-red-500 text-sm !mt-1">{meta.error}</div> : null}
        </>
    );
};
