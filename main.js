let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());

let port = 3001;

let students =
    [
        { id: 1, name: "Pedro", surname: "Martinez", birthdate: new Date("05/08/1988"), gender: "Male", email: "pedro.martinez@gmail.com" },
        { id: 2, name: "José", surname: "Alvarez", birthdate: new Date("03/04/1985"), gender: "Male", email: "jose.alvarez@gmail.com" },
        { id: 3, name: "Julieta", surname: "Hernandez", birthdate: new Date("09/07/1993"), gender: "Female", email: "julieta.hernandez@gmail.com" },
        { id: 4, name: "Sergio", surname: "Ochoa", birthdate: new Date("11/10/1989"), gender: "Male", email: "sergio.ochoa@gmail.com" },
        { id: 5, name: "Mariana", surname: "Duarte", birthdate: new Date("09/04/1992"), gender: "Female", email: "mariana.duarte@gmail.com" }
    ];

let logger = (log) => {
    if (log.isError) {
        console.error(">>>> " + new Date().toUTCString() + " >>>> method: " + log.method + ", message: " + log.message + "\n");
    } else {
        console.log(">>>> " + new Date().toUTCString() + " >>>> method: " + log.method + ", message: " + log.message + "\n");
    }
}

let sendResponse = (options) => {
    logger({ method: options.method, message: JSON.stringify(options.response), isError: options.response.error });
    options.res.status(options.httpCode);
    options.res.json(options.response);
}

let isValid = (student) => {
    if (!student.name) {
        return { isValid: false, propertyInvalid: "name" };
    } else if (!student.surname) {
        return { isValid: false, propertyInvalid: "surname" };
    } else if (!student.email) {
        return { isValid: false, propertyInvalid: "email" };
    } else {
        return { isValid: true, propertyInvalid: undefined }
    }
}

app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});

app.get('/api/student', (req, res) => {

    if (students.length > 0) {
        let response = { "status": "ok", "message": "Students queried successfully", "error": false, "data": students };
        sendResponse({ method: "GET /api/student", response: response, httpCode: 200, res: res });
    } else {
        let response = { "status": "ok", "message": "no data", "error": false, "data": undefined };
        sendResponse({ method: "GET /api/student", response: response, httpCode: 204, res: res });
    }
});

app.get('/api/student/:id', (req, res) => {

    let idStudent = req.params.id;

    let index = students.map(student => student.id).indexOf(parseInt(idStudent));

    if (index != -1) {
        let response = { "status": "ok", "message": "Student queried successfully", "error": false, "data": students[index] };
        sendResponse({ method: "GET /api/student/" + idStudent, response: response, httpCode: 200, res: res });
    } else {
        let response = { "status": "error", "message": "Student not found", "error": true, "data": undefined };
        sendResponse({ method: "GET /api/student/" + idStudent, response: response, httpCode: 400, res: res });
    }
});

app.post('/api/student', (req, res) => {

    let newStudent = req.body;

    // Validations
    let validation = isValid(newStudent);
    if (!validation.isValid) {
        let response = { "status": "error", "message": "Student " + validation.propertyInvalid + " is required", "error": true, "data": newStudent };
        sendResponse({ method: "POST /api/student", response: response, httpCode: 400, res: res });
    } else {
        students.sort((a, b) => {
            if (a.id < b.id)
                return -1;
            if (a.id > b.id)
                return 1;
            return 0;
        });

        let newId = students[students.length - 1].id + 1;
        newStudent.id = newId;
        students.push(newStudent);

        let response = { "status": "ok", "message": "Student saved successfully", "error": false, "data": newStudent };
        sendResponse({ method: "POST /api/student", response: response, httpCode: 202, res: res });
    }
});

app.put('/api/student', (req, res) => {

    let student = req.body;

    let index = students.map(student => student.id).indexOf(student.id);

    if (index != -1) {
        let validation = isValid(student);
        if (!validation.isValid) {
            let response = { "status": "error", "message": "Student " + validation.propertyInvalid + " is required", "error": true, "data": student };
            sendResponse({ method: "PUT /api/student", response: response, httpCode: 400, res: res });
        } else {
            students[index] = student;
            let response = { "status": "ok", "message": "Student updated successfully", "error": false, "data": student };
            sendResponse({ method: "PUT /api/student", response: response, httpCode: 202, res: res });
        }
    } else {
        let response = { "status": "error", "message": "Student not found", "error": true, "data": undefined };
        sendResponse({ method: "PUT /api/student", response: response, httpCode: 400, res: res });
    }

});

app.delete('/api/student/:id', (req, res) => {

    let idStudent = req.params.id;

    let index = students.map(student => student.id).indexOf(parseInt(idStudent));

    if (index != -1) {
        let response = { "status": "ok", "message": "Student deleted successfully", "error": false, "data": undefined };
        students.splice(index, 1);
        sendResponse({ method: "DELETE /api/student/" + idStudent, response: response, httpCode: 202, res: res });
    } else {
        let response = { "status": "error", "message": "Student not found", "error": true, "data": undefined };
        sendResponse({ method: "DELETE /api/student/" + idStudent, response: response, httpCode: 400, res: res });
    }

});

app.listen(port);
logger({ method: "configuration", message: "App listening on port " + port });