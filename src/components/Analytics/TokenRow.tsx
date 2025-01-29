import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const tickerItems = [
  { label: 'Token', value: 'ABC' },
  { label: 'Supply', value: '100.23' },
  { label: 'Burned', value: '25k' },
  { label: 'Liquidity', value: '$500k' },
  { label: 'Holders', value: '10,345' },
  { label: 'Holders', value: '10,345' },
  { label: 'Holders', value: '10,345' },
];

const TokenRow = ({ items }: { items: { label: string; value: string, icon: JSX.Element | string, isImage: boolean }[] }) => {
  return (
    <div className="w-full py-2">
      <Marquee gradient={false} speed={50} pauseOnHover={true}>
        {items.map((item, index) => (
          <div
            key={index}
            className="text-white px-4 py-1 rounded-lg text-sm mx-2"
          >
            <div className="d-flex align-items-center justify-content-between">              
              {item.isImage ? (
                typeof item.icon === "string" ? (
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="d-inline"
                    style={{
                      width: 30,
                      height: 30,
                      border: "1px solid rgba(90, 214, 121, 1)",
                      borderRadius: "20px",
                    }}
                  />
                ) : null
              ) : (
                item.icon
              )}
              <div className="ms-2">
                <p className="mb-0 font-size-xs text-silver">{item.label}</p>
                <p className="mb-0 font-size-sm m-t-n-xxs">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default TokenRow;
