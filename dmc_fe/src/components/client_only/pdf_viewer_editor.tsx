'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Save } from 'lucide-react';
import { Spinner } from '../utils';
import { Document, Page, pdfjs } from 'react-pdf';
import '../../../node_modules/react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../../../node_modules/react-pdf/dist/esm/Page/TextLayer.css';
import ImageAltLabeling from '../image_alt_labeling'; // Adjust the path if needed
import { ImageItem } from '../image_alt_labeling'; // Import your ImageItem interface
import { BASE_URL } from '@/src/api/base_url';
// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfTextEditorProps {
    pdfUrl: string; // URL of the PDF document
    initialPageNumber?: number; // Optional initial page number
    initialTextContent?: string; // Optional initial text content for the text area
    images: ImageItem[]; // <-- Add this line
    pdfId: number; // <-- add this
}

const Step4PDFTextEditor: React.FC<PdfTextEditorProps> = ({
    pdfUrl,
    initialPageNumber = 1,
    initialTextContent = 'Dummy text content for the PDF page.',
    images: initialImages,
    pdfId,
}) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
    const [textAreaData, setTextAreaData] = useState<string>(initialTextContent);
    const [images, setImages] = useState<ImageItem[]>(initialImages);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [pdfLoadingError, setPdfLoadingError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [scale, setScale] = useState(1.0);
    const [showLabeling, setShowLabeling] = useState(false);

    useEffect(() => {
        setIsClient(typeof window !== "undefined");
    }, []);
    // Effect to update page number if initialPageNumber prop changes
    useEffect(() => {
            setPageNumber(initialPageNumber);
    }, [initialPageNumber]);

    // Fetch new page data when pageNumber changes
    useEffect(() => {
        if (!pdfId || !pageNumber) return;
        fetch(`${BASE_URL}/pdf_process/get_pdf_state?pdf_id=${pdfId}&page_number=${pageNumber}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setTextAreaData(data.data.pdf_paragraph.context);
                    setImages(data.data.pdf_images);
                }
            });
    }, [pdfId, pageNumber]);

    // Callback for when PDF document loads successfully
    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPdfLoadingError(null); // Clear any previous errors
        // Ensure the initial page number is valid
        setPageNumber(prev => prev > numPages ? numPages : prev);
    }, [initialPageNumber]);

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

    // Toggle editing mode for the text area
    const toggleEditing = useCallback(() => {
        if (isEditing) {
            // Save event: send POST request
            fetch(`${BASE_URL}/pdf_process/save_and_embed_paragraph`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pdf_paragraph_id: pdfId,
                    pdf_paragraph_context: textAreaData,
                }),
            })
            .then(async (res) => {
                if (!res.ok) {
                    // Try to read error message from response
                    let errorMsg = 'Unknown error';
                    try {
                        const data = await res.json();
                        errorMsg = JSON.stringify(data);
                    } catch (e) {
                        errorMsg = res.statusText;
                    }
                    console.error('Error saving paragraph:', errorMsg);
                }
            })
            .catch((err) => {
                console.error('Network error saving paragraph:', err);
            });
        }
        setIsEditing((prev) => !prev);
    }, [isEditing, pdfId, textAreaData]);

    // Handle text area content changes
    const handleTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextAreaData(e.target.value);
    }, []);

    // Zoom handlers
    const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
    const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
    const handleZoomReset = () => setScale(1.0);

    return (
        <div className="flex flex-col bg-gray-100 font-sans" style={{ height: '75vh', maxHeight: '75vh' }}>
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
                <div className="flex-[6] flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 mr-4 overflow-auto">
                    {/* Zoom controls */}
                    <div className="flex gap-2 bg-gray-50 rounded shadow mt-2"
                         >
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
                    {pdfLoadingError ? (
                        <div className="text-red-500 text-center p-4">{pdfLoadingError}</div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            {isClient ? (
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
                                <div><Spinner></Spinner>Loading PDF viewer...</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right side: Switchable Text Area or Image Labeling (3/10 width, 100% of 75vh) */}
                <div className="flex-[4] flex flex-col bg-white rounded-lg shadow-lg p-4 ml-4 overflow-auto" style={{ height: '100%', maxHeight: '100%' }}>
                    <div className="flex flex-col justify-between items-center mb-4">
                        <button
                            onClick={() => setShowLabeling((prev) => !prev)}
                            className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 flex items-center justify-center"
                        >
                            Change to {showLabeling ? "Notes" : "Labeling"}
                        </button>
                        <div className='flex items-center justify-between w-full mt-2 mb-4'>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {showLabeling ? "Image Labeling" : `Notes for Page ${pageNumber}`}
                        </h2>
                        {!showLabeling && (
                            <button
                                onClick={toggleEditing}
                                className="ml-2 p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center"
                                aria-label={isEditing ? "Save Notes" : "Edit Notes"}
                            >
                                {isEditing ? <Save size={20} /> : <Pencil size={20} />}
                            </button>
                        )}
                        </div>
                    </div>
                    {showLabeling ? (
                        <ImageAltLabeling images={images} />
                    ) : (
                        <textarea
                            className={`flex-1 w-full p-3 border rounded-md resize-none focus:outline-none transition-all duration-200
                                ${isEditing ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-300 bg-gray-50 cursor-default'}
                                text-gray-800 text-base leading-relaxed`}
                            value={textAreaData}
                            onChange={handleTextAreaChange}
                            readOnly={!isEditing}
                            placeholder="Type your notes here..."
                            aria-label="Editable text area for notes"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step4PDFTextEditor;