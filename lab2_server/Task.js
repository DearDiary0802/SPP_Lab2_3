class Task {
    id;
    name;
    description;
    status;
    file;
    deadline;

    constructor(id, name, description, status, deadline, file = null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.file = file;
        this.deadline = deadline;
    }
}

module.exports = Task;