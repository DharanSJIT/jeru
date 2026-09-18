import React from 'react';

export const Input = ({ label, name, value, onChange, type = "text", placeholder, required = false, disabled = false, min, max }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-[#0B2149] uppercase tracking-wider mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            min={min}
            max={max}
            className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#0B2149] focus:ring-1 focus:ring-[#0B2149] transition-colors ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}`}
        />
    </div>
);

export const Select = ({ label, name, value, onChange, options, required = false }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-[#0B2149] uppercase tracking-wider mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            name={name}
            value={value || ''}
            onChange={onChange}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#0B2149] focus:ring-1 focus:ring-[#0B2149] transition-colors appearance-none"
        >
            <option value="">Select...</option>
            {options.map((opt) => (
                <option key={opt.value || opt} value={opt.value || opt}>
                    {opt.label || opt}
                </option>
            ))}
        </select>
    </div>
);

export const Checkbox = ({ label, name, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer group mb-4">
        <input
            type="checkbox"
            name={name}
            checked={checked || false}
            onChange={onChange}
            className="w-5 h-5 rounded border-gray-300 text-[#0B2149] focus:ring-[#0B2149] cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700 group-hover:text-[#0B2149] transition-colors">{label}</span>
    </label>
);

export const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-6 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-bold text-[#0B2149] uppercase tracking-wider">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
);
