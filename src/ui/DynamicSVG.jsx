import React from "react";

const DynamicSVG = ({ svgData }) => {
    return (
        <svg
            width={svgData.props.width}
            height={svgData.props.height}
            viewBox={svgData.props.viewBox}
            xmlns={svgData.props.xmlns}
        >
            {svgData.props.children?.map((child, i) => (
                React.createElement(child.type, { key: i, ...child.props }, child.props.children)
            ))}
        </svg>
    );
};

export default DynamicSVG
