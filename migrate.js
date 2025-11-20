import mongoose from "mongoose";
import ProductVariantModel from "./models/ProductVariantModel.js";

// !! ADD YOUR DATABASE CONNECTION LOGIC HERE !!
// Example:
mongoose
  .connect(
    "mongodb+srv://sguchhaitdev:9ZTuzc1lVdRwqS2M@cluster0.nwoc9jf.mongodb.net/next_ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB connected. Running migration...");
    runMigration();
  })
  .catch((err) => console.error(err));

async function runMigration() {
  console.log("Starting migration...");

  try {
    const result = await ProductVariantModel.updateMany(
      {
        // Find documents where any of these fields are an array
        $or: [
          { weight: { $type: "array" } },
          { cream: { $type: "array" } },
          { flavour: { $type: "array" } },
          { dietary: { $type: "array" } },
        ],
      },
      [
        // Use an aggregation pipeline to update
        {
          $set: {
            // Set the field to the first element of the existing array
            weight: { $arrayElemAt: ["$weight", 0] },
            cream: { $arrayElemAt: ["$cream", 0] },
            flavour: { $arrayElemAt: ["$flavour", 0] },
            dietary: { $arrayElemAt: ["$dietary", 0] },
          },
        },
      ]
    );

    console.log("Migration complete!");
    console.log(`Documents matched: ${result.matchedCount}`);
    console.log(`Documents modified: ${result.modifiedCount}`);
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    // Close the connection after the script is done
    await mongoose.connection.close();
  }
}

// ----
// ⚠️ IMPORTANT:
// Make sure you have your mongoose.connect() call above
// for this script to work.
// ----
