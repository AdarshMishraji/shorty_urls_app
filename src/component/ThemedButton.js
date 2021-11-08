const ThemedButton = ({ title, onClickHandler }) => {
    return (
        <div className="flex justify-between items-center text-xl py-2 px-3 rounded-xl bg-blue-800 text-white" onClick={onClickHandler}>
            <h1>{title}</h1>
        </div>
    );
};

export default ThemedButton;
