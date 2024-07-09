import App from "../App.tsx";
import { Appbar } from "../components/Appbar.tsx";
import { BlogCard } from "../components/BlogCard"
import { FullBlog } from "../components/FullBlog.tsx";
import { Spinner } from "../components/Spinner.tsx";
import { useBlog } from "../hooks/index.ts"
import { useParams } from "react-router-dom"

export const Blog = () => {
    const {id}=useParams();   
    const {loading,blog}=useBlog({id:id||""});

    if(loading){
        return <div>
            <Appbar name="A"/>
        <div className="h-screen flex  flex-col justify-center">
            <div className="flex justify-center">
                <Spinner/>
            </div>
            
        </div>
        </div>
    }
    return <div>
        {blog && <FullBlog blog={blog}/>}
    </div>
}
