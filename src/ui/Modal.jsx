import React, { useContext, createContext, useState, cloneElement, isValidElement } from "react";

// Modal Context to manage modal state
const ModalContext = createContext(undefined);

const Modal = ({ children, overlayType = "blur", overlayColor = "rgba(0, 0, 0, 0.5)" }) => {
    const [openName, setOpenName] = useState("");

    const close = () => setOpenName("");
    const open = (name) => setOpenName(name);

    const overlayStyles = overlayType === "blur" ? "backdrop-blur-sm" : `bg-${overlayColor}`;

    const handleOuterClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) close();
    };

    return (
        <ModalContext.Provider value={{ openName, close, open }}>
            {children}
            {openName && (
                <div
                    className={`fixed h-screen w-screen inset-0 z-50 ${overlayStyles} transition-all modal-overlay`}
                    onClick={handleOuterClick}
                >
                    <div className="absolute inset-0 z-40 modal-overlay"></div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

// Open component to trigger modal opening
const Open = ({ children, opens }) => {
    const context = useContext(ModalContext);
    if (!context) return null;
    const { open } = context;
    return cloneElement(children, { onClick: () => open(opens) });
};

// Window component to display modal content
const Window = ({
    name,
    children,
    shape = "rounded",
    position = "center",
    shadow = "md",
    width = "auto",
    closeButtonPosition = "top-right"
}) => {
    const context = useContext(ModalContext);
    if (!context) return null;
    const { openName, close } = context;

    if (name !== openName) return null;

    const shapeStyles = {
        square: "rounded-none",
        rounded: "rounded-lg",
        pill: "rounded-full",
    };

    const positionStyles = {
        center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        top: "top-20 left-1/2 transform -translate-x-1/2",
        bottom: "bottom-20 left-1/2 transform -translate-x-1/2",
    };

    const shadowStyles = {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
    };

    const closeButtonPositionStyles = {
        "top-left": "top-4 left-4",
        "top-right": "top-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "bottom-right": "bottom-4 right-4",
    };

    return (
        <div
            className={`fixed z-[999999999999999] ${positionStyles[position]} ${shapeStyles[shape]} p-6 bg-white ${shadowStyles[shadow]} border border-gray-300 max-w-max w-auto`}
            style={{ width }}
        >
            <button
                className={`absolute cursor-pointer ${closeButtonPositionStyles[closeButtonPosition]} text-white bg-primary w-6 h-6 rounded-full`}
                onClick={close}
            >
                ×
            </button>

            <div onClick={(e) => e.stopPropagation()}>
                {isValidElement(children) ? cloneElement(children, { close }) : null}
            </div>
        </div>
    );
};

// Attach Open and Window components to Modal
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
