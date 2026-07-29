"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticate user found" };
    }

    const { id, firstName, lastName, imageUrl, emailAddresses, username } =
      user;
    const newUser = await prisma.user.upsert({
      where: {
        clerkId: id,
      },
      update: {
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email: emailAddresses[0].emailAddress || "",
        username: username || null,
      },
      create: {
        clerkId: id,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        email: emailAddresses[0].emailAddress || "",
        username: username || null,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const currentUserRole = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: true, error: "No authenticate user found" };
    }

    const { id } = user;

    const userRole = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
      select: {
        role: true,
      },
    });

    return userRole?.role;
  } catch (error) {
    console.log(console.log(error));
  }
};

// export const getCurrentUserData = async () => {
//   try {
//     const user = await currentUser();

//     if (!user) {
//       return { success: true, error: "No authenticate user found" };
//     }

//     const {id} = user;

//     const data= await prisma.user.findUnique({
//         where:{
//             clerkId: id
//         },
//         select:{

//         }
//     })
//   } catch (error) {}
// };
