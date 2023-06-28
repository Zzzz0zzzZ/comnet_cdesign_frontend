export function getCurrentTime() {

    function addLeadingZero(number) {
        return (number < 10 ? '0' : '') + number;
    }

    const currentDateTime = new Date();

    const year = currentDateTime.getFullYear();
    const month = addLeadingZero(currentDateTime.getMonth() + 1);
    const day = addLeadingZero(currentDateTime.getDate());
    const hours = addLeadingZero(currentDateTime.getHours());
    const minutes = addLeadingZero(currentDateTime.getMinutes());
    const seconds = addLeadingZero(currentDateTime.getSeconds());

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

