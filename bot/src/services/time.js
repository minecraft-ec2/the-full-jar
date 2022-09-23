const setup = () => {
    const weekdayStart = new Date(),
        weekendStart = new Date(),
        weekdayEnd = new Date(),
        weekendEnd = new Date();

    weekdayStart.setHours(16, 30, 0, 0);
    weekdayEnd.setHours(23, 0, 0, 0);
    weekendStart.setHours(11, 0, 0, 0);
    weekendEnd.setHours(23, 0, 0, 0);

    return { weekdayStart, weekdayEnd, weekendStart, weekendEnd };
};

const isWeekday = () => [1, 2, 3, 4, 5].includes((new Date()).getDay());


exports.isHours = () => {
    const { weekdayStart, weekdayEnd, weekendStart, weekendEnd } = setup();
    const now = new Date();

    return (isWeekday() ?
        now > weekdayStart && now < weekdayEnd
        :
        now > weekendStart && now < weekendEnd);
};

console.log(this.isHours())