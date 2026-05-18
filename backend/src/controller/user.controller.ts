import { Request, Response } from "express";
import asyncHandeler from "../utility/AyncHandler";
import { prisma } from "../Database/ConnectDB";
import APIresponse from "../utility/APIresponse";
import Errorhandler from "../utility/Errorhandler";
import uploadOnCloud from "../utility/uploadToCloudinary";
import { Prisma } from "@prisma/client";

interface createUser {
  username: string;
  contact: string;
  gmail: string;
  identity: "user" | "farmer";
  latitude?: number;
  longitude?: number;
}

const createUser = asyncHandeler(
  async (req: Request<{}, {}, createUser>, res) => {
    const { username, contact, gmail, identity, latitude, longitude } =
      req.body;
    const Contact = String(contact);
    if (!username) {
      throw new Errorhandler({
        statusCode: 404,
        message: "Username is required",
      });
    }
    if (!Contact) {
      throw new Errorhandler({
        statusCode: 404,
        message: "Conatct is required",
      });
    }
    if (!identity) {
      throw new Errorhandler({
        statusCode: 404,
        message: "identity is required",
      });
    }
    if (identity === "user") {
      const isUserAvailabe = await prisma.user.findUnique({
        where: {
          contact: Contact,
        },
      });
      if (isUserAvailabe) {
        throw new Errorhandler({
          statusCode: 400,
          message: "User with contact number already available !",
        });
      }
      const createUser = await prisma.user.create({
        data: {
          username: username,
          contact: Contact,
          gmail: gmail,
          latitude: latitude === undefined ? undefined : Number(latitude),
          longitude: longitude === undefined ? undefined : Number(longitude),
        },
      });
      if (!createUser) {
        throw new Errorhandler({
          statusCode: 400,
          message: "User not created !",
        });
      }
      return res.status(200).json(
        new APIresponse({
          statusCode: 200,
          message: "User created sucessfully",
          data: createUser,
        })
      );
    }
    if (identity === "farmer") {
      const isFarmerAvailable = await prisma.farmer.findUnique({
        where: { contact: Contact },
      });
      if (isFarmerAvailable) {
        throw new Errorhandler({
          statusCode: 400,
          message: "Farmer with contact number already available!",
        });
      }
      if (!(latitude && longitude)) {
        throw new Errorhandler({
          statusCode: 404,
          message: "Latitude and longitude are required",
        });
      }
      let fetched_address;
      try {
        // Fetch live location
        const apiRes = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=89df02ba673d478597b70cb330b159e7`
        );
        const data = await apiRes.json();
        const addressObject = data?.features?.[0]?.properties;

        if (addressObject?.city && addressObject?.county) {
          fetched_address = `${addressObject.city}, ${addressObject.county}`;
        } else {
          fetched_address =
            "एक त्रुटि देखा पर्‍यो, कृपया म्यानुअल रूपमा स्थान इनपुट गर्नुहोस्";
        }
      } catch {
        fetched_address =
          "एक त्रुटि देखा पर्‍यो, कृपया म्यानुअल रूपमा स्थान इनपुट गर्नुहोस्";
      }
      try {
        const createFarmer = await prisma.farmer.create({
          data: {
            username,
            contact: Contact,
            gmail,
            address: fetched_address,
            latitude: latitude === undefined ? undefined : Number(latitude),
            longitude: longitude === undefined ? undefined : Number(longitude),
          },
        });
        await prisma.user.create({
          data: {
            userId: createFarmer.farmerID,
            contact: createFarmer.contact,
            username: createFarmer.username,
            latitude: latitude === undefined ? undefined : Number(latitude),
            longitude: longitude === undefined ? undefined : Number(longitude),
          },
        });
        return res.status(200).json(
          new APIresponse({
            statusCode: 200,
            message: "Farmer created successfully",
            data: createFarmer,
          })
        );
      } catch (error: any) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          const targetField = (error.meta?.target as string[])?.[0];
          throw new Errorhandler({
            statusCode: 409, // Conflict
            message: `${targetField ?? "Field"} already exists.`,
          });
        }
        throw new Errorhandler({
          statusCode: 500,
          message: "Database error while creating farmer",
        });
      }
    }
  }
);

const verifyFarmerKYC = asyncHandeler(async (req, res) => {
  const { farmerId } = req.body;
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const citizenship_front = files["citizenship-front"]?.[0];
  const citizenship_back = files["citizenship-back"]?.[0];
  if (!(citizenship_front && citizenship_back)) {
    throw new Errorhandler({
      statusCode: 404,
      message: "Files not found",
    });
  }
  const uploadCitizenshipFront = await uploadOnCloud(citizenship_front.path);
  const uploadCitizenshipBack = await uploadOnCloud(citizenship_back.path);
  if (!(uploadCitizenshipFront && uploadCitizenshipBack)) {
    throw new Errorhandler({
      statusCode: 400,
      message: "Cannot upload the files",
    });
  }
  const updateSellerDB = await prisma.farmer.update({
    where: {
      farmerID: farmerId,
    },
    data: {
      citizenShip_front: uploadCitizenshipFront.url,
      citizenShip_back: uploadCitizenshipBack.url,
      verified: true,
    },
  });
  return res.status(200).json(
    new APIresponse({
      statusCode: 200,
      message: "KYC uploaded sucessfully wait for verification",
      data: updateSellerDB,
    })
  );
});

const getOrders = asyncHandeler(async (req, res) => {
  const { userId } = req.params;
  const findUserOrders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      Product: true,
    },
  });
  return res.status(200).json(
    new APIresponse({
      data: findUserOrders,
      statusCode: 200,
      message: "User orders fetched sucessfully",
    })
  );
});

const getFarmerProducts = asyncHandeler(async (req, res) => {
  const { farmerId } = req.params;
  if (!farmerId) {
    throw new Errorhandler({
      statusCode: 404,
      message: "Farmer id not found",
    });
  }
  const farmersOldProducts = await prisma.farmer.findUnique({
    where: {
      farmerID: farmerId,
    },
    include: {
      products: {
        include: {
          order: {
            include: {
              Product: true,
              user: true,
            },
          },
        },
      },
    },
  });
  return res.status(200).json(
    new APIresponse({
      data: farmersOldProducts,
      statusCode: 200,
      message: "Farmers sold items fetched sucessfully !",
    })
  );
});

const getFarmers = asyncHandeler(async (req, res) => {
  const farmers = await prisma.farmer.findMany();
  return res.status(200).json(
    new APIresponse({
      data: farmers,
      statusCode: 200,
      message: "User fetched !",
    })
  );
});

export {
  createUser,
  verifyFarmerKYC,
  getOrders,
  getFarmerProducts,
  getFarmers,
};
