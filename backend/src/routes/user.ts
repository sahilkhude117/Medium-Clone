import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign,verify } from 'hono/jwt';
import { use } from "hono/jsx";

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL : string,
      JWT_SECRET : string
    }
  }>()


/* 
  Signup Route
*/

userRouter.post('/signup', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
  
    try {
      const user = await prisma.user.create({
        data : {
          email : body.email,
          password : body.password,
        },
      });
  
      const token = await sign ({ id: user.id }, c.env.JWT_SECRET)
  
        return c.json('new user added successfully with jwt =' + token)
  
    } catch(e) {
      return c.json({
        message : "Email already exists or Invalid Credentials"
      })
    }  
})
  
  /* 
    Signin Route
  */
  
userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

        const body = await c.req.json();

    try {
        const user = await prisma.user.findUnique({
        where: {
            email: body.email,
            password: body.password
        }
        });

        if (!user) {
        c.status(403);
        return c.json({ error: "user not found" });
        }

        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ jwt , user });
    } catch(e) {
        c.status(411);
        return c.text('error in signin')
    }       
})
  