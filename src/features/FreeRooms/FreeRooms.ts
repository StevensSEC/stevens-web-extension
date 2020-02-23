import ROOMS from './Rooms';

const YEAR = new Date().getFullYear();
const SEMESTER = 'S';
/*
TODO: Determine the semester programatically using the date
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

//a console.log so the linter doesn't yell at me
getTablesPerRoom(YEAR, SEMESTER).then(object => {
    console.log(object);
});
