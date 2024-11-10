import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';
import { CreateBlogInput, createBlogInput } from '@abhinavharsh/medium-common';
import { z } from 'zod';

export const updateBlogInput = z.object({
    title: z.string().optional(),  // Title is optional now
    content: z.string(),
    id: z.string(),  // Still using z.string() for UUIDs
});

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();

//Middleware to verify JWT and extract user ID
blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header('authorization') || "";
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        console.log(user);
        if (user) {
            c.req.user = user;  // Attach the user object directly to c.req
            await next();
        } else {
            c.status(403);
            return c.json({ error: "You are not logged in" });
        }
    } catch (error) {
        c.status(401);
        return c.json({ error: "You are not logged in" });
    }
});

// blogRouter.use('/*', async (c, next) => {
//     // Get the Authorization header from the request
//     const authHeader = c.req.header('authorization') || "";

//     // If the header is not in the correct "Bearer <token>" format, return an error
//     if (!authHeader.startsWith("Bearer ")) {
//         c.status(403);
//         return c.json({ error: "Invalid Authorization format" });
//     }

//     // Extract the token (removes 'Bearer ' part)
//     const token = authHeader.substring(7);

//     try {
//         // Verify the token using your secret and attach the decoded user to the request object
//         const user = await verify(token, c.env.JWT_SECRET);

//         if (user) {
//             // Attach the user object to the request (to be used in route handlers)
//             c.req.user = user;
//             console.log('Authenticated user:', user);  // Log user info for debugging
//             await next();  // Proceed to the next handler
//         } else {
//             // Token is valid but user is not found or invalid
//             c.status(403);
//             return c.json({ error: "You are not logged in" });
//         }
//     } catch (error) {
//         console.error('Token verification failed:', error);  // Log any verification error
//         c.status(403);
//         return c.json({ error: "You are not logged in" });
//     }
// });

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "Invalid input" });
    }

    const authorId = c.req.user.id;  // Use user ID directly from the JWT
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId,  // Make sure the authorId is passed correctly
            }
        });
        return c.json({ id: blog.id });
    } catch (error) {
        console.error(error);
        c.status(500);
        return c.json({ error: "Error creating blog" });
    }
});

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blogs = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return c.json({ blogs });
    } catch (error) {
        c.status(500);
        return c.json({ error: "Error fetching blogs" });
    }
});

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.post.findFirst({
            where: { id: id },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: { name: true },
                },
            },
        });
        if (!blog) {
            c.status(404);
            return c.json({ error: "Blog not found" });
        }
        return c.json({ blog });
    } catch (error) {
        c.status(500);
        return c.json({ error: "Error fetching blog" });
    }
});

// PUT Request - Update Blog
blogRouter.put('/:id', async (c) => {
    const blogId = c.req.param("id");  // Get blog ID from route parameter
    const body = await c.req.json();

    // Validate input data against the schema
    const { success, error } = updateBlogInput.safeParse({ ...body, id: blogId });
    if (!success) {
        c.status(400);
        return c.json({ error: "Invalid input", details: error.errors });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Retrieve the blog post to check ownership
        const existingBlog = await prisma.post.findUnique({
            where: { id: blogId },
            select: { authorId: true, title: true }, // Select the authorId and title to check ownership and preserve title
        });

        // Check if the blog exists
        if (!existingBlog) {
            c.status(404);  // Not Found
            return c.json({ error: "Blog post not found" });
        }

        // Check if the current user is the owner of the blog
        if (existingBlog.authorId !== c.req.user.id) {  // Adjust based on your DB schema
            c.status(403);  // Forbidden
            return c.json({ error: "Unauthorized access" });
        }

        // Update the blog post if ownership is verified
        const blog = await prisma.post.update({
            where: { id: blogId },
            data: {
                title: existingBlog.title,  // Keep the original title (don't update it)
                content: body.content,  // Always update the content
            }
        });

        return c.json({ id: blog.id, message: "Blog updated successfully" });
    } catch (error) {
        console.error("Error during blog update:", error);
        c.status(500);
        return c.json({ message: "An error occurred while updating the blog", error: error.message });
    }
});


// DELETE Request - Delete Blog
blogRouter.delete('/:id', async (c) => {
    console.log("ok");
    const blogId = c.req.param("id");
    const userId = c.req.user.id;

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    console.log("ok");
    try {
        // Check if the blog belongs to the user
        const existingBlog = await prisma.post.findUnique({
            where: { id: blogId },
            select: { 
                author:true
                },
        });
        console.log(existingBlog);
        if (!existingBlog || existingBlog.author.id !== userId) {
            
            c.status(401);
            return c.json({ error: "Unauthorized to delete this blog"});
        }

        // Delete the blog
        await prisma.post.delete({
            where: { id: blogId },
        });
        return c.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        c.status(500);
        return c.json({ error: "An error occurred while deleting the blog" });
    }
});
