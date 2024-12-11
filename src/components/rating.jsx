'use client'
import React, { useState, useEffect } from "react";
import { string, number, func, bool } from "prop-types";

const IconComponent = ({ type, width, height }) => {
    const imageDataSource = {
        ratingHighlighted: (
            <svg
                width={width}
                height={height}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 4.5L14.3175 9.195L19.5 9.9525L15.75 13.605L16.635 18.765L12 16.3275L7.365 18.765L8.25 13.605L4.5 9.9525L9.6825 9.195L12 4.5Z"
                    fill="#EBC03F"
                    stroke="#EBC03F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),

        ratingDefault: (
            <svg
                width={width}
                height={height}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12.1053 3.68421L14.7074 8.95579L20.5263 9.80632L16.3158 13.9074L17.3095 19.7011L12.1053 16.9642L6.90105 19.7011L7.89473 13.9074L3.6842 9.80632L9.50315 8.95579L12.1053 3.68421Z"
                    fill="#FCFBF8"
                    stroke="#E2E0DA"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    };

    return imageDataSource[type];
};

const SIZES = {
    SMALL: {
        key: "s",
        size: 12
    },
    MEDIUM: {
        key: "m",
        size: 18
    },
    LARGE: {
        key: "l",
        size: 28
    },
    SUPERLARGE: {
        key: "xl",
        size: 40
    },
};

const OUT_OF_VALUE = 5;

const Rating = (props) => {
    const {
        iconSize,
        showOutOf,
        enableUserInteraction,
        onClick,
        value, // Sử dụng value trực tiếp thay vì ratingInPercent
    } = props;

    const [activeStar, setActiveStar] = useState(value || 0);  // Khởi tạo activeStar từ value prop

    const numberOfStar = OUT_OF_VALUE;
    const size =
        iconSize === SIZES.SMALL.key
            ? SIZES.SMALL.size
            : iconSize === SIZES.MEDIUM.key
                ? SIZES.MEDIUM.size
                : iconSize === SIZES.LARGE.key
                    ? SIZES.LARGE.size : SIZES.SUPERLARGE.size;

    const RatingHighlighted = (
        <IconComponent type={"ratingHighlighted"} width={size} height={size} />
    );
    const RatingDefault = (
        <IconComponent type={"ratingDefault"} width={size} height={size} />
    );

    const handleClick = (index) => {
        onClick(index + 1);
        setActiveStar(index + 1);
    };

    const showDefaultStar = (index) => {
        return RatingDefault;
    };

    // Tính toán phần sao chưa hoàn thành (fraction) nếu có
    const fraction = activeStar % 1; // Phần thập phân của activeStar
    const fractionPercent = fraction * 100;  // Phần trăm sao còn lại

    const getStar = (index) => {
        if (index < Math.floor(activeStar)) {
            return "100%";  // Sao vàng đầy đủ
        } else if (index === Math.floor(activeStar) && fraction > 0) {
            return `${fractionPercent}%`;  // Sao vàng một phần (nếu có)
        } else {
            return "0%";  // Sao chưa được tô
        }
    };

    const isShowOutOfStar = (index) => {
        if (showOutOf) {
            return showOutOf;
        }
        return index < activeStar;
    };

    const withoutUserInteraction = (index) => {
        return isShowOutOfStar(index) ? (
            <div style={{ position: "relative" }} key={index}>
                <div
                    style={{
                        width: getStar(index),
                        overflow: "hidden",
                        position: "absolute"
                    }}
                >
                    {RatingHighlighted}
                </div>
                {showDefaultStar()}
            </div>
        ) : null;
    };

    const withUserInteraction = (index) => {
        return (
            <div
                style={{ position: "relative" }}
                onClick={() => handleClick(index)}
                key={index}
            >
                <div
                    style={{
                        width: index < activeStar ? "100%" : "0%",
                        overflow: "hidden",
                        position: "absolute"
                    }}
                >
                    {RatingHighlighted}
                </div>
                {showDefaultStar()}
            </div>
        );
    };

    // Cập nhật activeStar khi value thay đổi
    useEffect(() => {
        setActiveStar(value || 0);
    }, [value]);

    return (
        <div className="flex items-center gap-2 cursor-pointer text-left">
            {[...new Array(numberOfStar)].map((arr, index) =>
                enableUserInteraction
                    ? withUserInteraction(index)
                    : withoutUserInteraction(index)
            )}
        </div>
    );
};

Rating.propTypes = {
    iconSize: string,
    showOutOf: bool.isRequired,
    enableUserInteraction: bool.isRequired,
    onClick: func,
    value: number.isRequired,  // Sử dụng value thay vì ratingInPercent
};

Rating.defaultProps = {
    iconSize: SIZES.LARGE.key,
    onClick: () => null,
    showOutOf: false,
    enableUserInteraction: false,
};

export default Rating;
