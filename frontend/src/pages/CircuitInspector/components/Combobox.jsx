import Select from 'react-select';
import classnames from 'classnames';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#2F2F2F',
    borderColor: '#686868',
    color: '#FFFFFF',
    fontSize: '13px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#FFFFFF',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#2F2F2F',
    fontSize: '13px',

  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#FFFFFF' : '#FFFFFF',
    backgroundColor: state.isSelected ? '#686868' : '#2F2F2F',
    '&:hover': {
      backgroundColor: '#686868', 
      color: '#FFFFFF',
    },
  }),
};

const ComboBox = () => (
  <Select
    options={options}
    styles={customStyles}
    className={classnames('w-full')}
    classNamePrefix="react-select"
  />
);

export default ComboBox;
