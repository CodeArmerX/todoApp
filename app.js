// Todo app with deno
import { Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";
import { createTask, completeTask, deleteTask, listTask } from "./modules/controller.js";
export const app = async () => {
    const DATA = await JSON.parse(Deno.readTextFileSync('./database/data.json'))
    // initial prompt repeats until user exits
    const initialOption = await Select.prompt({
        message: 'Que haremos hoy?',
        options: [
            { name: 'Crear tarea', value: 'create' },
            { name: 'Listar tareas', value: 'list' },
            { name: 'Completar tarea(s)', value: 'complete' },
            { name: 'Borrar tarea', value: 'delete' },
            { name: 'Salir', value: 'exit' },
        ]
    })

    /// Switch case
    switch (initialOption) {
        case 'create':
            createTask(DATA)
            break
        case 'list':
            listTask(DATA)
            break
        case 'complete':
            completeTask(DATA)
            break
        case 'delete':
            deleteTask(DATA)
            break
        case 'exit':
            Deno.exit(0)
            break
        default:
            Deno.exit(0)
    }
}
app()