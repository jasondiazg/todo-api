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
    console.log(">>>> " + new Date().toUTCString() + " >>>> method: " + log.method + ", message: " + log.message + "\n");
}

app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});

app.get('/api/student', (req, res) => {

    if (students.length > 0) {
        let response = { "status": "ok", "message": "Students queried successfully", "data": students };
        logger({ method: "GET /api/student", message: JSON.stringify(response) });
        res.status(200);
        res.json(response);
    } else {
        let response = { "status": "ok", "message": "no data", "data": undefined };
        logger({ method: "GET /api/student", message: JSON.stringify(response) });
        res.status(204);
        res.json(response);
    }
});

app.get('/api/student/:id', (req, res) => {

    let idStudent = req.params.id;

    let index = students.map(student => student.id).indexOf(parseInt(idStudent));

    if (index != -1) {
        let response = { "status": "ok", "message": "Student queried successfully", "data": students[index] };
        logger({ method: "GET /api/student/" + idStudent, message: JSON.stringify(response) });
        res.status(200);
        res.json(response);
    } else {
        let response = { "status": "error", "message": "Student not found", "data": undefined };
        logger({ method: "GET /api/student" + idStudent, message: JSON.stringify(response) });
        res.status(400);
        res.json(response);
    }
});

app.post('/api/student', (req, res) => {

    let newStudent = req.body;

    // Validations
    if (!newStudent.name) {
        let response = { "status": "error", "message": "Student name is required", "data": newStudent };
        logger({ method: "POST /api/student", message: JSON.stringify(response) });
        res.status(400);
        res.json(response);
    } else if (!newStudent.surname) {
        let response = { "status": "error", "message": "Student surname is required", "data": newStudent };
        logger({ method: "POST /api/student", message: JSON.stringify(response) });
        res.status(400);
        res.json(response);
    } else if (!newStudent.email) {
        let response = { "status": "error", "message": "Student email is required", "data": newStudent };
        logger({ method: "POST /api/student", message: JSON.stringify(response) });
        res.status(400);
        res.json(response);
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
        
        let response = { "status": "ok", "message": "Student saved successfully", "data": newStudent };
        logger({ method: "POST /api/student", message: JSON.stringify(response) });
        res.status(202);
        res.json(response);
    }
});

app.put('/api/student', function (req, res) {

    let student = req.body;

    let index = students.map(student => student.id).indexOf(student.id);

    if (index != -1) {
        let response = { "status": "ok", "message": "Student updated successfully", "data": student };
        logger({ method: "PUT /api/student", message: JSON.stringify(response) });
        students[index] = student;
        res.status(202);
        res.json(response);
    } else {
        let response = { "status": "error", "message": "Student not found", "data": undefined };
        logger({ method: "PUT /api/student", message: JSON.stringify(response) });
        res.status(400);
        res.json(response);
    }

});

app.delete('/api/student/:id', function (req, res) {

    let idStudent = req.params.id;

    let index = students.map(student => student.id).indexOf(parseInt(idStudent));

    if (index != -1) {
        let response = { "status": "ok", "message": "Student deleted successfully", "data": undefined };
        logger({ method: "DELETE /api/student/" + idStudent, message: JSON.stringify(response) });
        students.splice(index, 1);
        res.status(202);
        res.json(response);
    } else {
        let response = { "status": "error", "message": "Student not found", "data": undefined };
        logger({ method: "DELETE /api/student/" + idStudent, message: JSON.stringify(response) });
        res.status(400);
        res.json(response);
    }

});

app.listen(port);
logger({ method: "configuration", message: "App listening on port " + port });