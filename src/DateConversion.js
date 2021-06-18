import {DATE_CONVERSION_FORMULA} from "./constants/date-conversion";
import {DATE_RANGE} from "./constants/date-range";
import {FLUCTUATION_MONTHS} from "./constants/fluctation-months";
import {NEPALI_NUMBERS} from "./constants/nepali-numbers";
import {MONTHS} from "./constants/months";

export class DateConversion {
    constructor() {
        this.minAdDateEqBsDate = {
            ad: {
                year: 1913,
                month: 3,
                date: 13
            },
            bs: {
                year: 1970,
                month: 1,
                date: 1
            }
        };
    }

    /**
     * convert bs date to ad date
     * algorithm
     * 1.fist add 57 to the given ad year
     * 2.calculate month by adding 9 and then find out the module 12 (4+9)%12 =  april = baisakh and bsMonth = 0 then 12 else bsmonth
     * 3. if ad month is less than 4 then substract 1 from bs year ( eg march (chaitra substract 1))
     * 4. else if ad month = 4 then
     * @param adYear
     * @param adMonth
     * @param adDate
     */
    getBsDateByAdDate(adYear, adMonth, adDate) {
        let bsYear = adYear + 57;
        let bsMonth = (adMonth + 9) % 12;
        bsMonth = bsMonth === 0 ? 12 : bsMonth;
        let bsDate = 1;
        if (adMonth < 4) {
            bsYear -= 1;
        } else if (adMonth === 4) {
            let bsYearFirstAdDate = this.getAdDateByBsDate(bsYear, 1, 1);
            if (adDate < bsYearFirstAdDate.getDate()) {
                bsYear -= 1;
            }
        }
        let bsMonthFirstAdDate = this.getAdDateByBsDate(bsYear, bsMonth, 1);
        if (adDate >= 1 && adDate < bsMonthFirstAdDate.getDate()) {
            bsMonth = bsMonth !== 1 ? bsMonth - 1 : 12;
            let bsMonthDays = this.getBsMonthDays(bsYear, bsMonth);
            bsDate = bsMonthDays - (bsMonthFirstAdDate.getDate() - adDate) + 1;
        } else {
            bsDate = adDate - bsMonthFirstAdDate.getDate() + 1;
        }
        return {
            bsYear: bsYear,
            bsMonth: bsMonth,
            bsDate: bsDate
        };
    }

    getAdDateByBsDate(bsYear, bsMonth, bsDate) {
        let daysNumFromMinBsYear = this.getTotalDaysNumFromMinBsYear(bsYear, bsMonth, bsDate);
        let adDate = new Date(this.minAdDateEqBsDate.ad.year, this.minAdDateEqBsDate.ad.month, this.minAdDateEqBsDate.ad.date);
        adDate.setDate(adDate.getDate() + daysNumFromMinBsYear);
        return adDate;
    }

    // get total days from base bs current bs date
    getTotalDaysNumFromMinBsYear(bsYear, bsMonth, bsDate) {
        if (bsYear < DATE_RANGE.minDate || bsYear > DATE_RANGE.maxDate) {
            return 0;
        }
        let daysNumFromMinBsYear = 0;
        let diffYears = bsYear - DATE_RANGE.minDate;
        for (let month = 1; month <= 12; month++) {
            // month < bsmonth = 1<2 then add one more year on diff years (baisakh is less than jestha)
            // then add one more year (i.e jestha is of next year)
            if (month < bsMonth) {
                daysNumFromMinBsYear += this.getMonthDaysNumFormMinBsYear(month, diffYears + 1);
            } else {
                daysNumFromMinBsYear += this.getMonthDaysNumFormMinBsYear(month, diffYears);
            }
        }
        if (bsYear > 2085 && bsYear < 2088) {
            daysNumFromMinBsYear += bsDate - 2;
        } else if (bsYear === 2085 && bsMonth > 5) {
            daysNumFromMinBsYear += bsDate - 2;
        } else if (bsYear > 2088) {
            daysNumFromMinBsYear += bsDate - 4;
        } else if (bsYear === 2088 && bsMonth > 5) {
            daysNumFromMinBsYear += bsDate - 4;
        } else {
            daysNumFromMinBsYear += bsDate;
        }
        return daysNumFromMinBsYear;
    }

    getMonthDaysNumFormMinBsYear(bsMonth, yearDiff) {
        let yearCount = 0;
        let monthDaysFromMinBsYear = 0;
        if (yearDiff === 0) {
            return 0;
        }
        let bsMonthData = DATE_CONVERSION_FORMULA[bsMonth - 1];
        for (let i = 0; i < bsMonthData.length; i++) {
            if (bsMonthData[i] === 0) {
                continue;
            }
            let bsMonthUpperDaysIndex = i % 2;
            if (yearDiff > yearCount + bsMonthData[i]) {
                yearCount += bsMonthData[i];
                monthDaysFromMinBsYear += FLUCTUATION_MONTHS[bsMonth - 1][bsMonthUpperDaysIndex] * bsMonthData[i];
            } else {
                monthDaysFromMinBsYear +=
                    FLUCTUATION_MONTHS[bsMonth - 1][bsMonthUpperDaysIndex] * (yearDiff - yearCount);
                yearCount = yearDiff - yearCount;
                break;
            }
        }
        return monthDaysFromMinBsYear;
    }

    getBsMonthDays(bsYear, bsMonth) {
        let yearCount = 0;
        let totalYears = bsYear + 1 - DATE_RANGE.minDate;
        let bsMonthData = DATE_CONVERSION_FORMULA[bsMonth - 1];
        for (let i = 0; i < bsMonthData.length; i++) {
            if (bsMonthData[i] === 0) {
                continue;
            }
            let bsMonthUpperDaysIndex = i % 2;
            yearCount += bsMonthData[i];
            if (totalYears <= yearCount) {
                if ((bsYear === 2085 && bsMonth === 5) || (bsYear === 2088 && bsMonth === 5)) {
                    return FLUCTUATION_MONTHS[bsMonth - 1][bsMonthUpperDaysIndex] - 2;
                } else {
                    return FLUCTUATION_MONTHS[bsMonth - 1][bsMonthUpperDaysIndex];
                }
            }
        }
        return 0;
    }

    getNepaliNumber(n) {
        return n;
        // const nStringArray = n.toString().split('');
        // return nStringArray.map(e => NEPALI_NUMBERS[+e]).join('');
    }

    getNepaliMonthName(n) {
        return MONTHS[n];
    }
}