import React from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface NavbarProps {
  userLang: string;
  setUserLang: (value: string) => void;
  userTheme: string;
  setUserTheme: (value: string) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
}

// Custom styles for react-select to mimic the provided CSS using inline style overrides
const customSelectStyles = {
  container: (provided: any) => ({
    ...provided,
    width: '120px',
    color: 'black',
    backgroundColor: 'white',
  }),
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'while',
    borderColor: '#afec3f',
  }),
};

const Navbar: React.FC<NavbarProps> = ({
  userLang,
  setUserLang,
}) => {
  const languages: Option[] = [
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
  ];

  return (
    <div className="flex items-center h-[50px] text-center text-[#afec3f] bg-[#474747] gap-10 m-5 p-5">
      <h1>JavaNotebook</h1>
      <Select
        styles={customSelectStyles}
        options={languages}
        value={languages.find((option) => option.value === userLang)}
        onChange={(selectedOption) => {
          if (selectedOption) {
            setUserLang(selectedOption.value);
          }
        }}
        placeholder={userLang}
      />
    </div>
  );
};

export default Navbar;
