import ROOMS from './Rooms';

const YEAR = new Date().getFullYear();
const SEMESTER = 'S';
const DAY = 2; //Tuesday
/*
TODO: Determine the semester programatically using the date
TODO: Determine the day of the week programtically (using Tuesday for testing)
*/

function getRoomSchedHTML(year, semester) {
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
    let request = new XMLHttpRequest();
    request.responseType = 'text';
    return new Promise((resolve, reject) => {
        request.onload = () => {
            if (request.status !== 200) {
                reject(
                    `Failed to retrieve HTML from roomsched website with error code ${request.status}`
                );
                return;
            }
            resolve(request.response);
        };
        request.open(
            'GET',
            `https://web.stevens.edu/roomsched?year=${year}&session=${semester}`
        );
        request.send();
    });
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

function getTodaysRow(day, table) {
    /*
    Input is an integer representing the day of the week, and a
    HTML table object that corresponds to a room.

    Output is a table row object that corresponds to the selected day.
    */

    if (day === 0 || day === 6) {
        console.log('Today is the weekend, there are no classes scheduled.');
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

//testing
getTablesPerRoom(YEAR, SEMESTER)
    .then(tables => {
        console.log(getTodaysRow(DAY, tables['A115']));
    })
    .catch(err => console.error(err));
