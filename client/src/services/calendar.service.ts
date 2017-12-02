export class CalendarService {
    private months = [
        { name: 'January', short: 'Jan' },
        { name: 'February', short: 'Feb' },
        { name: 'March', short: 'Feb' },
        { name: 'April', short: 'Apr' },
        { name: 'May', short: 'May' },
        { name: 'June', short: 'Jun' },
        { name: 'July', short: 'Jul' },
        { name: 'August', short: 'Aug' },
        { name: 'September', short: 'Sep' },
        { name: 'October', short: 'Oct' },
        { name: 'November', short: 'Nov' },
        { name: 'December', short: 'Dec' }
    ];

    getMonths() {
        return this.months;
    }

    generateYears(count, pivotYear) {
        const years = [];

        const date = new Date();
        date.setFullYear(date.getFullYear() + (pivotYear - count));

        while(count > 0) {
            if(pivotYear >= 0) {
                years.unshift(date.getFullYear() + count);
            } else {
                years.push(date.getFullYear() + count);
            }
            count--;
        }

        return years;
    }
}
