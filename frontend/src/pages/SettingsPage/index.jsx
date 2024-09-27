import { useState } from "react";
import ProfileSection from "./components/ProfileSection";
import AccountSetting from "./components/AccountSetting";
import NotificationSetting from "./components/NotificationSetting";
import AccountDisplay from "./components/AccountDisplay";
import { IoIosClose } from "react-icons/io";
import { UserAtom } from "../../atoms/UserAtom";
import { useRecoilValue } from "recoil"; // Import useSetRecoilState
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const currentUser = useRecoilValue(UserAtom);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isChangeRecoveryEmail, setIsChangeRecoveryEmail] = useState(false);
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    id: currentUser?.id,
    name: currentUser.name || "Default Name",  
    email: currentUser.email || "default@example.com",  
    contactNumber: currentUser.contact_number || "000-000-0000",  
    recoveryEmail: currentUser.recovery_email || "recovery@example.com"
  });

  const handleSaveRecoveryEmail = async (newRecoveryEmail) => {
    try {
      const response = await axios.put('/auth/update-user-info', {
        recoveryEmail: newRecoveryEmail
      });
      const updatedUserProfile = response.data.user;
      setProfile(prevProfile => ({ ...prevProfile, recoveryEmail: updatedUserProfile.recovery_email }));
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsChangeRecoveryEmail(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSavePassword = async (newPassword) => {
    try {
      await axios.post("/auth/change-password", {newPassword})
      console.log("password changed successfully")
      setIsChangePassword(false);
    } catch (error) {
      console.log(error.message)
    }
  };

  const handleSetProfile = async (updatedProfile) => {
    try {
      const response = await axios.put('/auth/update-user-info', {
        name: updatedProfile.name,
        contactNumber: updatedProfile.contactNumber,
      });
      const updatedUserProfile = response.data.user;
      setProfile(prevProfile => ({ ...prevProfile, name: updatedUserProfile.name, contactNumber: updatedUserProfile.contact_number}));
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="relative w-full text-customBlack1 bg-white mt-10 mb-10 rounded-lg p-10">
      <div className="absolute top-2 right-2 cursor-pointer">
        <IoIosClose size={35} onClick={() => navigate(`/dashboard/${profile.id}`)}/>
      </div>
      <h2 className="text-customGray2 text-3xl font-medium">Settings</h2>
      <div className="flex h-full w-full gap-4 max-md:flex-col max-md:gap-2">
        <div className="w-[600px] ml-5 h-[370px] overflow-y-auto pr-20 pb-10 pt-5 flex flex-col max-md:overflow-y-hidden max-md:h-fit max-md:w-[420px]">
          <div>
            <ProfileSection profile={profile} onSave={handleSetProfile} />
          </div>

          <div className="mt-7">
            <AccountSetting
              profile={profile}
              isChangePassword={isChangePassword}
              isChangeRecoveryEmail={isChangeRecoveryEmail}
              onSaveRecoveryEmail={handleSaveRecoveryEmail}
              onSavePassword={handleSavePassword}
              onCancelPassword={() => setIsChangePassword(false)}
              onCancelRecoveryEmail={() => setIsChangeRecoveryEmail(false)}
              onChangePassword={() => setIsChangePassword(true)}
              onChangeRecoveryEmail={() => setIsChangeRecoveryEmail(true)}
            />
          </div>

          <div className="mt-7">
            <NotificationSetting />
          </div>
        </div>

        <div className="flex-1 border-l-4 border-customGray1 px-10">
          <AccountDisplay profile={profile}/>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;