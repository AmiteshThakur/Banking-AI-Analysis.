import { useState } from 'react';
import axios from "axios";

export default function AICompliancePlatform() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [loading, setLoading] = useState(false);

  const [aiSummary, setAiSummary] = useState('');
  const [riskAnalysis, setRiskAnalysis] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('');

  const [question, setQuestion] = useState('');
const [aiResponse, setAiResponse] = useState('');
const [askLoading, setAskLoading] = useState(false);
  const handleFileChange = (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadMessage('Only PDF files are allowed.');
      return;
    }

    setSelectedFile(file);
    setUploadMessage('PDF selected successfully.');
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleUpload = async () => {

    if (!selectedFile) {
      setUploadMessage('Please select a PDF first.');
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append('file', selectedFile);

      const response = await axios.post(
        'http://127.0.0.1:8000/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response.data);

      // Parse AI response
      const aiData = JSON.parse(response.data.result);

      // Update UI dynamically
      setAiSummary(aiData.summary);

      setRiskAnalysis(aiData.risks);

      setRecommendedAction(aiData.recommended_actions);

      setUploadMessage('PDF analyzed successfully.');

    } catch (error) {

      console.error(error);

      setUploadMessage('Upload failed.');

    } finally {

      setLoading(false);

    }
  };


  const handleAskAI = async () => {

  if (!question.trim()) return;

  try {

    setAskLoading(true);

    const response = await axios.post(
      'http://127.0.0.1:8000/ask-ai',
      {
        question: question
      }
    );

    setAiResponse(response.data.answer);

  } catch (error) {

    console.error(error);

    setAiResponse('AI request failed.');

  } finally {

    setAskLoading(false);

  }
};

  // try {
  //   setLoading(true);

  //   const formData = new FormData();
  //   formData.append('file', selectedFile);

  //   // Dummy delay for demo
  //   await new Promise((resolve) => setTimeout(resolve, 2000));

  //   /*
  //     BACKEND API CONNECTION LATER

  //     await axios.post(
  //       "http://localhost:8080/api/upload",
  //       formData
  //     );
  //   */

  //   setUploadMessage('PDF uploaded and analyzed successfully.');
  // } 
  // catch (error) {
  //   setUploadMessage('Upload failed.');
  // }
  //  finally {
  //   setLoading(false);
  // }
const sidebarItems = [
  'Dashboard',
  // 'Regulation Analysis',
  // 'Gap Detection',
  // 'Transaction Monitoring',
  // 'AI Copilot',
  // 'Reports'
];

const riskData = [
  { title: 'High Risk', value: 23, color: 'bg-red-500' },
  { title: 'Medium Risk', value: 51, color: 'bg-yellow-500' },
  { title: 'Low Risk', value: 120, color: 'bg-green-500' }
];

const regulations = [
  {
    title: 'RBI AML Circular',
    desc: 'Enhanced due diligence for high-value transactions.'
  },
  {
    title: 'Basel III Update',
    desc: 'Liquidity ratio monitoring updated.'
  },
  {
    title: 'KYC Compliance Rule',
    desc: 'Customer re-verification every 2 years.'
  }
];

const transactions = [
  {
    id: 'TXN10231',
    amount: '₹15,00,000',
    region: 'Mumbai',
    risk: 'High Risk'
  },
  {
    id: 'TXN10451',
    amount: '₹25,000',
    region: 'Delhi',
    risk: 'Safe'
  },
  {
    id: 'TXN10871',
    amount: '₹9,50,000',
    region: 'Bangalore',
    risk: 'Medium Risk'
  }
];

return (
  <div className="min-h-screen bg-slate-100 flex font-sans">
    {/* Sidebar */}
    <div className="w-72 bg-slate-900 text-white p-6 flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">AI Compliance</h1>
        <p className="text-slate-400 text-sm mt-1">
          Banking Intelligence Platform
        </p>
      </div>

      <div className="space-y-3">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${index === 0
              ? 'bg-blue-600 text-white'
              : 'hover:bg-slate-800 text-slate-300'
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-auto bg-slate-800 p-4 rounded-2xl">
        <p className="text-sm text-slate-400">Logged in as</p>
        <h2 className="font-semibold mt-1">Compliance Officer</h2>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-8 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Compliance Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Proactive AI-driven regulatory intelligence system.
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Overall Compliance Score</p>
          <h2 className="text-2xl font-bold text-blue-600">72 / 100</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {riskData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">{item.title}</p>
                <h2 className="text-4xl font-bold mt-3 text-slate-800">
                  {item.value}
                </h2>
              </div>

              <div className={`w-5 h-20 rounded-full ${item.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights + Regulation Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* AI Insights */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">AI Insights</h2>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              Live Analysis
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
              <h3 className="font-semibold text-red-600">
                AML Risk Spike Detected
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Mumbai branch transactions exceed RBI AML threshold by 12%.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl">
              <h3 className="font-semibold text-yellow-600">
                KYC Revalidation Pending
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                1,240 customer profiles require mandatory KYC renewal.
              </p>
            </div>

            <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
              <h3 className="font-semibold text-green-600">
                Basel III Compliance Stable
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Liquidity coverage ratio currently within safe range.
              </p>
            </div>
          </div>
        </div>

        {/* Regulation Updates */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Regulatory Updates
            </h2>
            <button className="text-blue-600 text-sm font-semibold">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {regulations.map((reg, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    {reg.title}
                  </h3>
                  <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">
                    Updated
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-2">{reg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regulation Analysis Section */}
      <div className="border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center bg-slate-50">


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 bg-slate-50'
              }`}
          >
            <h3 className="text-lg font-semibold text-slate-700">
              Drag & Drop Regulation PDF
            </h3>

            <p className="text-slate-500 mt-2">
              Supports PDF files only
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={handleInputChange}
              className="hidden"
              id="pdfUpload"
            />

            <label
              htmlFor="pdfUpload"
              className="inline-block mt-6 bg-blue-600 text-white px-5 py-3 rounded-2xl cursor-pointer hover:bg-blue-700 transition-all"
            >
              Choose PDF
            </label>

            {selectedFile && (
              <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4">
                <p className="font-medium text-slate-700">
                  Selected File:
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {selectedFile.name}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {uploadMessage && (
              <p className="mt-4 text-sm font-medium text-blue-600">
                {uploadMessage}
              </p>
            )}

            <button
              onClick={handleUpload}
              disabled={loading}
              className={`mt-6 px-6 py-3 rounded-2xl text-white transition-all ${loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {loading ? 'Analyzing PDF...' : 'Upload & Analyze'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <h3 className="font-semibold text-blue-700">AI Summary</h3>
              <p className="text-sm text-slate-600 mt-2">
                {aiSummary ? aiSummary.split(' ').length > 30
      ? aiSummary.split(' ').slice(0, 30).join(' ') + '...'
      : aiSummary: 'AI summary will appear here after PDF upload.'}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <h3 className="font-semibold text-red-600">Detected Risk</h3>
              <p className="text-sm text-slate-600 mt-2">
                {riskAnalysis  ? riskAnalysis.split(' ').length > 30
      ? riskAnalysis.split(' ').slice(0, 30).join(' ') + '...'
      : riskAnalysis: 'Detected risks will appear here.'}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <h3 className="font-semibold text-green-600">
                Recommended Action
              </h3>
             <p className="text-sm text-slate-600 mt-2">
  {recommendedAction
    ? recommendedAction.split(' ').length > 30
      ? recommendedAction.split(' ').slice(0, 30).join(' ') + '...'
      : recommendedAction
    : 'Recommended actions will appear here.'}
</p>
            </div>
          </div>
        </div>
      </div>



      {/* AI Copilot */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            AI Compliance Copilot
          </h2>
          <p className="text-slate-500 mt-1">
            Ask questions about compliance risks and regulations.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-100 p-4 rounded-2xl max-w-2xl">
            <p className="font-medium text-slate-700">
              Which branches have the highest compliance risk?
            </p>
          </div>

          <div className="bg-blue-600 text-white p-4 rounded-2xl max-w-3xl ml-auto">
            <p>
              Mumbai and Delhi branches currently show elevated AML risk due
              to increased high-value transaction activity and delayed KYC
              renewals.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
         <div className="flex gap-4">
  <input
    type="text"
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Ask AI about compliance risks..."
    className="flex-1 border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    onClick={handleAskAI}
    disabled={askLoading}
    className={`px-6 py-4 rounded-2xl text-white transition-all ${
      askLoading
        ? 'bg-slate-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700'
    }`}
  >
    {askLoading ? 'Thinking...' : 'Ask AI'}
  </button>
  {aiResponse && (
  <div className="mt-6 bg-blue-50 border border-blue-100 p-5 rounded-2xl">
    <h3 className="font-semibold text-blue-700 mb-2">
      AI Compliance Insight
    </h3>

    <p className="text-slate-700 text-sm leading-7">
      {aiResponse}
    </p>
  </div>
)}
</div>

        </div>
      </div>
    </div>
  </div>
);
}