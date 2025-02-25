import React from "react";

interface ButtonProps {
  deviceOn: boolean;
  onClick: () => void;
  bgColor?: string;
  hoverColor?: string;
  activeColor?: string;
  textColor?: string;
  disabledTextColor?: string;
  children: React.ReactNode;
}

const MqttButton: React.FC<ButtonProps> = ({
  deviceOn,
  onClick,
  bgColor = "bg-gray-900", // Color de fondo por defecto
  hoverColor = "hover:bg-gray-800", // Color de hover por defecto
  activeColor = "active:bg-gray-950", // Color de active por defecto
  textColor = "text-white", // Color de texto por defecto
  disabledTextColor = "text-gray-400", // Color de texto cuando está deshabilitado
  children
}) => {
  return (
    <button
      disabled={!deviceOn}
      onClick={onClick}
      className={`w-full inline-flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium shadow-sm transition-colors ${
        deviceOn === false
          ? `bg-gray-300 ${disabledTextColor} cursor-not-allowed`
          : `${bgColor} ${textColor} ${hoverColor} ${activeColor}`
      }`}
    >
      {children}
    </button>
  );
};

export default MqttButton;
