import PropTypes from "prop-types";

const Button = ({text, onClick}) => {
  return (
    <button
        onClick={onClick}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
            {text}
    </button>
  )
}

Button.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    text: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
};

export default Button