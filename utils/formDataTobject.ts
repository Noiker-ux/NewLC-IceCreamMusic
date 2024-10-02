export function objectToFormData<T extends {}>(obj: T) {
  const objEntries = Object.entries(obj);

  const resultFormData = new FormData();

  for (let entry of objEntries) {
    if (entry[1] instanceof File) {
      resultFormData.append(entry[0], entry[1], entry[1].name);
    }
    if (typeof entry[1] === "object") {
      resultFormData.append(entry[0], JSON.stringify(entry[1]));
    }
    resultFormData.append(entry[0], entry[1] as any);
  }

  return resultFormData;
}
