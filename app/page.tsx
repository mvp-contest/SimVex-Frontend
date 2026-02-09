"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    nickname: "",
    email: "",
    aboutUs: "",
  });

  const [security, setSecurity] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState({
    mouseSensitivity: 50,
    gestureSensitivity: 50,
    showHotkeyGuide: true,
  });

  const [profileImage, setProfileImage] = useState<string | null>(
    "/profile-photo.jpg",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-[#14171C] text-white font-['Pretendard'] overflow-hidden">
      {/* 상단 네비게이션 바 */}
      <nav className="w-full h-[88px] border-b-2 border-[#333B45] flex items-center justify-between px-8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Image
            src="/SIMVEX_logo_2.svg"
            alt="SIMVEX Logo"
            width={40}
            height={40}
          />
          <span className="text-[32px] font-bold">SIMVEX</span>
        </div>
        <span className="text-[28px] font-semibold">Haeyoung</span>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <aside
          className="bg-[#1E2127] border-r-2 border-[#333B45] flex-shrink-0 relative"
          style={{ width: "224px" }}
        >
          <nav className="absolute" style={{ left: "20px", top: "164px" }}>
            <div className="flex flex-col" style={{ gap: "33px" }}>
              {/* Home */}
              <button className="flex items-center gap-3 text-zinc-400 hover:bg-[#14171C] transition font-semibold relative text-2xl text-left">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.50001 26.9168H12.75V19.8335C12.75 19.4321 12.886 19.0959 13.158 18.8248C13.43 18.5538 13.7662 18.4178 14.1667 18.4168H19.8333C20.2347 18.4168 20.5714 18.5528 20.8434 18.8248C21.1154 19.0968 21.251 19.4331 21.25 19.8335V26.9168H25.5V14.1668L17 7.79183L8.50001 14.1668V26.9168ZM5.66667 26.9168V14.1668C5.66667 13.7182 5.76725 13.2932 5.96842 12.8918C6.16959 12.4904 6.44678 12.1599 6.80001 11.9002L15.3 5.52516C15.7958 5.14739 16.3625 4.9585 17 4.9585C17.6375 4.9585 18.2042 5.14739 18.7 5.52516L27.2 11.9002C27.5542 12.1599 27.8318 12.4904 28.033 12.8918C28.2342 13.2932 28.3343 13.7182 28.3333 14.1668V26.9168C28.3333 27.696 28.0557 28.3632 27.5003 28.9186C26.945 29.4739 26.2782 29.7511 25.5 29.7502H19.8333C19.432 29.7502 19.0957 29.6142 18.8247 29.3422C18.5536 29.0702 18.4176 28.7339 18.4167 28.3335V21.2502H15.5833V28.3335C15.5833 28.7349 15.4473 29.0716 15.1753 29.3436C14.9033 29.6156 14.5671 29.7511 14.1667 29.7502H8.50001C7.72084 29.7502 7.05406 29.473 6.49967 28.9186C5.94528 28.3642 5.66762 27.6969 5.66667 26.9168Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Home</span>
              </button>

              {/* My Teams */}
              <button className="flex items-center gap-3 text-zinc-400 hover:bg-[#14171C] transition font-semibold relative text-2xl text-left">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27.366 23.2387C26.5349 22.4069 25.5638 21.7281 24.4973 21.2332C26.0014 20.0146 26.9609 18.1553 26.9609 16.0701C26.9609 12.3912 23.893 9.37304 20.2141 9.42949C16.5916 9.48594 13.6731 12.4377 13.6731 16.0701C13.6731 18.1553 14.6359 20.0146 16.1367 21.2332C15.0699 21.7277 14.0988 22.4066 13.268 23.2387C11.4551 25.0549 10.4258 27.4521 10.3594 30.0088C10.3585 30.0442 10.3647 30.0795 10.3777 30.1125C10.3906 30.1455 10.41 30.1755 10.4348 30.2009C10.4595 30.2263 10.4891 30.2465 10.5218 30.2602C10.5545 30.274 10.5896 30.2811 10.625 30.2811H12.4844C12.6272 30.2811 12.7467 30.1682 12.75 30.0254C12.8131 28.0996 13.5934 26.2967 14.9647 24.9287C15.6664 24.2233 16.501 23.664 17.4203 23.2833C18.3396 22.9026 19.3253 22.708 20.3203 22.7107C22.3424 22.7107 24.2449 23.4977 25.676 24.9287C27.044 26.2967 27.8242 28.0996 27.8906 30.0254C27.894 30.1682 28.0135 30.2811 28.1563 30.2811H30.0156C30.0511 30.2811 30.0862 30.274 30.1188 30.2602C30.1515 30.2465 30.1811 30.2263 30.2058 30.2009C30.2306 30.1755 30.25 30.1455 30.263 30.1125C30.2759 30.0795 30.2821 30.0442 30.2813 30.0088C30.2149 27.4521 29.1856 25.0549 27.366 23.2387ZM20.3203 20.3201C19.1848 20.3201 18.1156 19.8785 17.3154 19.075C16.9139 18.6766 16.5966 18.2014 16.3827 17.6777C16.1688 17.154 16.0626 16.5926 16.0703 16.027C16.0803 14.9379 16.5152 13.8854 17.2756 13.1051C18.0725 12.2883 19.1383 11.8334 20.2772 11.8201C21.4027 11.8102 22.4951 12.2484 23.2986 13.0353C24.1221 13.8422 24.5736 14.9213 24.5736 16.0701C24.5736 17.2057 24.132 18.2715 23.3285 19.075C22.9343 19.4711 22.4655 19.7851 21.9491 19.9988C21.4328 20.2125 20.8792 20.3217 20.3203 20.3201ZM12.0029 16.9467C11.9731 16.6578 11.9565 16.3656 11.9565 16.0701C11.9565 15.5422 12.0063 15.0275 12.0992 14.5262C12.1225 14.4066 12.0594 14.2838 11.9498 14.234C11.4982 14.0314 11.0832 13.7525 10.7246 13.4006C10.3021 12.9909 9.96957 12.4976 9.74833 11.9522C9.52708 11.4068 9.42196 10.8213 9.43965 10.233C9.46954 9.16719 9.89786 8.15449 10.6449 7.39082C11.465 6.55078 12.5674 6.09258 13.7395 6.10586C14.7986 6.11582 15.8213 6.52422 16.5949 7.24804C16.8572 7.49375 17.083 7.76601 17.2723 8.0582C17.3387 8.16113 17.4682 8.20429 17.5811 8.16445C18.1654 7.96191 18.783 7.81914 19.4172 7.75273C19.6031 7.73281 19.7094 7.53359 19.6264 7.36758C18.5473 5.23261 16.3426 3.7584 13.7926 3.71855C10.1104 3.66211 7.04239 6.68027 7.04239 10.3559C7.04239 12.441 8.00196 14.3004 9.50606 15.5189C8.4502 16.007 7.47735 16.6811 6.63399 17.5244C4.81446 19.3406 3.78516 21.7379 3.71876 24.2978C3.71787 24.3333 3.72409 24.3685 3.73704 24.4015C3.74999 24.4345 3.76941 24.4646 3.79417 24.49C3.81892 24.5154 3.84851 24.5355 3.88117 24.5493C3.91384 24.563 3.94893 24.5701 3.98438 24.5701H5.84708C5.98985 24.5701 6.10938 24.4572 6.1127 24.3144C6.17579 22.3887 6.95606 20.5857 8.32735 19.2178C9.30352 18.2416 10.4988 17.5643 11.8037 17.2355C11.9332 17.2023 12.0195 17.0795 12.0029 16.9467Z"
                    fill="currentColor"
                  />
                </svg>
                <span>My Teams</span>
              </button>

              {/* Settings - 36px gap */}
              <button
                className="flex items-center gap-3 text-white font-semibold relative text-2xl text-left"
                style={{ marginTop: "3px" }}
              >
                <div
                  className="absolute bg-white rounded-r-full"
                  style={{
                    width: "10px",
                    height: "58px",
                    left: "-20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28.1917 17.9351C27.9645 17.6766 27.8393 17.3443 27.8393 17.0001C27.8393 16.656 27.9645 16.3237 28.1917 16.0651L30.005 14.0251C30.2048 13.8022 30.3289 13.5218 30.3594 13.224C30.39 12.9262 30.3254 12.6264 30.175 12.3676L27.3417 7.46597C27.1928 7.20746 26.9661 7.00254 26.6939 6.88044C26.4217 6.75834 26.1179 6.72528 25.8258 6.78597L23.1625 7.3243C22.8236 7.39433 22.4708 7.33789 22.1707 7.16564C21.8705 6.99339 21.6438 6.71724 21.5333 6.3893L20.6692 3.7968C20.5741 3.51542 20.3931 3.27103 20.1516 3.09816C19.9101 2.9253 19.6203 2.8327 19.3233 2.83347H13.6567C13.3477 2.81735 13.042 2.90278 12.7862 3.07673C12.5304 3.25068 12.3386 3.50358 12.24 3.7968L11.4467 6.3893C11.3362 6.71724 11.1095 6.99339 10.8093 7.16564C10.5092 7.33789 10.1564 7.39433 9.8175 7.3243L7.08333 6.78597C6.80645 6.74684 6.52417 6.79053 6.27208 6.91154C6.01998 7.03255 5.80933 7.22546 5.66667 7.46597L2.83333 12.3676C2.67914 12.6236 2.60982 12.9217 2.63526 13.2194C2.6607 13.5171 2.77962 13.7991 2.975 14.0251L4.77417 16.0651C5.00129 16.3237 5.12654 16.656 5.12654 17.0001C5.12654 17.3443 5.00129 17.6766 4.77417 17.9351L2.975 19.9751C2.77962 20.2012 2.6607 20.4832 2.63526 20.7809C2.60982 21.0786 2.67914 21.3767 2.83333 21.6326L5.66667 26.5343C5.81556 26.7928 6.04225 26.9977 6.31444 27.1198C6.58663 27.2419 6.89042 27.275 7.1825 27.2143L9.84583 26.676C10.1847 26.6059 10.5375 26.6624 10.8377 26.8346C11.1378 27.0069 11.3645 27.283 11.475 27.611L12.3392 30.2035C12.4377 30.4967 12.6296 30.7496 12.8854 30.9235C13.1412 31.0975 13.4469 31.1829 13.7558 31.1668H19.4225C19.7195 31.1676 20.0092 31.075 20.2507 30.9021C20.4922 30.7292 20.6733 30.4848 20.7683 30.2035L21.6325 27.611C21.743 27.283 21.9697 27.0069 22.2698 26.8346C22.57 26.6624 22.9228 26.6059 23.2617 26.676L25.925 27.2143C26.2171 27.275 26.5209 27.2419 26.7931 27.1198C27.0653 26.9977 27.2919 26.7928 27.4408 26.5343L30.2742 21.6326C30.4246 21.3738 30.4891 21.074 30.4586 20.7763C30.4281 20.4785 30.304 20.198 30.1042 19.9751L28.1917 17.9351ZM26.0808 19.8335L27.2142 21.1085L25.4008 24.2535L23.7292 23.9135C22.7089 23.7049 21.6475 23.8782 20.7465 24.4005C19.8455 24.9228 19.1677 25.7577 18.8417 26.7468L18.3033 28.3335H14.6767L14.1667 26.7185C13.8406 25.7294 13.1628 24.8945 12.2618 24.3722C11.3609 23.8499 10.2995 23.6766 9.27917 23.8851L7.6075 24.2251L5.76583 21.0943L6.89917 19.8193C7.5961 19.0401 7.9814 18.0314 7.9814 16.986C7.9814 15.9406 7.5961 14.9318 6.89917 14.1526L5.76583 12.8776L7.57917 9.76097L9.25083 10.101C10.2711 10.3095 11.3325 10.1362 12.2335 9.61392C13.1345 9.09162 13.8123 8.25669 14.1383 7.26764L14.6767 5.6668H18.3033L18.8417 7.2818C19.1677 8.27086 19.8455 9.10578 20.7465 9.62808C21.6475 10.1504 22.7089 10.3237 23.7292 10.1151L25.4008 9.77514L27.2142 12.9201L26.0808 14.1951C25.3917 14.9725 25.0112 15.9754 25.0112 17.0143C25.0112 18.0532 25.3917 19.0561 26.0808 19.8335ZM16.49 11.3335C15.3692 11.3335 14.2736 11.6658 13.3418 12.2885C12.4099 12.9111 11.6836 13.7961 11.2547 14.8316C10.8258 15.867 10.7136 17.0064 10.9322 18.1056C11.1509 19.2049 11.6906 20.2146 12.4831 21.0071C13.2756 21.7996 14.2853 22.3393 15.3845 22.5579C16.4837 22.7766 17.6231 22.6644 18.6585 22.2355C19.694 21.8066 20.579 21.0802 21.2017 20.1484C21.8243 19.2165 22.1567 18.1209 22.1567 17.0001C22.1567 15.4972 21.5596 14.0559 20.4969 12.9932C19.4342 11.9305 17.9929 11.3335 16.49 11.3335ZM16.49 19.8335C15.9296 19.8335 15.3818 19.6673 14.9159 19.356C14.4499 19.0446 14.0868 18.6021 13.8723 18.0844C13.6579 17.5667 13.6018 16.997 13.7111 16.4474C13.8204 15.8978 14.0903 15.3929 14.4865 14.9967C14.8828 14.6004 15.3876 14.3306 15.9372 14.2212C16.4869 14.1119 17.0565 14.168 17.5743 14.3825C18.092 14.5969 18.5345 14.9601 18.8458 15.426C19.1572 15.892 19.3233 16.4398 19.3233 17.0001C19.3233 17.7516 19.0248 18.4723 18.4935 19.0036C17.9621 19.535 17.2414 19.8335 16.49 19.8335Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Settings</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* 메인 콘텐츠 - 스크롤 가능 */}
        <main className="flex-1 overflow-auto p-8">
          <div
            className="grid grid-cols-2"
            style={{
              maxWidth: "1219px",
              margin: "65px auto 0",
              gap: "25px 25px",
            }}
          >
            {/* Change Photo 카드 */}
            <div
              className="bg-[#1E2127] border-2 border-[#333B45] relative"
              style={{ width: "597px", height: "418px", borderRadius: "15px" }}
            >
              <h2
                className="absolute font-semibold text-[32px]"
                style={{ top: "28px", left: "30px" }}
              >
                Change Photo
              </h2>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={153}
                  height={153}
                  className="absolute rounded-full object-cover"
                  style={{
                    width: "153px",
                    height: "153px",
                    top: "121px",
                    left: "34px",
                  }}
                />
              ) : (
                <div
                  className="absolute rounded-full bg-[#C5D0E1]"
                  style={{
                    width: "153px",
                    height: "153px",
                    top: "121px",
                    left: "34px",
                  }}
                />
              )}

              <div
                className="absolute rounded-full bg-[#3E4350] flex items-center justify-center"
                style={{
                  width: "153px",
                  height: "153px",
                  top: "121px",
                  left: "208px",
                }}
              >
                <svg
                  className="text-[#7A7E89]"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>

              <button
                onClick={handleChangeImage}
                className="absolute border-2 border-[#333B45] bg-[#252830] rounded-md text-[#E2E8F0] font-semibold hover:bg-[#2F333D] hover:border-[#4A5568] active:scale-95 transition-all shadow-md hover:shadow-lg"
                style={{
                  width: "236px",
                  height: "45px",
                  top: "328px",
                  left: "30px",
                  fontSize: "20px",
                }}
              >
                Change profile picture
              </button>

              <button
                onClick={handleRemoveImage}
                className="absolute border-2 border-[#F95C5C] rounded-md text-[#EF4444] font-semibold hover:bg-[#4A1515] hover:border-[#FF6B6B] active:scale-95 transition-all shadow-md hover:shadow-lg"
                style={{
                  width: "236px",
                  height: "45px",
                  top: "328px",
                  left: "283px",
                  fontSize: "20px",
                  backgroundColor: "rgba(255, 0, 0, 0.2)",
                }}
              >
                Remove profile picture
              </button>
            </div>

            {/* Profile Setting 카드 */}
            <div
              className="bg-[#1E2127] border-2 border-[#333B45] relative"
              style={{ width: "597px", height: "418px", borderRadius: "15px" }}
            >
              <h2
                className="absolute font-semibold text-[32px]"
                style={{ top: "28px", left: "30px" }}
              >
                Profile Setting
              </h2>

              <div className="absolute" style={{ top: "77px", left: "30px" }}>
                <label
                  className="block text-[#E2E8F0] font-medium mb-2"
                  style={{ fontSize: "22px" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="bg-[#3B3E43]/20 border-2 border-[#333B45] text-white focus:outline-none focus:border-blue-500 transition font-medium rounded-md"
                  style={{ width: "263px", height: "42px", padding: "0 16px" }}
                />
              </div>

              <div className="absolute" style={{ top: "77px", left: "305px" }}>
                <label
                  className="block text-[#E2E8F0] font-medium mb-2"
                  style={{ fontSize: "22px" }}
                >
                  Nickname
                </label>
                <input
                  type="text"
                  value={profile.nickname}
                  onChange={(e) =>
                    setProfile({ ...profile, nickname: e.target.value })
                  }
                  className="bg-[#3B3E43]/20 border-2 border-[#333B45] text-white focus:outline-none focus:border-blue-500 transition font-medium rounded-md"
                  style={{ width: "263px", height: "42px", padding: "0 16px" }}
                />
              </div>

              <div className="absolute" style={{ top: "159px", left: "30px" }}>
                <label
                  className="block text-[#E2E8F0] font-medium mb-2"
                  style={{ fontSize: "22px" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="bg-[#3B3E43]/20 border-2 border-[#333B45] text-white focus:outline-none focus:border-blue-500 transition font-medium rounded-md"
                  style={{ width: "538px", height: "42px", padding: "0 16px" }}
                />
              </div>

              <div className="absolute" style={{ top: "241px", left: "28px" }}>
                <label
                  className="block text-[#E2E8F0] font-medium mb-2"
                  style={{ fontSize: "22px" }}
                >
                  About Us
                </label>
                <textarea
                  value={profile.aboutUs}
                  onChange={(e) =>
                    setProfile({ ...profile, aboutUs: e.target.value })
                  }
                  className="bg-[#3B3E43]/20 border-2 border-[#333B45] text-white focus:outline-none focus:border-blue-500 transition resize-none font-medium rounded-md"
                  style={{
                    width: "538px",
                    height: "42px",
                    padding: "12px 16px",
                  }}
                />
              </div>

              <button
                onClick={() => {
                  localStorage.setItem("userProfile", JSON.stringify(profile));
                  alert("Profile saved successfully!");
                  console.log("Profile saved:", profile);
                }}
                className="absolute bg-[#F8FAFC] text-black font-semibold hover:bg-white active:scale-95 transition-all rounded-md shadow-md hover:shadow-lg"
                style={{
                  width: "540px",
                  height: "42px",
                  top: "340px",
                  left: "28px",
                  fontSize: "22px",
                }}
              >
                Send Profile
              </button>
            </div>

            {/* Security 카드 */}
            <div
              className="bg-[#1E2127] border-2 border-[#333B45] relative"
              style={{ width: "597px", height: "418px", borderRadius: "15px" }}
            >
              <h2
                className="absolute font-semibold text-[32px]"
                style={{ top: "25px", left: "30px" }}
              >
                Security
              </h2>

              <div className="absolute" style={{ top: "77px", left: "30px" }}>
                <label
                  className="block text-[#E2E8F0] font-medium mb-2"
                  style={{ fontSize: "22px" }}
                >
                  Old Password
                </label>
                <input
                  type="password"
                  value={security.oldPassword}
                  onChange={(e) =>
                    setSecurity({ ...security, oldPassword: e.target.value })
                  }
                  className="bg-[#3B3E43]/20 border-2 border-[#333B45] text-white focus:outline-none focus:border-blue-500 transition font-medium rounded-md"
                  style={{ width: "547px", height: "42px", padding: "0 16px" }}
                />
              </div>

              <div className="absolute" style={{ top: "159px", left: "30px" }}>
                <label
                  className="block text-[#E2E8F0] font-medium mb-2"
                  style={{ fontSize: "22px" }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={security.newPassword}
                  onChange={(e) =>
                    setSecurity({ ...security, newPassword: e.target.value })
                  }
                  className="bg-[#3B3E43]/20 border-2 border-[#333B45] text-white focus:outline-none focus:border-blue-500 transition font-medium rounded-md"
                  style={{ width: "547px", height: "42px", padding: "0 16px" }}
                />
              </div>

              <div className="absolute" style={{ top: "241px", left: "28px" }}>
                <label
                  className="block text-[#E2E8F0] font-medium mb-2"
                  style={{ fontSize: "22px" }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) =>
                    setSecurity({
                      ...security,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="bg-[#3B3E43]/20 border-2 border-[#333B45] text-white focus:outline-none focus:border-blue-500 transition font-medium rounded-md"
                  style={{ width: "547px", height: "42px", padding: "0 16px" }}
                />
              </div>

              <button
                onClick={() => {
                  if (security.newPassword !== security.confirmPassword) {
                    alert("New password and confirm password do not match!");
                    return;
                  }
                  if (!security.oldPassword || !security.newPassword) {
                    alert("Please fill in all password fields!");
                    return;
                  }
                  localStorage.setItem(
                    "userSecurity",
                    JSON.stringify(security),
                  );
                  alert("Password changed successfully!");
                  console.log("Password changed:", security);
                  setSecurity({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="absolute bg-[#F8FAFC] text-black font-semibold hover:bg-white active:scale-95 transition-all rounded-md shadow-md hover:shadow-lg"
                style={{
                  width: "547px",
                  height: "42px",
                  top: "363px",
                  left: "25px",
                  fontSize: "22px",
                }}
              >
                Change Password
              </button>
            </div>

            {/* Interaction & Gestures 카드 */}
            <div
              className="bg-[#1E2127] border-2 border-[#333B45] relative"
              style={{ width: "597px", height: "418px", borderRadius: "15px" }}
            >
              <h2
                className="absolute font-semibold text-[32px]"
                style={{ top: "28px", left: "30px" }}
              >
                Interaction & Gestures
              </h2>

              <div className="absolute" style={{ top: "105px", left: "28px" }}>
                <label
                  className="block text-[#E2E8F0] font-medium mb-4"
                  style={{ fontSize: "22px" }}
                >
                  Mouse Sensitivity
                </label>
                <div
                  className="relative"
                  style={{ width: "547px", height: "4px", marginTop: "21px" }}
                >
                  <div className="absolute w-full h-full rounded-full bg-[#333B45]" />
                  <div
                    className="absolute h-full rounded-full bg-[#D9D9D9]"
                    style={{ width: `${settings.mouseSensitivity}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.mouseSensitivity}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        mouseSensitivity: parseInt(e.target.value),
                      })
                    }
                    className="absolute top-0 left-0 w-full opacity-0 cursor-pointer"
                    style={{
                      width: "547px",
                      height: "20px",
                      marginTop: "-8px",
                    }}
                  />
                  <div
                    className="absolute w-4 h-4 rounded-sm bg-[#D9D9D9] cursor-pointer shadow pointer-events-none"
                    style={{
                      left: `calc(${settings.mouseSensitivity}% - 8px)`,
                      top: "-6px",
                    }}
                  />
                </div>
              </div>

              <div className="absolute" style={{ top: "192px", left: "25px" }}>
                <label
                  className="block text-[#E2E8F0] font-medium mb-4"
                  style={{ fontSize: "22px" }}
                >
                  Gesture Sensitivity
                </label>
                <div
                  className="relative"
                  style={{ width: "547px", height: "4px", marginTop: "21px" }}
                >
                  <div className="absolute w-full h-full rounded-full bg-[#333B45]" />
                  <div
                    className="absolute h-full rounded-full bg-[#D9D9D9]"
                    style={{ width: `${settings.gestureSensitivity}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.gestureSensitivity}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        gestureSensitivity: parseInt(e.target.value),
                      })
                    }
                    className="absolute top-0 left-0 w-full opacity-0 cursor-pointer"
                    style={{
                      width: "547px",
                      height: "20px",
                      marginTop: "-8px",
                    }}
                  />
                  <div
                    className="absolute w-4 h-4 rounded-sm bg-[#D9D9D9] cursor-pointer shadow pointer-events-none"
                    style={{
                      left: `calc(${settings.gestureSensitivity}% - 8px)`,
                      top: "-6px",
                    }}
                  />
                </div>
              </div>

              <div
                className="absolute flex items-center gap-3"
                style={{ top: "300px", left: "25px" }}
              >
                <div
                  className="relative"
                  style={{ width: "32px", height: "32px" }}
                >
                  <input
                    type="checkbox"
                    checked={settings.showHotkeyGuide}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        showHotkeyGuide: e.target.checked,
                      })
                    }
                    className="peer w-8 h-8 rounded border-2 border-[#333B45] bg-[#3B3E43]/20 appearance-none cursor-pointer checked:bg-[#F8FAFC] checked:border-[#F8FAFC]"
                  />
                  <svg
                    className="absolute top-1 left-1 w-6 h-6 text-black hidden peer-checked:block pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-medium text-[22px] text-[#E2E8F0]">
                  Show Hotkey Guide
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
