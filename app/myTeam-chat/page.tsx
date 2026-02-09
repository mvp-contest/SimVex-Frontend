"use client";

import { useState } from "react";
import Image from "next/image";

export default function MyTeamsPage() {
  const [activeTab, setActiveTab] = useState<"members" | "chat">("chat");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 사진 파일이 준비되면 경로를 수정하세요 (예: /images/profile1.png)
  const messages = [
    {
      id: 1,
      sender: "Lee gu bin",
      time: "2:15 PM",
      content: "I love min ju Kim, she is my life itself",
      profileImage: "/profile-photo.jpg",
    },
    {
      id: 2,
      sender: "You",
      time: "2:16 PM",
      content:
        "I've just uploaded the high-fidelity wireframes for the new dashboard. Could you take a look at the navigation bar and let me know if the spacing feels right to you?",
      profileImage: "/profile-photo.jpg",
    },
    {
      id: 3,
      sender: "Haeyoung",
      time: "2:20 PM",
      content:
        "That's a fair point. I'll try increasing the padding and adjusting the font size to improve accessibility.",
      profileImage: "/profile-photo.jpg",
    },
    {
      id: 4,
      sender: "Lee gu bin",
      time: "2:20 PM",
      content: "nonononononononono",
      profileImage: "/profile-photo.jpg",
    },
  ];

  const members = [
    {
      id: 1,
      name: "Lee gu bin",
      status: "Online",
      role: "Owner",
      profileImage: "/profile-photo.jpg",
    },
    {
      id: 2,
      name: "Lee gu bin",
      status: "Offline",
      role: "Member",
      profileImage: "/profile-photo.jpg",
    },
    {
      id: 3,
      name: "Lee gu bin",
      status: "Online",
      role: "Member",
      profileImage: "/profile-photo.jpg",
    },
    {
      id: 4,
      name: "Lee gu bin",
      status: "Online",
      role: "Member",
      profileImage: "/profile-photo.jpg",
    },
    {
      id: 5,
      name: "Lee gu bin",
      status: "Online",
      role: "Member",
      profileImage: "/profile-photo.jpg",
    },
    {
      id: 6,
      name: "Lee gu bin",
      status: "Online",
      role: "Member",
      profileImage: "/profile-photo.jpg",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#14171C] text-white font-['Pretendard'] overflow-hidden">
      {/* 상단 네비게이션 */}
      <nav className="w-full h-[88px] border-b-2 border-[#333B45] flex items-center justify-between px-8 flex-shrink-0 z-10 bg-[#14171C]">
        <div className="flex items-center gap-3">
          <div className="relative w-15 h-15">
            <Image
              src="/SIMVEX_logo_2.svg"
              alt="SIMVEX"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[32px] font-bold">SIMVEX</span>
        </div>
        <span className="text-[28px] font-semibold">Haeyoung</span>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 - 아이콘을 .svg 파일로 교체 */}
        <aside className="w-[224px] bg-[#1E2127] border-r-2 border-[#333B45] flex-shrink-0 flex flex-col pt-[76px] px-5 gap-[33px]">
          <button className="flex items-center gap-3 text-zinc-400 hover:text-white transition font-semibold text-2xl group">
            <Image src="/Home_icon.svg" alt="Home" width={34} height={34} />
            <span>Home</span>
          </button>
          <button className="flex items-center text-white font-semibold relative text-2xl">
            <div className="absolute bg-white rounded-r-full w-[10px] h-[58px] -left-5 top-1/2 -translate-y-1/2" />
            <Image
              src="/Myteams_icon2.svg"
              alt="My Teams"
              width={34}
              height={34}
              className="mr-3 flex-shrink-0"
            />
            <div className="flex items-center gap-[17px]">
              <span className="whitespace-nowrap">My Teams</span>
              <Image
                src="/Arrow.svg"
                alt="arrow"
                width={9}
                height={16}
                className="flex-shrink-0"
              />
            </div>
          </button>
          <button className="flex items-center gap-3 text-zinc-400 hover:text-white transition font-semibold text-2xl">
            <Image
              src="/Setting_icon2.svg"
              alt="Settings"
              width={34}
              height={34}
            />
            <span>Settings</span>
          </button>
        </aside>

        {/* 메인 영역 */}
        <main className="flex-1 flex flex-col pt-[74px] pl-[65px] pr-8 pb-8 overflow-hidden min-w-0">
          <header className="flex-shrink-0 mb-6">
            <h1 className="text-[32px] font-semibold">Lee gu bin</h1>
            <p className="text-zinc-400 text-[24px] mt-2 color-[#787878]">
              Focused on SV renderer development
            </p>

            <div className="flex gap-8 mt-6 border-b border-[#333B45]">
              <button
                onClick={() => setActiveTab("members")}
                className={`pb-2 border-b-2 text-2xl transition ${activeTab === "members" ? "border-white" : "border-transparent text-zinc-500"}`}
              >
                Team Members
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`pb-2 border-b-2 text-2xl transition ${activeTab === "chat" ? "border-white" : "border-transparent text-zinc-500"}`}
              >
                chat
              </button>
            </div>
          </header>

          <div className="flex flex-1 gap-[39px] overflow-hidden">
            {/* 왼쪽: 팀 채팅 영역 */}
            <div className="flex-1 bg-[#12141B] border-2 border-[#333B45] rounded-[15px] flex flex-col overflow-hidden">
              {/* 팀챗 헤더 슬림화 및 구분선 (W-1197 기준) */}
              <div className="flex-shrink-0">
                <h2 className="px-5 pt-1 pb-[2px] font-medium text-[18px]">
                  Team Chat
                </h2>
                <div className="w-full border-b border-[#333B45]" />
              </div>

              {/* 채팅 메시지 리스트 */}
              <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-hide">
                {messages.map((msg) => {
                  const isMe = msg.sender === "You";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-[70%] ${isMe ? "flex-row-reverse" : ""}`}
                      >
                        {/* 상대방일 때만 프로필 노출 */}
                        {!isMe && (
                          <div className="relative w-[39px] h-[39px] flex-shrink-0">
                            <Image
                              src={msg.profileImage || "/default_profile.png"}
                              alt="profile"
                              fill
                              className="rounded-full bg-[#C5D0E1] object-cover"
                            />
                          </div>
                        )}

                        <div className={isMe ? "w-full" : ""}>
                          {!isMe && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-sm">
                                {msg.sender}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {msg.time}
                              </span>
                            </div>
                          )}
                          {/* 내 메시지 시간 우측 상단 배치 */}
                          <div
                            className={`relative ${isMe ? "bg-[#2C303B] rounded-lg p-4 pt-8 pr-16" : "p-0"}`}
                          >
                            {isMe && (
                              <span className="absolute top-2 right-4 text-[14px] text-[#787878]">
                                {msg.time}
                              </span>
                            )}
                            <p className="text-sm leading-relaxed">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 입력창 */}
              <div className="p-5 border-t border-[#333B45] flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-[#131620] border-2 border-[#333B45] rounded-md px-4 h-[49px] text-white focus:outline-none"
                  placeholder="Type a message..."
                />
                <button className="bg-[#64748B] w-[108px] h-[49px] rounded-md font-semibold text-xl hover:bg-[#526075] transition">
                  Send
                </button>
              </div>
            </div>

            {/* 오른쪽: 멤버 리스트 */}
            <div className="w-[346px] flex flex-col flex-shrink-0">
              <div className="h-[42px] bg-[#1A1E24] border-2 border-[#333B45] rounded-t-[15px] flex items-center px-4 shrink-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  className="flex-1 bg-transparent text-sm focus:outline-none text-white placeholder-zinc-500"
                />
                <Image src="/Search.svg" alt="Search" width={30} height={30} />
              </div>

              <div className="flex-1 bg-[#12141B] border-2 border-[#333B45] border-t-0 rounded-b-[15px] flex flex-col overflow-hidden">
                <h3 className="px-5 py-4 font-medium text-[16px]">
                  Members - 6
                </h3>
                <div className="mx-[14px] border-b border-[#333B45]" />
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  {members.map((member, idx) => (
                    <div key={member.id}>
                      <div className="flex items-center justify-between px-5 py-[14px]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-[39px] h-[39px]">
                            <Image
                              src={member.profileImage}
                              alt={member.name}
                              fill
                              className="rounded-full bg-[#C5D0E1] object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {member.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {member.status}
                            </p>
                          </div>
                        </div>
                        <div className="px-3 py-1 border border-[#333B45] rounded bg-[#1A1E24] text-xs text-zinc-400">
                          {member.role}
                        </div>
                      </div>
                      {idx !== members.length - 1 && (
                        <div className="mx-[14px] border-b border-[#333B45]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
