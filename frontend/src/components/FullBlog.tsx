import { Appbar } from "./Appbar";
import { Blog } from "../hooks";
import { Avatar } from "./BlogCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../congif"

export const FullBlog = ({ blog }: { blog: Blog }) => {
    const [editMode, setEditMode] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(blog.content);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const response = await fetch(`${BACKEND_URL}/${blog.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `${token}`
                    }
                });

                if (response.ok) {
                    alert("Blog deleted successfully");
                    navigate("/blogs");
                } else {
                    alert("You are Not Authorized");
                    console.error("Failed to delete blog");
                }
            } catch (error) {
                console.error("Error deleting blog:", error);
            }
        }
    };

    const handleUpdate = async () => {
        if (editMode) {
            try {
                const response = await fetch(`${BACKEND_URL}/${blog.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${token}`,
                    },
                    body: JSON.stringify({ content: updatedContent }),
                });

                if (response.ok) {
                    alert("Blog updated successfully");
                    setEditMode(false);
                    navigate("/blogs");
                } else {
                    alert("You are Not Authorized");
                    console.error("Failed to update blog");
                }
            } catch (error) {
                console.error("Error updating blog:", error);
            }
        } else {
            setEditMode(true);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Appbar name={blog.author.name} />
            <div className="flex justify-center mt-10 mb-20">
                <div className="grid grid-cols-12 gap-6 px-10 w-full max-w-screen-xl bg-white rounded-lg shadow-lg p-8">
                    <div className="col-span-8">
                        <h1 className="text-5xl font-extrabold text-gray-800">{blog.title}</h1>
                        <p className="text-slate-500 pt-2">Posted on 2nd December 2023</p>
                        <div className="pt-6">
                            {editMode ? (
                                <textarea
                                    value={updatedContent}
                                    onChange={(e) => setUpdatedContent(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-4 text-gray-700"
                                />
                            ) : (
                                <p className="text-lg leading-relaxed text-gray-800">{blog.content}</p>
                            )}
                        </div>
                        <div className="flex space-x-4 pt-6">
                            <button
                                onClick={handleUpdate}
                                className="px-5 py-2 rounded-lg font-semibold transition-all duration-300 bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                            >
                                {editMode ? "Save" : "Update"}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 rounded-lg font-semibold transition-all duration-300 bg-red-500 text-white hover:bg-red-600 shadow-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <div className="col-span-4 bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-slate-600 text-lg font-semibold">Author</h2>
                        <div className="flex items-center pt-4">
                            <div className="pr-4 flex flex-col justify-center">
                                <Avatar size="big" name={blog.author.name || "!"} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{blog.author.name || "Anonymous"}</h3>
                                <p className="pt-2 text-slate-500 text-sm">
                                    A brief and engaging description of the author's style.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
