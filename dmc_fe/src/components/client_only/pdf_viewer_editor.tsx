'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Save } from 'lucide-react';
import { Spinner } from '../utils';
import { Document, Page, pdfjs } from 'react-pdf';
import '../../../node_modules/react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../../../node_modules/react-pdf/dist/esm/Page/TextLayer.css';

// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfTextEditorProps {
    pdfUrl: string; // URL of the PDF document
    initialPageNumber?: number; // Optional initial page number
    initialTextContent?: string; // Optional initial text content for the text area
}

const Step4PDFTextEditor: React.FC<PdfTextEditorProps> = ({
    pdfUrl,
    initialPageNumber = 1,
    initialTextContent = 'Dummy text content for the PDF page.',
}) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
    const [textAreaData, setTextAreaData] = useState<string>(initialTextContent);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [pdfLoadingError, setPdfLoadingError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [scale, setScale] = useState(1.0);

    useEffect(() => {
        setIsClient(typeof window !== "undefined");
    }, []);
    // Effect to update page number if initialPageNumber prop changes
    useEffect(() => {
            setPageNumber(initialPageNumber);
    }, [initialPageNumber]);

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
        setIsEditing((prev) => !prev);
        // Optionally save data when toggling off editing
        if (isEditing) {
            console.log('Text area content saved:', textAreaData);
            // Here you would typically send `textAreaData` to an API or save it locally
        }
    }, [isEditing, textAreaData]);

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
                <div className="flex-[7] flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 mr-4 overflow-auto">
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

                {/* Right side: Editable Text Area (3/10 width, 100% of 75vh) */}
                <div className="flex-[3] flex flex-col bg-white rounded-lg shadow-lg p-4 ml-4"
                     style={{ height: '100%', maxHeight: '100%' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Notes for Page {pageNumber}</h2>
                        <button
                            onClick={toggleEditing}
                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center"
                            aria-label={isEditing ? "Save Notes" : "Edit Notes"}
                        >
                            {isEditing ? <Save size={20} /> : <Pencil size={20} />}
                        </button>
                    </div>
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
                </div>
            </div>
        </div>
    );
};

export default Step4PDFTextEditor;