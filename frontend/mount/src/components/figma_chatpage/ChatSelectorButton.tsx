import React from 'react';

export function ChatSelectorButton({
  side,
  selectedChat,
  setSelectedChat,
  isActive,
}: {
  side: boolean;
  selectedChat: boolean;
  setSelectedChat: (newValue: boolean) => void;
  isActive: boolean;
}) {
  const isLeft = side ? 'l' : 'r';

  const handleClick = () => {
    setSelectedChat(!selectedChat);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isActive} // Disable the button if it's not active
      className={`w-52 h-12 bg-stone-300 rounded-t${isLeft}-3xl shadow${
        isActive
          ? ''
          : ' border border-black border-opacity-0'
      }`}
    >
      {/* Button content */}
    </button>
  );
}
