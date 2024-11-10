import { Appbar } from "../components/Appbar";
import { BACKEND_URL } from "../congif";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handlePublish = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                title,
                content: description
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            navigate(`/blog/${response.data.id}`);
        } catch (error) {
            console.error("Error publishing blog:", error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Appbar name="A" />
            <div className="flex justify-center mt-10">
                <div className="max-w-screen-md w-full bg-white rounded-lg shadow-lg p-8">
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 mb-6 shadow-sm"
                        placeholder="Enter your title here"
                    />
                    <TextEditor onChange={(e) => setDescription(e.target.value)} />
                    <button
                        onClick={handlePublish}
                        type="submit"
                        className="mt-6 inline-flex items-center px-8 py-4 text-sm font-medium text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-700 transition-colors duration-300"
                    >
                        Publish Post
                    </button>
                </div>
            </div>
        </div>
    );
};

function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div className="mt-6">
            <div className="bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h2 className="text-gray-800 text-xl font-medium">Content Editor</h2>
                </div>
                <div className="p-6">
                    <textarea
                        onChange={onChange}
                        rows={12}
                        className="focus:outline-none block w-full text-gray-800 text-lg bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
                        placeholder="Write your article here..."
                        required
                    />
                </div>
            </div>
        </div>
    );
}
