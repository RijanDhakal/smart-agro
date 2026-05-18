"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearestProducts = exports.searchProduct = exports.getProduct = exports.buyProduct = exports.getProducts = exports.createProductFromVoice = exports.createProduct = void 0;
const APIresponse_1 = __importDefault(require("../utility/APIresponse"));
const AyncHandler_1 = __importDefault(require("../utility/AyncHandler"));
const Errorhandler_1 = __importDefault(require("../utility/Errorhandler"));
const genai_1 = require("@google/genai");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
const ConnectDB_1 = require("../Database/ConnectDB");
const uploadToCloudinary_1 = __importDefault(require("../utility/uploadToCloudinary"));
// Elleven labs speech to text
const speechToText = async (audioFile) => {
    const API_KEY = process.env.EllevenLabs_API_KEy;
    if (!API_KEY) {
        throw new Errorhandler_1.default({
            statusCode: 500,
            message: "Internal server error  API key missing",
        });
    }
    const form = new form_data_1.default();
    const fileStream = fs_1.default.createReadStream(audioFile.path);
    const filename = audioFile.originalname || path_1.default.basename(audioFile.path);
    form.append("file", fileStream, {
        filename,
        contentType: audioFile.mimetype || "audio/mpeg",
    });
    form.append("model_id", "scribe_v1");
    form.append("language_code", "ne");
    try {
        const response = await axios_1.default.post("https://api.elevenlabs.io/v1/speech-to-text", form, {
            headers: {
                "xi-api-key": API_KEY,
                ...form.getHeaders(),
            },
            maxBodyLength: Infinity,
        });
        return response.data.text;
    }
    catch (err) {
        const apiMsg = err.response?.data?.detail?.[0]?.msg ||
            err.response?.data?.detail?.message ||
            err.message ||
            "Unknown error";
        throw new Errorhandler_1.default({
            statusCode: err.response?.status || 500,
            message: `Speech-to-text failed: ${apiMsg}`,
        });
    }
    finally {
        fs_1.default.unlinkSync(audioFile.path);
    }
};
// Gemini text enhancer + JSON manager
const AI_enhancer = async (textToEnhance) => {
    const ai = new genai_1.GoogleGenAI({
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
    }
    catch (error) {
        console.log(error);
    }
};
const createProductFromVoice = (0, AyncHandler_1.default)(async (req, res) => {
    const voiceAudio = req.file;
    if (voiceAudio) {
        try {
            const speechToTextResponse = await speechToText(voiceAudio);
            const inhanced_response = await AI_enhancer(speechToTextResponse);
            return res.status(200).json(new APIresponse_1.default({
                data: inhanced_response,
                statusCode: 200,
                message: "Voice audio fetched sucessfully !",
            }));
        }
        catch (error) {
            console.log("error : ", error);
            throw new Errorhandler_1.default({
                message: "Internal server error",
                statusCode: 500,
            });
        }
    }
    else {
        throw new Errorhandler_1.default({
            message: "Voice audio not received",
            statusCode: 404,
        });
    }
});
exports.createProductFromVoice = createProductFromVoice;
const createProduct = (0, AyncHandler_1.default)(async (req, res) => {
    const { description, price, productName, sellerId, quantity, expectedLifeSpan, } = req.body;
    const picture = req.file;
    let image_url;
    try {
        if (!picture) {
            image_url = "";
        }
        else {
            const pictureUpload = await (0, uploadToCloudinary_1.default)(picture?.path);
            image_url = pictureUpload?.url;
        }
    }
    catch (error) {
        console.log(error);
    }
    if ([description, price, productName, sellerId, quantity].some((field) => field === "" || !field)) {
        throw new Errorhandler_1.default({
            statusCode: 404,
            message: "All fields are required !",
        });
    }
    try {
        const createProduct = await ConnectDB_1.prisma.product.create({
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
            throw new Errorhandler_1.default({
                message: "Internal server occured ! (create product)",
                statusCode: 500,
            });
        }
        return res.status(200).json(new APIresponse_1.default({
            statusCode: 200,
            message: "Product created sucessfully",
            data: createProduct,
        }));
    }
    catch (error) {
        console.log(error);
        throw new Errorhandler_1.default({
            statusCode: 500,
            message: "Internal Server error !",
        });
    }
});
exports.createProduct = createProduct;
const getProduct = (0, AyncHandler_1.default)(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        throw new Errorhandler_1.default({
            message: "Product Not available",
            statusCode: 500,
        });
    }
    const product = await ConnectDB_1.prisma.product.findUnique({
        where: {
            productId: productId,
        },
        include: {
            seller: true,
        },
    });
    if (!product) {
        throw new Errorhandler_1.default({
            message: "Product Not found",
            statusCode: 500,
        });
    }
    return res.status(200).json(new APIresponse_1.default({
        data: product,
        statusCode: 200,
        message: "Product fetced sucessfully !",
    }));
});
exports.getProduct = getProduct;
const getProducts = (0, AyncHandler_1.default)(async (req, res) => {
    try {
        const products = await ConnectDB_1.prisma.product.findMany();
        return res.status(200).json(new APIresponse_1.default({
            data: products,
            statusCode: 200,
            message: "Products fetched sucessfully",
        }));
    }
    catch (error) {
        console.log(error);
        throw new Errorhandler_1.default({
            message: "Internal server occured ! (create product)",
            statusCode: 500,
        });
    }
});
exports.getProducts = getProducts;
const buyProduct = (0, AyncHandler_1.default)(async (req, res) => {
    const { productId, userId, paymentMethod, quantity, address } = req.body;
    if ([productId, userId, paymentMethod, quantity].some((field) => field === undefined || field === null || field === "")) {
        throw new Errorhandler_1.default({
            message: "All Fields are required",
            statusCode: 400,
        });
    }
    const isProductAvailable = await ConnectDB_1.prisma.product.findUnique({
        where: {
            productId: productId,
        },
    });
    if (!isProductAvailable) {
        throw new Errorhandler_1.default({
            message: "Product not available",
            statusCode: 500,
        });
    }
    const isClientAvailable = await ConnectDB_1.prisma.user.findUnique({
        where: {
            userId: userId,
        },
    });
    if (!isClientAvailable) {
        const isFarmerAvailable = await ConnectDB_1.prisma.farmer.findUnique({
            where: {
                farmerID: userId,
            },
        });
        if (!isFarmerAvailable) {
            throw new Errorhandler_1.default({
                message: "user not available",
                statusCode: 500,
            });
        }
    }
    try {
        const createOrder = await ConnectDB_1.prisma.order.create({
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
            throw new Errorhandler_1.default({
                message: "Internal server error [creating order]",
                statusCode: 500,
            });
        }
        return res.status(200).json(new APIresponse_1.default({
            data: createOrder,
            statusCode: 200,
            message: "Product Ordered sucessfully",
        }));
    }
    catch (error) {
        console.log(error);
        throw new Errorhandler_1.default({
            message: "Internal server error",
            statusCode: 500,
        });
    }
});
exports.buyProduct = buyProduct;
const searchProduct = (0, AyncHandler_1.default)(async (req, res) => {
    const { search } = req.query;
    if (!search)
        return;
    const fetchedProducts = await ConnectDB_1.prisma.product.findMany({
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
    return res.status(200).json(new APIresponse_1.default({
        data: fetchedProducts,
        message: "product searched",
        statusCode: 200,
    }));
});
exports.searchProduct = searchProduct;
// haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
const getNearestProducts = (0, AyncHandler_1.default)(async (req, res) => {
    const { userId } = req.params;
    let user;
    try {
        user = await ConnectDB_1.prisma.user.findUnique({
            where: {
                userId: userId,
            },
        });
    }
    catch (error) {
        user = await ConnectDB_1.prisma.farmer.findUnique({
            where: {
                farmerID: userId,
            },
        });
    }
    if (!user)
        return;
    const userLat = typeof user?.latitude === "string"
        ? parseFloat(user.latitude)
        : typeof user?.latitude === "number"
            ? user.latitude
            : NaN;
    const userLng = typeof user?.longitude === "string"
        ? parseFloat(user.longitude)
        : typeof user?.longitude === "number"
            ? user.longitude
            : NaN;
    const farmers = await ConnectDB_1.prisma.farmer.findMany({
        include: {
            products: true,
        },
    });
    const parseCoord = (v) => typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
    const nearbyFarmers = farmers
        .map((f) => {
        const distance = getDistanceFromLatLonInKm(userLat, userLng, parseCoord(f.latitude), parseCoord(f.longitude));
        return { ...f, distance };
    })
        .filter((f) => f.distance <= 10) // only within 10 km
        .sort((a, b) => a.distance - b.distance); // nearest first
    const products = [];
    nearbyFarmers.forEach((farmer) => {
        if (farmer.products.length !== 0) {
            products.push(farmer.products);
        }
    });
    return res.status(200).json(new APIresponse_1.default({
        statusCode: 200,
        data: products,
        message: "nearby products fetched",
    }));
});
exports.getNearestProducts = getNearestProducts;
