// app/page.tsx
// Ensure you have lucide-react installed: npm install lucide-react
// You would typically use shadcn/ui components, but we'll style HTML elements to mimic them.
// e.g., npx shadcn-ui@latest add button select input label
"use client";

import React, { useState, ChangeEvent, FC, ReactNode, useEffect, useRef } from 'react';
import { BASE_URL } from '@/src/api/base_url';
import { Check, ChevronRight, ChevronLeft, UploadCloud } from 'lucide-react';
import { Button, Label, Select, Input, Spinner } from '@/src/components/utils';

// --- Type Definitions ---

interface Option {
    id: number;
    label: string;
}

interface DeviceTypeOption extends Option {
    icon?: ReactNode;
}

interface BrandOption extends Option { }


interface FormData {
    deviceId?: number; // Optional, will be set after API call
    deviceType: string;
    brandName: string;
    deviceName: string;
    issueDetails: string;
    pdfFile?: File | null; // Added for PDF upload
}

interface Errors {
    deviceType?: string;
    brandName?: string;
    deviceName?: string;
    issueDetails?: string;
    pdfFile?: string; // Added for PDF upload
}

// --- Mock Data ---


// --- Main Application Components (with Types) ---

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    stepLabels: string[];
}
const ProgressBar: FC<ProgressBarProps> = ({ currentStep, totalSteps, stepLabels }) => {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <li key={step} className={`relative ${step !== totalSteps ? 'pr-8 sm:pr-20 flex-1' : ''}`}>
                        {currentStep > step ? (
                            // Completed step
                            <div>
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-indigo-600" aria-hidden="true"></span>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900">
                                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                                </div>
                                <span className="ml-3 hidden sm:block text-sm font-medium text-indigo-600">{stepLabels[step - 1]}</span>
                            </div>
                        ) : currentStep === step ? (
                            // Current step
                            <>
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-gray-200" aria-hidden="true"></span>
                                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white" aria-current="step">
                                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" aria-hidden="true" />
                                </div>
                                <span className="ml-3 hidden sm:block text-sm font-medium text-indigo-600">{stepLabels[step - 1]}</span>
                            </>
                        ) : (
                            // Upcoming step
                            <>
                                {step > 1 && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-gray-200" aria-hidden="true"></span>}
                                <div className="relative group flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                                    <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />
                                </div>
                                <span className="ml-3 hidden sm:block text-sm font-medium text-gray-500">{stepLabels[step - 1]}</span>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

interface StepFormProps {
    data: FormData;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    errors: Errors;
}

const Step1Form: FC<StepFormProps> = ({ data, handleChange, errors }) => {
    const [deviceTypes, setDeviceTypes] = useState<DeviceTypeOption[]>([]);
    const [brandNames, setBrandNames] = useState<BrandOption[]>([]);
    const [loadingOptions, setLoadingOptions] = useState<boolean>(true);
    // NEW: Fetch device types and brands
    useEffect(() => {
        const fetchOptions = async () => {
            setLoadingOptions(true);
            try {
                const res = await fetch(`${BASE_URL}/pdf_process/get_brands_and_device_types`);
                const json = await res.json();
                if (json.success && json.data) {
                    setDeviceTypes([{ id: 0, label: 'Select device type...' }, ...json.data.deviceTypes]);
                    setBrandNames([{ id: 0, label: 'Select brand...' }, ...json.data.brands]);
                }
            } catch (err) {
                // Optionally handle error
                setDeviceTypes([{ id: 0, label: 'Select device type...' }]);
                setBrandNames([{ id: 0, label: 'Select brand...' }]);
            } finally {
                setLoadingOptions(false);
            }
        };
        fetchOptions();
    }, []);

    if (loadingOptions) {
        return <Spinner />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Device Information</h2>
                <p className="text-sm text-gray-500">Please provide details about your device.</p>
            </div>

            <div>
                <Label htmlFor="deviceType">Device Type</Label>
                <Select
                    id="deviceType"
                    name="deviceType"
                    value={data.deviceType}
                    onChange={handleChange}
                >
                    {deviceTypes.map(option => (
                        // Added type assertion for option.icon as it can be undefined
                        <option key={option.id} value={option.id}>
                            {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
                        </option>
                    ))}
                </Select>
                {errors.deviceType && <p className="mt-1 text-xs text-red-500">{errors.deviceType}</p>}
            </div>

            <div>
                <Label htmlFor="brandName">Brand Name</Label>
                <Select
                    id="brandName"
                    name="brandName"
                    value={data.brandName}
                    onChange={handleChange}
                >
                    {brandNames.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
                        </option>
                    ))}
                </Select>
                {errors.brandName && <p className="mt-1 text-xs text-red-500">{errors.brandName}</p>}
            </div>

            <div>
                <Label htmlFor="deviceName">Device Name / Model</Label>
                <Input
                    id="deviceName"
                    name="deviceName"
                    placeholder="e.g., iPhone 15 Pro, MacBook Air M2, Galaxy Tab S9"
                    value={data.deviceName}
                    onChange={handleChange}
                />
                {errors.deviceName && <p className="mt-1 text-xs text-red-500">{errors.deviceName}</p>}
            </div>
        </div>
    );
};

interface Step2UploadAndIssueProps {
    data: FormData;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    errors: Errors;
}

const Step2UploadAndIssue: FC<Step2UploadAndIssueProps> = ({ data, handleFileChange, errors }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Issue Details & Manual Upload</h2>
            </div>

            <div>
                <Label htmlFor="pdfFile">Upload Device Manual (PDF Optional)</Label>
                <div
                    className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 cursor-pointer hover:border-gray-400 transition-colors duration-200"
                    onClick={handleButtonClick}
                >
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                        <div className="flex text-sm text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input
                                    id="file-upload"
                                    name="pdfFile"
                                    type="file"
                                    className="sr-only"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                        {data.pdfFile && (
                            <p className="text-sm font-medium text-gray-700">Selected file: {data.pdfFile.name}</p>
                        )}
                    </div>
                </div>
                {errors.pdfFile && <p className="mt-1 text-xs text-red-500">{errors.pdfFile}</p>}
            </div>
        </div>
    );
};



interface Step3PlaceholderProps {
    data: FormData;
}
const Step3Placeholder: FC<Step3PlaceholderProps> = ({ data }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Review & Submit (Step 3)</h2>
        <p className="text-sm text-gray-500">This is a placeholder for Step 3. Review your information.</p>
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-medium text-gray-700">Summary:</h3>
            <p className="text-sm text-gray-600">Device Type: {data.deviceType || 'N/A'}</p>
            <p className="text-sm text-gray-600">Brand: {data.brandName || 'N/A'}</p>
            <p className="text-sm text-gray-600">Device Name: {data.deviceName || 'N/A'}</p>
            <p className="text-sm text-gray-600">Issue: {data.issueDetails || 'N/A'}</p>
        </div>
    </div>
);


const MultiStepFormPage: FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        deviceType: '',
        brandName: '',
        deviceName: '',
        issueDetails: ''
    });
    const [errors, setErrors] = useState<Errors>({});
    const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
    const totalSteps = 3;
    const stepLabels: string[] = ["Device Info", "PDF Upload", "Review"];

    const validateStep1 = (): boolean => {
        const newErrors: Errors = {};
        if (!formData.deviceType) newErrors.deviceType = "Device type is required.";
        if (!formData.brandName) {
            newErrors.brandName = "Brand name is required.";
        }
        if (!formData.deviceName.trim()) newErrors.deviceName = "Device name is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: Errors = {};
        // Optional: Add PDF file validation (e.g., file type, size)
        if (formData.pdfFile && formData.pdfFile.type !== 'application/pdf') {
            newErrors.pdfFile = "Only PDF files are allowed.";
        }
        if (formData.pdfFile && formData.pdfFile.size > 10 * 1024 * 1024) { // 10MB limit
            newErrors.pdfFile = "File size cannot exceed 10MB.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleNext = async (): Promise<void> => {
        let isValid = true;
        if (currentStep === 1) {
            isValid = validateStep1();

            if (isValid) {
                // Call your API to create/get deviceId
                setLoadingOptions(true);
                try {
                    const params = new URLSearchParams({
                        label: formData.deviceName,
                        device_type_id: formData.deviceType,
                        brand_id: formData.brandName,
                    });
                    const res = await fetch(`${BASE_URL}/pdf_process/new_device?${params.toString()}`);
                    const json = await res.json();
                    if (json.success && json.data && json.data.device_id) {
                        setFormData(prev => ({
                            ...prev,
                            deviceId: json.data.device_id,
                        }));
                    } else {
                        alert("Failed to create/get device ID.");
                        return;
                    }
                } catch (err) {
                    alert("Error connecting to device API.");
                    return;
                }
                finally {
                    setLoadingOptions(false);
                }
            }

        } else if (currentStep === 2) {
            isValid = validateStep2();
            console.log("Step 2 validation:", isValid, formData);
            if (isValid && formData.pdfFile && formData.deviceId) {
                setLoadingOptions(true);
                try {
                    // 1. Get signed URL from backend
                    const res = await fetch(`${BASE_URL}/pdf_process/pdf_upload?device_id=${formData.deviceId}`);
                    const json = await res.json();
                    if (json.success && json.data && json.data.signed_url) {
                        // 2. Upload PDF to GCS using signed URL
                        const uploadRes = await fetch(json.data.signed_url, {
                            method: "PUT",
                            headers: {
                                "Content-Type": formData.pdfFile.type
                            },
                            body: formData.pdfFile
                        });
                        if (!uploadRes.ok) {
                            alert("Failed to upload PDF to storage.");
                            setLoadingOptions(false);
                            return;
                        }
                        // Optionally, store pdf_id if needed: json.data.pdf_id
                    } else {
                        alert("Failed to get signed URL for PDF upload.");
                        setLoadingOptions(false);
                        return;
                    }
                } catch (err) {
                    alert("Error uploading PDF.");
                    setLoadingOptions(false);
                    return;
                }
                setLoadingOptions(false);
            }
        }

        if (isValid && currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
            setErrors({});
        } else if (isValid && currentStep === totalSteps) {
            console.log("Form Submitted:", formData);
            // Note: alert() is used here as per the original code.
            // For better UX in production, consider using a modal or a notification component.
            alert("Form submitted successfully! (Check console for data)");
        }
    };

    const handlePrev = (): void => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setErrors({});
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            return newData;
        });
        // Clear specific error when user starts typing/changing value
        if (errors[name as keyof Errors]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, pdfFile: file }));
            if (errors.pdfFile) {
                setErrors(prevErrors => ({ ...prevErrors, pdfFile: undefined }));
            }
        } else {
            setFormData(prev => ({ ...prev, pdfFile: null }));
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-xl">
                <div className="mb-8">
                    <ProgressBar currentStep={currentStep} totalSteps={totalSteps} stepLabels={stepLabels} />
                </div>

                <div className="min-h-[300px]">
                    {loadingOptions ? <Spinner /> :
                        <div>
                            {currentStep === 1 && <Step1Form data={formData} handleChange={handleChange} errors={errors} />}
                            {currentStep === 2 && <Step2UploadAndIssue data={formData} handleFileChange={handleFileChange} errors={errors} />}
                            {currentStep === 3 && <Step3Placeholder data={formData} />}
                        </div>}
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                    {currentStep === totalSteps ? <div></div> :
                        <Button onClick={handleNext}>
                            Next
                            {currentStep < totalSteps && <ChevronRight className="h-4 w-4 ml-2" />}
                        </Button>
                    }
                </div>
            </div>
            <footer className="mt-8 text-center text-sm text-gray-500">
                <p>Device Manual</p>
            </footer>
        </div>
    );
};

export default MultiStepFormPage;
