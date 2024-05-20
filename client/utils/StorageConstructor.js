export default function StorageConstructor() {
    this.data = [];
    this.storageSync = (dataArg) => {
        localStorage.setItem("dbLocal", JSON.stringify(dataArg));
        this.data = JSON.parse(localStorage.getItem("dbLocal")) ?? [];
    };
    this.addToStorage = (dataArg) => this.data.push(dataArg);
    this.clearStorage = () => (this.data = []);
    this.deleteFromStorage = (idArg) => {
        const index = this.data.findIndex((el) => el._id === idArg);
        if (index >= 0) this.data.splice(index, 1);
    };
    this.editStorage = (objArg) => {
        const item = this.getById(objArg._id);
        if (item) {
            item.name = objArg.name;
            item.surname = objArg.surname;
            item.email = objArg.email;
        }
    };
    this.getById = (idArg) =>
        this.data[this.data.findIndex((el) => el._id === idArg)];
}
