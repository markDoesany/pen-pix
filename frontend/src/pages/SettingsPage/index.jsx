import { useState } from "react";
import ProfileSection from "./components/ProfileSection";
import AccountSetting from "./components/AccountSetting";
import NotificationSetting from "./components/NotificationSetting";
import AccountDisplay from "./components/AccountDisplay";
import { IoIosClose } from "react-icons/io";

const SettingsPage = () => {
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isChangeRecoveryEmail, setIsChangeRecoveryEmail] = useState(false);

  const [profile, setProfile] = useState({
    name: "Mark Teofel Cernal",
    email: "20103214@usc.edu.ph",
    contact: "09565546454",
  });

  const [account, setAccount] = useState({
    recoveryEmail: "13h123h@gmail.com",
  });

  const handleSaveAccount = (updatedAccount) => {
    setAccount(updatedAccount);
    setIsChangePassword(false);
    setIsChangeRecoveryEmail(false);
  };

  return (
    <div className="relative w-full text-customBlack1 bg-white mt-10 mb-10 rounded-lg p-10">
      <div className="absolute top-2 right-2 cursor-pointer">
        <IoIosClose size={35}/>
      </div>
      <h2 className="text-customGray2 text-3xl font-medium">Settings</h2>
      <div className="flex h-full w-full gap-4">
        <div className="w-[600px] ml-5 h-[370px] overflow-y-auto pr-20 pb-10 pt-5 flex flex-col"> {/* Define height and enable scrolling */}
          <div>
            <ProfileSection profile={profile} onSave={setProfile} />
          </div>

          <div className="mt-7">
            <AccountSetting
              account={account}
              isChangePassword={isChangePassword}
              isChangeRecoveryEmail={isChangeRecoveryEmail}
              onSave={handleSaveAccount}
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

          <div className="flex-1 max-md:hidden border-l-4 border-customGray1 px-10">
            <AccountDisplay/>
          </div>
      </div>
    </div>
  );
};

export default SettingsPage;
