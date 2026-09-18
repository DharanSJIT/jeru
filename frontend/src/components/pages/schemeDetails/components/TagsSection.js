import React from 'react';
import { Tag } from 'lucide-react';

const TagsSection = ({ tags }) => {
    return (
        <section className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center text-gray-800">
                <Tag className="mr-2 text-[#0052CC]" size={24} />
                Tags
            </h2>
            <div className="flex flex-wrap gap-2">
                {tags?.map((tag, index) => (
                    <span
                        key={index}
                        className="px-4 py-1.5 bg-blue-50 text-[#0052CC] rounded-full text-sm font-medium"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default TagsSection;
