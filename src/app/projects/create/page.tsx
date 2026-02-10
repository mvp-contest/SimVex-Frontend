"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { projects as projectsApi, teams as teamsApi, type Team } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TextInput from "@/components/ui/TextInput";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import FileUpload from "@/app/components/FileUpload";

export default function CreateProjectPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        teamId: "",
    });
    const [teams, setTeams] = useState<Team[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            loadTeams();
        }
    }, [user?.id]);

    const loadTeams = async () => {
        if (!user?.id) return;
        try {
            const data = await teamsApi.list(user.id);
            setTeams(data);
        } catch (err) {
            console.error("Failed to load teams:", err);
        }
    };

    const handleFileSelect = (files: Array<{ file: File; url: string; type: string }>) => {
        setUploadedFiles(files.map((f) => f.file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id || !formData.name || !formData.teamId) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);

            const newProject = await projectsApi.create(formData.teamId, formData.name, user.id);

            if (uploadedFiles.length > 0) {
                await projectsApi.uploadFiles(newProject.id, uploadedFiles);
            }

            alert("Project created successfully!");
            router.push(`/dashboard/projects/${newProject.id}`);
        } catch (err) {
            console.error("Failed to create project:", err);
            alert(err instanceof Error ? err.message : "Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/dashboard/teams");
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[calc(100vh-88px)] p-12">
                <div className="w-full max-w-[1058px] bg-(--color-card-bg) border-[2px] border-(--color-border-primary) rounded-[15px] p-12 shadow-[inset_0_4px_4px_4px_rgba(0,0,0,0.25)]">
                    <h1 className="text-[32px] font-semibold text-(--color-text-primary) mb-8">
                        Create Project
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Select
                            label="Team"
                            value={formData.teamId}
                            onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                            options={[
                                { value: "", label: "Select a team" },
                                ...teams.map((team) => ({
                                    value: team.id,
                                    label: team.name,
                                })),
                            ]}
                            required
                        />

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

                        <div className="pt-4">
                            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                                Upload Files (GLB, OBJ, STL, meta_data.json)
                            </label>
                            <FileUpload onFileSelect={handleFileSelect} />
                            {uploadedFiles.length > 0 && (
                                <p className="mt-2 text-sm text-(--color-text-muted)">
                                    {uploadedFiles.length} file(s) selected
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 pt-6">
                            <Button type="button" variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? "Creating..." : "Create Project"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
