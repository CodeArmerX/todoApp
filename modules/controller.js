import { Input, Select, Confirm } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts"
import { green, red } from "https://deno.land/std@0.183.0/fmt/colors.ts";
import { v4 } from 'npm:uuid'
import * as mod from "https://deno.land/std@0.170.0/fmt/colors.ts";
import { app } from "../app.js"
import { taskOptions } from './consts.js'

// Write in the database file
const updateDB = (data) => {
    Deno.writeTextFileSync('./database/data.json', JSON.stringify(data))
}
// Create a task with the input
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
// List the tasks with the input
const listTask = async (data) => {
    if (data.length === 0) {
        alert(red('No hay tareas para listar... Agrega una!'))
        return app()
    }
    const listCondition = await Select.prompt({
        message: 'Que tareas queremos listar?',
        options: [
            { name: 'Todas', value: taskOptions.all },
            { name: 'Completadas', value: taskOptions.completed },
            { name: 'Pendientes', value: taskOptions.pending }
        ]
    })
    const mappedData = (filteredData) => {
        filteredData.map((task, i) => {
            console.log(
                `${green(`${i + 1}.`)} ${task?.name} > ${task?.completed ? green('Completada!') : red('Pendiente...')}`)
        })
        return alert(green('Tareas listadas exitosamente!'))
    }
    // Conditions to list the tasks
    if (listCondition === taskOptions.all) {
        console.log(mappedData(data))
    }
    if (listCondition === taskOptions.completed) {
        const filteredData = data.filter(({ completed }) => completed)
        filteredData.length === 0
            ? console.log(mod.red('No hay tareas completadas...'))
            : console.log(mappedData(filteredData))
    }
    if (listCondition === taskOptions.pending) {
        const filteredData = data.filter(({ completed }) => !completed)
        console.log(mappedData(filteredData))
    }
    app()
}
// Complete a task with the input
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
    alert(green(`La tarea ha sido completada exitosamente!`))
    app()
}
// Delete a task with the input
const deleteTask = async (data) => {
    if (data.length === 0) {
        alert(red('No hay tareas para borrar... agrega una!'))
        return app()
    }
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
    const confirm = await Confirm.prompt({
        message: 'Estas seguro que quieres borrar la tarea?',
        default: false
    })
    if (!confirm) {
        alert(red('La tarea no ha sido borrada!'))
        return app()
    }
    const updatedData = data.filter(task => task.id !== deleteCondition)
    updateDB(updatedData)
    alert(green(`La tarea ha sido borrada exitosamente!`))
    app()
}
export { createTask, listTask, completeTask, deleteTask }