const MessageBox = ({ message }: { message: string | null }) => {
  if (!message) return null

  return <div className="absolute bottom-60 text-xl text-white px-3 py-1 bg-black/20 rounded-full">{message}</div>;
};

export default MessageBox;
