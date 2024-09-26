import { useState } from "react";

const AccountSetting = ({
  account,
  isChangePassword,
  isChangeRecoveryEmail,
  onSave,
  onCancelPassword,
  onCancelRecoveryEmail,
  onChangePassword,
  onChangeRecoveryEmail,
}) => {
  const [updatedAccount, setUpdatedAccount] = useState(account);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [passwordError, setPasswordError] = useState(""); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordError("");
    onSave(updatedAccount);
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold">Account</h2>
      <div className="ml-4 flex flex-col gap-3">
        <div className="flex items-center h-10 ">
          <label className="text-customGray2 text-lg">Recovery Email: </label>
          {!isChangeRecoveryEmail ? (
            <span className="ml-2">{updatedAccount.recoveryEmail}</span>
          ) : (
            <input
              className="text-customGray2 px-2 border-2 border-customGray1 ml-2 h-[40px] " 
              placeholder="Current Password"
              type="email"
              name="recoveryEmail"
              value={updatedAccount.recoveryEmail}
              onChange={handleInputChange}
            />
          )}
        </div>

        {!isChangeRecoveryEmail ? (
          <button 
            className="bg-customGray1 w-[280px] py-2 rounded-sm"
            onClick={onChangeRecoveryEmail}
          >
            Change Recovery Email
          </button>
        ) : (
          <div className="flex w-1/2 gap-4">
            <button className="bg-customGray1 flex-1 py-2 rounded-sm" onClick={onCancelRecoveryEmail}>Cancel</button>
            <button className="bg-[#34C759] flex-1 py-2 rounded-sm" onClick={handleSaveClick}>Save</button>
          </div>
        )}

        {isChangePassword ? (
          <div className="flex flex-col gap-2 w-[280px]">
              <input
                className="text-customGray2 px-2 border-2 border-customGray1 h-[40px]"
                placeholder="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                className="text-customGray2 px-2 border-2 mt-4 border-customGray1 h-[40px]"
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                className="text-customGray2 px-2 border-2 border-customGray1 h-[40px]"
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}

            <div className="flex gap-4">
              <button className="bg-customGray1 flex-1 py-2 rounded-sm" onClick={onCancelPassword}>Cancel</button>
              <button className="bg-[#34C759] flex-1 py-2 rounded-sm" onClick={handleSaveClick}>Save</button>
            </div>
          </div>
        ) : (
          <button 
              className="bg-customGray1 w-[280px] py-2 rounded-sm"
              onClick={onChangePassword}
            >
              Change Password
          </button>
        )}
        <button className="bg-customGray1 w-[280px] py-2 rounded-sm" onClick={onCancelRecoveryEmail}>Forgot Password</button>
      </div>
    </div>
  );
};

export default AccountSetting;
