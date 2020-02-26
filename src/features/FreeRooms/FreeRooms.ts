import ROOMS from './Rooms';

async function getRoomSchedHTML(year, semester) {
    /*
    Input is an integer representing the year that you'd like to query
    as well as a string representing the semester for which you'd like
    to query.

    Possible Semester Values:
    F - Fall
    S - Spring
    A - Summer Session A
    B - Summer Session B
    W - Winter Session

    Output is a Promise that, if successful, returns a string of HTML
    that is received when making a GET request to the
    Stevens room schedule website.
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

async function getTablesPerRoom(year, semester) {
    /*
    Input is an integer representing the year that you'd like to query
    as well as a string representing the semester for which you'd like
    to query.

    Output is an object whose properties are the names of the rooms listed on
    web.stevens.edu and whose values for those properties are the HTML table elements objects
    corresponding to those rooms.
    */
    let HTMLString;
    let roomTableDict = {};
    HTMLString = await getRoomSchedHTML(year, semester);
    let domparser = new DOMParser();
    let document = domparser.parseFromString(HTMLString, 'text/html');
    let roomTables = document.querySelectorAll('table');
    for (let i = 0; i < ROOMS.length; i++) {
        //match all of the tables loaded in the HTML to a the name of a room
        //checking by hand, it seems there are only as many tables as there are rooms
        //no other tables for decoration or some other data, etc.
        roomTableDict[ROOMS[i]] = roomTables[i];
    }
    return roomTableDict;
}

function getDaysRow(day, table) {
    /*
    Input is an integer representing the day of the week, and a
    HTML table object that corresponds to a room.

    Output is a table row object that corresponds to the selected day.
    */

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

function hasNoScheduledEvent(row, time) {
    /*
    Input is an HTML row representing a room's availability
    for a given day, and a time given by a Date().

    Output is a boolean indicating whether the room has an event
    during the time passed in.
    */

    if (!row) {
        //It's the weekend
        return true;
    }

    //Each row is subdivided into 56 different segments
    //with the first segment representing the time 8:00 AM
    //and the last segment representing 9:45 PM.

    //There are a additional 3 segments that are on the table but unaccounted for.

    if (time.getHours() < 8 || time.getHours() > 22) {
        //These times are outside building operation hours
        return false;
    }
    let colspanTime = convertTimetoColspan(time);
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

function convertTimetoColspan(time) {
    /*
    Input is a time given by a Date() object between
    8 AM and 9:45 PM.
    Output is the column of the table this time occupies on the
    room scheduling website.
    */

    //8 AM -> 0, 9:45 PM -> 55

    let hours = time.getHours();
    let minutes = time.getMinutes();
    return (hours - 8) * 4 + Math.floor(minutes / 15);
}

function getSemesterFromDate(date) {
    /*
    Input is a Date() object.

    Output is the current semester that corresponds to that date.
    */

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

async function getAvailableRooms(date) {
    /*
    Input is a Date() object.

    Output is a Promise that on success
    returns an array of rooms with no classes scheduled according
    to the room scheduling website.
    */

    let availableRooms = [];

    let year = date.getFullYear();
    let semester = getSemesterFromDate(date);
    let day = date.getDay();

    let tables = await getTablesPerRoom(year, semester);
    for (let room in tables) {
        let row = getDaysRow(day, tables[room]);
        if (hasNoScheduledEvent(row, date)) {
            availableRooms.push(room);
        }
    }
    return availableRooms;
}

chrome.runtime.onInstalled.addListener(details => {
    getAvailableRooms(new Date()).then(rooms => {
        chrome.storage.local.set({availableRooms: rooms});
        chrome.alarms.create('rooms', {
            periodInMinutes: 15,
        });
    });

    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === 'rooms') {
            getAvailableRooms(new Date()).then(rooms => {
                chrome.storage.local.set({availableRooms: rooms});
            });
        }
    });
});

// async function testGetAvailableRooms() {
//     /*
//     A test to ensure that getAvailableRooms is functional. Returns
//     true if working as expected.
//     */

//     const availableRooms = await getAvailableRooms(
//         new Date('February 24, 2020 08:00:00')
//     );
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
