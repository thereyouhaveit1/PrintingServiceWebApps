export const saveFileToOrder = (
  file: File,
  key: "frontFile" | "backFile",
  updateState?: (state: any) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;

      if (updateState) {
        updateState((prev: any) => {
          const updated = { ...prev, [key]: base64, [`${key}Name`]: file.name };
          localStorage.setItem("orderData", JSON.stringify(updated));
          resolve(); // resolve after saving
          return updated;
        });
      } else {
        // fallback: just save to localStorage
        const updated = { [key]: base64, [`${key}Name`]: file.name };
        localStorage.setItem("orderData", JSON.stringify(updated));
        resolve();
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};