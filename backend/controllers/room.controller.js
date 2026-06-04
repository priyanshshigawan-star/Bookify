import { Room, Hotel } from "../models/index.js";

// POST /api/room/add
export const addRoom = async (req, res, next) => {
  try {
    const { hotel, roomType, pricePerNight, description, amenities, isAvailable, maxGuests, size, beds } = req.body;
    const images = req.files?.map((f) => f.filename) || [];

    if (!hotel || !roomType || !pricePerNight || !description) {
      return res.status(400).json({ success: false, message: "Hotel, room type, price, and description are required." });
    }

    // Verify hotel belongs to this owner
    const hotelDoc = await Hotel.findById(hotel);
    if (!hotelDoc) return res.status(404).json({ success: false, message: "Hotel not found." });
    if (hotelDoc.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to add rooms to this hotel." });
    }

    const amenitiesArr = typeof amenities === "string"
      ? amenities.split(",").map((a) => a.trim()).filter(Boolean)
      : Array.isArray(amenities) ? amenities : [];

    const newRoom = await Room.create({
      hotel,
      roomType: roomType.trim(),
      pricePerNight: parseFloat(pricePerNight),
      description: description.trim(),
      images,
      amenities: amenitiesArr,
      isAvailable: isAvailable === "true" || isAvailable === true,
      maxGuests: parseInt(maxGuests) || 2,
      size: size || "",
      beds: parseInt(beds) || 1,
    });

    return res.status(201).json({ success: true, message: "Room added successfully!", room: newRoom });
  } catch (error) {
    next(error);
  }
};

// GET /api/room/owner
export const getOwnerRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().populate({
      path: "hotel",
      match: { owner: req.user.id },
      select: "hotelName hotelAddress city rating amenities",
    }).sort({ createdAt: -1 });

    const ownerRooms = rooms.filter((r) => r.hotel);
    return res.json({ success: true, rooms: ownerRooms });
  } catch (error) {
    next(error);
  }
};

// GET /api/room/all
export const getAllRooms = async (req, res, next) => {
  try {
    const { minPrice, maxPrice, roomType, available } = req.query;
    const filter = {};
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = parseFloat(maxPrice);
    }
    if (roomType) filter.roomType = { $regex: roomType, $options: "i" };
    if (available === "true") filter.isAvailable = true;

    const rooms = await Room.find(filter)
      .populate({ path: "hotel", select: "hotelName hotelAddress city amenities rating owner", populate: { path: "owner", select: "name email" } })
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms, total: rooms.length });
  } catch (error) {
    next(error);
  }
};

// GET /api/room/:id
export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate({
      path: "hotel", populate: { path: "owner", select: "name email" }
    });
    if (!room) return res.status(404).json({ success: false, message: "Room not found." });
    res.json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// PUT /api/room/:id
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel");
    if (!room) return res.status(404).json({ success: false, message: "Room not found." });
    if (room.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    const { roomType, pricePerNight, description, amenities, isAvailable, maxGuests } = req.body;
    const updates = {};
    if (roomType) updates.roomType = roomType.trim();
    if (pricePerNight) updates.pricePerNight = parseFloat(pricePerNight);
    if (description) updates.description = description.trim();
    if (isAvailable !== undefined) updates.isAvailable = isAvailable === "true" || isAvailable === true;
    if (maxGuests) updates.maxGuests = parseInt(maxGuests);
    if (req.files?.length) updates.images = req.files.map((f) => f.filename);
    if (amenities) {
      updates.amenities = typeof amenities === "string"
        ? amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : amenities;
    }

    const updated = await Room.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, message: "Room updated.", room: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/room/:id
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel");
    if (!room) return res.status(404).json({ success: false, message: "Room not found." });
    if (room.hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Room deleted successfully." });
  } catch (error) {
    next(error);
  }
};
