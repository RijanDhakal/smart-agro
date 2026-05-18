"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmers = exports.getFarmerProducts = exports.getOrders = exports.verifyFarmerKYC = exports.createUser = void 0;
const AyncHandler_1 = __importDefault(require("../utility/AyncHandler"));
const ConnectDB_1 = require("../Database/ConnectDB");
const APIresponse_1 = __importDefault(require("../utility/APIresponse"));
const Errorhandler_1 = __importDefault(require("../utility/Errorhandler"));
const uploadToCloudinary_1 = __importDefault(require("../utility/uploadToCloudinary"));
const client_1 = require("@prisma/client");
const createUser = (0, AyncHandler_1.default)(async (req, res) => {
    const { username, contact, gmail, identity, latitude, longitude } = req.body;
    const Contact = String(contact);
    if (!username) {
        throw new Errorhandler_1.default({
            statusCode: 404,
            message: "Username is required",
        });
    }
    if (!Contact) {
        throw new Errorhandler_1.default({
            statusCode: 404,
            message: "Conatct is required",
        });
    }
    if (!identity) {
        throw new Errorhandler_1.default({
            statusCode: 404,
            message: "identity is required",
        });
    }
    if (identity === "user") {
        const isUserAvailabe = await ConnectDB_1.prisma.user.findUnique({
            where: {
                contact: Contact,
            },
        });
        if (isUserAvailabe) {
            throw new Errorhandler_1.default({
                statusCode: 400,
                message: "User with contact number already available !",
            });
        }
        const createUser = await ConnectDB_1.prisma.user.create({
            data: {
                username: username,
                contact: Contact,
                gmail: gmail,
                latitude: latitude === undefined ? undefined : Number(latitude),
                longitude: longitude === undefined ? undefined : Number(longitude),
            },
        });
        if (!createUser) {
            throw new Errorhandler_1.default({
                statusCode: 400,
                message: "User not created !",
            });
        }
        return res.status(200).json(new APIresponse_1.default({
            statusCode: 200,
            message: "User created sucessfully",
            data: createUser,
        }));
    }
    if (identity === "farmer") {
        const isFarmerAvailable = await ConnectDB_1.prisma.farmer.findUnique({
            where: { contact: Contact },
        });
        if (isFarmerAvailable) {
            throw new Errorhandler_1.default({
                statusCode: 400,
                message: "Farmer with contact number already available!",
            });
        }
        if (!(latitude && longitude)) {
            throw new Errorhandler_1.default({
                statusCode: 404,
                message: "Latitude and longitude are required",
            });
        }
        let fetched_address;
        try {
            // Fetch live location
            const apiRes = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=89df02ba673d478597b70cb330b159e7`);
            const data = await apiRes.json();
            const addressObject = data?.features?.[0]?.properties;
            if (addressObject?.city && addressObject?.county) {
                fetched_address = `${addressObject.city}, ${addressObject.county}`;
            }
            else {
                fetched_address =
                    "एक त्रुटि देखा पर्‍यो, कृपया म्यानुअल रूपमा स्थान इनपुट गर्नुहोस्";
            }
        }
        catch {
            fetched_address =
                "एक त्रुटि देखा पर्‍यो, कृपया म्यानुअल रूपमा स्थान इनपुट गर्नुहोस्";
        }
        try {
            const createFarmer = await ConnectDB_1.prisma.farmer.create({
                data: {
                    username,
                    contact: Contact,
                    gmail,
                    address: fetched_address,
                    latitude: latitude === undefined ? undefined : Number(latitude),
                    longitude: longitude === undefined ? undefined : Number(longitude),
                },
            });
            await ConnectDB_1.prisma.user.create({
                data: {
                    userId: createFarmer.farmerID,
                    contact: createFarmer.contact,
                    username: createFarmer.username,
                    latitude: latitude === undefined ? undefined : Number(latitude),
                    longitude: longitude === undefined ? undefined : Number(longitude),
                },
            });
            return res.status(200).json(new APIresponse_1.default({
                statusCode: 200,
                message: "Farmer created successfully",
                data: createFarmer,
            }));
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                const targetField = error.meta?.target?.[0];
                throw new Errorhandler_1.default({
                    statusCode: 409, // Conflict
                    message: `${targetField ?? "Field"} already exists.`,
                });
            }
            throw new Errorhandler_1.default({
                statusCode: 500,
                message: "Database error while creating farmer",
            });
        }
    }
});
exports.createUser = createUser;
const verifyFarmerKYC = (0, AyncHandler_1.default)(async (req, res) => {
    const { farmerId } = req.body;
    const files = req.files;
    const citizenship_front = files["citizenship-front"]?.[0];
    const citizenship_back = files["citizenship-back"]?.[0];
    if (!(citizenship_front && citizenship_back)) {
        throw new Errorhandler_1.default({
            statusCode: 404,
            message: "Files not found",
        });
    }
    const uploadCitizenshipFront = await (0, uploadToCloudinary_1.default)(citizenship_front.path);
    const uploadCitizenshipBack = await (0, uploadToCloudinary_1.default)(citizenship_back.path);
    if (!(uploadCitizenshipFront && uploadCitizenshipBack)) {
        throw new Errorhandler_1.default({
            statusCode: 400,
            message: "Cannot upload the files",
        });
    }
    const updateSellerDB = await ConnectDB_1.prisma.farmer.update({
        where: {
            farmerID: farmerId,
        },
        data: {
            citizenShip_front: uploadCitizenshipFront.url,
            citizenShip_back: uploadCitizenshipBack.url,
            verified: true,
        },
    });
    return res.status(200).json(new APIresponse_1.default({
        statusCode: 200,
        message: "KYC uploaded sucessfully wait for verification",
        data: updateSellerDB,
    }));
});
exports.verifyFarmerKYC = verifyFarmerKYC;
const getOrders = (0, AyncHandler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const findUserOrders = await ConnectDB_1.prisma.order.findMany({
        where: {
            userId: userId,
        },
        include: {
            Product: true,
        },
    });
    return res.status(200).json(new APIresponse_1.default({
        data: findUserOrders,
        statusCode: 200,
        message: "User orders fetched sucessfully",
    }));
});
exports.getOrders = getOrders;
const getFarmerProducts = (0, AyncHandler_1.default)(async (req, res) => {
    const { farmerId } = req.params;
    if (!farmerId) {
        throw new Errorhandler_1.default({
            statusCode: 404,
            message: "Farmer id not found",
        });
    }
    const farmersOldProducts = await ConnectDB_1.prisma.farmer.findUnique({
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
    return res.status(200).json(new APIresponse_1.default({
        data: farmersOldProducts,
        statusCode: 200,
        message: "Farmers sold items fetched sucessfully !",
    }));
});
exports.getFarmerProducts = getFarmerProducts;
const getFarmers = (0, AyncHandler_1.default)(async (req, res) => {
    const farmers = await ConnectDB_1.prisma.farmer.findMany();
    return res.status(200).json(new APIresponse_1.default({
        data: farmers,
        statusCode: 200,
        message: "User fetched !",
    }));
});
exports.getFarmers = getFarmers;
