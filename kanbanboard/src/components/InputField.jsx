import PropTypes from "prop-types";

const InputField = ({label, type,name, value, onChange, placeholder}) => {
  return (
    <div className='mb-4'>
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <input 
            type={type}
        value={value}
        name={name}
            onChange={onChange}
            placeholder={placeholder}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500'/>
    </div>
  );
};

InputField.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default InputField