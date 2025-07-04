const MessageBox = ({ message }: { message: string | null }) => {
  if (!message) return null;

  return (
    <div className="absolute bottom-60 left-0 right-0 grid place-items-center">
      <div className="text-xl text-center text-white px-3 py-1 bg-black/20 rounded-full">
        {message}
      </div>
    </div>
  );
};

export default MessageBox;
