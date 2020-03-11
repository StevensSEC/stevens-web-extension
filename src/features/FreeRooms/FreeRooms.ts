import ROOMS from './Rooms';

//fetching

/**
 * Fetches the HTML from the Stevens room scheduling
 * website for the specified year and semster.
 * @param year An integer representing the year to query.
 * @param semester The semester to be queried. Possible values are: 'F', 'S', 'A', 'B', 'W'.
 */
async function fetchRoomSchedHTML(year: Number, semester: string) {
    /*
    Possible Semester Values:
    F - Fall
    S - Spring
    A - Summer Session A
    B - Summer Session B
    W - Winter Session
    */
    try {
        const response = await fetch(
            `https://web.stevens.edu/roomsched?year=${year}&session=${semester}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/html',
                },
            }
        );
        return await response.text();
    } catch (e) {
        console.error(e);
    }
}

//parsing

/**
 * Returns an HTML Document parsed from HTMLString.
 * @param HTMLString The string of HTML to be parsed.
 */
function parse(HTMLString: string) {
    return new DOMParser().parseFromString(HTMLString, 'text/html');
}

//logic

/**
 * Return an object whose properties are the names of the rooms listed on
 * the HTMLDocument and whose values are the HTML table elements objects
 * corresponding to those rooms.
 * @param HTMLDocument The Document containing information about room scheduling.
 */
function getTablesPerRoom(HTMLDocument: Document) {
    let roomTableDict = {};
    let roomTables = HTMLDocument.querySelectorAll('table');
    for (let i = 0; i < ROOMS.length; i++) {
        //match all of the tables loaded in the HTML to a the name of a room
        //checking by hand, it seems there are only as many tables as there are rooms
        //no other tables for decoration or some other data, etc.
        roomTableDict[ROOMS[i]] = roomTables[i];
    }
    return roomTableDict;
}

/**
 * Returns a table row object that corresponds to the selected day.
 * @param day The day to retrieve the row for.
 * @param table The table to retrieve the row from.
 */
function getDaysRow(day, table: HTMLTableElement) {
    if (day === 0 || day === 6) {
        //It's the weekend, there are no classes scheduled
        return null;
    }
    const dayOfWeek = {
        1: 'M',
        2: 'T',
        3: 'W',
        4: 'R',
        5: 'F',
    };

    let tableRow;
    //filter through all rows of the table, finding the one that
    //has a td tag with today's day and returning that one
    table.querySelectorAll('tr').forEach(row => {
        row.querySelectorAll('td').forEach(td => {
            if (td.innerHTML === dayOfWeek[day]) {
                tableRow = row;
            }
        });
    });
    return tableRow;
}

/**
 * Returns a boolean indicating whether the room has an event
 * during the time passed in.
 * @param row The HTML row for the considered room and day.
 * @param date A Date object whose time is considered.
 */
function hasNoScheduledEvent(row, date: Date) {
    if (date.getHours() < 8 || date.getHours() > 22) {
        //These times are outside building operation hours
        return false;
    }

    if (!row) {
        //It's the weekend
        return true;
    }

    //Each row is subdivided into 56 different segments
    //with the first segment representing the time 8:00 AM
    //and the last segment representing 9:45 PM.

    //There are a additional 3 segments that are on the table but unaccounted for.

    let colspanTime = convertTimetoColspan(date);
    let totalColspan = 0;
    let flag = false;
    let dataElements = row.querySelectorAll('td');
    for (let td of dataElements) {
        if (td.hasAttribute('colspan')) {
            totalColspan += parseInt(td.getAttribute('colspan'));
            if (totalColspan >= colspanTime) {
                if (td.innerHTML === '') {
                    flag = true;
                } else {
                    break;
                }
            }
        }
    }
    return flag;
}

/**
 * Returns the column of the table this time occupies on the
    room scheduling website.
 * @param date A Date object between 8 AM and 9:45 PM.
 */
function convertTimetoColspan(date: Date) {
    //8 AM -> 0, 9:45 PM -> 55

    let hours = date.getHours();
    let minutes = date.getMinutes();
    return (hours - 8) * 4 + Math.floor(minutes / 15);
}

/**
 * Returns the current semester that corresponds to date.
 * @param date A Date whose month is considered.
 */
function getSemesterFromDate(date: Date) {
    //TODO: more accurately determine the current semester
    //without relying only on the month

    let month = date.getMonth();
    if (month === 0) {
        return 'W';
    } else if (month >= 1 && month <= 4) {
        return 'S';
    } else if (month === 5) {
        return 'A';
    } else if (month >= 6 && month <= 7) {
        return 'B';
    }
    return 'F';
}

/**
 * Updates the rooms in storage.
 */
function getAvailableRooms() {
    let availableRooms = [];
    let today = new Date();

    fetchRoomSchedHTML(today.getFullYear(), getSemesterFromDate(today)).then(
        res => {
            let tables = getTablesPerRoom(parse(res));
            for (let room in tables) {
                let row = getDaysRow(today.getDay(), tables[room]);
                if (hasNoScheduledEvent(row, today)) {
                    availableRooms.push(room);
                }
            }
            chrome.storage.local.set({availableRooms: availableRooms});
        }
    );
}

chrome.runtime.onInstalled.addListener(details => {
    getAvailableRooms();
    chrome.alarms.create('rooms', {
        periodInMinutes: 15,
    });

    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === 'rooms') {
            getAvailableRooms();
        }
    });
});

// async function testGetAvailableRooms() {
//     /*
//      DEPRECATED
//     A test to ensure that getAvailableRooms is functional. Returns
//     true if working as expected.
//     */

//     let date = new Date('February 24, 2020 08:00:00');
//     let semester = getSemesterFromDate(date);
//     let html = parse(await fetchRoomSchedHTML(date.getFullYear(), semester));

//     const availableRooms = getAvailableRooms(date, html);
//     console.log(
//         'getAvailableRooms() thinks that these are the available rooms on Monday at 8 AM:'
//     );
//     console.log(availableRooms);
//     return (
//         JSON.stringify(availableRooms) ===
//         JSON.stringify([
//             'A115',
//             'A501',
//             'ABS301',
//             'B123',
//             'B126',
//             'B312',
//             'B313',
//             'B314',
//             'B430',
//             'B514',
//             'B517',
//             'B518',
//             'B519',
//             'B620',
//             'B714',
//             'B715',
//             'BC104',
//             'BC110',
//             'BC122',
//             'BC202',
//             'BC203',
//             'BC204',
//             'BC210',
//             'BC212',
//             'BC219',
//             'BC220',
//             'BC221',
//             'BC304',
//             'BC310',
//             'BC312',
//             'BC319',
//             'BC320',
//             'BC321',
//             'BC532B',
//             'BC541',
//             'BCHFSL',
//             'C315',
//             'D231',
//             'D242',
//             'E011',
//             'E111',
//             'E130',
//             'E201',
//             'E229',
//             'E229A',
//             'E231',
//             'E308',
//             'E329',
//             'E330',
//             'GN204',
//             'GN213',
//             'GN303',
//             'GS021',
//             'GS024',
//             'GS025',
//             'GS121',
//             'GS122',
//             'GS123',
//             'GS216',
//             'K228',
//             'K350',
//             'K360',
//             'K380',
//             'K390',
//             'M101',
//             'M105',
//             'M201',
//             'M203',
//             'M205',
//             'M324',
//             'NB101',
//             'NB102',
//             'NB105',
//             'P116',
//             'P120',
//             'P216',
//             'P218',
//             'P220',
//             'R201',
//             'S4TH',
//             'X003',
//             'X004',
//             'X011',
//             'X104',
//             'X105',
//             'X106',
//             'X118',
//             'X119',
//             'X120',
//             'X203',
//             'X218A',
//             'X218B',
//             'X219',
//             'X323',
//             'X414',
//             'X429',
//             'X504',
//             'X510',
//             'X522',
//         ])
//     );
// }
// testGetAvailableRooms().then(bool => console.log(bool));
