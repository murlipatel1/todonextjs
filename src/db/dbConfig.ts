import mongoose from "mongoose";

export async function Connect() {
  try {
    await mongoose.connect(process.env.DATABASE_URL!,{serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000        });

    const connection = await mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection error" + err);
      process.exit(1);
    });
  } catch (error) {
    console.log("something goes wrong!");
    console.log(error);
  }
}
