import Query from "../Model/bookingSchema.js";

// ─────────────────────────────────────────
// Helper: generate next Query ID
// Format: ASA{year}{runningNumber}
// Running number starts at 100 and is global
// (not reset per year — just the prefix changes)
// ─────────────────────────────────────────
async function generateQueryId() {
  const year   = new Date().getFullYear();
  const prefix = `ASA${year}`;

  // Count ALL queries that have this year's prefix
  const count = await Query.countDocuments({
    queryId: { $regex: `^${prefix}` }
  });

  return `${prefix}${100 + count}`;
}

// ─────────────────────────────────────────
// @desc    Get next Query ID (for frontend display)
// @route   GET /api/queries/next-id
// ─────────────────────────────────────────
export const getNextQueryId = async (req, res) => {
  try {
    const queryId = await generateQueryId();
    res.status(200).json({ success: true, message: "Next query ID generated", data: null, queryId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ─────────────────────────────────────────
// @desc    Create Query
// @route   POST /api/queries
// ─────────────────────────────────────────
export const createQuery = async (req, res) => {
  try {
    const {
      queryId: providedId,
      clientName, email, mobile, address,
      destination, pickupPoint, dropPoint,
      arrivalDate, departureDate, noOfDays,
      adults, childEB, childNoEB, childU5, rooms,
      hotelCategory, mealPlan,
    } = req.body;

    if (!clientName) {
      return res.status(400).json({ success: false, message: "Client / Agent name is required", data: null });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required", data: null });
    }
    if (!destination) {
      return res.status(400).json({ success: false, message: "Destination is required", data: null });
    }

    // Use provided ID or generate one (handles race conditions gracefully)
    let queryId = providedId;
    if (!queryId) {
      queryId = await generateQueryId();
    } else {
      // Make sure provided ID isn't already taken (race condition)
      const exists = await Query.findOne({ queryId });
      if (exists) queryId = await generateQueryId();
    }

    const query = await Query.create({
      queryId,
      clientName, email, mobile, address,
      destination, pickupPoint, dropPoint,
      arrivalDate:   arrivalDate   ? new Date(arrivalDate)   : undefined,
      departureDate: departureDate ? new Date(departureDate) : undefined,
      noOfDays,
      adults:    Number(adults)   || 0,
      childEB:   Number(childEB)  || 0,
      childNoEB: Number(childNoEB)|| 0,
      childU5:   Number(childU5)  || 0,
      rooms:     Number(rooms)    || 0,
      hotelCategory: hotelCategory || "",
      mealPlan:      mealPlan      || "",
      status: "confirmed",
    });

    res.status(201).json({ success: true, message: "Query created successfully", data: query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ─────────────────────────────────────────
// @desc    Get All Queries
//          Filters: status, search (clientName / queryId / destination)
// @route   GET /api/queries?status=confirmed&search=john
// ─────────────────────────────────────────
export const getAllQueries = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    // Status filter (default: confirmed)
    if (status && ["confirmed", "cancelled"].includes(status)) {
      filter.status = status;
    } else {
      filter.status = "confirmed";
    }

    // Search filter: clientName OR queryId OR destination
    if (search) {
      filter.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { queryId:    { $regex: search, $options: "i" } },
        { destination:{ $regex: search, $options: "i" } },
      ];
    }

    const queries = await Query.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: "Queries fetched successfully", data: queries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ─────────────────────────────────────────
// @desc    Get Single Query by ID
// @route   GET /api/queries/:id
// ─────────────────────────────────────────
export const getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ success: false, message: "Query not found", data: null });
    }
    res.status(200).json({ success: true, message: "Query fetched successfully", data: query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ─────────────────────────────────────────
// @desc    Update Query by ID (full update from edit modal)
// @route   PUT /api/queries/:id
// ─────────────────────────────────────────
export const updateQuery = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "No data provided to update", data: null });
    }

    // Prevent queryId from being changed
    delete req.body.queryId;

    // Prevent re-confirming a cancelled query via full update
    const existing = await Query.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Query not found", data: null });
    }
    if (existing.status === "cancelled" && req.body.status === "confirmed") {
      return res.status(400).json({ success: false, message: "Cannot revert a cancelled query", data: null });
    }

    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Query updated successfully", data: query });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message, data: null });
  }
};

// ─────────────────────────────────────────
// @desc    Update Query Status only
//          Business rule: confirmed → cancelled only, not reversible
// @route   PATCH /api/queries/:id/status
// ─────────────────────────────────────────
export const updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value", data: null });
    }

    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ success: false, message: "Query not found", data: null });
    }

    // Business rule: cannot revert cancelled → confirmed
    if (query.status === "cancelled" && status === "confirmed") {
      return res.status(400).json({ success: false, message: "Cannot revert a cancelled query", data: null });
    }

    query.status = status;
    await query.save();

    res.status(200).json({ success: true, message: `Query status updated to ${status}`, data: query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};