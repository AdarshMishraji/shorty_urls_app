import "../styles/ThemedButton.css";

const ThemedButton = ({ title, onClickHandler }) => {
  return (
    <div class="themed-btn" onClick={onClickHandler}>
      {title}
    </div>
  );
};

export default ThemedButton;
