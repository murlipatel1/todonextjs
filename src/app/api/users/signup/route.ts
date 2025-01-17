import {Connect} from "@/db/dbConfig";
import User from "@/models/userModel";
import {NextRequest, NextResponse} from "next/server";
import bcryptjs from "bcryptjs";

Connect();

export async function POST(request: NextRequest) {
	try {
		//getting data form frontend body
		const reqBody = await request.json();

		const {username, email, password} = reqBody;

		//check if the user is exists
		const user = await User.findOne({email});
		console.log(user);
		if (user) {
			return NextResponse.json({error: "User already exists"}, {status: 400});
		}

		//hashing password
		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		const newUser = new User({username, email, password: hashedPassword});

		const savedUser = await newUser.save();
		console.log(savedUser);

		return NextResponse.json({
			message: "User created successfully",
			success: true,
			savedUser,
		});
	} catch (error) {
		return NextResponse.json({error: error}, {status: 500});
	}
}
