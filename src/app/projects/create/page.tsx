"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TextInput from "@/components/ui/TextInput";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import FileUpload from "@/components/ui/FileUpload";
import Button from "@/components/ui/Button";

export default function CreateProjectPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        team: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
        router.push("/dashboard");
    };

    const handleCancel = () => {
        router.push("/dashboard");
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[calc(100vh-88px)] p-12">
                <div className="w-full max-w-[1058px] bg-(--color-card-bg) border-[2px] border-(--color-border-primary) rounded-[15px] p-12 shadow-[inset_0_4px_4px_4px_rgba(0,0,0,0.25)]">
                    <h1 className="text-[32px] font-semibold text-(--color-text-primary) mb-8">
                        Create Project
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <TextInput
                            label="Project Name"
                            placeholder="Enter project name (e.g., Robot Arm Assembly)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <TextArea
                            label="Project Description (Optional)"
                            placeholder="Describe your project..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                        />

                        <Select
                            label="Team"
                            value={formData.team}
                            onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                            options={[
                                { value: "", label: "Select a team" },
                                { value: "team1", label: "Team Alpha" },
                                { value: "team2", label: "Team Beta" },
                            ]}
                            required
                        />

                        {/* File Upload */}
                        <div className="pt-4">
                            <FileUpload onFileSelect={(files) => console.log("Files:", files)} />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6">
                            <Button type="button" variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Create
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
