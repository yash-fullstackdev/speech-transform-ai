export const checkValidJSon = (text:any) => {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
}; 