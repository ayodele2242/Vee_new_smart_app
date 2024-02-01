// LocalStorageService.ts

export interface StoredData {
    [key: string]: any;
}

export class LocalStorageService {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    private getDataFromStorage(): StoredData {
        const storedData = localStorage.getItem(this.storageKey);
        return storedData ? JSON.parse(storedData) : {};
    }

    private setDataToStorage(data: StoredData): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getData<T>(key: string): T | undefined {
        const storedData = this.getDataFromStorage();
        return storedData[key];
    }

    setData<T>(key: string, value: T): void {
        const storedData = this.getDataFromStorage();
        storedData[key] = value;
        this.setDataToStorage(storedData);
    }

    updateData<T>(key: string, updater: (value: T | undefined) => T): void {
        const storedData = this.getDataFromStorage();
        storedData[key] = updater(storedData[key]);
        this.setDataToStorage(storedData);
    }

    deleteData(key: string): void {
        const storedData = this.getDataFromStorage();
        delete storedData[key];
        this.setDataToStorage(storedData);
    }
}
