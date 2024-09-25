import { useState } from 'react';
import Select from 'react-select';

const Combobox = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
  ];

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    control: (provided, state) => ({
      ...provided,
      width: '100%',
      borderRadius: '0.5rem', 
      borderColor: '#D1D5DB', 
      boxShadow: state.isFocused ? 'none' : provided.boxShadow, 
      '&:hover': {
        borderColor: '#D1D5DB', 
      },
    }),
  };

  return (
    <div className="w-full">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder="Select a fruit..."
        classNamePrefix="react-select"
        styles={customStyles} 
        isClearable
        isSearchable 
      />
    </div>
  );
};

export default Combobox;
