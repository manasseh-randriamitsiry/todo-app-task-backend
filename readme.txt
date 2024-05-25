fidemmarena anazy:
node user.js // alefa le serveur user
node task.js // alefa le serveur task

jwt: a736926ef15f1d1cb88c8f61b697549a2fc180c7e95b564192652bf885874a64

uri: http://127.0.0.1:3001/tasks
post task request and format:
 {
     "username":"zaza",
     "taskName":"test",
     "taskDescription":"description task",
     "date": "2023-01-01"
 }

get tasks request : http://127.0.0.1:3001/tasks

update task: http://127.0.0.1:3001/tasks/1
{
    "taskName":"test edites",
    "taskDescription":"description task edited",
    "date": "2023-01-11"
}

delete task: http://127.0.0.1:3001/tasks/1

///// USERS
create user : http://127.0.0.1:3000/signup
 {
     "username":"zaza",
     "password":"test"
 }

login : http://127.0.0.1:3000/login
 {
     "username":"zaza",
     "password":"test"
 }
 ==> mahazo token de iny no apesaina amle authentification( expiration sy validation, fa tsy voatery hapiasaina raha tsy hay)

logout: averina alefa any le token hatao lany daty ( ketreho @net )
ohatrohatra: http://127.0.0.1:3000/logout?Authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InphemEiLCJ1c2VySWQiOjEsImlhdCI6MTcxNDc1NzQ0MCwiZXhwIjoxNzE0NzYxMDQwfQ.ulJXmOlbISYzzyTpfR1rl9_1frwHrfnpPzVPkjApRWM

