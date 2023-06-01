// Todo app with deno
import { Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts"
import { createTask, completeTask, deleteTask, listTask } from "./modules/controller.js"
import { actions } from './modules/consts.js'
export const app = async () => {
    const DATA = await JSON.parse(Deno.readTextFileSync('./database/data.json'))
    // initial prompt repeats until user exits
    const initialOption = await Select.prompt({
        message: 'Que haremos hoy?',
        options: [
            { name: 'Crear tarea', value: actions.create },
            { name: 'Listar tareas', value: actions.list },
            { name: 'Completar tarea(s)', value: actions.complete },
            { name: 'Borrar tarea', value: actions.delete },
            { name: 'Salir', value: actions.exit },
        ]
    })

    /// Switch case
    switch (initialOption) {
        case actions.create:
            createTask(DATA)
            break
        case actions.list:
            listTask(DATA)
            break
        case actions.complete:
            completeTask(DATA)
            break
        case actions.delete:
            deleteTask(DATA)
            break
        case actions.exit:
            Deno.exit(0)
            break
        default:
            Deno.exit(0)
    }
}
app()