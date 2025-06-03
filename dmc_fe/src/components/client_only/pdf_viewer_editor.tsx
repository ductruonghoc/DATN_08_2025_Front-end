'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Save, Plus, Trash2, Check } from 'lucide-react';
import { Spinner } from '../utils';
import { Document, Page, pdfjs } from 'react-pdf';
import '../../../node_modules/react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../../../node_modules/react-pdf/dist/esm/Page/TextLayer.css';
import ImageAltLabeling from '../image_alt_labeling'; // Adjust the path if needed
import { ImageItem } from '../image_alt_labeling'; // Import your ImageItem interface
import { BASE_URL } from '@/src/api/base_url';
import html2canvas from "html2canvas";

// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfTextEditorProps {
    pdfId: number;
}

const Step4PDFTextEditor: React.FC<PdfTextEditorProps> = ({ pdfId }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [textAreaData, setTextAreaData] = useState<string>('Dummy text content for the PDF page.');
    const [images, setImages] = useState<ImageItem[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [pdfLoadingError, setPdfLoadingError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [scale, setScale] = useState(1.0);
    const [showLabeling, setShowLabeling] = useState(false);
    const [pdfParagraphId, setPdfParagraphId] = useState<number | null>(null);
    const [editingChunkId, setEditingChunkId] = useState<number | null>(null);
    const [paragraphChunks, setParagraphChunks] = useState<{ id: number, value: string }[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfLoading, setPdfLoading] = useState<boolean>(true); // Add loading state

    const pdfViewerRef = useRef<HTMLDivElement>(null);
    const [snipping, setSnipping] = useState(false);
    const [snipRect, setSnipRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
    const [snipStart, setSnipStart] = useState<{ x: number; y: number } | null>(null);
    const [snipImage, setSnipImage] = useState<string | null>(null);
    const [snipReady, setSnipReady] = useState(false);
    const [snipLoading, setSnipLoading] = useState(false);
    const snipUploadAbortController = useRef<AbortController | null>(null);

    useEffect(() => {
        setIsClient(typeof window !== "undefined");
    }, []);
    // Effect to update page number if initialPageNumber prop changes
    useEffect(() => {
        setPageNumber(1);
    }, []);

    // Fetch page data whenever pdfId or pageNumber changes
    useEffect(() => {
        const fetchPageState = async () => {
            setPdfLoading(true); // Start loading
            try {
                let data;
                if (pageNumber === 1) {
                    const res = await fetch(`${BASE_URL}/pdf_process/get_pdf_initial_state?pdf_id=${pdfId}`);
                    data = await res.json();
                    if (data.success && data.data) {
                        setPdfUrl(data.data.pdf_gcs_signed_read_url);
                    }
                } else {
                    const res = await fetch(`${BASE_URL}/pdf_process/get_pdf_state?pdf_id=${pdfId}&page_number=${pageNumber}`);
                    data = await res.json();
                }
                if (data.success) {
                    setImages(data.data.images || []);
                    setParagraphChunks(
                        (data.data.page_paragraph_chunks || []).map((chunk: any) => ({
                            id: chunk.id,
                            value: chunk.context,
                        }))
                    );
                    setPdfLoadingError(null);
                } else if (data) {
                    setPdfLoadingError(data.message || "Failed to fetch PDF state.");
                }
            } catch {
                setPdfLoadingError("Failed to fetch PDF state.");
            }
            setPdfLoading(false); // End loading
        };
        fetchPageState();
        console.log('Fetching page state for PDF ID:', pdfId, 'Page Number:', pageNumber);
    }, [pdfId, pageNumber]);

    // Callback for when PDF document loads successfully
    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPdfLoadingError(null); // Clear any previous errors
        // Ensure the initial page number is valid
        setPageNumber(prev => prev > numPages ? numPages : prev);
    }, []);

    // Callback for when PDF document fails to load
    const onDocumentLoadError = useCallback((error: Error) => {
        console.error('Error loading PDF:', error);
        setPdfLoadingError('Failed to load PDF. Please check the URL or file.');
    }, []);

    // Handle page navigation
    const goToPrevPage = useCallback(() => {
        setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
    }, []);

    const goToNextPage = useCallback(() => {
        setPageNumber((prevPage) => (numPages ? Math.min(prevPage + 1, numPages) : prevPage));
    }, [numPages]);


    // Zoom handlers
    const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
    const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
    const handleZoomReset = () => setScale(1.0);

    // Handle chunk edit toggle
    const handleToggleEdit = async (id: number) => {
        if (editingChunkId === id) {
            // Save event: send POST request for this chunk
            const chunk = paragraphChunks.find(chunk => chunk.id === id);
            if (chunk) {
                try {
                    const res = await fetch(`${BASE_URL}/pdf_process/save_and_embed_paragraph`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            pdf_paragraph_id: pdfId,
                            chunk_context: chunk.value,
                            chunk_id: chunk.id,
                        }),
                    });
                    if (!res.ok) {
                        let errorMsg = 'Unknown error';
                        try {
                            const data = await res.json();
                            errorMsg = JSON.stringify(data);
                        } catch (e) {
                            errorMsg = res.statusText;
                        }
                        console.error('Error saving chunk:', errorMsg);
                    } else {
                        // Update chunk id if returned from backend
                        const data = await res.json();
                        if (data && data.data && typeof data.data.chunk_id === 'number') {
                            setParagraphChunks(prev =>
                                prev.map(c =>
                                    c.id === id ? { ...c, id: data.data.chunk_id } : c
                                )
                            );
                        }
                    }
                } catch (err) {
                    console.error('Network error saving chunk:', err);
                }
            }
            setEditingChunkId(null);
        } else {
            setEditingChunkId(id);
        }
    };

    // Delete chunk handler
    const handleDeleteChunk = async (id: number) => {
        // If chunk is not saved yet (id === -1), just remove from state
        if (id === -1) {
            setParagraphChunks(prev => prev.filter(chunk => chunk.id !== id));
            return;
        }
        // Otherwise, call backend to delete, then remove from state if successful
        try {
            const res = await fetch(`${BASE_URL}/pdf_process/delete_chunk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chunk_id: id }),
            });
            if (res.ok) {
                setParagraphChunks(prev => prev.filter(chunk => chunk.id !== id));
            } else {
                // Optionally handle error
                console.error('Failed to delete chunk');
            }
        } catch (err) {
            console.error('Network error deleting chunk:', err);
        }
    };

    useEffect(() => {
        console.log('PDF URL updated:', pdfUrl);
    }, [pdfUrl]);

    // Handle chunk value change
    const handleChunkChange = (id: number, value: string) => {
        setParagraphChunks((prev) =>
            prev.map((chunk) => (chunk.id === id ? { ...chunk, value } : chunk))
        );
    };

    // Handle add new chunk
    const handleAddChunk = () => {
        setParagraphChunks((prev) => [...prev, { id: -1, value: '' }]);
    };

    // Mouse handlers for snipping
    const handleSnipMouseDown = (e: React.MouseEvent) => {
        if (!snipping || !pdfViewerRef.current) return;
        const rect = pdfViewerRef.current.getBoundingClientRect();
        const scrollLeft = pdfViewerRef.current.scrollLeft ;
        const scrollTop = pdfViewerRef.current.scrollTop;
        const startX = (e.clientX - rect.left + scrollLeft) ;
        const startY = (e.clientY - rect.top + scrollTop) ;
        setSnipStart({ x: startX, y: startY });
        setSnipRect({ x: startX, y: startY, w: 0, h: 0 });
    };

    const handleSnipMouseMove = (e: React.MouseEvent) => {
        if (!snipping || !snipStart || !pdfViewerRef.current) return;
        const rect = pdfViewerRef.current.getBoundingClientRect();
        const scrollLeft = pdfViewerRef.current.scrollLeft;
        const scrollTop = pdfViewerRef.current.scrollTop;
        // Calculate max X/Y inside the content area
        const contentWidth = pdfViewerRef.current.clientWidth;
        const contentHeight = pdfViewerRef.current.clientHeight;
        let currX = (e.clientX - rect.left + scrollLeft);
        let currY = (e.clientY - rect.top + scrollTop);
        // Clamp to content area
        currX = Math.max(0, Math.min(currX, contentWidth));
        currY = Math.max(0, Math.min(currY, contentHeight));
        setSnipRect({
            x: Math.min(snipStart.x, currX),
            y: Math.min(snipStart.y, currY),
            w: Math.abs(currX - snipStart.x),
            h: Math.abs(currY - snipStart.y),
        });
    };

    const handleSnipMouseUp = async () => {
        setSnipStart(null);
        setSnipping(false);
        if (pdfViewerRef.current && snipRect && snipRect.w > 5 && snipRect.h > 5) {
            const canvas = await html2canvas(pdfViewerRef.current, { useCORS: true });
            // Crop the canvas to the selected area
            const cropped = document.createElement("canvas");
            cropped.width = snipRect.w;
            cropped.height = snipRect.h;
            const ctx = cropped.getContext("2d");
            if (ctx) {
                ctx.drawImage(
                    canvas,
                    snipRect.x,
                    snipRect.y,
                    snipRect.w,
                    snipRect.h,
                    0,
                    0,
                    snipRect.w,
                    snipRect.h
                );
                setSnipImage(cropped.toDataURL());
            }
        }
        setSnipRect(null);
    };

    return (
        <div className="flex flex-col bg-gray-100 font-sans" style={{ height: '75vh', maxHeight: '75vh' }}>
            {/* Whole component spinner on initial load */}
            {pdfLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
                    <Spinner />
                </div>
            )}
            {/* Header for page navigation */}
            <div className="flex items-center justify-center p-4 bg-white shadow-md rounded-b-lg mb-4">
                <button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    aria-label="Previous Page"
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="mx-4 text-lg font-medium text-gray-700">
                    Page {pageNumber} of {numPages || 'Loading...'}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={pageNumber >= (numPages || 1)}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    aria-label="Next Page"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden p-4">
                {/* Left side: PDF Viewer (7/10 width) */}
                <div
                    
                    className="flex-[6] flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 mr-4 overflow-auto relative"
                    style={{ userSelect: snipping ? "none" : undefined, cursor: snipping ? "crosshair" : undefined }}
                    onMouseDown={snipping ? handleSnipMouseDown : undefined}
                    onMouseMove={snipping && snipStart ? handleSnipMouseMove : undefined}
                    onMouseUp={snipping && snipStart ? handleSnipMouseUp : undefined}
                >
                    {/* Controls: Snip Area and Zoom, arranged in one line with space between */}
                    <div className="flex pt-10 items-center justify-between w-full ">
                        {/* Snip Area button (left) */}
                        <div className="flex items-center justify-between w-full bg-gray-50 rounded shadow mt-2 mb-4 px-2 py-1">
                            {!snipReady ? (
                                <button
                                    className={`px-3 py-1 rounded shadow flex items-center gap-2 transition-all duration-200
                                        ${snipping ? "bg-green-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                                    onClick={() => {
                                        setSnipping(true);
                                        setSnipRect(null);
                                        setSnipImage(null);
                                        setSnipReady(true);
                                    }}
                                    type="button"
                                    style={{ opacity: snipping ? 0.5 : 1, pointerEvents: snipping ? "none" : "auto" }}
                                    disabled={snipping}
                                >
                                    {snipping ? <Check size={18} className="text-white" /> : null}
                                    {snipping ? "Ready" : "Snip Area"}
                                </button>
                            ) : (
                                <button
                                    className="px-3 py-1 rounded shadow flex items-center gap-2 bg-green-500 text-white"
                                    onClick={async () => {
                                        setSnipLoading(true);
                                        snipUploadAbortController.current = new AbortController();
                                        try {
                                            // 1. Request signed_url from backend
                                            const res = await fetch(`${BASE_URL}/pdf_process/create_new_image`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    pdf_id: pdfId,
                                                    page_number: pageNumber,
                                                }),
                                                signal: snipUploadAbortController.current.signal,
                                            });
                                            const data = await res.json();
                                            if (data.success && data.data && snipImage) {
                                                // 2. Convert base64 to Blob
                                                const blob = await (await fetch(snipImage)).blob();
                                                // 3. Upload to signed_url
                                                const uploadRes = await fetch(data.data.signed_url, {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type': 'image/png',
                                                    },
                                                    body: blob,
                                                    signal: snipUploadAbortController.current.signal,
                                                });
                                                if (uploadRes.ok) {
                                                    setImages(prevImages => {
                                                        const exists = prevImages.some(img => img.id === data.data.image_id);
                                                        if (exists) return prevImages;
                                                        return [
                                                            ...prevImages,
                                                            {
                                                                id: data.data.image_id,
                                                                alt: "",
                                                                ...(data.data.sequence !== undefined ? { sequence: data.data.sequence } : {}),
                                                            } as ImageItem
                                                        ];
                                                    });
                                                } else {
                                                    alert('Failed to upload image to GCS');
                                                }
                                            }
                                        } catch (err) {
                                            if (err instanceof DOMException && err.name === 'AbortError') {
                                                // Fetch was aborted, do nothing or show a message if needed
                                            } else {
                                                alert('Error uploading image');
                                            }
                                        }
                                        setSnipReady(false);
                                        setSnipping(false);
                                        setSnipLoading(false);
                                    }}
                                    type="button"
                                    disabled={snipLoading}
                                >
                                    <Check size={18} className="text-white" />
                                    {snipLoading ? "Uploading..." : "Confirm"}
                                </button>
                            )}
                            {/* Zoom controls (right) */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleZoomOut}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    aria-label="Zoom Out"
                                >-</button>
                                <span className="px-2 text-gray-700">{Math.round(scale * 100)}%</span>
                                <button
                                    onClick={handleZoomIn}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    aria-label="Zoom In"
                                >+</button>
                                <button
                                    onClick={handleZoomReset}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    aria-label="Reset Zoom"
                                >Reset</button>
                            </div>
                        </div>
                    </div>
                    {/* PDF Document Viewer */}
                    {pdfLoadingError ? (
                        <div className="text-red-500 text-center p-4">{pdfLoadingError}</div>
                    ) : (
                        <div ref={pdfViewerRef} className="w-full h-full flex ">
                            {isClient ? (
                                pdfUrl ? (
                                    <Document
                                        file={pdfUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={onDocumentLoadError}
                                        className="max-w-full max-h-full overflow-auto"
                                    >
                                        <Page
                                            pageNumber={pageNumber}
                                            renderTextLayer={true}
                                            renderAnnotationLayer={true}
                                            className="rounded-md shadow-md"
                                            scale={scale}
                                        />
                                    </Document>
                                ) : (
                                    <div>
                                        <Spinner />
                                        <span className="ml-2">Loading PDF...</span>
                                    </div>
                                )
                            ) : (
                                <div>
                                    <Spinner />
                                    Loading PDF viewer...
                                </div>
                            )}
                        </div>
                    )}
                    {/* Snipping overlay */}
                    {snipping && snipRect && (
                        <div
                            style={{
                                position: "absolute",
                                left: snipRect.x + 12, // Adjust for p-4 padding
                                top: snipRect.y + 64,  // Adjust for p-4 padding
                                width: snipRect.w,
                                height: snipRect.h,
                                border: "2px dashed #2563eb",
                                background: "rgba(37,99,235,0.1)",
                                pointerEvents: "none",
                                zIndex: 20,
                            }}
                        />
                    )}

                    {/* Show snipped image if available */}
                    {snipImage && (
                        <div className="absolute bottom-4 left-4 z-30 bg-white p-2 rounded shadow border">
                            <img src={snipImage} alt="Snipped area" style={{ maxWidth: 200, maxHeight: 200 }} />
                            <button
                                className="block mt-2 text-xs text-blue-600 underline"
                                onClick={() => {
                                    setSnipImage(null);
                                    setSnipReady(false); // Reset snip button to original state
                                    if (snipUploadAbortController.current) {
                                        snipUploadAbortController.current.abort();
                                    }
                                }}
                                type="button"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
                {/* Right side: Switchable Text Area or Image Labeling (3/10 width, 100% of 75vh) */}
                <div className="flex-[4] flex flex-col bg-white rounded-lg shadow-lg p-4 ml-4 overflow-auto" style={{ height: '100%', maxHeight: '100%', position: 'relative' }}>
                    {/* Spinner for right side only when loading and not initial */}
                    {pdfLoading && (
                        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white bg-opacity-70">
                            <Spinner />
                        </div>
                    )}
                    <div className="flex flex-col justify-between items-center mb-4">
                        <button
                            onClick={() => setShowLabeling((prev) => !prev)}
                            className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 flex items-center justify-center"
                        >
                            Change to {showLabeling ? "Embedding" : "Labeling"}
                        </button>
                        <div className='flex items-center justify-between w-full mt-2 mb-4'>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {showLabeling ? "Image Labeling" : `Embedding for Page ${pageNumber}`}
                            </h2>
                        </div>
                    </div>
                    {showLabeling ? (
                        <ImageAltLabeling images={images} />
                    ) : (
                        <div className="w-full">
                            {paragraphChunks.map((chunk, idx) => (
                                <div key={chunk.id} className="relative mb-6">
                                    {/* Button group with padding from textarea edge and scroller */}
                                    <div className="absolute top-2 right-2 flex gap-2 pr-2 z-10">
                                        <button
                                            onClick={() => handleToggleEdit(chunk.id)}
                                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center"
                                            aria-label={editingChunkId === chunk.id ? "Save Notes" : "Edit Notes"}
                                            type="button"
                                        >
                                            {editingChunkId === chunk.id ? <Save size={20} /> : <Pencil size={20} />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteChunk(chunk.id)}
                                            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 flex items-center justify-center"
                                            aria-label="Delete Chunk"
                                            type="button"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <textarea
                                        className={`w-full h-[250px] p-3 pt-10 pb-8 border rounded-lg shadow-sm resize-vertical focus:outline-none transition-all duration-200
                                            ${editingChunkId === chunk.id ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300 bg-gray-50 cursor-default'}
                                            text-gray-800 text-base leading-relaxed custom-resize`}
                                        value={chunk.value}
                                        onChange={e => handleChunkChange(chunk.id, e.target.value)}
                                        readOnly={editingChunkId !== chunk.id}
                                        placeholder={`Chunk ${idx + 1}`}
                                        aria-label={`Editable text area for chunk ${idx + 1}`}
                                        style={{ minHeight: 80, resize: 'vertical' }}
                                    />
                                </div>
                            ))}
                            <div className="flex justify-center mt-2">
                                <button
                                    onClick={handleAddChunk}
                                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 flex items-center justify-center"
                                    aria-label="Add new chunk"
                                    type="button"
                                    disabled={paragraphChunks.some(chunk => chunk.id === -1)} // Disable if -1 chunk exists
                                >
                                    <Plus size={24} />
                                </button>
                                {paragraphChunks.some(chunk => chunk.id === -1) && (
                                    <span className="ml-4 text-sm text-red-500">
                                        Please embed (save) the current new chunk before adding another.
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step4PDFTextEditor;
