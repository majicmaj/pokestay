export const isValidImageUrl = async (url: string): Promise<boolean> => {
  const image = new Image();
  image.src = url;

  return new Promise((resolve) => {
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
  });
};
