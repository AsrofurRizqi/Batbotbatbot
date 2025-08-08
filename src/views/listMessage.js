module.exports = {
    listMessage: (serverList) => {
        if (!serverList || serverList.length === 0) {
            return 'No servers available.';
        }
        return `Available servers:\n${serverList}`;
    }
}