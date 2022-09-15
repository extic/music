class LocalStorage {
  setValue(key: string, value: any) {
    if (value) {
      localStorage.setItem(key, value.toString());
    } else {
      localStorage.removeItem(key);
    }
  }

  getString(key: string, defaultValue?: string): string {
    return localStorage.getItem(key) ?? defaultValue ?? "";
  }

  getBoolean(key: string, defaultValue: boolean): boolean {
    return (localStorage.getItem(key) ?? defaultValue.toString()) === "true";
  }

  getNumber(key: string, defaultValue: number): number {
    return Number(localStorage.getItem(key) ?? defaultValue.toString());
  }
}

export const storage = new LocalStorage();
