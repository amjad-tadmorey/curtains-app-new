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
    setEditId,
    name,
    children,
    shape = "rounded",
    position = "center",
    shadow = "md",
    width = "auto",
    closeButtonPosition = "top-right"
}) => {
    const context = useContext(ModalContext);
    const isControlled = !!context; // Check if inside ModalContext
    const [isOpen, setIsOpen] = useState(!isControlled); // Default open if uncontrolled

    const { openName, close } = context || {}; // Get context values or undefined

    // Determine if the modal should be shown
    const shouldShow = isControlled ? openName === name : isOpen;

    if (!shouldShow) return null;

    // Close function (handles both controlled & uncontrolled usage)
    const handleClose = () => {
        if (isControlled) {
            close();
        } else {
            setIsOpen(false);
            setEditId(null)
        }
    };

    return (
        <div
            className={`left-[2%] fixed z-[999999999999999] ${position === "center" ? "top-1/2 transform  -translate-y-1/2" : ""}
            ${shape === "rounded" ? "rounded-lg" : "rounded-none"} p-6 bg-white ${shadow === "md" ? "shadow-md" : "shadow-sm"} 
            border border-gray-300 max-w-max w-auto transition-transform duration-300 scale-100 opacity-100`}
            style={{ width }}
        >
            <button
                className={`absolute cursor-pointer ${closeButtonPosition === "top-right" ? "top-4 right-4" : "top-4 left-4"} 
                text-white bg-primary w-6 h-6 rounded-full`}
                onClick={() => {
                    if (window.confirm('Are you sure you want to discard the order?')) {
                        handleClose();
                    }
                }}
            >
                ×
            </button>

            <div onClick={(e) => e.stopPropagation()}>
                {isValidElement(children) ? cloneElement(children, { close: handleClose }) : children}
            </div>
        </div>
    );
};



// Attach Open and Window components to Modal
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
