"use client";

import { InlineWidget } from "react-calendly";

interface CalendlyWidgetProps {
  url: string;
  prefill?: {
    email?: string;
    name?: string;
  };
}

const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({ url, prefill }) => {
  const inlineWidgetStyles = {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  };

  return (
    <InlineWidget
      url={url}
      styles={inlineWidgetStyles}
      prefill={{
        name: prefill?.name || "",
        email: prefill?.email || "",
      }}
      pageSettings={{
        backgroundColor: 'ffffff',
       
      }}
    />
  );
};

export default CalendlyWidget;
