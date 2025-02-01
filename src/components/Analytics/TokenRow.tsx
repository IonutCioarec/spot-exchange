import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { useMobile } from "utils/responsive";

const TokenRow = ({ items }: { items: { label: string; value: string, icon: JSX.Element | string, isImage: boolean }[] }) => {
  const isMobile = useMobile();
  
  return (
    <div className="w-full py-2 d-flex justify-content-between align-items-center">
      {/* <div className="arrow-box">
        <p className="text-center font-size-sm my-2 font-rose text-white">
          DEX Token Details
        </p>
      </div> */}
      <Marquee gradient={true} speed={50} pauseOnHover={true} autoFill={true} gradientColor={'rgba(20, 20, 20, 1)'} gradientWidth={'20px'}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`text-white ${isMobile ? 'px-3' : 'px-4'} py-1 rounded-lg text-sm mx-2`}
            style={{zIndex: 2}}
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
