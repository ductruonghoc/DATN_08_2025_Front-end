//Gateway baseurl
import BASEURL from "@/src/app/api/backend/dmc_api_gateway/baseurl";
//React utils
import React, { useState } from "react";

const fetchParagraphContext = async (chunkId: number) => {
    try {
        const res = await fetch(`${BASEURL}/conversation/paragraph_context_information`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ chunk_id: chunkId }),
        });

        if (!res.ok) {
            const errorText = await res.json();
            console.error("Error fetching context information:", errorText);
            throw new Error("Failed to fetch context information");
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching paragraph context:", error);
        return null;
    }
};

const ReferencesPillButtons = ({ contextIds }: { contextIds?: number[] }) => {
    //States
    const [tooltipData, setTooltipData] = useState<{ [key: number]: any }>({});
    const [activeId, setActiveId] = useState<number | null>(null);
    const [loadingId, setLoadingId] = useState<number | null>(null); // Track loading state for specific context ID
    
    const handleButtonClick = async (contextId: number) => {
        if (activeId === contextId) {
            // Close the tooltip if the same button is clicked again
            setActiveId(null);
            return;
        }

        setActiveId(contextId);
        if (!tooltipData[contextId] && loadingId !== contextId) {
            setLoadingId(contextId); // Set loading state
            const contextInfo = await fetchParagraphContext(contextId);
            if (contextInfo) {
                console.log("Fetched context information:", contextInfo);
                setTooltipData((prev) => ({
                    ...prev,
                    [contextId]: contextInfo.data,
                }));
                console.log("Updated tooltip data:", tooltipData);
            }
            setLoadingId(null); // Clear loading state
        }
    };

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {contextIds?.map((contextId, index) => (
                <div key={contextId} className="relative group">
                    <button
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            activeId === contextId
                                ? "bg-green-500 text-white" // Active button style
                                : "bg-blue-500 text-white hover:bg-blue-600" // Default button style
                        }`}
                        onClick={() => handleButtonClick(contextId)}
                        onMouseLeave={() => setActiveId(null)}
                    >
                        Reference {index + 1}
                    </button>
                    {activeId === contextId && (
                        <div
                            className="absolute z-10 p-3 bg-white border border-gray-300 rounded shadow-lg w-64"
                            style={{
                                top: "-600%",
                                left: "70%",
                                transform: "translateX(-50%)",
                                position: "absolute", // Ensure absolute positioning
                                whiteSpace: "normal", // Prevent text overflow
                                pointerEvents: "auto", // Allow interaction with the tooltip
                            }}>
                            {loadingId === contextId ? (
                                <p>Loading...</p>
                            ) : tooltipData[contextId] ? (
                                <>
                                    <p><strong>PDF Name:</strong> {tooltipData[contextId].pdf_name}</p>
                                    <p><strong>Device Name:</strong> {tooltipData[contextId].device_name}</p>
                                    <p><strong>Page Number:</strong> {tooltipData[contextId].pdf_page_number}</p>
                                    <p>
                                        <strong>Context:</strong>
                                        <span
                                            className="block overflow-hidden text-ellipsis whitespace-nowrap line-clamp-2"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 2,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {tooltipData[contextId].chunk_context}
                                        </span>
                                    </p>
                                </>
                            ) : (
                                <p>No data available</p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReferencesPillButtons;