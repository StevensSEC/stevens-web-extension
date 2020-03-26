_References_

-   [Browser Popups](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Popups)
-   [Pug Language](https://pugjs.org/api/getting-started.html)

# Displaying Data with Popups

A popup is a window that displays when a user clicks on the extension icon.
In the Stevens Web Extension, we use a popup as an interface to show different
forms of useful data, such as the rooms available or your meal swipes.

The popup requires an HTML page to display content. In our web extension, we use the language Pug to write code that will _transcompile_ into HTML. The syntax is similar to Python in the sense that indentation is necessary, which increases the readability of the markup since no closing tags, angled brackets, and more are needed. Additionally, you can use the shortcuts like `#container.round` which transpiles to:

```
<div id="container" class="round"></div>
```

For this challenge, you will need to write code in `popup.ts` to prepare and pass the data to display, and `popup.pug` for rendering the data.

**I: Display Student Grades**

Use the following data to display a student's grades on the popup:

```
{
    "scheme": {
        "A": 0.9,
        "B": 0.8,
        "C": 0.7,
        "D": 0.6
    },
    "grades": {
        "BT 321": 0.84,
        "CS 385": 0.72,
        "EM 115": 0.94
    }
}
```

The popup should include the course name, grade percentage, and letter grade e.g. `BT 321: 84% (B)`.

<details>
    <summary>Hint 1</summary>
    <code>const UpdateGrades = require('/path/to/pug');</code> creates a template function which takes in an object to pass onto Pug. For example, calling <code>UpdateGrades({name: "Bob"})</code> will make the variable "name" available in the Pug namespace and renders "Bob" in the resulting HTML.
</details>
<details>
    <summary>Hint 2</summary>
    Use Pug's <code>each</code> keyword to loop through the data. It uses value and index as its two iteration parameters.
</details>

**II: Calculate GPA / Grades Needed**

Either using the existing sample data and adding to it, or using real data obtained from the Canvas API, write functions to calculate a student's GPA and what grades they need to receive on future assignments or exams to receive some desired grade. The functions should resemble the following signature:

```ts
function calculateGPA(data: Object, scale: Object): Number {
    /* Takes grades in data, as well as a map of grade letters to GPA values, and returns the calculated GPA. */
}
```

```ts
function gradeNeeded(data: Object, desired: string): Number {
    /* Takes grades and weights in data and the desired letter grade, and returns the average needed on upcoming assignments to receive the letter grade. */
}
```

<details>
    <summary>Hint 1</summary>
    If you want to receive existing data from Canvas, look into <code>GET /api/v1/courses/:course_id/grading_standards</code> to convert to GPA, as well as <code>GET /api/v1/courses/:course_id/assignments</code> which has a <code>grading_type</code> field.
</details>
