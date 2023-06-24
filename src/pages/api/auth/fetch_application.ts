import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;  // Get the userId from req.query because it's a GET request

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    try {
        console.log('userId:', userId);
        const userApplications = await prisma.application.findMany({
            where: { userId: parseInt(userId)},
            include: { 
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
          
        console.log('userApplications:', userApplications);

      res.status(200).json(userApplications);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === 'POST') {
    // Handle POST requests here...
    res.status(405).json({ message: "Method not allowed" }); // only GET method is allowed
  }
}
