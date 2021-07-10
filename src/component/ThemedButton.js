import "../styles/ThemedButton.css";

const ThemedButton = ({ title, onClickHandler }) => {
  return (
    <div class="btn" onClick={onClickHandler}>
      <span> {title} </span>
    </div>
  );
};

export default ThemedButton;
