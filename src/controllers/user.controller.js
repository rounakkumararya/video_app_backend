import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //form validation
  //check if user already exists
  // check for images, check for avatar
  //upload to cloudinary avatar
  //create user object- create entry in db
  //remove password and refresh token field from response
  //check for user response
  // return res

  const { fullName, email, username, password } = req.body;
  console.log(fullName, email);

  if (
    [fullName, password, username, email].some(field => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existingUser = User.findOne({
    $or: [{ email }, { username }]
  })

  if (existingUser) {
    throw new ApiError(409, "User with email/username already exist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImgLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImgLocalPath)

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering")
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"))

});

export { registerUser };
