import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { Link } from "react-router-dom";
import './styles/styles.css'; // Include your custom styles here

const AccountDisplay = ({ profile, onUploadProfileImage }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(profile.profileImageUrl); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      onUploadProfileImage(file);
      setImageUrl(URL.createObjectURL(file)); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-full h-full">
      <div className="flex flex-col items-center">
        <div className="relative group w-fit cursor-pointer">
          <label className="cursor-pointer">
            {imageUrl ? <img 
              src={imageUrl} // Use the uploaded image or a default image
              alt="Profile"
              className="relative z-10 rounded-full w-32 h-32 object-cover" // Add styling for the image
            /> : 
              <FaUserCircle size={120} color="gray"/>
            }
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full z-20 transition-opacity duration-300">
              <span className="text-white font-semibold text-sm flex items-center gap-1">
                <HiMiniPencilSquare size={20} />
                Edit Profile
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" // Hide the input but keep it functional
            />
          </label>
        </div>

        <p className="font-bold text-xl mt-3">{profile.name}</p>
        <p>{profile.email}</p>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="font-bold text-md text-center">Facilitating:</h2>
        <div className="flex flex-col items-center gap-1 mt-5 text-customGray2">
          <Link to={"#"}>CPE 2301 | Group 1 2:30pm - 5:00 am</Link>
          <Link to={"#"}>CPE 2301 | Group 1 2:30pm - 5:00 am</Link>
          <Link to={"#"}>CPE 2301 | Group 1 2:30pm - 5:00 am</Link>
        </div>
        <Link to={`/classes/${profile.id}`} className="underline text-customGray3 mt-2">View All Classes</Link>
      </div>
    </div>
  );
};

export default AccountDisplay;
