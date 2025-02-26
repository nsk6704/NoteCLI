import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import {newNote, getAllNotes, findNotes, removeNote, removeAllNotes} from '../note.js'

const listNotes = (notes) => {
  notes.forEach(note => {
    console.log('\n')
    console.log('id: ', note.id)
    console.log('tags: ', note.tags.join(', ')),
    console.log('note: ', note.content)
  })
}

yargs(hideBin(process.argv))
  .scriptName('note')
  .command('new <note>', 'create a new note', yargs => {
    return yargs.positional('note', {
      describe: 'The content of the note you want to create',
      type: 'string'
    })
  }, async (argv) => {
    const tags = argv.tags ? argv.tags.split(',') : []
    const note = await newNote(argv.note, tags)
    console.log('Note added!', note.id)
  })
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'tags to add to the note'
  })
  .command('all', 'get all notes', () => {}, async (argv) => {
    const notes = await getAllNotes()
    listNotes(notes)
  })
  .command('find <filter>', 'get matching notes', yargs => {
    return yargs.positional('filter', {
      describe: 'The search term to filter notes by, will be applied to note.content',
      type: 'string'
    })
  }, async (argv) => {
    const notes = await findNotes(argv.filter)
    listNotes(notes)
  })
  .command('remove <id>', 'remove a note by id', yargs => {
    return yargs.positional('id', {
      type: 'number',
      description: 'The id of the note you want to remove'
    })
  }, async (argv) => {
    const id = await removeNote(argv.id)
    if (id) {
      console.log('Note removed: ', id)
    } else {
      console.log('Note not found')
    }
  })
  .command('clean', 'remove all notes', () => {}, async (argv) => {
    await removeAllNotes()
    console.log('All notes removed')
  })
  .command('findByTag <tags>', 'find notes by tags', yargs => {
    return yargs.positional('tags', {
      describe: 'Comma-separated list of tags to filter notes by',
      type: 'string'
    })
  }, async (argv) => {
    const tags = argv.tags.split(',').map(tag => tag.trim().toLowerCase())
    const notes = await getAllNotes()
    const filteredNotes = notes.filter(note => 
      note.tags.some(tag => tags.includes(tag.toLowerCase()))
    )
    listNotes(filteredNotes)
  })
  .demandCommand(1)
  .parse()