const ThemedButton = ({ title, onClickHandler, color, className, disabled }) => {
    return (
        <button
            className={`flex justify-between items-center text-xl py-2 px-3 rounded-xl ${color} text-white cursor-pointer ${className}`}
            disabled={disabled}
            onClick={onClickHandler}
        >
            <h1>{title}</h1>
        </button>
    );
};

export default ThemedButton;
