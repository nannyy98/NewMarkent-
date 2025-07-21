import React, { useState } from 'react';
import { Shield, CheckCircle, Upload, AlertCircle } from 'lucide-react';

export function SellerVerification() {
  const [verificationStep, setVerificationStep] = useState(1);
  const [documents, setDocuments] = useState({
    businessLicense: null,
    taxCertificate: null,
    bankStatement: null,
    identityDocument: null,
  });

  const verificationSteps = [
    {
      id: 1,
      title: 'Business Information',
      description: 'Provide your business details',
      icon: Shield,
    },
    {
      id: 2,
      title: 'Document Upload',
      description: 'Upload required documents',
      icon: Upload,
    },
    {
      id: 3,
      title: 'Verification Review',
      description: 'Wait for approval',
      icon: CheckCircle,
    },
  ];

  const handleDocumentUpload = (documentType: string, file: File) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: file,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <Shield className="h-16 w-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Verification</h1>
        <p className="text-gray-600">Complete verification to start selling on our platform</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {verificationSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
              verificationStep >= step.id 
                ? 'bg-orange-500 border-orange-500 text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              <step.icon className="h-6 w-6" />
            </div>
            <div className="ml-4 text-left">
              <div className={`text-sm font-medium ${
                verificationStep >= step.id ? 'text-orange-600' : 'text-gray-400'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
            {index < verificationSteps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                verificationStep > step.id ? 'bg-orange-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {verificationStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your business name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Select business type</option>
                    <option value="individual">Individual</option>
                    <option value="llc">LLC</option>
                    <option value="corporation">Corporation</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID Number *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter tax ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter complete business address"
                />
              </div>
              
              <button
                type="button"
                onClick={() => setVerificationStep(2)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Continue to Documents
              </button>
            </form>
          </div>
        )}

        {verificationStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Upload</h2>
            <div className="space-y-6">
              {[
                { key: 'businessLicense', label: 'Business License', required: true },
                { key: 'taxCertificate', label: 'Tax Certificate', required: true },
                { key: 'bankStatement', label: 'Bank Statement', required: false },
                { key: 'identityDocument', label: 'Identity Document', required: true },
              ].map((doc) => (
                <div key={doc.key} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {doc.label} {doc.required && <span className="text-red-500">*</span>}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Upload a clear photo or scan of your {doc.label.toLowerCase()}
                      </p>
                    </div>
                    {documents[doc.key as keyof typeof documents] && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(doc.key, file);
                        }
                      }}
                      className="hidden"
                      id={`upload-${doc.key}`}
                    />
                    <label
                      htmlFor={`upload-${doc.key}`}
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
              ))}
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setVerificationStep(1)}
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setVerificationStep(3)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Submit for Review
                </button>
              </div>
            </div>
          </div>
        )}

        {verificationStep === 3 && (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Submitted</h2>
            <p className="text-gray-600 mb-6">
              Your verification documents have been submitted successfully. 
              Our team will review your application within 2-3 business days.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900">What happens next?</h4>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• We'll verify your business information</li>
                    <li>• Review all uploaded documents</li>
                    <li>• Send you an email with the verification result</li>
                    <li>• Once approved, you can start selling immediately</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => window.location.href = '/seller'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Go to Seller Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}