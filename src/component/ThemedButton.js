const ThemedButton = ({ title, onClickHandler, color, className }) => {
    return (
        <div
            className={`flex justify-between items-center text-xl py-2 px-3 rounded-xl ${color} text-white cursor-pointer ${className}`}
            onClick={onClickHandler}
        >
            <h1>{title}</h1>
        </div>
    );
};

export default ThemedButton;
