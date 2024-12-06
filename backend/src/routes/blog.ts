import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlog , updateBlog } from "@sahilkhude/medium-common";

export const blogRouter = new Hono<{
    Bindings : {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: any;
    }
}>();

blogRouter.use('/*', async (c,next) => {
    const authHeader = c.req.header("Authorization") || "";
    const token = authHeader.split(" ")[1]
    try {
        const user = await verify(token, c.env.JWT_SECRET);
            if (user) {
                c.set("userId",user.id);
                await next();
            } else {
                c.status(403);
                return c.json({
                    message:"You are not logged in"
                })
            }
    } catch(e) {
        c.status(403);
        return c.json({
            message:"You are not logged in"
        })
    }
    
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlog.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message : "Inputs are correct"
        })
    }

    const userId = c.get('userId')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try {
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId
            }
        })  
    
        return c.json({
            msg: "Post added Successfully",
            id: post.id
        })
    } catch(e) {
        return c.json({
            msg: "Error while posting"
        })
    } 
})

blogRouter.put('/', async (c) => {
	const body = await c.req.json();
    const {success} = updateBlog.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message : "Inputs are correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try {
        const post = await prisma.post.update({
            where : {
                id : body.id
            } ,
            data: {
                title: body.title,
                content: body.content,
            }
        })  
    
        return c.json({
            msg: "Content updated succesfully",
            id: post.id
        })
    } catch(e) {
        return c.json({
            msg: "Content Could not be updated"
        })
    }
    
})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const posts = await prisma.post.findMany();
	return c.json({
        posts
    })
})

blogRouter.get('/:id', async (c) => {
	const body = await c.req.json();
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try {
        const post = await prisma.post.findFirst({
            where: {
                id : id
            },
        })  
    
        return c.json({
            post
        })
    } catch(e) {
        c.status(411);
        return c.json({
            msg : "Error while feching blog post"
        })
    }
    
})


