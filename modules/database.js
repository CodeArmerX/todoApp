export const updateDB = (data) => {
    Deno.writeTextFileSync('./database/data.json', JSON.stringify(data))
}