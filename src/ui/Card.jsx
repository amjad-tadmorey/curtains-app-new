import React from "react";

const Card = ({ children, className }) => {
    return <div className={`border rounded-lg shadow-md p-2 ${className}`} > {children}</div >;
};

const CardHeader = ({ children }) => {
    return <div className="font-bold mb-2 flex items-center gap-2">{children}</div>;
};

const CardBody = ({ children, cols = '3' }) => {
    return <div className={`grid grid-cols-${cols} items-center gap-x-8 gap-y-2`}>{children}</div>;
};

// Assign subcomponents to Card
Card.Header = CardHeader;
Card.Body = CardBody;

export default Card;
