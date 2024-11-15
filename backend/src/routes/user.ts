import {Hono} from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,verify} from 'hono/jwt'
import {signupInput,signinInput} from '@abhinavharsh/medium-common' 


export const userRouter =new Hono<{
	Bindings: {
		DATABASE_URL: string
        JWT_SECRET:string
	}
}>();  


userRouter.post('/signup', async(c) => {
    const body=await c.req.json();
    const {success}=signupInput.safeParse(body);
    console.log(success);
    if(!body){
        c.status(400);
        return c.json({error:"Invalid input"})
    }
    console.log(body);
    const prisma = new PrismaClient({
        datasourceUrl: c. env.DATABASE_URL,
      }).$extends(withAccelerate())
    const user=await prisma.user.create({
      data:{
        email:body.email,
        password:body.password,
        name:body.name
      }
    })
    
  
    const token=await sign({id:user.id},c.env.JWT_SECRET)
     
    return c.json({jwt:token})
  })
  
userRouter.post('/signin', async (c) => {  
  const body = await c.req.json();
  console.log("Received body:", body);  // Log the incoming request body

  const { success } = signinInput.safeParse(body);
  if (!success) {
    console.error("Validation failed:", signinInput.safeParse(body).error);  // Log Zod validation errors
    c.status(400);
    return c.json({ error: "Invalid input" });
  }
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    try{
      const user = await prisma.user.findUnique({
          where: {
              email: body.email,
        password:body.password
          }
      });
  
      if (!user) {
          c.status(403);
          return c.json({ error: "user not found" });
      }
  
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ jwt});
    }catch(e){
      console.log(e);
      c.status(411);
      return c.text("Invalid");
    }
  })





