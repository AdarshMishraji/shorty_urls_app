import { useState } from "react";
import Typist from "react-typist";

export const TypingText = ({ children, onLineTyped }) => {
    const [isTyping, setIsTyping] = useState(true);

    const onDone = () => {
        setIsTyping(false);
        setTimeout(() => {
            setIsTyping(true);
        }, 1200);
    };

    return isTyping ? (
        <Typist onTypingDone={() => setTimeout(onDone, 1500)} onLineTyped={onLineTyped} cursor={{ show: false }}>
            {children}
        </Typist>
    ) : null;
};
