var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const TaskStatus = require("./TaskStatus");
const Task = require("./Task");

const tokenKey = "secret12345";

const usersFilename = 'users.json';
const tasksFilename = 'tasks.json';
const port = process.env.PORT | 3000;

let userId = -1;

var app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let obj = {
    tasks: []
};

let users = {};

if (fs.existsSync(tasksFilename)) {
    obj = readJSONFileSync(tasksFilename, 'utf8');
    normalizeDate(obj);
    changeTaskStatus(obj);
}

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(express.static(__dirname));
app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "http://localhost:4200",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "Origin, Content-Type, Authorization, X-Auth-Token, Access-Control-Allow-Credentials, Access-Control-Allow-Origin",
    });
    next();
});

app.use(multer({storage: storageConfig}).single('task-file'));

app.use(cookieParser());

app.use(async (req, res, next) => {
    try {
        let decoded = jwt.verify(req.cookies.token, tokenKey);
        let users = readJSONFileSync(usersFilename, 'utf8');
        let user = users.find(u => u.login === decoded.login);
        req.logged = user !== undefined && await bcrypt.compare(decoded.password, user.hashedPassword);
        userId = user.id;
    } catch {
        req.logged = false;
    }
    next();
});

app.get('/tasks', function (req, res) {
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    changeTaskStatus(obj);
    //setHeaders(res);
    res.status(200).send(obj.tasks);
});

app.get('/tasks/:filter', function (req, res)  {
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    let filteredTasks = obj.tasks;
    let filter = req.params.filter;
    switch (filter) {
        case TaskStatus.DONE:
            filteredTasks = obj.tasks.filter(v => v.status === TaskStatus.DONE);
            break;
        case TaskStatus.IN_PROGRESS:
            filteredTasks = obj.tasks.filter(v => v.status === TaskStatus.IN_PROGRESS);
            break;
        case TaskStatus.EXPIRED:
            filteredTasks = obj.tasks.filter(v => v.status === TaskStatus.EXPIRED);
            break;
    }
    changeTaskStatus(obj);
    res.status(200).send(filteredTasks);
});

app.get("/download/:taskId/:filename", function (req, res) {
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    let path = process.cwd() + "\\uploads\\" + req.params.filename;
    let taskId = req.params.taskId;
    let originalName = obj.tasks.filter(v => v.id === parseInt(taskId))[0].file.originalname;
    res.download(path, originalName);
});

app.get('/*', function (req, res) {
    res.status(404).send();
    res.end();
});


app.post('/tasks', function (req, res) {
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    if (!req.body) {
        return res.status(404).send();
    }

    obj = readJSONFileSync(tasksFilename, 'utf8');
    normalizeDate(obj);
    changeTaskStatus(obj);

    let taskId = obj.tasks[obj.tasks.length - 1].id + 1;
    if (!req.body.name) {
        req.body.name = `New task ${taskId}`;
    }
    if (!req.body.deadline) {
        req.body.deadline = new Date(Date.now() + 1 * 24 * 3600 * 1000);
    }

    const task = new Task(taskId, req.body.name, req.body.description, TaskStatus.IN_PROGRESS, req.body.deadline, req.file);
    obj.tasks.push(task);

    writeJSONFileSync(tasksFilename);

    res.status(200).send(obj.tasks);
});

app.put("/tasks/complete/:taskId", function (req, res) {
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    if (!req.body) {
        return res.status(404).send();
    }

    obj = readJSONFileSync(tasksFilename, 'utf8');
    normalizeDate(obj);
    changeTaskStatus(obj);

    let taskId = req.params.taskId;
    obj.tasks.find(v => v.id === parseInt(taskId)).status = TaskStatus.DONE;

    writeJSONFileSync(tasksFilename);

    res.status(200).send(obj.tasks);
});

app.delete("/tasks/:taskId", function (req, res) {
    if (!req.logged) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    if (!req.body) {
        return res.status(404).send();
    }
    obj = readJSONFileSync(tasksFilename, 'utf8');
    normalizeDate(obj);
    changeTaskStatus(obj);

    let taskId = req.params.taskId;
    obj.tasks = obj.tasks.filter(v => v.id !== parseInt(taskId));

    writeJSONFileSync(tasksFilename);

    res.status(200).send(obj.tasks);
});

app.post("/signUp", function (req, res) {
    users = readJSONFileSync(usersFilename, 'utf8');
    let user = users.find(u => u.login === req.body.login);
    if (user === undefined) {
        let userId = users[users.length - 1].id + 1;
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        users.push({ id: userId, login: req.body.login, hashedPassword: passwordHash });
        let token = jwt.sign(req.body, tokenKey, {expiresIn: 600});
        res.cookie('token', token, { httpOnly: true});
        writeJSONFileSync(usersFilename, 'utf8');
        res.end();
    } else {
        res.status(409).json({ message: 'Conflict' })
    }
});

app.post("/signIn", async function (req, res) {
    users = readJSONFileSync(usersFilename, 'utf8');
    let user = users.find(u => u.login === req.body.login);
    if (user !== undefined) {
        const match = await bcrypt.compare(req.body.password, user.hashedPassword);
        if (match) {
            userId = user.id;
            let token = jwt.sign(req.body, tokenKey, {expiresIn: 600});
            res.cookie('token', token, { httpOnly: true});
            res.send(obj.tasks);
        }
        else {
            res.status(401).json({ message: 'Bad password' })
        }
    } else {
        res.status(401).json({ message: 'Not authorized' })
    }
});


app.listen(port, function () {
    console.log(`ToDo listening on port ${port}!`);
})

function readJSONFileSync(filename, encoding) {
    let data = fs.readFileSync(filename, encoding).toString();
    if (filename === tasksFilename && !data)
        data = '{"tasks":[]}';
    return JSON.parse(data);
}

function writeJSONFileSync(filename) {
    let data;
    if (filename === tasksFilename)
        data = JSON.stringify(obj);
    else
        data = JSON.stringify(users);
    fs.writeFileSync(filename, data);
    return data;
}

function changeTaskStatus(data) {
    data.tasks.forEach(task => {
        if (task.status === TaskStatus.IN_PROGRESS)
            if (task.deadline < new Date(Date.now())) {
                task.status = TaskStatus.EXPIRED;
            }
    })
}

function normalizeDate(data) {
    data.tasks.forEach(task => task.deadline = new Date(task.deadline));
}