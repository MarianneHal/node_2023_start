const fs = require('node:fs/promises');
const path = require('node:path');



const worker = async () => {

    try{
        const fileNames = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'];
        const folderNames = ['folder1', 'folder2', 'folder3', 'folder4'];

        for (const folderName of folderNames) {
            await fs.mkdir(path.join(process.cwd(), folderName), {recursive: true})
        }

        for (const fileName of fileNames) {
            await fs.writeFile(path.join(process.cwd(), fileName), 'Hello!');
        }

        const files = await fs.readdir(path.join(process.cwd()));

        for (const file of files) {
            const stats = await fs.stat(path.join(process.cwd(), file))
            const isFile = stats.isFile();
            if (isFile) {
                console.log('This is file', path.join(process.cwd(), file))
            } else {
                console.log('This is not file', path.join(process.cwd(), file))
            }
        }

    }catch (e) {
        console.log(e.message)
    }

}



worker().then()