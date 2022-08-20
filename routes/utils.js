// CHECK IF THE VALUE EXISTS
const isEmpty = (val) => {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}
module.exports = {isEmpty}