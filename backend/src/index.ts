import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign,verify } from 'hono/jwt';

// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL : string,
    JWT_SECRET : string
  }
}>();

/* 
  Signup Route
*/

app.post('/api/v1/signup', async(c) => {
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

app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL
  }).$extends(withAccelerate())

	const body = await c.req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt , user });
})


/*
* MiddleWares
*/

app.use('/api/v1/blog/*',async(c,next) => {
  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1]

  const responce = await verify(token, c.env.JWT_SECRET)
  if (responce.id){
    await next();
  } else {
    c.status(403)
    return c.json({ error: "unauthorized"})
  }
})

/* 
  Get : Blog Id
*/

app.get('/api/v1/blog/:id', (c) => {
	const id = c.req.param('id')
	console.log(id);
	return c.text('get blog route')
})

/* 
  Post : Blog
*/

app.post('/api/v1/blog', (c) => {

	return c.text('signin route')
})

/* 
  Put : blog
*/

app.put('/api/v1/blog', (c) => {
	return c.text('signin route')
})

export default app;
