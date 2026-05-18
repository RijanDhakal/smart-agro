import APIresponse from "../utility/APIresponse";
import asyncHandeler from "../utility/AyncHandler";
import Errorhandler from "../utility/Errorhandler";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";
import { Request } from "express";
import { prisma } from "../Database/ConnectDB";
import uploadOnCloud from "../utility/uploadToCloudinary";

interface product {
  productName: string;
  price: string;
  description: string;
  sellerId: string;
  quantity: string;
  expectedLifeSpan?: string;
}

// Elleven labs speech to text
const speechToText = async (audioFile: Express.Multer.File) => {
  const API_KEY = process.env.EllevenLabs_API_KEy;
  if (!API_KEY) {
    throw new Errorhandler({
      statusCode: 500,
      message: "Internal server error  API key missing",
    });
  }
  const form = new FormData();
  const fileStream = fs.createReadStream(audioFile.path);
  const filename = audioFile.originalname || path.basename(audioFile.path);

  form.append("file", fileStream, {
    filename,
    contentType: audioFile.mimetype || "audio/mpeg",
  });
  form.append("model_id", "scribe_v1");
  form.append("language_code", "ne");
  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/speech-to-text",
      form,
      {
        headers: {
          "xi-api-key": API_KEY,
          ...form.getHeaders(),
        },
        maxBodyLength: Infinity,
      },
    );
    return response.data.text;
  } catch (err: any) {
    const apiMsg =
      err.response?.data?.detail?.[0]?.msg ||
      err.response?.data?.detail?.message ||
      err.message ||
      "Unknown error";

    throw new Errorhandler({
      statusCode: err.response?.status || 500,
      message: `Speech-to-text failed: ${apiMsg}`,
    });
  } finally {
    fs.unlinkSync(audioFile.path);
  }
};


// Gemini text enhancer + JSON manager
const AI_enhancer = async (textToEnhance: string) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API,
  });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
    Generate a JSON object with:
    note that Everything must be in nepali language in UTF-8 format like the nepali characters should be clear and easily readable
    -This is the input ${textToEnhance} , nepali message now you have to filter and enhance it 
    - price detected and only give the price as {value : string , unit : string } 
    - quantity : detect from here input as { value : string , unit : string}
    - expectedLifeSpan : detect from the input vege or fruit type / give maximum
    - name : detect from input (Both eng and Nepali) like {english : englishName , nepali : NepaliName} 
    - description : this "${textToEnhance}" is a message of voice in nepali language given by the nepali farmers where he describes what he have produced and how much quantity . You have to enhance it and make a good product catalog description in nepali language.
    Respond only with JSON.
    `,
    });
    const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return JSON.parse(rawText.trim().replace(/^```json|```$/g, ""));
  } catch (error) {
    console.log(error);
  }
};

const createProductFromVoice = asyncHandeler(async (req, res) => {
  const voiceAudio = req.file;
  if (voiceAudio) {
    try {
      const speechToTextResponse = await speechToText(voiceAudio);
      const inhanced_response = await AI_enhancer(speechToTextResponse);
      return res.status(200).json(
        new APIresponse({
          data: inhanced_response,
          statusCode: 200,
          message: "Voice audio fetched sucessfully !",
        }),
      );
    } catch (error) {
      console.log("error : ", error);
      throw new Errorhandler({
        message: "Internal server error",
        statusCode: 500,
      });
    }
  } else {
    throw new Errorhandler({
      message: "Voice audio not received",
      statusCode: 404,
    });
  }
});

const createProduct = asyncHandeler(
  async (req: Request<{}, {}, product>, res) => {
    const {
      description,
      price,
      productName,
      sellerId,
      quantity,
      expectedLifeSpan,
    } = req.body;
    const picture = req.file;
    let image_url;
    try {
      if (!picture) {
        image_url = "";
      } else {
        const pictureUpload = await uploadOnCloud(picture?.path);
        image_url = pictureUpload?.url;
      }
    } catch (error) {
      console.log(error);
    }
    if (
      [description, price, productName, sellerId, quantity].some(
        (field) => field === "" || !field,
      )
    ) {
      throw new Errorhandler({
        statusCode: 404,
        message: "All fields are required !",
      });
    }
    try {
      const createProduct = await prisma.product.create({
        data: {
          productName: productName,
          price: price,
          description: description,
          quantity: quantity,
          expectedLifeSpan: expectedLifeSpan,
          productImage: image_url,
          seller: {
            connect: {
              farmerID: sellerId,
            },
          },
        },
      });
      if (!createProduct) {
        throw new Errorhandler({
          message: "Internal server occured ! (create product)",
          statusCode: 500,
        });
      }
      return res.status(200).json(
        new APIresponse({
          statusCode: 200,
          message: "Product created sucessfully",
          data: createProduct,
        }),
      );
    } catch (error) {
      console.log(error);
      throw new Errorhandler({
        statusCode: 500,
        message: "Internal Server error !",
      });
    }
  },
);

const getProduct = asyncHandeler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new Errorhandler({
      message: "Product Not available",
      statusCode: 500,
    });
  }
  const product = await prisma.product.findUnique({
    where: {
      productId: productId,
    },
    include: {
      seller: true,
    },
  });
  if (!product) {
    throw new Errorhandler({
      message: "Product Not found",
      statusCode: 500,
    });
  }
  return res.status(200).json(
    new APIresponse({
      data: product,
      statusCode: 200,
      message: "Product fetced sucessfully !",
    }),
  );
});

const getProducts = asyncHandeler(async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json(
      new APIresponse({
        data: products,
        statusCode: 200,
        message: "Products fetched sucessfully",
      }),
    );
  } catch (error) {
    console.log(error);
    throw new Errorhandler({
      message: "Internal server occured ! (create product)",
      statusCode: 500,
    });
  }
});

const buyProduct = asyncHandeler(
  async (
    req: Request<
      {},
      {},
      {
        productId: string;
        userId: string;
        paymentMethod: "COD" | "esewa";
        quantity: number;
        address: string;
      }
    >,
    res,
  ) => {
    const { productId, userId, paymentMethod, quantity, address } = req.body;
    if (
      [productId, userId, paymentMethod, quantity].some(
        (field) => field === undefined || field === null || field === "",
      )
    ) {
      throw new Errorhandler({
        message: "All Fields are required",
        statusCode: 400,
      });
    }
    const isProductAvailable = await prisma.product.findUnique({
      where: {
        productId: productId,
      },
    });
    if (!isProductAvailable) {
      throw new Errorhandler({
        message: "Product not available",
        statusCode: 500,
      });
    }
    const isClientAvailable = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!isClientAvailable) {
      const isFarmerAvailable = await prisma.farmer.findUnique({
        where: {
          farmerID: userId,
        },
      });
      if (!isFarmerAvailable) {
        throw new Errorhandler({
          message: "user not available",
          statusCode: 500,
        });
      }
    }
    try {
      const createOrder = await prisma.order.create({
        data: {
          userId: userId,
          PaymentMethod: paymentMethod,
          orderStatus: "ORDERED",
          quantity: quantity,
          address: address,
          productId: productId,
        },
        include: {
          Product: true,
        },
      });
      if (!createOrder) {
        throw new Errorhandler({
          message: "Internal server error [creating order]",
          statusCode: 500,
        });
      }
      return res.status(200).json(
        new APIresponse({
          data: createOrder,
          statusCode: 200,
          message: "Product Ordered sucessfully",
        }),
      );
    } catch (error) {
      console.log(error);
      throw new Errorhandler({
        message: "Internal server error",
        statusCode: 500,
      });
    }
  },
);

const searchProduct = asyncHandeler(async (req: Request, res) => {
  const { search } = req.query as { search?: string };
  if (!search) return;
  const fetchedProducts = await prisma.product.findMany({
    where: {
      OR: [
        {
          productName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return res.status(200).json(
    new APIresponse({
      data: fetchedProducts,
      message: "product searched",
      statusCode: 200,
    }),
  );
});

// haversine formula
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const getNearestProducts = asyncHandeler(async (req, res) => {
  const { userId } = req.params;
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
  } catch (error) {
    user = await prisma.farmer.findUnique({
      where: {
        farmerID: userId,
      },
    });
  }
  if (!user) return;
  const userLat =
    typeof user?.latitude === "string"
      ? parseFloat(user.latitude)
      : typeof user?.latitude === "number"
        ? user.latitude
        : NaN;
  const userLng =
    typeof user?.longitude === "string"
      ? parseFloat(user.longitude)
      : typeof user?.longitude === "number"
        ? user.longitude
        : NaN;
  const farmers = await prisma.farmer.findMany({
    include: {
      products: true,
    },
  });

  const parseCoord = (v: string | number | null | undefined): number =>
    typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;

  const nearbyFarmers = farmers
    .map((f) => {
      const distance = getDistanceFromLatLonInKm(
        userLat,
        userLng,
        parseCoord(f.latitude),
        parseCoord(f.longitude),
      );
      return { ...f, distance };
    })
    .filter((f) => f.distance <= 10) // only within 10 km
    .sort((a, b) => a.distance - b.distance); // nearest first
  const products: any = [];
  nearbyFarmers.forEach((farmer) => {
    if (farmer.products.length !== 0) {
      products.push(farmer.products);
    }
  });
  return res.status(200).json(
    new APIresponse({
      statusCode: 200,
      data: products,
      message: "nearby products fetched",
    }),
  );
});

export {
  createProduct,
  createProductFromVoice,
  getProducts,
  buyProduct,
  getProduct,
  searchProduct,
  getNearestProducts,
};
