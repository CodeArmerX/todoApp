import { Input, Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts"
import { green, red } from "https://deno.land/std@0.183.0/fmt/colors.ts";
import { v4 } from 'npm:uuid'
import * as mod from "https://deno.land/std@0.170.0/fmt/colors.ts";
import { updateDB } from './database.js'
import { app } from "../app.js";
// add task to data.json
const createTask = async (data) => {
    const task = await Input.prompt({
        message: 'Que tarea vamos a agregar?'
    })
    if (task.length < 4) {
        alert(red('No se puede agregar una tarea tan pequeña!'))
        return app()
    }
    else {
        const newTask = {
            id: v4(),
            name: task,
            createDateTime: new Date(),
            completed: false
        }
        const updatedData = [...data, newTask]
        updateDB(updatedData)
        alert(green('Tarea agregada exitosamente!'))
        app()
    }
}
const listTask = async (data) => {
    const listCondition = await Select.prompt({
        message: 'Que tareas queremos listar?',
        options: [
            { name: 'Todas', value: 'all' },
            { name: 'Completadas', value: 'completed' },
            { name: 'Pendientes', value: 'pending' }
        ]
    })
    const mappedData = (filteredData) => {
        filteredData.map((task, i) => {
            console.log(
                `${green(`${i + 1}.`)} ${task?.name} > ${task?.completed ? green('Completada!') : red('Pendiente...')}`)
        })
        return alert(green('Tareas listadas exitosamente!'))
    }
    if (listCondition === 'all') {
        console.log(mappedData(data))
    }
    if (listCondition === 'completed') {
        const filteredData = data.filter(({ completed }) => completed)
        console.log(mappedData(filteredData))
    }
    if (listCondition === 'pending') {
        const filteredData = data.filter(({ completed }) => !completed)
        console.log(mappedData(filteredData))
    }
    app()
}
const completeTask = async (data) => {
    const incompleteTask = data.filter(task => !task.completed)
    if (incompleteTask.length === 0) {
        console.log('No hay tareas incompletas')
        return
    }
    const options = incompleteTask.map(({ name, id }) => {
        return {
            name,
            value: id
        }
    })
    const completeCondition = await Select.prompt({
        message: 'Que tarea completaremos hoy?',
        options
    })
    const updatedData = data.map(task => {
        return task.id === completeCondition
            ? { ...task, completed: true }
            : task
    })
    updateDB(updatedData)
    alert(green(`La tarea ha sido completada!`))
    app()
}
const deleteTask = async (data) => {
    const options = data.map(({ name, id }) => {
        return {
            name,
            value: id
        }
    })
    const deleteCondition = await Select.prompt({
        message: 'Que tarea borraremos hoy?',
        options
    })
    const updatedData = data.filter(task => task.id !== deleteCondition)
    updateDB(updatedData)
    alert(green(`La tarea ha sido borrada exitosamente!`))
    app()
}
export { createTask, listTask, completeTask, deleteTask }