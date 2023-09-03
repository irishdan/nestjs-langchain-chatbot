import React from "react";

type Props = {
    label: string,
    className?: string,
    onClick?: () => void
}

const Button: React.FC<Props> = ({ className, label, onClick}) => {
    return (
        <button type="submit" className={`${className} bg-[#df009a] w-[100%] rounded-sm font-[12px] mx-auto py-2 text-black`} onClick={onClick} >
            { label }
        </button>
    );
};

export default Button;