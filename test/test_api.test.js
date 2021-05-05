const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Note = require('../models/note');

const api = supertest(app);

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
];

beforeEach(async() => {
  await Note.deleteMany({});
  initialNotes.forEach(async(note) => {
    const noteObj = await new Note(note);
    noteObj.save();
  });
});


test('notes are returned as json', async () => {
  await api.get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two notes', async () => {
  const response = await api.get('/api/notes');
  expect(response.body).toHaveLength(initialNotes.length);
});

test('the first note is about HTML', async () => {
  const response = await api.get('/api/notes');
  expect(response.body[0].content).toContain('HTML is easy');
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');
  const contents = response.body.map(r => r.content);
  expect(contents).toContain(
    'Browser can execute only Javascript'
  );
});

afterAll(() => {
  mongoose.connection.close();
});