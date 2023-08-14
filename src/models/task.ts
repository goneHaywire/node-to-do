import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().max(255),
  projectId: z.string().uuid(),
})

export const updateTaskSchema = createTaskSchema.partial()

type test = z.infer<typeof updateTaskSchema>
