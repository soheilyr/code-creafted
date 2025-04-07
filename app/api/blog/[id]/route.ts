// import { NextApiRequest } from "next";
// import { prisma } from "@/lib/prisma"; // Update if your prisma import path is different
// import { NextResponse } from "next/server";

// export async function GET(req: NextApiRequest) {
//   const r = req;
//   console.log(r);
//   const { id } = req.query;
//   console.log("queryyyyy", req.query);
//   if (!id || typeof id !== "string") {
//     return NextResponse.status(400).json({ error: "Invalid or missing ID" });
//   }

//   try {
//     // Fetch the blog by ID, including the author details (name, avatar)
//     const blog = await prisma.blog.findUnique({
//       where: { id },
//       include: {
//         author: {
//           select: {
//             name: true,
//             avatar: true,
//           },
//         },
//       },
//     });

//     if (!blog) {
//       return res.status(404).json({ error: "Blog not found" });
//     }

//     return res.status(200).json(blog); // Return the found blog
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Failed to fetch blog" });
//   }
// }
