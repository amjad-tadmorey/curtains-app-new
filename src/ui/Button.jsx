import React from "react";

const Button = ({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    isLoadingText = "Loading...",
    rounded = "md",
    borderColor,
    disabled,
    className,
    ...props
}) => {
    const baseStyles = "font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white";

    const variantStyles = {
        primary: "bg-primary text-white hover:bg-primary-hover",
        secondary: "bg-secondary text-black hover:bg-secondary-hover",
        success: "bg-success text-black hover:bg-success-hover",
        warning: "bg-warning text-black hover:bg-warning-hover",
        dark: "bg-dark text-black hover:bg-dark-hover",
        danger: "bg-danger text-white hover:bg-danger-hover",
        light: "bg-light text-white hover:bg-light-hover",
        outline: "text-outline-text hover:bg-primary border",
    }[variant] || "";

    const borderStyles = {
        primary: "border border-primary",
        secondary: "border border-secondary",
        success: "border border-success",
        warning: "border border-warning",
        dark: "border border-dark",
        danger: "border border-danger",
        light: "border border-light",
        none: "border-none",
    }[borderColor] || "";

    const sizeStyles = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-12 py-3 text-lg",
    }[size] || "";

    const roundedStyles = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
    }[rounded] || "";

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${roundedStyles} ${borderStyles} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? isLoadingText : children}
        </button>
    );
};

export default Button;
