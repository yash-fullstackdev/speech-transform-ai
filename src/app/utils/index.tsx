export const dataUrlToFile = (url: string, fileName: string) => {
  const arr = url.split(",") ?? [];
  const regex = /:([^:;]*);/;

  const match = regex.exec(arr[0]);
  const mime = match?.[1];
  if (!mime) return null;
  const bstr = atob(arr[1]);
  let length = bstr?.length;
  const u8arr = new Uint8Array(length);
  while (length--) {
    u8arr[length] = bstr.charCodeAt(length);
  }
  return new File([u8arr], fileName, { type: "audio/wav" });
};
