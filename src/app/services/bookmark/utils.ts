<<<<<<< HEAD
import { BookMark } from './model';
=======
import { BookMark } from "./model";
>>>>>>> b3374e62e3a90fe0d28ea78b0f30f65f0b4cc0a1
import { Filter } from 'arlas-api';

export function getKeyForColor(dataModel: Object): string {
    const finalKeys: string[] = [];
    Object.keys(dataModel).forEach(k => {
        const key = [];
        if ((<Filter>dataModel[k].filter).f !== undefined) {
            (<Filter>dataModel[k].filter).f
                .forEach(e => e
                    .forEach(ex => {
                        if (key.indexOf('f' + ex.field + ex.op) < 0) {
                            key.push('f' + ex.field + ex.op);
                        }
                    }));
        }
        if ((<Filter>dataModel[k].filter).q !== undefined) {
            if (key.indexOf('q') < 0) {
                key.push('q');
            }
        }
        if ((<Filter>dataModel[k].filter).gintersect !== undefined) {
            if (key.indexOf('gintersect') < 0) {
                key.push('gintersect');
            }
        }
        if ((<Filter>dataModel[k].filter).gwithin !== undefined) {
            if (key.indexOf('gwithin') < 0) {
                key.push('gwithin');
            }
        }
        if ((<Filter>dataModel[k].filter).notgintersect !== undefined) {
            if (key.indexOf('notgintersect') < 0) {
                key.push('notgintersect');
            }
        }
        if ((<Filter>dataModel[k].filter).notgwithin !== undefined) {
            if (key.indexOf('notgwithin') < 0) {
                key.push('notgwithin');
            }
        }
        if ((<Filter>dataModel[k].filter).notpwithin !== undefined) {
            if (key.indexOf('notpwithin') < 0) {
                key.push('notpwithin');
            }
        }
        if ((<Filter>dataModel[k].filter).pwithin !== undefined) {
            if (key.indexOf('pwithin') < 0) {
                key.push('pwithin');
            }
        }
        finalKeys.push(key.sort().join(','));
    });
<<<<<<< HEAD
    return intToRGB(hashCode(finalKeys.sort().join(',')));
=======
    return this.intToRGB(this.hashCode(finalKeys.sort().join(',')));
>>>>>>> b3374e62e3a90fe0d28ea78b0f30f65f0b4cc0a1
}
export function hashCode(str) { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

export function intToRGB(i) {
    const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
}

export class Guid {
    public newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export function sortOnDate(data: BookMark[]): BookMark[] {
    const sortedData = data.sort((a, b) => {
        let propertyA: number = new Date(0).getTime();
        let propertyB: number = new Date(0).getTime();
        [propertyA, propertyB] = [a.date.getTime(), b.date.getTime()];
        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (-1);
    });
    return sortedData;
<<<<<<< HEAD
}
=======
}
>>>>>>> b3374e62e3a90fe0d28ea78b0f30f65f0b4cc0a1
