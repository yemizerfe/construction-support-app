const express = require('express');
const cors = require('cors');
const pool = require('./model/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();



app.use(express.json());
app.use(cors());

app.post('/userSignUp', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await pool.query('select * from users where email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists!' });

        }

        const newUser = await pool.query('insert into users (email,password) values ($1,$2) returning *', [email, hashedPassword]);

        if (!newUser) {
            return res.status(400).json({ message: 'User not registered!' });
        }

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (e) {
        next(e);
    }
})

app.post('/userSignIn', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const foundUser = await pool.query('select * from users where email = $1', [email]);

        if (foundUser.rows.length == 0) {
            return res.status(404).json({ message: 'User not found!' })
        }
        const isMatch = await bcrypt.compare(password, foundUser.rows[0].password);

        if (!isMatch)
            return res.status(400).json({ message: 'Invalid Credentials!' });

        const token = jwt.sign({ userId: foundUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    }
    catch (e) {
        next(e);
    }



})


app.post('/projectInfo', async (req, res, next) => {
    const { projectTitle, startDate, endDate, totalBudget } = req.body;
    try {
        const newProject = await pool.query('insert into projectInfo (projectTitle,startDate,endDate,totalBudget) values ($1,$2,$3,$4) returning *', [projectTitle, startDate, endDate, totalBudget]);

        if (!newProject)
            return res.status(400).json({ message: 'Project not set, try again!' });

        res.status(201).json({ message: 'Project set successfully!' });
    }
    catch (e) {
        next(e);
    }

})


app.post('/tasks', async (req, res, next) => {
    const { taskName, taskAssignedTo, taskBudget, taskStartDate, taskEndDate, projectTitle } = req.body;

    try {
        const newTask = await pool.query('insert into tasks ( taskname,taskassignedto,taskbudget,taskstartdate,taskenddate, projectTitle) values($1,$2,$3,$4,$5,$6) returning *', [taskName, taskAssignedTo, taskBudget, taskStartDate, taskEndDate, projectTitle]);

        if (!newTask)
            return res.status(400).json({ message: 'Task not set successfully, try again!' });

        res.status(201).json({ message: 'Task set successfully!' });
    }
    catch (e) {
        next(e);
    }
})

app.post('/expenses', async (req, res, next) => {
    const { expenseName, expenseAmount, expenseProject, expenseDate, category } = req.body;
    try {
        const newExpense = await pool.query('insert into expenses (expenseName, expenseAmount, expenseProject, expenseDate,category) values ($1,$2,$3,$4,$5) returning *', [expenseName, expenseAmount, expenseProject, expenseDate, category]);

        if (!newExpense)
            return res.status(400).json({ message: 'Expense not set successfully, try again!' });

        res.status(201).json({ message: 'Expense set successfully!' });

    }
    catch (e) {
        next(e);
    }
})

app.get('/getProject', async (req, res, next) => {
    const today = new Date().toISOString().split('T')[0];
    try {
        const currentProject = await pool.query(`
  SELECT 
    projectTitle,
    TO_CHAR(startDate, 'YYYY-MM-DD') AS startDate,
    TO_CHAR(endDate, 'YYYY-MM-DD') AS endDate,
    totalBudget,
    status
  FROM projectInfo
  WHERE endDate >= $1
`, [today]);
        if (!currentProject)
            return res.status(404).json({ message: 'No project found at this time.' });
        res.status(200).json({ currentProject });
    }
    catch (e) {
        next(e);
    }

})

app.put('/toggleCompleted/:name', async (req, res, next) => {
    try {
        const toggle = await pool.query('update projectInfo set status = ($1) where projectTitle = ($2) returning *', ['completed', req.params.name]);
        if (!toggle)
            return res.status(400).json({ message: 'ToggleComplete not successful, try again' });

    }
    catch (e) {
        next(e);
    }
})

app.delete('/deleteProject/:name', async (req, res, next) => {
    try {
        const deleteProject = await pool.query('delete from projectInfo where projectTitle = ($1)', [req.params.name]);

        if (!deleteProject)
            return res.status(400).json({ message: 'Delete unsuccessful, try again!' });

    } catch (e) {
        next(e);
    }
})

app.get('/viewInfo/:name', async (req, res, next) => {

    try {
        const foundTasks = await pool.query(`select taskName, 
        TO_CHAR(taskstartDate, 'YYYY-MM-DD') as taskStartDate,
        TO_CHAR(taskenddate, 'YYYY-MM-DD') as taskenddate,
        taskassignedto,
        taskBudget,
        projectTitle,
        status,
        progress
        from tasks where projectTitle = ($1)`, [req.params.name]);
        const foundExpenses = await pool.query(`select 
        expenseName,
        category,
        TO_CHAR(expenseDate, 'YYYY-MM-DD') as expenseDate,
        expenseAmount,
        expenseProject
         from expenses where expenseProject = ($1)`, [req.params.name]);

         if(!foundTasks || !foundExpenses){
            return res.status(404).json({message: 'No information has been found!'});

         }
         const tasks = foundTasks.rows;
         const expenses = foundExpenses.rows;
         res.status(200).json({tasks, expenses});

    }
    catch (e) {
        next(e);
    }
})
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        message: err.message || 'Interval server error!'
    })

});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
}); 