const Header = ({ navText, onNavClick }) => {
    return (
        <header>
            <h1> Shorty URLs </h1>
            {(navText || onNavClick) && (
                <div class="nav">
                    <p onClick={onNavClick}>{navText}</p>
                </div>
            )}
        </header>
    );
};

export default Header;
