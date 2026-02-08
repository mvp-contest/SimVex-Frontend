"use client";

import { useState } from "react";

const MOCK_MODELS = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "SV Renderer",
  size: "7.2 MB",
  selected: true,
}));

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState<"3d" | "workflow">("3d");
  const [searchQuery, setSearchQuery] = useState("");
  const [models, setModels] = useState(MOCK_MODELS);

  const toggleModelSelection = (id: number) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Project Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-200 text-xl leading-normal">
          SV Renderer
        </h2>
        <button
          className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent-blue)", color: "#e2e8f0" }}
        >
          Start
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 3L8 6L4.5 9" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Owner Info */}
      <div className="flex items-center gap-2 mb-5">
        <span className="font-medium text-slate-200 text-sm leading-normal">
          Stupid Kang sang-woo
        </span>
        <div className="flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M7 9C8.66 9 10 7.66 10 6C10 4.34 8.66 3 7 3C5.34 3 4 4.34 4 6C4 7.66 5.34 9 7 9ZM7 11C4.67 11 0 12.17 0 14.5V17H14V14.5C14 12.17 9.33 11 7 11ZM13 9C14.66 9 16 7.66 16 6C16 4.34 14.66 3 13 3C12.71 3 12.43 3.03 12.16 3.1C12.69 3.89 13 4.89 13 6C13 7.11 12.69 8.11 12.16 8.9C12.43 8.97 12.71 9 13 9ZM14.04 11.13C15.22 12.06 16 13.27 16 14.5V17H20V14.5C20 12.46 16.5 11.35 14.04 11.13Z"
              fill="#64748b"
            />
          </svg>
        </div>
        <span className="font-medium text-slate-500 text-xs leading-normal">
          +5 memvers
        </span>
      </div>

      {/* Tabs + Search Row */}
      <div className="flex items-start justify-between mb-[5px]">
        <div>
          <nav className="flex gap-16">
            <button
              onClick={() => setActiveTab("3d")}
              className={`font-medium text-base leading-normal transition-colors ${
                activeTab === "3d" ? "text-slate-200" : "text-[#787878]"
              }`}
            >
              3D Models
            </button>
            <button
              onClick={() => setActiveTab("workflow")}
              className={`font-medium text-base leading-normal transition-colors ${
                activeTab === "workflow" ? "text-slate-200" : "text-[#787878]"
              }`}
            >
              Workflow
            </button>
          </nav>
        </div>

        {/* Search box */}
        <div
          className="w-[220px] h-7 rounded-md flex items-center px-3 gap-2 flex-shrink-0"
          style={{
            backgroundColor: "var(--input-bg)",
            border: "1px solid var(--input-border)",
          }}
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models..."
            className="font-medium text-slate-500 text-xs leading-normal bg-transparent w-full outline-none placeholder:text-slate-500"
            aria-label="Search models"
          />
          <SearchIcon />
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#333b45] mb-3" />

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-5">
        <p className="font-medium text-sm leading-normal">
          <span className="text-slate-200">{filteredModels.length} </span>
          <span className="text-[#787878]">models Uploaded</span>
        </p>
        <div className="w-px h-4 bg-[#787878]" />
        <p className="font-medium text-sm leading-normal">
          <span className="text-slate-200">{filteredModels.length}</span>
          <span className="text-[#787878]"> Files Uploaded</span>
        </p>
        <span className="font-medium text-slate-500 text-sm leading-normal">
          (48.3 MB)
        </span>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-4 gap-x-5 gap-y-4 mb-6">
        {filteredModels.map((model) => (
          <article
            key={model.id}
            className="rounded-xl overflow-hidden cursor-pointer transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#1e2127",
              border: "1px solid #333b45",
            }}
          >
            {/* Thumbnail area */}
            <div
              className="relative h-[120px] flex items-center justify-center"
              style={{
                backgroundColor: "#12141b",
                borderBottom: "1px solid #333b45",
              }}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleModelSelection(model.id)}
                className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center"
              >
                <CheckboxIcon checked={model.selected} />
              </button>

              {/* 3D Model Preview */}
              <CubeIcon />
            </div>

            {/* Info */}
            <div className="px-4 pt-2 pb-2.5">
              <h4 className="font-semibold text-slate-200 text-sm leading-normal">
                {model.name}
              </h4>
              <span className="font-medium text-slate-500 text-xs leading-normal">
                {model.size}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="w-full h-px bg-[#333b45] mb-4" />
      <div className="flex items-center justify-center gap-3">
        <button className="flex items-center justify-center hover:opacity-70 transition-opacity" aria-label="Previous page">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M6 2L2 7L6 12" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ border: "1.5px solid #333b45" }}
        >
          <span className="font-medium text-slate-200 text-xs leading-normal">1</span>
        </div>

        <span className="font-medium text-slate-200 text-xs leading-normal">
          1-{filteredModels.length} of 1 Projects
        </span>

        <button className="flex items-center justify-center hover:opacity-70 transition-opacity" aria-label="Next page">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M2 2L6 7L2 12" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function CheckboxIcon({ checked }: { checked: boolean }) {
  if (!checked) {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="16" height="16" rx="3" stroke="#64748b" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect width="18" height="18" rx="3" fill="#3b82f6" />
      <path d="M4 9L7.5 12.5L14 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CubeIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M40 10L67 24V52L40 66L13 52V24L40 10Z" stroke="#4a5568" strokeWidth="1.2" fill="none" />
      <path d="M40 10L67 24L40 38L13 24L40 10Z" stroke="#4a5568" strokeWidth="0.8" fill="none" />
      <line x1="40" y1="38" x2="40" y2="66" stroke="#4a5568" strokeWidth="0.8" />
      <text x="40" y="46" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="bold" fontFamily="Arial, Helvetica, sans-serif">
        SV
      </text>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
      <circle cx="7" cy="7" r="5.5" stroke="#64748b" strokeWidth="1.5" />
      <path d="M11 11L14.5 14.5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
