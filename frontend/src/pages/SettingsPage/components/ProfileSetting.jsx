import { useState } from "react";

const ProfileInput = ({profile}) => {
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-2 text-lg">
        <input
          className="text-customGray2 px-2 border-2 border-customGray1 ml-2"
          placeholder=""
          type="text"
          name="name"
          value={updatedProfile.name}
          onChange={handleInputChange}
        />
        <input
          className="text-customGray2 px-2 border-2 border-customGray1  ml-2"
          placeholder="Current Password"
          type="email"
          name="email"
          value={updatedProfile.email}
          onChange={handleInputChange}
        />
        <input
          className="text-customGray2 px-2 border-2 border-customGray1  ml-2"
          placeholder="Current Password"
          type="text"
          name="contact"
          value={updatedProfile.contact}
          onChange={handleInputChange}
        />
    </div>
  );
};

export default ProfileInput;
