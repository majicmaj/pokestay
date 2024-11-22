const MessageBox = ({ message }: { message: string | null }) => {
  return <div className="absolute bottom-60 text-xl text-white">{message}</div>;
};

export default MessageBox;
