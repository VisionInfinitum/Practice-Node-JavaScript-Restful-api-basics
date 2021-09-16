let fs = require("fs"); // built in node module that knows how to work with reading and writing files
const FILE_NAME = './assets/students.json';

let studentRepo = {
    get: function(resolve, reject) {
        fs.readFile(FILE_NAME, function(error, data) {
            if(error) {
                reject(error);
            }
            else {
                resolve(JSON.parse(data));
            }
        })
    },
    getById: function(id,resolve, reject) {
        fs.readFile(FILE_NAME, function(error, data) {
            if(error) {
                reject(error);
            } else {
                let student = JSON.parse(data).find(s => s.id == id);
                resolve(student);
            }
        })
    },
    search: function(searchObject, resolve, reject) {
        fs.readFile(FILE_NAME, function(error, data) {
            if(error) {
                reject(error);
            }
            else {
                let students = JSON.parse(data);
                // If empty object return everything
                // if id --> search if that id matches else false
                // if name --> search if that name matches else false
                // if both --> search both id and name matches else false
                if(searchObject) {
                    students = students.filter( s =>
                    (searchObject.id ? s.id == searchObject.id : true) &&
                    (searchObject.name ? s.name.toLowerCase().indexOf(searchObject.name.toLowerCase()) >= 0 : true));
                }
                resolve(students);
            }
        })
    },
    insert: function(newData, resolve, reject) {
        fs.readFile(FILE_NAME, function(error, data) {
            if(error) {
                reject(error);
            } else {
                let students = JSON.parse(data);
                students.push(newData);
                fs.writeFile(FILE_NAME, JSON.stringify(students), function(error){
                    if(error) {
                        reject(error);
                    } else {
                        resolve(newData);
                    }
                })
            }
        })
    },
    update: function(newData, id, resolve, reject) {
        fs.readFile(FILE_NAME, function(error, data) {
            if(error) {
                reject(error);
            } else {
                let students = JSON.parse(data);
                let student = students.find(s => s.id == id);
                if(student) {
                    // assign will take everything in the current student object
                    // and any values that are in the new data properties
                    // that match, it will change the data.
                    Object.assign(student,newData);
                    // Since we have a reference to that changed object and we have changed it
                    // we can then write back our data
                    fs.writeFile(FILE_NAME, JSON.stringify(students), function(error) {
                        if(error) {
                            reject(error);
                        } else {
                            resolve(newData);
                        }
                    })
                }
            }
        })
    },
    delete: function(id, resolve, reject) {
        fs.readFile(FILE_NAME, function(error, data){
            if(error){
                reject(error);
            } else {
                let students = JSON.parse(data);
                let index = students.findIndex(s => s.id == id);
                if(index != -1) {
                    students.splice(index,1);
                    fs.writeFile(FILE_NAME, JSON.stringify(students), function(error) {
                        if(error) {
                            reject(error);
                        } else {
                            resolve(index);
                        }
                    })
                }
            }
        })
    }
};

module.exports = studentRepo;