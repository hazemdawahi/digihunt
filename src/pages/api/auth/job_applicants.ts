import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { jobId } = req.body; // Change this line

  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required." });
  }

  try {
    const applications = await prisma.application.findMany({
        where: {
          jobId: jobId // Change this line
        },
        include: {
          user: {
            include: {
              resume: true
            }
          },
          job: {
            include: {
              jobSkills: {
                include: {
                  skill: true
                }
              },
              company: true
            }
          }
        }
      });
      
    return res.json({ applications });

  } catch (error) {
    return res.status(500).json({ error: "An error occurred while fetching applications." });
  }
}
