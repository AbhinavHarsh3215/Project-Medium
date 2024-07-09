import React from 'react';
import { BlogCard } from '../components/BlogCard';
import { Appbar } from '../components/Appbar';
import { useBlogs } from '../hooks/index.ts';
import { BlogSkeleton } from '../components/BlogSkeleton.tsx';


export const Blogs = () => {
    const {loading,blogs}=useBlogs();
    if(loading){
        return <div>
            <Appbar name="A"/>
        <div className='flex justify-center'>   
            <div>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
            </div>
            </div>
        </div>
    }
    return  <div>
        <Appbar name="A"/>
     <div className='flex justify-center'>
        <div className=''>
            {blogs.map(blog=><BlogCard
                authorName={blog.author.name||"Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={"2021-09-01"}
                id={blog.id}
            />)}
        </div>
    </div>
    </div>
}